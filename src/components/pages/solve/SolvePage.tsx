import { GRID_SIZE, range } from "../../../utils";
import "./SolvePage.css";
import { SolveTile } from "./SolveTile";

const SolvePage = () => {
    return (
        <div id="solve-page" className="flex-center">
            <div id="solve-grid">
                {range(0, GRID_SIZE - 1).map((row) => (
                    <div className="grid-row" key={row}>
                        {range(0, GRID_SIZE - 1).map((column) => (
                            <SolveTile
                                key={row * GRID_SIZE + column}
                                row={row}
                                column={column}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SolvePage;
