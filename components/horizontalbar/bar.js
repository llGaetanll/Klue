import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Tooltip,
  Typography,
  Button,
  IconButton,
  Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import SettingsIcon from "@material-ui/icons/Settings";
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import UploadButton from "../util/uploadButton";

import { getCards, setMode, editSelector, normalSelector } from "../../src/cards";
import { FeedbackContext } from "../../util/feedback";

import ModeSwitch from "./modeSwitch";
import Range from "../range";
import Settings from "../settings";

const useStyles = makeStyles(theme => ({
  horizontalbar: {
    display: 'flex',
    alignItems: 'center',

    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
  },
  mode: {
    paddingRight: theme.spacing(2),

    fontFamily: 'monospace',
    fontWeight: 800,
    fontSize: 20
  }
}));

export const HorizontalBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const mode = useSelector(state => state.cards.mode)
  const edit = useSelector(editSelector);
  const normal = useSelector(normalSelector);

  const { setDialog } = useContext(FeedbackContext);

  const handleDownload = () => dispatch(getCards());

  const handleSettings = () => setDialog(<Settings />);

  const handleEdit = () =>
    dispatch(setMode("edit"));

  const handleNormal = () =>
    dispatch(setMode("normal"));

  return (
    <Box className={classes.horizontalbar}>
      <Typography variant="h5" className={classes.mode}>{mode.toUpperCase()}</Typography>
      {!edit && (<Range />)}

      <Box display="flex" flex={1} />

      {edit && (
        <Tooltip title="Back to Normal Mode">
          <span>
            <Button
              color="primary"
              onClick={handleNormal}
              startIcon={<ArrowBackIcon />}
              style={{ whiteSpace: 'nowrap' }}
            >
              Back
            </Button>
          </span>
        </Tooltip>
      )}

      {normal && (
        <Tooltip title="Edit Mode">
          <span>
            <IconButton
              color="primary"
              onClick={handleEdit}
              style={{ whiteSpace: 'nowrap' }}
            >
              <EditIcon />
            </IconButton>
          </span>
        </Tooltip>
      )}

      <Divider orientation="vertical" variant="middle" />

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
}
