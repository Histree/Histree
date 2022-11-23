from .cypher_runner import common_ancestor, shortest_distance, gender

class RelationshipCalculator:

    @staticmethod
    def calculate_relationship(db, id1, id2):
        common_ancestor_id = db.read_db(common_ancestor, id1, id2)[0][0]

        distance1, distance2 = 0, 0
        if common_ancestor_id != id1:
            distance1 = db.read_db(shortest_distance, id1, common_ancestor_id)[0][0]
        if common_ancestor_id != id2:
            distance2 = db.read_db(shortest_distance, id2, common_ancestor_id)[0][0]
        
        gender1 = db.read_db(gender, id1)[0][0]
        table = RelationshipCalculator.relationship_table()
        return table[distance1][distance2][gender1]


    @staticmethod
    def relationship_table():
        '''Returns a table for calculating relationships.
        Index 0 is person 1's distance from the common ancestor and Index 1 is person 2's distance.
        The dictionary has a label for both the male and female genders, indexed according to person 1'''

        dimension = 8
        table = [[{} for i in range(dimension)] for j in range(dimension)]

        table[0][1]["male"] = "father"
        table[0][1]["female"] = "mother"
        table[1][0]["male"] = "son"
        table[1][0]["female"] = "daughter"
        table[1][1]["male"] = "brother"
        table[1][1]["female"] = "sister"

        table[1][2]["male"] = "uncle"
        table[1][2]["female"] = "aunt"
        table[2][1]["male"] = "nephew"
        table[2][1]["female"] = "niece"
        table[3][1]["male"] = "great nephew"
        table[3][1]["female"] = "great niece"
        table[1][3]["male"] = "great uncle"
        table[1][3]["female"] = "great aunt"

        table[2][2]["male"] = "first cousin"
        table[2][2]["female"] = "first cousin"
        table[3][3]["male"] = "second cousin"
        table[3][3]["female"] = "second cousin"
        table[4][4]["male"] = "third cousin"
        table[4][4]["female"] = "third cousin"
        table[5][5]["male"] = "fourth cousin"
        table[5][5]["female"] = "fourth cousin"

        RelationshipCalculator.iterate_great_up(table, "grandfather", "grandmother", 0, 2, 8)
        RelationshipCalculator.iterate_great_down(table, "grandson", "granddaughter", 0, 2, 8)

        return table


    @staticmethod
    def iterate_great_up(table, male_description, female_description, column_index, start_index, end_index):
        for i in range(start_index, end_index):
            table[column_index][i]["male"] = male_description
            table[column_index][i]["female"] = female_description
            male_description = "great " + male_description
            female_description = "great " + female_description


    @staticmethod
    def iterate_great_down(table, male_description, female_description, column_index, start_index, end_index):
        for i in range(start_index, end_index):
            table[i][column_index]["male"] = male_description
            table[i][column_index]["female"] = female_description
            male_description = "great " + male_description
            female_description = "great " + female_description
            