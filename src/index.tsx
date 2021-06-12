import * as React from "react";
import { render } from "react-dom";
import "./styles/globals.scss";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./components/App";

render((
    <Provider store={store}>
        <App />
    </Provider>
), document.querySelector("#app"));
