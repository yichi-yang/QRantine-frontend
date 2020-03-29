import { createAction } from "@reduxjs/toolkit";

export const setUserTokens = createAction("user/setToken");
export const clearUserState = createAction("user/clear");
