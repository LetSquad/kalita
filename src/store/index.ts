import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import tableReducer from "./table/tableReducer";
import sidebarMenuReducer, { SidebarMenuState } from "./sidebarMenu/sidebarMenuReducer";

const persistConfig = {
    key: "root",
    storage
};

const sidebarMenuPersistReducer = persistReducer<SidebarMenuState>(persistConfig, sidebarMenuReducer);

export const store = configureStore({
    reducer: {
        tableData: tableReducer,
        sidebarMenu: sidebarMenuPersistReducer
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: [promise, thunk]
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
