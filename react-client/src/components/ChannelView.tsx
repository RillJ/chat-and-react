// Copyright 2025 Julian Calvin Rill

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useState, useEffect, useCallback } from "react";
import { Channel } from "../types/Channel";
import { Message } from "../types/Message";
import { API } from "../services/API";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";

interface ChannelViewProps {
  channel: Channel;
  username: string;
  onUsernameChange: (username: string) => void;
}

function ChannelView({
  channel,
  username,
  onUsernameChange,
}: ChannelViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  // Function to fetch messages from the API
  const loadMessages = useCallback(async () => {
    console.log("Starting to load messages..");
    try {
      const data = await API.getMessages(channel);
      console.log("Successfully loaded messages:", data);
      setMessages(data);
      setError(undefined);
    } catch (err) {
      console.error("Error in loadMessages:", err);
      setError(err instanceof Error ? err.message : "Failed to load messages");
    }
  }, [channel]);

  // Effect to load channels initially and refresh every minute
  useEffect(() => {
    setLoading(true);
    loadMessages().finally(() => setLoading(false));
    const interval = setInterval(loadMessages, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [channel, loadMessages]);

  // Handle sending new messages
  const handleSendMessage = async (content: string) => {
    try {
      await API.sendMessage(channel, content, username);
      // Reload messages after sending to show the new message
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  return (
    <div className="channel-view">
      <h2>{channel.name}</h2>
      {/* Show loading spinner while fetching messages */}
      {loading && (
        <div className="alert alert-info">
          Fetching messages...
          <div className="spinner-border spinner-border-sm ms-2" role="status">
            <span className="visually-hidden">Fetching...</span>
          </div>
        </div>
      )}
      {/* Show error message if there's an error, otherwise show messages and form */}
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <MessageList messages={messages} />
          <MessageForm
            onSubmit={handleSendMessage}
            username={username}
            onUsernameChange={onUsernameChange}
            onFetch={loadMessages}
          />
        </>
      )}
    </div>
  );
}

export default ChannelView;
