import React from 'react';
import { getStockLevel } from '../../utils/validators';
import { useInventory } from '../../contexts/InventoryContext';
import { Product } from '../../types';
import { useInlineEdit } from '../../hooks/useInlineEdits';
import { EditableCell } from '../ui/EditableCell';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { updateProduct, validateField } = useInventory();

  // Hook para editar nombre
  const nameEdit = useInlineEdit({
    id: product.id,
    field: 'name',
    value: product.name,
    validateField,
    onSave: (id, field, value) => updateProduct(id, { [field]: value }),
  });

  // Hook para editar precio
  const priceEdit = useInlineEdit({
    id: product.id,
    field: 'price',
    value: product.price,
    validateField,
    onSave: (id, field, value) => updateProduct(id, { [field]: Number(value) }),
  });

  // Hook para editar cantidad
  const quantityEdit = useInlineEdit({
    id: product.id,
    field: 'quantity',
    value: product.quantity,
    validateField,
    onSave: (id, field, value) => updateProduct(id, { [field]: Number(value) }),
  });

  return (
    <div className="bg-white dark:bg-[#22243c] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <img
        src={product.image || '/placeholder.png'}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div>
            {/* Nombre */}
            <div className="mb-2">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 text-left">Product</div>
              <div
                className="text-base text-gray-900 dark:text-gray-100 text-center cursor-pointer"
                onDoubleClick={nameEdit.startEditing}
              >
                <EditableCell
                  editing={nameEdit.editing}
                  value={nameEdit.editValue}
                  errors={nameEdit.errors}
                  inputRef={nameEdit.inputRef}
                  onChange={nameEdit.handleChange}
                  onSave={nameEdit.saveEdit}
                  onCancel={nameEdit.cancelEdit}
                  onKeyDown={nameEdit.handleKeyDown}
                />
              </div>
            </div>

            {/* ID */}
            <div className="mb-2">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 text-left">ID</div>
              <div className="text-base text-gray-900 dark:text-gray-100 text-center">{product.id}</div>
            </div>

            {/* Precio */}
            <div>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 text-left">Price</div>
              <div
                className="text-base text-gray-900 dark:text-gray-100 text-center cursor-pointer"
                onDoubleClick={priceEdit.startEditing}
              >
                <EditableCell
                  editing={priceEdit.editing}
                  value={priceEdit.editValue}
                  errors={priceEdit.errors}
                  inputRef={priceEdit.inputRef}
                  onChange={priceEdit.handleChange}
                  onSave={priceEdit.saveEdit}
                  onCancel={priceEdit.cancelEdit}
                  onKeyDown={priceEdit.handleKeyDown}
                  type="number"
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div>
            {/* Stock Level */}
            <div className="mb-2">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 text-left">Stock Level</div>
              <div className="text-base text-gray-900 dark:text-gray-100 text-center">
                {getStockLevel(product.quantity)}
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 text-left">Quantity</div>
              <div
                className="text-base text-gray-900 dark:text-gray-100 text-center cursor-pointer"
                onDoubleClick={quantityEdit.startEditing}
              >
                <EditableCell
                  editing={quantityEdit.editing}
                  value={quantityEdit.editValue}
                  errors={quantityEdit.errors}
                  inputRef={quantityEdit.inputRef}
                  onChange={quantityEdit.handleChange}
                  onSave={quantityEdit.saveEdit}
                  onCancel={quantityEdit.cancelEdit}
                  onKeyDown={quantityEdit.handleKeyDown}
                  type="number"
                  min={0}
                  step={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
