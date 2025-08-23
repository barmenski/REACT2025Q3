import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Country {
  code: string;
  name: string;
}

interface CountriesState {
  list: Country[];
}

const initialState: CountriesState = {
  list: [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
  ],
};

const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    setCountries(state, action: PayloadAction<Country[]>) {
      state.list = action.payload;
    },
  },
});

export const { setCountries } = countriesSlice.actions;
export default countriesSlice.reducer;