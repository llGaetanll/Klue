import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import {
  Paper,
  Box,
  Slider,
  Tooltip,
  IconButton,
  InputBase,
} from "@mui/material";

import UpdateIcon from "@mui/icons-material/Update";

import theme from "../../util/theme";

import { setRange, testingSelector } from "../../src/cards";

const cardCountSelector = createSelector(
  (state) => state.cards.data,
  (cards) => cards.length
);

const SliderInput = ({ value, setValue, length, ...props }) => {
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
    <Paper
      css={{
        padding: `0 ${theme.spacing(1)}`,

        maxWidth: 70,
      }}
    >
      <InputBase
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

// card range slider that can be seen on the right side of the screen
const Range = () => {
  const dispatch = useDispatch();

  const testing = useSelector(testingSelector); // slider disabled in edit mode
  const range = useSelector((state) => state.cards.range);
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

  return (
    <>
      <Tooltip title="Update Range">
        <span>
          <IconButton
            color="primary"
            onClick={handleCommitRange}
            disabled={
              rangeState[0] - 1 === range[0] && rangeState[1] - 1 === range[1]
            }
          >
            <UpdateIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Box
        css={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SliderInput
          length={cardsLength}
          value={rangeState[0]}
          setValue={setLo}
          disabled={testing}
        />
        <Slider
          size="small"
          value={rangeState}
          min={1}
          max={cardsLength}
          onChange={handleSetRange}
          valueLabelDisplay="off"
          css={{
            width: "100%",
            margin: `0 ${theme.spacing(2)}`,
          }}
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
