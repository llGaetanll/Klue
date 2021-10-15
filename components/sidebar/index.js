import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, useCycle } from "framer-motion";

import { Box, Typography, IconButton, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { itemSelector, testingSelector, setIndex } from "../../src/cards";

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

const Item = ({ index, handleClick }) => {
  // color of the dot
  const color = useSelector(itemSelector(index));

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

const CardStats = () => {
  const classes = useStyles();

  const index = useSelector((state) => state.cards.index);
  const weight = useSelector((state) => state.cards.data[index]?.weight);
  const numCards = useSelector(
    (state) => state.cards.range[1] - state.cards.range[0] + 1
  );
  const cardCount = useSelector((state) => state.cards.data.length);

  const showIndex = useSelector((state) => state.settings.showIndex);
  const showWeight = useSelector((state) => state.settings.showWeight);

  return (
    <Box className={classes.bar}>
      {showIndex && index > -1 && (
        <>
          <Tooltip title="Card Number">
            <Typography className={classes.cardInfo}>{index + 1}</Typography>
          </Tooltip>
          <Typography className={classes.cardInfo}>•</Typography>
        </>
      )}
      <Tooltip title="Card Range">
        <Typography className={classes.cardInfo}>
          {numCards}/{cardCount}
        </Typography>
      </Tooltip>
      {showWeight && weight && (
        <>
          <Typography className={classes.cardInfo}>|</Typography>
          <Tooltip title="Card Weight">
            <Typography className={classes.cardInfo}>{weight}</Typography>
          </Tooltip>
        </>
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
