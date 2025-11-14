import { describe, it, expect } from 'vitest';
import {
  featuresReducer,
  addFeature,
  updateFeature,
  deleteFeature,
  setProductFeatures,
  setFeaturesForProduct,
} from './featuresSlice';
import type { Feature } from '@/features/feature/types';

describe('featuresSlice', () => {
  const mockFeature: Feature = {
    id: '1',
    productId: 'product-1',
    name: 'Test Feature',
    description: 'Test Description',
    status: 'active',
  };

  const mockProductId = 'product-1';

  it('should return initial state', () => {
    const state = featuresReducer(undefined, { type: 'unknown' });
    expect(state.productFeatures).toBeDefined();
    expect(Array.isArray(state.productFeatures)).toBe(true);
  });

  it('should handle addFeature to existing product', () => {
    const initialState = featuresReducer(undefined, {
      type: 'features/setProductFeatures',
      payload: [
        {
          id: mockProductId,
          name: 'Product 1',
          features: [],
        },
      ],
    });
    
    const state = featuresReducer(initialState, addFeature({
      productId: mockProductId,
      feature: mockFeature,
    }));
    
    const product = state.productFeatures.find((p) => p.id === mockProductId);
    expect(product?.features).toContainEqual(mockFeature);
  });

  it('should handle addFeature to new product', () => {
    const initialState = featuresReducer(undefined, { type: 'unknown' });
    const state = featuresReducer(initialState, addFeature({
      productId: 'new-product',
      feature: mockFeature,
    }));
    
    const product = state.productFeatures.find((p) => p.id === 'new-product');
    expect(product).toBeDefined();
    expect(product?.features).toContainEqual(mockFeature);
  });

  it('should handle updateFeature', () => {
    const initialState = featuresReducer(undefined, {
      type: 'features/setProductFeatures',
      payload: [
        {
          id: mockProductId,
          name: 'Product 1',
          features: [mockFeature],
        },
      ],
    });
    
    const updatedFeature = { ...mockFeature, name: 'Updated Feature' };
    const state = featuresReducer(initialState, updateFeature(updatedFeature));
    
    const product = state.productFeatures.find((p) => p.id === mockProductId);
    const feature = product?.features.find((f) => f.id === mockFeature.id);
    expect(feature?.name).toBe('Updated Feature');
  });

  it('should handle deleteFeature', () => {
    const initialState = featuresReducer(undefined, {
      type: 'features/setProductFeatures',
      payload: [
        {
          id: mockProductId,
          name: 'Product 1',
          features: [mockFeature],
        },
      ],
    });
    
    const state = featuresReducer(initialState, deleteFeature({
      productId: mockProductId,
      featureId: mockFeature.id,
    }));
    
    const product = state.productFeatures.find((p) => p.id === mockProductId);
    expect(product?.features.find((f) => f.id === mockFeature.id)).toBeUndefined();
  });

  it('should handle setProductFeatures', () => {
    const productFeatures = [
      {
        id: 'product-1',
        name: 'Product 1',
        features: [mockFeature],
      },
      {
        id: 'product-2',
        name: 'Product 2',
        features: [],
      },
    ];
    
    const state = featuresReducer(undefined, setProductFeatures(productFeatures));
    
    expect(state.productFeatures).toEqual(productFeatures);
  });

  it('should handle setFeaturesForProduct for existing product', () => {
    const initialState = featuresReducer(undefined, {
      type: 'features/setProductFeatures',
      payload: [
        {
          id: mockProductId,
          name: 'Product 1',
          features: [],
        },
      ],
    });
    
    const newFeatures: Feature[] = [
      mockFeature,
      { ...mockFeature, id: '2', name: 'Feature 2' },
    ];
    
    const state = featuresReducer(initialState, setFeaturesForProduct({
      productId: mockProductId,
      features: newFeatures,
    }));
    
    const product = state.productFeatures.find((p) => p.id === mockProductId);
    expect(product?.features).toEqual(newFeatures);
  });

  it('should handle setFeaturesForProduct for new product', () => {
    const initialState = featuresReducer(undefined, { type: 'unknown' });
    const newFeatures: Feature[] = [mockFeature];
    
    const state = featuresReducer(initialState, setFeaturesForProduct({
      productId: 'new-product',
      features: newFeatures,
    }));
    
    const product = state.productFeatures.find((p) => p.id === 'new-product');
    expect(product).toBeDefined();
    expect(product?.features).toEqual(newFeatures);
  });
});

