import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { upperFirst } from "lodash";

import { Button, ButtonGroup } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

import { TestProvider } from "../components/views/test/TestContext";
import Card from "../components/card/Card";

import { TestContext } from "../components/views/test/TestContext";

import theme from "../util/theme";

const CARD_WIDTH = 190;
const CARD_HEIGHT = CARD_WIDTH * Math.sqrt(2);

const Deck = ({ cards }) => (
  <div
    css={{
      position: "relative",
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      transformStyle: "preserve-3d",
    }}
  >
    {cards.map((cardProps, i) => (
      <div
        key={`deckcard-${i}`}
        css={{
          top: 0,
          left: 0,
          position: "absolute",
          zIndex: i + 5,
          transform: `translateZ(${1.7 * i}px)`,
        }}
      >
        <Card
          {...cardProps}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          deck
          hideTags
        />
      </div>
    ))}
  </div>
);

// These are the various test interactions like card options (i.e. easy, good,
// hard) and flip button
const TestButtons = ({ flip, toggleFlip, resetFlip, next }) => {
  const pileWeights = useSelector((state) => state.cards.pileWeights);
  const piles = Object.keys(pileWeights);

  return (
    <div
      css={{
        display: "flex",
        gap: theme.spacing(2),
        position: "absolute",
        padding: theme.spacing(2),
        transform: "translateY(-50%)",
      }}
    >
      <Button
        size="small"
        aria-label="flip"
        variant="contained"
        startIcon={<CachedIcon />}
        onClick={toggleFlip}
      >
        Flip
      </Button>

      {flip === null || (
        <ButtonGroup size="small" aria-label="test options" variant="contained">
          {piles.map((pile) => (
            <Button
              key={`pile-${pile}`}
              onClick={() => {
                next(pile);
                resetFlip();
              }}
            >
              {upperFirst(pile)}
            </Button>
          ))}
        </ButtonGroup>
      )}
    </div>
  );
};

const section = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-around",
  height: "100%",
};

const TestContent = () => {
  const { deck, shown, piles, draw, next } = useContext(TestContext);

  const [flip, setFlip] = useState(null);

  const toggleFlip = () => setFlip((f) => !Boolean(f));
  const resetFlip = () => setFlip(null);

  // draw the initial card after a 400ms timeout
  useEffect(() => {
    setTimeout(() => draw(), 400);
  }, []); // empty dep array equivs onMount

  useEffect(() => {
    if (deck.length === 0) console.log("test done");
  }, [deck]);

  return (
    <div
      css={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",

        // transform: "rotateX(10deg) rotateY(0deg) rotateZ(0deg)",
        // transformStyle: "preserve-3d",
      }}
    >
      <div css={[section, { flex: 1 }]}>
        {Object.entries(piles).map(([name, cards]) => (
          <Deck key={`deck-${name}`} cards={cards} />
        ))}
      </div>
      <div
        css={[
          section,
          {
            flex: 2,

            // TODO: figure out how to scale fonts with this. Right now they look blurry
            transform: "scale(1.4) ",
          },
        ]}
        // onClick={handleFlip}
      >
        {shown && (
          <div css={{ position: "absolute" }}>
            <Card
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              hideTags
              flip={flip}
              {...shown}
            />
            <TestButtons
              flip={flip}
              toggleFlip={toggleFlip}
              resetFlip={resetFlip}
              next={next}
            />
          </div>
        )}
      </div>
      <div css={[section, { flex: 1 }]}>
        <Deck cards={deck} />
      </div>
    </div>
  );
};

const Test = ({ testParams }) => (
  <TestProvider params={testParams}>
    <TestContent />
  </TestProvider>
);

// we get the query string serverside so that we can access it from this initial render
export const getServerSideProps = async ({ query }) => ({
  props: {
    testParams: query,
  },
});

export default Test;
