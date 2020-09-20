import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Sidebar } from "../components/sidebar";
import { HorizontalBar } from "../components/horizontalbar";
import { Card, Options } from "../components/card";
import { Main as KeyBinds } from "../components/util/keybinds";

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
  }
}));

const Index = props => {
  const classes = useStyles();

  const cards = useSelector(state => state.cards.data);

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
      <HorizontalBar />
    </Box>
  );
};

export default Index;
