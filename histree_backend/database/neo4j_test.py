import pytest
from .relationship_calculator import RelationshipCalculator
from .cypher_runner import common_ancestor
from .neo4j_db import Neo4jDB


@pytest.fixture(scope='session', autouse=True)
def db_connection():
    '''Returns an instance of the app to be tested with'''
    db = Neo4jDB.instance()
    yield db
    db.close()



def test_find_common_ancestor(db_connection):
    # Common ancestor of Charles and Anne is Philip or Elizabeth 
    common_ancestor_id = db_connection.read_db(common_ancestor, "Q43274", "Q151754")[0][0]
    assert common_ancestor_id == "Q80976" or common_ancestor_id == "Q9682"

    # Common ancestor of Phillipa of Lancaster and Isabella of Portuga is the former
    common_ancestor_id = db_connection.read_db(common_ancestor, "Q236911", "Q466268")[0][0]
    assert common_ancestor_id == "Q236911"



def test_relationship_table():
    table = RelationshipCalculator.relationship_table()
    assert table[2][0]["male"] == "grandson"
    assert table[1][1]["female"] == "sister"
    assert table[3][0]["female"] == "great granddaughter"
    assert table[4][4]["default"] == "third cousin"
    assert table[0][5]["male"] == "great great great grandfather"
    assert table[4][0]["female"] == "great great granddaughter"
    assert table[1][1]["default"] == "sibling"
    assert table[5][0]["default"] == "great great great grandchild"
    



def test_relationship_calculator(db_connection):
    # Charles is the brother of Anne
    relationship = RelationshipCalculator.calculate_relationship(db_connection, "Q43274", "Q151754")
    assert relationship == "brother"

    # Elizabeth is the grandmother of Charles
    relationship = RelationshipCalculator.calculate_relationship(db_connection, "Q10633", "Q43274")
    assert relationship == "grandmother"

    # Lilibet Mountbatten-Windsor is the cousin of George of Wales 
    relationship = RelationshipCalculator.calculate_relationship(db_connection, "Q107125551", "Q13590412")
    assert relationship == "first cousin"

    # Anne is the aunt of Beatrice
    relationship = RelationshipCalculator.calculate_relationship(db_connection, "Q151754", "Q165657")
    assert relationship == "aunt"


