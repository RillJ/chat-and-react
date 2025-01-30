import { useEffect, useState } from "react";
import { Channel } from "./types/Channel";
import { API } from "./services/API";
import ChannelView from "./components/ChannelView";
import ChannelList from "./components/ChannelList";

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setError(
          err instanceof Error ? err.message : "Failed to load channels"
        );
        setChannels([]);
      } finally {
        setLoading(false);
      }
    };

    loadChannels();
    const interval = setInterval(loadChannels, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">
          Loading channels...
          <div className="spinner-border ms-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Error loading channels</h4>
          <pre>{error}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-4">
          <h1 className="mb-4">Available Channels</h1>
          {loading ? (
            <div className="alert alert-info">Loading channels...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <ChannelList
              channels={channels}
              onSelectChannel={setSelectedChannel}
            />
          )}
        </div>
        <div className="col-md-8">
          {selectedChannel && <ChannelView channel={selectedChannel} />}
        </div>
      </div>
    </div>
  );
}

export default App;
