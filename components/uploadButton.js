import { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import PublishIcon from "@material-ui/icons/Publish";

import { FeedbackContext } from "../util/feedback";
import { store, loadKanji } from "../store";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  input: {
    display: "none"
  },
  button: {
    margin: `0 ${theme.spacing(1)}px`,
    whiteSpace: "nowrap" // text spans one line
  }
}));

const UploadButton = props => {
  const classes = useStyles();

  const { addAlert } = useContext(FeedbackContext);

  const handleChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    // file reading finished successfully
    reader.addEventListener("load", e => {
      // contents of file in variable
      var text = e.target.result;

      store.dispatch(loadKanji(JSON.parse(text)));
      addAlert("Successfully loaded Kanji", "success");
    });

    // file reading failed
    reader.addEventListener("error", function() {
      addAlert("Failed to read file", "error");
    });

    // read as text file
    reader.readAsText(file);
  };

  return (
    <div className={classes.root}>
      <input
        accept="application/JSON"
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={handleChange}
      />
      <label htmlFor="contained-button-file">
        <Button
          color="primary"
          component="span"
          className={classes.button}
          startIcon={<PublishIcon />}
        >
          Load Cards
        </Button>
      </label>
    </div>
  );
};

export default UploadButton;
