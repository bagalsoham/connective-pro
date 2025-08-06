import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../action/authAction/index.js"; 

const initialState = {
    user: null, // Changed from [] to null since user is an object
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequest: []
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "Hello";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "Logging in...";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.user = action.payload.user || action.payload; // Handle different response structures
                state.message = "Login successful";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.loggedIn = false;
                // Fixed: Use action.payload instead of action.error for custom error messages
                state.message = action.payload?.message || action.error?.message || "Login failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "Registering user...";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = false; // Don't auto-login after registration
                state.user = action.payload.user || null;
                state.message = "Registration successful! Please login.";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                // Fixed: Use action.payload instead of action.error for custom error messages
                state.message = action.payload?.message || action.error?.message || "Registration failed";
            });
    }
});

// Export the actions
export const { reset, handleLoginUser } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;