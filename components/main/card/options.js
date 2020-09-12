import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import { Paper, Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import { next, backward, forward, cardContent } from "../../../src/cards";

const useStyles = makeStyles(theme => ({
  options: {
    display: "flex",

    marginTop: theme.spacing(2)
  },
  option: {
    flex: 1
  }
}));

export const Options = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const cardIndex = useSelector(
    createSelector(
      cardContent,
      content => content.index
    )
  );

  const test = useSelector(state => state.cards.test);
  const edit = useSelector(state => state.cards.edit);
  const history = useSelector(state => state.cards.history);
  const range = useSelector(state => state.cards.range);

  const handleDiff = option => {
    dispatch(next(option));
  };

  const handlePrev = () => dispatch(backward());
  const handleNext = () => dispatch(forward());

  if (cardIndex < 0 || !test) return <></>;

  return (
    <Paper className={classes.options}>
      {!edit ? (
        <>
          <IconButton
            disabled={history.length < 1}
            className={classes.option}
            onClick={handlePrev}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
          <Button
            disabled={cardIndex < range[0] || cardIndex > range[1]}
            className={classes.option}
            onClick={() => handleDiff("easy")}
          >
            Easy
          </Button>
          <Button
            disabled={cardIndex < range[0] || cardIndex > range[1]}
            className={classes.option}
            onClick={() => handleDiff("medium")}
          >
            Medium
          </Button>
          <Button
            disabled={cardIndex < range[0] || cardIndex > range[1]}
            className={classes.option}
            onClick={() => handleDiff("hard")}
          >
            Hard
          </Button>
        </>
      ) : (
        <>
          <IconButton className={classes.option} onClick={handlePrev}>
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
          <IconButton className={classes.option} onClick={handleNext}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Paper>
  );
};
