import { useDispatch, useSelector } from "react-redux";
import { selectImportError } from "../../../redux/selectors";
import { setGridFromFormat } from "../../../redux/solve/solveSlice";
import { BOX_SIZE, range } from "../../../utils";
import "./SolvePage.css";
import { SolveTileComponent } from "./SolveTileComponent";

/**
 * Component for the Solve Sudoku page
 * @returns
 */
const SolvePage = () => {
    const dispatch = useDispatch();

    const importError = useSelector(selectImportError);

    const onImportClicked = () => {
        const filePicker = document.createElement("input");
        filePicker.type = "file";
        filePicker.accept = ".txt";

        filePicker.onchange = () => {
            // Read the chosen file
            filePicker.files![0].arrayBuffer().then(async (arrayBuffer) => {
                const fileText = new TextDecoder().decode(arrayBuffer);

                dispatch(setGridFromFormat(fileText));
            });
        };

        filePicker.click();
    };

    // The 9x9 grid is basically a 3x3 grid of 3x3 boxes
    return (
        <div id="solve-page" className="flex-center-column">
            <div className="import-sudoku-row">
                <div id="import-sudoku-container" className="flex-center">
                    <button id="import-sudoku" type="button" onClick={onImportClicked}>
                        Import Sudoku
                    </button>
                </div>

                <div id="import-sudoku-error-text">
                    {importError ? "Error importing the sudoku!" : ""}
                </div>
            </div>

            <div id="solve-grid">
                {range(0, BOX_SIZE - 1).map((boxRow) => (
                    <div className="grid-row" key={boxRow}>
                        {range(0, BOX_SIZE - 1).map((boxColumn) => (
                            <div className="grid-box" key={boxColumn}>
                                {range(0, BOX_SIZE - 1).map((row) => (
                                    <div className="box-row" key={row}>
                                        {range(0, BOX_SIZE - 1).map((column) => (
                                            <SolveTileComponent
                                                key={column}
                                                row={boxRow * BOX_SIZE + row}
                                                column={boxColumn * BOX_SIZE + column}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SolvePage;
