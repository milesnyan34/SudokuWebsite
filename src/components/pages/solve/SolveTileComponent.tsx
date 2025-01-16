import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDetectClickOutside } from "../../../hooks/useDetectClickOutside";
import {
    selectIsTileEmpty,
    selectIsTileSet,
    selectMakeHints,
    selectSolveTile
} from "../../../redux/selectors";
import {
    removeValue,
    setHintEnabled,
    updateValue
} from "../../../redux/solve/solveSlice";
import { range } from "../../../utils";

/**
 * Tile for the solve page
 * When the tile is set, it cannot be clicked on
 * When the tile is not set, the user can click on it to access a text box, letting them change its value
 * When the user clicks outside of the tile or enters a number, save that number and apply effects
 * @param param0
 * @returns
 */
export const SolveTileComponent = ({ row, column }: { row: number; column: number }) => {
    const solveData = useSelector(selectSolveTile(row, column));
    const value = solveData.value;
    const isSet = useSelector(selectIsTileSet(row, column));
    const isEmpty = useSelector(selectIsTileEmpty(row, column));
    const causesError = solveData.causesError;
    const inError = solveData.inError;
    const isCorrect = solveData.isCorrect;
    const canMakeHints = useSelector(selectMakeHints);

    const dispatch = useDispatch();

    // Is the tile currently active?
    const [active, setActive] = useState(false);

    // Set up ref + hook to detect clicks outside
    // When the user clicks outside, it should save whatever they typed
    const ref = useRef(null);

    useDetectClickOutside(ref, () => {
        if (active) {
            setActive(false);
        }
    });

    // When clicked, set it to active if it is not already
    const onClicked = () => {
        if (!isSet) {
            setActive(true);
        }
    };

    // When a key is pressed, if it is active and the key is a valid number, set the value to that. If it is delete, then get rid of the value.
    useEffect(() => {
        const onKeyPressed = (event: KeyboardEvent) => {
            if (active) {
                const key = event.key;

                if (canMakeHints) {
                    const keyCode = event.code;

                    // This checks if the keycode starts with Digit and the corresponding character is valid
                    if (
                        keyCode.length === 6 &&
                        keyCode.startsWith("Digit") &&
                        ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(keyCode[5])
                    ) {
                        const value = parseInt(keyCode[5]);

                        dispatch(
                            setHintEnabled({
                                row,
                                column,
                                hintValue: value,
                                hintEnabled: !solveData.hints[value - 1]
                            })
                        );
                    }
                } else {
                    if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key)) {
                        // Set the tile to this value
                        dispatch(
                            updateValue({
                                row,
                                column,
                                value: parseInt(key)
                            })
                        );

                        // Set this tile to inactive
                        setActive(false);
                    } else if (key === "Backspace") {
                        // Remove the value of this tile
                        dispatch(
                            removeValue({
                                row,
                                column
                            })
                        );

                        // Set this tile to inactive
                        setActive(false);
                    }
                }
            }
        };

        document.addEventListener("keydown", onKeyPressed);

        return () => document.removeEventListener("keydown", onKeyPressed);
    }, [dispatch, active, row, column, canMakeHints, solveData.hints]);

    // The tile contains an input element if it is active, otherwise it displays the current number
    return (
        <div
            ref={ref}
            className={classNames(
                "solve-tile",
                "flex-center",
                isSet ? "solve-tile-set" : "solve-tile-unset", // Set/unset tiles
                active && "solve-tile-active", // The active tile
                causesError
                    ? "solve-tile-error-source"
                    : isCorrect
                    ? "solve-tile-correct"
                    : inError
                    ? "solve-tile-error"
                    : "" // Error tiles
            )}
            onClick={onClicked}
            data-testid={`solve-tile-${row}-${column}`}
        >
            {active ? (
                <input
                    autoFocus
                    className={classNames("solve-tile-input", canMakeHints ? "solve-tile-input-hints" : "")}
                    value=""
                    placeholder={isEmpty ? "" : value.toString()}
                />
            ) : isEmpty ? "" : <div className="flex-center">{solveData.value}</div>}

            {isEmpty && (
                <div className="solve-tile-grid">
                    {range(1, 9).map((value) => (
                        <div className="solve-tile-grid-element flex-center" key={value}>
                            {solveData.hints[value - 1] ? value : ""}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
