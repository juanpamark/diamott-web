"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, LayoutGrid, RotateCcw, ArrowRight } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import ProductCard from "@/components/product/ProductCard";

export default function NewArrivalsSection() {
  const { newProducts, products } = useCatalog();
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");

  // Si no hay productos marcados como es_nuevo == SÍ, tomamos los primeros 6 como respaldo
  const displayProducts = newProducts.length > 0 ? newProducts : products.slice(0, 6);

  // Duplicar elementos para efecto infinito continuo si estamos en carrusel
  const carouselItems =
    displayProducts.length > 0
      ? [...displayProducts, ...displayProducts, ...displayProducts]
      : [];

  return (
    <section
      id="nuevos"
      className="w-full py-16 sm:py-24 bg-[#FCFBF9] border-b border-neutral-200/70 scroll-mt-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de la Sección */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8C5C8] text-[#B8707A] text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D89BA3]" />
            <span>Recién Llegados</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900 mt-1">
            Nuevos Lanzamientos
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-light max-w-md mx-auto">
            Las últimas tendencias y fórmulas exclusivas seleccionadas para deslumbrar en cada ocasión.
          </p>
        </div>

        {/* Modo 1: Carrusel / Slider de Movimiento Continuo Elegante */}
        {viewMode === "carousel" && (
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-4 sm:gap-6 w-max animate-marquee-slow hover:[animation-play-state:paused] py-2">
              {carouselItems.map((product, idx) => (
                <div
                  key={`${product.id}-carousel-${idx}`}
                  className="w-56 sm:w-64 shrink-0 transition-transform duration-300"
                >
                  <ProductCard product={product} index={idx % displayProducts.length} />
                </div>
              ))}
            </div>

            {/* Difuminados laterales suaves para sensación infinita */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#FCFBF9] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#FCFBF9] to-transparent z-10" />
          </div>
        )}

        {/* Modo 2: Cuadrícula Estática (Muestra 8 en PC y 4 en Móvil) */}
        {viewMode === "grid" && (
          <div className="w-full animate-in fade-in zoom-in-98 duration-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {displayProducts.slice(0, 8).map((product, idx) => {
                // En móvil sólo mostramos hasta 4 productos; del 4 al 7 quedan ocultos en pantallas pequeñas
                const isHiddenOnMobile = idx >= 4;
                return (
                  <div
                    key={`${product.id}-grid-${idx}`}
                    className={isHiddenOnMobile ? "hidden md:block" : "block"}
                  >
                    <ProductCard product={product} index={idx} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Controles Inferiores */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          {viewMode === "carousel" ? (
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className="px-6 py-3 bg-neutral-900 hover:bg-black text-white text-xs tracking-widest uppercase font-semibold rounded-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-[#E8C5C8]" />
              <span>Ver nuevos en cuadrícula</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("carousel")}
                className="px-5 py-2.5 bg-white border border-neutral-300 text-neutral-800 hover:text-black hover:border-neutral-900 text-xs tracking-widest uppercase font-semibold rounded-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Volver a carrusel</span>
              </button>

              <Link
                href="/maquillaje"
                className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs tracking-widest uppercase font-semibold rounded-sm flex items-center gap-2 shadow-md transition-all"
              >
                <span>Ver más</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E8C5C8]" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
