import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import FileSaver from "file-saver";

import { Box, Paper, Divider, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import EditIcon from "@material-ui/icons/Edit";
import UpdateIcon from "@material-ui/icons/Update";
import GetAppIcon from "@material-ui/icons/GetApp";

import UploadButton from "../../uploadButton";

import { setEdit } from "../../../src/cards";
import { formatDate, getDate } from "../../../util";

const useStyles = makeStyles(theme => ({
  button: {
    margin: `0 ${theme.spacing(1)}px`,
    whiteSpace: "nowrap" // text spans one line
  }
}));

/* Buttons on the bar related to card usage */
const CardState = props => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const cards = useSelector(state => state.cards.data);
  const edit = useSelector(state => state.cards.edit);

  const handleEdit = () => dispatch(setEdit(!edit));

  const handleDownload = () => {
    const cardsBlob = new Blob([JSON.stringify(cards)], {
      type: "application/json"
    });

    FileSaver.saveAs(cardsBlob, `cards [${formatDate(getDate())}].json`);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Button
        color="primary"
        className={classes.button}
        onClick={handleEdit}
        startIcon={edit ? <UpdateIcon /> : <EditIcon />}
      >
        {edit ? "Update" : "Edit"}
      </Button>
      <Tooltip title="Download Cards">
        <IconButton
          color="primary"
          className={classes.button}
          onClick={handleDownload}
          startIcon={<GetAppIcon />}
        >
          <GetAppIcon />
        </IconButton>
      </Tooltip>

      <UploadButton />
    </Box>
  );
};

export default CardState;
