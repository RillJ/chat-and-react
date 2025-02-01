import { Message } from "../types/Message";
import MessageContent from "./MessageContent";

interface MessageBoxProps {
  message: Message;
}

function MessageBox({ message }: MessageBoxProps) {
  // Determine the classes for the message box based on the message type
  const getCardClasses = () => {
    const baseClasses = "card mb-2 border-start";

    if (message.extra?.message_type === "privacy_advisor_bot") {
      return `${baseClasses} bg-info bg-opacity-10 border-info`;
    }
    if (message.extra?.message_type === "system") {
      return `${baseClasses} bg-warning bg-opacity-10 border-warning`;
    }
    return baseClasses;
  };

  return (
    <div className={getCardClasses()}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="card-subtitle text-muted">
            <b>{message.sender}</b>
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
        <MessageContent content={message.content} />
      </div>
    </div>
  );
}

export default MessageBox;
