from neo4j import GraphDatabase
import logging
import json
from neo4j.exceptions import ServiceUnavailable

class App:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    @staticmethod
    def create_app():
        uri = "neo4j+ssc://c39e82cb.databases.neo4j.io"
        # zaki uri = "neo4j+s://362c917f.databases.neo4j.io"
        user = "neo4j"
        password = "oG3jAqk-AjI2JIvtdUZe-E04bI8v3olKMtKSaOsyrCU"
        # zaki password = "oG9pc276Dpl-rjlIRyu3Ri0wFOK-aGDhSWnLIVFGGho"
        app = App(uri, user, password)
        return app


    # Create a parent relationship between person 1 and person 2
    def create_parenthood(self, person1_name, person2_name):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(
                self._create_and_return_parenthood, person1_name, person2_name)
            for row in result:
                print("Created parenthood between: {p1}, {p2}".format(p1=row['p1'], p2=row['p2']))



    # Return a list of all
    def find_person(self, person_id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._find_and_return_person, person_id)
            return result


    # Return a list of all the names of People in the database with this ID
    @staticmethod
    def _find_and_return_person(tx, person_id):
        query = (
            "MATCH (p:Person) "
            "WHERE p.id = $person_id "
            "RETURN p.name AS name"
        )
        matches = tx.run(query, person_id=person_id)
        return [person["name"] for person in matches]



    def merge_people(self, data):
        with self.driver.session(database="neo4j") as session:
            # Write transactions allow the driver to handle retries and transient errors
            result = session.execute_write(
                self._merge_people, data)
            for row in result:
                print("Updated person: {row}".format(row=row))


    @staticmethod
    def _merge_people(tx, data):
        query = (
            "WITH $data AS document "
            "UNWIND document.flowers AS p "
            "UNWIND p.petals AS pt "
            "MERGE (ps:Person { id: p.id }) "
            "ON MATCH SET ps.name = p.name, \
                ps.birth_name = pt['birth name'], \
                ps.date_of_birth = pt['date of birth'], ps.date_of_death = pt['date of death'], \
                ps.sex = pt['sex/gender'] "
            "RETURN ps.name AS name, ps.date_of_birth AS bd"
        )
        result = tx.run(query, data=data)
        return [row["bd"] for row in result]  

    def merge_realtion(self, data):
        with self.driver.session(database="neo4j") as session:
            # Write transactions allow the driver to handle retries and transient errors
            result = session.execute_write(
                self._merge_relation, data)
            for row in result:
                print(row)
                # print("Created parenthood between: {p1}, {p2}".format(p1=row[0], p2=row[1]))

    @staticmethod
    def _merge_relation(tx, data):
        query = (
            "WITH $data AS document "
            "UNWIND document.branches AS b "
            "UNWIND keys(b) AS p "
            "UNWIND b[p] AS c "
            "MATCH (parent:Person {id: p}), \
                   (child:Person {id: c}) "
            "MERGE (parent)-[r:PARENT_OF]->(child) "
            "RETURN parent.name, type(r), child.name"
        )
        result = tx.run(query, data=data)
        return {row["parent.name"]: row["child.name"]  for row in result}

if __name__ == "__main__":
    # Aura queries use an encrypted connection using the "neo4j+s" URI scheme
    uri = "neo4j+ssc://c39e82cb.databases.neo4j.io"
    # zaki uri = "neo4j+s://362c917f.databases.neo4j.io"
    user = "neo4j"
    password = "oG3jAqk-AjI2JIvtdUZe-E04bI8v3olKMtKSaOsyrCU"
    # zaki password = "oG9pc276Dpl-rjlIRyu3Ri0wFOK-aGDhSWnLIVFGGho"
    app = App(uri, user, password)
    with open("db_test.json") as f:
        data = json.load(f)
    # app.merge_people(data)
    app.merge_realtion(data)
    # app.find_person("Alice")
    app.close()