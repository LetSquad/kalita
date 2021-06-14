import React, { lazy } from "react";
import {
    BrowserRouter as Router, Redirect, Route, Switch
} from "react-router-dom";
import { NotFoundErrorScreen } from "./utils/NotFoundErrorScreen";
import { WithSuspense } from "./utils/WithSuspense";

const Table = lazy(/* webpackChunkName: "model-portfolio-table" */() => import("./ModelPortfolioTable/ModelPortfolioTable"));

export function RootRouter() {
    return (
        <Router>
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
        </Router>
    );
}
