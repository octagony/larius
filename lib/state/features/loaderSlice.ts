'use client';

import { ILoaderState } from '@/lib/interfaces/state/ILoaderState';
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState: ILoaderState = {
  isLoading: false,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    showLoader(state) {
      state.isLoading = true;
    },
    hideLoader(state) {
      state.isLoading = false;
    },
    toggleLoader(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { hideLoader, showLoader, toggleLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
