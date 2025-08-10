import { configureStore } from '@reduxjs/toolkit';
import { itemsReducer } from './itemsSlice';
import { charactersApi } from './charactersApi';

export const store = configureStore({
  reducer: {
    checkedItems: itemsReducer,
    [charactersApi.reducerPath]: charactersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(charactersApi.middleware),
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
