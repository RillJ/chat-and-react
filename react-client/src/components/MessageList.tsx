import { Message } from "../types/Message";

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
            <p className="card-text">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
