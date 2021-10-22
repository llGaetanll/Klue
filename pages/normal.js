import { Box } from "@material-ui/core";

import { Card } from "../components/card";

// what the page looks like in normal mode
const Normal = () => (
  <>
    <Box flex={2} display="flex" alignItems="center" justifyContent="center">
      <Card />
    </Box>
  </>
);

export default Normal;
