import { createSlice } from "@reduxjs/toolkit";

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
  setTheme: (state, { payload }) => {
    const theme = payload; // 'dark' or 'light'

    state.theme = theme;
  }
};

const { reducer: settingsReducer, actions } = createSlice({
  name: "settings",
  initialState,
  reducers
});

module.exports = {
  settingsReducer,
  ...actions
};
