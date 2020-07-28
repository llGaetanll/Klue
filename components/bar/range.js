import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import { Box, Slider, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { FeedbackContext } from "../../util/feedback";
import { setRange } from "../../store";

const useStyles = makeStyles(theme => ({
  slider: {
    width: 500
  },
  input: {
    margin: `0 ${theme.spacing(2)}px`,
    maxWidth: 50
  }
}));

const kanjiCountSelector = createSelector(
  state => state.kanji,
  kanji => kanji.length
);

const SliderInput = ({ value, setValue }) => {
  const classes = useStyles();
  const [valueState, setValueState] = useState();
  const kanjiCount = useSelector(kanjiCountSelector);

  // update state on value change
  useEffect(() => setValueState(value), [value]);

  const handleChange = event => {
    const value = Number(event.target.value);

    if (value > kanjiCount) return;
    if (value < 0) return; // although we only want values >= 1, this allows us to clear the field, we jsut ignore zero

    // allows us to clear the field
    if (value < 1) setValueState(value);
    else setValue(value);
  };

  return (
    <Input
      className={classes.input}
      value={valueState}
      onChange={handleChange}
      type="number"
      // onBlur={handleBlurLow}
      // inputProps={{
      //   step: 10,
      //   min: 0,
      //   max: 100,
      //   type: "number",
      //   "aria-labelledby": "input-slider"
      // }}
    />
  );
};

const Range = () => {
  const classes = useStyles();
  const { addAlert } = useContext(FeedbackContext);
  const dispatch = useDispatch();

  const range = useSelector(state => state.range);
  const kanjiCount = useSelector(kanjiCountSelector);

  // range state is always 1 more than the actual range (to prevent index 0 instead of 1 in UI)
  const [rangeState, setRangeState] = useState(range);

  const setLo = lo => setRangeState(r => [lo, r[1]]);
  const setHi = hi => setRangeState(r => [r[0], hi]);

  // modify local range state
  const handleRange = (_, newValue) => setRangeState(newValue);

  // when change is committed, the range is updated in the state
  const handleSetRange = () => dispatch(setRange(rangeState));

  // when the state updates, update the store's range
  useEffect(() => {
    // ensure that the lowest value is always at the bottom of the array
    const r = rangeState[0] > rangeState[1] ? rangeState.reverse() : rangeState;
    dispatch(setRange(r));
  }, [rangeState]);

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <SliderInput value={rangeState[0]} setValue={setLo} />
      <Slider
        value={rangeState}
        min={1}
        max={kanjiCount}
        onChange={handleRange}
        onChangeCommitted={handleSetRange}
        valueLabelDisplay="auto"
        className={classes.slider}
      />
      <SliderInput value={rangeState[1]} setValue={setHi} />
    </Box>
  );
};

export default Range;
