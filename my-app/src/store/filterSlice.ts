import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  query: string;
}

const initialState: FilterState = {
  query: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload.trim();
    },
    clearQuery: () => initialState,
  },
});

export const { setQuery, clearQuery } = filterSlice.actions;
export default filterSlice.reducer;