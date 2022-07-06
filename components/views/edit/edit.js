import { Box } from "@mui/material";

import Table from "./CardTable/Table";
import { EditCard } from "../../card/Card";

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
      <EditCard
        char={"切"}
        meaning={"Cut"}
        notes={
          "Think of a Japanese chef cutting up some fish with a *dagger*, and *dicing* (Seven as a primitive) it. "
        }
        tags={["Lesson 5"]}
        width={200}
        height={300}
      />
      {/* <Table /> */}
    </div>
  </>
);

export default Edit;
