import { useState } from "react";
import { Channel } from "./types/Channel";
import ChannelView from "./components/ChannelView";
import ChannelList from "./components/ChannelList";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  // State for managing the list of available channels
  const [channels, setChannels] = useState<Channel[]>([]);
  // State for the currently selected channel
  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  // State for channel search functionality
  const [searchTerm, setSearchTerm] = useState("");
  // State for user's display name
  const [username, setUsername] = useState("");

  return (
    // Wrap app in ThemeProvider for dark/light mode functionality
    <ThemeProvider>
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Left sidebar with channel list */}
          <div className="col-md-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="mb-4">Channels</h1>
              <ThemeToggle />
            </div>
            <ChannelList
              channels={channels}
              setChannels={setChannels}
              selectedChannel={selectedChannel}
              onSelectChannel={setSelectedChannel}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          {/* Main content area showing selected channel */}
          <div className="col-md-8">
            {selectedChannel && (
              <ChannelView
                channel={selectedChannel}
                username={username}
                onUsernameChange={setUsername}
              />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
