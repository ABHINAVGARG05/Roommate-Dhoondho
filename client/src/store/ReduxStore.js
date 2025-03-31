import secureLocalStorage from "react-secure-storage";
import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";
import thunk from "redux-thunk";
import { reducers } from "../reducers";

function saveToLocalStorage(store) {
  try {
      const serializedStore = JSON.stringify(store);
      // console.log(serializedStore)
      window.secureLocalStorage.setItem('store', serializedStore);
  } catch(e) {
    return undefined;
  }
}

function loadFromLocalStorage() {
  try {
      const serializedStore = window.secureLocalStorage.getItem('store');
      if(serializedStore === null) return undefined;
      return JSON.parse(serializedStore);
  } catch(e) {
      return undefined;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistedState = loadFromLocalStorage();

const store = createStore(reducers, persistedState, composeEnhancers(applyMiddleware(thunk)));

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;