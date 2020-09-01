import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import { Paper, Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import { setWeight, backward, forward, cardContent } from "../../src/cards";

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

  const edit = useSelector(state => state.cards.edit);

  const handleDiff = option => {
    dispatch(setWeight({ option, cardIndex }));
  };

  const handlePrev = () => dispatch(backward());
  const handleNext = () => dispatch(forward());

  if (cardIndex < 0) return <></>;

  return (
    <Paper className={classes.options}>
      {!edit ? (
        <>
          <Button className={classes.option} onClick={() => handleDiff("easy")}>
            Easy
          </Button>
          <Button
            className={classes.option}
            onClick={() => handleDiff("medium")}
          >
            Medium
          </Button>
          <Button className={classes.option} onClick={() => handleDiff("hard")}>
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
