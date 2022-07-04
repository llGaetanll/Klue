import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

import { Box, Typography, Tooltip } from "@mui/material";

import { colorSelector, testingSelector, setIndex } from "../../src/cards";

import theme from "../../util/theme";

// control the size of the dot based on if it's selected or not
const variants = {
  selected: {
    scale: 1.5,
  },
  def: {
    scale: 0.8,
  },
  hidden: {
    scale: 0,
  },
};

const DOT_STYLES = {
  display: "block",
  width: 5,
  height: 5,

  borderRadius: "50%",

  cursor: "pointer",
};

// the actual dot component
const Item = ({ index, handleClick }) => {
  // color of the dot
  const color = useSelector(colorSelector(index));

  // if the dot is selected, its variant changes
  const selected = useSelector((state) => state.cards.index === index);

  return (
    <motion.span
      animate={selected ? "selected" : "def"}
      variants={variants}
      onClick={() => handleClick(index)}
      style={{ ...DOT_STYLES, backgroundColor: color }}
    />
  );
};

// dot grid. only rerenders when cardset size changes
const Dots = () => {
  const dispatch = useDispatch();

  const length = useSelector((state) => state.cards.data.length);
  const test = useSelector(testingSelector);

  return useMemo(() => {
    // when the user clicks on the dot, the index is
    // drilled up and setIndex is conditionally dispatched
    const handleClick = (index) => {
      if (!test) dispatch(setIndex(index));
    };

    return (
      <Box
        css={{
          // flex: 1,
          width: 550, // TODO: width should use @media tags
          display: "inline-flex",

          flexWrap: "wrap",
          gap: 7,

          marginRight: -3,
          padding: theme.spacing(2),
          paddingTop: 0,
        }}
      >
        {Array.from({ length }).map((_, i) => (
          <Item index={i} key={`dot-${i}`} handleClick={handleClick} />
        ))}
      </Box>
    );
  }, [length, test, dispatch]);
};

const statStyles = {
  bar: {
    display: "flex",
    flexDirection: "row",
    height: 54,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    margin: `${theme.spacing(1)} ${theme.spacing(2)}`,
  },
  number: {
    fontSize: "1.8em",
    fontFamily: "monospace",
    color: theme.palette.grey[700],

    marginRight: theme.spacing(1),
  },
  key: {
    textTransform: "uppercase",
    fontWeight: "bold",
    color: theme.palette.grey[700],

    marginRight: theme.spacing(1),
  },
  value: {
    fontWeight: 400,
  },
};

// appears above dot grid
const CardStats = () => {
  const index = useSelector((state) => state.cards.index);
  const weight = useSelector((state) => state.cards.data[index]?.weight);
  const numCards = useSelector(
    (state) => state.cards.range[1] - state.cards.range[0] + 1
  );
  const cardCount = useSelector((state) => state.cards.data.length);

  const showIndex = useSelector((state) => state.settings.showIndex);
  const showWeight = useSelector((state) => state.settings.showWeight);

  // color is shown as the weight of the card
  const color = useSelector(colorSelector(2));
  const testing = useSelector(testingSelector);

  return (
    <Box css={statStyles.bar}>
      {!testing && showIndex && (
        <Box css={statStyles.section}>
          <Typography css={statStyles.number}>#</Typography>
          <Typography css={statStyles.value}>{index + 1}</Typography>
        </Box>
      )}
      <Box css={statStyles.section}>
        <Typography css={statStyles.key}>Range</Typography>
        <Typography css={statStyles.value}>
          {numCards}/{cardCount}
        </Typography>
      </Box>
      {!testing && showWeight && weight && (
        <Box css={statStyles.section}>
          <Typography css={statStyles.key}>Weight</Typography>
          <Tooltip title={weight}>
            <Typography css={[statStyles.value, { color }]}>
              {weight.toFixed(3)}
            </Typography>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

const Sidebar = () => (
  <div
    css={{
      display: "flex",
      flex: 1,
      flexDirection: "column",
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    }}
  >
    <CardStats />
    <Dots />
  </div>
);

export default Sidebar;
