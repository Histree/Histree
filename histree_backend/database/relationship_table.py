class RelationshipTable:

    @staticmethod
    def relationship_table():
        dimension = 8
        table = [[{} for i in range(dimension)] for j in range(dimension)]

        # index 1 is person 1's distance from ca, index 2 is person 2's distance from ca
        # index 3 is person 1's sex
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

        table[2][2]["male"] = "first cousin"
        table[2][2]["female"] = "first cousin"

        table[3][3]["male"] = "second cousin"
        table[3][3]["female"] = "second cousin"

        table[4][4]["male"] = "third cousin"
        table[4][4]["female"] = "third cousin"

        RelationshipTable.iterate_great_up(table, "grandfather", "grandmother", 0, 2, 8)
        RelationshipTable.iterate_great_down(table, "grandson", "granddaughter", 0, 2, 8)

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