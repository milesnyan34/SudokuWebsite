import { arraySum, range } from "./utils";

describe("utils", () => {
    test("range", () => {
        expect(range(3, 8)).toEqual([3, 4, 5, 6, 7, 8]);
    });

    test("arraySum", () => {
        expect(arraySum([1, 4, 7, 3, 2, 8])).toBe(25);
    });
});
