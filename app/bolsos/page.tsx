"use client";

import { useState } from "react";
import CategoryHero from "@/components/category/CategoryHero";
import FilterBar, { BAGS_FILTERS } from "@/components/category/FilterBar";
import SpecialOrder from "@/components/shared/SpecialOrder";
import ProductCard from "@/components/product/ProductCard";
import { useCatalog } from "@/context/CatalogContext";
import { Loader2 } from "lucide-react";
import { matchesSubcategory } from "@/lib/catalog-utils";

export default function BolsosPage() {
  const { getProductsByPage, isLoading, error } = useCatalog();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const bolsosProducts = getProductsByPage("Bolsos");

  // Filtrar según la subcategoría del CSV: Todos, Bolsos, Morrales, Billeteras, Monederos, Cosmetiqueras
  const filteredProducts =
    activeFilter === "Todos" || activeFilter === "Todo"
      ? bolsosProducts
      : bolsosProducts.filter((item) => matchesSubcategory(item.subcategoria, activeFilter));

  return (
    <div className="w-full">
      <CategoryHero
        title="Bolsos"
        subtitle="Diseños versátiles y excelente calidad pensados para acompañar tu ritmo y destacar tu look."
        imageUrl="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop"
      />

      {/* Menú de filtros de Bolsos */}
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        options={BAGS_FILTERS}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-neutral-500 tracking-wider uppercase font-medium">
            Mostrando {filteredProducts.length} productos
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#D89BA3] mb-3" />
            <p className="text-xs tracking-widest uppercase font-light text-neutral-500">
              Cargando colecciones...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-neutral-50 rounded-xl">
            <p className="text-sm text-neutral-500">
              No se pudo conectar con el catálogo en este momento.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-xl">
            <p className="text-sm text-neutral-500">
              No hay productos disponibles en la subcategoría &quot;{activeFilter}&quot; actualmente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>

      <SpecialOrder />
    </div>
  );
}
