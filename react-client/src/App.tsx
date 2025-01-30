import ListGroup from "./components/ListGroup";

function App() {
  const items = ["Channel 1", "Channel 2", "Channel 3", "Channel 4"];
  const handleSelectChannel = (item: string) => {
    console.log(item);
  };

  return (
    <div>
      <ListGroup items={items} onSelectChannel={handleSelectChannel} />
    </div>
  );
}

export default App;
