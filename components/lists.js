import { useState } from "react";
import { Box } from "@material-ui/core";
import { FixedSizeList as List } from "react-window";
import Measure from "react-measure";

export const FixedSizedList = props => {
  const { itemCount, itemSize, row } = props;

  // default height seems to be 0 on windows but -1 on macos???
  const [size, setSize] = useState({ width: 0, height: 0 }); // set the default height to 0 so that the list's default height is 0 until it is rendered
  const { width, height } = size;

  return (
    <Measure bounds onResize={({ bounds }) => setSize(bounds)}>
      {({ measureRef }) => (
        <Box ref={measureRef} flex={1} {...props}>
          <List
            height={height} // height of the window
            width={width}
            itemCount={
              typeof itemCount === "function"
                ? itemCount({ width, height })
                : itemCount
            } // itemcount can depend on the width and height of the window, so we leave that up to the user
            itemSize={itemSize}
          >
            {({ index, style }) => row({ index, style, width, height })}
          </List>
        </Box>
      )}
    </Measure>
  );
};

export const VariableSizedList = props => {
  const { itemCount = () => {}, itemSize, row } = props;

  // default height seems to be 0 on windows but -1 on macos???
  const [size, setSize] = useState({ width: -1, height: -1 }); // set the default height to 0 so that the list's default height is 0 until it is rendered
  const { width, height } = size;

  return (
    <Measure bounds onResize={({ bounds }) => setSize(bounds)}>
      {({ measureRef }) => (
        <Box ref={measureRef} flex={1}>
          <List
            height={height} // height of window
            width={width} // width of window
            itemCount={itemCount({ width, height })}
            itemSize={itemSize}
          >
            {({ index, style }) => row({ index, style, width, height })}
          </List>
        </Box>
      )}
    </Measure>
  );
};
