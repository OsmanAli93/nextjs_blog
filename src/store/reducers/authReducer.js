import {
  REGISTER_SUCCESS,
  LOADING,
  REGISTER_FAILED,
} from "../../constants/index";

const initialState = {
  access_token: null,
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
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};
