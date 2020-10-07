import {
  createSlice,
  createSelector,
  current
} from "@reduxjs/toolkit";
import { createSelectorCreator, defaultMemoize } from 'reselect';

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { interpolateLab } from 'd3-interpolate'
import { isEqual } from 'lodash'
import FileSaver from "file-saver";
import seedrandom from "seedrandom";

import theme from '../util/theme'
import { formatDate, getDate, quadInterpolation } from "../util";

import { test1 } from './test'; // test state to debug statistics

const initialState = {
  data: [],
  range: [0, 1], // default range
  history: [], // history of all visited cards since the beginning of the test. null by default to disable history

  stepper: 0, // used to calculate rng card index
  index: 0, // randomized by the stepper in testing mode, or incremented otherwise

  repeat: false,
  reveal: false,
  autoAdvance: false, // controls whether to auto advance when editing cards

  mode: 'normal',
  prevMode: null,

  testData: {
    cardTimes: [], // timestamp of when one of the three card options has been clicked. the first timestamp is the start of the test, the last is the end.
    weightsPreTest: [] // so we can compare improvements after the end of the test
  }
};

const reducers = {
  setMode: (state, { payload }) => {
    state.prevMode = state.mode;
    state.mode = payload;

    switch (payload) {
      // testing mode
      case "test": {
        // record pre-weights
        const cards = state.data.slice(state.range[0], state.range[1] + 1);
        state.testData.weightsPreTest = cards.map(card => card.weight); // keep only the weights
        
        // clear cardTimes and record initial time
        state.testData.cardTimes = [ Date.now() ];

        // clear history
        state.history = [];

        // increase stepper and increment rng index
        state.stepper = state.stepper + 1;
        caseReducers.setIndex(state, {});

        break;
      }
      // edit mode
      case "edit": {
        
        break;
      }
      // normal mode
      default: {
        state.index = 0; // reset index on normal mode

        break;
      }
    }
  },
  // brings you back to the previous mode that you were in
  revertMode: (state, _) => {
    state.mode = state.prevMode;
    state.prevMode = null;

    // increase stepper and increment rng index
    state.stepper = state.stepper + 1;
    caseReducers.setIndex(state, {});
  },

  /* NORMAL */

  /* TESTING */
  next: (state, { payload }) => {
    if (state.mode !== 'test') return;

    caseReducers.setWeight(state, { payload });

    // reset reveal
    state.reveal = false;

    // add current card to the history
    state.history = [ ...state.history, state.index ]
    state.testData.cardTimes = [...state.testData.cardTimes, Date.now()]

    // increase stepper and increment rng index
    state.stepper = state.stepper + 1;
    caseReducers.setIndex(state, {});
  },
  prev: (state, _) => {
    if (state.mode !== 'test') return;

    if (state.history.length < 1) return;

    // pop first value of history and make it the index
    const [index, ...history] = state.history;
    caseReducers.setIndex(state, { payload: index })

    state.history = history;

    // caseReducers.popCardTime(state, {}); // remove the last cardTimestamp. TODO: handle card times better when going back in the history
  },
  // computes and set rng index
  setIndex: (state, { payload }) => {
    const index = payload;

    // if the index IS defined (optional)
    if (typeof index === "number") {
      // if it is outside the range of possible cards, ignore
      if (index < 0 || index >= state.data.length) return;

      state.index = index;
      return;
    }

    // since we modify cards, we assign it a variable so immer doesn't go crazy
    let cards = state.data;
    // add an index to every card so we can filter by range and history later
    cards = cards.map((c, i) => ({ i, weight: c.weight }));

    // only keep cards in the apropriate range
    // cards = cards.slice(state.range[0] - 1, state.range[1]);
    cards = cards.slice(state.range[0], state.range[1] + 1);

    // filter out the previous card from the list of possible next cards
    // prevents having the same card twice in a row.
    if (state.repeat) cards = cards.filter(card => state.history[0] !== card.i);
    // remove any card in the history
    else {
      cards = cards.filter(card => state.history.indexOf(card.i) < 0);

      // if we've ran through all the cards in the testing set
      if (cards.length < 1) {
        state.index = -1;
        return;
      }
    }

    // the rng is defined as a random, seeded number in (0, n)
    // such that n is the sum of all weights we're interested in
    let rng =
      seedrandom(state.stepper)() *
      cards.map(c => c.weight).reduce((tw, w) => tw + w);

    let i = 0;
    while (rng > cards[i].weight) {
      rng -= cards[i].weight;
      i++;
    }

    state.index = cards[i].i;
  },
  setWeight: (state, { payload }) => {
    const option = payload;

    const cardIndex = state.index;

    // if cardIndex is outside range, ignore
    if (cardIndex < state.range[0] || cardIndex > state.range[1]) return;

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
  },

  /* EDIT */ 
  // called when the data of a card is updated
  // (i.e. when a user writes the def. of a card)
  updCard: (state, action) => {
    const { index, newData } = action.payload; 
    // only modify changing fields
    state.data[index] = { ...state.data[index], ...newData };

    if (state.autoAdvance)
      caseReducers.forward(state, action);
  },

  /* UTIL - functions called in more than one mode */
  // called when the user loads in a deck of cards
  setCards: (state, { payload }) => {
    // can't set cards during a test
    if (state.mode === 'test') return;

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
    caseReducers.setRange(state, { payload: [0, cards.length - 1] });
  },
  // used to download a card set
  getCards: (state, _) => {
    const cardsBlob = new Blob([JSON.stringify(state.data)], {
      type: "application/json"
    });

    FileSaver.saveAs(cardsBlob, `cards [${formatDate(getDate())}].json`);
  },
  setRange: (state, { payload }) => {
    // don't let the user change the range during a test
    if (state.mode === 'test') return;

    state.range = payload;

    caseReducers.setIndex(state, {});
  },
  // called in normal mode and edit mode
  forward: (state, _) => {
    caseReducers.setIndex(state, { payload: state.index + 1 });
  },
  // called in normal mode and edit mode
  backward: (state, _) => {
    caseReducers.setIndex(state, { payload: state.index - 1 });
  },
  setReveal: (state, { payload }) => {
    // can't reveal the card def in edit mode since we're editing it
    if (state.mode !== 'edit')
      state.reveal = payload;
  },
  setRepeat: (state, { payload }) => {
    // can't change repeat settings during a test
    if (state.mode !== 'test') 
      state.repeat = payload;
  },
  setAutoAdvance: (state, { payload }) => {
    // can't change this during a test
    if (state.mode !== 'test') 
      state.autoAdvance = payload;
  }
};

