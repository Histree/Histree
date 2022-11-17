from neo4j import GraphDatabase

class Neo4jDB: 
    URI = "neo4j+ssc://c39e82cb.databases.neo4j.io"
    USER = "neo4j"
    PASSWORD = "oG3jAqk-AjI2JIvtdUZe-E04bI8v3olKMtKSaOsyrCU"
    instance = None

    def __init__(self) -> None:
        self.driver = GraphDatabase.driver(self.URI, auth=(self.USER, self.PASSWORD))

    @classmethod
    def instance(self) -> 'Neo4jDB':
        if not Neo4jDB.instance:
            Neo4jDB.instance = Neo4jDB()
        return Neo4jDB.instance
    
    def close(self):
        self.driver.close()

    def read_db(self, cypher_runner, *args):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(
                cypher_runner, *args
            )
            return result