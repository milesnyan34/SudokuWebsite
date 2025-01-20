import { SolveTile } from "./redux/solve/SolveTile";
import { BOX_SIZE, Grid, GRID_SIZE, range } from "./utils";

// Creates an empty grid
const createGrid = (): Grid<SolveTile> => {
    const result = [];

    for (let i = 0; i < GRID_SIZE; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        result.push(new Array(GRID_SIZE).fill(0).map((_) => SolveTile({})));
    }

    return result;
};

/**
 * Creates a sudoku grid with the values at the given tiles
 * @param currentGrid
 * @returns
 */
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

/**
 * Creates an empty sudoku grid
 * @returns
 */
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
