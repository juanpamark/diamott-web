"use client";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const MAKEUP_FILTERS = [
  "Todo",
  "Rostro",
  "Labios",
  "Ojos y cejas",
];

export default function FilterBar({
  activeFilter,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="w-full bg-white border-b border-neutral-100 sticky top-[92px] sm:top-[104px] z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto py-3 gap-2 sm:gap-4 no-scrollbar">
          {MAKEUP_FILTERS.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => onFilterChange(filter)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer select-none ${
                  isSelected
                    ? "bg-neutral-900 text-white font-medium shadow-xs"
                    : "bg-neutral-50 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
