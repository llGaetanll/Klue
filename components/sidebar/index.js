import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

import { Box, Typography, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { colorSelector, testingSelector, setIndex } from "../../src/cards";

const useStyles = makeStyles((theme) => ({
  dots: {
    // flex: 1,
    width: 550, // TODO: width should use @media tags
    display: "block",

    marginRight: -3,
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  bar: {
    display: "flex",

    padding: `0 ${theme.spacing(2)}px`,
  },
  cardInfo: {
    fontFamily: "monospace",
    fontWeight: 500,
    lineHeight: "initial",

    padding: theme.spacing(1),
  },
  button: ({ open }) => ({
    padding: theme.spacing(1),

    transform: `rotate(${open ? 0.5 : 0}turn)`,
  }),
}));

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
  display: "inline-block",
  float: "left",
  width: 5,
  height: 5,

  borderRadius: "50%",
  marginRight: 7,
  marginBottom: 7,

  cursor: "pointer",
};

// the actual dot component
const Item = ({ index, handleClick }) => {
  // color of the dot
  const color = useSelector(colorSelector(index));

  // if the dot is selected, its variant changes
  const selected = useSelector((state) => state.cards.index === index);

  return (
    <motion.div
      animate={selected ? "selected" : "def"}
      variants={variants}
      onClick={() => handleClick(index)}
      style={{ ...DOT_STYLES, backgroundColor: color }}
    />
  );
};

// dot grid. only rerenders when cardset size changes
const Dots = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const length = useSelector((state) => state.cards.data.length);
  const test = useSelector(testingSelector);

  // when the user clicks on the dot, the index is
  // drilled up and setIndex is conditionally dispatched
  const handleClick = (index) => {
    if (!test) dispatch(setIndex(index));
  };

  return useMemo(
    () => (
      <Box className={classes.dots}>
        {Array.from({ length }).map((_, i) => (
          <Item index={i} key={`dot-${i}`} handleClick={handleClick} />
        ))}
      </Box>
    ),
    [length]
  );
};

const useStatStyles = makeStyles((theme) => ({
  bar: {
    display: "flex",
    flexDirection: "row",
    height: 54,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
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
  value: {},
}));

// appears above dot grid
const CardStats = () => {
  const classes = useStatStyles();

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
    <Box className={classes.bar}>
      {!testing && showIndex && (
        <Box className={classes.section}>
          <Typography className={classes.number}>#</Typography>
          <Typography className={classes.value}>{index + 1}</Typography>
        </Box>
      )}
      <Box className={classes.section}>
        <Typography className={classes.key}>Range</Typography>
        <Typography className={classes.value}>
          {numCards}/{cardCount}
        </Typography>
      </Box>
      {!testing && showWeight && weight && (
        <Box className={classes.section}>
          <Typography className={classes.key}>Weight</Typography>
          <Tooltip title={weight}>
            <Typography className={classes.value} style={{ color }}>
              {weight.toFixed(3)}
            </Typography>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

const Sidebar = () => (
  <Box display="flex" flex={1} flexDirection="column">
    <CardStats />
    <Dots />
  </Box>
);

export default Sidebar;
