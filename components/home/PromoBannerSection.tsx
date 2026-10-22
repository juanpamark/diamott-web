"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, ShoppingBag, Eye, Check, LayoutGrid, RotateCcw, ArrowRight } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";
import { BRAND, Product } from "@/lib/constants";

export default function PromoBannerSection() {
  const { featuredImperdibles, openQuickView } = useCatalog();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [visibleCount, setVisibleCount] = useState(4);
  const [addedIds, setAddedIds] = useState<{ [id: string]: boolean }>({});

  if (featuredImperdibles.length === 0) return null;

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const hasMore = visibleCount < featuredImperdibles.length;

  // Duplicar elementos para efecto infinito continuo igual que Nuevos
  const carouselItems =
    featuredImperdibles.length > 0
      ? [...featuredImperdibles, ...featuredImperdibles, ...featuredImperdibles]
      : [];

  return (
    <section
      id="imperdibles"
      className="w-full bg-[#151214] text-white py-16 sm:py-24 border-b border-neutral-800 relative overflow-hidden scroll-mt-20"
    >
      {/* Resplandores sutiles de fondo editorial */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D89BA3]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#B8707A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera de la sección */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E8C5C8] text-[10px] tracking-widest uppercase font-semibold border border-white/10 shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D89BA3]" />
            <span>Selección Exclusiva</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
            Los Imperdibles
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light mt-2 max-w-md mx-auto">
            Favoritos seleccionados por su acabado, durabilidad y resultados que transforman tu rutina de belleza.
          </p>
        </div>

        {/* ============================================================ */}
        {/* MODO 1: CARRUSEL EN MOVIMIENTO CONTINUO (IGUAL QUE NUEVOS)   */}
        {/* ============================================================ */}
        {viewMode === "carousel" && (
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-4 sm:gap-6 w-max animate-marquee-slow hover:[animation-play-state:paused] py-2">
              {carouselItems.map((product, idx) => {
                const imgSrc =
                  product.imagen_principal_url || product.imagen_url || BRAND.fallbackImageUrl;
                const isJustAdded = !!addedIds[product.id];

                return (
                  <div
                    key={`imperdible-carousel-${product.id}-${idx}`}
                    onClick={() => openQuickView(product)}
                    className="w-64 sm:w-72 shrink-0 flex flex-col bg-neutral-900/90 rounded-2xl border border-neutral-800 hover:border-neutral-700 overflow-hidden shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    {/* Imagen del producto con Adaptación Universal */}
                    <div className="relative aspect-square w-full overflow-hidden bg-neutral-950">
                      <Image
                        src={imgSrc}
                        alt={product.nombre_producto}
                        fill
                        sizes="(max-width: 640px) 256px, 288px"
                        className="object-contain p-2.5 sm:p-3 transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#E8C5C8] text-[9px] font-bold tracking-widest uppercase border border-white/10">
                          <Sparkles className="w-2.5 h-2.5 text-[#D89BA3]" />
                          <span>Imperdible</span>
                        </span>
                      </div>
                    </div>

                    {/* Información del producto */}
                    <div className="p-4 sm:p-5 flex flex-col grow justify-between space-y-3">
                      <div>
                        <span className="text-[10px] tracking-widest uppercase text-[#D89BA3] font-semibold block mb-1 truncate">
                          {product.pagina} {product.subcategoria ? `• ${product.subcategoria}` : ""}
                        </span>
                        <h3 className="text-sm sm:text-base font-medium text-white line-clamp-1 group-hover:text-[#E8C5C8] transition-colors">
                          {product.nombre_producto}
                        </h3>
                        {product.descripcion_corta && (
                          <p className="text-xs text-neutral-400 font-light mt-1 line-clamp-2 leading-relaxed">
                            {product.descripcion_corta}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-neutral-800/80">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                            {product.precioFormateado}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                            Disponible
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, product)}
                            className={`py-2.5 px-3 text-[11px] tracking-wider uppercase font-bold rounded-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
                              isJustAdded
                                ? "bg-emerald-600 text-white"
                                : "bg-[#D89BA3] hover:bg-[#c98c94] text-neutral-950"
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>¡Añadido!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5 fill-neutral-950" />
                                <span>Agregar</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => openQuickView(product)}
                            className="py-2.5 px-3 bg-white/10 hover:bg-white/15 text-white text-[11px] tracking-wider uppercase font-medium rounded-sm flex items-center justify-center gap-1.5 border border-white/15 transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detalle</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Difuminados laterales oscuros para sensación infinita */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#151214] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#151214] to-transparent z-10" />
          </div>
        )}

        {/* ============================================================ */}
        {/* MODO 2: CUADRÍCULA PROGRESIVA (DE 4 EN 4)                    */}
        {/* ============================================================ */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in duration-300">
            {featuredImperdibles.slice(0, visibleCount).map((product) => {
              const imgSrc =
                product.imagen_principal_url || product.imagen_url || BRAND.fallbackImageUrl;
              const isJustAdded = !!addedIds[product.id];

              return (
                <div
                  key={`imperdible-grid-${product.id}`}
                  onClick={() => openQuickView(product)}
                  className="flex flex-col bg-neutral-900/90 rounded-2xl border border-neutral-800 hover:border-neutral-700 overflow-hidden shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-950">
                    <Image
                      src={imgSrc}
                      alt={product.nombre_producto}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-2.5 sm:p-3 transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-col grow justify-between space-y-2">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase text-[#D89BA3] font-semibold block truncate">
                        {product.pagina}
                      </span>
                      <h3 className="text-sm font-medium text-white line-clamp-1 group-hover:text-[#E8C5C8] transition-colors">
                        {product.nombre_producto}
                      </h3>
                    </div>
                    <div className="pt-2 border-t border-neutral-800">
                      <span className="text-base font-semibold text-white block mb-2">
                        {product.precioFormateado}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`w-full py-2 px-3 text-[10px] tracking-wider uppercase font-bold rounded-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
                          isJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-[#D89BA3] hover:bg-[#c98c94] text-neutral-950"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>¡Añadido!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 fill-neutral-950" />
                            <span>Agregar al carrito</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Controles inferiores para alternar entre carrusel y cuadrícula */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3">
          {viewMode === "carousel" ? (
            <button
              type="button"
              onClick={() => {
                setViewMode("grid");
                setVisibleCount(4);
              }}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs tracking-widest uppercase font-semibold rounded-sm flex items-center gap-2 border border-white/15 transition-all cursor-pointer active:scale-95"
            >
              <LayoutGrid className="w-4 h-4 text-[#E8C5C8]" />
              <span>Ver imperdibles en cuadrícula</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setViewMode("carousel");
                  setVisibleCount(4);
                }}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs tracking-widest uppercase font-semibold rounded-sm flex items-center gap-2 border border-white/15 transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-[#E8C5C8]" />
                <span>Volver a carrusel</span>
              </button>

              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="px-6 py-2.5 bg-[#D89BA3] hover:bg-[#c98c94] text-neutral-950 text-xs tracking-widest uppercase font-bold rounded-sm flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <span>Ver más</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-950" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
