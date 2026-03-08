import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api';

const persisted = localStorage.getItem('auth');

const initialState = persisted
  ? { ...JSON.parse(persisted), loading: false, error: null }
  : { user: null, token: null, loading: false, error: null };

const saveAuth = (state) => {
  localStorage.setItem('auth', JSON.stringify({ user: state.user, token: state.token }));
};

export const register = createAsyncThunk('auth/register', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('auth');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveAuth(state);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
