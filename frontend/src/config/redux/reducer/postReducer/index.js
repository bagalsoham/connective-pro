import { createSlice } from "@reduxjs/toolkit"
import { reset } from "../authReducer"
import { getAllPost } from "../../action/postAction"

const initialState = {
    post: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    comments: [],
    postId: "",
    isSuccess: false
} 

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
    },
    
    extraReducers: (builder) => {
        builder
            .addCase(getAllPost.pending, (state) => {
                state.message = "Fetching all the posts...";
                state.isLoading = true; // Fixed: should be true when loading
                state.isError = false;
                state.isSuccess = false;
                state.postFetched = false;
            })
            .addCase(getAllPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.postFetched = true;
                state.post = action.payload.posts || action.payload; // Handle different response structures
                state.message = "Posts fetched successfully";
            })
            .addCase(getAllPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.postFetched = false;
                state.post = []; // Clear posts on error
                state.message = action.payload?.message || action.error?.message || "Failed to fetch posts";
            });
    },      
})

// Export the actions
export const { reset, resetPostId, clearMessage } = postSlice.actions;

// Export the reducer
export default postSlice.reducer;