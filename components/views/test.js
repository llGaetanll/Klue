import { useSelector } from "react-redux";

import { Box } from "@mui/material";

import { EndOfTest } from "../statistics";

import Card from "../card/card";
import TestOptions from "../card/testOptions";

import { testDoneSelector } from "../../src/cards";

// what the page looks like in test mode
const Test = () => {
  const testDone = useSelector(testDoneSelector);

  return (
    <>
      <Box flex={2} display="flex" justifyContent="center">
        {testDone ? (
          <EndOfTest />
        ) : (
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Card />
            <TestOptions />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Test;
