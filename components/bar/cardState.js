import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import FileSaver from "file-saver";

import { Box, Paper, Button, Divider, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import EditIcon from "@material-ui/icons/Edit";
import UpdateIcon from "@material-ui/icons/Update";
import GetAppIcon from "@material-ui/icons/GetApp";

import UploadButton from "../uploadButton";

import { setEdit } from "../../store";
import { formatDate, getDate } from "../../util";

const useStyles = makeStyles(theme => ({
  button: {
    margin: `0 ${theme.spacing(1)}px`,
    whiteSpace: "nowrap" // text spans one line
  }
}));

const CardState = props => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const kanji = useSelector(state => state.kanji);
  const edit = useSelector(state => state.card.edit);

  const handleEdit = () => dispatch(setEdit(!edit));

  const handleDownload = () => {
    const kanjiBlob = new Blob([JSON.stringify(kanji)], {
      type: "application/json"
    });

    FileSaver.saveAs(kanjiBlob, `cards [${formatDate(getDate())}].json`);
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
      <Button
        color="primary"
        className={classes.button}
        onClick={handleDownload}
        startIcon={<GetAppIcon />}
      >
        Download Cards
      </Button>
      <UploadButton />
    </Box>
  );
};

export default CardState;
