import { describe, it, expect, beforeEach } from 'vitest';
import { store } from './testStore';
import { toggleCharacter, clearSelection } from '../src/state/itemsSlice';
import { add, increment, reset } from './dummyReducer';

describe('Redux store integration', () => {
  beforeEach(() => {
    store.dispatch(clearSelection());
    store.dispatch(reset());
  });

  it('should handle toggleCharacter and update checkedItems state', () => {
    const character = {
      id: 1,
      name: 'Rick',
      image: '',
      species: '',
      type: '',
      status: '',
      gender: '',
      origin: { name: '', url: '' },
      location: { name: '', url: '' },
      episode: [],
      url: '',
      created: '',
      checked: false,
    };

    store.dispatch(toggleCharacter(character));
    const state = store.getState();
    expect(state.checkedItems.items[1]).toBeDefined();

    store.dispatch(toggleCharacter(character));
    const stateAfter = store.getState();
    expect(stateAfter.checkedItems.items[1]).toBeUndefined();
  });

  it('should update dummy state with add and increment', () => {
    store.dispatch(add(5));
    expect(store.getState().dummy.value).toBe(5);

    store.dispatch(increment());
    expect(store.getState().dummy.value).toBe(6);
  });
});
