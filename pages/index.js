import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Sidebar from "../components/sidebar/index";
import { EndOfTest } from "../components/statistics";
import { HorizontalBar } from "../components/horizontalbar";
import { Card, Options } from "../components/card";
import { Main as KeyBinds } from "../components/util/keybinds";

const Load = dynamic(() => import("./load"));

const useStyles = makeStyles((theme) => ({
  content: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    flex: 2,
  },
}));

const Index = () => {
  const classes = useStyles();

  const cards = useSelector((state) => state.cards.data);
  const index = useSelector((state) => state.cards.index);

  if (cards.length < 1) return <Load />;

  return (
    <Box display="flex" flex={1} flexDirection="column">
      <KeyBinds />
      <Box className={classes.content}>
        <Sidebar />
        <Box
          flex={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {index > -1 ? (
            <Box display="flex" flexDirection="column">
              <Card />
              <Options />
            </Box>
          ) : (
            <EndOfTest />
          )}
        </Box>
      </Box>
      <HorizontalBar />
    </Box>
  );
};

export default Index;
