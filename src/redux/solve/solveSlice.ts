import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BOX_SIZE, GRID_SIZE } from "../../utils";
import { createHintsList, SolveTile, TileState } from "./SolveTile";
import { createEmptyGrid, createSudokuGrid, detectErrors, Grid } from "../../gridUtils";

type SolveState = {
    // The grid is 9x9
    grid: Grid<SolveTile>;

    // Is there an import error?
    importError: boolean;

    // Are hints being created?
    makeHints: boolean;

    // Has the sudoku been solved?
    sudokuSolved: boolean;

    // Number of errors committed
    errorCount: number;
};

/**
 * Removes hints for the row/column corresponding to the new tile
 * @param grid
 */
const gridRemoveHints = (
    grid: Grid<SolveTile>,
    row: number,
    column: number,
    value: number
): Grid<SolveTile> => {
    // Remove hints corresponding to the filled in value that are in this row/column/box
    for (let row2 = 0; row2 < GRID_SIZE; row2++) {
        grid[row2][column].hints[value - 1] = false;
    }

    for (let column2 = 0; column2 < GRID_SIZE; column2++) {
        grid[row][column2].hints[value - 1] = false;
    }

    const boxRow = Math.floor(row / BOX_SIZE);
    const boxColumn = Math.floor(column / BOX_SIZE);

    for (let row2 = boxRow * BOX_SIZE; row2 < (boxRow + 1) * BOX_SIZE; row2++) {
        for (let col2 = boxColumn * BOX_SIZE; col2 < (boxColumn + 1) * BOX_SIZE; col2++) {
            grid[row2][col2].hints[value - 1] = false;
        }
    }

    return grid;
};

/**
 * Returns if a grid is solved
 * @param grid
 */
export const isGridSolved = (grid: Grid<SolveTile>): boolean => {
    for (const row of grid) {
        for (const tile of row) {
            if (tile.inError || tile.state === TileState.EMPTY) {
                return false;
            }
        }
    }

    return true;
};

// Creates the initial state for the sudoku
export const createInitialState = (): SolveState => ({
    grid: createEmptyGrid(),
    importError: false,
    makeHints: false,
    sudokuSolved: false,
    errorCount: 0
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
                state: TileState.FILLED,
                hints: createHintsList() // Reset the hints
            };

            state.grid = gridRemoveHints(state.grid, row, column, value);
            state.grid = detectErrors(state.grid);
            state.importError = false;
            state.sudokuSolved = isGridSolved(state.grid);
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
            state.sudokuSolved = isGridSolved(state.grid);
        },

        /**
         * Sets the grid (mainly for testing)
         * @param state
         * @param action
         */
        setGrid(state: SolveState, action: PayloadAction<Grid<SolveTile>>) {
            state.grid = action.payload;

            state.grid = detectErrors(state.grid);
            state.sudokuSolved = isGridSolved(state.grid);
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
            state.sudokuSolved = isGridSolved(state.grid);
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
                    state.grid = detectErrors(createSudokuGrid(newGrid));
                    state.importError = false;
                    state.sudokuSolved = isGridSolved(state.grid);
                } else {
                    state.importError = true;
                }
            }
        },

        setMakeHints(state: SolveState, action: PayloadAction<boolean>) {
            state.makeHints = action.payload;
        },

        setHintEnabled(
            state: SolveState,
            action: PayloadAction<{
                row: number;
                column: number;
                hintValue: number;
                hintEnabled: boolean;
            }>
        ) {
            const { row, column, hintValue, hintEnabled } = action.payload;

            state.grid[row][column].hints[hintValue - 1] = hintEnabled;
        },

        setSudokuSolved(state: SolveState, action: PayloadAction<boolean>) {
            state.sudokuSolved = action.payload;
        }
    }
});

export const {
    removeValue,
    setGrid,
    setGridAt,
    setGridFromFormat,
    setHintEnabled,
    setMakeHints,
    setSudokuSolved,
    updateValue
} = solveSlice.actions;

export default solveSlice.reducer;
