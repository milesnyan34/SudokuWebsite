import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SolveTile, TileState } from "./SolveTile";
import { BOX_SIZE, Grid, GRID_SIZE, range } from "../../utils";

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

/**
 * Detects any errors in a grid, returning the resulting grid
 * @param grid
 */
export const detectErrors = (grid: Grid<SolveTile>): Grid<SolveTile> => {
    // Make a grid that tracks changes to make (0 is no change, 1 is in error, 2 is error source)
    const changes: Grid<number> = [];

    for (let i = 0; i < GRID_SIZE; i++) {
        changes.push(new Array(GRID_SIZE).fill(0));
    }

    // Helper function that takes a list of coordinates and modifies the changes array
    const detectErrorsHelper = (
        coords: Array<{
            row: number;
            column: number;
        }>
    ) => {
        // Values that produced errors
        const errorValues: Array<number> = [];

        // Track found values
        const found = new Set();

        coords.forEach((coord) => {
            const { row, column } = coord;
            const value = grid[row][column].value;

            if (value === 0) {
                return;
            }

            if (found.has(value)) {
                errorValues.push(value);
            } else {
                found.add(value);
            }
        });

        // Found an error, add all values in the row
        if (errorValues.length > 0) {
            coords.forEach((coord) => {
                const { row, column } = coord;

                changes[row][column] = errorValues.includes(grid[row][column].value)
                    ? 2
                    : 1;
            });
        }
    };

    // Look for rows
    for (let row = 0; row < GRID_SIZE; row++) {
        detectErrorsHelper(
            range(0, GRID_SIZE - 1).map((column) => ({
                row,
                column
            }))
        );
    }

    // Look for columns
    for (let column = 0; column < GRID_SIZE; column++) {
        detectErrorsHelper(
            range(0, GRID_SIZE - 1).map((row) => ({
                row,
                column
            }))
        );
    }

    // Look for boxes
    for (let boxRow = 0; boxRow < BOX_SIZE; boxRow++) {
        for (let boxCol = 0; boxCol < BOX_SIZE; boxCol++) {
            detectErrorsHelper(
                range(0, GRID_SIZE - 1).map((index) => ({
                    row: boxRow * BOX_SIZE + Math.floor(index / 3),
                    column: boxCol * BOX_SIZE + (index % 3)
                }))
            );
        }
    }

    return grid.map((row, rowIndex) =>
        row.map((col, colIndex) => ({
            ...col,
            inError: changes[rowIndex][colIndex] > 0,
            causesError: changes[rowIndex][colIndex] === 2
        }))
    );
};

// Creates the initial state for the sudoku
export const createInitialState = (): SolveState => ({
    grid: createEmptyGrid()
});

const initialState = createInitialState();

export const solveSlice = createSlice({
    name: "solve",
    initialState: Object.assign(initialState, {
        grid: createSudokuGrid([
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 5, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 3, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 7, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 8, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ])
    }),
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

            state.grid = detectErrors(state.grid);
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

            state.grid = detectErrors(state.grid);
        },

        /**
         * Sets the grid (mainly for testing)
         * @param state
         * @param action
         */
        setGrid(state: SolveState, action: PayloadAction<Grid<SolveTile>>) {
            state.grid = action.payload;

            state.grid = detectErrors(state.grid);
        },

        /**
         * Sets the value at a given position (mainly for testing)
         * @param state
         * @param action
         */
        setGridAt(
            state: SolveState,
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

export const { removeValue, setGrid, setGridAt, updateValue } = solveSlice.actions;

export default solveSlice.reducer;
