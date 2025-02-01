import { useState } from "react";
import { Channel } from "./types/Channel";
import ChannelView from "./components/ChannelView";
import ChannelList from "./components/ChannelList";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");

  return (
    <ThemeProvider>
      <div className="container-fluid mt-4">
        <div className="row">
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
