import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

import { Box } from "@mui/material";

import Sidebar from "../components/sidebar/index";
import { HorizontalBar } from "../components/horizontalbar";

// main content of the page
// depends on the mode (normal, edit, etc...)
import NormalContent from "../components/views/normal";
import EditContent from "../components/views/edit/edit";
// import TestContent from "../components/views/test/test";

const Load = dynamic(() => import("./load"));

// content of the page depends on app mode
const CONTENT = {
  normal: <NormalContent />,
  edit: <EditContent />,
  // test: <TestContent />,
};

const Index = () => {
  const cards = useSelector((state) => state.cards.data);

  // mode is used to determine the state of the program
  const mode = useSelector((state) => state.cards.mode);
  const content = CONTENT[mode];

  if (cards.length < 1) return <Load />;

  return <NormalContent />;
};

export default Index;
