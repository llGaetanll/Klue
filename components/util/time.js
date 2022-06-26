import { Box, Typography } from "@mui/material";

const timeStyles = {
  fontSize: "1.3em",
  fontFamily: "monospace",
  fontWeight: 500,
  opacity: 0.9,
};

// Time component modified from https://github.com/llGaetanll/altimer/blob/63adee4d54be3b2f4000916f6e7f4a77a7e5ace4/components/general/time.js#L79
const Time = ({ time, styles }) => {
  const { h, m, s, ms } = time;
  return (
    <Box display="flex">
      {h && (
        <Typography variant="h1" css={styles || timeStyles}>
          {h}
        </Typography>
      )}
      {h && m && (
        <Typography variant="h1" css={styles || timeStyles}>
          :
        </Typography>
      )}
      {m && (
        <Typography variant="h1" css={styles || timeStyles}>
          {m}
        </Typography>
      )}
      {m && s && (
        <Typography variant="h1" css={styles || timeStyles}>
          :
        </Typography>
      )}
      {s && (
        <Typography variant="h1" css={styles || timeStyles}>
          {s}
        </Typography>
      )}
      {s && ms && (
        <Typography variant="h1" css={styles || timeStyles}>
          .
        </Typography>
      )}
      {ms && (
        <Typography variant="h1" css={styles || timeStyles}>
          {ms}
        </Typography>
      )}
      <Typography variant="h2" css={styles || timeStyles}>
        s
      </Typography>
    </Box>
  );
};

export default Time;
