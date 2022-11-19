# Use for backend data processing
# Mostly scheduler capabilities such 
# as analyzing excel spreadsheets.

# Use cloud functions for clean 
# database management.


from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return '<h1>Hello World</h1>'