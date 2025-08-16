import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../../index.jsx";
import { Parastoo } from "next/font/google/index.js";

export const loginUser = createAsyncThunk(
    "user/login",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.post(`/users/login`, { // Fixed: was /login, now /users/login
                email: user.email,
                password: user.password
            });
                
            if(response.data.token) {
                localStorage.setItem("token", response.data.token);
                return response.data;
            } else {
                return thunkAPI.rejectWithValue({
                    message: "Token not provided",
                });
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: error.message }
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/users/register', { // Fixed: was /user/register, now /users/register
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name, 
            });
            
            return response.data;
            
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: error.message }
            );
        }
    }
);
export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {
            // ✅ Add /users prefix to match your route
            const response = await clientServer.get("/users/get_user_and_profile", {
                params: {
                    token: user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);  

export const getAllUsers = createAsyncThunk(
    "auth/getAllUsers", // Make sure this matches your slice name
    async (_, thunkAPI) => {
      try {
        const token = localStorage.getItem("token");
        const response = await clientServer.get("/users/get_all_users", {
          params: { token },
        });
        
        // Transform the profiles into a cleaner format
        const profiles = response.data.profiles || [];
        const users = profiles.map(profile => ({
          id: profile.userId._id,
          name: profile.userId.name,
          email: profile.userId.email,
          profilePic: profile.userId.profilePicture,
          username: profile.userId.username,
          bio: profile.bio,
          currentPost: profile.currentPost,
          pastWork: profile.pastWork,
          education: profile.education
        }));
        
        return { users }; // Return in the format your reducer expects
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch users");
      }
    }
);