import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart } from "../lib/types";

interface CartState {
  userCart: Cart | null;
}

const initialState: CartState = {
  userCart: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCart(state, action: PayloadAction<Cart>) {
      state.userCart = action.payload;
    },
  },
});

export const { loadCart } = cartSlice.actions;
export default cartSlice.reducer;
