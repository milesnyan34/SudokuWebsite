import { BOX_SIZE, range } from "../../../utils";
import "./SolvePage.css";
import { SolveTileComponent } from "./SolveTileComponent";

/**
 * Component for the Solve Sudoku page
 * @returns 
 */
const SolvePage = () => {
    // The 9x9 grid is basically a 3x3 grid of 3x3 boxes
    return (
        <div id="solve-page" className="flex-center">
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
