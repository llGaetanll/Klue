import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import { Paper, Button as MuiButton, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import {
  next,
  prev,
  forward,
  backward,
  cardContent,
  testingSelector,
  editSelector,
} from "../../src/cards";

const useStyles = makeStyles((theme) => ({
  options: {
    display: "flex",

    marginTop: theme.spacing(2),
  },
  option: {
    flex: 1,
  },
}));

// button wrapper that unfocuses onClick
const Button = ({ children, onClick, ...props }) => {
  const ref = useRef();

  const handleClick = (event) => {
    ref.current.blur(); // unfocus
    onClick(event);
  };

  return (
    <MuiButton ref={ref} onClick={handleClick} {...props}>
      {children}
    </MuiButton>
  );
};

const TestOptions = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const ref = useRef();

  const cardIndex = useSelector(
    createSelector(cardContent, (content) => content.index)
  );

  const test = useSelector(testingSelector);
  const edit = useSelector(editSelector);
  const history = useSelector((state) => state.cards.history);
  const range = useSelector((state) => state.cards.range);

  // testing mode options
  const handleDiff = (option) => dispatch(next(option));
  const handlePrev = () => {
    ref.current.blur(); // unfocus button after press
    dispatch(prev());
  };

  // edit mode options
  const handleForward = () => dispatch(forward());
  const handleBackward = () => dispatch(backward());

  if (!test) return <></>;

  return (
    <Paper className={classes.options}>
      {!edit ? (
        <>
          {/* <IconButton
            ref={ref}
            disabled={history.length < 1}
            className={classes.option}
            onClick={handlePrev}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton> */}
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
          <IconButton className={classes.option} onClick={handleBackward}>
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
          <IconButton className={classes.option} onClick={handleForward}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Paper>
  );
};

export default TestOptions;
