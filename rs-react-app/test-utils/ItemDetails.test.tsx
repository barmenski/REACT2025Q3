import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ItemDetails from '../src/components/Item/ItemDetails';

// Универсальный мок для успешного fetch
function mockFetchSuccess(data: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
      } as Response)
    ) as typeof fetch
  );
}

// Универсальный мок для ошибки fetch
function mockFetchFailure() {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('fail'))) as typeof fetch
  );
}

describe('ItemDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders nothing if no "details" param is present', () => {
    render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('item-details')).toBeNull();
  });

  it('renders loading state and then character data', async () => {
    const mockCharacter = {
      id: 1,
      name: 'Rick Sanchez',
      image: 'rick.png',
      species: 'Human',
      type: 'Scientist',
    };

    mockFetchSuccess(mockCharacter);

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <ItemDetails />
      </MemoryRouter>
    );

    // Проверяем состояние загрузки
    expect(screen.getByText(/Загрузка/)).toBeInTheDocument();

    // Ждем появления данных персонажа
    await waitFor(() => {
      expect(screen.getByTestId('item-details')).toBeInTheDocument();
    });

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText(/Species:/)).toBeInTheDocument();
    expect(screen.getByText(/Scientist/)).toBeInTheDocument();
    expect(screen.getByAltText('Rick Sanchez')).toBeInTheDocument();
  });

  it('shows "No data" when fetch fails', async () => {
    mockFetchFailure();

    render(
      <MemoryRouter initialEntries={['/?details=999']}>
        <ItemDetails />
      </MemoryRouter>
    );

    // Проверяем состояние загрузки
    expect(screen.getByText(/Загрузка/)).toBeInTheDocument();

    // Ждем появления сообщения "No data"
    await waitFor(() => {
      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });

  it('removes "details" param when close button is clicked', async () => {
    const mockCharacter = {
      id: 1,
      name: 'Morty Smith',
      image: 'morty.png',
      species: 'Human',
      type: '',
    };

    mockFetchSuccess(mockCharacter);

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    // Ждем появления данных персонажа
    await waitFor(() => {
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });

    const closeBtn = screen.getByRole('button', { name: /✖/ });
    closeBtn.click();

    // Ожидаем, что компонент будет размонтирован (details param удалён)
    await waitFor(() => {
      expect(screen.queryByTestId('item-details')).not.toBeInTheDocument();
    });
  });
});
