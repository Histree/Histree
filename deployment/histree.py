from flask import Flask, render_template

app = Flask(__name__)
app.config['DB_HOSTNAME'] = 'histree-db.internal'
app.config['DB_USERNAME'] = 'postgres'
app.config['DB_PASSWORD'] = 'hLnm3cGTjIejCox'
app.config['DB_PROXY_PORT'] = 5432
app.config['DB_POSTGRES_PORT'] = 5433
app.config['DB_CREDENTIALS_LINK'] = 'postgres://postgres:hLnm3cGTjIejCox@histree-db.internal:5432'

@app.route('/')
@app.route('/<name>')
def hello(name=None):
    return render_template('intro.html', name=name)

