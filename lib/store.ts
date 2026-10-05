'use client';
import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './features/loaderSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      loader: loaderReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
