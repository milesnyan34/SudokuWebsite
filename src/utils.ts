/**
 * Size of the grid (rows and columns)
 */
export const GRID_SIZE = 9;

/**
 * Size of a box
 */
export const BOX_SIZE = 3;

/**
 * Represents a 2D grid of values
 */
export type Grid<T> = Array<Array<T>>;

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