import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import tableReducer, { TableDataState } from "./tableReducer";

const persistConfig = {
    key: "root",
    storage
};

const tablePersistReducer = persistReducer<TableDataState>(persistConfig, tableReducer);

export const store = configureStore({
    reducer: {
        tableData: tablePersistReducer
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: [promise, thunk]
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
