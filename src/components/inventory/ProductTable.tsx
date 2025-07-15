import React, { useState, useRef, useEffect } from 'react';
import { Eye, Edit, Trash2, Check, X } from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';
import { Product, ValidationError } from '../../types';
import { getStockLevel, formatCurrency } from '../../utils/validators';
import { Card } from '../ui/Card';

interface EditingState {
  id: string | null;
  field: string | null;
  value: any;
  originalValue: any;
  errors: ValidationError[];
}

export const ProductTable: React.FC = () => {
  const { products, updateProduct, deleteProduct, validateField } = useInventory();
  const [editing, setEditing] = useState<EditingState>({
    id: null,
    field: null,
    value: null,
    originalValue: null,
    errors: [],
  });
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing.id && editing.field && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing.id, editing.field]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent<HTMLTableRowElement>, product: Product) => {
    e.preventDefault();
    setContextMenu({ id: product.id, x: e.clientX, y: e.clientY });
  };

  const startEditing = (id: string, field: string, currentValue: any) => {
    setEditing({ id, field, value: currentValue, originalValue: currentValue, errors: [] });
  };

  const handleEditChange = (value: any) => {
    const error = validateField(editing.field!, value);
    setEditing({ ...editing, value, errors: error ? [error] : [] });
  };

  const saveEdit = () => {
    if (editing.errors.length > 0) {
      setEditing({ id: null, field: null, value: null, originalValue: null, errors: [] });
      return;
    }
    if (editing.id && editing.field) {
      const errors = updateProduct(editing.id, { [editing.field]: editing.value });
      if (errors) {
        setEditing({ ...editing, errors });
        return;
      }
    }
    setEditing({ id: null, field: null, value: null, originalValue: null, errors: [] });
  };

  const cancelEdit = () => {
    setEditing({ id: null, field: null, value: null, originalValue: null, errors: [] });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    else if (e.key === 'Escape') cancelEdit();
  };

  const stockLevelInfo = {
    high: {
      text: 'High',
      class: 'text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-800',
    },
    medium: {
      text: 'Medium',
      class: 'text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-800',
    },
    low: {
      text: 'Low',
      class: 'text-orange-800 bg-orange-100 dark:text-orange-200 dark:bg-orange-800',
    },
    out: {
      text: 'Out',
      class: 'text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-800',
    },
  };

  const renderCellContent = (product: Product, field: string) => {
    const isEditing = editing.id === product.id && editing.field === field;
    if (isEditing) {
      return (
        <div className="flex items-center space-x-1">
          <input
            ref={editInputRef}
            type={field === 'price' || field === 'quantity' ? 'number' : 'text'}
            className={`w-full px-2 py-1 border rounded ${
              editing.errors.length > 0
                ? 'border-danger-500 bg-danger-50 dark:bg-danger-900/30'
                : 'border-gray-300 dark:border-gray-700 dark:bg-gray-800'
            }`}
            value={editing.value}
            onChange={(e) => handleEditChange(e.target.value)}
            onKeyDown={handleKeyDown}
            min={field === 'price' || field === 'quantity' ? 0 : undefined}
            step={field === 'price' ? 0.01 : 1}
          />
          <button onClick={saveEdit} className="p-1 rounded-full text-success-500 hover:bg-success-100 dark:hover:bg-success-900/30">
            <Check size={16} />
          </button>
          <button onClick={cancelEdit} className="p-1 rounded-full text-danger-500 hover:bg-danger-100 dark:hover:bg-danger-900/30">
            <X size={16} />
          </button>
        </div>
      );
    }

    switch (field) {
      case 'name':
        return product.name;
      case 'price':
        return formatCurrency(product.price);
      case 'quantity':
        return <span>{product.quantity}</span>;
      case 'category':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">{product.category}</span>;
      case 'stock level': {
        const level = getStockLevel(product.quantity);
        return (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${stockLevelInfo[level].class}`}>
            {stockLevelInfo[level].text}
          </span>
        );
      }
      default:
        return null;
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aLevel = getStockLevel(a.quantity);
    const bLevel = getStockLevel(b.quantity);
    const levelOrder = { out: 0, low: 1, medium: 2, high: 3 };
    if (levelOrder[aLevel] !== levelOrder[bLevel]) return levelOrder[aLevel] - levelOrder[bLevel];
    return a.name.localeCompare(b.name);
  });

  return (
    <Card className="w-full p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-3 px-3">Product</th>
              <th className="py-3 px-3">Quantity</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 text-center">Stock Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {sortedProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
                onContextMenu={(e) => handleContextMenu(e, product)}
              >
                <td className="py-4 px-3">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Eye size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div
                        className="font-medium text-gray-900 dark:text-white cursor-pointer"
                        onDoubleClick={() => startEditing(product.id, 'name', product.name)}
                      >
                        {renderCellContent(product, 'name')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">ID: {product.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-3 cursor-pointer" onDoubleClick={() => startEditing(product.id, 'quantity', product.quantity)}>
                  {renderCellContent(product, 'quantity')}
                </td>
                <td className="py-4 px-3 cursor-pointer" onDoubleClick={() => startEditing(product.id, 'price', product.price)}>
                  {renderCellContent(product, 'price')}
                </td>
                <td className="py-4 px-3 cursor-pointer" onDoubleClick={() => startEditing(product.id, 'category', product.category)}>
                  {renderCellContent(product, 'category')}
                </td>
                <td className="py-4 px-3 text-center">{renderCellContent(product, 'stock level')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};