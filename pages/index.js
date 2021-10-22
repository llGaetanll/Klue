import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Sidebar from "../components/sidebar/index";
import { HorizontalBar } from "../components/horizontalbar";
import { Main as KeyBinds } from "../components/util/keybinds";

// main content of the page
// depends on the mode (normal, edit, etc...)
import NormalContent from "./normal";
import EditContent from "./edit";
import TestContent from "./test";

const Load = dynamic(() => import("./load"));

const useStyles = makeStyles({
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
});

// content of the page depends on app mode
const CONTENT = {
  normal: <NormalContent />,
  edit: <EditContent />,
  test: <TestContent />,
};

const Index = () => {
  const classes = useStyles();

  const cards = useSelector((state) => state.cards.data);

  if (cards.length < 1) return <Load />;

  // mode is used to determine the state of the program
  const mode = useSelector((state) => state.cards.mode);
  const content = CONTENT[mode];

  return (
    <Box display="flex" flex={1} flexDirection="column">
      <KeyBinds />
      <Box className={classes.content}>
        <Sidebar />
        {content}
      </Box>
      <HorizontalBar />
    </Box>
  );
};

export default Index;
