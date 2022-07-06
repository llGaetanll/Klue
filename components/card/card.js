import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  Typography,
  Box,
  Card as MuiCard,
  CardContent,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import TextField from "./TextField";
import Tag from "../util/Tags/Tag";

import { cardContentSelector, editSelector } from "../../src/cards/cards";

import theme from "../../util/theme";

// actual card component
const Card = ({ character, meaning, notes, ...props }) => {
  const { width, height } = props;
  const [cardState, setCardState] = useState({ character, meaning, notes });

  // const cards = useSelector((state) => state.cards.data);
  // const { char: character, meaning, notes } = cards[index];

  // const { character, meaning, notes, index } = useSelector(cardContentSelector);

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
        width,
        height,

        // width,
        // height,

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

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const CardTags = ({ tags }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",

        position: "absolute",
        bottom: 0,
        left: 0,

        listStyle: "none",
        p: 1,
        m: 0,
      }}
      component="ul"
    >
      {tags.map((tag, i) => (
        <ListItem key={`card-tag-${i}`}>
          <Tag variant="outlined" label={tag} />
        </ListItem>
      ))}
    </Box>
  );
};

const card = {
  display: "flex",
  flexDirection: "column",

  position: "absolute",
  width: "100%",
  height: "100%",
  padding: theme.spacing(2),

  overflowY: "auto",
};

// front side of the card
const CardRecto = ({ character }) => {
  return (
    <>
      <Typography
        css={{
          position: "relative",
          fontSize: 120,

          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",

          backfaceVisibility: "hidden",
        }}
        variant="h1"
      >
        {character}
      </Typography>
    </>
  );
};

// back side of the card
const CardVerso = ({ meaning, notes }) => {
  return (
    <>
      <TextField
        display={meaning}
        // edit={edit}
        value={meaning}
        // setValue={setMeaning}
        textFieldProps={{
          variant: "h5",
          component: "h1",
        }}
        inputProps={{
          label: "Meaning",
          variant: "outlined",
          focus: true,
        }}
      />
      <TextField
        display={notes}
        // edit={edit}
        value={notes}
        // setValue={setNotes}
        inputProps={{
          variant: "outlined",
          label: "Notes",
          rows: 4,
          multiline: true,
        }}
      />
    </>
  );
};

const NewCard = ({ char: character, meaning, notes, tags = [], ...props }) => {
  const { flip, width, height } = props;

  return (
    <div
      css={{
        width,
        height,

        // "&:hover > div": {
        //   transform: "rotateY(180deg)",
        // },

        perspective: 1000,
      }}
    >
      <div
        css={[
          {
            position: "relative",

            display: "flex",
            width: "100%",
            height: "100%",

            backfaceVisibility: "hidden",

            transition: "transform 0.8s",
            transformStyle: "preserve-3d",
          },
          flip && { transform: "rotateY(180deg)" },
        ]}
      >
        <MuiCard css={card}>
          <CardRecto character={character} />
          <CardTags tags={tags} />
        </MuiCard>
        <MuiCard
          css={[
            card,
            { transform: "rotateY(180deg)", backfaceVisibility: "hidden" },
          ]}
        >
          <CardVerso meaning={meaning} notes={notes} />
        </MuiCard>
      </div>
    </div>
  );
};

export const EditCard = ({
  char: character,
  meaning,
  notes,
  tags = [],
  ...props
}) => {
  const { width, height } = props;

  return (
    <MuiCard
      css={{
        display: "flex",

        width: 2 * width,
        height,
      }}
    >
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          flex: 1,

          position: "relative",

          padding: theme.spacing(2),
        }}
      >
        <CardRecto character={character} />
        <CardTags tags={tags} />
      </div>
      <Divider orientation="vertical" />
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: theme.spacing(2),
        }}
      >
        <CardVerso meaning={meaning} notes={notes} />
      </div>
    </MuiCard>
  );
};

export default NewCard;
