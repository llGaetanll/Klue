import { useSelector } from "react-redux";
import _ from "lodash";

import Chip from "@mui/material/Chip";
import MuiTooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import { cardTagsSelector, _colorSelector } from "../../../src/cards/cards";

const Tooltip = styled(({ className, ...props }) => (
  <MuiTooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const Tag = ({ ...props }) => {
  const tag = props.label;

  // get a list of cards matching the current tag
  const filteredCards = useSelector(cardTagsSelector([tag]));

  // from the filtered cards, compute the mean weight
  const weight = _.mean(filteredCards.map((card) => card.weight));

  // compute a color from that weight, relative to the entire deck
  const color = useSelector(_colorSelector(weight));

  const outlined = props.variant === "outlined";

  return (
    <Tooltip
      title={
        <>
          <b>Mean tag weight</b> {_.round(weight, 3)}
        </>
      }
    >
      <Chip
        color="secondary"
        css={[
          { userSelect: "none" },
          outlined
            ? {
                color,
                borderColor: color,
              }
            : {
                backgroundColor: color,

                "&:hover": {
                  backgroundColor: color,
                },
              },
        ]}
        {...props}
      />
    </Tooltip>
  );
};

export default Tag;
