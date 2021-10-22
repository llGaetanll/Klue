import { useSelector } from "react-redux";

import { Box } from "@material-ui/core";

import { EndOfTest } from "../components/statistics";
import { Card, Options } from "../components/card";

import { testDoneSelector } from "../src/cards";

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
            <Options />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Test;
