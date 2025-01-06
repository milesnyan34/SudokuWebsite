import { createSelector } from "@reduxjs/toolkit";
import { AppPage } from "./main/mainSlice";
import { SolveTile, TileState } from "./solve/SolveTile";
import { RootState } from "./store";

/**
 * Gets the current page
 * @param state
 * @returns
 */
export const selectPage = (state: RootState): AppPage => state.main.page;

/**
 * Gets the solve tile at the given row + column
 * @param row
 * @param column
 * @returns
 */
export const selectSolveTile =
    (row: number, column: number) =>
    (state: RootState): SolveTile =>
        state.solve.grid[row][column];

/**
 * Is the tile at the given position set?
 * @param row
 * @param column
 * @returns
 */
export const selectIsTileSet = (row: number, column: number) =>
    createSelector(
        [selectSolveTile(row, column)],
        (solveTile) => solveTile.state === TileState.SET
    );

/**
 * Is the tile at the given position empty?
 * @param row
 * @param column
 * @returns
 */
export const selectIsTileEmpty = (row: number, column: number) =>
    createSelector(
        [selectSolveTile(row, column)],
        (solveTile) => solveTile.state === TileState.EMPTY
    );
