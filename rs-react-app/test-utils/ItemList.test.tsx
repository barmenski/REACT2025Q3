import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemList from '../src/components/ItemList/ItemList';
import { describe, it, vi } from 'vitest';

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
    },
  ];

  it('renders all characters passed as props', () => {
    render(<ItemList results={results} onItemClick={() => {}} />);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();

    const items = screen.getAllByTestId('item');
    expect(items).toHaveLength(2);
  });

  it('calls onItemClick with correct ID on click', async () => {
    const onItemClick = vi.fn();
    render(<ItemList results={results} onItemClick={onItemClick} />);
    const rick = screen.getByText('Rick Sanchez');
    await userEvent.click(rick);
    expect(onItemClick).toHaveBeenCalledWith(1);
  });

  it('renders nothing if results is empty', () => {
    const { container } = render(
      <ItemList results={[]} onItemClick={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });
});
