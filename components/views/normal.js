import { useSelector } from "react-redux";

import { Box } from "@mui/material";

import FixedSizeList from "../util/list/fixedSizeList";
import Card from "../card/Card";
import Tags from "../util/Tags/Tags";

import theme from "../../util/theme";

const MAX_CARDS_PER_ROW = 5;

const CARD_HEIGHT = 300;
const CARD_WIDTH = 200;

// theme.spacing(3)
const SPACING = 16;

// simple wrapper for getting cards per row
const getCardsPerRow = (width) =>
  Math.min(MAX_CARDS_PER_ROW, Math.floor(width / (CARD_WIDTH + SPACING)));

const Row = ({ style, rowIndex, cards }) => (
  <Box
    style={style}
    css={{
      display: "flex",
      justifyContent: "flex-end",
    }}
  >
    <div
      css={{
        display: "flex",
        gap: SPACING,
        marginTop: SPACING,
        marginRight: SPACING,
      }}
    >
      {cards.map((cardProps, colIndex) => (
        <Card
          {...cardProps}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          key={`card-${rowIndex}-${colIndex}`}
          // flip
        />
      ))}
    </div>
  </Box>
);

// what the page looks like in normal mode
const Normal = () => {
  const cards = useSelector((state) => state.cards.data);

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        flex: 2,
        // marginRight: theme.spacing(2),

        overflow: "auto",
      }}
    >
      <Tags />
      <FixedSizeList
        itemCount={({ width }) => {
          const cardsPerRow = getCardsPerRow(width);

          return Math.ceil(cards.length / cardsPerRow);
        }}
        itemSize={CARD_HEIGHT + SPACING}
        row={({ index, style, width }) => {
          const cardsPerRow = getCardsPerRow(width);

          return (
            <Row
              style={style}
              cards={cards.slice(
                cardsPerRow * index,
                (index + 1) * cardsPerRow
              )}
              key={`row-${index}`}
            />
          );
        }}
      />
    </Box>
  );
};

export default Normal;
