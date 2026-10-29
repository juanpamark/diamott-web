"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Star, ShoppingBag, Check, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { BRAND, Product } from "@/lib/constants";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";

interface ContentProps {
  product: Product;
  onClose: () => void;
}

function ProductQuickViewContent({ product, onClose }: ContentProps) {
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState<0 | 1>(0);
  const [primaryImageFailed, setPrimaryImageFailed] = useState(false);
  const [secondaryImageFailed, setSecondaryImageFailed] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Evitar scroll del fondo cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Manejar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const hasSecondaryImage =
    Boolean(product.imagen_secundaria_url) && !secondaryImageFailed;

  const primaryImageSrc = primaryImageFailed
    ? BRAND.fallbackImageUrl
    : product.imagen_principal_url || product.imagen_url || BRAND.fallbackImageUrl;

  const secondaryImageSrc =
    product.imagen_secundaria_url && !secondaryImageFailed
      ? product.imagen_secundaria_url
      : primaryImageSrc;

  const currentDisplayImage =
    activeImageIndex === 1 && hasSecondaryImage ? secondaryImageSrc : primaryImageSrc;

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      {/* Fondo borroso / oscurecido con cierre al hacer clic fuera */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Contenedor del Modal centrado */}
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 border border-neutral-100">
        {/* Botón cerrar "X" */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors focus:outline-none cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Columna Izquierda: Galería / Doble Imagen */}
          <div className="relative flex flex-col bg-neutral-50 sm:border-r border-neutral-100">
            {/* Foto Grande con Adaptación Universal */}
            <div className="relative aspect-square w-full overflow-hidden bg-[#FAF9F7]">
              <Image
                src={currentDisplayImage}
                alt={product.nombre_producto}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                onError={() => {
                  if (activeImageIndex === 0) setPrimaryImageFailed(true);
                  else setSecondaryImageFailed(true);
                }}
                className="object-contain p-4 sm:p-6 transition-opacity duration-300"
              />

              {/* Flechas de navegación para alternar doble imagen */}
              {hasSecondaryImage && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === 0 ? 1 : 0));
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md transition-all cursor-pointer"
                    aria-label="Ver imagen anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === 0 ? 1 : 0));
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md transition-all cursor-pointer"
                    aria-label="Ver siguiente imagen"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Selector de Doble Imagen (Principal / Tester) */}
            {hasSecondaryImage && (
              <div className="p-2.5 bg-white border-t border-neutral-100 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(0)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    activeImageIndex === 0
                      ? "bg-neutral-900 text-white shadow-2xs"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Principal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(1)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    activeImageIndex === 1
                      ? "bg-[#D89BA3] text-neutral-950 font-bold shadow-2xs"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Tester / Detalle</span>
                </button>
              </div>
            )}
          </div>

          {/* Columna Derecha: Información del producto y botón de compra */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#D89BA3] block mb-1">
                  {product.pagina}
                  {product.subcategoria && ` • ${product.subcategoria}`}
                </span>
                <h2
                  id="modal-product-title"
                  className="text-lg sm:text-xl font-medium text-neutral-900 tracking-tight leading-snug"
                >
                  {product.nombre_producto}
                </h2>
              </div>

              {/* Calificación de estrellas */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < product.calificacion
                          ? "fill-amber-400 stroke-amber-400"
                          : "fill-neutral-200 stroke-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  {product.calificacion}.0 ({product.numero_resenas} reseñas)
                </span>
              </div>

              {/* Precio destacado */}
              <div className="pt-2">
                <span className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                  {product.precioFormateado}
                </span>
                <span className="block text-[11px] text-neutral-400 mt-1">
                  IVA incluido • Envíos a todo el país
                </span>
              </div>

              {/* Descripción Corta Destacada */}
              {product.descripcion_corta ? (
                <div className="pt-3 border-t border-neutral-100">
                  <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                    Descripción del Producto
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
                    {product.descripcion_corta}
                  </p>
                </div>
              ) : (
                <div className="pt-2 text-xs text-neutral-500 leading-relaxed font-light border-t border-neutral-100">
                  Producto exclusivo seleccionado por Di&apos;amott. Calidad de estudio profesional y garantía de autenticidad.
                </div>
              )}
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

export default function ProductQuickViewModal() {
  const { selectedProduct, closeQuickView } = useCatalog();

  if (!selectedProduct) return null;

  return (
    <ProductQuickViewContent
      key={selectedProduct.id}
      product={selectedProduct}
      onClose={closeQuickView}
    />
  );
}
