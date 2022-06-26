import { memo } from "react";
import clsx from "clsx";

import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { AutoSizer, Column, Table } from "react-virtualized";

import { CharRenderer, GraphRenderer, TimeRenderer } from "./cellRenderer";
import HeaderRenderer from "./headerRenderer";

import theme from "../../../util/theme";

export const useTableStyles = makeStyles((theme) => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    "& .ReactVirtualized__Table__headerRow": {
      flip: false,
      paddingRight: theme.direction === "rtl" ? "0px !important" : undefined,
    },
    "& .ReactVirtualized__Table__rowColumn": {
      height: "inherit",
    },
    "& .ReactVirtualized__Table__row:hover": {
      background: theme.palette.background.paper,
    },
  },
  tableRow: {
    cursor: "default",
    userSelect: "none",
    display: "flex",
  },
  numeric: {
    justifyContent: "flex-end",
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    borderBottom: 0,
    height: "inherit",
  },
  noClick: {
    cursor: "initial",
  },
  empty: {
    color: theme.palette.grey[200],
    fontSize: "2em",
  },
  index: {
    paddingRight: 0,
  },
}));

const VirtualTable = ({ headerHeight = 48, rowHeight = 48, ...props }) => {
  const classes = useTableStyles();

  const { onRowClick, columns, ...tableProps } = props;

  const getRowClassName = ({ index }) => {
    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          height={height}
          width={width}
          headerHeight={headerHeight}
          rowHeight={rowHeight}
          css={{
            // temporary right-to-left patch, waiting for
            // https://github.com/bvaughn/react-virtualized/issues/454
            "& .ReactVirtualized__Table__headerRow": {
              flip: false,
              paddingRight:
                theme.direction === "rtl" ? "0px !important" : undefined,
            },
            "& .ReactVirtualized__Table__rowColumn": {
              height: "inherit",
            },
            "& .ReactVirtualized__Table__row:hover": {
              background: theme.palette.background.paper,
            },
          }}
          // className={classes.table}
          rowClassName={getRowClassName}
          gridStyle={{
            direction: "inherit",
          }}
          {...tableProps}
        >
          <Column
            cellDataGetter={({ rowData }) => rowData.character}
            headerRenderer={(headerProps) => (
              <HeaderRenderer {...headerProps} />
            )}
            cellRenderer={(cellProps) => <CharRenderer {...cellProps} />}
            width={headerHeight}
          />
          <Column
            dataKey="Statistics"
            flexGrow={1}
            cellDataGetter={({
              rowData: { index, character, time, ...graphData },
              isScrolling,
            }) => ({
              ...graphData,
              size: {
                width: 250, // TODO: 250 is hardcoded, make this variable
                height: rowHeight,
              },
              isScrolling,
            })}
            headerRenderer={(headerProps) => (
              <HeaderRenderer {...headerProps} />
            )}
            cellRenderer={(cellProps) => <GraphRenderer {...cellProps} />}
            width={250}
          />
          <Column
            dataKey="Time"
            cellDataGetter={({ rowData }) => rowData.time}
            headerRenderer={(headerProps) => (
              <HeaderRenderer {...headerProps} />
            )}
            cellRenderer={(cellProps) => <TimeRenderer {...cellProps} />}
            width={100}
          />
        </Table>
      )}
    </AutoSizer>
  );
};

export default memo(VirtualTable);
