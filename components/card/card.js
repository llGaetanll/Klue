import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";

import { Typography, Box, Card as MuiCard, CardContent } from "@mui/material";

import TextField from "./TextField";
import { cardContent, editSelector } from "../../src/cards";

// actual card component
const Card = ({ character, meaning, notes, ...props }) => {
  const { width, height } = props;
  const [cardState, setCardState] = useState({ character, meaning, notes });

  // const cards = useSelector((state) => state.cards.data);
  // const { char: character, meaning, notes } = cards[index];

  // const { character, meaning, notes, index } = useSelector(cardContent);

  // update fields when index or field changes
  // useEffect(() => setMeaning(meaning), [meaning, index]);
  // useEffect(() => setNotes(notes), [notes, index]);

  const setMeaning = (m) => setCardState((s) => ({ ...s, meaning: m }));
  const setNotes = (n) => setCardState((s) => ({ ...s, notes: n }));

  const reveal = useSelector((state) => state.cards.reveal);
  const edit = useSelector(editSelector);

  return (
    <MuiCard
      css={{
        // width: 300,
        // minHeight: 400,

        width,
        height,

        display: "flex",
        userSelect: "none",
      }}
    >
      <CardContent css={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Box
          flex={1}
          css={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          <Typography
            css={{
              position: "relative",
              fontSize: 120,

              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            variant="h1"
          >
            {character}
          </Typography>
        </Box>
        <Box
          flex={2}
          css={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          <TextField
            display={meaning && reveal}
            edit={edit}
            value={cardState.meaning}
            setValue={setMeaning}
            textFieldProps={{
              variant: "h4",
              component: "h1",
            }}
            inputProps={{
              label: "Meaning",
              variant: "outlined",
              focus: true,
            }}
          />
          <TextField
            display={notes && reveal}
            edit={edit}
            value={cardState.notes}
            setValue={setNotes}
            inputProps={{
              variant: "outlined",
              label: "Notes",
              rows: 4,
              multiline: true,
            }}
          />
        </Box>
      </CardContent>
    </MuiCard>
  );
};

export default Card;
