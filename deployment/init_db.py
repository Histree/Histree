from shelve import DbfilenameShelf
import psycopg2
from histree import app


# Open a cursor to perform database operations
def connection_cursor():
        conn = psycopg2.connect(
                host=app.config['DB_HOSTNAME'],
                database=app.config['DB_CLUSTERNAME'],
                user=app.config['DB_USERNAME'],
                password=app.config['DB_PASSWORD'])


        return conn.cursor()

# Perform an operation and update the database
def operation(cursor, command):
        cursor.execute(command)
        cursor.commit()

def close_connection(cursor):
        cursor.close()
