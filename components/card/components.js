import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import {
  Box,
  Button,
  Typography,
  TextField as MuiTextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { cardContent, editSelector } from "../../src/cards";

const useStyles = makeStyles(theme => ({
  card: {
    width: 300,
    minHeight: 400,

    display: "flex",
    userSelect: 'none'
  },
  content: {
    display: "block",
    flex: 1
  },
  character: {
    position: "relative",
    fontSize: 120,

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    margin: theme.spacing(1)
  },
  index: {
    position: "absolute",

    lineHeight: "initial",
    fontSize: 24,
    fontWeight: 600,
    opacity: 0.7
  },
  cardInfo: {
    display: "flex",
    flex: 2,
    justifyContent: "center",
    flexDirection: "column"
  }
}));

const useFieldStyles = makeStyles(theme => ({
  editTextField: {
    margin: theme.spacing(1)
  },
}));

// text field component
export const TextField = ({ display, edit, value, setValue, ...props }) => {
  const classes = useFieldStyles(); // default styles for every field
  const inputRef = useRef();

  const { inputProps: { focus, ...inputProps }, textFieldProps } = props;

  const handleEdit = event => setValue(event.target.value);

  // focus the input ref
  useEffect(() => {
    // console.log("useEffect", edit, focus)
    if (edit && focus) {
      // console.log("focusing")
      inputRef.current.focus();
    }
  }, [edit, display])

  if (edit)
    return (
      <MuiTextField
        className={classes.editTextField}
        onChange={handleEdit}
        value={value || ""}
        inputRef={inputRef}
        {...inputProps}
      />
    );

  if (!display) 
    return <></>;

  return (
    <Typography className={classes.textField} {...textFieldProps}>
      {value}
    </Typography>
  );
}

export const CardInfo = () => {
  const classes = useStyles();
  const [cardState, setCardState] = useState({});

  const { meaning, notes, index } = useSelector(cardContent);

  // update fields when index or field changes
  useEffect(() => setMeaning(meaning), [meaning, index]);
  useEffect(() => setNotes(notes), [notes, index]);

  const setMeaning = m => setCardState(s => ({ ...s, meaning: m }));
  const setNotes = n => setCardState(s => ({ ...s, notes: n }));

  const reveal = useSelector(state => state.cards.reveal);
  const edit = useSelector(editSelector);

  return (
    <Box className={classes.cardInfo}>
      <TextField 
        display={meaning && reveal}
        edit={edit}
        value={cardState.meaning}
        setValue={setMeaning}
        textFieldProps={{
          variant: "h4",
          component: "h1"
        }}
        inputProps={{
          label: "Meaning",
          variant: "outlined",
          focus: true
        }}
      />
      <TextField 
        display={notes && reveal}
        edit={edit}
        value={cardState.notes}
        setValue={setNotes}
        inputProps={{
          variant: "outlined",
          label: "Notes",
          rows: 4,
          multiline: true
        }}
      />
    </Box>
  );
}
