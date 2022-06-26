import { useState, useEffect, cloneElement } from "react";
import MuiAlert from "@mui/material/Alert";
import {
  Box,
  Snackbar,
  Dialog as MuiDialog,
  Menu as MuiMenu,
} from "@mui/material";

import { isEmptyObj } from "../../util";

import theme from "../../util/theme";

export const AlertList = ({ alerts, remAlert }) => {
  // this list contains all currently visible alerts.
  // it's updated whenever the context's alert change
  const alertList = Object.keys(alerts).map((key) => ({
    ...alerts[key],
    alertKey: key,
  }));

  return (
    <Box
      css={{
        display: "inline-flex",
        flexDirection: "column-reverse",
        position: "absolute",
        bottom: 0,
        right: 0,

        marginBottom: 48, // account for bottom tab
      }}
    >
      {alertList.map((alert) => (
        <Alert key={alert.alertKey} remAlert={remAlert} {...alert} />
      ))}
    </Box>
  );
};

export const Alert = ({ alertKey: key, msg, severity, remAlert, params }) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;

    // hide the alert visually
    setOpen(false);
  };

  // remove the alert from the list once exit animation is done
  const handleExited = () => remAlert(key);

  const { lifetimeMS } = params;

  return (
    <Snackbar
      open={open}
      autoHideDuration={lifetimeMS}
      onClose={handleClose}
      onExited={handleExited}
      css={{
        position: "relative",
        margin: theme.spacing(2),
        marginTop: 0,

        transitionDuration: "0.5s",
        transform: "none", // undo styles applied by MUI
        left: 0,
        bottom: 0,
      }}
    >
      <MuiAlert elevation={3} variant="filled" severity={severity}>
        {msg}
      </MuiAlert>
    </Snackbar>
  );
};

export const Dialog = ({ children, onClose, remDialog }) => {
  const [open, setOpen] = useState(false);

  // if children are defined, display the element
  useEffect(() => {
    setOpen(Boolean(children && !isEmptyObj(children)));
  }, [children]);

  const handleClose = (event) => {
    setOpen(false);

    onClose(event);
  };

  const handleExited = () => remDialog();

  if (!children) return <></>;

  return (
    <MuiDialog
      open={open}
      onClose={() => handleClose(null)}
      onExited={handleExited}
    >
      {/* here no need for `cloneElement` since Dialogs don't use refs */}
      {<children.type {...children.props} onClose={handleClose} />}
    </MuiDialog>
  );
};

export const Menu = ({ anchor, children, onClose, remMenu }) => {
  const [open, setOpen] = useState(false);

  // if the anchor is defined, display the element
  useEffect(() => {
    setOpen(Boolean(anchor));
  }, [anchor]);

  const handleClose = (event) => {
    setOpen(false);

    onClose(event);
  };

  const handleExited = () => remMenu();

  if (!children) return <></>;

  return (
    <MuiMenu
      anchorEl={anchor}
      open={open}
      onClose={() => handleClose(null)}
      onExited={handleExited}
    >
      {/* Allow the passing in of props directly from the setMenu function */}
      {/* cloneElement also forwards the refs, which is necessary for a Menu */}
      {cloneElement(children, { onClose: handleClose })}
    </MuiMenu>
  );
};
