from flask import Flask, render_template, jsonify
from typing import Dict

from histree_query import HistreeQuery

app = Flask(__name__)


@app.route('/')
def greet():
    return render_template('intro.html')


# Pass in a name and return a dictionary of potential matches names to Wiki IDs
@app.route('/find_matches/<name>')
def find_matches(name: str):
    response = jsonify(HistreeQuery.search_matching_names(name))
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# Pass in a Wiki ID and return a json of all their relevant data
@app.route('/person_info/<qid>')
def person_info(qid):
    response = jsonify(HistreeQuery.get_tree_from_id(qid))
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
