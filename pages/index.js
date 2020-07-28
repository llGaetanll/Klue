import { useSelector, useDispatch } from "react-redux";

import { Box, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import { forward, backward } from "../store";

import Layout from "../src/layout";
import Card from "../components/card";
import TopBar from "../components/bar";

import UploadButton from "../components/uploadButton";

import { randFromInterval } from "../util";

const useStyles = makeStyles(theme => ({
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,

    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    flexGrow: 0
  }
}));

const Index = props => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const kanji = useSelector(state => state.kanji);

  const range = useSelector(state => state.range);
  const edit = useSelector(state => state.card.edit);
  const index = useSelector(state => state.index);

  const hasData = kanji.length > 0;

  const handleDecrement = () => dispatch(backward());

  const handleIncrement = () => dispatch(forward());

  return (
    <Layout>
      {hasData && <TopBar />}
      <Box className={classes.content}>
        {hasData ? (
          <Box display="flex">
            {index > 0 && edit && (
              <IconButton className={classes.icon} onClick={handleDecrement}>
                <ArrowBackIosIcon fontSize="large" />
              </IconButton>
            )}
            <Card />
            {index < kanji.length - 2 && (
              <IconButton className={classes.icon} onClick={handleIncrement}>
                <ArrowForwardIosIcon fontSize="large" />
              </IconButton>
            )}
          </Box>
        ) : (
          <UploadButton />
        )}
      </Box>
    </Layout>
  );
};

export default Index;
