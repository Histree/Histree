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
    names = make_connection.find_person("Q937")
    assert names[0] == "Albert Einstein"


def test_find_parents(make_connection):
    parents = make_connection.find_parents("Q937")
    assert "Q88665" in parents # Hermann Einstein is the father



