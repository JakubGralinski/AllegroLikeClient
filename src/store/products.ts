import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, Product } from "../lib/types";

interface ProductsState {
  inventory: Product[] | null;
  categories: Category[] | null;
}

const initialState: ProductsState = {
  inventory: null,
  categories: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    loadInventory(state, action: PayloadAction<Product[]>) {
      state.inventory = action.payload;
    },
    loadCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
  },
});

export const { loadInventory, loadCategories } = productsSlice.actions;
export default productsSlice.reducer;
