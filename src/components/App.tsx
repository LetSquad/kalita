import React from "react";
import { WithErrorBoundaries } from "./utils/WithErrorBoundaries";
import { RootRouter } from "./RootRouter";

export default function App() {
    return (
        <WithErrorBoundaries>
            <RootRouter />
        </WithErrorBoundaries>
    );
}
