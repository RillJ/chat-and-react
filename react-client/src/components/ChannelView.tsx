import { useState, useEffect, useCallback } from "react";
import { Channel } from "../types/Channel";
import { Message } from "../types/Message";
import { API } from "../services/API";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";

interface ChannelViewProps {
  channel: Channel;
}

function ChannelView({ channel }: ChannelViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    try {
      const data = await API.getMessages(channel);
      setMessages(data);
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    }
  }, [channel]);

  useEffect(() => {
    setLoading(true);
    loadMessages().finally(() => setLoading(false));
    const interval = setInterval(loadMessages, 60000);
    return () => clearInterval(interval);
  }, [channel, loadMessages]);

  const handleSendMessage = async (content: string, sender: string) => {
    try {
      await API.sendMessage(channel, content, sender);
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  if (loading) return <div className="text-center">Loading messages...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="channel-view">
      <h2>{channel.name}</h2>
      <MessageList messages={messages} />
      <MessageForm onSubmit={handleSendMessage} />
    </div>
  );
}

export default ChannelView;
