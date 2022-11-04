from flask import Flask, render_template
from flask_cors import cross_origin
from typing import Dict

from histree_query import HistreeQuery

app = Flask(__name__)


@app.route('/')
@cross_origin()
def greet():
    return render_template('intro.html')


# Pass in a name and return a dictionary of potential matches names to Wiki IDs
@app.route('/find_matches/<name>')
@cross_origin()
def find_matches(name: str):
    matches: Dict[str, str] = HistreeQuery.search_matching_names(name)
    return matches


# Pass in a Wiki ID and return a json of all their relevant data
@app.route('/person_info/<qid>')
@cross_origin()
def person_info(qid):
    tree_json: Dict[str, any] = HistreeQuery.get_tree_from_id(qid)
    return tree_json
