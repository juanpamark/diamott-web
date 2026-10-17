"use client";

import { useState } from "react";
import CategoryHero from "@/components/category/CategoryHero";
import FilterBar, { BEST_SELLERS_FILTERS } from "@/components/category/FilterBar";
import SpecialOrder from "@/components/shared/SpecialOrder";
import ProductCard from "@/components/product/ProductCard";
import { useCatalog } from "@/context/CatalogContext";
import { Loader2, Flame } from "lucide-react";

export default function MasVendidosPage() {
  const { bestSellerProducts, isLoading, error } = useCatalog();
  const [activeFilter, setActiveFilter] = useState("Todo");

  // Filtrar según la categoría seleccionada (Maquillaje, Bolsos, Cuidado facial, Accesorios, Capilar)
  const filteredProducts =
    activeFilter === "Todo"
      ? bestSellerProducts
      : bestSellerProducts.filter((item) => {
          const itemCat = item.pagina.trim().toLowerCase();
          const target = activeFilter.trim().toLowerCase();
          if (itemCat === target) return true;
          if (
            (target === "cuidado facial" || target === "cuidado-facial") &&
            (itemCat === "cuidado facial" || itemCat === "skincare")
          ) {
            return true;
          }
          return false;
        });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <CategoryHero
        title="Más Vendidos"
        subtitle="Los favoritos indiscutibles de nuestra comunidad: fórmulas probadas, acabados impecables y los productos más amados de Di'amott."
        imageUrl="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop"
      />

      {/* Menú de filtros por categoría del CSV */}
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        options={BEST_SELLERS_FILTERS}
      />

      {/* Cuadrícula de productos dinámica */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#D89BA3]" />
            <p className="text-xs text-neutral-500 tracking-wider uppercase font-medium">
              Mostrando {filteredProducts.length} productos más populares
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#D89BA3] mb-3" />
            <p className="text-xs tracking-widest uppercase font-light text-neutral-500">
              Cargando más vendidos...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-neutral-50 rounded-xl">
            <p className="text-sm text-neutral-500">
              No se pudo conectar con el catálogo en este momento.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-sm text-neutral-600 font-medium">
              No hay productos marcados como más vendidos en esta categoría actualmente.
            </p>
            <button
              onClick={() => setActiveFilter("Todo")}
              className="mt-3 text-xs uppercase tracking-wider text-[#B8707A] font-semibold hover:underline cursor-pointer"
            >
              Ver todos los más vendidos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* Componente Reutilizable: Encarga tu producto */}
      <SpecialOrder />
    </div>
  );
}
