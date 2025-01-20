import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import { createStore } from "./redux/store";
import { clickElement } from "./testUtils";

describe("App", () => {
    test("Start on create page", () => {
        const store = createStore();

        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        expect(screen.queryByTestId("create-page")).toBeTruthy();
        expect(screen.queryByTestId("solve-page")).toBeFalsy();
    });

    test("Click header buttons to change pages", async () => {
        const store = createStore();

        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        await clickElement("header-button-Solve");

        expect(screen.queryByTestId("create-page")).toBeFalsy();
        expect(screen.queryByTestId("solve-page")).toBeTruthy();

        await clickElement("header-button-Create");

        expect(screen.queryByTestId("create-page")).toBeTruthy();
        expect(screen.queryByTestId("solve-page")).toBeFalsy();
    });
});
