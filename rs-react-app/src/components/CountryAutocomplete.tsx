import { useState, useEffect, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface CountryAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

const CountryAutocomplete = forwardRef<
  HTMLInputElement,
  CountryAutocompleteProps
>(({ value, onChange, onBlur }, ref) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const countries = useSelector((state: RootState) =>
    state.countries.list.map((country) => country.name)
  );

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onChange?.(value);

    if (value.length > 0) {
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange?.(suggestion);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
    onBlur?.();
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={ref}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
        placeholder="Select a country"
        style={{ width: '100%' }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

CountryAutocomplete.displayName = 'CountryAutocomplete';

export default CountryAutocomplete;
