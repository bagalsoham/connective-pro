import { createSlice } from "@reduxjs/toolkit";
import { loginUser,registerUser } from "../../action/authAction/index.js"; 

const initialState = {
    user: [],
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
                state.message = "Knocking the door";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.user = action.payload;
                state.message = "Login successful";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error.message || "Login failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Registering user...";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true; // optional: set based on your logic
                state.user = action.payload;
                state.message = "Registration successful";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error.message || "Registration failed";
            });
    }
});

// Export the actions (optional if needed in components)
export const { reset, handleLoginUser } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
