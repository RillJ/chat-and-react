import { ChangeEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Type to search channels..."
        value={value}
        // Handle input changes and pass the new value to parent component
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}

export default SearchBar;
