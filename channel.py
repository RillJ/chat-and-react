## channel.py - a simple message channel
##

from flask import Flask, request, render_template, jsonify
import os
import json
import requests
import datetime
from dotenv import load_dotenv

# Class-based application configuration
class ConfigClass(object):
    """ Flask application config """

    # Flask settings
    SECRET_KEY = 'This is an INSECURE secret!! DO NOT use this in production!!'

# Create Flask app
app = Flask(__name__)
app.config.from_object(__name__ + '.ConfigClass') # configuration
app.app_context().push() # create an app context before initializing db

load_dotenv()
HUB_URL = "http://localhost:5555"
HUB_AUTHKEY = "1234567890"
CHANNEL_AUTHKEY = os.getenv("CHANNEL_AUTHKEY")
CHANNEL_NAME = "The Privacy Advisory Channel"
CHANNEL_ENDPOINT = "http://localhost:5001" # don't forget to adjust in the bottom of the file
CHANNEL_FILE = "messages.json"
CHANNEL_TYPE_OF_SERVICE = "aiweb24:chat"
MAX_MESSAGES = 50 # the maximum number of messages to save and serve, note that the welcome message is excluded
WELCOME_MESSAGE = {'content': """
                    Welcome to The Privacy Advisory Channel! Feel free to discuss privacy and data protection here.
                    Interdisciplinary discussion between fields is encouraged: psychologically, ethically, technically, lawfully, etc.
                    """,
                    'sender': 'System',
                    'timestamp': datetime.datetime(2025, 1, 1, 0, 0, 0).isoformat(),
                    'extra': None}

@app.cli.command('register')
def register_command():
    global CHANNEL_AUTHKEY, CHANNEL_NAME, CHANNEL_ENDPOINT

    # send a POST request to server /channels
    response = requests.post(HUB_URL + '/channels', headers={'Authorization': 'authkey ' + HUB_AUTHKEY},
                             data=json.dumps({
                                "name": CHANNEL_NAME,
                                "endpoint": CHANNEL_ENDPOINT,
                                "authkey": CHANNEL_AUTHKEY,
                                "type_of_service": CHANNEL_TYPE_OF_SERVICE,
                             }))

    if response.status_code != 200:
        print("Error creating channel: "+str(response.status_code))
        print(response.text)
        return

def check_authorization(request):
    global CHANNEL_AUTHKEY
    # check if Authorization header is present
    if 'Authorization' not in request.headers:
        return False
    # check if authorization header is valid
    if request.headers['Authorization'] != 'authkey ' + CHANNEL_AUTHKEY:
        return False
    return True

@app.route('/health', methods=['GET'])
def health_check():
    global CHANNEL_NAME
    if not check_authorization(request):
        return "Invalid authorization", 400
    return jsonify({'name':CHANNEL_NAME}),  200

# GET: Return list of messages
@app.route('/', methods=['GET'])
def home_page():
    if not check_authorization(request):
        return "Invalid authorization", 400
    # fetch channels from server
    return jsonify(read_messages())

# POST: Send a message
@app.route('/', methods=['POST'])
def send_message():
    # fetch channels from server
    # check authorization header
    if not check_authorization(request):
        return "Invalid authorization", 400
    # check if message is present
    message = request.json
    if not message:
        return "No message", 400
    if not 'content' in message:
        return "No content", 400
    if not 'sender' in message:
        return "No sender", 400
    if not 'timestamp' in message:
        return "No timestamp", 400
    if not 'extra' in message:
        extra = None
    else:
        extra = message['extra']
    # add message to messages
    messages = read_messages()
    messages.append({'content': message['content'],
                     'sender': message['sender'],
                     'timestamp': message['timestamp'],
                     'extra': extra,
                     })
    if len(messages) > MAX_MESSAGES: # if message limit reached, truncate the oldest message, unless welcome message
        global WELCOME_MESSAGE
        if WELCOME_MESSAGE in messages:
            messages.remove(WELCOME_MESSAGE)
        messages = messages[-MAX_MESSAGES:]
        if WELCOME_MESSAGE not in messages:
            messages.insert(0, WELCOME_MESSAGE)
    save_messages(messages)
    return "OK", 200

def read_messages():
    global CHANNEL_FILE
    global WELCOME_MESSAGE
    try:
        f = open(CHANNEL_FILE, 'r')
    except FileNotFoundError:
        return [WELCOME_MESSAGE]
    try:
        messages = json.load(f)
    except json.decoder.JSONDecodeError:
        messages = [WELCOME_MESSAGE]
    f.close()
    return messages

def save_messages(messages):
    global CHANNEL_FILE
    with open(CHANNEL_FILE, 'w') as f:
        json.dump(messages, f)

# Start development web server
# run flask --app channel.py register
# to register channel with hub

if __name__ == '__main__':
    app.run(port=5001, debug=True)
