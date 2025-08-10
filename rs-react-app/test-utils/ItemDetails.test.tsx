import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import ItemDetails from '../src/components/Item/ItemDetails';
import { useGetCharacterByIdQuery } from '../src/state/charactersApi';

vi.mock('../src/state/charactersApi', () => ({
  useGetCharacterByIdQuery: vi.fn(),
}));

describe('ItemDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state', () => {
    (useGetCharacterByIdQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading details/)).toBeInTheDocument();
  });

  it('renders character data after loading', async () => {
    (useGetCharacterByIdQuery as Mock).mockReturnValue({
      data: {
        id: 1,
        name: 'Rick Sanchez',
        image: 'rick.png',
        species: 'Human',
        type: 'Scientist',
      },
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('item-details')).toBeInTheDocument();
    });

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText(/Species:/)).toBeInTheDocument();
    expect(screen.getByText(/Scientist/)).toBeInTheDocument();
    expect(screen.getByAltText('Rick Sanchez')).toBeInTheDocument();
  });

  it('renders nothing if no "details" param is present', () => {
    (useGetCharacterByIdQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('item-details')).toBeNull();
  });

  it('shows "No data" when fetch fails', () => {
    (useGetCharacterByIdQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(
      <MemoryRouter initialEntries={['/?details=999']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('removes "details" param when close button is clicked', async () => {
    (useGetCharacterByIdQuery as Mock).mockReturnValue({
      data: {
        id: 2,
        name: 'Morty Smith',
        image: 'morty.png',
        species: 'Human',
        type: '',
      },
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });

    const closeBtn = screen.getByRole('button', { name: /✖/ });
    closeBtn.click();

    await waitFor(() => {
      expect(screen.queryByTestId('item-details')).not.toBeInTheDocument();
    });
  });
});
