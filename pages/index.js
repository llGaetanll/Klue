import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Sidebar } from "../components/main/sidebar";
import { Card, Bar, Options } from "../components/main/card";
import { Main as KeyBinds } from "../components/keybinds";

import { cardContent } from "../src/cards";

const Load = dynamic(() => import("./load"));

const useStyles = makeStyles(theme => ({
  content: {
    display: "flex",
    flexDirection: "row",
    flex: 1
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    flex: 2
  },
  icon: {
    flexGrow: 0
  }
}));

const Index = props => {
  const classes = useStyles();

  const cards = useSelector(state => state.cards.data);
  const test = useSelector(state => state.cards.test);

  if (cards.length < 1) return <Load />;

  return (
    <Box display="flex" flex={1} flexDirection="column">
      <KeyBinds />
      <Box className={classes.content}>
        <Sidebar />
        <Box className={classes.card}>
          <Card />
          <Options />
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
