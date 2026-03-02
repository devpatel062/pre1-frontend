import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  attemptId: null,
  page: 1,
  totalPages: 1,
  totalQuestions: 0,
  remainingSeconds: 0,
  question: null,
  selectedValue: null,
  result: null,
  loading: false,
  error: null,
  alreadyAttempted: false,
  completedAttemptId: null,
  statusLoading: false
};

export const checkAttemptStatus = createAsyncThunk('assessment/checkStatus', async (_, thunkApi) => {
  try {
    const { data } = await api.get('/assessment/status');
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response?.data?.message || 'Unable to check status');
  }
});

export const startAssessment = createAsyncThunk('assessment/start', async (_, thunkApi) => {
  try {
    const { data } = await api.post('/assessment/start');
    return data;
  } catch (err) {
    const resp = err.response;
    if (resp?.status === 403 && resp?.data?.attemptId) {
      return thunkApi.rejectWithValue({ message: resp.data.message, attemptId: resp.data.attemptId, alreadyAttempted: true });
    }
    return thunkApi.rejectWithValue(err.response?.data?.message || 'Unable to start assessment');
  }
});

export const fetchPage = createAsyncThunk(
  'assessment/fetchPage',
  async ({ attemptId, page }, thunkApi) => {
    try {
      const { data } = await api.get(`/assessment/attempt/${attemptId}/page?page=${page}`);
      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response?.data?.message || 'Unable to fetch question');
    }
  }
);

export const saveAnswer = createAsyncThunk(
  'assessment/saveAnswer',
  async ({ attemptId, questionId, selectedValue }, thunkApi) => {
    try {
      await api.put(`/assessment/attempt/${attemptId}/answer`, { questionId, selectedValue });
      return selectedValue;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response?.data?.message || 'Unable to save answer');
    }
  }
);

export const submitAssessment = createAsyncThunk(
  'assessment/submit',
  async ({ attemptId }, thunkApi) => {
    try {
      const { data } = await api.post(`/assessment/attempt/${attemptId}/submit`);
      return data;
    } catch (err) {
      return thunkApi.rejectWithValue(err.response?.data?.message || 'Unable to submit assessment');
    }
  }
);

export const fetchResult = createAsyncThunk('assessment/result', async ({ attemptId }, thunkApi) => {
  try {
    const { data } = await api.get(`/assessment/result/${attemptId}`);
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response?.data?.message || 'Unable to load result');
  }
});

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    tick: (state) => {
      if (state.remainingSeconds > 0) {
        state.remainingSeconds -= 1;
      }
    },
    clearAssessmentError: (state) => {
      state.error = null;
    },
    resetAssessment: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAttemptStatus.pending, (state) => {
        state.statusLoading = true;
      })
      .addCase(checkAttemptStatus.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.alreadyAttempted = action.payload.alreadyAttempted;
        if (action.payload.attemptId) {
          state.completedAttemptId = action.payload.attemptId;
        }
      })
      .addCase(checkAttemptStatus.rejected, (state) => {
        state.statusLoading = false;
      })
      .addCase(startAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startAssessment.fulfilled, (state, action) => {
        state.loading = false;
        state.attemptId = action.payload.attemptId;
        state.remainingSeconds = action.payload.remainingSeconds;
      })
      .addCase(startAssessment.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.alreadyAttempted) {
          state.alreadyAttempted = true;
          state.completedAttemptId = action.payload.attemptId;
          state.error = action.payload.message;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(fetchPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.loading = false;
        state.attemptId = action.payload.attemptId;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalQuestions = action.payload.totalQuestions;
        state.remainingSeconds = action.payload.remainingSeconds;
        state.question = action.payload.question;
        state.selectedValue = action.payload.selectedValue;
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveAnswer.fulfilled, (state, action) => {
        state.selectedValue = action.payload;
      })
      .addCase(saveAnswer.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchResult.fulfilled, (state, action) => {
        state.result = action.payload;
      })
      .addCase(fetchResult.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { tick, clearAssessmentError, resetAssessment } = assessmentSlice.actions;
export default assessmentSlice.reducer;
