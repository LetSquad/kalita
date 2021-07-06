import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import electronCacheReducer from "./electronCache/electronCacheReducer";
import sidebarMenuReducer from "./sidebarMenu/sidebarMenuReducer";
import tableReducer from "./table/tableReducer";

const electronCachePersistConfig = {
    key: "electronCache",
    storage
};

const electronCachePersistedReducer = persistReducer(electronCachePersistConfig, electronCacheReducer);

export const store = configureStore({
    reducer: {
        tableData: tableReducer,
        sidebarMenu: sidebarMenuReducer,
        electronCache: electronCachePersistedReducer
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend([promise, thunk])
});

export const persistor = persistStore(store);
persistor.persist();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
