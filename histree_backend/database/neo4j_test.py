from neo4j import GraphDatabase
import logging
import json
from neo4j.exceptions import ServiceUnavailable
import pytest
from test_db import App


@pytest.fixture
def make_connection():
    '''Returns an instance of the app to be tested with'''
    return App.create_app()


def test_find_person(make_connection):
    names = make_connection.find_person("Q937")
    assert names[0] == "Albert Einstein"


