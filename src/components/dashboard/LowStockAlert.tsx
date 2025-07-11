import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { AlertTriangle } from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';
import { getStockLevel } from '../../utils/validators';
import { Button } from '../ui/Button';

export const LowStockAlert: React.FC = () => {
  const { products } = useInventory();
  
  const lowStockProducts = products
    .filter(product => ['low', 'out'].includes(getStockLevel(product.quantity)))
    .sort((a, b) => a.quantity - b.quantity);

  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">Low Stock Alert</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 p-3 rounded-full bg-success-50 dark:bg-success-900/20 text-success-500">
              <AlertTriangle size={24} />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              All products are well stocked
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">Low Stock Alert</span>
          <span className="bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400 text-xs font-medium px-2 py-1 rounded-full">
            {lowStockProducts.length} items
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-y-auto max-h-72">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {lowStockProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        product.quantity === 0
                          ? 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
                          : 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
                      }`}
                    >
                      {product.quantity === 0 ? 'Out of stock' : `${product.quantity} left`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <Button variant="secondary" size="sm">
                      Restock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};