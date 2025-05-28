import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number; // Assuming product IDs are numbers, adjust if different
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (
      state,
      action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>,
    ) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1; // Increment quantity, default to 1 if not specified
      } else {
        state.items.push({ ...newItem, quantity: newItem.quantity || 1 }); // Add new item with quantity, default to 1
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      // Payload is itemId
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find((item) => item.id === id);
      if (itemToUpdate) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id); // Remove if quantity is 0 or less
        } else {
          itemToUpdate.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
