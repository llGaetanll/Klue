import { useEffect, useRef } from "react";

import {
  Box,
  Typography,
  TextField as MuiTextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  card: {
    width: 300,
    minHeight: 400,

    display: "flex",
    userSelect: 'none'
  },
  content: {
    display: "block",
    flex: 1
  },
  character: {
    position: "relative",
    fontSize: 120,

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    margin: theme.spacing(1)
  },
  index: {
    position: "absolute",

    lineHeight: "initial",
    fontSize: 24,
    fontWeight: 600,
    opacity: 0.7
  },
  cardInfo: {
    display: "flex",
    flex: 2,
    justifyContent: "center",
    flexDirection: "column"
  },

  component: {
    display: 'flex',

    // display actions menu on hover
    '&:hover $action': {
      opacity: 1
    },

    minHeight: 48,
    alignItems: 'center'
  },
  action: {
    opacity: 0,

    position: 'absolute',
    transform: 'translateX(-100%)',

    "&:hover": {
      backgroundColor: "transparent"
    }
  },
}));

const useFieldStyles = makeStyles(theme => ({
  editTextField: {
    margin: theme.spacing(1)
  },
}));

// text field component
export const TextField = ({ display, edit, value, setValue, ...props }) => {
  const classes = useFieldStyles(); // default styles for every field
  const inputRef = useRef();

  const { inputProps: { focus, ...inputProps }, textFieldProps } = props;

  const handleEdit = event => setValue(event.target.value);

  // focus the input ref
  useEffect(() => {
    // console.log("useEffect", edit, focus)
    if (edit && focus) {
      // console.log("focusing")
      inputRef.current.focus();
    }
  }, [edit, display])

  if (edit)
    return (
      <MuiTextField
        className={classes.editTextField}
        onChange={handleEdit}
        value={value || ""}
        inputRef={inputRef}
        {...inputProps}
      />
    );

  if (!display) 
    return <></>;

  return (
    <Typography className={classes.textField} {...textFieldProps}>
      {value}
    </Typography>
  );
}
