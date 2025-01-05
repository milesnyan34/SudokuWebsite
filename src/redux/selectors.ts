import { AppPage } from "./main/mainSlice";
import { SolveTile } from "./solve/SolveTile";
import { RootState } from "./store";

// Gets the current page
export const selectPage = (state: RootState): AppPage => state.main.page;

// Gets the solve tile at the given row + column
export const selectSolveTile = (row: number, column: number) => (state: RootState): SolveTile => state.solve.grid[row][column];