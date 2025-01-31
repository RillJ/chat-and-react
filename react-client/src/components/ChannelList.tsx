import { Channel } from "../types/Channel";
import SearchBar from "./SearchBar";

interface ChannelListProps {
  channels: Channel[];
  selectedChannel?: Channel;
  onSelectChannel: (channel: Channel) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function ChannelList({
  channels,
  selectedChannel,
  onSelectChannel,
  searchTerm,
  onSearchChange,
}: ChannelListProps) {
  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.type_of_service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <SearchBar value={searchTerm} onChange={onSearchChange} />
      <div className="list-group">
        {filteredChannels.map((channel) => (
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
      {filteredChannels.length === 0 && (
        <div className="alert alert-info mt-3">
          No channels found for: "{searchTerm}"
        </div>
      )}
    </div>
  );
}

export default ChannelList;
