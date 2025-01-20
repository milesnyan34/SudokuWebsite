import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createEmptyGrid } from "../../../gridUtils";
import { setGrid, setGridAt } from "../../../redux/solve/solveSlice";
import { SolveTile } from "../../../redux/solve/SolveTile";
import { createStore } from "../../../redux/store";
import { clickElement, matchesClasses } from "../../../testUtils";
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

        const tile = screen.getByTestId("solve-tile-0-3");

        expect(matchesClasses(tile, ["solve-tile", "flex-center"]));
    });

    test("Tile with an unset value has the solve-tile-unset class", () => {
        const store = createStore();

        store.dispatch(setGrid(createEmptyGrid()));

        render(
            <Provider store={store}>
                <SolveTileComponent row={0} column={3} />
            </Provider>
        );

        const tile = screen.getByTestId("solve-tile-0-3");

        expect(matchesClasses(tile, ["solve-tile", "flex-center", "solve-tile-unset"]));
    });

    test("Click on an unset tile to make it active", async () => {
        const store = createStore();

        store.dispatch(setGrid(createEmptyGrid()));

        render(
            <Provider store={store}>
                <SolveTileComponent row={2} column={5} />
            </Provider>
        );

        await clickElement("solve-tile-2-5");

        const tile = screen.getByTestId("solve-tile-2-5");

        expect(matchesClasses(tile, ["solve-tile", "flex-center", "solve-tile-active"]));
    });
});
