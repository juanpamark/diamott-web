"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShoppingBag, Check } from "lucide-react";
import { BRAND, Product } from "@/lib/constants";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { openQuickView } = useCatalog();
  const { addToCart } = useCart();
  const [hasError, setHasError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Imagen directa y reactiva ante cambios del catálogo
  const rawImg = product.imagen_principal_url || product.imagen_url || BRAND.fallbackImageUrl;
  const imgSrc = hasError ? BRAND.fallbackImageUrl : rawImg;

  // Badge NUEVO: determinado exclusivamente por el campo es_nuevo del CSV (Google Sheets)
  const isNew = product.es_nuevo;

  // Calificación en formato decimal (ej: 5.0, 4.8)
  const ratingFormatted = Number(product.calificacion || 5).toFixed(1);

  const handleImageError = () => {
    setHasError(true);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  return (
    <div
      onClick={() => openQuickView(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openQuickView(product);
        }
      }}
      className="group relative flex flex-col bg-white border border-neutral-100 rounded-sm overflow-hidden transition-all duration-300 hover:border-neutral-200 hover:shadow-md cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-neutral-900"
      aria-label={`Ver detalle de ${product.nombre_producto}`}
    >
      {/* Contenedor de Imagen con Relación 1:1 Cuadrada y Adaptación Universal */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF9F7]">
        <Image
          src={imgSrc}
          alt={product.nombre_producto}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={handleImageError}
          className={`object-contain p-2.5 sm:p-3 transition-all duration-500 ease-out ${
            product.imagen_secundaria_url ? "group-hover:opacity-0" : "group-hover:scale-105"
          }`}
        />

        {product.imagen_secundaria_url && (
          <Image
            src={product.imagen_secundaria_url}
            alt={`${product.nombre_producto} - Detalle`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2.5 sm:p-3 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
          />
        )}

        {/* Badge "NUEVO" */}
        {isNew && (
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#1C1C1C] text-white rounded-none shadow-xs">
            NUEVO
          </span>
        )}

        {/* ESCRITORIO: Botón Hover 'Agregar al Carrito' (Slide-up & Fade) */}
        <div className="hidden md:flex absolute inset-x-3 bottom-3 z-20 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 text-[11px] font-medium tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 shadow-lg backdrop-blur-xs transition-colors cursor-pointer ${
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-neutral-900/95 hover:bg-black text-white"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Añadido!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>Agregar al carrito</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-3 sm:p-4 flex flex-col grow justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] tracking-widest uppercase text-neutral-400 block truncate">
              {product.subcategoria || product.pagina}
            </span>
            {/* Bloque de Calificación y Reseñas: ★ 5.0 (14) */}
            <div className="flex items-center gap-1 text-[11px] shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-neutral-800">
                {ratingFormatted}
              </span>
              <span className="text-neutral-400">
                ({product.numero_resenas})
              </span>
            </div>
          </div>

          <h3 className="text-xs sm:text-sm font-medium text-neutral-900 line-clamp-1 group-hover:text-neutral-700 transition-colors">
            {product.nombre_producto}
          </h3>
        </div>

        {/* Fila Inferior con Precio y Botón One-Tap para Móvil */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold text-neutral-900">
            {product.precioFormateado}
          </span>

          {/* MÓVIL: Botón One-Tap Add to Cart Siempre Visible */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[10px] font-medium tracking-wider uppercase transition-all active:scale-95 cursor-pointer shadow-xs ${
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-neutral-900 text-white"
            }`}
            aria-label={`Agregar ${product.nombre_producto} al carrito`}
          >
            {justAdded ? (
              <Check className="w-3 h-3" />
            ) : (
              <ShoppingBag className="w-3 h-3 stroke-[2]" />
            )}
            <span>{justAdded ? "Listo" : "Agregar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
