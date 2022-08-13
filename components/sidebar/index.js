import { memo } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

import { Box, Typography, Tooltip } from "@mui/material";

import {
  colorSelector,
  cardTagsSelector,
  testingSelector,
  dotColorsSelector,
  setIndex,
} from "../../src/cards/cards";

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
const Item = ({ color, selected }) => {
  // color of the dot
  // const color = useSelector(colorSelector(index));

  // if the dot is selected, its variant changes
  // const selected = useSelector((state) => state.cards.index === index);

  return (
    <motion.span
      // animate={selected ? "selected" : "def"}
      variants={variants}
      // onClick={() => handleClick(index)}
      css={[
        {
          ...DOT_STYLES,
          backgroundColor: color,
        },
        selected || {
          opacity: 0.4,
          filter: "blur(1px)",
        },
      ]}
    />
  );
};

const MemoItem = memo(Item);

// dot grid. only rerenders when cardset size changes
const Dots = () => {
  const dispatch = useDispatch();

  const length = useSelector((state) => state.cards.data.length);
  const test = useSelector(testingSelector);
  const colors = useSelector(dotColorsSelector);

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
      {colors.map(({ color, selected }, i) => (
        <MemoItem key={`key-${i}`} color={color} selected={selected} />
      ))}
      {/* {Array.from({ length }).map((_, i) => (
          <Item index={i} key={`dot-${i}`} handleClick={handleClick} />
        ))} */}
    </Box>
  );
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
  },
  key: {
    textTransform: "uppercase",
    fontWeight: "thin",

    marginRight: theme.spacing(1),
  },
  value: {
    fontWeight: 400,
  },
};

const numCardsSelector = createSelector(
  [(state) => state.cards.data, (state) => state.cards.selectedTags],
  (cards, tags) => {
    if (tags.length === 0) return cards.length;

    return cards.reduce((n, card) => {
      for (const tag of tags) if (card.tags.includes(tag)) return n + 1;
      return n;
    }, 0);
  }
);

// appears above dot grid
const CardStats = () => {
  const index = useSelector((state) => state.cards.index);
  const weight = useSelector((state) => state.cards.data[index]?.weight);
  const numCards = useSelector(numCardsSelector);
  const cardCount = useSelector((state) => state.cards.data.length);

  const showIndex = useSelector((state) => state.settings.showIndex);
  const showWeight = useSelector((state) => state.settings.showWeight);

  // color is shown as the weight of the card
  // const color = useSelector(colorSelector(2));
  const testing = useSelector(testingSelector);

  return (
    <Box css={statStyles.bar}>
      {/* {!testing && showIndex && (
        <Box css={statStyles.section}>
          <Typography css={[statStyles.key, statStyles.number]}>#</Typography>
          <Typography css={statStyles.value}>{index + 1}</Typography>
        </Box>
      )} */}
      <Box css={statStyles.section}>
        <Typography css={statStyles.key}>Selected</Typography>
        <Typography css={statStyles.value}>
          {numCards}/{cardCount}
        </Typography>
      </Box>
      {/* {!testing && showWeight && weight && (
        <Box css={statStyles.section}>
          <Typography css={statStyles.key}>Weight</Typography>
          <Tooltip title={weight}>
            <Typography
              css={[
                statStyles.value,
              ]}
            >
              {weight.toFixed(3)}
            </Typography>
          </Tooltip>
        </Box>
      )} */}
    </Box>
  );
};

const Sidebar = () => (
  <div
    css={{
      display: "flex",
      flex: 1,
      flexDirection: "column",
      background: theme.palette.background.paper,
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
