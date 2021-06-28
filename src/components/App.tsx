import React from "react";
import { ToastProvider } from "react-toast-notifications";
import { RootRouter } from "./RootRouter";
import { WithErrorBoundaries } from "./utils/WithErrorBoundaries";

export default function App() {
    return (
        <WithErrorBoundaries>
            <ToastProvider placement="bottom-right" autoDismiss autoDismissTimeout={10_000}>
                <RootRouter />
            </ToastProvider>
        </WithErrorBoundaries>
    );
}
