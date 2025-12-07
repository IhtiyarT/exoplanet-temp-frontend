import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice';
import planetsReducer from './planetSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    planets: planetsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;