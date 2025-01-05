/**
 * Represents a tile in the Sudoku grid for the Solve page
 */
export interface SolveTile {
    startValue: number;
    hasStartValue: boolean;
}

export const SolveTile = ({
    startValue = 0, // Starting value for the tile
    hasStartValue = false // Should it have a starting value?
}: {
    startValue?: number;
    hasStartValue?: boolean;
}): SolveTile => ({
    startValue,
    hasStartValue
});
