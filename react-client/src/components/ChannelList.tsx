import { useState } from "react";
import { Channel } from "../types/Channel";

interface ListGroupProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

function ChannelList({ channels, onSelectChannel }: ListGroupProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1); // Hook

  return (
    <>
      {channels.length === 0 && <p>No channels found.</p>}
      <ul className="list-group">
        {channels.map((channel, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={channel.endpoint}
            onClick={() => {
              setSelectedIndex(index);
              onSelectChannel(channel);
            }}
          >
            {channel.name}{" "}
            <span className="text-muted">({channel.type_of_service})</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ChannelList;
