import { useSelector } from "react-redux";

import { Box } from "@mui/material";

import FixedSizeList from "../util/list/fixedSizeList";
import Card from "../card/Card";

const MAX_CARDS_PER_ROW = 5;

const CARD_HEIGHT = 200;
const CARD_WIDTH = 150;

// theme.spacing(2)
const SPACING = 16;

// simple wrapper for getting cards per row
const getCardsPerRow = (width) =>
  Math.min(MAX_CARDS_PER_ROW, Math.floor(width / (CARD_WIDTH + SPACING)));

const Row = ({ style, rowIndex, cards }) => (
  <Box style={style} css={{ display: "flex", justifyContent: "center" }}>
    <div
      css={{
        display: "flex",
        gap: SPACING,
        marginTop: SPACING,
      }}
    >
      {cards.map((card, colIndex) => (
        <Card
          character={card.char}
          meaning={card.meaning}
          notes={card.notes}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          key={`card-${rowIndex}-${colIndex}`}
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
        flex: 2,

        overflow: "auto",
      }}
    >
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
