import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../lib/types";

interface OrdersState {
  usersOrders: Order[] | null;
  allOrders: Order[] | null;
}

const initialState: OrdersState = {
  usersOrders: null,
  allOrders: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    loadUsersOrders(state, action: PayloadAction<Order[]>) {
      state.usersOrders = action.payload;
    },
    loadAllOrders(state, action: PayloadAction<Order[]>) {
      state.allOrders = action.payload;
    },
  },
});

export const { loadUsersOrders, loadAllOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
