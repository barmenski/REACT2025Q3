import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SearchInput from '../src/components/SearchInput/SearchInput';

describe('SearchInput', () => {
  it('Renders search input and search button', () => {
    render(<SearchInput value="" onChange={() => {}} onSearch={() => {}} />);

    expect(screen.getByPlaceholderText(/введите запрос/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /поиск/i })).toBeInTheDocument();
  });

  it('Displays previously saved search term from localStorage on mount (wich get by props from App)', () => {
    render(
      <SearchInput value="savedQuery" onChange={() => {}} onSearch={() => {}} />
    );

    expect(screen.getByDisplayValue('savedQuery')).toBeInTheDocument();
  });

  it('Shows empty input when no saved term exists', () => {
    render(<SearchInput value="" onChange={() => {}} onSearch={() => {}} />);

    const input = screen.getByPlaceholderText(
      /введите запрос/i
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('call onSearch after click on button', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <SearchInput value="query" onChange={() => {}} onSearch={onSearch} />
    );

    await user.click(screen.getByRole('button', { name: /поиск/i }));
    expect(onSearch).toHaveBeenCalledWith('query');
  });

  it('call onSearch after push Enter', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <SearchInput value="query" onChange={() => {}} onSearch={onSearch} />
    );

    const input = screen.getByPlaceholderText(/введите запрос/i);
    await user.type(input, '{enter}');
    expect(onSearch).toHaveBeenCalledWith('query');
  });

  it('call onChange when write text', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchInput value="" onChange={onChange} onSearch={() => {}} />);

    const input = screen.getByPlaceholderText(/введите запрос/i);
    await user.type(input, 'a');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith('a');
  });
});
