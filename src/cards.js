import {
  createSlice,
  configureStore,
  getDefaultMiddleware,
  createSelector,
  current
} from "@reduxjs/toolkit";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import FileSaver from "file-saver";
import seedrandom from "seedrandom";

import { formatDate, getDate } from "../util";

const initialState = {
  data: [],
  range: [],
  history: [], // history of all visited cards since the beginning of the session. null by default to disable history

  stepper: 0, // used to calculate rng card index
  index: 0, // randomized by the stepper, or incremented when in edit mode

  repeat: false,
  test: false, // if the card set is for a test
  reveal: false,
  edit: false
};

const reducers = {
  // called when the data of a card is updated
  // (i.e. when a user writes the def. of a card)
  updCard: (state, action) => {
    const { index, newData } = action.payload;

    // only modify changing fields
    state.data[index] = { ...state.data[index], ...newData };

    caseReducers.forward(state, action);
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
  setCards: (state, { payload }) => {
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
  getCards: (state, _) => {
    const cardsBlob = new Blob([JSON.stringify(state.data)], {
      type: "application/json"
    });

    FileSaver.saveAs(cardsBlob, `cards [${formatDate(getDate())}].json`);
  },

  forward: (state, _) => {
    if (state.edit) {
      caseReducers.setIndex(state, { payload: state.index + 1 });
      return;
    }

    // add current card to the history
    caseReducers.addHistory(state, { payload: state.index });

    // increase stepper and increment rng index
    state.stepper = state.stepper + 1;
    caseReducers.setIndex(state, {});
  },
  backward: (state, _) => {
    if (state.edit) {
      caseReducers.setIndex(state, { payload: state.index - 1 });
      return;
    }

    if (state.history.length < 1) return;

    // pop first value of history and make it the index
    state.index = state.history[0];
    const [__, ...history] = state.history;

    state.history = history;
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

    if (payload !== null && typeof payload === "number") {
      state.index = payload;
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

  /* params */
  setRange: (state, { payload }) => {
    state.range = payload;

    caseReducers.setIndex(state, {});
  },
  setReveal: (state, { payload }) => {
    if (!state.edit) state.reveal = payload;
  },
  setEdit: (state, { payload }) => {
    // if we're done with the test and we want to edit, we clear the history and reset the index
    if (state.index < 0) {
      caseReducers.clrHistory(state, {});
      caseReducers.setIndex(state, { payload: 0 });
    }

    state.edit = payload;
  },
  setRepeat: (state, { payload }) => {
    state.repeat = payload;
  },
  addHistory: (state, { payload }) => {
    // if payload is outside of range, ignore
    if (payload < state.range[0] || payload > state.range[1]) return;

    state.history = [payload, ...state.history];
  },
  clrHistory: (state, _) => {
    state.history = [];
  }
};

/* Thunk used when clicking card option */
export const next = option => (dispatch, getState) => {
  // if outside range, ignore
  const { index, range } = getState().cards;
  if (index < range[0] || index > range[1]) return;

  dispatch(actions.setWeight(option));

  if (!getState().cards.edit) dispatch(actions.forward());
};

/* Thunk user when a test with no repeats is completed */
export const testAgain = () => (dispatch, getState) => {
  dispatch(actions.clrHistory());
  dispatch(actions.forward());
};

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

export const itemsSelector = createSelector(
  state => state.cards.index,
  state => state.cards.data,
  state => state.cards.range,
  state => state.cards.history,
  state => state.cards.edit,
  (index, cards, range, history, edit) => {
    if (edit)
      return cards.map(({ meaning, notes }, i) => {
        let itemState = "inactive";

        if (meaning) {
          itemState = "named";

          if (notes) itemState = "filled";
        }

        if (i === index) itemState = "current";

        return { itemState };
      });

    return cards.map((_, i) => {
      let itemState = "inactive";

      if (i >= range[0] && i <= range[1]) itemState = "active";

      if (history.indexOf(i) > -1) itemState = "visited";

      if (i === index) itemState = "current";

      return { itemState };
    });
  }
);

const { reducer, caseReducers, actions } = createSlice({
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
