import { render, screen } from '@testing-library/react';
import ItemList from '../src/components/ItemList/ItemList';
import { describe, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { itemsReducer } from '../src/state/itemsSlice'; // путь к твоему слайсу

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      checkedItems: itemsReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('<ItemList />', () => {
  const results = [
    {
      id: 1,
      name: 'Rick Sanchez',
      image: 'rick.png',
      species: 'Human',
      type: '',
      status: 'Alive',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Citadel of Ricks', url: '' },
      episode: [],
      url: '',
      created: '',
      checked: false,
    },
    {
      id: 2,
      name: 'Morty Smith',
      image: 'morty.png',
      species: 'Human',
      type: '',
      status: 'Alive',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Earth (Replacement Dimension)', url: '' },
      episode: [],
      url: '',
      created: '',
      checked: false,
    },
  ];

  it('renders all characters passed as props', () => {
    renderWithProviders(<ItemList results={results} />);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    const items = screen.getAllByTestId('item');
    expect(items).toHaveLength(2);
  });

  it('renders nothing if results is empty', () => {
    const { container } = renderWithProviders(<ItemList results={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
