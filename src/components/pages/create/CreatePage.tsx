import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
    selectAutoUpdate,
    selectSolution,
    selectStringFormat
} from "../../../redux/selectors";
import { BOX_SIZE, range, TILES_THRESHOLD } from "../../../utils";
import { CreateTileComponent } from "./CreateTileComponent";
import { setAutoUpdate } from "../../../redux/create/createSudokuSlice";

/**
 * Component for the Create Sudoku page
 * @returns
 */
const CreatePage = () => {
    const dispatch = useDispatch();

    const solution = useSelector(selectSolution);

    const solutionText =
        solution === "multiple"
            ? "Too many solutions found!"
            : solution === "none"
            ? "No solution found!"
            : solution === "not enough tiles"
            ? `Not enough filled tiles! (needs at least ${TILES_THRESHOLD})`
            : "Unique solution found!";

    const sudokuStringFormat = useSelector(selectStringFormat);

    const autoUpdate = useSelector(selectAutoUpdate);

    // Runs when the export button is clicked
    const onExportClicked = () => {
        // Download the file
        const link = document.createElement("a");

        link.setAttribute("download", "");
        link.href = window.URL.createObjectURL(
            new Blob([sudokuStringFormat], {
                type: "text/plain"
            })
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // The 9x9 grid is basically a 3x3 grid of 3x3 boxes
    return (
        <div id="create-page" data-testid="create-page" className="flex-center-column">
            <div
                className={classNames(
                    "solution-text",
                    solution === "valid" ? "solution-text-valid" : "solution-text-invalid"
                )}
            >
                {autoUpdate ? solutionText : ""}
            </div>

            <div id="solve-grid">
                {range(0, BOX_SIZE - 1).map((boxRow) => (
                    <div className="grid-row" key={boxRow}>
                        {range(0, BOX_SIZE - 1).map((boxColumn) => (
                            <div className="grid-box" key={boxColumn}>
                                {range(0, BOX_SIZE - 1).map((row) => (
                                    <div className="box-row" key={row}>
                                        {range(0, BOX_SIZE - 1).map((column) => (
                                            <CreateTileComponent
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

            <div className="flex-center">
                <button type="button" id="export-sudoku" onClick={onExportClicked}>
                    Export Sudoku
                </button>

                <button
                    type="button"
                    id="auto-update"
                    onClick={() => dispatch(setAutoUpdate(!autoUpdate))}
                >
                    Auto-Update: {autoUpdate ? "ON" : "OFF"}
                </button>
            </div>
        </div>
    );
};

export default CreatePage;
