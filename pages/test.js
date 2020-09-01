import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";

import { Box, Paper, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { setWeight, forward, backward, cardContent } from "../src/cards";

const Index = dynamic(() => import("./index"));

const useStyles = makeStyles(theme => ({
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,

    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    display: "flex",
    alignItems: "center",

    margin: theme.spacing(1)
  }
}));

const Card = ({ index, weight, setState, ...props }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.card}>
      <Typography variant="overline">weight: {weight}</Typography>
      <Button onClick={() => setState({ cardIndex: index, option: "good" })}>
        Easy
      </Button>
      <Button onClick={() => setState({ cardIndex: index, option: "neutral" })}>
        Neutral
      </Button>
      <Button onClick={() => setState({ cardIndex: index, option: "bad" })}>
        Hard
      </Button>
    </Paper>
  );
};

const Test = props => {
  const classes = useStyles();

  const test = useSelector(state => state.cards.test);
  if (!test) return <Index />;

  const dispatch = useDispatch();
  const [cardState, setCardState] = useState(null);
  const cards = useSelector(state => state.cards.data);
  const range = useSelector(state => state.cards.range);

  const card = useSelector(cardContent);

  // when cardState updates, except on initial render
  useEffect(() => {
    if (cardState) dispatch(setWeight(cardState));
  }, [cardState]);

  const handleLast = () => dispatch(backward());
  const handleNext = () => dispatch(forward());

  const { index } = card;

  return (
    <>
      <Box className={classes.content}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {cards.map((c, i) => (
            <Card index={i} weight={c.weight} setState={setCardState} />
          ))}
          <Box>
            <Typography>index: {index}</Typography>
            <Typography>
              range start: {range[0]} range end: {range[1]}
            </Typography>
            <Button onClick={handleLast}>last</Button>
            <Button onClick={handleNext}>next</Button>
          </Box>
        </Box>
        {/* <Bar /> */}
      </Box>
    </>
  );
};

export default Test;
