import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BOX_SIZE, Grid, GRID_SIZE } from "../../utils";
import { createEmptyGrid, detectErrors } from "../solve/solveSlice";
import { SolveTile, TileState } from "../solve/SolveTile";

// Solution text type
export type SolutionType = "multiple" | "none" | "valid";

type CreateState = {
    // The grid is 9x9 (we can re-use the SolveTile class)
    grid: Grid<SolveTile>;
    solution: SolutionType;
};

// Find what solutions are possible
export const findSolution = (grid: Grid<SolveTile>): SolutionType => {
    // Start by searching for tiles with errors
    for (const row of grid) {
        for (const col of row) {
            if (col.inError) {
                return "none";
            }
        }
    }

    // Now make a simpler version of the grid
    const simpleGrid = grid.map((row) =>
        row.map((col) => (col.value === 0 ? null : col.value))
    );

    // Helper function for solving sudoku, returns the number of solutions, if it is greater than 1 then it just returns 2
    const sudokuHelper = (
        grid2: Grid<number | null>,
        row: number,
        column: number
    ): number => {
        let solutions = 0;

        const nextRow = column === GRID_SIZE - 1 ? row + 1 : row;
        const nextCol = (column + 1) % GRID_SIZE;

        if (row >= GRID_SIZE) {
            return 1; // Base case
        } else if (grid[row][column].state === TileState.FILLED) {
            // Skip to next tile
            solutions += sudokuHelper(grid2, nextRow, nextCol);
        } else {
            // Try each possibility
            for (let i = 1; i <= 9; i++) {
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

                    solutions += sudokuHelper(grid2, nextRow, nextCol);

                    if (solutions >= 2) {
                        return 2;
                    }

                    grid2[row][column] = null;
                }
            }
        }

        return solutions;
    };

    const result = sudokuHelper(simpleGrid, 0, 0);

    return result === 0 ? "none" : result === 1 ? "valid" : "multiple";
};

// Creates the initial state for the sudoku
export const createInitialState = (): CreateState => ({
    grid: createEmptyGrid(),
    solution: "multiple"
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
