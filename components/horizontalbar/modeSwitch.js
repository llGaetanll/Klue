import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Button,
  Tooltip,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import DoneAllIcon from "@material-ui/icons/DoneAll";

import { setMode } from "../../src/cards";

const ModeSwitch = () => {
  const dispatch = useDispatch();

  const mode = useSelector(state => state.cards.mode)

  const handleNormal = () =>
    dispatch(setMode("normal"));

  const handleTest = () => {
    dispatch(setMode("test"))
  }

  switch (mode) {
    case "test":
      return (
        <Tooltip title="Back to Normal Mode">
          <span>
            <Button
              color="primary"
              onClick={handleNormal}
              startIcon={<CloseIcon />}
              style={{ whiteSpace: 'nowrap' }}
            >
              Cancel Test
            </Button>
          </span>
        </Tooltip>
      )
    case "normal": 
      return (
        <Button
          color="primary"
          onClick={handleTest}
          startIcon={<DoneAllIcon />}
          style={{ whiteSpace: 'nowrap' }}
        >
          Start Test
        </Button>
      )
  }
}

export default ModeSwitch;
