// src/store/reducers/categoryReducer.js
const initialState = null;

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CATEGORY":
      return action.payload;
    default:
      return state;
  }
};

export default categoryReducer;
