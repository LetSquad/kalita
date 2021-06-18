import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import tableReducer from "./table/tableReducer";
import sidebarMenuReducer from "./sidebarMenu/sidebarMenuReducer";

export const store = configureStore({
    reducer: {
        tableData: tableReducer,
        sidebarMenu: sidebarMenuReducer
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: [promise, thunk]
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
