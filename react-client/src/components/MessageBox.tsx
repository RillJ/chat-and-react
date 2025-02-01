import { Message } from "../types/Message";
import MessageContent from "./MessageContent";

interface MessageBoxProps {
  message: Message;
}

function MessageBox({ message }: MessageBoxProps) {
  // Determine the classes for the message box based on the message type
  const getCardClasses = () => {
    // Base classes for all message boxes
    const baseClasses = "card mb-2 border-start";

    // Special styling for privacy advisor bot messages
    if (message.extra?.message_type === "privacy_advisor_bot") {
      return `${baseClasses} bg-info bg-opacity-10 border-info`;
    }
    // Special styling for system messages
    if (message.extra?.message_type === "system") {
      return `${baseClasses} bg-warning bg-opacity-10 border-warning`;
    }
    // Default styling for regular messages
    return baseClasses;
  };

  return (
    <div className={getCardClasses()}>
      <div className="card-body">
        {/* Header section with sender info and timestamp */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="card-subtitle text-muted">
            <b>{message.sender}</b>
            {/* Optional category badge */}
            {message.extra?.category && (
              <span className="badge bg-secondary ms-2">
                {message.extra.category}
              </span>
            )}
          </h6>
          <small className="text-muted">
            {new Date(message.timestamp).toLocaleString()}
          </small>
        </div>
        {/* Message content component */}
        <MessageContent content={message.content} />
      </div>
    </div>
  );
}

export default MessageBox;
