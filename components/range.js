import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import {
  Paper,
  Box,
  Button,
  Slider,
  Tooltip,
  IconButton,
  InputBase,
} from "@material-ui/core";

import UpdateIcon from "@material-ui/icons/Update";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DoneAllIcon from "@material-ui/icons/DoneAll";

import { makeStyles } from "@material-ui/core/styles";

import {
  setMode,
  setRange,
  testingSelector,
  normalSelector,
} from "../src/cards";

const useStyles = makeStyles((theme) => ({
  range: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    width: "100%",
    margin: `0 ${theme.spacing(2)}px`,
  },
  input: {
    padding: `0 ${theme.spacing(1)}px`,

    maxWidth: 70,
  },
}));

const cardCountSelector = createSelector(
  (state) => state.cards.data,
  (cards) => cards.length
);

const SliderInput = ({ value, setValue, length, ...props }) => {
  const classes = useStyles();
  const [valueState, setValueState] = useState();
  const cardsLength = useSelector(cardCountSelector);

  // update state on value change
  useEffect(() => setValueState(value), [value]);

  const handleChange = (event) => {
    const value = Number(event.target.value);

    if (value > cardsLength) return;
    if (value < 0) return; // although we only want values >= 1, this allows us to clear the field, we jsut ignore zero

    // allows us to clear the field
    if (value < 1) setValueState(value);
    else setValue(value);
  };

  return (
    <Paper className={classes.input}>
      <InputBase
        className={classes.inputBase}
        inputProps={{
          min: 1,
          max: length,
        }}
        value={valueState}
        onChange={handleChange}
        type="number"
        {...props}
      />
    </Paper>
  );
};

const ModeSwitch = () => {
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.cards.mode);

  const handleNormal = () => dispatch(setMode("normal"));

  const handleTest = () => {
    dispatch(setMode("test"));
  };

  switch (mode) {
    case "test":
      return (
        <Tooltip title="Back to Normal Mode">
          <span>
            <Button
              color="primary"
              onClick={handleNormal}
              startIcon={<CloseIcon />}
              style={{ whiteSpace: "nowrap" }}
            >
              Cancel Test
            </Button>
          </span>
        </Tooltip>
      );
    case "normal":
      return (
        <Button
          color="primary"
          onClick={handleTest}
          startIcon={<DoneAllIcon />}
          style={{ whiteSpace: "nowrap" }}
        >
          Start Test
        </Button>
      );
  }
};

const Range = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const normal = useSelector(normalSelector);
  const testing = useSelector(testingSelector);

  const range = useSelector((state) => state.cards.range);
  const editMode = useSelector((state) => state.cards.edit);
  const cardsLength = useSelector(cardCountSelector);

  // range state is always 1 more than the actual range (to prevent index 0 instead of 1 in UI)
  const [rangeState, setRangeState] = useState([]);

  // when redux range updates, update state
  useEffect(() => {
    setRangeState([range[0] + 1, range[1] + 1]);
  }, [range]);

  // when using manual inputs, its possible to have a range where
  // the first value is > than the second. setLo and setHi fix this
  const setLo = (lo) =>
    setRangeState((r) => (lo < r[1] ? [lo, r[1]] : [r[1], lo]));
  const setHi = (hi) =>
    setRangeState((r) => (r[0] < hi ? [r[0], hi] : [hi, r[0]]));

  // modify local range state
  const handleSetRange = (_, newValue) => setRangeState(newValue);

  // when change is committed, the range is updated in the state
  // and translate from 1 base to 0 base
  const handleCommitRange = () => {
    // if the range hasn't changed, ignore
    if (rangeState[0] - 1 === range[0] && rangeState[1] - 1 === range[1])
      return;

    dispatch(setRange([rangeState[0] - 1, rangeState[1] - 1]));
  };

  const handleNormal = () => dispatch(setMode("normal"));

  const handleTest = () => {
    handleCommitRange(); // update range before testing
    dispatch(setMode("test"));
  };

  return (
    <>
      {testing && (
        <Tooltip title="Back to Normal Mode">
          <span>
            <Button
              color="primary"
              onClick={handleNormal}
              startIcon={<ArrowBackIcon />}
              style={{ whiteSpace: "nowrap" }}
            >
              Back
            </Button>
          </span>
        </Tooltip>
      )}
      {normal && (
        <>
          <Button
            color="primary"
            onClick={handleTest}
            startIcon={<DoneAllIcon />}
            style={{ whiteSpace: "nowrap" }}
          >
            Start Test
          </Button>
          <Tooltip title="Update Range">
            <span>
              <IconButton
                color="primary"
                onClick={handleCommitRange}
                disabled={
                  rangeState[0] - 1 === range[0] &&
                  rangeState[1] - 1 === range[1]
                }
              >
                <UpdateIcon />
              </IconButton>
            </span>
          </Tooltip>
        </>
      )}
      <Box className={classes.range}>
        <SliderInput
          length={cardsLength}
          value={rangeState[0]}
          setValue={setLo}
          disabled={testing}
        />
        <Slider
          value={rangeState}
          min={1}
          max={cardsLength}
          onChange={handleSetRange}
          valueLabelDisplay="off"
          className={classes.slider}
          disabled={testing}
        />

        <SliderInput
          length={cardsLength}
          value={rangeState[1]}
          setValue={setHi}
          disabled={testing}
        />
      </Box>
    </>
  );
};

export default Range;
