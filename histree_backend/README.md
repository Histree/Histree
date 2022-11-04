## Running Tests
To execute all the tests, move to the `/data_retrieval` directory and run `python3 -m unittest discover tests/`.

## CLI for Query to JSON Tree
For a CLI demo of generating the JSON family tree of a person, run `python3 -m data_retrieval.main`.

## Expose API Locally
To have a working exposed API locally, run `FLASK_APP=histree python3 -m flask run`.