import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";

import { motion } from "framer-motion";
import {
  Box,
  Paper,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import GetAppIcon from "@material-ui/icons/GetApp";
import FileSaver from "file-saver";

import UploadButton from "../../uploadButton";
import Range from "./range";
import { setRepeat } from "../../../src/cards";
import { formatDate, getDate } from "../../../util";

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
  current: theme.palette.main
});

const Item = ({ itemState = "inactive" }) => {
  const classes = useStyles({ itemState });

  return <Paper className={classes.dot} />;
};

export const Sidebar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const cards = useSelector(state => state.cards.data);
  const range = useSelector(state => state.cards.range);
  const history = useSelector(state => state.cards.history);

  const handleDownload = () => {
    const cardsBlob = new Blob([JSON.stringify(cards)], {
      type: "application/json"
    });

    FileSaver.saveAs(cardsBlob, `cards [${formatDate(getDate())}].json`);
  };

  const handleTheme = () => {};

  const repeatCards = useSelector(state => state.cards.repeat);

  const handleRepeat = () => dispatch(setRepeat(!repeatCards));

  return (
    <Box className={classes.sidebar}>
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
        <UploadButton />
      </Box>
      <Box display="flex">
        {/* <Switch checked={isDark} onChange={handleTheme} /> */}
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
      </Box>

      <Box className={classes.dots}>
        {cards.map(({ char }, i) => {
          let itemState = "inactive";

          if (i + 1 >= range[0] && i + 1 <= range[1]) itemState = "active";

          if (history.indexOf(i) > -1) itemState = "visited";

          return <Item character={char} itemState={itemState} />;
        })}
      </Box>
    </Box>
  );
};

// history.indexOf(i) > -1 &&
