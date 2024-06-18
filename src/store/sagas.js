import {
  REGISTER_USER,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_USER,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
} from "../constants";

import { takeLatest, takeEvery, put, call } from "redux-saga/effects";
import authService from "../services/authService/authService";

function* registerUser(action) {
  const results = yield call(authService.register, action.data);

  if (results.code === "ERR_NETWORK") {
    yield put({
      type: REGISTER_FAILED,
      error: results.message,
    });
  }

  if (results.status >= 200 && results.status < 400) {
    yield put({
      type: REGISTER_SUCCESS,
      payload: results.data.token,
      success: results.data.message,
    });

    return action.router.push("/");
  }

  if (results.response.status >= 400 && results.response.status < 600) {
    console.log(results);
    yield put({
      type: REGISTER_FAILED,
      error: results.response.data.message,
    });
  }
}

function* loginUser(action) {
  const results = yield call(authService.login, action.user);
  console.log("saga", results);

  if (results.code === "ERR_NETWORK") {
    yield put({
      type: LOGIN_FAILED,
      error: results.message,
    });
  }

  if (results.status >= 200 && results.status < 400) {
    console.log(results);
    yield put({
      type: LOGIN_SUCCESS,
      payload: results.data.access_token,
      user: results.data.user,
      success: results.data.message,
    });

    return action.router.push("/");
  }

  if (results.response.status >= 400 && results.response.status < 600) {
    console.log(results);
    yield put({
      type: LOGIN_FAILED,
      error: results.response.data.message,
    });
  }
}

function* logoutUser(action) {
  const results = yield call(authService.logout);
  console.log("saga", results);

  if (results.code === "ERR_NETWORK") {
    yield put({
      type: LOGOUT_FAILED,
      error: results.message,
    });
  }

  if (results.status >= 200 && results.status < 400) {
    console.log(results);
    yield put({
      type: LOGOUT_SUCCESS,
      success: results.data.message,
    });

    return action.router.push("/");
  }

  if (results.response.status >= 400 && results.response.status < 600) {
    console.log(results);
    yield put({
      type: LOGOUT_FAILED,
      error: results.response.data.message,
    });
  }
}

function* sagaWatcher() {
  yield takeLatest(REGISTER_USER, registerUser);
  yield takeLatest(LOGIN_USER, loginUser);
  yield takeLatest(LOGOUT_USER, logoutUser);
}

export default sagaWatcher;
