import { Box, Typography } from "@mui/material";

import theme from "../../util/theme";

const HeaderStat = ({ title, color = () => {}, children, ...props }) => {
  // const classes = useStyles({ color });

  return (
    <Box
      css={{
        display: "flex",
        flex: 1,
        flexDirection: "column",

        margin: theme.spacing(2),
      }}
      {...props}
    >
      <Typography
        component="h2"
        css={{
          fontSize: "1em",
          fontWeight: 500,
          userSelect: "none",
        }}
      >
        {title}
      </Typography>
      {children({
        fontSize: "3em",
        fontWeight: 300,
        display: "flex",
        flexDirection: "row",

        fontFamily: "monospace",
        lineHeight: 1.2,
        color: color(theme),
      })}
    </Box>
  );
};

export default HeaderStat;
