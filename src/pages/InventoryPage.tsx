import React, { useState } from 'react';
import { Plus, Filter, List, Grid as GridIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductTable } from '../components/inventory/ProductTable';
import {AddProductModal} from '../components/inventory/AddProductModal';
import { useInventory } from '../contexts/InventoryContext';

export const InventoryPage: React.FC = () => {
  const { products } = useInventory();
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your products and stock levels
          </p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus size={16} />}
          onClick={() => {setIsModalOpen(true)}}
        >
          Add Product
        </Button>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {products.length} products
            </span>
          </div>
          <div className="flex space-x-2">
            <div>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Filter size={16} />}
              >
                Filter
              </Button>
            </div>
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <button
                className={`p-2 ${
                  view === 'list'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setView('list')}
              >
                <List size={18} />
              </button>
              <button
                className={`p-2 ${
                  view === 'grid'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setView('grid')}
              >
                <GridIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        <ProductTable />
      </div>
    </div>
  );
};