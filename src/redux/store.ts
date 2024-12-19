import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./main/mainSlice";

export const store = configureStore({
    reducer: {
        main: mainReducer
    }
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
