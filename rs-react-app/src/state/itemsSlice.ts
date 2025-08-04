import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Character } from '../types';

type SelectedState = {
  items: Record<number, Character>;
};

const loadFromLocalStorage = (): SelectedState => {
  try {
    const data = localStorage.getItem('selectedCharacters');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return { items: {} };
};

const initialState: SelectedState = loadFromLocalStorage();

const itemsSlice = createSlice({
  name: 'checkedItems',
  initialState,
  reducers: {
    toggleCharacter(state, action: PayloadAction<Character>) {
      const id = action.payload.id;
      if (state.items[id]) {
        state.items = Object.fromEntries(
          Object.entries(state.items).filter(
            ([id]) => Number(id) !== action.payload.id
          )
        );
      } else {
        state.items[id] = action.payload;
      }
    },
    clearSelection(state) {
      state.items = {};
    },
  },
});

export const { toggleCharacter, clearSelection } = itemsSlice.actions;
export const itemsReducer = itemsSlice.reducer;
