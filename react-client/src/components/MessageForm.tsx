// Copyright 2025 Julian Calvin Rill

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useState, FormEvent, useRef } from "react";

interface MessageFormProps {
  onSubmit: (content: string, sender: string) => Promise<void>;
  username: string;
  onUsernameChange: (username: string) => void;
  onFetch: () => Promise<void>;
}

function MessageForm({
  onSubmit,
  username,
  onUsernameChange,
  onFetch,
}: MessageFormProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fetching, setFetching] = useState(false);

  // Adjusts the height of the text box
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    const newHeight = Math.min(element.scrollHeight, 15 * 24); // 24px per line in message box
    element.style.height = `${newHeight}px`;
  };

  // Submits messages to the channel API
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

  // Fetches new messages from the channel API
  const handleFetch = async () => {
    setFetching(true);
    try {
      await onFetch();
    } finally {
      setFetching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      {/* Username input and fetch button container */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Your (user)name..."
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
        />
        {/* Fetch button with loading state */}
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{ width: "160px" }}
          onClick={handleFetch}
          disabled={fetching}
        >
          {fetching ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Fetching...
            </>
          ) : (
            <>
              <i className="bi bi-arrow-clockwise me-1"></i>
              Fetch
            </>
          )}
        </button>
      </div>
      {/* Message input area */}
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
          // Handle Enter key for submission
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
      {/* Markdown formatting help text */}
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
