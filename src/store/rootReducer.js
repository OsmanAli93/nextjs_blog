import { combineReducers } from "redux";
import { authReducer } from "./reducers/authReducer";

import { LOGOUT_SUCCESS } from "../constants";
import storage from "redux-persist/lib/storage";

const appReducer = combineReducers({
  auth: authReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) {
    storage.removeItem("persist:root");

    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
