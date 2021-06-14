import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Loader } from "semantic-ui-react";
import { WithErrorBoundaries } from "./utils/WithErrorBoundaries";
import { RootRouter } from "./RootRouter";
import { persistor } from "../store";

export default function App() {
    return (
        <PersistGate
            loading={(
                <div>
                    <Loader active inline="centered" />
                </div>
            )} persistor={persistor}
        >
            <WithErrorBoundaries>
                <RootRouter />
            </WithErrorBoundaries>
        </PersistGate>
    );
}
