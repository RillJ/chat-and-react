# Copyright 2025 Julian Calvin Rill

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

## channel.py - a simple message channel for the Privacy Advisory Hub

from flask_cors import CORS # enable the React client to access the API
from flask import Flask, request, render_template, jsonify
import os
import json
import random
import requests
import datetime
from dotenv import load_dotenv
from better_profanity import profanity

#region Flask setup
# Class-based application configuration
class ConfigClass(object):
    """ Flask application config """

    # Flask settings
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY")

# Create Flask app
app = Flask(__name__)
app.config.from_object(__name__ + '.ConfigClass') # configuration
app.app_context().push() # create an app context before initializing db
CORS(app) # enable CORS for all routes
#endregion

#region Privacy knowledge
class PrivacyAdvisor:
    """
    A class to provide privacy-related advice based on trigger words found in messages.
    """
    def __init__(self):
        # Define trigger words for different privacy categories
        with open("data/triggers.json", 'r') as f:
            self.triggers = json.load(f)
        # Define responses for each privacy category
        with open("data/responses.json", 'r') as f:
            self.responses = json.load(f)

    def should_respond(self, message):
        """
        Determine if the message content contains any trigger words.
        If multiple categories are triggered, pick a random category.
        """
        content = message['content'].lower()
        triggered_categories = []
        for category in self.triggers:
            if any(trigger in content for trigger in self.triggers[category]):
                triggered_categories.append(category)
        if triggered_categories:
            return random.choice(triggered_categories)
        return None

    def generate_response(self, category):
        """
        Generate a response based on the category of the trigger word.
        """
        return random.choice(self.responses[category])
#endregion

#region Global variables
load_dotenv()
FLASK_PORT = 5001
HUB_URL = "http://localhost:5555"
HUB_AUTHKEY = os.getenv("HUB_AUTHKEY")
CHANNEL_AUTHKEY = os.getenv("CHANNEL_AUTHKEY")
CHANNEL_NAME = "The Privacy Advisory Channel"
CHANNEL_ENDPOINT = f"http://localhost:{FLASK_PORT}"
CHANNEL_FILE = "data/messages.json"
CHANNEL_TYPE_OF_SERVICE = "aiweb24:chat"
MAX_MESSAGES = 50 # the maximum number of messages to save and serve, note that the welcome message is excluded
PRIVACY_ADVISOR = PrivacyAdvisor()
WELCOME_MESSAGE = {'content': "Welcome to The Privacy Advisory Channel! Feel free to discuss anything related to privacy and data protection here. " +
                    "Interdisciplinary discussion between fields is encouraged: psychologically, ethically, technically, lawfully, etc. " +
                    "The channel is equipped with a Privacy Advisor bot, which will give general advice based on the theme of the discussion. " +
                    "The number of messages is limited to 50. Older messages will be removed if this limit is reached. " +
                    "Please keep the conversations respectful and refrain from using profanity. Enjoy your stay! ",
                    'sender': 'System',
                    'timestamp': datetime.datetime(2025, 1, 1, 0, 0, 0).isoformat(),
                    'extra': {'message_type': 'system'}  }
#endregion

#region Flask CLI
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
#endregion

#region Authorization
def check_authorization(request):
    global CHANNEL_AUTHKEY
    # check if Authorization header is present
    if 'Authorization' not in request.headers:
        return False
    # check if authorization header is valid
    if request.headers['Authorization'] != 'authkey ' + CHANNEL_AUTHKEY:
        return False
    return True
#endregion

#region Routes
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
    global PRIVACY_ADVISOR
    # fetch channels from server
    # check authorization header
    if not check_authorization(request):
        return "Invalid authorization", 400
    # check if message is present and content is not empty
    message = request.json
    if not message:
        return "No message", 400
    if not 'content' in message:
        return "No content", 400
    if not message['content']:
        return "Message content is empty", 400
    if not 'sender' in message:
        return "No sender", 400
    if not message['sender']:
        return "Message sender is empty", 400
    if not 'timestamp' in message:
        return "No timestamp", 400
    if not 'extra' in message:
        extra = None
    else:
        extra = message['extra']
    # filter for profanity
    if profanity.contains_profanity(message['content']):
        return "Profanity detected in message content", 400
    if profanity.contains_profanity(message['sender']):
        return "Profanity detected in sender's name", 400
    # add message to messages
    messages = read_messages()
    messages.append({'content': message['content'],
                     'sender': message['sender'],
                     'timestamp': message['timestamp'],
                     'extra': extra,
                     })
    # check if advisor should respond
    category = PRIVACY_ADVISOR.should_respond(message)
    if category:
        advisor_response = {
            'content': PRIVACY_ADVISOR.generate_response(category),
            'sender': 'Bot: Privacy Advisor',
            'timestamp': datetime.datetime.now().isoformat(),
            'extra': {'message_type': 'privacy_advisor_bot', 'category': category}
        }
        messages.append(advisor_response)
    # if message limit reached, truncate the oldest message, but keep welcome message
    if len(messages) > MAX_MESSAGES:
        global WELCOME_MESSAGE
        if WELCOME_MESSAGE in messages:
            messages.remove(WELCOME_MESSAGE)
        messages = messages[-MAX_MESSAGES:]
        if WELCOME_MESSAGE not in messages:
            messages.insert(0, WELCOME_MESSAGE)
    save_messages(messages)
    return "OK", 200
#endregion

#region Messages
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
#endregion

# Start development web server
# run flask --app channel.py register
# to register channel with hub

if __name__ == '__main__':
    app.run(port=FLASK_PORT, debug=True)
