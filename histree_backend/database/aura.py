from neo4j import GraphDatabase
import logging
from neo4j.exceptions import ServiceUnavailable

class AuraConnection:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def create_parenthood(self, child_id, parent_id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(
                self._create_and_return_parenthood, child_id, parent_id
            )
            for row in result:
                print("Created child-parent relationship between {c}, {p}".format(c=row['c'], p=row['p']))


    @staticmethod
    def _create_and_return_parenthood(tx, child_id, parent_id):
        query = (
            "CREATE (c:Person { id: $child_id }) "
            "CREATE (p:Person { id: $parent_id }) "
            "CREATE (c)-[:CHILD_OF]->(p) "
            "RETURN p, c"
        )
        result = tx.run(query, child_id = child_id, parent_id = parent_id)
        try:
            return [{"c": row["c"]["id"], "p": row["p"]["id"]}
                    for row in result]
        # Capture any errors along with the query and data for traceability
        except ServiceUnavailable as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise


    def find_person(self, person_id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._find_and_return_person, person_id)
            for row in result:
                print("Found person: {row}".format(row=row))


    @staticmethod
    def _find_and_return_person(tx, person_id):
        query = (
            "MATCH (p:Person) "
            "WHERE p.id = $person_id "
            "RETURN p.id AS id"
        )
        
        result = tx.run(query, person_id=person_id)
        return [row["id"] for row in result]


if __name__ == "__main__":
    # Aura queries use an encrypted connection using the "neo4j+s" URI scheme
    uri = "neo4j+s://362c917f.databases.neo4j.io"
    user = "neo4j"
    password = "oG9pc276Dpl-rjlIRyu3Ri0wFOK-aGDhSWnLIVFGGho"
    aura = AuraConnection(uri, user, password)
    alice_id = "Q12324"
    bob_id = "Q34244"
    # aura.create_parenthood(alice_id, bob_id)
    aura.find_person(alice_id)
    aura.close()