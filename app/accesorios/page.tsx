"use client";

import CategoryHero from "@/components/category/CategoryHero";
import SpecialOrder from "@/components/shared/SpecialOrder";
import ProductCard from "@/components/product/ProductCard";
import { useCatalog } from "@/context/CatalogContext";
import { Loader2 } from "lucide-react";

export default function AccesoriosPage() {
  const { getProductsByPage, isLoading, error } = useCatalog();
  const accesoriosProducts = getProductsByPage("Accesorios");

  return (
    <div className="w-full">
      <CategoryHero
        title="Accesorios"
        subtitle="Complementos y joyería contemporánea que aportan sofisticación y personalidad a cualquier atuendo."
        imageUrl="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-neutral-500 tracking-wider uppercase font-medium">
            Mostrando {accesoriosProducts.length} productos
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
        ) : accesoriosProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-xl">
            <p className="text-sm text-neutral-500">
              No hay accesorios disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {accesoriosProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>

      <SpecialOrder />
    </div>
  );
}
