import classNames from "classnames";
import { BOX_SIZE, range } from "../../../utils";
import { CreateTileComponent } from "./CreateTileComponent";
import { useSelector } from "react-redux";
import { selectSolution } from "../../../redux/selectors";

/**
 * Component for the Create Sudoku page
 * @returns
 */
const CreatePage = () => {
    const solution = useSelector(selectSolution);
    const solutionText = solution === "multiple" ? "Too many solutions found!" : solution === "none" ? "No solution found!" : "Unique solution found!"

    // The 9x9 grid is basically a 3x3 grid of 3x3 boxes
    return (
        <div id="solve-page" className="flex-center-column">
            <div className={classNames("solution-text", solution === "valid" ? "solution-text-valid" : "solution-text-invalid")}>{solutionText}</div>

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

            <button type="button" id="export-sudoku">
                Export Sudoku
            </button>
        </div>
    );
};

export default CreatePage;
