'use client';
import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './features/loaderSlice';
import poolingMessageReducer from './features/poolingMessageSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      loader: loaderReducer,
      poolingMessage: poolingMessageReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
