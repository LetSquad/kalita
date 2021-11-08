import React, { lazy, useMemo } from "react";
import {
    HashRouter,
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";
import { NotFoundErrorScreen } from "./utils/NotFoundErrorScreen";
import { WithSuspense } from "./utils/WithSuspense";

const StartScreen = lazy(/* webpackChunkName: "startScreen" */() =>
    import("./StartScreen/StartScreen"));
const Dashboard = lazy(/* webpackChunkName: "dashboard" */() =>
    import("./Dashboard/Dashboard"));

export function RootRouter() {
    const routes = useMemo(() => (
        <WithSuspense>
            <Routes>
                <Route path="/" element={<StartScreen />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFoundErrorScreen />} />
            </Routes>
        </WithSuspense>
    ), []);

    if (process.env.NODE_ENV === "development") {
        return (
            <BrowserRouter>
                {routes}
            </BrowserRouter>
        );
    }
    return (
        <HashRouter>
            {routes}
        </HashRouter>
    );
}
