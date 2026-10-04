'use client';
import { IThemeData } from "@/interfaces/features/IThemeSlice";
import { createSlice } from "@reduxjs/toolkit";
import { getInitialTheme } from "../helpers";
import { PayloadAction } from "@reduxjs/toolkit";


const initialTheme: IThemeData = {
  darkTheme: getInitialTheme(),
}

export const themeSlice = createSlice({
	name: 'theme',
	initialState: initialTheme,
	reducers: {
		toggleTheme: (state) => {
			state.darkTheme = !state.darkTheme;
			if(typeof window !== 'undefined') {
				localStorage.setItem('darkTheme', JSON.stringify(state.darkTheme));
			}

		},
		setTheme: (state, action: PayloadAction<boolean>) => {
			state.darkTheme = action.payload;
			if(typeof window !== 'undefined') {
				localStorage.setItem('darkTheme', JSON.stringify(state.darkTheme));
			}
		},
	},
})

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
