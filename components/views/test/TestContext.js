import { createContext, useState } from "react";
import { useSelector } from "react-redux";
import { useImmer } from "use-immer";

import { cardSelected } from "../../../src/cards/cards";

export const TestContext = createContext();

// custom hook to compute test state given parameters
const useTestState = (params) => {
  // test parameters
  const { type, size, time } = params;

  // get all cards and selectedTags from redux state
  const cards = useSelector((state) => state.cards.data);
  const selectedTags = useSelector((state) => state.cards.selectedTags);

  // piles are fetched from the global state
  const pileWeights = useSelector((state) => state.cards.pileWeights);

  // filter all cards to only cards matching selected tags
  const selectedCards =
    selectedTags.length === 0
      ? cards
      : cards.filter((card) => cardSelected(selectedTags, card));

  // compute deck from selected cards in order of importance
  const deck = selectedCards
    .map((card, i) => ({ weight: card.weight, i }))
    .sort((a, b) => b.weight - a.weight)
    .map(({ i }) => selectedCards[i])
    .slice(0, type === "Sized" ? size : selectedCards.length);

  const piles = {};
  for (const pileName of Object.keys(pileWeights)) piles[pileName] = [];

  // useImmer is an immer wrapper for useState
  const [state, setState] = useImmer({
    deck,
    shown: null,
    piles,
  });

  return [state, setState];
};

export const TestProvider = ({ children, params }) => {
  const [state, setState] = useTestState(params);

  // sort the current card into the given deck and draw the next card
  const next = (deck) =>
    setState((draft) => {
      if (!(deck in draft.piles)) return;

      if (!draft.shown) return;

      // push the currently shown card into the deck
      const card = draft.shown;
      draft.piles[deck].push(card);

      // replace the currently shown card with the card at the top of the main deck
      const newCard = draft.deck.pop();
      draft.shown = newCard;
    });

  // intial draw on first render
  const draw = () =>
    setState((draft) => {
      const card = draft.deck.pop();
      draft.shown = card;
    });

  return (
    <TestContext.Provider value={{ ...state, draw, next }}>
      {children}
    </TestContext.Provider>
  );
};
