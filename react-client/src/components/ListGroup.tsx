import { useState } from "react";
import { Channel } from "../types/Channel";

interface ListGroupProps {
  items: Channel[];
  onSelectChannel: (item: Channel) => void;
}

function ListGroup({ items, onSelectChannel }: ListGroupProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1); // Hook

  return (
    <>
      {items.length === 0 && <p>No channels found.</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item.endpoint}
            onClick={() => {
              setSelectedIndex(index);
              onSelectChannel(item);
            }}
          >
            {item.name}{" "}
            <span className="text-muted">({item.type_of_service})</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
