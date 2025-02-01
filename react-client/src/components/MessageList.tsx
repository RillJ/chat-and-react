import { Message } from "../types/Message";
import MessageBox from "./MessageBox";

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  return (
    <div className="messages-container">
      {messages.length === 0 && <p>No messages found.</p>}
      {messages.map((message, index) => (
        <MessageBox key={index} message={message} />
      ))}
    </div>
  );
}

export default MessageList;
