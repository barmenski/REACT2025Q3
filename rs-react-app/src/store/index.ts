import { configureStore } from '@reduxjs/toolkit';
import countriesReducer from './countriesSlice';
import formReducer from './formSlice';

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    form: formReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
