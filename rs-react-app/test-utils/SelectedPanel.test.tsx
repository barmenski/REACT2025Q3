import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectedPanel from '../src/components/SelectedPanel/SelectedPanel';

// Мокаем хуки redux
vi.mock('../src/hooks/reduxHooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

import { useAppDispatch, useAppSelector } from '../src/hooks/reduxHooks';

describe('SelectedPanel', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppDispatch as Mock).mockReturnValue(mockDispatch);
  });

  it('renders nothing if no items selected', () => {
    (useAppSelector as Mock).mockReturnValue([]);

    const { container } = render(<SelectedPanel />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows count and buttons when items are selected', () => {
    (useAppSelector as Mock).mockReturnValue([
      { id: 1, name: 'Rick', species: 'Human' },
      { id: 2, name: 'Morty', species: 'Human' },
    ]);

    render(<SelectedPanel />);

    expect(screen.getByText('Checked: 2')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Unselect all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Download/i })
    ).toBeInTheDocument();
  });

  it('dispatches clearSelection when Unselect all clicked', () => {
    (useAppSelector as Mock).mockReturnValue([
      { id: 1, name: 'Rick', species: 'Human' },
    ]);
    render(<SelectedPanel />);

    fireEvent.click(screen.getByRole('button', { name: /Unselect all/i }));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    // Можно дополнительно проверить вызов с конкретным action, если clearSelection импортируется
  });

  it('creates and clicks download link on Download click', () => {
    (useAppSelector as Mock).mockReturnValue([
      { id: 1, name: 'Rick', species: 'Human' },
      { id: 2, name: 'Morty', species: 'Human' },
    ]);

    // Мокаем createObjectURL и revokeObjectURL
    const mockCreateObjectURL = vi.fn(() => 'blob:url');
    const mockRevokeObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Мокаем клик на <a>
    const clickMock = vi.fn();
    const createElementOriginal = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string) => {
        const element = createElementOriginal(tagName);
        if (tagName === 'a') {
          Object.defineProperty(element, 'click', { value: clickMock });
        }
        return element;
      }
    );

    render(<SelectedPanel />);

    fireEvent.click(screen.getByRole('button', { name: /Download/i }));

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:url');
  });
});
