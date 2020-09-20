import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'baseline',
  },
  time: {
    fontSize: '1.3em',
    fontFamily: 'monospace',
    fontWeight: 500,
    opacity: 0.9,
  },
  ms: {
    fontSize: '1.2em',
  }
});

// Time component modified from https://github.com/llGaetanll/altimer/blob/63adee4d54be3b2f4000916f6e7f4a77a7e5ace4/components/general/time.js#L79
const Time = ({ time, className }) => {
  const classes = useStyles();

  const { h, m, s, ms } = time;
  return (
    <Box display="flex">
      {h && (
        <>
          <Typography variant="h1" className={className || classes.time}>
            {h}
          </Typography>
          <Typography variant="h1" className={className || classes.time}>
            :
          </Typography>
        </>
      )}
      {m && (
        <>
          <Typography variant="h1" className={className || classes.time}>
            {m}
          </Typography>
          <Typography variant="h1" className={className || classes.time}>
            :
          </Typography>
        </>
      )}
      {s && (
        <Typography variant="h1" className={className || classes.time}>
          {s}
        </Typography>
      )}
      {ms && (
        <>
          <Typography variant="h1" className={className || classes.time}>
            .
          </Typography>
          <Typography variant="h1" className={className || classes.time}>
            {ms}
          </Typography>
        </>
      )}
      <Typography
        variant="h2"
        className={className || classes.time}
      >
        s
      </Typography>
    </Box>
  );
};

export default Time;
