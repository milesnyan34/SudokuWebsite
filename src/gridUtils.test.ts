import { createSudokuGrid, detectErrors, gridCount, gridMap } from "./gridUtils";

describe("gridUtils", () => {
    test("gridCount", () => {
        expect(
            gridCount(
                [
                    [1, 3, 5],
                    [2, 4, 7],
                    [3, 6, 9]
                ],
                (num) => num % 2 === 0
            )
        ).toBe(3);
    });

    test("gridMap", () => {
        expect(
            gridMap(
                [
                    [1, 3, 5],
                    [2, 4, 7],
                    [3, 6, 9]
                ],
                (num) => num * 2
            )
        ).toEqual([
            [2, 6, 10],
            [4, 8, 14],
            [6, 12, 18]
        ]);
    });

    describe("detectErrors", () => {
        test("No errors, no completed rows", () => {
            let grid = createSudokuGrid([
                [1, 2, 3, 4, 5, 6, 7, 8, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]);

            grid = detectErrors(grid);

            expect(gridCount(grid, (tile) => tile.inError)).toBe(0);
            expect(gridCount(grid, (tile) => tile.isCorrect)).toBe(0);
        });

        test("No errors, completed rows/columns/boxes", () => {
            let grid = createSudokuGrid([
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [4, 6, 7, 0, 0, 0, 0, 0, 0],
                [5, 8, 9, 0, 3, 0, 0, 1, 0],
                [2, 0, 0, 0, 6, 0, 0, 0, 0],
                [3, 0, 0, 0, 0, 0, 0, 0, 0],
                [6, 0, 0, 9, 0, 0, 0, 5, 0],
                [7, 0, 0, 0, 0, 0, 0, 2, 0],
                [8, 0, 0, 0, 4, 0, 0, 3, 0],
                [9, 0, 0, 7, 0, 0, 0, 0, 0]
            ]);

            grid = detectErrors(grid);

            expect(gridCount(grid, (tile) => tile.inError)).toBe(0);
            expect(gridCount(grid, (tile) => tile.isCorrect)).toBe(21);

            expect(gridMap(grid, (tile) => tile.isCorrect)).toEqual([
                [true, true, true, true, true, true, true, true, true],
                [true, true, true, false, false, false, false, false, false],
                [true, true, true, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false]
            ]);
        });

        test("Has errors", () => {
            let grid = createSudokuGrid([
                [6, 2, 3, 4, 5, 6, 0, 8, 0],
                [4, 6, 7, 0, 0, 0, 0, 0, 0],
                [5, 8, 9, 0, 3, 0, 0, 1, 0],
                [2, 0, 0, 0, 6, 0, 0, 0, 0],
                [3, 0, 0, 0, 0, 0, 0, 0, 0],
                [6, 0, 0, 9, 0, 0, 0, 0, 0],
                [7, 0, 0, 0, 0, 0, 1, 2, 8],
                [8, 0, 0, 0, 0, 0, 4, 3, 9],
                [9, 0, 0, 0, 0, 0, 7, 5, 6]
            ]);

            grid = detectErrors(grid);

            expect(gridCount(grid, (tile) => tile.inError)).toBe(21);
            expect(gridCount(grid, (tile) => tile.isCorrect)).toBe(9);

            expect(gridMap(grid, (tile) => tile.inError)).toEqual([
                [true, true, true, true, true, true, true, true, true],
                [true, true, true, false, false, false, false, false, false],
                [true, true, true, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false],
                [true, false, false, false, false, false, false, false, false]
            ]);

            expect(gridMap(grid, (tile) => tile.isCorrect)).toEqual([
                [false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, true, true, true],
                [false, false, false, false, false, false, true, true, true],
                [false, false, false, false, false, false, true, true, true]
            ]);
        })
    });
});
