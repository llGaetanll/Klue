import clsx from "clsx";

import { TableCell } from "@mui/material";

import { useTableStyles } from "./index";

// render the header of each colum (single, ao5, ao12)
const HeaderRenderer = ({ dataKey }) => {
  const tableClasses = useTableStyles();

  return (
    <TableCell
      component="div"
      className={clsx(
        tableClasses.tableCell,
        tableClasses.flexContainer,
        tableClasses.noClick
      )}
      variant="head"
      style={{ height: 48 }}
    >
      <span>{dataKey}</span>
    </TableCell>
  );
};

export default HeaderRenderer;
