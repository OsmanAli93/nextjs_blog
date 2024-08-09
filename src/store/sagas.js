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
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILED,
  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_FAILED,
  CREATE_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILED,
  UPDATE_POST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILED,
  DELETE_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILED,
} from "../constants";

import { takeLatest, takeEvery, put, call } from "redux-saga/effects";

import authService from "../services/authService/authService";
import profileService from "../services/profileService/profileService";
import userService from "../services/userService/userService";
import postService from "../services/postService/postService,";

function* registerUser(action) {
  const results = yield call(authService.register, action.data);

  if (results?.code === "ERR_NETWORK") {
    yield put({
      type: REGISTER_FAILED,
      error: results.message,
    });
  }

  if (results?.status >= 200 && results.status < 400) {
    yield put({
      type: REGISTER_SUCCESS,
      payload: results.data.access_token,
      user: results.data.user,
      success: results.data.message,
    });

    return action.router.push("/email/verify");
  }

  if (results?.response.status >= 400 && results.response.status < 600) {
    console.log(results);
    yield put({
      type: REGISTER_FAILED,
      error: results.response.data.message,
    });
  }
}

function* loginUser(action) {
  const results = yield call(authService.login, action.user);

  if (results?.code === "ERR_NETWORK") {
    yield put({
      type: LOGIN_FAILED,
      error: results.message,
    });
  }

  if (results?.status >= 200 && results.status < 400) {
    console.log(results);
    yield put({
      type: LOGIN_SUCCESS,
      payload: results.data.access_token,
      user: results.data.user,
      success: results.data.message,
    });

    return action.router.push("/");
  }

  if (results?.response.status >= 400 && results.response.status < 600) {
    yield put({
      type: LOGIN_FAILED,
      error: results.response.data.message,
    });
  }
}

function* logoutUser(action) {
  const results = yield call(authService.logout);

  if (results?.code === "ERR_NETWORK") {
    yield put({
      type: LOGOUT_FAILED,
      error: results.message,
    });
  }

  if (results?.status >= 200 && results.status < 400) {
    console.log(results);
    yield put({
      type: LOGOUT_SUCCESS,
      success: results.data.message,
    });

    return action.router.push("/");
  }

  if (results?.response.status >= 400 && results.response.status < 600) {
    console.log(results);
    yield put({
      type: LOGOUT_FAILED,
      error: results.response.data.message,
    });
  }
}

function* updateProfile(action) {
  const results = yield call(profileService.update, action.id, action.data);

  if (results?.code === "ERR_NETWORK") {
    yield put({
      type: UPDATE_PROFILE_FAILED,
      error: results.message,
    });
  }

  if (results.status >= 200 && results.status < 400) {
    yield put({
      type: UPDATE_PROFILE_SUCCESS,
      payload: results.data.user,
      success: results.data.message,
    });
  }

  if (results?.response?.status >= 400 && results.response?.status < 600) {
    yield put({
      type: UPDATE_PROFILE_FAILED,
      error: results.response.data.message,
    });
  }
}

function* getUser(action) {
  const results = yield call(userService.getUser);

  if (results?.code === "ERR_NETWORK") {
    yield put({
      type: GET_USER_FAILED,
      error: results.message,
    });
  }

  if (results.status >= 200 && results.status < 400) {
    console.log("saga", results);
    yield put({
      type: GET_USER_SUCCESS,
      payload: results.data,
    });
  }

  if (results?.response?.status >= 400 && results.response?.status < 600) {
    yield put({
      type: GET_USER_FAILED,
      error: results.response.data.message,
    });
  }
}

function* createPost(action) {
  const results = yield call(postService.create, action.data);

  if (results?.code === "ERR_NETWORK") {
    yield put({
      type: CREATE_POST_FAILED,
      error: results.message,
    });
  }

  if (results?.status >= 200 && results.status < 400) {
    yield put({
      type: CREATE_POST_SUCCESS,
      success: results.data.message,
    });

    return action.router.push("/");
  }

  if (results?.response.status >= 400 && results.response.status < 600) {
    console.log(results);
    yield put({
      type: CREATE_POST_FAILED,
      error: results.response.statusText,
    });
  }
}

function* updatePost(action) {
  const results = yield call(postService.update, action.id, action.data);

  if (results?.code === "ERR_NETWORK") {
    yield put({
      type: UPDATE_POST_FAILED,
      error: results.message,
    });
  }

  if (results?.status >= 200 && results.status < 400) {
    yield put({
      type: UPDATE_POST_SUCCESS,
      payload: results.data.posts,
      success: results.data.message,
    });
  }

  if (results?.response?.status >= 400 && results.response.status < 600) {
    console.log(results);
    yield put({
      type: UPDATE_POST_FAILED,
      error: results.response.statusText,
    });
  }
}

function* deletePost(action) {
  const results = yield call(postService.delete, action.id, action.data);

  if (results?.code === "ERR_NETWORK") {
    yield put({
      type: DELETE_POST_FAILED,
      error: results.message,
    });
  }

  if (results?.status >= 200 && results.status < 400) {
    console.log(results);
    yield put({
      type: DELETE_POST_SUCCESS,
      payload: results.data.posts,
      success: results.data.message,
    });
  }

  if (results?.response?.status >= 400 && results.response.status < 600) {
    console.log(results);
    yield put({
      type: DELETE_POST_FAILED,
      error: results.response.statusText,
    });
  }
}

function* sagaWatcher() {
  yield takeLatest(REGISTER_USER, registerUser);
  yield takeLatest(LOGIN_USER, loginUser);
  yield takeLatest(LOGOUT_USER, logoutUser);
  yield takeLatest(UPDATE_PROFILE, updateProfile);
  yield takeEvery(GET_USER, getUser);
  yield takeLatest(CREATE_POST, createPost);
  yield takeLatest(UPDATE_POST, updatePost);
  yield takeLatest(DELETE_POST, deletePost);
}

export default sagaWatcher;
