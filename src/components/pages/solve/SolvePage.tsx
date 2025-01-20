import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectErrorCount,
    selectImportError,
    selectMakeHints,
    selectSudokuAlerted,
    selectSudokuImported,
    selectSudokuSolved
} from "../../../redux/selectors";
import {
    setErrorCount,
    setGridFromFormat,
    setMakeHints,
    setSudokuAlerted
} from "../../../redux/solve/solveSlice";
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

    const canMakeHints = useSelector(selectMakeHints);

    const sudokuSolved = useSelector(selectSudokuSolved);

    const sudokuAlerted = useSelector(selectSudokuAlerted);

    const errorCount = useSelector(selectErrorCount);

    const sudokuImported = useSelector(selectSudokuImported);

    const onImportClicked = () => {
        const filePicker = document.createElement("input");
        filePicker.type = "file";
        filePicker.accept = ".txt";

        filePicker.onchange = () => {
            // Read the chosen file
            filePicker.files![0].arrayBuffer().then(async (arrayBuffer) => {
                const fileText = new TextDecoder().decode(arrayBuffer);

                dispatch(setGridFromFormat(fileText));

                // Reset error count
                dispatch(setErrorCount(0));

                // Reset alerted stat
                dispatch(setSudokuAlerted(false));
            });
        };

        filePicker.click();
    };

    // Set up effect for detecting shift
    useEffect(() => {
        const onListener = (event: KeyboardEvent) => {
            if (event.key === "Shift") {
                dispatch(setMakeHints(true));
            }
        };

        const offListener = (event: KeyboardEvent) => {
            if (event.key === "Shift") {
                dispatch(setMakeHints(false));
            }
        };

        document.addEventListener("keydown", onListener);
        document.addEventListener("keyup", offListener);

        return () => {
            document.removeEventListener("keydown", onListener);
            document.removeEventListener("keyup", offListener);
        };
    });

    // Alert the user when the sudoku is solved
    useEffect(() => {
        if (sudokuSolved && !sudokuAlerted) {
            const errorText =
                errorCount === 0
                    ? "no errors!"
                    : errorCount === 1
                    ? "1 error!"
                    : `${errorCount} errors!`;

            alert(`Congrats on solving the sudoku! You committed ${errorText}`);

            dispatch(setSudokuAlerted(true));
        }
    }, [sudokuSolved, dispatch, errorCount, sudokuAlerted]);

    // The 9x9 grid is basically a 3x3 grid of 3x3 boxes
    return (
        <div id="solve-page" data-testid="solve-page" className="flex-center-column">
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

            {sudokuImported && (
                <div className="flex-center-column">
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
                                                        column={
                                                            boxColumn * BOX_SIZE + column
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div id="solve-hint-text">
                        Hold Shift to create hints {canMakeHints ? "(ON)" : "(OFF)"}
                    </div>

                    <div id="solve-errors-count">Total Errors: {errorCount}</div>
                </div>
            )}
        </div>
    );
};

export default SolvePage;