/* Selectors */

// computes and returns the content of the card from the index
export const cardContent = createSelector(
  state => state.cards.index,
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

export const testingSelector = createSelector(state => state.cards.mode, mode => mode === 'test');
export const editSelector = createSelector(state => state.cards.mode, mode => mode === 'edit');
export const normalSelector = createSelector(state => state.cards.mode, mode => mode === 'normal');

// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

// returns characters in the range
export const characterSelector = createDeepSelector(
  [
    state => state.cards.data.map(card => card.char),
    state => state.cards.range
  ], 
  (characters, range) => characters.slice(range[0], range[1] + 1)
);

// find smallest and largest weight
export const weightSelector = createDeepSelector(
  state => state.cards.data.map(card => card.weight),
  (weights) => {
    let maxWeight = 0;
    let minWeight = 1000;

    for (let weight of weights) {
      if (weight > maxWeight)
        maxWeight = weight;

      if (weight < minWeight)
        minWeight = weight;
    }

    return { minWeight, maxWeight };
  }
)

// returns mapped data for the cardset visualization in the sidebar
export const itemSelector = i => createDeepSelector(
  [
    state => state.cards.index,
    // map through cards to prevent unnecessary rerenders on weight changes
    state => state.cards.data.map(({ meaning, notes, weight }) => ({ meaning, notes, weight }))[i], 
    state => state.cards.range,
    state => state.cards.history,
    state => state.cards.mode,
    weightSelector
  ],
  (index, card, range, history, mode, { minWeight, maxWeight }) => {
    const { meaning, notes, weight } = card;
    let color = theme.palette.grey[800];
    
    switch (mode) {
      case "edit": {
        if (meaning)
          color = theme.palette.warning.light;
        
        if (notes)
          color = theme.palette.warning.dark

        break;
      }
      case "test": {
        // if the node is in the range
        if (i >= range[0] && i <= range[1])
          color = theme.palette.grey[700];

        if (history.indexOf(i) > -1)
          color = theme.palette.success.dark
        
        // color the current node differently
        if (i === index) 
          color = theme.palette.info.main; 

        break;
      }
      default: {
        const quad = quadInterpolation(weight, minWeight, maxWeight)

        if (i >= range[0] && i <= range[1])
          color = interpolateLab(theme.palette.success.dark, theme.palette.error.dark)(quad);
      }
    }
    

    return color
  }
);

// returns statistics about the test that just concluded
// TODO: since this is used at a particular time in the lifecylcle of the app, maybe a selector is not the best way to do it
export const statSelector = createSelector(
  [
    state => state.cards.data.slice(state.cards.range[0], state.cards.range[1] + 1).map(cards => cards.weight),
    state => state.cards.testData.weightsPreTest,
    state => state.cards.testData.cardTimes,
    state => state.cards.range[0],
  ],
  (newCardWeights, oldCardWeights, cardTimeStamps, startRange) => {
    const weightDeltas = newCardWeights.map((weight, i) => weight - oldCardWeights[i]); // calculate card improvement for each card
    const avgWeightDelta = weightDeltas.reduce((twd, wd) => twd + wd) / weightDeltas.length; // calculate average card improvement

    const [_, ...cardTimes] = cardTimeStamps.map((ts, i) => ts - cardTimeStamps[Math.max(0, i - 1)]); // calculate array of deltas, the first value being 0 is ignored
    const totalTime = cardTimeStamps[cardTimeStamps.length - 1] - cardTimeStamps[0]; // last time - first time to get total time spent on test
    const avgTime = cardTimes.reduce((tt, ct) => tt + ct) / cardTimes.length; // get average time spent on card

    return {
      cardStats: weightDeltas.map((wd, i) => ({
        index: startRange + i,
        weightDelta: wd,
        prevWeight: oldCardWeights[i],
        time: cardTimes[i]
      })),
      avgWeightDelta,
      totalTime,
      avgTime
    }
  }
)

const { reducer, caseReducers, actions } = createSlice({
  name: "cards",
  // initialState: test1,
  initialState,
  reducers
});

// persist the cards reducer to save user data
export const cardsReducer = persistReducer(
  {
    key: "cards",
    storage,
    whitelist: ["data", "range", "stepper", "autoAdvance"],
    // whitelist: ["data"],
  },
  reducer
);

// append exports
module.exports = {
  ...module.exports,
  ...actions
};
