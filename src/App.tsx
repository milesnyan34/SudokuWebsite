import { HeaderButton } from "./components/HeaderButton";
import "./index.css";
import { AppPage } from "./redux/main/mainSlice";

const App = () => {
    return <div id="app">
        <div className="header flex-center">
            <HeaderButton page={AppPage.Create} text="Create" />
            <HeaderButton page={AppPage.Solve} text="Solve" />
        </div>
    </div>;
};

export default App;
