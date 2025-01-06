import { createSelector } from "@reduxjs/toolkit";
import { AppPage } from "./main/mainSlice";
import { SolveTile, TileState } from "./solve/SolveTile";
import { RootState } from "./store";

// Gets the current page
export const selectPage = (state: RootState): AppPage => state.main.page;

// Gets the solve tile at the given row + column
export const selectSolveTile =
    (row: number, column: number) =>
    (state: RootState): SolveTile =>
        state.solve.grid[row][column];

// Is the tile at the given position set?
export const selectIsTileSet = (row: number, column: number) =>
    createSelector(
        [selectSolveTile(row, column)],
        (solveTile) => solveTile.state === TileState.SET
    );
