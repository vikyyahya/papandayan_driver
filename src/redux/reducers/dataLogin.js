import {
  IS_STATUS_LOGIN,
  IS_LOADING_LOGIN,
  TOKEN,
  USER_ID,
} from "./../actions/inLogin";

let dataState = {
  isStatusLogin: false,
  isLoadingLogin: false,
  token: "",
  user_id: "",
};

export const dataLogin = (state = dataState, action) => {
  switch (action.type) {
    case IS_STATUS_LOGIN:
      return { ...state, isStatusLogin: action.payload };
    case IS_LOADING_LOGIN:
      return { ...state, isLoadingLogin: action.payload };
    case USER_ID:
      return { ...state, user_id: action.payload };
    case TOKEN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
};
