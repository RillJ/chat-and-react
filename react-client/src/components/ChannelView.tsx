import { useState, useEffect } from "react";
import { Channel } from "../types/Channel";
import { Message } from "../types/Message";
import { API } from "../services/API";
import MessageList from "./MessageList";

interface ChannelViewProps {
  channel: Channel;
}

function ChannelView({ channel }: ChannelViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await API.getMessages(channel);
        setMessages(data);
        setError(undefined);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load messages"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 60000);
    return () => clearInterval(interval);
  }, [channel]);

  if (loading) return <div className="text-center">Loading messages...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="channel-view">
      <h2>{channel.name}</h2>
      <MessageList messages={messages} />
    </div>
  );
}

export default ChannelView;
