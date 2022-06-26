import { Box, Typography, Button, Link } from "@mui/material";

import PublishIcon from "@mui/icons-material/Publish";

import UploadButton from "../components/util/uploadbutton";

const Load = () => (
  <Box
    css={{
      display: "flex",
      flexDirection: "column",
      flex: 1,

      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography variant="h3">Welcome!</Typography>
    <Typography variant="paragraph">
      To get started with Klue, import a set of cards.
    </Typography>
    <Typography variant="paragraph">
      For further instructions on how to do this, start{" "}
      <Link href="https://github.com/llGaetanll/klue#klue">here</Link>.
    </Typography>

    <UploadButton>
      <Button
        color="primary"
        component="span"
        variant="outlined"
        startIcon={<PublishIcon />}
      >
        Import Cards
      </Button>
    </UploadButton>
  </Box>
);

export default Load;
