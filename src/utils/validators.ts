import { ValidationError } from '../types';

export const validateProduct = (
  field: string,
  value: any
): ValidationError | null => {
  switch (field) {
    case 'name':
      if (!value || typeof value !== 'string') {
        return { field, message: 'Name is required' };
      }
      if (value.length < 2) {
        return { field, message: 'Name must be at least 2 characters' };
      }
      if (value.length > 100) {
        return { field, message: 'Name cannot exceed 100 characters' };
      }
      return null;

    case 'price':
      if (value === null || value === undefined || value === '') {
        return { field, message: 'Price is required' };
      }
      const priceNum = Number(value);
      if (isNaN(priceNum)) {
        return { field, message: 'Price must be a number' };
      }
      if (priceNum < 0) {
        return { field, message: 'Price cannot be negative' };
      }
      if (priceNum > 1000000) {
        return { field, message: 'Price is too high' };
      }
      return null;

    case 'quantity':
      if (value === null || value === undefined || value === '') {
        return { field, message: 'Quantity is required' };
      }
      const quantityNum = Number(value);
      if (!Number.isInteger(quantityNum)) {
        return { field, message: 'Quantity must be a whole number' };
      }
      if (quantityNum < 0) {
        return { field, message: 'Quantity cannot be negative' };
      }
      if (quantityNum > 100000) {
        return { field, message: 'Quantity is too high' };
      }
      return null;

    case 'category':
      if (!value || typeof value !== 'string') {
        return { field, message: 'Category is required' };
      }
      if (value.length < 2) {
        return { field, message: 'Category must be at least 2 characters' };
      }
      if (value.length > 50) {
        return { field, message: 'Category cannot exceed 50 characters' };
      }
      return null;

    default:
      return null;
  }
};

export const getStockLevel = (quantity: number): 'high' | 'medium' | 'low' | 'out' => {
  if (quantity <= 0) return 'out';
  if (quantity <= 5) return 'low';
  if (quantity <= 20) return 'medium';
  return 'high';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};