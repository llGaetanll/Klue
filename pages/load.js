import { Box } from "@material-ui/core";

import UploadButton from "../components/uploadButton";

const Load = () => {
  return (
    <Box display="flex" flex={1} alignItems="center" justifyContent="center">
      <UploadButton />
    </Box>
  );
};

export default Load;
