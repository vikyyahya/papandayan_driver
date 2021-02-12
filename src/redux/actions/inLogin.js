export const IS_STATUS_LOGIN = "IS_STATUS_LOGIN";
export const IS_LOADING_LOGIN = "IS_LOADING_LOGIN";
export const TOKEN = "TOKEN";
export const USER_ID = "USER_ID";

export const onStatusLogin = (data) => ({
  type: IS_STATUS_LOGIN,
  payload: data,
});

export const onLoadingLogin = (data) => ({
  type: IS_LOADING_LOGIN,
  payload: data,
});

export const onUserId = (data) => ({
  type: USER_ID,
  payload: data,
});

export const onToken = (data) => ({
  type: TOKEN,
  payload: data,
});
