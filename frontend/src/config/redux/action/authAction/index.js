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
    "user/getAllUsers",
    async (_, thunkAPI) => {
      try {
        const token = localStorage.getItem("token");
  
        // ✅ Call the correct backend route
        const response = await clientServer.get("/users/get_all_users", {
          params: { token }, // Send token as query param if backend expects it like that
        });
  
        return thunkAPI.fulfillWithValue(response.data); // Send successful response
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch users");
      }
    }
  );