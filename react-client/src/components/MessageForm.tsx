import { useState, FormEvent, useRef } from "react";

interface MessageFormProps {
  onSubmit: (content: string, sender: string) => Promise<void>;
  username: string;
  onUsernameChange: (username: string) => void;
}

function MessageForm({
  onSubmit,
  username,
  onUsernameChange,
}: MessageFormProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjusts the height of the text box
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    const newHeight = Math.min(element.scrollHeight, 15 * 24); // 24px per line in message box
    element.style.height = `${newHeight}px`;
  };

  // Handles form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !username.trim()) return;

    setSending(true);
    try {
      await onSubmit(content, username);
      setContent("");
      // Reset height of text box to 1 line after sending message
      if (textareaRef.current) {
        textareaRef.current.style.height = "38px";
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Your (user)name..."
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <textarea
          ref={textareaRef}
          className="form-control"
          placeholder="Type a message... (Shift + Enter for new line)"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            adjustHeight(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (content.trim()) {
                handleSubmit(e as any);
              }
            }
          }}
          rows={1}
          style={{
            resize: "none",
            minHeight: "38px",
            maxHeight: "360px",
          }}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "Sending message..." : "Send"}
        </button>
      </div>
      <small className="text-muted mt-2 d-block">
        Supports Markdown formatting: **bold**, *italic*, `code`, ```code
        blocks```; click{" "}
        <a
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>{" "}
        for more formatting options
      </small>
    </form>
  );
}

export default MessageForm;
