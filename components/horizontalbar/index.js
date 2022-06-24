import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Tooltip,
  Typography,
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider as MuiDivider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import SettingsIcon from "@material-ui/icons/Settings";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import DoneIcon from "@material-ui/icons/Done";
import CancelIcon from "@material-ui/icons/Close";

import UploadButton from "../util/uploadButton";

import { getCards, setMode, testDoneSelector } from "../../src/cards";
import { FeedbackContext } from "../../util/feedback";

import Range from "../range";
import Settings from "../settings";

const useStyles = makeStyles((theme) => ({
  horizontalbar: {
    display: "flex",
    alignItems: "center",
    height: 64,

    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  wrapper: {
    overflow: "auto",
  },
  mode: {
    paddingRight: theme.spacing(2),

    fontFamily: "monospace",
    fontWeight: 800,
    fontSize: 20,
  },
  divider: {
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
}));

const Divider = () => {
  const classes = useStyles();

  return (
    <MuiDivider
      className={classes.divider}
      orientation="vertical"
      variant="middle"
      flexItem
    />
  );
};

// Additional buttons in the bottom bar
// Upload, Download, Settings...
const Misc = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { setDialog } = useContext(FeedbackContext);

  const handleDownload = () => dispatch(getCards());
  const handleSettings = () => setDialog(<Settings />);

  return (
    <>
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
    </>
  );
};

// confimation dialog that shows up when trying to exit an unfinished test
const CancelTest = ({ onClose }) => (
  <>
    <DialogTitle>Exit Test?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Exiting this test will nullify its results.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => onClose(false)}>Keep Testing</Button>
      <Button onClick={() => onClose(true)}>Exit</Button>
    </DialogActions>
  </>
);

const NormalBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleEdit = () => dispatch(setMode("edit"));
  const handleTest = () => dispatch(setMode("test"));

  return (
    <Box className={classes.horizontalbar}>
      <Typography variant="h5" className={classes.mode}>
        NORMAL
      </Typography>

      <Divider />

      <Button
        color="primary"
        onClick={handleEdit}
        startIcon={<EditIcon />}
        style={{ whiteSpace: "nowrap" }}
      >
        Edit
      </Button>

      <Button
        color="primary"
        onClick={handleTest}
        startIcon={<DoneAllIcon />}
        style={{ whiteSpace: "nowrap" }}
      >
        Test
      </Button>

      <Range />

      <Divider />

      <Misc />
    </Box>
  );
};

const EditBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleNormal = () => dispatch(setMode("normal"));

  return (
    <Box className={classes.horizontalbar}>
      <Typography variant="h5" className={classes.mode}>
        EDIT
      </Typography>

      <Divider />

      <Button
        color="primary"
        onClick={handleNormal}
        startIcon={<SaveIcon />}
        style={{ whiteSpace: "nowrap" }}
      >
        Save
      </Button>

      <Box flex={1} />

      <Misc />
    </Box>
  );
};

const TestBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { setDialog } = useContext(FeedbackContext);

  const handleNormal = () => dispatch(setMode("normal"));
  const handleCancel = () =>
    setDialog(<CancelTest />, (exit) => (exit ? handleNormal() : null));

  // if the test is done, display different button
  const testDone = useSelector(testDoneSelector);

  return (
    <Box className={classes.horizontalbar}>
      <Typography variant="h5" className={classes.mode}>
        TEST
      </Typography>

      <Divider />

      {testDone ? (
        <Button
          color="primary"
          onClick={handleNormal}
          startIcon={<DoneIcon />}
          style={{ whiteSpace: "nowrap" }}
        >
          Done
        </Button>
      ) : (
        <Button
          color="primary"
          onClick={handleCancel}
          startIcon={<CancelIcon />}
          style={{ whiteSpace: "nowrap" }}
        >
          Exit
        </Button>
      )}
    </Box>
  );
};

// bar type depends on mode
const BAR = {
  normal: <NormalBar />,
  edit: <EditBar />,
  test: <TestBar />,
};

// the bar changes depending on the state of the program.
export const HorizontalBar = () => {
  const classes = useStyles();
  const mode = useSelector((state) => state.cards.mode);

  const bar = BAR[mode];

  return <Box className={classes.wrapper}>{bar}</Box>;
};
