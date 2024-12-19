import { AppPage } from "./main/mainSlice";
import { RootState } from "./store";

// Gets the current page
export const selectPage = (state: RootState): AppPage => state.main.page;