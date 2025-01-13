import reducer, {
    createInitialState,
    removeValue,
    updateValue
} from "./solveSlice";
import { TileState } from "./SolveTile";

describe("solveSlice", () => {
    test("updateValue", () => {
        let state = createInitialState();

        state = reducer(
            state,
            updateValue({
                row: 2,
                column: 4,
                value: 6
            })
        );

        expect(state.grid[2][4].value).toBe(6);
        expect(state.grid[2][4].state).toBe(TileState.FILLED);
    });

    test("removeValue", () => {
        let state = createInitialState();

        state = reducer(
            state,
            updateValue({
                row: 3,
                column: 1,
                value: 5
            })
        );

        state = reducer(
            state,
            removeValue({
                row: 3,
                column: 1
            })
        );

        expect(state.grid[3][1].value).toBe(0);
        expect(state.grid[3][1].state).toBe(TileState.EMPTY);
    });
});
