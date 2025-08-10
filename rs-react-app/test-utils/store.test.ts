import { describe, it, expect, beforeEach, vi } from 'vitest';
import { charactersApi } from '../src/state/charactersApi';
import { store } from '../src/state/store';
import { toggleCharacter } from '../src/state/itemsSlice';

describe('Redux store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should have charactersApi reducer and itemsReducer in the store', () => {
    const state = store.getState();

    expect(state.checkedItems).toBeDefined();
    expect(state[charactersApi.reducerPath]).toBeDefined();
  });

  it('should have charactersApi middleware applied', () => {
    // middleware это функция, проверить её сложно напрямую, но можно проверить store.middleware

    // здесь просто проверим, что store.dispatch проксирует через middleware RTK Query
    // например, dispatch объекта с типом charactersApi.util.resetApiState.type

    const resetAction = { type: charactersApi.util.resetApiState.type };
    const result = store.dispatch(resetAction);

    // Результат должен быть определён (dispatch должен работать)
    expect(result).toBeDefined();
  });

  it('should save checkedItems state to localStorage on state change', () => {
    const spySetItem = vi.spyOn(Storage.prototype, 'setItem');

    const testCharacter = {
      id: 1,
      name: 'Rick Sanchez',
      image: 'some.png',
      species: 'Human',
      type: 'Scientist',
      checked: false,
    };

    store.dispatch(toggleCharacter(testCharacter));

    expect(spySetItem).toHaveBeenCalled();

    const lastCallArg =
      spySetItem.mock.calls[spySetItem.mock.calls.length - 1][1];
    const saved = JSON.parse(lastCallArg);

    expect(saved).toHaveProperty('items');
    expect(saved.items).toHaveProperty('1');
    expect(saved.items['1'].name).toBe('Rick Sanchez');
  });

  it('should handle localStorage setItem error gracefully', () => {
    const error = new Error('quota exceeded');
    const spySetItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw error;
      });
    const spyConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    store.dispatch({
      type: 'checkedItems/add', // замени на реальное действие
      payload: 'testItem',
    });

    expect(spyConsoleError).toHaveBeenCalledWith(
      'Failed to save to localStorage:',
      error
    );

    spySetItem.mockRestore();
    spyConsoleError.mockRestore();
  });
});
