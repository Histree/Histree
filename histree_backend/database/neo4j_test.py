from neo4j import GraphDatabase
import logging
import json
from neo4j.exceptions import ServiceUnavailable
import pytest
from people_db import App


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


def test_relationship_table(make_connection):
    table = make_connection.relationship_table()
    assert table[2][0]["male"] == "grandson"
    assert table[1][1]["female"] == "sister"


def test_relationship_calculator(make_connection):
    # Charles is the brother of Anne
    relationship = make_connection.relationship_calculator("Q43274", "Q151754")
    assert relationship == "brother"

    # Elizabeth is the grandmother of Charles
    relationship = make_connection.relationship_calculator("Q10633", "Q43274")
    assert relationship == "grandmother"





# def test_find_shortest_path(make_connection):
#     # Shortest path between Eduard Einstein and Hermann Einstein goes through Albert Einstein
#     shortest_path = make_connection.shortest_path("Q118253", "Q432375")
#     assert "Q937" in shortest_path
# 
# 
# # def test_shortest_path_length(make_connection):
#     # The shortest path between George IV and Charles III is of length 2
#     length = make_connection.shortest_path_length("Q280856", "Q43274")
#     assert length == 2