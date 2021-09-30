import * as React from "react";
import { render } from "react-dom";
import "./styles/globals.scss";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Loader } from "semantic-ui-react";
import { persistor, store } from "./store";
import App from "./components/App";
import partsStyles from "./styles/parts.scss";

render((
    <Provider store={store}>
        <PersistGate
            loading={(
                <div className={partsStyles.loaderContainer}>
                    <Loader active inline="centered" />
                </div>
            )}
            persistor={persistor}
        >
            <App />
        </PersistGate>
    </Provider>
), document.querySelector("#app"));
