import { Box, Typography, Button, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import PublishIcon from "@material-ui/icons/Publish";

import UploadButton from "../components/uploadButton";

const useStyles = makeStyles(theme => ({
  load: {
    display: "flex",
    flexDirection: "column",
    flex: 1,

    alignItems: "center",
    justifyContent: "center"
  }
}));

const Load = () => {
  const classes = useStyles();

  return (
    <Box className={classes.load}>
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
};

export default Load;
