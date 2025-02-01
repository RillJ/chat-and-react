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

import { Channel } from "../types/Channel";
import { Message } from "../types/Message";

// API configuration constants, change as needed
const HUB_URL = "http://localhost:5555";
const HUB_AUTHKEY = "1234567890";

export const API = {
  // Fetches all available channels from the hub
  async getChannels(): Promise<Channel[]> {
    console.log("Fetching channels...");
    try {
      const response = await fetch(`${HUB_URL}/channels`, {
        headers: {
          Authorization: `authkey ${HUB_AUTHKEY}`,
        },
      });

      console.log("Response status:", response.status);

      // Check for HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Received channels:", data);

      // Validate response structure
      if (!data.channels) {
        throw new Error("No channels field in response");
      }

      return data.channels;
    } catch (error) {
      console.error("Failed to fetch channels:", error);
      throw error;
    }
  },

  // Retrieves messages for a specific channel
  async getMessages(channel: Channel): Promise<Message[]> {
    const response = await fetch(channel.endpoint, {
      headers: {
        Authorization: `authkey ${channel.authkey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    return response.json();
  },

  // Sends a new message to a specific channel
  async sendMessage(
    channel: Channel,
    content: string,
    sender: string
  ): Promise<void> {
    const response = await fetch(channel.endpoint, {
      method: "POST",
      headers: {
        Authorization: `authkey ${channel.authkey}`,
        "Content-Type": "application/json",
      },
      // Create message object with content, sender, and current timestamp
      body: JSON.stringify({
        content,
        sender,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
  },
};
