import { describe, it, expect } from 'vitest';
import {
  productsReducer,
  addProduct,
  updateProduct,
  deleteProduct,
  setProducts,
} from './productsSlice';
import type { Product } from '@/features/releasePlans/components/Plan/CommonDataCard/types';

describe('productsSlice', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    status: 'active',
  };

  it('should return initial state', () => {
    const state = productsReducer(undefined, { type: 'unknown' });
    expect(state.products).toBeDefined();
    expect(Array.isArray(state.products)).toBe(true);
  });

  it('should handle addProduct', () => {
    const initialState = productsReducer(undefined, { type: 'unknown' });
    const state = productsReducer(initialState, addProduct(mockProduct));
    
    expect(state.products).toContainEqual(mockProduct);
  });

  it('should handle updateProduct', () => {
    const initialState = productsReducer(undefined, addProduct(mockProduct));
    const updatedProduct = { ...mockProduct, name: 'Updated Product' };
    
    const state = productsReducer(initialState, updateProduct(updatedProduct));
    
    const product = state.products.find((p) => p.id === mockProduct.id);
    expect(product?.name).toBe('Updated Product');
  });

  it('should handle deleteProduct', () => {
    const initialState = productsReducer(undefined, addProduct(mockProduct));
    const state = productsReducer(initialState, deleteProduct(mockProduct.id));
    
    expect(state.products.find((p) => p.id === mockProduct.id)).toBeUndefined();
  });

  it('should handle setProducts', () => {
    const products: Product[] = [
      { id: '1', name: 'Product 1', status: 'active' },
      { id: '2', name: 'Product 2', status: 'inactive' },
    ];
    
    const state = productsReducer(undefined, setProducts(products));
    
    expect(state.products).toEqual(products);
    expect(state.products.length).toBe(2);
  });

  it('should not update product if id does not exist', () => {
    const initialState = productsReducer(undefined, { type: 'unknown' });
    const nonExistentProduct = { ...mockProduct, id: 'non-existent' };
    
    const state = productsReducer(initialState, updateProduct(nonExistentProduct));
    
    expect(state.products.find((p) => p.id === 'non-existent')).toBeUndefined();
  });
});

