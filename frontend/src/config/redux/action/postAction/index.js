import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


// This thunk fetches all posts from an API
export const getAllPost = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get('/posts/posts') // ✅ This matches your backend route
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
      }
  }
);

export const createPost = createAsyncThunk(
  "post/createPosts",
  async (userData, thunkAPI) => {
    try {
      const { file, body } = userData;
      const formData = new FormData();
      formData.append('token', localStorage.getItem('token') || '');
      formData.append('body', body || '');
      if (file) {
        formData.append('media', file);
      }

      const response = await clientServer.post("/posts/post", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // ✅ Safe check
      if (response && response.status === 200) {
        return thunkAPI.fulfillWithValue(response.data);
      } else {
        return thunkAPI.rejectWithValue("Unexpected server response");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async ({ token, post_id }, thunkAPI) => {
    try {
      const response = await clientServer.delete("/posts/delete_post", {
        data: {
          token,
          post_id
        }
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);


export const incrementPostLike = createAsyncThunk(
  "post/incrementPostLike",
  async ({ token, post_id }, thunkAPI) => { // Change this line
    try {
      const response = await clientServer.post("/posts/like_post", {
        token,
        post_id // Use post_id directly
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);
export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async ({ token, postData }, thunkAPI) => {
    try {
      const response =await clientServer.get("/posts/get_comments",{
        params:{
          post_id:postData.post_id
        }
      }); 
      return thunkAPI.fulfillWithValue({
        comments:response.data,
        post_id:postData.post_id
      })
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const response = await clientServer.post("/posts/comment", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.body // ✅ matches backend key
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);
