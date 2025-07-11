export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  createdAt: Date;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type StockLevel = 'high' | 'medium' | 'low' | 'out';

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  topSellingProducts: TopSellingProduct[];
  monthlyRevenue: MonthlyRevenue[];
}

export interface TopSellingProduct {
  id: string;
  name: string;
  sold: number;
  revenue: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}