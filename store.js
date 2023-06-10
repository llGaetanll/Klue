import {
  configureStore,
  getDefaultMiddleware,
  combineReducers
} from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";

import { cardsReducer, settingsReducer } from "./src";

const rootReducer = combineReducers({
  cards: cardsReducer,
  settings: settingsReducer
});

export default configureStore({
  reducer: rootReducer,
  devTools: true, // TODO: disable in prod

  // for use with redux-persist
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});
