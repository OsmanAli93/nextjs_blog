import { REGISTER_USER, LOADING } from "@/constants";

export const registerUserAction = (data, navigate) => {
  return {
    type: REGISTER_USER,
    data,
    navigate,
  };
};

export const loadingAction = (payload) => {
  return {
    type: LOADING,
    payload,
  };
};
