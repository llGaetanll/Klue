import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Typography,
} from "@material-ui/core";

import { makeStyles } from '@material-ui/core/styles'

import HeaderStat from './headerStat';
import VirtualTable from '../util/virtualTable';
import Time from '../util/time'

import { setMode, statSelector, weightSelector, characterSelector } from "../../src/cards";
import { round, formatTime } from '../../util';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    minWidth: 600,

    margin: `0 ${-theme.spacing(2)}px`
  },
  stat: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',

    margin: theme.spacing(2)
  },
  title: {
    fontSize: '1em',
    fontWeight: 500,
  },
  number: {
    fontSize: '3em',
    fontWeight: 300,

    fontFamily: 'monospace'
  },
  stats: {
    display: 'flex',
    height: 700,

    marginBottom: theme.spacing(2)
  }
}));

export const EndOfTest = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { cardStats, ...headerStats } = useSelector(statSelector);

  const weights = useSelector(weightSelector);
  const characters = useSelector(characterSelector);

  const handleMode = mode => dispatch(setMode(mode));

  const { totalTime, avgTime, avgWeightDelta } = headerStats;

  return (
      <Box display="flex" flexDirection="column">
        <Typography component="h1" variant="h3">All Set!</Typography>

        <Box className={classes.header}>
          <HeaderStat title="Total Time">
            {className => (
              <Time time={formatTime(totalTime, false)} className={className} />
            )}
          </HeaderStat>
          <HeaderStat title="Average Time">
            {className => (
              <Time time={formatTime(round(avgTime / 1000, 3))} className={className} />
            )}
          </HeaderStat>
          <HeaderStat
            title="Average Weight Delta"
            color={theme => avgWeightDelta < 0 ? theme.palette.success.dark : theme.palette.error.dark}
          >
            {className => (
              <Typography component="h1" className={className}>
                {avgWeightDelta < 0 ? "" : "+"} {round(avgWeightDelta, 3)}
              </Typography>
            )}
          </HeaderStat>
        </Box>

        <Box className={classes.stats}>
          <VirtualTable
            rowCount={characters.length}
            rowGetter={({ index }) => ({ character: characters[index], weights, ...cardStats[index] })}
            columns={
              [
                {
                  width: 50,
                  dataKey: 'char',
                  label: 'Character'
                },
                {
                  width: 200,
                  dataKey: 'graph',
                  label: 'Statistics'
                },
                {
                  width: 50,
                  dataKey: 'time',
                  label: 'Time'
                },
              ]
            }
          />
        </Box>

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
