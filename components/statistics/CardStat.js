import { useState } from "react";
import Measure from "react-measure";
import clsx from "clsx";

import { Box, Tooltip } from "@mui/material";

import { linInterpolation } from "../../util";

import theme from "../../util/theme";

const THICKNESS = 1;

const graphStyles = {
  graphEl: {
    position: "absolute",
    top: "50%",

    backgroundColor: theme.palette.grey[700],
  },
  horizontalLine: {
    transform: "translateY(-50%)",

    height: THICKNESS,
    width: "100%",
  },
  vertTick: {
    transform: "translate(-50%, -50%)",

    height: "60%",
    width: THICKNESS,
  },
  diffWrapper: {
    height: "inherit",
  },
  diff: {
    transform: "translateY(-50%)",
    height: THICKNESS,

    borderRadius: 3,

    zIndex: 1,
  },
  dot: {
    transform: "translate(-50%, -50%)",

    width: 5,
    height: 5,

    borderRadius: "50%",
    zIndex: 2,
  },
  color: ({ negative }) => ({
    backgroundColor: negative
      ? theme.palette.success.dark
      : theme.palette.error.dark,
  }),
};

// This element displays a bar representing the change in weight
const Diff = ({ prevWeight, weightDelta, ...props }) => {
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

  const backgroundColor =
    weightDelta < 0 ? theme.palette.success.dark : theme.palette.error.dark;

  console.log(backgroundColor);

  return (
    <Box css={graphStyles.diffWrapper}>
      <Box
        css={[graphStyles.graphEl, graphStyles.dot, { left, backgroundColor }]}
        // style={{ left }}
      />
      <Box
        css={[
          graphStyles.graphEl,
          graphStyles.diff,
          { left, width, backgroundColor },
        ]}
        // style={{ left, width }}
      />
      <Box
        css={[
          graphStyles.graphEl,
          graphStyles.dot,
          { left: left + width, backgroundColor },
        ]}
        // style={{ left: left + width }}
      />
    </Box>
  );
};

const Graph = ({ size, weightDelta, prevWeight, ...props }) => {
  let { minWeight, maxWeight } = props;
  minWeight = 0; // prevents deltas from going off the graph

  const { width } = size;
  return (
    <Box
      css={{
        position: "absolute",

        borderRight: `${THICKNESS}px solid ${theme.palette.grey[700]}`,
        borderLeft: `${THICKNESS}px solid ${theme.palette.grey[700]}`,

        width: size.width,
        height: size.height,
      }}
    >
      <Box css={[graphStyles.graphEl, graphStyles.horizontalLine]} />

      <Tooltip title="Default Weight">
        <Box
          css={[
            graphStyles.graphEl,
            graphStyles.vertTick,
            { left: linInterpolation(1, minWeight, maxWeight) * width },
          ]}
        />
      </Tooltip>

      <Diff
        prevWeight={linInterpolation(prevWeight, minWeight, maxWeight) * width}
        weightDelta={weightDelta * width}
        totalWidth={width}
      />
    </Box>
  );
};

const CardStat = ({ weightDelta, prevWeight, ...props }) => {
  const [size, setSize] = useState({ width: -1, height: -1 });

  const { time, ...weights } = props;

  return (
    <Measure bounds onResize={({ bounds }) => setSize(bounds)}>
      {({ measureRef }) => (
        <Box
          css={{
            display: "flex",
            flex: 1,
            height: "100%",
          }}
          ref={measureRef}
        >
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
};

export default CardStat;
