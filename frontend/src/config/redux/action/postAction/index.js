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

  export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI) => {
      try {
        const { file, body } = userData;
        const formData = new FormData();
        formData.append('token', localStorage.getItem('token'));
        formData.append('body', body);
        formData.append('media', file);
  
        const response = await clientServer.post("/posts/post", formData, {
          headers: {
            'Content-Type': 'multipart/form-data' 
          }
        });
        
        if (response.status === 200) {
          return thunkAPI.fulfillWithValue(response.data);
        }
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );