import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import { GlobalHotKeys } from "react-hotkeys";

import { forward, backward, setReveal, setEdit } from "../store";

const KeyBinds = ({ children }) => {
  const dispatch = useDispatch();

  const keybinds = useSelector(state => state.settings.keybinds);
  const reveal = useSelector(state => state.card.reveal);
  const edit = useSelector(state => state.card.edit);

  const handlers = {
    FORWARD: () => dispatch(forward()),
    BACKWARD: () => dispatch(backward()),
    TOGGLE_REVEAL: useCallback(() => dispatch(setReveal(!reveal)), [reveal]),
    SET_EDIT: useCallback(() => {
      if (!edit) dispatch(setEdit(true));
    }, [edit]),
    REM_EDIT: useCallback(() => {
      if (edit) dispatch(setEdit(false));
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

export default KeyBinds;
