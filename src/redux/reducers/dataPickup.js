import {
  ADD_DATA_CALCULATE,
  RELOAD_DATA_CALCULATE,
  ADD_DATA_ITEMS,
  RELOAD_DATA_ITEMS,
} from "../actions/inPickup";

let dataState = {
  data: [],
};

export const dataPickup = (state = dataState, action) => {
  switch (action.type) {
    case ADD_DATA_CALCULATE:
      return { ...state, data: [...state.data, action.payload] };
    case RELOAD_DATA_CALCULATE:
      return { ...state, data: [] };

    case ADD_DATA_ITEMS:
      return { ...state, data: action.payload };
    case RELOAD_DATA_ITEMS:
      return { ...state, data: [] };
    default:
      return state;
  }
};
