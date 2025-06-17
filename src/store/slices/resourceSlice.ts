/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary?: number;
  overhead?: number;
  monthlyHours: number;
  totalPoints?: number;
}

interface CostSummary {
  totalUsers: number;
  totalMonthlyCost: number;
  totalAnnualCost: number;
  averageMonthlyCostPerUser: number;
  departmentBreakdown: Array<{
    department: string;
    userCount: number;
    monthlyCost: number;
    annualCost: number;
  }>;
}

interface CreateUserData {
  name: string;
  email: string;
  department: string;
  role: string;
  salary?: number;
  overhead?: number;
  monthlyHours: number;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  department?: string;
  role?: string;
  salary?: number;
  overhead?: number;
  monthlyHours?: number;
}

interface ResourceState {
  users: User[];
  costSummary: CostSummary | null;
  isLoading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: ResourceState = {
  users: [],
  costSummary: null,
  isLoading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
};

// Async thunk to fetch users only
export const fetchResourceUsers = createAsyncThunk(
  'resource/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch users';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to fetch cost summary with users (admin only)
export const fetchCostSummary = createAsyncThunk(
  'resource/fetchCostSummary',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources/cost-summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch cost summary';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to create user/resource
export const createResource = createAsyncThunk(
  'resource/createUser',
  async (userData: CreateUserData, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/resources/create`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create resource';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to update user/resource
export const updateResource = createAsyncThunk(
  'resource/updateUser',
  async ({ userId, userData }: { userId: string; userData: UpdateUserData }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/resources/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update resource';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to delete user/resource
export const deleteResource = createAsyncThunk(
  'resource/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/resources/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return userId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete resource';
      return rejectWithValue(errorMessage);
    }
  }
);

const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    clearResourceError: (state) => {
      state.error = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users cases
      .addCase(fetchResourceUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResourceUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchResourceUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch cost summary cases
      .addCase(fetchCostSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCostSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.costSummary = action.payload.summary;
        state.error = null;
      })
      .addCase(fetchCostSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create resource cases
      .addCase(createResource.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.createLoading = false;
        state.users.push(action.payload);
        state.createError = null;
      })
      .addCase(createResource.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      })
      // Update resource cases
      .addCase(updateResource.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.updateError = null;
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      // Delete resource cases
      .addCase(deleteResource.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
        state.deleteError = null;
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { 
  clearResourceError, 
  clearCreateError, 
  clearUpdateError, 
  clearDeleteError, 
  clearAllErrors 
} = resourceSlice.actions;

export default resourceSlice.reducer;