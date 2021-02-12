export const ADD_DATA_CALCULATE = "ADD_DATA_CALCULATE";
export const RELOAD_DATA_CALCULATE = "RELOAD_DATA_CALCULATE";
export const ADD_DATA_ITEMS = "ADD_DATA_ITEMS";
export const RELOAD_DATA_ITEMS = "RELOAD_DATA_ITEMS";

export const addDataCalculate = (data) => ({
  type: ADD_DATA_CALCULATE,
  payload: data,
});

export const reloadDataCalculate = () => ({
  type: RELOAD_DATA_CALCULATE,
});

export const addDataItems = (data) => ({
  type: ADD_DATA_ITEMS,
  payload: data,
});

export const reloadDataItems = () => ({
  type: RELOAD_DATA_ITEMS,
});
