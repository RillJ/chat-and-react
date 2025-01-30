import { Channel } from "../types/Channel";
import { Message } from "../types/Message";

const HUB_URL = "http://localhost:5555";
const HUB_AUTHKEY = "1234567890";

export const API = {
  async getChannels(): Promise<Channel[]> {
    console.log("Fetching channels...");
    try {
      const response = await fetch(`${HUB_URL}/channels`, {
        headers: {
          Authorization: `authkey ${HUB_AUTHKEY}`,
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Received channels:", data);

      if (!data.channels) {
        throw new Error("No channels field in response");
      }

      return data.channels;
    } catch (error) {
      console.error("Failed to fetch channels:", error);
      throw error;
    }
  },

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
