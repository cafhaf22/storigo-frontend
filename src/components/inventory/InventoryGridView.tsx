import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { ContextMenu } from '../ui/ContextMenu';
import { useInventory } from '../../contexts/InventoryContext';
import { Eye, Edit, Trash2 } from "lucide-react";

interface InventoryGridViewProps {
    products: Product[];
}

export const InventoryGridView: React.FC<InventoryGridViewProps> = ({ products }) => {
    const { deleteProduct } = useInventory();
    // Menú contextual: id de producto, posición x/y
    const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);

    // Abre el menú contextual en la posición del mouse
    const handleContextMenu = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        productId: string
    ) => {
        e.preventDefault();
        setContextMenu({ id: productId, x: e.clientX, y: e.clientY });
    };

    const closeMenu = () => setContextMenu(null);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
                <div
                    key={product.id}
                    onContextMenu={e => handleContextMenu(e, product.id)}
                    className="relative"
                >
                    <ProductCard product={product} />
                    {contextMenu && contextMenu.id === product.id && (
                        <ContextMenu open x={contextMenu.x} y={contextMenu.y} onClose={closeMenu}>
                            <button
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => {
                                    // View Details - placeholder
                                    closeMenu();
                                }}
                            >
                                <Eye size={16} className="mr-2" />
                                View Details
                            </button>
                            <button
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => {
                                    // Puedes agregar lógica para activar edición global aquí
                                    closeMenu();
                                }}
                            >
                                <Edit size={16} className="mr-2" />
                                Edit Product
                            </button>
                            <button
                                className="flex items-center w-full px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/30"
                                onClick={() => {
                                    deleteProduct(product.id);
                                    closeMenu();
                                }}
                            >
                                <Trash2 size={16} className="mr-2" />
                                Delete Product
                            </button>
                        </ContextMenu>
                    )}
                </div>
            ))}
        </div>
    );
};
