import {
  Box,
  Typography,
} from "@material-ui/core";

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  headerStat: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',

    margin: theme.spacing(2)
  },
  title: {
    fontSize: '1em',
    fontWeight: 500,
    userSelect: 'none'
  },
  number: ({ color }) => ({
    fontSize: '3em',
    fontWeight: 300,
    display: 'flex',
    flexDirection: 'row',

    fontFamily: 'monospace',
    lineHeight: 1.2,
    color: color(theme)
  })
}))

const HeaderStat = ({ title, color = () => {}, children, ...props }) => {
  const classes = useStyles({ color });

  return (
    <Box className={classes.headerStat} {...props}>
      <Typography component="h2" className={classes.title}>{title}</Typography>
      {children(classes.number)}
    </Box>
  )
}

export default HeaderStat;
