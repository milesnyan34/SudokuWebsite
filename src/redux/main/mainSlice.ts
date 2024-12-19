import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Current page for the app
 */
export enum AppPage {
    Create,
    Solve
}

type MainState = {
    page: AppPage;
};

const initialState: MainState = {
    page: AppPage.Create
};

export const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<AppPage>) {
            state.page = action.payload;
        }
    }
});

export const { setPage } = mainSlice.actions;

export default mainSlice.reducer;
