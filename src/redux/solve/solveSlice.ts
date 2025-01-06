import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SolveTile, TileState } from "./SolveTile";
import { Grid, GRID_SIZE } from "../../utils";

type SolveState = {
    // The grid is 9x9
    grid: Grid<SolveTile>;
};

// Creates an empty grid
const createGrid = (): Grid<SolveTile> => {
    const result = [];

    for (let i = 0; i < GRID_SIZE; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        result.push(new Array(GRID_SIZE).fill(0).map((_) => SolveTile({})));
    }

    return result;
};

// Creates a sudoku grid with the values at the given tiles
export const createSudokuGrid = (currentGrid: Grid<number>): Grid<SolveTile> => {
    const grid = createGrid();

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            // Update the tiles as applicable
            if (currentGrid[i][j] > 0) {
                grid[i][j] = SolveTile({
                    startValue: currentGrid[i][j],
                    hasStartValue: true
                });
            }
        }
    }

    return grid;
};

// Creates an empty sudoku grid
export const createEmptyGrid = (): Grid<SolveTile> =>
    createSudokuGrid([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);

// Creates the initial state for the sudoku
export const createInitialState = (): SolveState => ({
    grid: createEmptyGrid()
});

const initialState = createInitialState();

export const solveSlice = createSlice({
    name: "solve",
    initialState,
    reducers: {
        /**
         * Updates the value at the given position
         * @param state 
         * @param action 
         */
        updateValue(
            state: SolveState,
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
        },

        /**
         * Removes the value from the given position
         * @param state 
         * @param action 
         */
        removeValue(
            state: SolveState,
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
        },

        /**
         * Sets the grid (mainly for testing)
         * @param state 
         * @param action 
         */
        setGrid(state: SolveState, action: PayloadAction<Grid<SolveTile>>) {
            state.grid = action.payload;
        },

        /**
         * Sets the value at a given position (mainly for testing)
         * @param state 
         * @param action 
         */
        setGridAt(state: SolveState, action: PayloadAction<{
            row: number;
            column: number;
            tile: SolveTile;
        }>) {
            state.grid[action.payload.row][action.payload.column] = action.payload.tile;
        }
    }
});

export const { removeValue, setGrid, setGridAt, updateValue } = solveSlice.actions;

export default solveSlice.reducer;
