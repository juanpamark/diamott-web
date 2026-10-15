"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Star, ShoppingBag, Check } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";

export default function ProductQuickViewModal() {
  const { selectedProduct, closeQuickView } = useCatalog();
  const { addToCart } = useCart();
  const [imageFailed, setImageFailed] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Evitar scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeQuickView();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeQuickView]);

  if (!selectedProduct) return null;

  const currentImageUrl =
    imageFailed || !selectedProduct.imagen_url
      ? BRAND.fallbackImageUrl
      : selectedProduct.imagen_url;

  const handleAddToCart = () => {
    addToCart(selectedProduct, 1);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      closeQuickView();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      {/* Fondo borroso / oscurecido (backdrop-blur) con cierre al hacer clic fuera */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Contenedor del Modal centrado */}
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 border border-neutral-100">
        {/* Botón cerrar "X" */}
        <button
          type="button"
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors focus:outline-none cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Foto en grande con fallback */}
          <div className="relative aspect-square w-full bg-neutral-50 overflow-hidden sm:border-r border-neutral-100">
            <Image
              src={currentImageUrl}
              alt={selectedProduct.nombre_producto}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              onError={() => setImageFailed(true)}
              className="object-cover"
            />
          </div>

          {/* Información del producto y botón de compra */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#D89BA3] block mb-1">
                  {selectedProduct.pagina}
                  {selectedProduct.subcategoria && ` • ${selectedProduct.subcategoria}`}
                </span>
                <h2
                  id="modal-product-title"
                  className="text-lg sm:text-xl font-medium text-neutral-900 tracking-tight leading-snug"
                >
                  {selectedProduct.nombre_producto}
                </h2>
              </div>

              {/* Calificación de estrellas */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < selectedProduct.calificacion
                          ? "fill-amber-400 stroke-amber-400"
                          : "fill-neutral-200 stroke-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  {selectedProduct.calificacion}.0 ({selectedProduct.numero_resenas} reseñas)
                </span>
              </div>

              {/* Precio destacado */}
              <div className="pt-2">
                <span className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                  {selectedProduct.precioFormateado}
                </span>
                <span className="block text-[11px] text-neutral-400 mt-1">
                  IVA incluido • Envíos a todo el país
                </span>
              </div>

              <div className="pt-2 text-xs text-neutral-500 leading-relaxed font-light border-t border-neutral-100">
                Producto exclusivo seleccionado por Di&apos;amott. Calidad de estudio profesional y garantía de autenticidad.
              </div>
            </div>

            {/* Botón "Agregar al carrito" */}
            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addedFeedback}
                className={`w-full py-3.5 px-6 text-xs sm:text-sm font-medium tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer ${
                  addedFeedback
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-900 text-white hover:bg-black"
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Añadido al carrito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
                    <span>Agregar al carrito</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
