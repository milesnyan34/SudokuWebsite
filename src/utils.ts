/**
 * Size of the grid (rows and columns)
 */
export const GRID_SIZE = 9;

/**
 * Size of a box
 */
export const BOX_SIZE = 3;

/**
 * Number of filled tiles needed to determine solvability
 */
export const TILES_THRESHOLD = 16;

/**
 * Returns a range from low to high (inclusive)
 */
export const range = (low: number, high: number): Array<number> => {
    const result = [];

    for (let i = low; i <= high; i++) {
        result.push(i);
    }

    return result;
};

/**
 * Returns the sum of an array
 * @param array
 * @returns
 */
export const arraySum = (array: number[]): number => array.reduce((a, b) => a + b);