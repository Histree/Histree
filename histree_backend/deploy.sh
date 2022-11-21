# The list of commands needed to deploy
python3 -m venv venv
. venv/bin/activate
python3 -m pip install -r requirements.txt
FLASK_APP=histree python3 -m flask run