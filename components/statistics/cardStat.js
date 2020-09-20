import { useState } from 'react';
import Measure from "react-measure";
import clsx from 'clsx';

import { Box, Typography, Tooltip } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles'

import { round, linInterpolation } from '../../util'

const THICKNESS = 1;

const useStyles = makeStyles(theme => ({
  graphWrapper: {
    display: 'flex',
    flex: 1,
    height: '100%',
  },
  time: {
    padding: theme.spacing(1),
  },
  weight: {
    padding: theme.spacing(1),

    fontFamily: 'monospace',
    fontWeight: 300,
    fontSize: 16
  },
  graph: ({ width, height }) => ({
    position: 'absolute',

    borderRight: `${THICKNESS}px solid ${theme.palette.grey[700]}`,
    borderLeft: `${THICKNESS}px solid ${theme.palette.grey[700]}`,

    width,
    height
  }),
}));

const useGraphStyles = makeStyles(theme => ({
  graphEl: {
    position: 'absolute',
    top: '50%',

    backgroundColor: theme.palette.grey[700],
  },
  horizontalLine: {
    transform: 'translateY(-50%)',

    height: THICKNESS,
    width: '100%',
  },
  vertTick: {
    transform: 'translate(-50%, -50%)',

    height: '60%',
    width: THICKNESS,
  },
  diffWrapper: {
    height: 'inherit'
  },
  diff: {
    transform: 'translateY(-50%)',
    height: THICKNESS,

    borderRadius: 3,

    zIndex: 1
  },
  dot: {
    transform: 'translate(-50%, -50%)',

    width: 5,
    height: 5,

    borderRadius: '50%',
    zIndex: 2
  },
  color: ({ negative }) => ({
    backgroundColor: negative ? theme.palette.success.dark : theme.palette.error.dark,
  })
}))

// This element displays a bar representing the change in weight
const Diff = ({ prevWeight, weightDelta, ...props }) => {
  const classes = useGraphStyles({ negative: weightDelta < 0 });

  const { totalWidth } = props;
  
  // if the prevWeight is negative, we offset the box by prevWeight as to not have negative width
  const width = weightDelta < 0 ? -weightDelta : weightDelta;
  // const left = weightDelta < 0 ? prevWeight - weightDelta : prevWeight;
  const left = weightDelta > 0 ? prevWeight : prevWeight + weightDelta;

  // remove bars that would be off the charts
  // if (left < 0)
    // return <></>

  // if (left + width > totalWidth)
    // return <></>

  // TODO: add animations with framer when diffWrapper is hovered

  return (
      <Box className={classes.diffWrapper}>
        <Box className={clsx(classes.graphEl, classes.dot, classes.color)} style={{ left }} />
        <Box className={clsx(classes.graphEl, classes.diff, classes.color)} style={{ left, width }} />
        <Box className={clsx(classes.graphEl, classes.dot, classes.color)} style={{ left: left + width }}/>
      </Box>
  );
}

const Graph = ({ size, weightDelta, prevWeight, ...props }) => {
  const classes = useStyles({ ...size });
  const graphClasses = useGraphStyles();

  let { minWeight, maxWeight } = props;
  minWeight = 0; // prevents deltas from going off the graph

  const { width } = size;
  return (
    <Box className={classes.graph}>
      <Box className={clsx(graphClasses.graphEl, graphClasses.horizontalLine)} />

      <Tooltip title="Default Weight">
        <Box className={clsx(graphClasses.graphEl, graphClasses.vertTick)} style={{ left: linInterpolation(1, minWeight, maxWeight) * width }} />
      </Tooltip>

      <Diff 
        prevWeight={linInterpolation(prevWeight, minWeight, maxWeight) * width}
        weightDelta={weightDelta * width} 
        totalWidth={width}
      />
    </Box>
  );
}

const CardStat = ({ weightDelta, prevWeight, ...props }) => {
  const classes = useStyles();
  const [size, setSize] = useState({ width: -1, height: -1 });

  const { time, ...weights } = props;

  return (
    <Measure bounds onResize={({ bounds }) => setSize(bounds)}>
      {({ measureRef }) => (
        <Box className={classes.graphWrapper} ref={measureRef}>
          <Graph 
            size={size} 
            weightDelta={weightDelta}
            prevWeight={prevWeight}
            {...weights} // pass in min and max weights
          />
        </Box>
      )}
    </Measure>
  );
}

export default CardStat;
