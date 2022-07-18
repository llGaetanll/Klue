import { useSelector, useDispatch } from "react-redux";

import { Box } from "@mui/material";

import Sidebar from "../sidebar/index";
import { HorizontalBar } from "../horizontalbar";

import FixedSizeList from "../util/list/fixedSizeList";
import Card from "../card/Card";
import Tags from "../util/Tags/Tags";

import { setSelection } from "../../src/cards/cards";

import theme from "../../util/theme";

const MAX_CARDS_PER_ROW = 5;

const CARD_WIDTH = 190;
const CARD_HEIGHT = CARD_WIDTH * Math.sqrt(2);

const CARD_GAP = theme.gap(2);
const CARD_HIGHLIGHT_PADDING = theme.gap(2);

// simple wrapper for getting cards per row
const getCardsPerRow = (width) =>
  Math.min(MAX_CARDS_PER_ROW, Math.floor(width / (CARD_WIDTH + theme.gap(3))));

const Row = ({ style, rowIndex, cards }) => {
  const dispatch = useDispatch();

  const handleSelect = (id, supportKey) => {
    dispatch(setSelection({ cardIndex: id, supportKey }));
  };

  return (
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
          gap: CARD_GAP,
          marginTop: CARD_GAP,
          marginRight: CARD_GAP,
        }}
      >
        {cards.map((cardProps, colIndex) => (
          <div
            key={`card-${rowIndex}-${colIndex}`}
            css={{ position: "relative" }}
            onClick={(e) => {
              const ctrl = navigator.userAgent.includes("Mac")
                ? e.metaKey
                : e.ctrlKey;
              const shift = e.shiftKey;

              // note that shift takes precendence over ctrl
              handleSelect(cardProps.id, ctrl && (shift ? "shift" : "ctrl"));
            }}
          >
            <Card
              {...cardProps}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              css={{ zIndex: 2 }}
              // flip
            />

            {cardProps.selected && (
              <span
                css={[
                  {
                    position: "absolute",
                    boxSizing: "content-box",

                    top: -CARD_HIGHLIGHT_PADDING / 2,
                    left: -CARD_HIGHLIGHT_PADDING / 2,
                    width: CARD_WIDTH + CARD_HIGHLIGHT_PADDING,
                    height: CARD_HEIGHT + CARD_HIGHLIGHT_PADDING,

                    background: theme.palette.primary.main,
                    borderRadius: theme.shape.borderRadius,

                    zIndex: -1,
                  },
                  // if the previous card is selected, dont round corners
                  cardProps.prevSelected && {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                  // if the next card is selected, dont round corners
                  cardProps.nextSelected && {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                  // connects selected cards together
                  cardProps.prevSelected &&
                    colIndex > 0 && {
                      "&:before": {
                        content: "''",
                        display: "block",
                        height: "100%",
                        top: 0,
                        left: -CARD_HIGHLIGHT_PADDING,
                        position: "absolute",
                        width: CARD_HIGHLIGHT_PADDING,

                        background: "inherit",
                      },
                    },
                ]}
              />
            )}
          </div>
        ))}
      </div>
    </Box>
  );
};

// virtualized card list component
const CardList = () => {
  const cards = useSelector((state) => state.cards.data);

  const selections = useSelector((state) => state.cards.selectedCards);

  const cardsData = cards.map((card, i) => {
    if (selections.includes(i))
      return {
        ...card,
        id: i,
        selected: true,
        prevSelected: selections.includes(i - 1),
        nextSelected: selections.includes(i + 1),
      };

    return { ...card, id: i };
  });

  return (
    <FixedSizeList
      itemCount={({ width }) => {
        const cardsPerRow = getCardsPerRow(width);

        return Math.ceil(cards.length / cardsPerRow);
      }}
      itemSize={CARD_HEIGHT + theme.gap(3)}
      row={({ index, style, width }) => {
        const cardsPerRow = getCardsPerRow(width);

        return (
          <Row
            style={style}
            cards={cardsData.slice(
              cardsPerRow * index,
              (index + 1) * cardsPerRow
            )}
            key={`row-${index}`}
          />
        );
      }}
    />
  );
};

// what the page looks like in normal mode
const Normal = () => {
  return (
    <div css={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div
        css={{
          display: "flex",
          flex: 1,
        }}
      >
        <Sidebar />
        <div
          css={{
            display: "flex",
            flex: 2,
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <CardList />
        </div>
      </div>
      <HorizontalBar />
    </div>
  );
};

export default Normal;
