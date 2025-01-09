/**
 * State of a SolveTile
 */
export enum TileState {
    SET, // Tile has a preset value
    EMPTY, // Tile is empty
    FILLED // Tile has a guess made
}

/**
 * Represents a tile in the Sudoku grid for the Solve page
 */
export type SolveTile = {
    state: TileState;
    value: number;
    causesError: boolean; // Does the tile cause an error?
    inError: boolean; // Is the tile in a row/column/box with an error? (the difference is that causesError refers to the digits that actually repeat, while inError is the surrounding digits)
}

export const SolveTile = ({
    startValue = 0, // Starting value for the tile
    hasStartValue = false // Should it have a starting value?
}: {
    startValue?: number;
    hasStartValue?: boolean;
}): SolveTile => ({
    value: startValue,
    state: hasStartValue ? TileState.SET : TileState.EMPTY,
    causesError: false,
    inError: false
});
