import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import {
  Tooltip,
  Typography,
  Button,
  Slider,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider as MuiDivider,
  ButtonGroup,
} from "@mui/material";

import GetAppIcon from "@mui/icons-material/GetApp";
import PublishIcon from "@mui/icons-material/Publish";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import UploadButton from "../util/UploadButton";

import {
  getCards,
  setMode,
  test,
  testDoneSelector,
} from "../../src/cards/cards";
import { FeedbackContext } from "../../util/feedback";

import TestParams from "./TestModal";
import Settings from "./settings";
import Tags from "../util/Tags/Tags";

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
// TODO: this might move to some other file later
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

export const HorizontalBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { setDialog } = useContext(FeedbackContext);

  const handleEdit = () => dispatch(setMode("edit"));
  const handleTest = () =>
    setDialog(<TestParams />, (state) => {
      // if user cancels
      if (!state) return;

      router.push({ pathname: "/test", query: state });
      // dispatch(test(state));
    });

  return (
    <div css={{ overflow: "auto" }}>
      <div
        css={{
          display: "flex",
          gap: theme.spacing(1),
          alignItems: "center",
          height: 64,

          padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
        }}
      >
        <Typography
          variant="h5"
          css={{
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
          css={{ whiteSpace: "nowrap", margin: theme.spacing(1) }}
        >
          Test
        </Button>

        <Divider />

        {/* <Range /> */}
        <div css={{ overflow: "auto" }}>
          <Tags />
        </div>

        <Divider />

        <Misc />
      </div>
    </div>
  );
};
