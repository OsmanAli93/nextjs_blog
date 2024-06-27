import {
  REGISTER_USER,
  LOGIN_USER,
  LOGOUT_USER,
  UPDATE_PROFILE,
  RESET_SUCCESS_MESSAGE,
  RESET_FAILED_MESSAGE,
  LOADING,
} from "@/constants";

export const registerUserAction = (data, navigate) => {
  return {
    type: REGISTER_USER,
    data,
    navigate,
  };
};

export const loginUserAction = (user, navigate) => {
  return {
    type: LOGIN_USER,
    user,
    navigate,
  };
};

export const logoutUserAction = (navigate) => {
  return {
    type: LOGOUT_USER,
    navigate,
  };
};

export const updateProfileAction = (id, data) => {
  return {
    type: UPDATE_PROFILE,
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
