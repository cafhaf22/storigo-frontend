import React from "react";

type Props = {
  categories: string[];
  selected: Set<string>;
  onToggle: (cat: string) => void;
  onClear: () => void;
  counts?: Record<string, number>;
};

export const CategoryFilter: React.FC<Props> = ({
  categories,
  selected,
  onToggle,
  onClear,
  counts = {},
}) => {
  return (
    <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Filter by category
        </span>
        <button
          className="text-xs underline text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClear}
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-2 max-h-56 overflow-auto pr-1">
        {categories.map((c) => {
          const active = selected.has(c);
          return (
            <button
              key={c}
              onClick={() => onToggle(c)}
              className={[
                "px-2.5 py-1 rounded-full text-xs border transition",
                active
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 border-gray-300",
              ].join(" ")}
              title={c}
            >
              {c}
              {typeof counts[c] === "number" && <span className="ml-1">({counts[c]})</span>}
            </button>
          );
        })}

        {categories.length === 0 && (
          <div className="text-xs text-gray-500">No categories found.</div>
        )}
      </div>
    </div>
  );
};
