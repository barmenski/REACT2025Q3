import { configureStore } from '@reduxjs/toolkit';
import { itemsReducer } from '../src/state/itemsSlice';
import { dummyReducer } from './dummyReducer';

export const store = configureStore({
  reducer: {
    checkedItems: itemsReducer,
    dummy: dummyReducer,
  },
});

export type TestRootState = ReturnType<typeof store.getState>;
export type TestDispatch = typeof store.dispatch;
