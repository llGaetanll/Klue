import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import { Paper, Button as MuiButton, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import {
  next,
  prev,
  forward,
  backward,
  cardContent,
  testingSelector,
  editSelector,
} from "../../src/cards";

import theme from "../../util/theme";

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
    <Paper
      css={{
        display: "flex",

        marginTop: theme.spacing(2),
      }}
    >
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
            css={{ flex: 1 }}
            onClick={() => handleDiff("easy")}
          >
            Easy
          </Button>
          <Button
            disabled={cardIndex < range[0] || cardIndex > range[1]}
            css={{ flex: 1 }}
            onClick={() => handleDiff("medium")}
          >
            Medium
          </Button>
          <Button
            disabled={cardIndex < range[0] || cardIndex > range[1]}
            css={{ flex: 1 }}
            onClick={() => handleDiff("hard")}
          >
            Hard
          </Button>
        </>
      ) : (
        <>
          <IconButton css={{ flex: 1 }} onClick={handleBackward}>
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
          <IconButton css={{ flex: 1 }} onClick={handleForward}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Paper>
  );
};

export default TestOptions;
