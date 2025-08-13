import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Filter, List, Grid as GridIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductTable } from '../components/inventory/ProductTable';
import { AddProductModal } from '../components/inventory/AddProductModal';
import { useInventory } from '../contexts/InventoryContext';
import { InventoryGridView } from "../components/inventory/InventoryGridView";
import { useSearchParams } from 'react-router-dom';
import { CategoryFilter } from '../components/inventory/CategoryFilter';

const ITEMS_PER_LOAD = 5;

export const InventoryPage: React.FC = () => {
  const { products } = useInventory();
  const [params] = useSearchParams();
  const highlightedId = params.get('highlight') ?? undefined;

  // ---- Vista (persistida)
  const [view, setView] = useState<'list' | 'grid'>(() =>
    (localStorage.getItem('inventoryViewMode') as 'list' | 'grid') || 'list'
  );
  useEffect(() => {
    localStorage.setItem('inventoryViewMode', view);
  }, [view]);

  // ---- Modal Add
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---- Filtro por categorías (inline + selección)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(() => {
    const raw = localStorage.getItem('storigo.categoryFilter');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  });
  useEffect(() => {
    localStorage.setItem('storigo.categoryFilter', JSON.stringify(Array.from(selectedCats)));
  }, [selectedCats]);

  // Categorías disponibles (de todos los productos)
  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const p of products) s.add(p.category || 'Uncategorized');
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [products]);

  // Conteos por categoría (para mostrar en chips)
  const categoryCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const c of categories) acc[c] = 0;
    for (const p of products) {
      const c = p.category || 'Uncategorized';
      acc[c] = (acc[c] ?? 0) + 1;
    }
    return acc;
  }, [products, categories]);

  // ---- Endless scroll
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Resetear el scroll cuando cambian productos o el filtro
  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [products, selectedCats]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
      }
    });
    const currentRef = bottomRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  // ---- Filtrado por categorías
  const filtered = useMemo(() => {
    if (selectedCats.size === 0) return products;
    return products.filter(p => selectedCats.has(p.category || 'Uncategorized'));
  }, [products, selectedCats]);

  // ---- Reordenar para poner el highlighted primero (dentro del conjunto filtrado)
  const reordered = useMemo(() => {
    if (!highlightedId) return filtered;
    const idx = filtered.findIndex(p => String(p.id) === String(highlightedId));
    if (idx < 0) return filtered;
    const highlighted = filtered[idx];
    return [highlighted, ...filtered.slice(0, idx), ...filtered.slice(idx + 1)];
  }, [filtered, highlightedId]);

  // ---- Paginación por scroll
  const visibleProducts = useMemo(() => reordered.slice(0, visibleCount), [reordered, visibleCount]);

  // ---- Handlers de filtro
  const toggleCategory = (c: string) => {
    setSelectedCats(prev => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });
  };
  const clearCategories = () => setSelectedCats(new Set());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your products and stock levels</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => { setIsModalOpen(true); }}
        >
          Add Product
        </Button>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {filtered.length} products
            </span>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Filter size={16} />}
              onClick={() => setIsFilterOpen(v => !v)}
            >
              Filter
              {selectedCats.size > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full text-xs px-2 py-0.5 bg-blue-600 text-white">
                  {selectedCats.size}
                </span>
              )}
            </Button>

            {/* Toggle de vista */}
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <button
                className={`p-2 ${
                  view === 'list'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setView('list')}
                aria-label="List view"
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
                aria-label="Grid view"
              >
                <GridIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Banda de filtros inline debajo de la toolbar */}
        {isFilterOpen && (
          <div className={`mt-3 ${view === 'grid' ? 'mb-4' : ''}`}>
            <CategoryFilter
              categories={categories}
              selected={selectedCats}
              onToggle={toggleCategory}
              onClear={clearCategories}
              counts={categoryCounts}
            />
          </div>
        )}


        {/* Lista / Grid con productos filtrados */}
        {view === 'list' ? (
          <ProductTable products={visibleProducts} highlightedId={highlightedId} />
        ) : (
          <InventoryGridView products={visibleProducts} highlightedId={highlightedId} />
        )}

        {/* Sentinel para endless scroll */}
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};
