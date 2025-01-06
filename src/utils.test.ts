import { range } from "./utils";

describe("utils", () => {
    test("range", () => {
        expect(range(3, 8)).toEqual([3, 4, 5, 6, 7, 8]);
    });
});
