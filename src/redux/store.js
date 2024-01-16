import { configureStore, combineReducers } from '@reduxjs/toolkit';


const cardDataReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CARD_DATA':
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  cardData: cardDataReducer,
});

const store = configureStore({
  reducer: rootReducer
});

export default store;
