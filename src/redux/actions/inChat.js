export const GET_ROOM_ID = "GET_ROOM_ID";
export const ADD_DATA_CHATS = "ADD_DATA_CHATS";
export const MORE_DATA_CHATS = "MORE_DATA_CHATS";
export const PUSH_DATA_CHATS = "PUSH_DATA_CHATS";
export const PUSH_DATA_LOADING = "PUSH_DATA_LOADING";
export const RELOAD_DATA_CHATS = "RELOAD_DATA_CHATS";

export const addDataChats = (data) => ({
  type: ADD_DATA_CHATS,
  payload: data,
});

export const moreDataChats = (data) => ({
  type: MORE_DATA_CHATS,
  payload: data,
});

export const pushDataChats = (data) => ({
  type: PUSH_DATA_CHATS,
  payload: data,
});

export const pushDataLoading = (data) => ({
  type: PUSH_DATA_LOADING,
  data: data,
});

export const reloadDataChats = () => ({
  type: RELOAD_DATA_CHATS,
});

export const getRoomId = (roomId) => ({
  type: GET_ROOM_ID,
  payload: roomId,
});
