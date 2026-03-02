import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import assessmentReducer from '../features/assessment/assessmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assessment: assessmentReducer
  }
});
