import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./auth";
import cartReducer from "./cartSlice";
import productsReducer from "./products";

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    cart: cartReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
