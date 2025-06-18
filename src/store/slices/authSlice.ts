/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  totalPoints?: number;
}


interface DecodedToken {
  email: string;
  role: string;
  exp: number;
  iat: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/auth`, credentials);
      const { token, user } = response.data;
      
      // Set cookie
      Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'strict' });
      
      return { token, user };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Authentication failed';
      return rejectWithValue(errorMessage);
    }
  }
);
console.log("loginUser",loginUser)
// Async thunk to load user from token
export const loadUserFromToken = createAsyncThunk(
  'auth/loadUserFromToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        return rejectWithValue('No token found');
      }

      // Decode token to get user info
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        Cookies.remove('authToken');
        return rejectWithValue('Token expired');
      }

      // You might want to fetch full user data from API here
      // For now, using decoded token data
      const user: User = {
        _id: '', // You might need to fetch this from API
        name: '', // You might need to fetch this from API
        email: decoded.email,
        role: decoded.role,
      };

      return { token, user };
    } catch (error) {
      Cookies.remove('authToken');
      return rejectWithValue('Invalid token');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      Cookies.remove('authToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Load user from token cases
      .addCase(loadUserFromToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUserFromToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;