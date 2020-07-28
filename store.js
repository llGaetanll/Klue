import {
  createSlice,
  configureStore,
  getDefaultMiddleware,
  createSelector
} from "@reduxjs/toolkit";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { randFromInterval } from "./util";

const slice = createSlice({
  name: "cards",
  initialState: {
    range: [],
    index: 0,
    card: {
      reveal: false,
      edit: false
    },
    // dataset
    kanji: [],
    settings: {
      keybinds: {
        FORWARD: "right",
        BACKWARD: "left",
        TOGGLE_REVEAL: "space",
        SET_EDIT: "e",
        REM_EDIT: "esc"
      }
    }
  },
  reducers: {
    setReveal: (state, { payload }) => {
      if (!state.card.edit) state.card.reveal = payload;
    },
    setRange: (state, { payload }) => {
      state.range = payload;
    },
    setIndex: (state, { payload }) => {
      // bound check
      if (payload < 0) payload = 0;
      if (payload > state.kanji.length - 1) payload = state.kanji.length - 1;

      state.index = payload;
    },
    forward: (state, { payload }) => {
      if (state.card.edit) state.index = state.index + 1;
      else state.index = randFromInterval(state.range[0], state.range[1]);
    },
    backward: (state, { payload }) => {
      if (state.card.edit) state.index = state.index - 1;
    },
    setEdit: (state, { payload }) => {
      state.card.edit = payload;
    },
    loadKanji: (state, { payload }) => {
      state.kanji = payload;

      // update range
      state.range = [0, payload.length - 1];
    },
    addKanji: (state, { payload }) => {
      state.kanji.push(payload);
    },
    remKanji: (state, { payload }) => {
      const { index, count = 1 } = payload;

      state.kanji.splice(index, count);
    },
    setKanji: (state, { payload }) => {
      const { index, newData } = payload;

      // only modify changing fields
      state.kanji[index] = { ...state.kanji[index], ...newData };
    }
  }
});

const cardContent = createSelector(
  state => state.kanji,
  state => state.index,
  (kanji, index) => ({
    character: kanji[index].char,
    meaning: kanji[index].meaning,
    notes: kanji[index].notes
  })
);

const { reducer, actions } = slice;

const persistConfig = {
  key: "root",
  version: 1,
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

module.exports = {
  store,
  reducer,
  cardContent,
  ...actions
};
