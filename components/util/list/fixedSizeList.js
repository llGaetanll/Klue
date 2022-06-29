import { FixedSizeList as List } from "react-window";
import Autosizer from "react-virtualized-auto-sizer";

const FixedSizeList = ({ itemCount = () => {}, itemSize, row }) => {
  return (
    <Autosizer>
      {({ width, height }) => (
        <List
          height={height} // height of the window
          width={width}
          itemCount={itemCount({ width, height })}
          itemSize={itemSize}
        >
          {({ index, style }) => row({ index, style, width, height })}
        </List>
      )}
    </Autosizer>
  );
};

export default FixedSizeList;
