import React, { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../store";

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
}

const CountryAutocomplete: React.FC<Props> = ({ inputRef }) => {
  const countries = useSelector((state: RootState) => state.countries.list);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputId = "country-select";

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (name: string) => {
    setQuery(name);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.value = name;
    }
  };

  return (
    <div className="country-input">
      <label htmlFor={inputId} className="label-input">
        Country
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="text"
        className="input-form"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(false)}
        autoComplete="off"
        placeholder="Type to search..."
      />
      {isOpen && filteredCountries.length > 0 && (
        <ul className="dropdown">
          {filteredCountries.map((c) => (
            <li
              key={c.code}
              onMouseDown={() => handleSelect(c.name)}
              className="dropdown-item"
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryAutocomplete;
