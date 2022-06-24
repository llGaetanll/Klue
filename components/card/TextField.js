import { useEffect, useRef } from "react";

import { Box, Typography, TextField as MuiTextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useFieldStyles = makeStyles((theme) => ({
  editTextField: {
    margin: theme.spacing(1),
  },
}));

// text field component
const TextField = ({ display, edit, value, setValue, ...props }) => {
  const classes = useFieldStyles(); // default styles for every field
  const inputRef = useRef();

  const {
    inputProps: { focus, ...inputProps },
    textFieldProps,
  } = props;

  const handleEdit = (event) => setValue(event.target.value);

  // focus the input ref
  useEffect(() => {
    if (edit && focus) {
      inputRef.current.focus();
    }
  }, [edit, display]);

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

  if (!display) return <></>;

  return (
    <Typography className={classes.textField} {...textFieldProps}>
      {value}
    </Typography>
  );
};

export default TextField;
