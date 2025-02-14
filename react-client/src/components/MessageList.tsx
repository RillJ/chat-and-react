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
