import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./auth";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
