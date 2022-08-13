import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Typography,
  Switch,
  Checkbox,
  Button,
  FormControlLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { setRepeat, setAutoAdvance, getCards } from "../../src/cards/cards";
import { toggleIndex, toggleWeight } from "../../src/settings";

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
          downloading this card set if you {"haven't"} already.
        </Typography>

        <DialogActions>
          <Button onClick={handleDownload} color="primary">
            Download Cards
          </Button>
          <Button onClick={onClose}>I know what {"I'm"} doing</Button>
        </DialogActions>
      </DialogContent>
    </>
  );
};

const Settings = (props) => {
  const dispatch = useDispatch();

  const testing = useSelector((state) => state.cards.test);

  // const isDark = useSelector(darkSelector);
  const repeatCards = useSelector((state) => state.cards.repeat);
  const autoAdvance = useSelector((state) => state.cards.autoAdvance);
  const showIndex = useSelector((state) => state.settings.showIndex);
  const showWeight = useSelector((state) => state.settings.showWeight);

  // const handleTheme = () => dispatch(toggleTheme());
  const handleRepeat = () => dispatch(setRepeat(!repeatCards));
  const handleAdvance = () => dispatch(setAutoAdvance(!autoAdvance));
  const handleIndex = () => dispatch(toggleIndex());
  const handleWeight = () => dispatch(toggleWeight());

  return (
    <>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          <Typography component="h1" variant="caption">
            Test Mode
          </Typography>
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
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                disabled={testing}
                checked={showIndex}
                onChange={handleIndex}
              />
            }
            label="Display Card Number"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                disabled={testing}
                checked={showWeight}
                onChange={handleWeight}
              />
            }
            label="Display Card Weight"
          />
          {/* <FormControlLabel
            control={
              <Switch color="primary" checked={isDark} onChange={handleTheme} />
            }
            label="Dark Theme"
          /> */}
          <Typography component="h1" variant="caption">
            Edit Mode
          </Typography>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                disabled={testing}
                checked={autoAdvance}
                onChange={handleAdvance}
              />
            }
            label="Auto Advance"
          />
        </Box>
      </DialogContent>
    </>
  );
};

export default Settings;
