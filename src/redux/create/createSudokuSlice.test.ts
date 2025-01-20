import { createEmptyGrid } from "../../gridUtils";
import reducer, { createInitialState, findSolution, setGrid } from "./createSudokuSlice";

describe("createSudokuSlice", () => {
    describe("findSolution", () => {
        test("not enough tiles", () => {
            let state = createInitialState();

            state = reducer(state, setGrid(createEmptyGrid()));

            const solution = findSolution(state.grid);

            expect(solution).toBe("not enough tiles");
        });
    });
});
