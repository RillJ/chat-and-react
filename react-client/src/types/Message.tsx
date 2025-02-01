export interface Message {
  content: string;
  sender: string;
  timestamp: string;
  extra?: MessageExtra;
}

// To support the channel's extra fields
export interface MessageExtra {
  message_type?: "privacy_advisor_bot" | "system";
  category?: string;
}
