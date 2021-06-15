import React, { lazy } from "react";
import {
    BrowserRouter as Router, Redirect, Route, Switch
} from "react-router-dom";
import { NotFoundErrorScreen } from "./utils/NotFoundErrorScreen";
import { WithSuspense } from "./utils/WithSuspense";

const Dashboard = lazy(/* webpackChunkName: "dashboard" */() =>
    import("./Dashboard/Dashboard"));

export function RootRouter() {
    return (
        <Router>
            <WithSuspense>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/dashboard" />
                    </Route>
                    <Route
                        exact path="/dashboard"
                        component={Dashboard}
                    />
                    <Route exact path="/not-found" component={NotFoundErrorScreen} />
                    <Redirect to="/not-found" />
                </Switch>
            </WithSuspense>
        </Router>
    );
}
