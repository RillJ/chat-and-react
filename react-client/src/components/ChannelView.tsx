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

  useEffect(() => {
    setLoading(true);
    loadMessages().finally(() => setLoading(false));
    const interval = setInterval(loadMessages, 60000);
    return () => clearInterval(interval);
  }, [channel, loadMessages]);

  const handleSendMessage = async (content: string) => {
    try {
      await API.sendMessage(channel, content, username);
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  return (
    <div className="channel-view">
      <h2>{channel.name}</h2>
      {loading && (
        <div className="alert alert-info">
          Fetching messages...
          <div className="spinner-border spinner-border-sm ms-2" role="status">
            <span className="visually-hidden">Fetching...</span>
          </div>
        </div>
      )}
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
