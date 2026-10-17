"use client";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  options?: string[];
}

export const MAKEUP_FILTERS = [
  "Todo",
  "Rostro",
  "Labios",
  "Ojos y cejas",
  "Corporal",
];

export const PERSONAL_CARE_FILTERS = [
  "Todo",
  "Rostro",
  "Cuerpo",
];

// Alias para retrocompatibilidad
export const SKINCARE_FILTERS = PERSONAL_CARE_FILTERS;

export const ACCESSORIES_FILTERS = [
  "Todo",
  "Aretes",
  "Collares",
  "Accesorios para el cabello",
];

export const HAIR_FILTERS = [
  "Todo",
  "Cuidado diario",
  "Tratamiento",
];

export const BEST_SELLERS_FILTERS = [
  "Todo",
  "Maquillaje",
  "Bolsos",
  "Cuidado personal",
  "Accesorios",
  "Capilar",
  "Fragancias",
];

export default function FilterBar({
  activeFilter,
  onFilterChange,
  options = MAKEUP_FILTERS,
}: FilterBarProps) {
  return (
    <div className="w-full bg-white border-b border-neutral-100 sticky top-[72px] sm:top-[88px] z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto py-3 gap-2 sm:gap-4 no-scrollbar">
          {options.map((filter) => {
            const isSelected = activeFilter.trim().toLowerCase() === filter.trim().toLowerCase();
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
