"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  options?: string[];
}

export const MAKEUP_FILTERS = [
  "Todos",
  "Rostro",
  "Labios",
  "Ojos",
  "Cejas",
  "Brochas",
  "Complementos",
  "Edición especial",
];

export const PERSONAL_CARE_FILTERS = [
  "Todos",
  "Facial",
  "Corporal",
  "Capilar",
  "Fragancias & Splashes",
];

// Alias para retrocompatibilidad
export const SKINCARE_FILTERS = PERSONAL_CARE_FILTERS;

export const ACCESSORIES_FILTERS = [
  "Todos",
  "Aretes",
  "Cadenas y collares",
  "Pulseras",
  "Anillos",
  "Accesorios para el cabello",
  "Sets de accesorios",
];

export const BAGS_FILTERS = [
  "Todos",
  "Bolsos",
  "Morrales",
  "Billeteras",
  "Monederos",
  "Cosmetiqueras",
];

export const HAIR_FILTERS = [
  "Todos",
  "Cuidado diario",
  "Tratamiento",
];

export const BEST_SELLERS_FILTERS = [
  "Todos",
  "Maquillaje",
  "Bolsos",
  "Cuidado personal",
  "Accesorios",
];

export default function FilterBar({
  activeFilter,
  onFilterChange,
  options = MAKEUP_FILTERS,
}: FilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Medición inicial diferida para asegurar render completo
    const checkTimer = setTimeout(() => {
      updateScrollState();
    }, 50);

    const handleScroll = () => {
      updateScrollState();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      clearTimeout(checkTimer);
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, options]);

  const handleSelect = (filter: string) => {
    onFilterChange(filter);
    const btn = buttonRefs.current.get(filter);
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  return (
    <div className="w-full bg-white border-b border-neutral-100 sticky top-[72px] sm:top-[88px] z-30 shadow-2xs">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desvanecimiento sutil a la izquierda (solo si hay scroll a la izquierda) */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-6 sm:bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white via-white/80 to-transparent transition-opacity duration-300 z-10 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {/* Desvanecimiento sutil a la derecha (evidencia que la lista continúa) */}
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-6 sm:bottom-0 w-10 sm:w-14 bg-gradient-to-l from-white via-white/80 to-transparent transition-opacity duration-300 z-10 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {/* Contenedor deslizante de filtros */}
        <div
          ref={scrollContainerRef}
          className="flex items-center justify-start sm:justify-center overflow-x-auto py-3 gap-2 sm:gap-4 no-scrollbar scroll-smooth"
        >
          {options.map((filter) => {
            const isSelected = activeFilter.trim().toLowerCase() === filter.trim().toLowerCase();
            return (
              <button
                key={filter}
                ref={(el) => {
                  if (el) buttonRefs.current.set(filter, el);
                  else buttonRefs.current.delete(filter);
                }}
                type="button"
                onClick={() => handleSelect(filter)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer select-none ${
                  isSelected
                    ? "bg-neutral-900 text-white font-medium shadow-xs scale-[1.02]"
                    : "bg-neutral-50 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Micro-indicador editorial inferior en móvil (solo visible si faltan filtros por ver) */}
        {canScrollRight && (
          <div className="flex sm:hidden items-center justify-center pb-2 -mt-1 text-[10px] tracking-widest uppercase text-neutral-400 select-none animate-fade-in">
            <span className="inline-flex items-center gap-1">
              <span>Desliza para ver más filtros</span>
              <ChevronRight className="w-3 h-3 stroke-[2] animate-pulse text-[#D89BA3]" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
