import { useMemo } from 'react'
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  itemSelector,
  testingSelector,
  setIndex
} from "../../src/cards";

const useStyles = makeStyles(theme => ({
  dots: {
    flex: 1,
    display: "block",

    marginRight: -3
  },
  dot: ({ color }) => ({
    display: "inline-block",
    float: "left",
    width: 7,
    height: 7,

    borderRadius: "50%",
    marginRight: 5,
    marginBottom: 5,

    backgroundColor: color
  })
}));

const Item = ({ index }) => {
  const dispatch = useDispatch();

  const color = useSelector(itemSelector(index));
  const classes = useStyles({ color });

  const test = useSelector(testingSelector);

  const handleSetCard = () => {
    if (!test)
      dispatch(setIndex(index));
  };

  return useMemo(() => (<Paper className={classes.dot} onClick={handleSetCard} />), [color])
};

const CardSetVisual = () => {
  const classes = useStyles();

  const cards = useSelector(state => state.cards.data);

  return useMemo(() => (
    <Box className={classes.dots}>
      {cards.map((_, i) => (
        <Item index={i} />
      ))}
    </Box>
  ), [cards.length]);
}

export default CardSetVisual;
