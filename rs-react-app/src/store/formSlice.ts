import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  terms: boolean;
  image: string;
  country: string;
  timestamp: string;
  isNew?: boolean;
}

interface FormState {
  submissions: FormData[];
}

const initialState: FormState = {
  submissions: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addFormData: {
      reducer(state, action: PayloadAction<FormData>) {
        state.submissions.unshift(action.payload); // Добавляем в начало массива
      },
      prepare(formData: Omit<FormData, 'id' | 'isNew'>) {
        return {
          payload: {
            ...formData,
            id: Math.random().toString(36).substr(2, 9),
            isNew: true,
          },
        };
      },
    },
    markAsNotNew(state, action: PayloadAction<string>) {
      const submission = state.submissions.find(
        (item) => item.id === action.payload
      );
      if (submission) {
        submission.isNew = false;
      }
    },
    clearAllNewFlags(state) {
      state.submissions.forEach((item) => {
        item.isNew = false;
      });
    },
  },
});

export const { addFormData, markAsNotNew, clearAllNewFlags } =
  formSlice.actions;
export default formSlice.reducer;
