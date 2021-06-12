import React, { lazy } from "react";
import {
    BrowserRouter as Router, Redirect, Route, Switch
} from "react-router-dom";
import { NotFoundErrorScreen } from "./utils/NotFoundErrorScreen";
import { WithSuspense } from "./utils/WithSuspense";

const Table = lazy(() => import("./ModelPortfolioTable/ModelPortfolioTable"));

export function RootRouter() {
    return (
        <Router>
            <div>
                <WithSuspense>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/table" />
                        </Route>
                        <Route
                            exact path="/table"
                            component={Table}
                        />
                        <Route exact path="/not-found" component={NotFoundErrorScreen} />
                        <Redirect to="/not-found" />
                    </Switch>
                </WithSuspense>
            </div>
        </Router>
    );
}
