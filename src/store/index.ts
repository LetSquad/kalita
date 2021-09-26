import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import {
    FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE
} from "redux-persist/es/constants";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import electronCacheReducer from "./electronCache/electronCacheReducer";
import sidebarMenuReducer from "./sidebarMenu/sidebarMenuReducer";
import portfoliosReducer from "./portfolios/portfoliosReducer";

const electronCachePersistConfig = {
    key: "electronCache",
    storage
};

const electronCachePersistedReducer = persistReducer(electronCachePersistConfig, electronCacheReducer);

export const store = configureStore({
    reducer: {
        portfolios: portfoliosReducer,
        sidebarMenu: sidebarMenuReducer,
        electronCache: electronCachePersistedReducer
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    }).prepend([promise, thunk])
});

export const persistor = persistStore(store);
persistor.persist();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
