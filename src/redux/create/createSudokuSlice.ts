import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Grid } from "../../utils";
import { createEmptyGrid, detectErrors } from "../solve/solveSlice";
import { SolveTile, TileState } from "../solve/SolveTile";

type CreateState = {
    // The grid is 9x9 (we can re-use the SolveTile class)
    grid: Grid<SolveTile>;
};

// Creates the initial state for the sudoku
export const createInitialState = (): CreateState => ({
    grid: createEmptyGrid()
});

const initialState = createInitialState();

export const createSudokuSlice = createSlice({
    name: "create",
    // initialState: Object.assign(initialState, {
    //     grid: createSudokuGrid([
    //         [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         [0, 1, 5, 0, 0, 0, 0, 0, 0],
    //         [0, 0, 0, 0, 3, 0, 0, 0, 0],
    //         [0, 0, 0, 0, 0, 7, 0, 0, 0],
    //         [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         [0, 0, 0, 0, 0, 0, 0, 2, 0],
    //         [0, 0, 0, 0, 0, 0, 8, 0, 0],
    //         [0, 0, 0, 0, 0, 0, 0, 0, 0]
    //     ])
    // }),
    initialState,
    reducers: {
        /**
         * Updates the value at the given position
         * @param state
         * @param action
         */
        updateValue(
            state: CreateState,
            action: PayloadAction<{
                row: number;
                column: number;
                value: number;
            }>
        ) {
            const { row, column, value } = action.payload;

            state.grid[row][column] = {
                ...state.grid[row][column],
                value,
                state: TileState.FILLED
            };

            state.grid = detectErrors(state.grid);
        },

        /**
         * Removes the value from the given position
         * @param state
         * @param action
         */
        removeValue(
            state: CreateState,
            action: PayloadAction<{
                row: number;
                column: number;
            }>
        ) {
            const { row, column } = action.payload;

            state.grid[row][column] = {
                ...state.grid[row][column],
                value: 0,
                state: TileState.EMPTY
            };

            state.grid = detectErrors(state.grid);
        },

        /**
         * Sets the grid (mainly for testing)
         * @param state
         * @param action
         */
        setGrid(state: CreateState, action: PayloadAction<Grid<SolveTile>>) {
            state.grid = action.payload;

            state.grid = detectErrors(state.grid);
        },

        /**
         * Sets the value at a given position (mainly for testing)
         * @param state
         * @param action
         */
        setGridAt(
            state: CreateState,
            action: PayloadAction<{
                row: number;
                column: number;
                tile: SolveTile;
            }>
        ) {
            state.grid[action.payload.row][action.payload.column] = action.payload.tile;

            state.grid = detectErrors(state.grid);
        }
    }
});

export const { removeValue, setGrid, setGridAt, updateValue } = createSudokuSlice.actions;

export default createSudokuSlice.reducer;
