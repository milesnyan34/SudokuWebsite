import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createEmptyGrid, setGrid, setGridAt } from "../../../redux/solve/solveSlice";
import { SolveTile } from "../../../redux/solve/SolveTile";
import { createStore } from "../../../redux/store";
import { SolveTileComponent } from "./SolveTileComponent";

describe("SolveTileComponent", () => {
    test("Tile with a set value does not contain the solve-tile-unset class", () => {
        const store = createStore();

        store.dispatch(setGrid(createEmptyGrid()));

        store.dispatch(
            setGridAt({
                row: 0,
                column: 3,
                tile: SolveTile({
                    startValue: 1,
                    hasStartValue: true
                })
            })
        );

        render(
            <Provider store={store}>
                <SolveTileComponent row={0} column={3} />
            </Provider>
        );
    });
});
