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
    addUserOrder(state, action: PayloadAction<Order>) {
      if (state.usersOrders === null) {
        state.usersOrders = [];
      }
      state.usersOrders.push(action.payload);

      if (state.allOrders === null) {
        state.allOrders = [];
      }
      state.allOrders.push(action.payload);
    },
    resetOrders(state) {
      state.allOrders = null;
      state.usersOrders = null;
    },
  },
});

export const { loadUsersOrders, loadAllOrders, addUserOrder, resetOrders } =
  ordersSlice.actions;
export default ordersSlice.reducer;
