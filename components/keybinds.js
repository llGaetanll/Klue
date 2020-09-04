import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import { GlobalHotKeys } from "react-hotkeys";

import {
  forward,
  backward,
  setReveal,
  setEdit,
  next,
  cardContent
} from "../src/cards";

/* Keybinds on the main page */
export const Main = ({ children }) => {
  const dispatch = useDispatch();

  const keybinds = useSelector(state => state.settings.keybinds);
  const reveal = useSelector(state => state.cards.reveal);
  const edit = useSelector(state => state.cards.edit);

  const cardIndex = useSelector(
    createSelector(
      cardContent,
      content => content.index
    )
  );

  const handleDiff = option => {
    dispatch(next(option));
  };

  const handlers = {
    FORWARD: useCallback(() => {
      if (edit) dispatch(forward());
    }, [reveal]),
    BACKWARD: () => dispatch(backward()),
    EASY: () => handleDiff("easy"),
    MEDIUM: () => handleDiff("medium"),
    HARD: () => handleDiff("hard"),
    TOGGLE_REVEAL: useCallback(() => dispatch(setReveal(!reveal)), [reveal]),
    SET_EDIT: useCallback(() => {
      if (!edit) dispatch(setEdit(true));
    }, [edit]),
    HIDE: useCallback(() => {
      if (edit) dispatch(setEdit(false));
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
