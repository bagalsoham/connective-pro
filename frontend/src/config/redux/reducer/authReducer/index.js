import { createSlice } from "@reduxjs/toolkit";
import { 
    loginUser, 
    registerUser, 
    getAboutUser, 
    getAllUsers 
} from "../../action/authAction/index.js";

const initialState = {
    user: null, // Changed from [] to null since user is an object
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    allUsers: [] ,// Added this to store all users
    all_profile_fetched:false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "Hello";
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true;
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false;
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
                state.user = action.payload.user || action.payload;
                state.message = "Login successful";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.loggedIn = false;
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
                state.loggedIn = false;
                state.user = action.payload.user || null;
                state.message = "Registration successful! Please login.";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload?.message || action.error?.message || "Registration failed";
            })
            // getAboutUser cases
            .addCase(getAboutUser.pending, (state) => {
                state.isLoading = true;
                state.profileFetched = false;
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profileFetched = true;
                state.user = action.payload.user || action.payload;
                state.connections = action.payload.connections || [];
                state.connectionRequest = action.payload.connectionRequest || [];
            })
            .addCase(getAboutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.profileFetched = false;
                state.isError = true;
                state.message = action.payload?.message || action.error?.message || "Failed to fetch user data";
            })
            // getAllUsers cases
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allUsers = action.payload.users || [];
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || action.error?.message || "Failed to fetch users";
            });
    }
});

// Export the actions
export const { reset, handleLoginUser, setTokenIsNotThere, setTokenIsThere } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;