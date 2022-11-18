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



    # Return the name of the person with this ID
    def find_person(self, person_id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._find_and_return_person, person_id)
            return result[0]


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



    # Return all the IDs of the parents of this person
    def find_parents(self, person_id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._find_and_return_parents, person_id)
            return result


    @staticmethod
    def _find_and_return_parents(tx, person_id):
        query = (
            "MATCH (parent:Person)-[:PARENT_OF]->(:Person {id: \'" + person_id + "\'}) "
            "RETURN parent.id AS id "
        )
        matches = tx.run(query, person_id=person_id)
        return [match["id"] for match in matches]


    # Return the ID of the common ancestor of two people, represented by their ID
    def common_ancestor(self, person_id1, person_id2):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._common_ancestor, person_id1, person_id2)
            return result
    

    @staticmethod
    def _common_ancestor(tx, person_id1, person_id2):
        query = (
            "MATCH path = (p1:Person)<-[:PARENT_OF*0..10]-(a:Person)-[PARENT_OF*0..10]->(p2:Person) "
            f"WHERE p1.id=\'{person_id1}\' AND p2.id=\'{person_id2}\' "
            "RETURN a.id AS id "
            "ORDER BY length(path) "
            "LIMIT 1"
        )
        ancestors = tx.run(query, person_id1=person_id1, person_id2=person_id2)
        return [match["id"] for match in ancestors][0]


    def shortest_path(self, person_id1, person_id2):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._shortest_path, person_id1, person_id2)
            return result


    @staticmethod
    def _shortest_path(tx, person_id1, person_id2):
        query = (
            "MATCH (p1:Person {id: \'" + person_id1 + "\'}), "
            "(p2:Person {id: \'" + person_id2 + "\'}), "
            "p = shortestPath((p1)-[*]-(p2)) "
            "WHERE length(p) > 1 "
            "RETURN nodes(p)"
        )

        path = tx.run(query, person_id1=person_id1, person_id2=person_id2)
        return [node["id"] for node in path]


    def shortest_path_length(self, person_id1, person_id2):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._shortest_path_length, person_id1, person_id2)
            return result


    @staticmethod
    def _shortest_path_length(tx, person_id1, person_id2):
        query = (
            "MATCH (p1:Person {id: \'" + person_id1 + "\'}), "
            "(p2:Person {id: \'" + person_id2 + "\'}), "
            "p = shortestPath((p1)-[*]-(p2)) "
            "RETURN length(p)"
        )

        lengths = tx.run(query, person_id1=person_id1, person_id2=person_id2)["length"]
        return lengths[0]
        



    
    def relationship_calculator(self, person_id1, person_id2):
        '''Works out the relationship where person1 is the _ of person2'''
        
        with self.driver.session(database="neo4j") as session:
            gender = session.execute_read(self._return_gender, person_id1)
            ca_id = session.execute_read(self._common_ancestor, person_id1, person_id2)
            distance1, distance2 = session.execute_read(self._distances_to_ca, ca_id, person_id1, person_id2)
            table = self.relationship_table()
            return table[distance1][distance2][gender]


    @staticmethod
    def relationship_table():
        table = [[{} for i in range(5)] for j in range(5)]

        # index 1 is person 1's distance from ca, index 2 is person 2's distance from ca
        # index 3 is person 1's sex
        table[0][1]["male"] = "father"
        table[0][1]["female"] = "mother"
        table[1][0]["male"] = "son"
        table[1][0]["female"] = "daughter"

        table[0][2]["male"] = "grandfather"
        table[0][2]["female"] = "grandmother"
        table[2][0]["male"] = "grandson"
        table[2][0]["female"] = "granddaughter"

        table[1][1]["male"] = "brother"
        table[1][1]["female"] = "sister"

        table[1][2]["male"] = "uncle"
        table[1][2]["female"] = "aunt"
        table[2][1]["male"] = "nephew"
        table[2][1]["female"] = "niece"

        table[2][2]["male"] = "cousin"
        table[2][2]["female"] = "cousin"
        
        return table

    
    @staticmethod
    def _distances_to_ca(tx, ca_id, person_id1, person_id2):
        distance1, distance2 = 0, 0
        
        if ca_id != person_id1:
            distance1 = App._shortest_distance_between(tx=tx, person_id1=person_id1, person_id2=ca_id)
        
        if ca_id != person_id2:
            distance2 = App._shortest_distance_between(tx=tx, person_id1=person_id2, person_id2=ca_id)

        return distance1, distance2
    
    
    @staticmethod
    def _shortest_distance_between(tx, person_id1, person_id2):
        query2 = (
            "MATCH (p1:Person {id: \'" + person_id1 + "\'}), "
            "(p2:Person {id: \'" + person_id2 + "\'}), "
            "path = shortestPath((p1)-[*]-(p2)) "
            "RETURN length(path) AS length"
        )
        distances = tx.run(query2, person_id1=person_id1, person_id2=person_id2)
        return [distance["length"] for distance in distances][0]
        



    @staticmethod
    def _return_gender(tx, person_id):
        query = (
            "MATCH (p:Person) "
            "WHERE p.id = $person_id "
            "RETURN p.gender AS gender"
        )
        matches = tx.run(query, person_id=person_id)
        return [person["gender"] for person in matches][0]
    

        

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