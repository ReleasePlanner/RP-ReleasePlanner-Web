/**
 * Products slice - State management for products
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/features/releasePlans/components/Plan/CommonDataCard/types";
import { SAMPLE_PRODUCTS } from "@/features/releasePlans/lib/productData";

export interface ProductsState {
  products: Product[];
}

const initialState: ProductsState = {
  products: SAMPLE_PRODUCTS,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
  },
});

export const { addProduct, updateProduct, deleteProduct, setProducts } =
  productsSlice.actions;

export const productsReducer = productsSlice.reducer;
