import { selectStringFormat } from "../selectors";
import { createSudokuGrid } from "../solve/solveSlice";
import { createStore } from "../store";
import { setGrid } from "./createSudokuSlice";

describe("solveSlice", () => {
    test("selectStringFormat", () => {
        const store = createStore();

        store.dispatch(
            setGrid(
                createSudokuGrid([
                    [1, 3, 2, 5, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 7, 8, 9, 0],
                    [6, 4, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0]
                ])
            )
        );

        expect(selectStringFormat(store.getState())).toBe(
            "1,3,2,5,0,0,0,0,0\n0,0,0,0,0,7,8,9,0\n6,4,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0"
        );
    });
});
