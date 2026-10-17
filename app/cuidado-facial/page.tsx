"use client";

import { useState } from "react";
import CategoryHero from "@/components/category/CategoryHero";
import FilterBar, { SKINCARE_FILTERS } from "@/components/category/FilterBar";
import SpecialOrder from "@/components/shared/SpecialOrder";
import ProductCard from "@/components/product/ProductCard";
import { useCatalog } from "@/context/CatalogContext";
import { Loader2 } from "lucide-react";

export default function CuidadoFacialPage() {
  const { getProductsByPage, isLoading, error } = useCatalog();
  const [activeFilter, setActiveFilter] = useState("Todo");

  // Obtener productos de Cuidado facial (admite tanto "Cuidado facial" como "skincare" en el CSV)
  const skincareProducts = getProductsByPage("Cuidado facial");

  // Filtrar según la subcategoría del CSV (Rostro, Cuerpo)
  const filteredProducts =
    activeFilter === "Todo"
      ? skincareProducts
      : skincareProducts.filter(
          (item) => item.subcategoria.trim().toLowerCase() === activeFilter.trim().toLowerCase()
        );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <CategoryHero
        title="Cuidado Facial"
        subtitle="Fórmulas avanzadas, hidratación profunda y luminosidad natural para realzar la belleza de tu piel."
        imageUrl="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1600&auto=format&fit=crop"
      />

      {/* Menú de filtros de Cuidado Facial: Todo, Rostro, Cuerpo */}
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        options={SKINCARE_FILTERS}
      />

      {/* Cuadrícula de productos dinámica */}
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
          <div className="text-center py-16 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-sm text-neutral-600 font-medium">
              No hay productos disponibles en esta subcategoría actualmente.
            </p>
            <button
              onClick={() => setActiveFilter("Todo")}
              className="mt-3 text-xs uppercase tracking-wider text-[#B8707A] font-semibold hover:underline cursor-pointer"
            >
              Ver todos los productos de Cuidado facial
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
