// test-utils/dummyReducer.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DummyState {
  value: number;
}

const initialState: DummyState = { value: 0 };

const dummySlice = createSlice({
  name: 'dummy',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    increment: (state) => {
      state.value += 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { add, increment, reset } = dummySlice.actions;
export const dummyReducer = dummySlice.reducer;
