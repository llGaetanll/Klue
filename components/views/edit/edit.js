import { Box } from "@mui/material";

import Table from "./CardTable/Table";
// import Card from "../card/Card";

// what the page looks like in edit mode
// this should be a spreadsheet essentially
const Edit = () => (
  <>
    <div
      css={{
        display: "flex",
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Table />
    </div>
  </>
);

export default Edit;
