import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { createSlice, createSelector } from "@reduxjs/toolkit";

// list of keyboard shortcuts
const initialState = {
  keybinds: {
    FORWARD: ["right", "l"],
    BACKWARD: ["left", "h"],
    EASY: "1",
    MEDIUM: "2",
    HARD: "3",
    TOGGLE_REVEAL: "r",
    SET_EDIT: "e",
    ESC: "esc",
  },
  theme: "dark",
  showWeight: false,
  showIndex: false,
};

const reducers = {
  toggleTheme: (state, _) => {
    const theme = state.theme;

    state.theme = theme === "light" ? "dark" : "light";
  },
  toggleWeight: (state, _) => {
    state.showWeight = !state.showWeight;
  },
  toggleIndex: (state, _) => {
    state.showIndex = !state.showIndex;
  },
};

// in case we decice to add more theme variants in the future, a selector is good
export const darkSelector = createSelector(
  [(state) => state.settings.theme],
  (theme) => theme === "dark"
);

const { reducer, actions } = createSlice({
  name: "settings",
  initialState,
  reducers,
});

export const settingsReducer = persistReducer(
  {
    key: "settings",
    storage,
  },
  reducer
);

module.exports = {
  ...module.exports,
  settingsReducer,
  ...actions,
};
