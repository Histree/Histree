# The list of commands needed to deploy
python3 -m venv venv
. venv/bin/activate
python -m pip install -r requirements.txt
FLASK_APP=histree flask run