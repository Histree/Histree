import pytest
from relationship_calculator import RelationshipCalculator
from cypher_runner import common_ancestor
from neo4j_db import Neo4jDB


@pytest.fixture
def db_connection():
    '''Returns an instance of the app to be tested with'''
    return Neo4jDB.instance()



def test_find_common_ancestor(db_connection):
    # Common ancestor of Charles and Anne is Philip
    common_ancestor_id = db_connection.read_db(common_ancestor, "Q43274", "Q151754")[0][0]
    assert common_ancestor_id == "Q80976"

    # Common ancestor of Phillipa of Lancaster and Isabella of Portuga is the former
    common_ancestor_id = db_connection.read_db(common_ancestor, "Q236911", "Q466268")[0][0]
    assert common_ancestor_id == "Q236911"



def test_relationship_table():
    table = RelationshipCalculator.relationship_table()
    assert table[2][0]["male"] == "grandson"
    assert table[1][1]["female"] == "sister"
    assert table[3][0]["female"] == "great granddaughter"
    assert table[4][4]["male"] == "third cousin"
    assert table[0][5]["male"] == "great great great grandfather"
    assert table[4][0]["female"] == "great great granddaughter"




def test_relationship_calculator(db_connection):
    # Charles is the brother of Anne
    relationship = RelationshipCalculator.calculate_relationship(db_connection, "Q43274", "Q151754")
    assert relationship == "brother"

    # Elizabeth is the grandmother of Charles
    relationship = RelationshipCalculator.calculate_relationship(db_connection, "Q10633", "Q43274")
    assert relationship == "grandmother"
