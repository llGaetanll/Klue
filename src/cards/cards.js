import { createSlice, createSelector, current } from "@reduxjs/toolkit";
import { createSelectorCreator, defaultMemoize } from "reselect";
import { useSelector } from "react-redux";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { interpolateLab } from "d3-interpolate";
import { isEqual } from "lodash";
import FileSaver from "file-saver";
import seedrandom from "seedrandom";

import theme from "../../util/theme";
import { formatDate, getDate, quadInterpolation } from "../../util";

const initialState = {
  data: [],
  selectedCards: [],
  selectedTags: [], // this is the list of tags that the used has clicked on. It affects which cards are visible

  // multipliying factors when updating a card weight
  // remember that lower is better
  pileWeights: {
    easy: 0.7,
    good: 0.8,
    hard: 1.3,
  },
};

const reducers = {
  // pertains to card selection in the main card list view
  setSelection: (state, { payload }) => {
    // supportKey is either `shift` or `ctrl/cmd`
    const { cardIndex, supportKey } = payload;

    if (supportKey === "ctrl") {
      if (state.selectedCards.includes(cardIndex))
        state.selectedCards.splice(state.selectedCards.indexOf(cardIndex), 1);
      else state.selectedCards.push(cardIndex);
    }

    if (supportKey === "shift") {
      const last =
        state.selectedCards[Math.max(0, state.selectedCards.length - 1)];

      for (let i = last; i < cardIndex; i++) state.selectedCards.push(i);
    }

    if (!supportKey) state.selectedCards = [cardIndex];
  },

  /* EDIT */
  // called when the data of a card is updated
  // (i.e. when a user writes the def. of a card)
  updCard: (state, action) => {
    const { index, newData } = action.payload;
    // only modify changing fields
    state.data[index] = { ...state.data[index], ...newData };

    if (state.autoAdvance) caseReducers.forward(state, action);
  },

  /* UPLOAD / DOWNLOAD */
  // called when the user loads in a deck of cards
  setCards: (state, { payload }) => {
    // can't set cards during a test
    if (state.mode === "test") return;

    // if the data is rubbish
    if (!(payload instanceof Object)) return;

    // cards is a list of objects
    const cards = payload;

    state.data = cards;
  },
  // allows a user to download a card set
  getCards: (state, _) => {
    const cardsBlob = new Blob([JSON.stringify(state.data)], {
      type: "application/json",
    });

    FileSaver.saveAs(cardsBlob, `cards [${formatDate(getDate())}].json`);
  },

  /* TAGS */
  // add the tag to the list of enabled tags
  addSelectedTag: (state, { payload }) => {
    const tag = payload;

    // if the tag waws already selected, ignore
    if (state.selectedTags.includes(tag)) return;

    state.selectedTags.push(tag);
  },
  // remove the tag from the list of enabled tags
  remSelectedTag: (state, { payload }) => {
    const tag = payload;
    const { selectedTags } = state;

    // if the tag already wasn't selected, ignore
    if (!state.selectedTags.includes(tag)) return;

    state.selectedTags = selectedTags.filter((t) => t !== tag);
  },
  // remove all selected tags
  clrSelectedTag: (state) => {
    state.selectedTags = [];
  },
};

/* Selectors */

// computes and returns the content of the card from the index
export const cardContentSelector = createSelector(
  (state) => state.cards.index,
  (state) => state.cards.data,
  (index, cards) => {
    // if we're done with the testing set
    if (index < 0) return { index };

    const { char: character, meaning, notes, weight } = cards[index];

    return {
      character,
      meaning,
      notes,
      index,
      weight,
    };
  }
);

/* return whether the app in is test mode */
export const testingSelector = createSelector(
  (state) => state.cards.mode,
  (mode) => mode === "test"
);

export const editSelector = createSelector(
  (state) => state.cards.mode,
  (mode) => mode === "edit"
);

export const normalSelector = createSelector(
  (state) => state.cards.mode,
  (mode) => mode === "normal"
);

export const testDoneSelector = createSelector(
  (state) => state.cards.history.length,
  (state) => state.cards.range,
  (histLength, range) => {
    const rangeLength = range[1] - range[0] + 1;

    const testing = useSelector(testingSelector);

    // a test is all done iff we are in test mode AND the
    // length of the history == range length
    return testing && rangeLength === histLength;
  }
);

// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepSelector = createSelectorCreator(defaultMemoize, isEqual);

// returns characters in the range
export const characterSelector = createDeepSelector(
  [
    (state) => state.cards.data.map((card) => card.char),
    (state) => state.cards.range,
  ],
  (characters, range) => characters.slice(range[0], range[1] + 1)
);

// find smallest and largest weights in the card set
export const weightRangeSelector = createDeepSelector(
  (state) => state.cards.data.map((card) => card.weight),
  (weights) => ({
    minWeight: Math.min(...weights),
    maxWeight: Math.max(...weights),
  })
);

// returns mapped data for the cardset visualization in the sidebar
export const colorSelector = (i) =>
  createDeepSelector(
    [
      (state) => state.cards.index,
      // map through cards to prevent unnecessary rerenders on weight changes
      (state) =>
        state.cards.data.map(({ meaning, notes, weight }) => ({
          meaning,
          notes,
          weight,
        }))[i],
      (state) => state.cards.range,
      (state) => state.cards.history,
      (state) => state.cards.mode,
      weightRangeSelector,
    ],
    (index, card, range, history, mode, { minWeight, maxWeight }) => {
      const { meaning, notes, weight } = card;
      let color = theme.palette.grey[800];

      switch (mode) {
        case "edit": {
          if (meaning) color = theme.palette.warning.light;

          if (notes) color = theme.palette.warning.dark;

          break;
        }
        case "test": {
          // if the node is in the range
          if (i >= range[0] && i <= range[1]) color = theme.palette.grey[700];

          if (history.indexOf(i) > -1) color = theme.palette.success.dark;

          // color the current node differently
          if (i === index) color = theme.palette.info.main;

          break;
        }
        default: {
          const quad = quadInterpolation(weight, minWeight, maxWeight);

          if (i >= range[0] && i <= range[1])
            color = interpolateLab(
              theme.palette.weights.best,
              theme.palette.weights.worst
            )(quad);
        }
      }

      return color;
    }
  );

