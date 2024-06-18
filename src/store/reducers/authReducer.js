import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
  LOADING,
} from "../../constants/index";

const initialState = {
  access_token: null,
  user: null,
  loading: false,
  errorMessage: "",
  successMessage: "",
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        access_token: action.payload,
        user: action.user,
        successMessage: action.message,
        loading: false,
      };
    case REGISTER_FAILED:
      return {
        ...state,
        successMessage: "",
        errorMessage: action.error,
        loading: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        access_token: action.payload,
        user: action.user,
        successMessage: action.message,
        errorMessage: "",
        loading: false,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        successMessage: "",
        errorMessage: action.error,
        loading: false,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        successMessage: action.message,
        errorMessage: "",
        loading: false,
      };
    case LOGOUT_FAILED:
      return {
        ...state,
        errorMessage: action.error,
        successMessage: "",
        loading: false,
      };
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};
