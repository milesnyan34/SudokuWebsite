// Size of the grid
export const GRID_SIZE = 9;

// Grid data type
export type Grid<T> = Array<Array<T>>;

// Returns a range from low to high (inclusive)
export const range = (low: number, high: number): Array<number> => {
    const result = [];

    for (let i = low; i <= high; i++) {
        result.push(i);
    }

    return result;
};
