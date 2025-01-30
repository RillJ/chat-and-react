import { useState, FormEvent } from "react";

interface MessageFormProps {
  onSubmit: (content: string, sender: string) => Promise<void>;
}

function MessageForm({ onSubmit }: MessageFormProps) {
  const [content, setContent] = useState("");
  const [sender, setSender] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !sender.trim()) return;

    setSending(true);
    try {
      await onSubmit(content, sender);
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
          placeholder="Your (user)name"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
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
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
