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
