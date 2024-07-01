"use client";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./index";
import Loader from "../components/Loader/Loader";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Loader />}>
        {children}
      </PersistGate>
    </Provider>
  );
}
