import { describe, it, expect } from 'vitest';
import {
  itemsReducer,
  toggleCharacter,
  clearSelection,
} from '../src/state/itemsSlice';
import type { Character } from '../src/types';

describe('itemsSlice reducer', () => {
  const sampleCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    image: 'rick.png',
    species: 'Human',
    type: '',
    checked: false,
  };

  it('should return initial state', () => {
    const initial = itemsReducer(undefined, { type: '' });
    expect(initial).toEqual({ items: {} });
  });

  it('should add character on toggleCharacter if not present', () => {
    const state = itemsReducer(undefined, toggleCharacter(sampleCharacter));
    expect(state.items[sampleCharacter.id]).toEqual(sampleCharacter);
  });

  it('should remove character on toggleCharacter if already present', () => {
    const withCharacter = {
      items: { [sampleCharacter.id]: sampleCharacter },
    };
    const newState = itemsReducer(
      withCharacter,
      toggleCharacter(sampleCharacter)
    );
    expect(newState.items[sampleCharacter.id]).toBeUndefined();
  });

  it('should clear all selected characters', () => {
    const filledState = {
      items: {
        1: sampleCharacter,
        2: { ...sampleCharacter, id: 2 },
      },
    };
    const cleared = itemsReducer(filledState, clearSelection());
    expect(cleared.items).toEqual({});
  });
});
