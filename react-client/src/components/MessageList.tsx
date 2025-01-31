import { Message } from "../types/Message";
import MessageContent from "./MessageContent";

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  return (
    <div className="messages-container">
      {messages.length === 0 && <p>No messages found.</p>}
      {messages.map((message, index) => (
        <div key={index} className="card mb-2">
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">
              <b>{message.sender}</b> at{" "}
              {new Date(message.timestamp).toLocaleString()}
            </h6>
            <MessageContent content={message.content} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