// picks between the two orange colors shown in edit mode
export const editColorSelector = (i) =>
  createDeepSelector(
    [
      // map through cards to prevent unnecessary rerenders on weight changes
      (state) =>
        state.cards.data.map(({ meaning, notes, weight }) => ({
          meaning,
          notes,
          weight,
        }))[i],
    ],
    (card) => {
      const { meaning, notes } = card;
      let color = theme.palette.grey[800];

      if (meaning) color = theme.palette.warning.light;

      if (notes) color = theme.palette.warning.dark;

      return color;
    }
  );

// given a card weight, this computes a new color between two chosen colors
// representing the worst and best cards in the entire deck.
export const _colorSelector = (weight) =>
  createSelector(weightRangeSelector, ({ minWeight, maxWeight }) => {
    const quad = quadInterpolation(weight, minWeight, maxWeight);

    return interpolateLab(
      theme.palette.weights.best,
      theme.palette.weights.worst
    )(quad);
  });

// returns whether or not the given card contains a tag in the list of provided tags
export const cardSelected = (tags, card) => {
  for (const tag of tags) if (card.tags && card.tags.includes(tag)) return true;

  return false;
};

// return a list of cards based on the selected tags.
// Note that if no tags are selected, all cards get returned
export const filterCards = createSelector(
  [(state) => state.cards.data, (state) => state.cards.selectedTags],
  (cards, tags) => {
    if (tags.length === 0) return cards;

    return cards.filter((card) => cardSelected(tags, card));
  }
);

export const dotColorsSelector = createDeepSelector(
  [
    (state) => state.cards.selectedTags,
    (state) => state.cards.data,
    weightRangeSelector,
  ],
  (tags, weights, { minWeight, maxWeight }) => {
    return weights.map((card) => {
      // if the card is not in the list of tags
      const selected = tags.length === 0 || cardSelected(tags, card);

      const quad = quadInterpolation(card.weight, minWeight, maxWeight);

      const color = interpolateLab(
        theme.palette.weights.best,
        theme.palette.weights.worst
      )(quad);

      return { color, selected };
    });
  }
);

// returns statistics about the test that just concluded
// TODO: since this is used at a particular time in the lifecylcle of the app, maybe a selector is not the best way to do it
export const statSelector = createSelector(
  [
    (state) =>
      state.cards.data
        .slice(state.cards.range[0], state.cards.range[1] + 1)
        .map((cards) => cards.weight),
    (state) => state.cards.testData.weightsPreTest,
    (state) => state.cards.testData.cardTimes,
    (state) => state.cards.range[0],
  ],
  (newCardWeights, oldCardWeights, cardTimeStamps, startRange) => {
    const weightDeltas = newCardWeights.map(
      (weight, i) => weight - oldCardWeights[i]
    ); // calculate card improvement for each card
    const avgWeightDelta =
      weightDeltas.reduce((twd, wd) => twd + wd) / weightDeltas.length; // calculate average card improvement

    const [_, ...cardTimes] = cardTimeStamps.map(
      (ts, i) => ts - cardTimeStamps[Math.max(0, i - 1)]
    ); // calculate array of deltas, the first value being 0 is ignored
    const totalTime =
      cardTimeStamps[cardTimeStamps.length - 1] - cardTimeStamps[0]; // last time - first time to get total time spent on test
    const avgTime = cardTimes.reduce((tt, ct) => tt + ct) / cardTimes.length; // get average time spent on card

    return {
      cardStats: weightDeltas.map((wd, i) => ({
        index: startRange + i,
        weightDelta: wd,
        prevWeight: oldCardWeights[i],
        time: cardTimes[i],
      })),
      avgWeightDelta,
      totalTime,
      avgTime,
    };
  }
);

// filter card list by a list of tags. Note that this is an OR operation,
// meaning a card will match the filter as long as it has *one* of the tags in
// the search list.
export const cardTagsSelector = (tags) =>
  createSelector(
    (state) => state.cards.data,
    (cards) => cards.filter((card) => cardSelected(tags, card))
  );

// get a list of all unique tags of every card. This list is NOT sorted alphabetically
export const tagListSelector = createSelector(
  (state) => state.cards.data,
  (cards) =>
    cards.reduce((tags, card) => {
      // get the list of tags of the current card
      const cardTags = card.tags || [];

      // for each tag in the current card,
      // add to the list iff it's not already in it
      for (const cardTag of cardTags)
        tags.includes(cardTag) || tags.push(cardTag);

      return tags;
    }, [])
  // .sort()
);

const { reducer, caseReducers, actions } = createSlice({
  name: "cards",
  // initialState: test1,
  initialState,
  reducers,
});

// persist the cards reducer to save user data
export const cardsReducer = persistReducer(
  {
    key: "cards",
    storage,
    whitelist: ["data", "selectedTags"],
  },
  reducer
);

// append exports
module.exports = {
  ...module.exports,
  ...actions,
};
