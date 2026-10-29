"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Send, Sparkles } from "lucide-react";

export default function SpecialOrder() {
  const [productQuery, setProductQuery] = useState("");
  const [error, setError] = useState("");

  const handleQuote = (e: FormEvent) => {
    e.preventDefault();
    const cleanQuery = productQuery.trim();

    if (!cleanQuery) {
      setError("Por favor escribe el nombre o referencia del producto.");
      return;
    }

    setError("");

    // Sanitización básica y codificación para URL
    const message = `Hola Di'amott, me gustaría encargar el siguiente producto: ${cleanQuery}`;
    const whatsappUrl = `https://wa.me/573170593785?text=${encodeURIComponent(message)}`;

    const isMobileOrWebView =
      typeof window !== "undefined" &&
      /iPhone|iPad|iPod|Android|Instagram|FBAN|FBAV|TikTok/i.test(navigator.userAgent);

    if (isMobileOrWebView) {
      window.location.href = whatsappUrl;
    } else {
      const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!win || win.closed || typeof win.closed === "undefined") {
        window.location.href = whatsappUrl;
      }
    }
    setProductQuery("");
  };

  return (
    <section
      id="encargar"
      className="w-full bg-[#FCF4F5] border-y border-[#F2D8DB]/80 py-16 sm:py-24 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Fotografía Fija Editorial del Producto Premium (Labial Di'amott) */}
          <div className="relative aspect-square max-w-md mx-auto w-full rounded-2xl overflow-hidden bg-white border border-[#E8C5C8]/60 shadow-xl group">
            <Image
              src="https://res.cloudinary.com/xdjdubsz/image/upload/v1792196060/11b0b0bc-3a3d-4af4-bc73-6ab9f424af94.jpg"
              alt="Producto Exclusivo Di'amott - Encargo Especial"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#E8C5C8] block">
                Exclusividad Di&apos;amott
              </span>
              <p className="text-xs sm:text-sm font-light text-neutral-100">
                Traemos los cosméticos y accesorios que sueñas tener
              </p>
            </div>
          </div>

          {/* Formulario de Cotización */}
          <div className="flex flex-col justify-center text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E8C5C8] text-[#B8707A] text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest shadow-2xs w-fit mx-auto md:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-[#D89BA3]" />
              <span>Servicio Personalizado</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900 leading-tight">
              Encarga tu producto
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed max-w-md mx-auto md:mx-0">
              ¿No encontraste el producto que querías? Cuéntanos cuál es y nosotros te lo traemos directamente a tu puerta con atención personalizada por WhatsApp.
            </p>

            <form onSubmit={handleQuote} className="pt-3 w-full max-w-md mx-auto md:mx-0 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  id="special-order-query"
                  name="productQuery"
                  aria-label="Nombre o referencia del producto a encargar"
                  value={productQuery}
                  onChange={(e) => {
                    setProductQuery(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Ej. Labial Rare Beauty tono Hope, Bolso Prada..."
                  className="w-full px-4 py-3 sm:py-3.5 bg-white border border-[#E8C5C8] rounded-sm text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-2xs"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 font-medium text-left">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm tracking-widest uppercase font-semibold rounded-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Cotizar por WhatsApp</span>
                <Send className="w-4 h-4 text-[#E8C5C8]" />
              </button>

              <span className="block text-[11px] text-neutral-500 font-light text-center md:text-left pt-1">
                Respuesta inmediata • Cotización sin costo adicional
              </span>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
