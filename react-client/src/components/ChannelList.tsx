import { Channel } from "../types/Channel";

interface ListGroupProps {
  channels: Channel[];
  selectedChannel?: Channel;
  onSelectChannel: (channel: Channel) => void;
}

function ChannelList({
  channels,
  selectedChannel,
  onSelectChannel,
}: ListGroupProps) {
  return (
    <div className="list-group">
      {channels.map((channel) => (
        <button
          key={channel.endpoint}
          className={`list-group-item list-group-item-action ${
            selectedChannel?.endpoint === channel.endpoint ? "active" : ""
          }`}
          onClick={() => onSelectChannel(channel)}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-1">{channel.name}</h5>
            <small>{channel.type_of_service}</small>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ChannelList;
