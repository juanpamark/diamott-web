"use client";

import { useState, FormEvent } from "react";
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
    <section className="w-full bg-[#FCF4F5] border-y border-[#F2D8DB]/80 py-16 sm:py-20 my-10 sm:my-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge decorativo */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E8C5C8] text-[#B8707A] text-[11px] font-semibold uppercase tracking-widest mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Servicio Personalizado</span>
        </div>

        {/* Títulos requeridos */}
        <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900">
          Encarga tu producto
        </h2>
        <p className="mt-3 text-xs sm:text-sm md:text-base text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
          ¿No encontraste el producto que querías? Cuéntanos cuál es y nosotros te lo traemos.
        </p>

        {/* Formulario controlado */}
        <form
          onSubmit={handleQuote}
          className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-3"
        >
          <div className="w-full relative">
            <input
              type="text"
              value={productQuery}
              onChange={(e) => {
                setProductQuery(e.target.value);
                if (error) setError("");
              }}
              placeholder="¿Cuál es tu producto?"
              aria-label="Nombre o referencia del producto a encargar"
              className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-[#E8C5C8] rounded-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 shadow-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-medium tracking-widest uppercase bg-neutral-900 text-white rounded-sm hover:bg-black transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 shadow-sm"
          >
            <span>Cotizar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {error && (
          <p className="mt-2 text-xs text-rose-600 font-medium">{error}</p>
        )}
      </div>
    </section>
  );
}
