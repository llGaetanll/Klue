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
} from "@mui/material";

import GetAppIcon from "@mui/icons-material/GetApp";
import PublishIcon from "@mui/icons-material/Publish";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Close";

import UploadButton from "../util/uploadbutton";

import { getCards, setMode, testDoneSelector } from "../../src/cards";
import { FeedbackContext } from "../../util/feedback";

import Range from "./range";
import Settings from "./settings";

import theme from "../../util/theme";

const Divider = () => (
  <MuiDivider
    css={{
      margin: `${theme.spacing(1)} ${theme.spacing(1)}`,
    }}
    orientation="vertical"
    variant="middle"
    flexItem
  />
);

// Additional buttons in the bottom bar
// Upload, Download, Settings...
const Misc = () => {
  const dispatch = useDispatch();

  const { setDialog } = useContext(FeedbackContext);

  const handleDownload = () => dispatch(getCards());
  const handleSettings = () => setDialog(<Settings />);

  return (
    <>
      <Tooltip title="Download Cards">
        <IconButton color="primary" onClick={handleDownload}>
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
        <IconButton color="primary" onClick={handleSettings}>
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
  const dispatch = useDispatch();

  const handleEdit = () => dispatch(setMode("edit"));
  const handleTest = () => dispatch(setMode("test"));

  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        height: 64,

        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      }}
    >
      <Typography
        variant="h5"
        css={{
          paddingRight: theme.spacing(2),

          fontFamily: "monospace",
          fontWeight: 800,
          fontSize: 20,
        }}
      >
        NORMAL
      </Typography>

      <Divider />

      <Button
        color="primary"
        onClick={handleEdit}
        startIcon={<EditIcon />}
        css={{ whiteSpace: "nowrap" }}
      >
        Edit
      </Button>

      <Button
        color="primary"
        onClick={handleTest}
        startIcon={<DoneAllIcon />}
        css={{ whiteSpace: "nowrap" }}
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
  const dispatch = useDispatch();

  const handleNormal = () => dispatch(setMode("normal"));

  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        height: 64,

        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      }}
    >
      <Typography
        variant="h5"
        css={{
          paddingRight: theme.spacing(2),

          fontFamily: "monospace",
          fontWeight: 800,
          fontSize: 20,
        }}
      >
        EDIT
      </Typography>

      <Divider />

      <Button
        color="primary"
        onClick={handleNormal}
        startIcon={<SaveIcon />}
        css={{ whiteSpace: "nowrap" }}
      >
        Save
      </Button>

      <Box flex={1} />

      <Misc />
    </Box>
  );
};

const TestBar = () => {
  const dispatch = useDispatch();

  const { setDialog } = useContext(FeedbackContext);

  const handleNormal = () => dispatch(setMode("normal"));
  const handleCancel = () =>
    setDialog(<CancelTest />, (exit) => (exit ? handleNormal() : null));

  // if the test is done, display different button
  const testDone = useSelector(testDoneSelector);

  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        height: 64,

        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      }}
    >
      <Typography
        variant="h5"
        css={{
          paddingRight: theme.spacing(2),

          fontFamily: "monospace",
          fontWeight: 800,
          fontSize: 20,
        }}
      >
        TEST
      </Typography>

      <Divider />

      {testDone ? (
        <Button
          color="primary"
          onClick={handleNormal}
          startIcon={<DoneIcon />}
          css={{ whiteSpace: "nowrap" }}
        >
          Done
        </Button>
      ) : (
        <Button
          color="primary"
          onClick={handleCancel}
          startIcon={<CancelIcon />}
          css={{ whiteSpace: "nowrap" }}
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
  const mode = useSelector((state) => state.cards.mode);

  const bar = BAR[mode];

  return <Box css={{ overflow: "auto" }}>{bar}</Box>;
};
