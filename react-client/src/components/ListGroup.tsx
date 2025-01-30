import { useState } from "react";

interface ListGroupProps {
  items: string[];
  onSelectChannel: (item: string) => void;
}

function ListGroup({ items, onSelectChannel }: ListGroupProps) {
  // items = [];
  const [selectedIndex, setSelectedIndex] = useState(-1); // Hook

  //   const getChannel = () => {
  //     return items.length === 0 ? <p>No channels found.</p> : null;
  //   }

  return (
    <>
      <h1>Channels List</h1>
      {items.length === 0 && <p>No channels found.</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              onSelectChannel(item);
            }}
          >
            {/* Probably use item.id from API */}
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
