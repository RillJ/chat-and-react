import { useState, FormEvent } from "react";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !username.trim()) return;

    setSending(true);
    try {
      await onSubmit(content, username);
      setContent("");
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
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
