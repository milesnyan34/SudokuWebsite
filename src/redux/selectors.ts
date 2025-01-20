import { createSelector } from "@reduxjs/toolkit";
import { SolutionType } from "./create/createSudokuSlice";
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

/**
 * Gets the create tile at the given row + column
 * @param row
 * @param column
 * @returns
 */
export const selectCreateTile =
    (row: number, column: number) =>
    (state: RootState): SolveTile =>
        state.createSudoku.grid[row][column];

/**
 * Is the tile at the given position set?
 * @param row
 * @param column
 * @returns
 */
export const selectIsCreateTileSet = (row: number, column: number) =>
    createSelector(
        [selectCreateTile(row, column)],
        (solveTile) => solveTile.state === TileState.SET
    );

/**
 * Is the tile at the given position empty?
 * @param row
 * @param column
 * @returns
 */
export const selectIsCreateTileEmpty = (row: number, column: number) =>
    createSelector(
        [selectCreateTile(row, column)],
        (solveTile) => solveTile.state === TileState.EMPTY
    );

/**
 * Returns the solution of the sudoku
 */
export const selectSolution = (state: RootState): SolutionType =>
    state.createSudoku.solution;

/**
 * Returns the string representation of the sudoku
 */
export const selectStringFormat = (state: RootState): string =>
    state.createSudoku.grid
        .map((row) => row.map((col) => col.value.toString()).join(","))
        .join("\n");

export const selectImportError = (state: RootState): boolean => state.solve.importError;

export const selectMakeHints = (state: RootState): boolean => state.solve.makeHints;

export const selectSudokuSolved = (state: RootState): boolean => state.solve.sudokuSolved;

export const selectErrorCount = (state: RootState): number => state.solve.errorCount;