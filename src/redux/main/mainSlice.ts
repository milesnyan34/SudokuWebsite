import { createSlice } from "@reduxjs/toolkit";

type MainState = object;

const initialState: MainState = {};

export const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {}
});

export default mainSlice.reducer;
