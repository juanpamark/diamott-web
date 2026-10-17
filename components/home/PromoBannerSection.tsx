"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, MessageCircle, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { BRAND, Product } from "@/lib/constants";

export default function PromoBannerSection() {
  const { featuredImperdibles, openQuickView } = useCatalog();
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Rotación automática cada 5 segundos en celulares
  useEffect(() => {
    if (featuredImperdibles.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % featuredImperdibles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredImperdibles.length, isPaused]);

  const handleWhatsAppOrder = (product: Product) => {
    const text = `Hola Di'amott, ¡lo quiero! Me interesa este producto imperdible: ${product.nombre_producto} (${product.precioFormateado})`;
    const url = `https://wa.me/573170593785?text=${encodeURIComponent(text)}`;

    const isMobileOrWebView =
      typeof window !== "undefined" &&
      /iPhone|iPad|iPod|Android|Instagram|FBAN|FBAV|TikTok/i.test(navigator.userAgent);

    if (isMobileOrWebView) {
      window.location.href = url;
    } else {
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (!win || win.closed || typeof win.closed === "undefined") {
        window.location.href = url;
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Deslizar izquierda -> siguiente
        setMobileIndex((prev) => (prev + 1) % featuredImperdibles.length);
      } else {
        // Deslizar derecha -> anterior
        setMobileIndex((prev) =>
          prev === 0 ? featuredImperdibles.length - 1 : prev - 1
        );
      }
    }
    touchStartXRef.current = null;
    setIsPaused(false);
  };

  if (featuredImperdibles.length === 0) return null;

  const currentMobileProduct = featuredImperdibles[mobileIndex] || featuredImperdibles[0];

  return (
    <section
      id="imperdibles"
      className="w-full bg-[#151214] text-white py-14 sm:py-20 border-b border-neutral-800 relative overflow-hidden scroll-mt-20"
    >
      {/* Resplandores decorativos de fondo */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-[#D89BA3]/10 rounded-full blur-3xl pointer-events-none" />
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
        {/* VISTA ESCRITORIO / TABLET: 3 PRODUCTOS AL MISMO TIEMPO      */}
        {/* ============================================================ */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {featuredImperdibles.map((product, idx) => {
            const imgSrc =
              product.imagen_principal_url || product.imagen_url || BRAND.fallbackImageUrl;
            return (
              <div
                key={`desktop-imperdible-${product.id}-${idx}`}
                className="group flex flex-col bg-neutral-900/80 rounded-2xl border border-neutral-800 hover:border-neutral-700 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {/* Imagen destacada */}
                <div
                  onClick={() => openQuickView(product)}
                  className="relative aspect-square w-full overflow-hidden bg-neutral-950 cursor-pointer"
                >
                  <Image
                    src={imgSrc}
                    alt={product.nombre_producto}
                    fill
                    sizes="(max-width: 1024px) 33vw, 400px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#E8C5C8] text-[9px] font-bold tracking-widest uppercase border border-white/10">
                      <Sparkles className="w-2.5 h-2.5 text-[#D89BA3]" />
                      <span>Imperdible</span>
                    </span>
                  </div>
                </div>

                {/* Información del producto */}
                <div className="p-5 flex flex-col grow justify-between space-y-4">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[#D89BA3] font-semibold block mb-1 truncate">
                      {product.pagina} {product.subcategoria ? `• ${product.subcategoria}` : ""}
                    </span>
                    <h3
                      onClick={() => openQuickView(product)}
                      className="text-base font-medium text-white line-clamp-1 group-hover:text-[#E8C5C8] transition-colors cursor-pointer"
                    >
                      {product.nombre_producto}
                    </h3>
                    {product.descripcion_corta && (
                      <p className="text-xs text-neutral-400 font-light mt-1.5 line-clamp-2 leading-relaxed">
                        {product.descripcion_corta}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-semibold text-white tracking-tight">
                        {product.precioFormateado}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                        Disponibilidad activa
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppOrder(product)}
                        className="py-2.5 px-3 bg-[#D89BA3] hover:bg-[#c98c94] text-neutral-950 text-[11px] tracking-wider uppercase font-bold rounded-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-neutral-950" />
                        <span>¡Lo quiero!</span>
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

        {/* ============================================================ */}
        {/* VISTA MÓVIL: 1 PRODUCTO A LA VEZ, ROTACIÓN CADA 5 SEGUNDOS   */}
        {/* ============================================================ */}
        <div
          className="md:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl animate-in fade-in duration-300">
            {/* Foto del Producto Actual */}
            <div
              onClick={() => openQuickView(currentMobileProduct)}
              className="relative aspect-square w-full overflow-hidden bg-neutral-950 cursor-pointer"
            >
              <Image
                key={`img-mobile-${currentMobileProduct.id}`}
                src={
                  currentMobileProduct.imagen_principal_url ||
                  currentMobileProduct.imagen_url ||
                  BRAND.fallbackImageUrl
                }
                alt={currentMobileProduct.nombre_producto}
                fill
                sizes="100vw"
                className="object-cover animate-in fade-in zoom-in-98 duration-500"
              />

              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#E8C5C8] text-[10px] font-bold tracking-widest uppercase border border-white/15 shadow-md">
                  <Sparkles className="w-3 h-3 text-[#D89BA3]" />
                  <span>Imperdible {mobileIndex + 1}/{featuredImperdibles.length}</span>
                </span>
              </div>

              {/* Botones de navegación sobre la imagen */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileIndex((prev) =>
                    prev === 0 ? featuredImperdibles.length - 1 : prev - 1
                  );
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 active:scale-95 cursor-pointer"
                aria-label="Producto anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileIndex((prev) => (prev + 1) % featuredImperdibles.length);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 active:scale-95 cursor-pointer"
                aria-label="Siguiente producto"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido e información */}
            <div className="p-5 flex flex-col space-y-3">
              <span className="text-[10px] tracking-widest uppercase text-[#D89BA3] font-semibold block truncate">
                {currentMobileProduct.pagina}{" "}
                {currentMobileProduct.subcategoria ? `• ${currentMobileProduct.subcategoria}` : ""}
              </span>

              <h3
                onClick={() => openQuickView(currentMobileProduct)}
                className="text-lg font-medium text-white line-clamp-1 cursor-pointer"
              >
                {currentMobileProduct.nombre_producto}
              </h3>

              {currentMobileProduct.descripcion_corta && (
                <p className="text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed">
                  {currentMobileProduct.descripcion_corta}
                </p>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-2xl font-semibold text-white tracking-tight">
                  {currentMobileProduct.precioFormateado}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                  Rota cada 5s
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleWhatsAppOrder(currentMobileProduct)}
                  className="py-3 px-3 bg-[#D89BA3] hover:bg-[#c98c94] text-neutral-950 text-xs tracking-wider uppercase font-bold rounded-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-neutral-950" />
                  <span>¡Lo quiero!</span>
                </button>

                <button
                  type="button"
                  onClick={() => openQuickView(currentMobileProduct)}
                  className="py-3 px-3 bg-white/10 text-white text-xs tracking-wider uppercase font-medium rounded-sm flex items-center justify-center gap-1.5 border border-white/15 active:scale-95 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Detalle</span>
                </button>
              </div>

              {/* Indicadores de paginación (3 barritas / puntos) */}
              <div className="flex items-center justify-center gap-2 pt-3">
                {featuredImperdibles.map((_, idx) => (
                  <button
                    key={`dot-${idx}`}
                    type="button"
                    onClick={() => setMobileIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      mobileIndex === idx
                        ? "w-7 bg-[#D89BA3]"
                        : "w-2 bg-neutral-700 hover:bg-neutral-600"
                    }`}
                    aria-label={`Ver imperdible ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
