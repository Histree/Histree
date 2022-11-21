from neo4j import GraphDatabase
import logging
import json
from neo4j.exceptions import ServiceUnavailable
import pytest
from people_db import App
from relationship_table import RelationshipTable


@pytest.fixture
def make_connection():
    '''Returns an instance of the app to be tested with'''
    return App.create_app()


def test_find_person(make_connection):
    name = make_connection.find_person("Q937")
    assert name == "Albert Einstein"


def test_find_parents(make_connection):
    parents = make_connection.find_parents("Q937")
    assert "Q88665" in parents # Hermann Einstein is the father of Albert Einstein


def test_find_common_ancestor(make_connection):
    # Common ancestor of Charles and Anne is Philip
    common_ancestor_id = make_connection.common_ancestor("Q43274", "Q151754")
    assert common_ancestor_id == "Q80976"

    # Common ancestor of Albert and Eduard Einstein is Albert Einstein
    common_ancestor_id = make_connection.common_ancestor("Q937", "Q118253")
    assert common_ancestor_id == "Q937"



def test_relationship_table():
    table = RelationshipTable.relationship_table()
    assert table[2][0]["male"] == "grandson"
    assert table[1][1]["female"] == "sister"
    assert table[3][0]["female"] == "great granddaughter"
    assert table[4][4]["male"] == "third cousin"
    assert table[0][5]["male"] == "great great great grandfather"
    assert table[4][0]["female"] == "great great granddaughter"



def test_relationship_calculator(make_connection):
    # Charles is the brother of Anne
    relationship = make_connection.relationship_calculator("Q43274", "Q151754")
    assert relationship == "brother"

    # Elizabeth is the grandmother of Charles
    relationship = make_connection.relationship_calculator("Q10633", "Q43274")
    assert relationship == "grandmother"
