import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import { Box, Button, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

import {
  tagSelector,
  addSelectedTag,
  remSelectedTag,
  clrSelecteddTag,
} from "../../src/cards";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Tags = () => {
  const dispatch = useDispatch();

  const selectedTags = useSelector((state) => state.cards.selectedTags);
  const tags = useSelector(tagSelector);

  const handleClear = () => {
    dispatch(clrSelecteddTag());
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        listStyle: "none",
        p: 1,
        m: 0,
      }}
      component="ul"
    >
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            css={{ overflow: "hidden" }}
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
            <ListItem>
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
            </ListItem>
          </motion.div>
        )}
      </AnimatePresence>
      {tags.map((tag, i) => {
        const selected = selectedTags.includes(tag);

        // to add a tag to selected tags
        const handleAdd = () => dispatch(addSelectedTag(tag));

        // to remove a tag from selected tags
        const handleRem = () => dispatch(remSelectedTag(tag));

        return (
          <ListItem key={`tag-${i}`}>
            <Chip
              icon={selected ? <CheckCircleIcon /> : undefined}
              onClick={selected ? handleRem : handleAdd}
              label={tag}
            />
          </ListItem>
        );
      })}
    </Box>
  );
};

export default Tags;
