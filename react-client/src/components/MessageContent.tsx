import ReactMarkdown from "react-markdown";

interface MessageContentProps {
  content: string;
}

function MessageContent({ content }: MessageContentProps) {
  return (
    <ReactMarkdown
      className="message-content"
      components={{
        // Convert headers to normal paragraphs
        h1: "p",
        h2: "p",
        h3: "p",
        h4: "p",
        h5: "p",
        h6: "p",
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MessageContent;
