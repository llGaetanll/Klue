import { Box } from "@mui/material";

import Card from "../card/Card";

// what the page looks like in normal mode
const Normal = () => (
  <>
    <Box flex={2} display="flex" alignItems="center" justifyContent="center">
      <Card />
    </Box>
  </>
);

export default Normal;
