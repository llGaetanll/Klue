import { useContext } from "react";
import { useDispatch } from "react-redux";

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
import PublishIcon from "@material-ui/icons/Publish";
import SettingsIcon from "@material-ui/icons/Settings";

import CardSetVisual from "./cardSetVisual";
import UploadButton from "../util/uploadButton";

import { getCards } from "../../src/cards";
import { FeedbackContext } from "../../util/feedback";

const useStyles = makeStyles(theme => ({
  sidebar: {
    flex: 1,
    display: "flex",
    flexDirection: "column",

    padding: theme.spacing(2)
  },
}));

export const Sidebar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { setDialog } = useContext(FeedbackContext);

  const handleDownload = () => dispatch(getCards());

  const handleSettings = () => setDialog(<Settings />);

  return (
    <Box className={classes.sidebar}>
      <CardSetVisual />
    </Box>
  );
};
