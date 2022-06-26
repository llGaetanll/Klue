import { createTheme } from "@mui/material/styles";

const dark = {
  palette: {
    primary: {
      light: "#7da0b0",
      main: "#b3e5fc",
      dark: "#c2eafc",
    },
    // primary: {
    // light: "#9d85a5",
    // main: "#85678f",
    // dark: "#5d4864",
    // },
    secondary: {
      light: "#efd5a2",
      main: "#ebcb8b",
      dark: "#a48e61",
    },
    background: {
      default: "#1d1f21",
      paper: "#373b41",
    },
  },
};

const light = {
  palette: {
    primary: {
      light: "#7da0b0",
      main: "#b3e5fc",
      dark: "#c2eafc",
    },
    // primary: {
    // light: "#9d85a5",
    // main: "#85678f",
    // dark: "#5d4864",
    // },
    secondary: {
      light: "#efd5a2",
      main: "#ebcb8b",
      dark: "#a48e61",
    },
    background: {
      default: "#1d1f21",
      paper: "#373b41",
    },
  },
};

// Create a theme instance.
const theme = createTheme(
  {
    palette: {
      mode: "dark",
      // primary: {
      // main: amber[500]
      // },
      // secondary: {
      // main: lightBlue.A400
      // }
    },
    shadows: [
      "none",
      "0 0 36px rgba(0, 0, 0, 0.1)",
      "0 0 36px rgba(0, 0, 0, 0.2)",
      "0 0 42px rgba(0, 0, 0, 0.3)",
      "0 0 46px rgba(0, 0, 0, 0.4)",
      "0 0 52px rgba(0, 0, 0, 0.5)",
    ],
    shape: {
      borderRadius: 5,
    },
    typography: {
      fontFamily: ['"Inter"', '"Roboto"'],
      // fontFamily: '"Roboto", "Inter"',
    },
  },
  dark
);

export default theme;
