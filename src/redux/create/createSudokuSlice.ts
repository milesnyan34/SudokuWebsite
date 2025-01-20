import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BOX_SIZE, Grid, GRID_SIZE, TILES_THRESHOLD } from "../../utils";
import { SolveTile, TileState } from "../solve/SolveTile";
import { createEmptyGrid, detectErrors } from "../../gridUtils";

// Solution text type
export type SolutionType = "multiple" | "none" | "valid" | "not enough tiles";

type CreateState = {
    // The grid is 9x9 (we can re-use the SolveTile class)
    grid: Grid<SolveTile>;
    solution: SolutionType;
};

// Find what solutions are possible
export const findSolution = (grid: Grid<SolveTile>): SolutionType => {
    // Start by searching for tiles with errors
    let filledCount = 0;

    for (const row of grid) {
        for (const col of row) {
            if (col.inError) {
                return "none";
            } else if (col.state === TileState.FILLED) {
                filledCount++;
            }
        }
    }

    if (filledCount < TILES_THRESHOLD) {
        return "not enough tiles";
    }

    // Now make a simpler version of the grid
    const simpleGrid = grid.map((row) =>
        row.map((col) => (col.value === 0 ? null : col.value))
    );

    // For each tile, determine the list of possible numbers that can be placed in it
    // This helps optimize the program by making it so it doesn't have to repeatedly check impossible values
    const possibilities: Array<{
        row: number;
        column: number;
        options: Array<number>;
    }> = [];

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
            if (simpleGrid[row][column] !== null) {
                possibilities.push({ row, column, options: [] });
                continue;
            }

            const valid: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

            // Try the column
            for (let row2 = 0; row2 < GRID_SIZE; row2++) {
                const value = simpleGrid[row2][column];

                if (value !== null) {
                    valid.delete(simpleGrid[row2][column]!);
                }
            }

            // Try the row
            for (let col2 = 0; col2 < GRID_SIZE; col2++) {
                const value = simpleGrid[row][col2];

                if (value !== null) {
                    valid.delete(simpleGrid[row][col2]!);
                }
            }

            // Try the box
            const boxRow = Math.floor(row / 3);
            const boxCol = Math.floor(column / 3);

            for (let row2 = boxRow * BOX_SIZE; row2 < (boxRow + 1) * BOX_SIZE; row2++) {
                for (
                    let col2 = boxCol * BOX_SIZE;
                    col2 < (boxCol + 1) * BOX_SIZE;
                    col2++
                ) {
                    const value = simpleGrid[row2][col2];

                    if (value !== null) {
                        valid.delete(simpleGrid[row2][col2]!);
                    }
                }
            }

            // Now set the possibilities
            possibilities.push({
                row,
                column,
                options: Array.from(valid)
            });
        }
    }

    // Get the sorted list of row/columns based on the number of options
    possibilities.sort((a, b) => a.options.length - b.options.length);

    // Helper function for solving sudoku, returns the number of solutions, if it is greater than 1 then it just returns 2
    const sudokuHelper = (grid2: Grid<number | null>, index: number): number => {
        let solutions = 0;

        if (index >= GRID_SIZE * GRID_SIZE) {
            return 1; // Base case
        }

        const possib = possibilities[index];
        const row = possib.row;
        const column = possib.column;

        if (grid[row][column].state === TileState.FILLED) {
            // Skip to next tile
            solutions += sudokuHelper(grid2, index + 1);
        } else {
            for (const i of possib.options) {
                let canPlace = true;

                // Check the column
                for (let row2 = 0; row2 < GRID_SIZE; row2++) {
                    if (grid2[row2][column] === i) {
                        canPlace = false;
                        break;
                    }
                }

                if (canPlace) {
                    // Check the row
                    for (let col2 = 0; col2 < GRID_SIZE; col2++) {
                        if (grid2[row][col2] === i) {
                            canPlace = false;
                            break;
                        }
                    }
                }

                if (canPlace) {
                    // Check the box
                    const boxRow = Math.floor(row / 3);
                    const boxCol = Math.floor(column / 3);

                    for (
                        let row2 = boxRow * BOX_SIZE;
                        row2 < (boxRow + 1) * BOX_SIZE;
                        row2++
                    ) {
                        for (
                            let col2 = boxCol * BOX_SIZE;
                            col2 < (boxCol + 1) * BOX_SIZE;
                            col2++
                        ) {
                            if (grid2[row2][col2] === i) {
                                canPlace = false;
                                break;
                            }
                        }

                        if (!canPlace) {
                            break;
                        }
                    }
                }

                // Place it if possible
                if (canPlace) {
                    grid2[row][column] = i;

                    solutions += sudokuHelper(grid2, index + 1);

                    if (solutions >= 2) {
                        return 2;
                    }

                    grid2[row][column] = null;
                }
            }
        }

        return solutions;
    };

    const result = sudokuHelper(simpleGrid, 0);

    return result === 0 ? "none" : result === 1 ? "valid" : "multiple";
};

// Creates the initial state for the sudoku
export const createInitialState = (): CreateState => ({
    grid: createEmptyGrid(),
    solution: "not enough tiles"
});

const initialState = createInitialState();

export const createSudokuSlice = createSlice({
    name: "create",
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
            state.solution = findSolution(state.grid);
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
            state.solution = findSolution(state.grid);
        },

        /**
         * Sets the grid (mainly for testing)
         * @param state
         * @param action
         */
        setGrid(state: CreateState, action: PayloadAction<Grid<SolveTile>>) {
            state.grid = action.payload;

            state.grid = detectErrors(state.grid);
            state.solution = findSolution(state.grid);
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
            state.solution = findSolution(state.grid);
        }
    }
});

export const { removeValue, setGrid, setGridAt, updateValue } = createSudokuSlice.actions;

export default createSudokuSlice.reducer;
