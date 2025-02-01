import { Channel } from "../types/Channel";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import { API } from "../services/API";

interface ChannelListProps {
  channels: Channel[];
  setChannels: (channels: Channel[]) => void;
  selectedChannel?: Channel;
  onSelectChannel: (channel: Channel) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function ChannelList({
  channels,
  setChannels,
  selectedChannel,
  onSelectChannel,
  searchTerm,
  onSearchChange,
}: ChannelListProps) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  // Function to fetch channels from the API
  const loadChannels = async () => {
    console.log("Starting to load channels...");
    setLoading(true);
    try {
      const data = await API.getChannels();
      console.log("Successfully loaded channels:", data);
      setChannels(data);
      setError(undefined);
    } catch (err) {
      console.error("Error in loadChannels:", err);
      setError(err instanceof Error ? err.message : "Failed to load channels");
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to load channels initially and refresh every minute
  useEffect(() => {
    loadChannels();
    const interval = setInterval(loadChannels, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Filter channels based on search term (name or service type)
  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.type_of_service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search input component */}
      <SearchBar value={searchTerm} onChange={onSearchChange} />

      {/* Loading indicator */}
      {loading && (
        <div className="alert alert-info">
          Refreshing channels...
          <div className="spinner-border spinner-border-sm ms-2" role="status">
            <span className="visually-hidden">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Error message display */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Channel list */}
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

      {/* No results message */}
      {filteredChannels.length === 0 && !loading && !error && (
        <div className="alert alert-info mt-3">
          No channels found for: "{searchTerm}"
        </div>
      )}
    </div>
  );
}

export default ChannelList;
