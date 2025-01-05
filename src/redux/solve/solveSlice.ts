import { createSlice } from "@reduxjs/toolkit";
import { SolveTile } from "./SolveTile";
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
const createSudokuGrid = (currentGrid: Grid<number>): Grid<SolveTile> => {
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

const initialState: SolveState = {
    grid: createSudokuGrid([
        [1, 0, 0, 0, 0, 0, 0, 5, 7],
        [2, 4, 6, 0, 3, 5, 0, 0, 0],
        [0, 0, 0, 0, 0, 7, 0, 0, 9],
        [0, 0, 5, 0, 0, 0, 8, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 9, 6, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 2, 4, 0, 0, 8, 0]
    ])
};

export const solveSlice = createSlice({
    name: "solve",
    initialState,
    reducers: {}
});

export default solveSlice.reducer;
