import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./main/mainSlice";
import solveReducer from "./solve/solveSlice";

export const store = configureStore({
    reducer: {
        main: mainReducer,
        solve: solveReducer
    }
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
