import { createSlice } from "@reduxjs/toolkit";
import { getAllPost, getAllComments } from "../../action/postAction";

const initialState = {
  post: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
  isSuccess: false,
  commentsLoading: false,
  commentsError: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
    clearMessage: (state) => {
      state.message = "";
      state.isError = false;
      state.isSuccess = false;
    },
    clearComments: (state) => {
      state.comments = [];
      state.postId = "";
      state.commentsError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllPost cases
      .addCase(getAllPost.pending, (state) => {
        state.message = "Fetching all the posts...";
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.postFetched = false;
      })
      .addCase(getAllPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.postFetched = true;
        state.post = (action.payload.posts || action.payload).slice().reverse();
        state.message = "Posts fetched successfully";
      })      
      .addCase(getAllPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.postFetched = false;
        state.post = [];
        state.message =
          action.payload?.message || action.error?.message || "Failed to fetch posts";
      })
      
      // getAllComments cases
      .addCase(getAllComments.pending, (state) => {
        state.commentsLoading = true;
        state.commentsError = false;
        state.message = "Fetching comments...";
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        state.commentsError = false;
        state.comments = action.payload.comments.comments || action.payload.comments.message || [];
        state.postId = action.payload.post_id;
        state.message = "Comments fetched successfully";
        state.isSuccess = true;
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.commentsLoading = false;
        state.commentsError = true;
        state.comments = [];
        state.message = action.payload || "Failed to fetch comments";
        state.isError = true;
      });
  },
});

export const { reset, resetPostId, clearMessage, clearComments } = postSlice.actions;
export default postSlice.reducer;