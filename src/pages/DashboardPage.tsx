import React from 'react';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { TopProductsTable } from '../components/dashboard/TopProductsTable';
import { LowStockAlert } from '../components/dashboard/LowStockAlert';
import { mockDashboardStats } from '../utils/mockData';
import { formatCurrency } from '../utils/validators';

export const DashboardPage: React.FC = () => {
  const { totalProducts, totalValue, lowStockItems, topSellingProducts, monthlyRevenue } = mockDashboardStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview of your inventory and business performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          icon={<Package size={24} />}
          description="Products in inventory"
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(totalValue)}
          icon={<DollarSign size={24} />}
          description="Total value of stock"
          trend={{ value: 4.5, isPositive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={<AlertTriangle size={24} />}
          description="Products needing restock"
          trend={{ value: 2.8, isPositive: false }}
        />
        <StatCard
          title="Monthly Growth"
          value="12.5%"
          icon={<TrendingUp size={24} />}
          description="Revenue growth rate"
          trend={{ value: 3.1, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenue} />
        </div>
        <div>
          <LowStockAlert />
        </div>
      </div>

      <div>
        <TopProductsTable products={topSellingProducts} />
      </div>
    </div>
  );
};