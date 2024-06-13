import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { getPersistConfig } from "redux-deep-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "@redux-saga/core";
import rootReducer from "./rootReducer";
import rootSaga from "./sagas";

// Define the persist config
const persistConfig = getPersistConfig({
  key: "root",
  storage,
  whitelist: ["auth.access_token"],
  timeout: 100,
  rootReducer,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: () => [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
