import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


// This thunk fetches all posts from an API
export const getAllPost = createAsyncThunk(
    "post/getAllPosts", // action type
    async (_, thunkAPI) => {
      try {
        const response = await clientServer.get('/posts')
        return thunkAPI.fulfillWithValue(response.data)
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message); // Return error to rejected action
        }
    }
  );