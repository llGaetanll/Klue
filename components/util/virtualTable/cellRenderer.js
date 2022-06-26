import { useRef } from "react";
import clsx from "clsx";

import { TableCell, Tooltip } from "@mui/material";

import Time from "../time";
import CardStat from "../../statistics/cardstat";

import { useTableStyles } from "./index";
import { formatTime, round } from "../../../util/index";

// renders the index cell of the table
export const IndexRenderer = ({ cellData, tableClasses, ...props }) => {
  const index = cellData;

  return (
    <TableCell
      component="div"
      className={clsx(
        tableClasses.tableCell,
        tableClasses.flexContainer,
        tableClasses.index
      )}
      variant="body"
    >
      <span>{index}</span>
    </TableCell>
  );
};

// renders the character
export const CharRenderer = ({ cellData, ...props }) => {
  const tableClasses = useTableStyles();
  const character = cellData;

  return (
    <TableCell
      component="div"
      className={clsx(
        tableClasses.tableCell,
        tableClasses.flexContainer,
        tableClasses.index
      )}
      variant="body"
    >
      <span>{character}</span>
    </TableCell>
  );
};

// renders the graph for each node
export const GraphRenderer = ({ cellData, ...props }) => {
  const tableClasses = useTableStyles();
  const { isScrolling } = props;
  const { weightDelta, prevWeight, weights } = cellData;

  const render = useRef(!isScrolling);
  if (!isScrolling) render.current = true;

  let component = <></>;
  if (render.current)
    component = (
      <CardStat
        weightDelta={weightDelta}
        prevWeight={prevWeight}
        {...weights} // pass in min and max weights
      />
    );

  return (
    <Tooltip
      placement="top"
      title={`${
        weightDelta > 0
          ? `+${round(weightDelta, 3)}`
          : `${round(weightDelta, 3)}`
      } from ${round(prevWeight, 3)}`}
      arrow
    >
      <TableCell
        component="div"
        className={clsx(tableClasses.tableCell, tableClasses.flexContainer)}
        variant="body"
      >
        {component}
      </TableCell>
    </Tooltip>
  );
};

// renders the time cell of the table
export const TimeRenderer = ({ cellData, ...props }) => {
  const tableClasses = useTableStyles();
  const { isScrolling } = props;

  const render = useRef(!isScrolling);
  if (!isScrolling) render.current = true;

  let component = <></>;
  if (render.current) component = <Time time={formatTime(cellData)} />;

  return (
    <TableCell
      component="div"
      className={clsx(
        tableClasses.numeric,
        tableClasses.tableCell,
        tableClasses.flexContainer
      )}
      variant="body"
    >
      {component}
    </TableCell>
  );
};
