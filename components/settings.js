import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  setRepeat,
  getCards,
} from "../src/cards";
import { toggleTheme, darkSelector } from "../src/settings";

const useStyles = makeStyles(theme => ({

}));

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

const Settings = props => {
  const dispatch = useDispatch();

  const testing = useSelector(state => state.cards.test);

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
                disabled={testing}
                checked={repeatCards}
                onChange={handleRepeat}
              />
            }
            label="Repeat Cards"
          />
          {/* <FormControlLabel
            control={
              <Switch color="primary" checked={isDark} onChange={handleTheme} />
            }
            label="Dark Theme"
          /> */}
        </Box>
      </DialogContent>
    </>
  );
};

export default Settings;
