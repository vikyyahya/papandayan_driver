import { createStore, applyMiddleware, combineReducers } from "redux";
import { dataLogin } from "../redux/reducers/dataLogin";
import { dataChats } from "../redux/reducers/dataChats";
import { dataPickup } from "../redux/reducers/dataPickup";
// import { dataChats } from './reducers/dataChats';

const rootReducer = combineReducers({
  dataLogin,
  dataChats,
  dataPickup,
});

export default createStore(rootReducer);
