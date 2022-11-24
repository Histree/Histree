from neo4j import GraphDatabase

class Neo4jDB: 
    URI = "neo4j+ssc://c39e82cb.databases.neo4j.io"
    USER = "neo4j"
    PASSWORD = "oG3jAqk-AjI2JIvtdUZe-E04bI8v3olKMtKSaOsyrCU"
    _instance = None

    def __init__(self) -> None:
        self.driver = GraphDatabase.driver(self.URI, auth=(self.USER, self.PASSWORD))

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def close(self):
        self.driver.close()
        _instance = None

    def read_db(self, cypher_runner, *args):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(
                cypher_runner, *args
            )
            return result

    def write_db(self, cypher_runner, *args):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(
                cypher_runner, *args
            )
            return result