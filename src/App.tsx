import { useSelector } from "react-redux";
import { HeaderButton } from "./components/HeaderButton";
import "./index.css";
import { AppPage } from "./redux/main/mainSlice";
import { selectPage } from "./redux/selectors";
import CreatePage from "./components/pages/create/CreatePage";
import SolvePage from "./components/pages/solve/SolvePage";

const App = () => {
    const page = useSelector(selectPage);

    return (
        <div id="app">
            <div className="header flex-center">
                <HeaderButton page={AppPage.Create} text="Create" />
                <HeaderButton page={AppPage.Solve} text="Solve" />
            </div>

            {page === AppPage.Create ? <CreatePage /> : <SolvePage />}
        </div>
    );
};

export default App;
