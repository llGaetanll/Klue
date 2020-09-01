import {
  createSlice,
  configureStore,
  getDefaultMiddleware,
  createSelector,
  current
} from "@reduxjs/toolkit";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import seedrandom from "seedrandom";

const initialState = {
  data: [],
  range: [],
  history: [], // history of all visited cards since the beginning of the session. null by default to disable history

  stepper: 0, // used to calculate rng card index

  repeat: false,
  test: false, // if the card set is for a test
  reveal: false,
  edit: false
};

const reducers = {
  loadCards: (state, { payload }) => {
    // if the data is rubbish
    if (!(payload instanceof Object)) return;

    let cards = [];
    // support old card sets by checking for array
    if (payload instanceof Array) {
      cards = payload;
    } else {
      cards = payload.cards;
      state.test = payload.test;
    }

    // set cards
    state.data = cards;

    // update range
    state.range = [1, cards.length];
  },
  setRange: (state, { payload }) => {
    state.range = payload;

    // update index to be in the bounds of the new range
    if (payload[0] > state.index) state.index = payload[0];
    if (payload[1] < state.index) state.index = payload[1];
  },
  setReveal: (state, { payload }) => {
    if (!state.edit) state.reveal = payload;
  },
  setEdit: (state, { payload }) => {
    state.edit = payload;
  },
  setRepeat: (state, { payload }) => {
    const repeat = payload;

    state.repeat = repeat;
  },

  setWeight: (state, { payload }) => {
    const { option, cardIndex } = payload;

    // good and bad constants, change these as you will
    const INC = 1.1; // 10% probability increase if user performs poorly
    const DEC = 0.8; // 20% probability decrease if user performs well

    switch (option) {
      case "medium": {
        // calculate the average weight of every card in the set
        const avgWeight =
          state.data.map(cards => cards.weight).reduce((tw, w) => tw + w) /
          state.data.length;

        const currentWeight = state.data[cardIndex].weight;
        state.data[cardIndex].weight =
          Math.abs(currentWeight - avgWeight) +
          Math.min(currentWeight, avgWeight);
      }
      case "easy": {
        state.data[cardIndex].weight *= DEC;
      }
      default: {
        state.data[cardIndex].weight *= INC;
      }
    }

    // increment stepper
    state.stepper = state.stepper + 1;

    // add index to history
    state.history = [cardIndex, ...state.history];
  },

  setIndex: (state, { payload }) => {
    // bound check
    if (payload < 0) payload = 0;
    if (payload > state.data.length - 1) payload = state.data.length - 1;

    state.index = payload;
  },
  forward: (state, _) => {
    // only works in edit mode
    if (!state.edit) return;
    // when editing, stepper is preserved and rngIndex is treated linearly
    state.rngIndex = state.rngIndex + 1;
  },
  backward: (state, _) => {
    if (!state.edit) return;

    state.rngIndex = state.rngIndex - 1;
  },
  clearHistory: (state, _) => {
    state.history = [];
  },

  // called when the data of a card is updated
  // (i.e. when a user writes the def. of a card)
  updCard: (state, { payload }) => {
    const { index, newData } = payload;

    // only modify changing fields
    state.data[index] = { ...state.data[index], ...newData };

    // remove edit mode
    state.edit = false;
  }
};

/**
 * Returns the new RNG calculated value based on the index, and card weights
 * @param {*} index the linear card index to go back and forth in the card history
 * @param {*} cards the loaded cards to get the weights
 */
const getRNG = (index, cards) => {
  // get every weight
  const weights = cards.map(c => c.weight);

  // the rng is defined as a random, seeded number in (0, n)
  // such that n is the sum of all weights
  let rng = seedrandom(index)() * weights.reduce((tw, w) => tw + w);

  let newRNGIndex = 0;
  while (rng > weights[newRNGIndex]) {
    rng -= weights[newRNGIndex];

    newRNGIndex++;
  }

  return newRNGIndex;
};

/* Selectors */

// export const indexSelector = createSelector(
//   state => state.cards.data,
//   state => state.cards.stepper,
//   state => state.cards.range,
//   (cards, index, range) => {
//     // get every weight in the range
//     let weights = [];
//     for (let i = range[0]; i < range[1]; i++) {
//       weights.push(cards[i].weight);
//     }

//     // the rng is defined as a random, seeded number in (0, n)
//     // such that n is the sum of all weights
//     let rng = seedrandom(index)() * weights;

//     let rngIndex = range[0];
//     while (rng > weights[rngIndex]) {
//       rng -= weights[rngIndex];

//       rngIndex++;
//     }

//     // console.log(rngIndex);

//     return rngIndex;
//   }
// );

const indexSelector = createSelector(
  state => state.cards.data,
  state => state.cards.stepper,
  state => state.cards.range,
  state => state.cards.history,
  state => state.cards.repeat,
  (cards, step, range, history, repeat) => {
    // add an index to every card so we can filter by range and history later
    cards = cards.map((c, i) => ({ i, weight: c.weight }));

    // only keep cards in the apropriate range
    cards = cards.slice(range[0] - 1, range[1]);

    // filter out the previous card from the list of possible next cards
    // prevents having the same card twice in a row.
    if (repeat) cards = cards.filter(card => history[0] !== card.i);
    // remove any card in the history
    else {
      cards = cards.filter(card => history.indexOf(card.i) < 0);

      // if we've ran through all the cards in the testing set
      if (cards.length < 1) return -1;
    }

    console.log(cards, history);

    // the rng is defined as a random, seeded number in (0, n)
    // such that n is the sum of all weights we're interested in
    let rng =
      seedrandom(step)() * cards.map(c => c.weight).reduce((tw, w) => tw + w);

    let i = 0;
    while (rng > cards[i].weight) {
      rng -= cards[i].weight;
      i++;
    }

    return cards[i].i;
  }
);

export const cardContent = createSelector(
  indexSelector,
  state => state.cards.data,
  (index, cards) => {
    // if we're done with the testing set
    if (index < 0) return { index };

    const { char: character, meaning, notes, weight } = cards[index];

    return {
      character,
      meaning,
      notes,
      index,
      weight
    };
  }
);

const { reducer, actions } = createSlice({
  name: "cards",
  initialState,
  reducers
});

// persist the cards reducer to save user data
export const cardsReducer = persistReducer(
  {
    key: "cards",
    storage,
    blacklist: ["reveal", "edit", "history"]
  },
  reducer
);

// append exports
module.exports = {
  ...module.exports,
  ...actions
};
