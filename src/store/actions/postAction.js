import {
  CREATE_POST,
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
