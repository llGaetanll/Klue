import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import { motion } from "framer-motion";
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
  DialogActions
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
  setIndex
} from "../../../src/cards";
import { toggleTheme, darkSelector } from "../../../src/settings";

import { FeedbackContext } from "../../../util/feedback";

const useStyles = makeStyles(theme => ({
  sidebar: {
    flex: 1,
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

const Settings = props => {
  const dispatch = useDispatch();

  const repeatCards = useSelector(state => state.cards.repeat);
  const isDark = useSelector(darkSelector);

  const handleRepeat = () => dispatch(setRepeat(!repeatCards));

  const handleTheme = () => dispatch(toggleTheme());

  return (
    <>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
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
              <Switch color="primary" checked={isDark} onChange={handleTheme} />
            }
            label="Dark Theme"
          />
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

const ButtonBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { setDialog } = useContext(FeedbackContext);

  const handleDownload = () => dispatch(getCards());

  const handleSettings = () => setDialog(<Settings />);

  // const handleUpload = event => {
  //   event.preventDefault();
  //   setDialog(<UploadWarning />);
  // };

  return (
    <Box display="flex">
      <Range />

      <Tooltip title="Download Cards">
        <IconButton
          color="primary"
          className={classes.button}
          onClick={handleDownload}
        >
          <GetAppIcon />
        </IconButton>
      </Tooltip>

      <UploadButton>
        <Tooltip title="Upload Cards">
          <IconButton color="primary" component="span">
            <PublishIcon />
          </IconButton>
        </Tooltip>
      </UploadButton>

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
  );
};

export const Sidebar = () => {
  const classes = useStyles();

  const items = useSelector(itemsSelector);

  return (
    <Box className={classes.sidebar}>
      <ButtonBar />

      <Box className={classes.dots}>
        {items.map((props, i) => (
          <Item index={i} {...props} />
        ))}
      </Box>
    </Box>
  );
};
