# Privacy Advisory Chat System

A distributed chat system with an AI-powered Privacy Advisor bot that provides contextual privacy guidance based on conversation topics.

## Overview

This system consists of three main components:

- **Hub Server**: Central registry for chat channels
- **Privacy Advisory Channel**: Specialized chat channel with privacy-focused bot
- **Web Client**: Interface for users to access channels and participate in discussions

The Privacy Advisor bot monitors conversations and provides relevant privacy advice based on detected keywords in areas like:
- Data protection regulations
- Privacy concepts and principles  
- Security risks and threats
- Privacy best practices
- Privacy-enhancing tools

## Features

- Distributed chat system architecture
- Privacy-focused chat channel
- Context-aware privacy advisor bot
- Profanity filtering
- Message history management
- Cross-channel authorization
- Health monitoring for channels

## Technical Details

- Built with Flask and SQLAlchemy
- SQLite database for channel registry
- JSON-based message storage
- RESTful API communication between components
- Template-based web interface
- Environment-based configuration

## Project Structure

```
├── channel.py               # Privacy Advisory Channel implementation
├── client.py                # Web client interface
├── hub.py                   # Central channel registry server
├── data/                    # Channel data and bot knowledge
│   ├── messages.json        # Channel message history
│   ├── responses.json       # Bot response templates
│   ├── sample_messages.json # Example conversations
│   └── triggers.json        # Bot trigger keywords
├── templates/               # HTML templates
│   ├── channel.html         # Channel view
│   └── home.html            # Channel list view
└── requirements.txt         # Python dependencies
```

## Setup

### 1. Install dependencies:

```sh
pip install -r requirements.txt
```

### 2. Set up environment variables

Create a file called `.env` in the root directory of the project and enter the appropiate keys for the components.

- The `HUB_AUTHKEY` is `1234567890` by default, but could be changed in `hub.py`.
- The other keys can be randomly generated and up to 32 characters.

```sh
HUB_AUTHKEY="1234567890"
CHANNEL_AUTHKEY="your_channel_key" 
FLASK_SECRET_KEY="your_secret_key"
```

### 3. Start the hub server
```sh
python hub.py
```

### 4. Register the Privacy Advisory Channel
The channel must be registerd to the hub server in order for it to show as a possible channel users can converse in.

```sh
flask --app channel.py register
```

### 5. Start the Privacy Advisory Channel
```sh
python channel.py
```

### 6. Start the web client
```sh
python client.py
```

## Usage

1. Access the web client at `http://localhost:5005`
2. View available channels
3. Join the Privacy Advisory Channel to discuss privacy topics
4. The Privacy Advisor bot will automatically provide relevant advice based on conversation themes

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.