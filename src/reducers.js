import { createReducer } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { setUserTokens, clearUserState } from "./actions";

export const userReducer = createReducer(
  { tokens: null, profile: null },
  {
    [setUserTokens]: (state, action) => {
      let tokens = action.payload;
      state.tokens = { ...state.tokens, ...tokens };
    },
    [clearUserState]: (status, action) => {
      return { tokens: null, profile: null };
    }
  }
);

export const allReducers = combineReducers({
  user: userReducer
});
