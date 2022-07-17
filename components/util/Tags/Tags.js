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
    <div css={{ display: "flex" }}>
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            css={{ display: "flex" }}
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

                margin: theme.spacing(0.5),
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
      <Box
        sx={{
          display: "flex",
          overflow: "auto",

          listStyle: "none", // remove the markers
          p: 1,
          m: 0,
        }}
        component="ul"
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
      </Box>
    </div>
  );
};

export default Tags;
