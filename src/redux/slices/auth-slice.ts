import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/auth';

// Define the state type
interface AuthState {
  accessToken: string | null;
  user: User | null;
  expiresIn: number;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  resetPasswordToken: string | null;
}

// Initial state
const initialState: AuthState = {
  accessToken: null,
  user: null,
  expiresIn: 0,
  loading: false,
  error: null,
  isInitialized: false,
  resetPasswordToken: null,
};

// Create the slice with reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ accessToken: string; user: User; expiresIn: number }>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.expiresIn = action.payload.expiresIn;
      state.loading = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.accessToken = null;
      state.expiresIn = 0;
      state.user = null;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.expiresIn = 0;
      state.loading = false;
    },
    setIsInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    refreshTokenSuccess: (state, action: PayloadAction<{ accessToken: string; user: User; expiresIn: number }>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.expiresIn = action.payload.expiresIn;
      state.isInitialized = true;
    },
    refreshTokenFailure: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isInitialized = true;
      state.expiresIn = 0;
    },
    forgetPasswordRequestSuccess: (state, action: PayloadAction<{ resetPasswordToken: string }>) => {
      state.resetPasswordToken = action.payload.resetPasswordToken;
      state.loading = false;
      state.error = null;
    },
    forgetPasswordRequestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.resetPasswordToken = null;
    },
    resetPasswordSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.resetPasswordToken = null;
    },
    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserRequest: (state) => {
      state.loading = true;
    },
    updateUserRequestSuccess: (state, action: PayloadAction<Partial<User>>) => {
      state.loading = false;
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateUserRequestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    changePasswordRequest: (state) => {
      state.loading = true;
    },
    changePasswordSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    changePasswordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setIsInitialized,
  refreshTokenSuccess,
  refreshTokenFailure,
  forgetPasswordRequestSuccess,
  forgetPasswordRequestFailure,
  resetPasswordSuccess,
  resetPasswordFailure,
  updateUserRequest,
  updateUserRequestSuccess,
  updateUserRequestFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
