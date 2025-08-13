import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";
// In store.js - change this:
export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,  // ← Change 'postReducer' to 'post'
  },
});