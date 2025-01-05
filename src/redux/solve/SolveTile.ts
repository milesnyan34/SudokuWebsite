// State of a solve tile
export enum TileState {
    SET, // Tile has a preset value
    EMPTY, // Tile is empty
    FILLED // Tile has a guess made
}

/**
 * Represents a tile in the Sudoku grid for the Solve page
 */
export interface SolveTile {
    state: TileState;
    value: number;
}

export const SolveTile = ({
    startValue = 0, // Starting value for the tile
    hasStartValue = false // Should it have a starting value?
}: {
    startValue?: number;
    hasStartValue?: boolean;
}): SolveTile => ({
    value: startValue,
    state: hasStartValue ? TileState.SET : TileState.EMPTY
});
