import { Box, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  submit: {
    marginTop: theme.spacing(2)
  }
}));

const Login = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} display="flex" flexDirection="column">
      <Typography variant="h5" className={classes.title}>
        Login
      </Typography>
    </Box>
  );
};

export default Login;
