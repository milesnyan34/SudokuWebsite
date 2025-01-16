import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SolveTile, TileState } from "./SolveTile";
import { BOX_SIZE, Grid, GRID_SIZE, range } from "../../utils";

type SolveState = {
    // The grid is 9x9
    grid: Grid<SolveTile>;

    // Is there an import error?
    importError: boolean;
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
    // Make a grid that tracks changes to make
    const changes: Grid<{
        causesError: boolean;
        inError: boolean;
        isCorrect: boolean;
    }> = [];

    for (let i = 0; i < GRID_SIZE; i++) {
        changes.push(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            new Array(GRID_SIZE).fill(0).map((_) => ({
                causesError: false,
                inError: false,
                isCorrect: false
            }))
        );
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

                changes[row][column] = Object.assign(changes[row][column], {
                    inError: true,
                    causesError: errorValues.includes(grid[row][column].value)
                });
            });
        }
    };

    // Variant for completed rows
    const detectCompletedHelper = (
        coords: Array<{
            row: number;
            column: number;
        }>
    ) => {
        // Number of tiles with errors
        let errorCount = 0;

        // Track found values
        const found = new Set();

        coords.forEach((coord) => {
            const { row, column } = coord;
            const value = grid[row][column].value;

            if (value === 0) {
                return;
            }

            if (changes[row][column].inError) {
                errorCount++;
            }

            found.add(value);
        });

        // Row is completed
        if (found.size == GRID_SIZE && errorCount === 0) {
            coords.forEach((coord) => {
                const { row, column } = coord;

                changes[row][column] = Object.assign(changes[row][column], {
                    isCorrect: true
                });
            });
        }
    };

    for (const fn of [detectErrorsHelper, detectCompletedHelper]) {
        // Look for rows
        for (let row = 0; row < GRID_SIZE; row++) {
            fn(
                range(0, GRID_SIZE - 1).map((column) => ({
                    row,
                    column
                }))
            );
        }

        // Look for columns
        for (let column = 0; column < GRID_SIZE; column++) {
            fn(
                range(0, GRID_SIZE - 1).map((row) => ({
                    row,
                    column
                }))
            );
        }

        // Look for boxes
        for (let boxRow = 0; boxRow < BOX_SIZE; boxRow++) {
            for (let boxCol = 0; boxCol < BOX_SIZE; boxCol++) {
                fn(
                    range(0, GRID_SIZE - 1).map((index) => ({
                        row: boxRow * BOX_SIZE + Math.floor(index / 3),
                        column: boxCol * BOX_SIZE + (index % 3)
                    }))
                );
            }
        }
    }

    return grid.map((row, rowIndex) =>
        row.map((col, colIndex) => Object.assign(col, changes[rowIndex][colIndex]))
    );
};

// Creates the initial state for the sudoku
export const createInitialState = (): SolveState => ({
    grid: createEmptyGrid(),
    importError: false
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

            state.grid = detectErrors(state.grid);
            state.importError = false;
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
            state.importError = false;
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
        },

        /**
         * Sets the grid based on the format string sent in
         */
        setGridFromFormat(state: SolveState, action: PayloadAction<string>) {
            const formatString = action.payload;
            const lines = formatString.split("\n");

            // Check number of rows
            if (lines.length !== GRID_SIZE) {
                state.importError = true;
                return;
            } else {
                let success = true;
                const newGrid: Grid<number> = [];

                for (const line of lines) {
                    const split = line.split(",");
                    const row: number[] = [];

                    // Check number of columns
                    if (split.length !== GRID_SIZE) {
                        success = false;
                    } else {
                        for (const col of split) {
                            const parsed = parseInt(col);

                            if (isNaN(parsed) || parsed < 0 || parsed > GRID_SIZE) {
                                success = false;
                                break;
                            } else {
                                row.push(parsed);
                            }
                        }

                        newGrid.push(row);
                    }
                }

                if (success) {
                    state.grid = createSudokuGrid(newGrid);
                    state.importError = false;
                } else {
                    state.importError = true;
                }
            }
        }
    }
});

export const { removeValue, setGrid, setGridAt, setGridFromFormat, updateValue } = solveSlice.actions;

export default solveSlice.reducer;
