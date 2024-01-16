import { configureStore, combineReducers } from '@reduxjs/toolkit';


const cardDataReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CARD_DATA':
      return action.payload;
    default:
      return state;
  }
};

const metaDataReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_META_DATA':
      return action.payload;
    default:
      return state;
  }
};

const profileDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_PROFILE_DATA":
      return action.payload;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  cardData: cardDataReducer,
  metaData: metaDataReducer,
  profileData: profileDataReducer,
});

const store = configureStore({
  reducer: rootReducer
});

export default store;
