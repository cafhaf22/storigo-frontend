import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ValidationError } from '../types';
import { validateProduct } from '../utils/validators';
import { mockProducts } from '../utils/mockData';

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => ValidationError[] | null;
  deleteProduct: (id: string) => void;
  validateField: (field: string, value: any) => ValidationError | null;
  getProduct: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  filterProductsByCategory: (category: string) => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load initial data
  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substring(2, 10),
      createdAt: now,
      updatedAt: now,
    };
    
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>): ValidationError[] | null => {
    // Validate all fields in the update
    const errors: ValidationError[] = [];
    
    Object.entries(updates).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) errors.push(error);
    });
    
    if (errors.length > 0) return errors;
    
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, ...updates, updatedAt: new Date() } 
          : product
      )
    );
    
    return null;
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const validateField = (field: string, value: any): ValidationError | null => {
    return validateProduct(field, value);
  };

  const getProduct = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const searchProducts = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) || 
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const filterProductsByCategory = (category: string): Product[] => {
    if (!category) return products;
    return products.filter(product => product.category === category);
  };

  return (
    <InventoryContext.Provider 
      value={{ 
        products, 
        addProduct, 
        updateProduct, 
        deleteProduct, 
        validateField,
        getProduct,
        searchProducts,
        filterProductsByCategory
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};