import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Item from '../src/components/Item/Item';
import ItemList from '../src/components/ItemList/ItemList';
import type { Character } from '../src/components/App';

describe('Item component', () => {
  it('correctly displays item name and image', () => {
    render(<Item name="Rick Sanchez" image="https://example.com/rick.png" />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('https://example.com/rick.png');
    expect(img.alt).toBe('Rick Sanchez');
  });

  it('handles missing image gracefully', () => {
    render(<Item name="Morty Smith" image="" />);

    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

describe('ItemList component', () => {
  const characters: Character[] = [
    { id: 1, name: 'Rick Sanchez', image: 'https://example.com/rick.png' },
    { id: 2, name: 'Morty Smith', image: '' },
  ];

  it('renders list of items with names and images', () => {
    render(<ItemList results={characters} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();

    const imgs = screen.getAllByRole('img') as HTMLImageElement[];
    expect(imgs).toHaveLength(1);
    expect(imgs[0].alt).toBe('Rick Sanchez');
  });

  it('handles empty results array gracefully', () => {
    render(<ItemList results={[]} />);

    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });

  it('handles undefined results gracefully', () => {
    render(<ItemList results={undefined as unknown as Character[]} />);

    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });
});
