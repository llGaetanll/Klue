import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

import { Box } from "@mui/material";

import Sidebar from "../components/sidebar/index";
import { HorizontalBar } from "../components/horizontalbar";
import { Main as KeyBinds } from "../components/util/keybinds";

// main content of the page
// depends on the mode (normal, edit, etc...)
import NormalContent from "../components/views/normal";
import EditContent from "../components/views/edit/edit";
import TestContent from "../components/views/test";

const Load = dynamic(() => import("./load"));

// content of the page depends on app mode
const CONTENT = {
  normal: <NormalContent />,
  edit: <EditContent />,
  test: <TestContent />,
};

const Index = () => {
  const cards = useSelector((state) => state.cards.data);

  // mode is used to determine the state of the program
  const mode = useSelector((state) => state.cards.mode);
  const content = CONTENT[mode];

  if (cards.length < 1) return <Load />;

  return (
    <Box display="flex" flex={1} flexDirection="column">
      <KeyBinds />
      <Box
        css={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          height: "100vh",
        }}
      >
        <Sidebar />
        {content}
      </Box>
      <HorizontalBar />
    </Box>
  );
};

export default Index;
