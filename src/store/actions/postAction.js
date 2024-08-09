import {
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  RESET_SUCCESS_MESSAGE,
  RESET_FAILED_MESSAGE,
  LOADING,
} from "../../constants";

export const createPostAction = (data, router) => {
  return {
    type: CREATE_POST,
    data,
    router,
  };
};

export const updatePostAction = (data) => {
  return {
    type: UPDATE_POST,
    data,
  };
};

export const deletePostAction = (id, data) => {
  return {
    type: DELETE_POST,
    id,
    data,
  };
};

export const resetSuccessMessage = () => {
  return {
    type: RESET_SUCCESS_MESSAGE,
  };
};

export const resetFailedMessage = () => {
  return {
    type: RESET_FAILED_MESSAGE,
  };
};

export const loadingAction = (payload) => {
  return {
    type: LOADING,
    payload,
  };
};
