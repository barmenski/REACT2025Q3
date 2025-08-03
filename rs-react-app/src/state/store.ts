import { configureStore } from '@reduxjs/toolkit';
import { itemsReducer } from './itemsSlice';

export const store = configureStore({
  reducer: {
    checkedItems: itemsReducer,
  },
});

store.subscribe(() => {
  try {
    const state = store.getState();
    const serialized = JSON.stringify(state.checkedItems);
    localStorage.setItem('selectedCharacters', serialized);
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
