import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  keybinds: {
    FORWARD: "right",
    BACKWARD: "left",
    EASY: "1",
    MEDIUM: "2",
    HARD: "3",
    TOGGLE_REVEAL: "space",
    SET_EDIT: "e",
    HIDE: "esc"
  },
  theme: "dark"
};

const reducers = {
  toggleTheme: (state, _) => {
    const theme = state.theme;

    state.theme = theme === "light" ? "dark" : "light";
  }
};

// in case we decice to add more theme variants in the future, a selector is good
export const darkSelector = createSelector(
  [state => state.settings.theme],
  theme => theme === "dark"
);

const { reducer: settingsReducer, actions } = createSlice({
  name: "settings",
  initialState,
  reducers
});

module.exports = {
  ...module.exports,
  settingsReducer,
  ...actions
};
