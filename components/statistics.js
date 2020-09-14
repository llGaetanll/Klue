import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Tooltip
} from "@material-ui/core";

import { setMode, statSelector } from "../src/cards";
import { round } from '../util';

export const EndOfTest = () => {
  const dispatch = useDispatch();

  const handleMode = mode => dispatch(setMode(mode));

  return (
      <Box display="flex" flexDirection="column">
        <Typography variant="h3">All Set!</Typography>
        <Statistics />
        <Box display="flex">
        <Button onClick={() => handleMode('normal')}>
          Back to Cards
        </Button>
        <Button color="primary" onClick={() => handleMode('test')}>
          Test Again
        </Button>
        </Box>
      </Box>
    );
}

export const Statistics = props => {
  const testStats = useSelector(statSelector);
  const { cardStats, avgWeightDelta, totalTime, avgTime } = testStats;

  return (
    <Box>
      <Typography>total time: {totalTime}</Typography>
      <Typography>average time: {round(avgTime, 3)}</Typography>
      <Tooltip title="I'm just saying it like this because it makes me sound smart">
      <Typography>average weight delta (negative is good) {round(avgWeightDelta, 3)}</Typography>
        </Tooltip>
    </Box>
  );
}
