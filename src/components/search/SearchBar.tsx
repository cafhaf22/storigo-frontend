import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { useInventory } from "../../contexts/InventoryContext";
import { Product } from "../../types";
import { useNavigate } from "react-router-dom";

type SearchItem = Pick<Product, "id" | "name" | "category">;

export const SearchBar: React.FC = () => {
  const { products } = useInventory();
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 200);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const hasQuery = debounced.trim().length > 0;

  useEffect(() => {
    const run = async () => {
      if (!hasQuery) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      const term = debounced.trim().toLowerCase();

      const filtered = products
        .filter((p) => {
          const idMatch = String(p.id).toLowerCase() === term; // ID exacto
          const nameMatch = p.name?.toLowerCase().includes(term);
          return idMatch || nameMatch;
        })
        .slice(0, 8)
        .map((p) => ({ id: p.id, name: p.name, category: (p as any).category }));

      setResults(filtered);
      setOpen(true);
      setActiveIdx(0);
      setLoading(false);
    };
    run();
  }, [hasQuery, debounced, products]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goToItem = (item: SearchItem) => {
    // navega a inventory y pone el id en la query
    navigate(`/inventory?highlight=${encodeURIComponent(String(item.id))}`);
    setOpen(false);
    setQ("");
  };

  const handleKey: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && results.length > 0 && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") setActiveIdx((i) => (i + 1) % results.length);
    if (e.key === "ArrowUp") setActiveIdx((i) => (i - 1 + results.length) % results.length);
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIdx];
      if (item) goToItem(item);
    }
  };

  return (
    <div ref={ref} className="relative flex-1 max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Search inventory…"
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Searching…</div>
          )}

          {!loading && results.length === 0 && hasQuery && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No results</div>
          )}

          {!loading &&
            results.map((r, i) => (
              <button
                key={r.id}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => goToItem(r)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  i === activeIdx ? "bg-gray-50 dark:bg-gray-800" : ""
                }`}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {r.id} · {r.category ?? "No category"}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
