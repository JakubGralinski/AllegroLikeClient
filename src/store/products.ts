import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../lib/types";

interface ProductsState {
  inventory: Product[] | null;
}

const initialState: ProductsState = {
  inventory: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    loadInventory(state, action: PayloadAction<Product[]>) {
      state.inventory = action.payload;
    },
  },
});

export const { loadInventory } = productsSlice.actions;
export default productsSlice.reducer;
