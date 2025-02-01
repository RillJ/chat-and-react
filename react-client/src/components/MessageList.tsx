import { Message } from "../types/Message";
import MessageBox from "./MessageBox";

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  return (
    <div className="messages-container">
      {/* Show message when there are no messages to display */}
      {messages.length === 0 && <p>No messages found.</p>}

      {/* Map through messages array and render each message using MessageBox component */}
      {messages.map((message, index) => (
        <MessageBox key={index} message={message} />
      ))}
    </div>
  );
}

export default MessageList;
