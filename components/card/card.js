import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { motion } from "framer-motion";

import {
  Box,
  Button,
  Typography,
  Card as MuiCard,
  CardContent,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DoneAllIcon from "@material-ui/icons/DoneAll";

import { EndOfTest } from '../statistics'

import { setMode, updCard, cardContent, testingSelector, editSelector } from "../../src/cards";

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
  }
}));

const ModifyCard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const inputRef = useRef();

  const [cardState, setCardState] = useState({
    meaning: "",
    notes: ""
  });

  const { meaning = "", notes = "", index } = useSelector(cardContent);

  // update fields when index or field changes
  useEffect(() => setMeaning(meaning), [meaning, index]);
  useEffect(() => setNotes(notes), [notes, index]);

  const handleChangeMeaning = event => setMeaning(event.target.value);
  const handleChangeNotes = event => setNotes(event.target.value);

  const setMeaning = meaning => setCardState(s => ({ ...s, meaning }));
  const setNotes = notes => setCardState(s => ({ ...s, notes }));

  const handleCommitChanges = () =>
    dispatch(updCard({ index, newData: cardState }));

  const handleCancel = () => dispatch(setMode("normal"));

  useEffect(() => {
    inputRef.current.focus();
  }, [index]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <TextField
        className={classes.input}
        label="Meaning"
        variant="outlined"
        value={cardState.meaning}
        onChange={handleChangeMeaning}
        inputRef={inputRef}
      />
      <TextField
        className={classes.input}
        variant="outlined"
        label="Notes"
        value={cardState.notes}
        onChange={handleChangeNotes}
        rows={4}
        multiline
      />
      <Box display="flex" justifyContent="center">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          color="primary"
          onClick={handleCommitChanges}
          startIcon={<DoneAllIcon />}
          disabled={meaning === cardState.meaning && notes === cardState.notes}
        >
          Update Card
        </Button>
      </Box>
    </Box>
  );
};

const useInfoStyles = makeStyles(theme => ({
  cardInfo: {
    display: "flex",
    flexDirection: "column"
  },
  meaning: {
    fontFamily: "Inter",
    fontWeight: 700
  },
  notes: {}
}));

const CardInfo = () => {
  const classes = useInfoStyles();
  const meaning = useSelector(
    createSelector(
      cardContent,
      content => content.meaning
    )
  );
  const notes = useSelector(
    createSelector(
      cardContent,
      content => content.notes
    )
  );

  return (
    <Box className={classes.cardInfo}>
      {meaning && (
        <Typography variant="h4" component="h1" className={classes.meaning}>
          {meaning}
        </Typography>
      )}
      {notes && (
        <Typography className={classes.notes}>
          {notes}
        </Typography>
      )}
    </Box>
  );
};


export const Card = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [animationState, setAnimationState] = useState("quiz");

  const character = useSelector(
    createSelector(
      cardContent,
      content => content.character
    )
  );

  const index = useSelector(
    createSelector(
      cardContent,
      content => content.index
    )
  );

  const weight = useSelector(
    createSelector(
      cardContent,
      content => content.weight
    )
  );

  const test = useSelector(testingSelector);
  const edit = useSelector(editSelector);
  const reveal = useSelector(state => state.cards.reveal);

  // update animation state
  useEffect(() => {
    if (edit) {
      setAnimationState("edit");
      return;
    }

    if (reveal) {
      setAnimationState("reveal");
      return;
    }

    setAnimationState("quiz");
  }, [edit, reveal]);

  if (index < 0) {
    return <EndOfTest />
  }

  return (
    <MuiCard className={classes.card}>
      <CardContent className={classes.content}>
        <motion.div
          animate={animationState}
          style={{ width: "100%", height: "100%" }}
        >
          <motion.div
            variants={{
              quiz: {
                y: 120,
                scale: 1
              },
              edit: {
                y: 0,
                scale: 0.8
              },
              reveal: {
                y: 0,
                scale: 0.8
              }
            }}
          >
            <Typography className={classes.character} variant="h1">
              {character}
            </Typography>
          </motion.div>
          {edit && <ModifyCard />}
          {!edit && reveal && <CardInfo />}
        </motion.div>
      </CardContent>
    </MuiCard>
  );
};
