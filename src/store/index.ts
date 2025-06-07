import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./auth";
import cartReducer from "./cartSlice";
import productsReducer from "./products";
import ordersReducer from "./orders";

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    cart: cartReducer,
    products: productsReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
