"use client";

import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useCatalog } from "@/context/CatalogContext";
import { Loader2 } from "lucide-react";

export default function MiniCatalog() {
  const { products, isLoading, error } = useCatalog();
  const [displayCount, setDisplayCount] = useState(8);

  const totalAvailable = products.length;
  const isExpanded = displayCount >= 12 || (totalAvailable > 0 && displayCount >= totalAvailable);

  const handleButtonClick = () => {
    if (isExpanded) {
      const section = document.getElementById("categorias");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setDisplayCount(12);
    }
  };

  const visibleProducts = products.slice(0, displayCount);

  return (
    <section className="w-full bg-[#F8F7F4] border-y border-[#EBE8E1] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la sección */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#D89BA3]">
            Best Sellers
          </span>
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900 mt-2">
            Los más deseados
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-3 font-light">
            Nuestra selección de productos favoritos para añadir un toque de sofisticación.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#D89BA3] mb-3" />
            <p className="text-xs tracking-widest uppercase font-light text-neutral-500">
              Cargando colecciones...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-sm text-neutral-500 bg-white/80 rounded-lg border border-[#EBE8E1]">
            <p>No se pudo sincronizar el inventario en este momento.</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="text-center py-12 text-sm text-neutral-500 bg-white/80 rounded-lg border border-[#EBE8E1]">
            <p>No hay productos disponibles actualmente.</p>
          </div>
        ) : (
          <>
            {/* Cuadrícula de productos sobre el fondo cálido */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {visibleProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Botón dinámico centrado */}
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={handleButtonClick}
                className="px-8 py-3.5 text-xs sm:text-sm font-medium tracking-widest uppercase bg-white text-neutral-900 border border-neutral-300 rounded-sm hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                {isExpanded ? "Ver catálogo" : "Ver más"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
