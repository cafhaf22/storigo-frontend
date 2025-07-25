import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';

interface InventoryGridViewProps {
    products: Product[];
}

export const InventoryGridView: React.FC<InventoryGridViewProps> = ({ products }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};