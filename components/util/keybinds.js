import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { createSelector } from "@reduxjs/toolkit";

import { GlobalHotKeys } from "react-hotkeys";

import {
  forward,
  backward,
  setReveal,
  setMode,
  revertMode,
  next,
  editSelector
} from "../../src/cards";

/* Keybinds on the main page */
export const Main = ({ children }) => {
  const dispatch = useDispatch();

  const keybinds = useSelector(state => state.settings.keybinds);
  const reveal = useSelector(state => state.cards.reveal);
  const edit = useSelector(editSelector);

  const handleDiff = option => {
    dispatch(next(option));
  };

  const handlers = {
    FORWARD: () => dispatch(forward()),
    BACKWARD: () => dispatch(backward()),

    EASY: () => handleDiff("easy"),
    MEDIUM: () => handleDiff("medium"),
    HARD: () => handleDiff("hard"),

    TOGGLE_REVEAL: useCallback(() => dispatch(setReveal(!reveal)), [reveal]),
    SET_EDIT: useCallback((event) => {
      event.preventDefault();
      if (!edit) dispatch(setMode("edit"));
    }, [edit]),

    ESC: useCallback(() => {
      // if (edit) dispatch(setMode("normal"));
      if (edit) dispatch(revertMode());
      if (reveal) dispatch(setReveal(false));
    })
  };

  return (
    <>
      <GlobalHotKeys
        keyMap={keybinds}
        handlers={handlers}
        allowChanges={true}
        style={{ display: "flex", flex: 1 }}
      />
      {children}
    </>
  );
};
