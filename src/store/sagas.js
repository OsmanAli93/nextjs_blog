import { REGISTER_USER, REGISTER_SUCCESS, REGISTER_FAILED } from "../constants";

import { takeLatest, takeEvery, put, call } from "redux-saga/effects";
import authService from "../services/authService/authService";

function* registerUser(action) {
  const results = yield call(authService.register, action.data);
  console.log("saga", results);

  if (results.status >= 200 && results.status < 400) {
    yield put({
      type: REGISTER_SUCCESS,
      payload: results.data.token,
      success: results.data.message,
    });
  } else if (results.response.status >= 400 && results.response.status < 600) {
    console.log(results);
    yield put({
      type: REGISTER_FAILED,
      error: results.response.data.message,
    });
  }
}

function* sagaWatcher() {
  yield takeLatest(REGISTER_USER, registerUser);
}

export default sagaWatcher;
