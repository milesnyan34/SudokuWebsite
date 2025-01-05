import { useSelector } from "react-redux";
import { selectSolveTile } from "../../../redux/selectors";
import { TileState } from "../../../redux/solve/SolveTile";

// Tile for the solve page
export const SolveTile = ({ row, column }: { row: number; column: number }) => {
    const solveData = useSelector(selectSolveTile(row, column));

    return (
        <div className="solve-tile flex-center">
            {solveData.state === TileState.EMPTY ? "" : solveData.value}
        </div>
    );
};
