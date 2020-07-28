import { makeStyles } from "@material-ui/core/styles";

import { Box } from "@material-ui/core";

import KeyBinds from "../components/keybinds";

// Default Layout
const useStyles = makeStyles(theme => ({}));

export default ({ children }) => {
  const classes = useStyles();

  return (
    <Box display="flex" flex={1} flexDirection="column">
      <KeyBinds>{children}</KeyBinds>
    </Box>
  );
};
