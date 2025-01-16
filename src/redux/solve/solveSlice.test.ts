import reducer, {
    createInitialState,
    removeValue,
    setGridFromFormat,
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

    describe("setGridFromFormat", () => {
        test("Error, wrong number of rows", () => {
            let state = createInitialState();

            state = reducer(state, setGridFromFormat("1,2,3\n4,5,6"));

            expect(state.importError).toBeTruthy();
        });

        test("Error, wrong number of columns", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,2,3\n4,5,6\n7,8,9\n2,3,4\n5,6,7\n8,9,1\n2,3,4\n5,6,7\n8,9,1"
                )
            );

            expect(state.importError).toBeTruthy();
        });

        test("Error, parsing error", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,2,3,a,5,6,7,8,9\n2,3,4,5,6,7,8,9,1\n3,4,5,6,7,8,9,1,2\n4,5,6,7,8,9,1,2,3\n5,6,7,8,9,1,2,3,4\n6,7,8,9,1,2,3,4,5\n7,8,9,1,2,3,4,5,6\n8,9,1,2,3,4,5,6,7\n9,1,2,3,4,5,6,7,8"
                )
            );

            expect(state.importError).toBeTruthy();
        });

        test("Error, number too low", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,2,3,4,-1,6,7,8,9\n2,3,4,5,6,7,8,9,1\n3,4,5,6,7,8,9,1,2\n4,5,6,7,8,9,1,2,3\n5,6,7,8,9,1,2,3,4\n6,7,8,9,1,2,3,4,5\n7,8,9,1,2,3,4,5,6\n8,9,1,2,3,4,5,6,7\n9,1,2,3,4,5,6,7,8"
                )
            );

            expect(state.importError).toBeTruthy();
        });

        test("Error, number too high", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,2,3,4,5,6,7,8,9\n2,3,4,5,10,7,8,9,1\n3,4,5,6,7,8,9,1,2\n4,5,6,7,8,9,1,2,3\n5,6,7,8,9,1,2,3,4\n6,7,8,9,1,2,3,4,5\n7,8,9,1,2,3,4,5,6\n8,9,1,2,3,4,5,6,7\n9,1,2,3,4,5,6,7,8"
                )
            );

            expect(state.importError).toBeTruthy();
        });

        test("Success", () => {
            let state = createInitialState();

            state = reducer(
                state,
                setGridFromFormat(
                    "1,2,3,4,5,6,7,8,9\n2,3,4,5,0,0,0,9,1\n3,4,5,6,7,8,9,1,2\n4,5,6,7,8,9,1,2,3\n5,6,7,8,9,1,2,3,4\n6,7,8,9,1,2,3,4,5\n7,8,9,1,2,3,4,5,6\n8,9,1,2,3,4,5,6,7\n9,1,2,3,4,5,6,7,8"
                )
            );

            expect(state.importError).toBeFalsy();
            expect(state.grid.map((row) => row.map((col) => col.value))).toEqual([
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [2, 3, 4, 5, 0, 0, 0, 9, 1],
                [3, 4, 5, 6, 7, 8, 9, 1, 2],
                [4, 5, 6, 7, 8, 9, 1, 2, 3],
                [5, 6, 7, 8, 9, 1, 2, 3, 4],
                [6, 7, 8, 9, 1, 2, 3, 4, 5],
                [7, 8, 9, 1, 2, 3, 4, 5, 6],
                [8, 9, 1, 2, 3, 4, 5, 6, 7],
                [9, 1, 2, 3, 4, 5, 6, 7, 8]
            ]);
        });
    });
});
