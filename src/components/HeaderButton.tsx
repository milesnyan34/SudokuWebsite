import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { AppPage, setPage } from "../redux/main/mainSlice";
import { selectPage } from "../redux/selectors";

/**
 * Button for the app header
 * @param param0
 */
export const HeaderButton = ({ page, text }: { page: AppPage; text: string }) => {
    const currentPage = useSelector(selectPage);
    const dispatch = useDispatch();

    return (
        <button
            className={classNames(
                "header-button",
                currentPage === page ? "header-button-active" : ""
            )}
            onClick={() => dispatch(setPage(page))}
        >
            {text}
        </button>
    );
};
    