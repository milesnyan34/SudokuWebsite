import { BOX_SIZE, range } from "../../../utils";
import { CreateTileComponent } from "./CreateTileComponent";

/**
 * Component for the Create Sudoku page
 * @returns
 */
const CreatePage = () => {
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
                                            <CreateTileComponent
                                                key={column}
                                                row={boxRow * BOX_SIZE + row}
                                                column={boxColumn * BOX_SIZE + column}
                                                isInSolve={false}
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

export default CreatePage;
