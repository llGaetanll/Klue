import { Box } from "@material-ui/core";

import Sidebar from "../components/sidebar/index";

// what the page looks like for test results
export default () => (
  <>
    <Sidebar />
    <Box flex={2} display="flex" alignItems="center" justifyContent="center">
      <EndOfTest />
    </Box>
  </>
);
