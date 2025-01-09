import { configureStore } from "@reduxjs/toolkit";
import createSudokuReducer from "./create/createSudokuSlice";
import mainReducer from "./main/mainSlice";
import solveReducer from "./solve/solveSlice";

export const createStore = () =>
    configureStore({
        reducer: {
            main: mainReducer,
            solve: solveReducer,
            createSudoku: createSudokuReducer
        }
    });

export const store = createStore();

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
