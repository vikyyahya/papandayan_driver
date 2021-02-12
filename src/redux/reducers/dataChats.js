import {
  GET_ROOM_ID,
  ADD_DATA_CHATS,
  MORE_DATA_CHATS,
  PUSH_DATA_CHATS,
  PUSH_DATA_LOADING,
  RELOAD_DATA_CHATS,
} from "../actions/inChat";

let dataState = {
  data: [],
  roomId: 0,
};

export const dataChats = (state = dataState, action) => {
  switch (action.type) {
    case GET_ROOM_ID:
      return { ...state, roomId: action.payload };
    case ADD_DATA_CHATS:
      return { ...state, data: action.payload };
    case MORE_DATA_CHATS:
      return { ...state, data: [...state.data, ...action.payload] };
    case PUSH_DATA_LOADING:
      return { ...state, data: [...action.data, ...state.data] };
    case PUSH_DATA_CHATS:
      return { ...state, data: [...state.data, action.payload] };
    case RELOAD_DATA_CHATS:
      return { ...state, data: [], roomId: 0 };
    default:
      return state;
  }
};
