import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../../index.jsx";

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