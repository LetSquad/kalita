import { render } from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Loader } from "semantic-ui-react";

import "./styles/globals.scss";

import App from "./components/App";
import { persistor, store } from "./store";
import partsStyles from "./styles/parts.scss";

render(
    (
        <Provider store={store}>
            <PersistGate
                loading={(
                    <div className={partsStyles.loaderContainer}>
                        <Loader
                            active
                            inline="centered"
                        />
                    </div>
                )}
                persistor={persistor}
            >
                <App />
            </PersistGate>
        </Provider>
    ), document.querySelector("#app")
);
