import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Tooltip
} from "@material-ui/core";

import { beginTest, statSelector } from "../../../src/cards";
import { round } from '../../../util';

export const EndOfTest = props => {
  const dispatch = useDispatch();

  const handleTestAgain = () => dispatch(beginTest());

  return (
      <Box display="flex" flexDirection="column">
        <Typography variant="h3">All Set!</Typography>
        <Statistics />
        <Button color="primary" onClick={handleTestAgain}>
          Test Again
        </Button>
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
