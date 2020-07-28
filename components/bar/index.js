import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Box, Paper, Button, Divider, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import EditIcon from "@material-ui/icons/Edit";
import UpdateIcon from "@material-ui/icons/Update";

import { setEdit, setIndex } from "../../store";

import Range from "./range";
import CardState from "./cardState";

const useStyles = makeStyles(theme => ({
  topbar: {
    display: "flex",
    position: "absolute",
    bottom: 0,
    alignItems: "center",

    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: 0,
    height: 48,
    width: "100%",
    boxSizing: "border-box"

    // overflow: "auto"
  },
  button: {
    margin: `0 ${theme.spacing(1)}px`
  },
  divider: {
    margin: `0 ${theme.spacing(2)}px`
  }
}));

const TopBar = props => {
  const classes = useStyles();

  return (
    <Paper className={classes.topbar}>
      <Range />
      {/* <Divider orientation="vertical" flexItem className={classes.divider} /> */}
      <Box display="flex" flex={1} />
      <CardState />
    </Paper>
  );
};

export default TopBar;
