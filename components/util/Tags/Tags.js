import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

import Tag from "./Tag";

import theme from "../../../util/theme";

import {
  tagListSelector,
  addSelectedTag,
  remSelectedTag,
  clrSelecteddTag,
} from "../../../src/cards/cards";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Tags = () => {
  const dispatch = useDispatch();

  const selectedTags = useSelector((state) => state.cards.selectedTags);
  const tags = useSelector(tagListSelector);

  const handleClear = () => {
    dispatch(clrSelecteddTag());
  };

  return (
    <div css={{ display: "flex", alignItems: "center" }}>
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            // css={{ display: "flex" }}
            // css={{ overflow: "hidden" }}
            initial={{
              opacity: 0,
              width: 0,
            }}
            animate={{
              opacity: 1,
              width: "auto",
            }}
            exit={{
              opacity: 0,
              width: 0,
            }}
          >
            <Button
              css={{
                textTransform: "none",
                whiteSpace: "nowrap",
              }}
              size="small"
              startIcon={<CloseIcon />}
              onClick={handleClear}
            >
              Clear Filter
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        css={{
          position: "relative",
          overflow: "hidden",

          // make the list fade in and out at the edges
          "&:before": {
            content: "''",
            display: "block",
            position: "absolute",
            height: "100%",
            width: theme.spacing(2),
            background: `linear-gradient(to left, rgba(255,255,255,0), ${theme.palette.background.default})`,
            top: 0,
            left: 0,
            zIndex: 1,
          },

          "&:after": {
            content: "''",
            display: "block",
            position: "absolute",
            height: "100%",
            width: theme.spacing(2),
            background: `linear-gradient(to right, rgba(255,255,255,0), ${theme.palette.background.default})`,
            top: 0,
            right: 0,
            zIndex: 1,
          },
        }}
      >
        <ul
          css={{
            display: "flex",
            overflow: "auto",
            padding: 0,
            margin: 0,

            listStyle: "none", // remove the markers
          }}
        >
          {tags.map((tag, i) => {
            const selected = selectedTags.includes(tag);

            // to add a tag to selected tags
            const handleAdd = () => dispatch(addSelectedTag(tag));

            // to remove a tag from selected tags
            const handleRem = () => dispatch(remSelectedTag(tag));

            return (
              <ListItem key={`tag-${i}`}>
                <Tag
                  icon={selected ? <CheckCircleIcon /> : undefined}
                  onClick={selected ? handleRem : handleAdd}
                  label={tag}
                />
              </ListItem>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Tags;
