"use client";

import Image from "next/image";
import { Sparkles, MessageCircle, Eye } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { BRAND } from "@/lib/constants";

export default function PromoBannerSection() {
  const { promoProduct, openQuickView } = useCatalog();

  const handleWhatsAppOrder = (productName: string, priceFormatted: string) => {
    const text = `Hola Di'amott, ¡lo quiero! Me interesa la promoción de: ${productName} (${priceFormatted})`;
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

  if (!promoProduct) {
    // Banner por defecto si no hay producto marcado como promoción activa
    return (
      <section className="w-full bg-[#18181B] text-white py-14 sm:py-20 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl">
              <Image
                src={BRAND.fallbackImageUrl}
                alt="Colección Exclusiva Di'amott"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E8C5C8] text-[10px] tracking-widest uppercase font-semibold w-fit mx-auto md:mx-0">
                <Sparkles className="w-3 h-3" />
                <span>Edición Exclusiva</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white">
                Descubre nuestra selección de alta gama
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Cosméticos y accesorios elegidos para brindarte resultados profesionales en cada aplicación.
              </p>
              <div className="pt-2">
                <a
                  href="#categorias"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#D89BA3] hover:bg-[#c98c94] text-neutral-950 text-xs tracking-widest uppercase font-semibold rounded-sm transition-all shadow-md active:scale-95"
                >
                  Explorar Catálogo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const promoImage =
    promoProduct.imagen_principal_url || promoProduct.imagen_url || BRAND.fallbackImageUrl;

  return (
    <section className="w-full bg-[#171415] text-white py-14 sm:py-20 border-b border-neutral-800 relative overflow-hidden">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D89BA3]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Imagen de la Promoción */}
          <div className="relative aspect-square max-w-md mx-auto w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl group">
            <Image
              src={promoImage}
              alt={promoProduct.nombre_producto}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-[#E8C5C8] text-[10px] sm:text-xs tracking-widest uppercase font-bold border border-white/10 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#D89BA3]" />
                <span>Promoción Especial</span>
              </span>
            </div>
          </div>

          {/* Información y Botón de Conversión Directa */}
          <div className="flex flex-col justify-center text-center md:text-left space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[10px] tracking-widest uppercase mx-auto md:mx-0 w-fit">
              <span>{promoProduct.pagina}</span>
              {promoProduct.subcategoria && (
                <>
                  <span className="text-neutral-500">•</span>
                  <span>{promoProduct.subcategoria}</span>
                </>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
              {promoProduct.nombre_producto}
            </h2>

            {promoProduct.descripcion_corta && (
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-xl mx-auto md:mx-0">
                {promoProduct.descripcion_corta}
              </p>
            )}

            <div className="pt-2 flex items-center justify-center md:justify-start gap-4">
              <span className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                {promoProduct.precioFormateado}
              </span>
              <span className="text-[11px] tracking-wider uppercase text-neutral-400 font-light">
                Unidades limitadas
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 w-full">
              {/* Botón Principal: ¡Lo quiero! */}
              <button
                type="button"
                onClick={() =>
                  handleWhatsAppOrder(promoProduct.nombre_producto, promoProduct.precioFormateado)
                }
                className="w-full sm:w-auto px-8 py-3.5 bg-[#D89BA3] hover:bg-[#c98c94] text-neutral-950 text-xs sm:text-sm tracking-widest uppercase font-bold rounded-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-neutral-950" />
                <span>¡Lo quiero!</span>
              </button>

              {/* Botón Secundario: Ver Detalle */}
              <button
                type="button"
                onClick={() => openQuickView(promoProduct)}
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm tracking-widest uppercase font-medium rounded-sm flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Detalle</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
