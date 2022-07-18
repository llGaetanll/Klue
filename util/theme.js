import { createTheme } from "@mui/material/styles";

const dark = {
  palette: {
    mode: "dark",
    primary: {
      light: "#7da0b0",
      main: "#b3e5fc",
      dark: "#c2eafc",
    },
    secondary: {
      light: "#efd5a2",
      main: "#ebcb8b",
      dark: "#a48e61",
    },
    weights: {
      best: "#1b5e20",
      worst: "#c62828",
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

const moonlight = {
  palette: {
    mode: "dark",
    // from light to dark
    primary: {
      main: "#FFD60A",
      light: "#FBEC5D",
      dark: "#FFC300",
    },
    secondary: {
      main: "#003566",
      light: "#26428B",
      dark: "#001D3D",
    },
    text: {
      primary: "#FFD60A",
      secondary: "#FFC300",
    },
    // colors used in interpolation of the weights
    weights: {
      best: "#54B0D7",
      worst: "#D53131",
    },
    background: {
      paper: "#0f3661",
      default: "#07294d",
    },
  },
};

const beach = {
  palette: {
    mode: "light",
    // from light to dark
    primary: {
      main: "#9E3A2E",
      light: "#C44536",
      dark: "#772E25",
    },
    secondary: {
      main: "#21585A",
      light: "#197278",
      dark: "#283D3B",
    },
    text: {
      primary: "#9E3A2E",
      secondary: "#772E25",
    },
    // colors used in interpolation of the weights
    weights: {
      best: "#96C3C5",
      worst: "#283D3B",
    },
    background: {
      paper: "#D5C9C1",
      default: "#EDDDD4",
    },
  },
};

const createExtendedTheme = () => {
  const defTheme = createTheme();

  const gap = (spacing) => parseInt(defTheme.spacing(spacing), 10);

  return createTheme(
    {
      gap,
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
      },
    },
    moonlight
    // beach
    // dark
  );
};

// Create a theme instance.
const theme = createExtendedTheme();

export default theme;
