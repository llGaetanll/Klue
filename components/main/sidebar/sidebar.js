import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Measure from "react-measure";

import {
  Box,
  Paper,
  Tooltip,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";

import UploadButton from "../../uploadButton";
import PublishIcon from "@material-ui/icons/Publish";
import SettingsIcon from "@material-ui/icons/Settings";

import Range from "./range";
import {
  setRepeat,
  getCards,
  itemsSelector,
  setDisplayWeights,
  setIndex
} from "../../../src/cards";
import { toggleTheme, darkSelector } from "../../../src/settings";

import { FeedbackContext } from "../../../util/feedback";

const useStyles = makeStyles(theme => ({
  sidebar: {
    width: 500,
    display: "flex",
    flexDirection: "column",

    padding: theme.spacing(2)
  },
  dots: {
    flex: 1,
    display: "block",

    marginRight: -3
  },
  dot: ({ itemState }) => ({
    display: "inline-block",
    float: "left",
    width: 7,
    height: 7,

    borderRadius: "50%",
    marginRight: 5,
    marginBottom: 5,

    backgroundColor: COLOR(theme)[itemState]
  })
}));

const COLOR = theme => ({
  inactive: theme.palette.grey[800],
  active: theme.palette.grey[700],
  visited: theme.palette.success.dark,

  current: theme.palette.info.main,

  named: theme.palette.warning.light,
  filled: theme.palette.warning.dark
});

const Item = ({ index, itemState }) => {
  const dispatch = useDispatch();
  const classes = useStyles({ itemState });

  const handleSetCard = () => {
    dispatch(setIndex(index));
  };

  return <Paper className={classes.dot} onClick={handleSetCard} />;
};

const useSettingsStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    width: "100%"
  }
}));

const Settings = props => {
  const dispatch = useDispatch();
  const classes = useSettingsStyles();

  const isDark = useSelector(darkSelector);

  const handleTheme = () => dispatch(toggleTheme());

  const handleDownload = () => dispatch(getCards());

  // const handleUpload = event => {
  //   event.preventDefault();
  //   setDialog(<UploadWarning />);
  // };

  return (
    <>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          <FormControlLabel
            control={
              <Switch color="primary" checked={isDark} onChange={handleTheme} />
            }
            label="Dark Theme"
          />

          <Divider />

          <Button
            color="primary"
            className={classes.button}
            onClick={handleDownload}
            startIcon={<GetAppIcon />}
            variant="outlined"
          >
            Download Cards
          </Button>

          <UploadButton>
            <Button
              color="primary"
              component="span"
              className={classes.button}
              startIcon={<PublishIcon />}
              variant="outlined"
            >
              Upload Cards
            </Button>
          </UploadButton>
        </Box>
      </DialogContent>
    </>
  );
};

const UploadWarning = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleDownload = () => {
    dispatch(getCards());
    onClose();
  };

  return (
    <>
      <DialogTitle>Wait!</DialogTitle>
      <DialogContent>
        <Typography>
          Uploading a new set of cards will override the current one. Consider
          downloading this card set if you haven't already.
        </Typography>

        <DialogActions>
          <Button onClick={handleDownload} color="primary">
            Download Cards
          </Button>
          <Button onClick={onClose}>I know what I'm doing</Button>
        </DialogActions>
      </DialogContent>
    </>
  );
};

const Options = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { setDialog } = useContext(FeedbackContext);

  const handleSettings = () => setDialog(<Settings />);

  const repeatCards = useSelector(state => state.cards.repeat);
  const handleRepeat = () => dispatch(setRepeat(!repeatCards));

  const displayWeights = useSelector(state => state.cards.displayWeights);
  const handleDisplayWeights = () =>
    dispatch(setDisplayWeights(!displayWeights));

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        <Range />
        <Tooltip title="Settings">
          <IconButton
            color="primary"
            className={classes.button}
            onClick={handleSettings}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box display="flex">
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={repeatCards}
              onChange={handleRepeat}
            />
          }
          label="Repeat Cards"
        />
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={displayWeights}
              onChange={handleDisplayWeights}
            />
          }
          label="Display Weights"
        />
      </Box>
    </Box>
  );
};

export const VisualSet = props => {
  const items = useSelector(itemsSelector);

  const [size, setSize] = useState({ width: 0, height: 0 });

  const classes = useStyles({ size }); // dynamically resize dots on different viewports

  return (
    <Measure bounds onResize={({ bounds }) => setSize(bounds)}>
      {({ measureRef }) => (
        <Box ref={measureRef} flex={1} className={classes.dots}>
          {items.map((color, i) => (
            <Item index={i} {...color} />
          ))}
        </Box>
      )}
    </Measure>
  );
};

export const Sidebar = () => {
  const classes = useStyles();

  return (
    <Box className={classes.sidebar}>
      <Options />

      <VisualSet />
    </Box>
  );
};
