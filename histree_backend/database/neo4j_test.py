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
    assert "Q88665" in parents # Hermann Einstein is the father


def test_find_common_ancestor(make_connection):
    # Common ancestor of Julius Koch and Helen Einstein is Albert Einstein
    common_ancestor_id = make_connection.common_ancestor("Q1712755", "Q1712755")
    print(common_ancestor_id)
    assert common_ancestor_id == "Q4357787"


def test_find_shortest_path(make_connection):
    # Shortest path between Eduard Einstein and Evelyn Einstein goes through Hans Albert Einstein
    shortest_path = make_connection.shortest_path("Q118253", "Q432375")
    assert "Q123371" in shortest_path