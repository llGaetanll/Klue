import { useEffect, useRef } from "react";

import { Typography, TextField as MuiTextField } from "@mui/material";

import theme from "../../util/theme";

// text field component
const TextField = ({ display, edit, value, setValue, ...props }) => {
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
        css={{
          margin: theme.spacing(1),
        }}
        onChange={handleEdit}
        value={value || ""}
        inputRef={inputRef}
        {...inputProps}
      />
    );

  if (!display) return <></>;

  return <Typography {...textFieldProps}>{value}</Typography>;
};

export default TextField;
