import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import {
  Typography,
  Box,
  Card as MuiCard,
  CardContent,
} from "@material-ui/core";

import { TextField } from "./components";
import { cardContent, editSelector } from "../../src/cards";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 300,
    minHeight: 400,

    display: "flex",
    userSelect: "none",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  character: {
    position: "relative",
    fontSize: 120,

    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    margin: theme.spacing(1),
  },
  index: {
    position: "absolute",

    lineHeight: "initial",
    fontSize: 24,
    fontWeight: 600,
    opacity: 0.7,
  },
  title: {
    textAlign: "center",
  },
}));

// actual card component
export const Card = () => {
  const classes = useStyles();
  const [cardState, setCardState] = useState({});

  const { character, meaning, notes, index } = useSelector(cardContent);
  // update fields when index or field changes
  useEffect(() => setMeaning(meaning), [meaning, index]);
  useEffect(() => setNotes(notes), [notes, index]);

  const setMeaning = (m) => setCardState((s) => ({ ...s, meaning: m }));
  const setNotes = (n) => setCardState((s) => ({ ...s, notes: n }));

  const reveal = useSelector((state) => state.cards.reveal);
  const edit = useSelector(editSelector);

  return (
    <MuiCard className={classes.card}>
      <CardContent className={classes.content}>
        <Box flex={1} className={classes.content}>
          <Typography className={classes.character} variant="h1">
            {character}
          </Typography>
        </Box>
        <Box flex={2} className={classes.content}>
          {reveal || (
            <>
              <TextField
                display={meaning}
                edit={edit}
                value={cardState.meaning}
                setValue={setMeaning}
                textFieldProps={{
                  variant: "h4",
                  component: "h1",
                }}
                inputProps={{
                  label: "Meaning",
                  variant: "outlined",
                  focus: true,
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
                  multiline: true,
                }}
              />
            </>
          )}
        </Box>
      </CardContent>
    </MuiCard>
  );
};
