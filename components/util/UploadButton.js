import { useContext } from "react";
import { useDispatch } from "react-redux";

import { FeedbackContext } from "../../util/feedback";
import { setCards } from "../../src/cards/cards";

const UploadButton = ({ children }) => {
  const dispatch = useDispatch();

  const { addAlert } = useContext(FeedbackContext);

  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    // file reading finished successfully
    reader.addEventListener("load", (e) => {
      // contents of file in variable
      var text = e.target.result;

      dispatch(setCards(JSON.parse(text)));
      addAlert("Successfully loaded cards", "success");
    });

    // file reading failed
    reader.addEventListener("error", function () {
      addAlert("Failed to read file", "error");
    });

    // read as text file
    reader.readAsText(file);
  };

  return (
    <div>
      <input
        accept="application/JSON"
        css={{ display: "none" }}
        id="contained-button-file"
        type="file"
        onChange={handleChange}
      />
      <label htmlFor="contained-button-file">{children}</label>
    </div>
  );
};

export default UploadButton;
