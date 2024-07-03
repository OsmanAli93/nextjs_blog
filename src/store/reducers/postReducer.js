import {
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILED,
  RESET_SUCCESS_MESSAGE,
  RESET_FAILED_MESSAGE,
} from "../../constants";

const initialState = {
  successMessage: "",
  errorMessage: "",
  loading: false,
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        successMessage: action.success,
        errorMessage: "",
        loading: false,
      };
    case CREATE_POST_FAILED:
      return {
        ...state,
        successMessage: "",
        errorMessage: action.error,
        loading: false,
      };
    case RESET_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: "",
      };
    case RESET_FAILED_MESSAGE:
      return {
        ...state,
        errorMessage: "",
      };
    default:
      return state;
  }
};
