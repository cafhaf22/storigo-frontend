import React, { useState, useRef, useEffect } from 'react';
import { Eye, Edit, Trash2, MoreVertical, Check, X } from 'lucide-react';
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
  const [contextMenu, setContextMenu] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editing.id && editing.field && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing.id, editing.field]);

  // Handle clicks outside context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContextMenu = (
    e: React.MouseEvent<HTMLTableRowElement>,
    product: Product
  ) => {
    e.preventDefault();
    setContextMenu({
      id: product.id,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const startEditing = (id: string, field: string, currentValue: any) => {
    setEditing({
      id,
      field,
      value: currentValue,
      originalValue: currentValue,
      errors: [],
    });
  };

  const handleEditChange = (value: any) => {
    const error = validateField(editing.field!, value);
    
    setEditing({
      ...editing,
      value,
      errors: error ? [error] : [],
    });
  };

  const saveEdit = () => {
    if (editing.errors.length > 0) {
      // Revert to original value if errors exist
      setEditing({
        id: null,
        field: null,
        value: null,
        originalValue: null,
        errors: [],
      });
      return;
    }

    if (editing.id && editing.field) {
      const updates = { [editing.field]: editing.value };
      const errors = updateProduct(editing.id, updates);
      
      if (errors) {
        setEditing({
          ...editing,
          errors,
        });
        return;
      }
    }

    setEditing({
      id: null,
      field: null,
      value: null,
      originalValue: null,
      errors: [],
    });
  };

  const cancelEdit = () => {
    setEditing({
      id: null,
      field: null,
      value: null,
      originalValue: null,
      errors: [],
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
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
          <button
            onClick={saveEdit}
            className="p-1 rounded-full text-success-500 hover:bg-success-100 dark:hover:bg-success-900/30"
          >
            <Check size={16} />
          </button>
          <button
            onClick={cancelEdit}
            className="p-1 rounded-full text-danger-500 hover:bg-danger-100 dark:hover:bg-danger-900/30"
          >
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
        return (
          <div className="flex items-center">
            <span className="mr-2">{product.quantity}</span>
          </div>
        );
      case 'category':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
            {product.category}
          </span>
        );
      case 'stock level':
        const level = getStockLevel(product.quantity);
        const colorMap = {
          high: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          low: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
          out: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return(
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colorMap[level]}`}>
            {level}
          </span>
        );
      default:
        return null;
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    // Sort by stock level (low to high) and then by name
    const aLevel = getStockLevel(a.quantity);
    const bLevel = getStockLevel(b.quantity);
    
    const levelOrder = { out: 0, low: 1, medium: 2, high: 3 };
    
    if (levelOrder[aLevel] !== levelOrder[bLevel]) {
      return levelOrder[aLevel] - levelOrder[bLevel];
    }
    
    return a.name.localeCompare(b.name);
  });

  return (
    <Card className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stock Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {sortedProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                onContextMenu={(e) => handleContextMenu(e, product)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center text-gray-400">
                          <Eye size={16} />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div
                        className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-primary-500 dark:hover:text-primary-400"
                        onDoubleClick={() =>
                          startEditing(product.id, 'name', product.name)
                        }
                      >
                        {renderCellContent(product, 'name')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {product.id.substring(0, 8)}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  onDoubleClick={() =>
                    startEditing(product.id, 'quantity', product.quantity)
                  }
                >
                  {renderCellContent(product, 'quantity')}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  onDoubleClick={() =>
                    startEditing(product.id, 'price', product.price)
                  }
                >
                  {renderCellContent(product, 'price')}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onDoubleClick={() =>
                    startEditing(product.id, 'category', product.category)
                  }
                >
                  {renderCellContent(product, 'category')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center align-middle">
                    {renderCellContent(product, 'stock level')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 border border-gray-200 dark:border-gray-700"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Eye size={16} className="mr-2" />
            View Details
          </button>
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Edit size={16} className="mr-2" />
            Edit Product
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/30"
            onClick={() => {
              deleteProduct(contextMenu.id);
              setContextMenu(null);
            }}
          >
            <Trash2 size={16} className="mr-2" />
            Delete Product
          </button>
        </div>
      )}
    </Card>
  );
};