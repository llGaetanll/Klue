import { useEffect, useRef, useImperativeHandle } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Card as MuiCard,
  CardContent,
  TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { setKanji, cardContent } from "../store";

const useStyles = makeStyles(theme => ({
  card: {
    width: 300,
    height: 400,

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  character: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    margin: theme.spacing(1)
  },
  index: {
    position: "absolute",
    fontSize: 24,
    fontWeight: 600,
    opacity: 0.7,
    transform: "translateY(-50%)"
  }
}));

const CardInputs = ({ meaning, notes }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const inputRef = useRef();

  const index = useSelector(state => state.index);

  const setMeaning = meaning =>
    dispatch(setKanji({ index, newData: { meaning } }));
  const setNotes = notes => dispatch(setKanji({ index, newData: { notes } }));

  const handleChangeMeaning = event => setMeaning(event.target.value);
  const handleChangeNotes = event => setNotes(event.target.value);

  useEffect(() => {
    inputRef.current.focus();
  }, [index]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <TextField
        className={classes.input}
        label="Meaning"
        variant="outlined"
        value={meaning}
        onChange={handleChangeMeaning}
        inputRef={inputRef}
      />
      <TextField
        className={classes.input}
        variant="outlined"
        label="Notes"
        value={notes}
        onChange={handleChangeNotes}
        rows={4}
        multiline
      />
    </Box>
  );
};

const Card = () => {
  const classes = useStyles();

  const reveal = useSelector(state => state.card.reveal);
  const index = useSelector(state => state.index);
  const edit = useSelector(state => state.card.edit);

  const { character, meaning = "", notes = "" } = useSelector(cardContent);

  return (
    <MuiCard className={classes.card}>
      <CardContent>
        {edit && (
          <Typography variant="caption" className={classes.index}>
            {index + 1}
          </Typography>
        )}
        <Typography className={classes.character} variant="h1">
          {character}
        </Typography>
        {edit ? (
          <CardInputs meaning={meaning} notes={notes} />
        ) : (
          <>
            {reveal && (
              <>
                <Typography variant="h4" component="h1">
                  {meaning}
                </Typography>
                <Typography variant="p">{notes}</Typography>
              </>
            )}
          </>
        )}
      </CardContent>
    </MuiCard>
  );
};

export default Card;
