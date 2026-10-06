import { IPoolingMessageState } from '@/lib/interfaces/state/IPoolingMessageState';
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState: IPoolingMessageState = {
  message: '',
};

const poolingMessageSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setPoolingMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
});

export const { setPoolingMessage } = poolingMessageSlice.actions;
export default poolingMessageSlice.reducer;
