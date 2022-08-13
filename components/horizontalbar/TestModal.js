import { useState } from "react";
import { motion } from "framer-motion";

import {
  Button,
  Slider,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ButtonGroup,
} from "@mui/material";

import theme from "../../util/theme";

const ButtonSwitch = ({ options, value, onChange, ...props }) => (
  <ButtonGroup {...props}>
    {options.map((option, i) => (
      <Button
        key={`type-${i}`}
        css={{ position: "relative" }}
        onClick={() => onChange(option)}
      >
        {value === option && (
          <motion.div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            transition={{
              layout: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            layoutId="option"
          >
            <span
              css={{
                flex: 1,
                margin: theme.spacing(0.5),

                borderRadius: theme.shape.borderRadius,

                background: theme.palette.primary.light,
                opacity: 0.2,
              }}
            />
          </motion.div>
        )}
        {option}
      </Button>
    ))}
  </ButtonGroup>
);

// monospace text styles
const mono = {
  fontFamily: "monospace",
  fontWeight: "bold",
  background: theme.palette.background.default,
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
};

// modal that pops up before jumping into a test containing parameters about the test
const TestModal = ({ onClose }) => {
  const [testState, setTestState] = useState({
    type: "Sized",
    size: 25,
    time: 3,
  });

  const setType = (type) => setTestState((s) => ({ ...s, type }));

  const setSize = (_, size) => setTestState((s) => ({ ...s, size }));
  const setTime = (_, time) => setTestState((s) => ({ ...s, time }));

  return (
    <>
      <DialogTitle>Test Type</DialogTitle>
      <DialogContent
        css={{ minWidth: 300, display: "flex", flexDirection: "column" }}
      >
        <div
          css={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            marginBottom: theme.spacing(2),
          }}
        >
          <ButtonSwitch
            options={["Sized", "Timed"]}
            value={testState.type}
            onChange={setType}
            disableElevation
            size="large"
            variant="outlined"
          />
        </div>
        {testState.type === "Sized" ? (
          <Slider
            css={{
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(3),
            }}
            value={testState.size}
            onChange={setSize}
            track={false}
            step={5}
            min={10}
            size="large"
            marks={[10, 25, 50, 100].map((v) => ({
              value: v,
              label: v.toString(),
            }))}
          />
        ) : (
          <Slider
            css={{
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(3),
            }}
            value={testState.time}
            onChange={setTime}
            track={false}
            min={1}
            max={20}
            size="large"
            marks={[1, 3, 5, 10, 20].map((v) => ({
              value: v,
              label: v.toString(),
            }))}
          />
        )}
        <DialogContentText>
          Begin a{" "}
          {testState.type === "Sized" ? (
            <>
              <span css={mono}>{testState.size}</span> cards
            </>
          ) : (
            <>
              <span css={mono}>{testState.time}</span> minute
            </>
          )}{" "}
          <span css={mono}>{testState.type}</span> test
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Cancel</Button>
        <Button onClick={() => onClose(testState)}>Start</Button>
      </DialogActions>
    </>
  );
};

export default TestModal;
