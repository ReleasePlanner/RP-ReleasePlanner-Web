/**
 * Features slice - State management for features by product
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProductWithFeatures, Feature } from "@/features/feature/types";
import { MOCK_PRODUCT_FEATURES } from "../features/feature/mockData";

export interface FeaturesState {
  productFeatures: ProductWithFeatures[];
}

const initialState: FeaturesState = {
  productFeatures: MOCK_PRODUCT_FEATURES,
};

const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    addFeature(
      state,
      action: PayloadAction<{ productId: string; feature: Feature }>
    ) {
      const product = state.productFeatures.find(
        (p) => p.id === action.payload.productId
      );
      if (product) {
        product.features.push(action.payload.feature);
      } else {
        // Create new product entry if doesn't exist
        state.productFeatures.push({
          id: action.payload.productId,
          name: "", // Name should be provided or fetched from products
          features: [action.payload.feature],
        });
      }
    },
    updateFeature(state, action: PayloadAction<Feature>) {
      const product = state.productFeatures.find(
        (p) => p.id === action.payload.productId
      );
      if (product) {
        const index = product.features.findIndex(
          (f) => f.id === action.payload.id
        );
        if (index !== -1) {
          product.features[index] = action.payload;
        }
      }
    },
    deleteFeature(
      state,
      action: PayloadAction<{ productId: string; featureId: string }>
    ) {
      const product = state.productFeatures.find(
        (p) => p.id === action.payload.productId
      );
      if (product) {
        product.features = product.features.filter(
          (f) => f.id !== action.payload.featureId
        );
      }
    },
    setProductFeatures(state, action: PayloadAction<ProductWithFeatures[]>) {
      state.productFeatures = action.payload;
    },
    setFeaturesForProduct(
      state,
      action: PayloadAction<{ productId: string; features: Feature[] }>
    ) {
      const product = state.productFeatures.find(
        (p) => p.id === action.payload.productId
      );
      if (product) {
        product.features = action.payload.features;
      } else {
        state.productFeatures.push({
          id: action.payload.productId,
          name: "",
          features: action.payload.features,
        });
      }
    },
  },
});

export const {
  addFeature,
  updateFeature,
  deleteFeature,
  setProductFeatures,
  setFeaturesForProduct,
} = featuresSlice.actions;

export const featuresReducer = featuresSlice.reducer;
