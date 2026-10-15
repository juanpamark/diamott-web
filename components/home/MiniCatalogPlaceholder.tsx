"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Eye } from "lucide-react";

// Estructura muestra para la Fase 1 (en Fase 2 se alimenta dinámicamente de Google Sheets)
const PLACEHOLDER_PRODUCTS = [
  {
    id: "p1",
    nombre_producto: "Lip Gloss Diamond Shine",
    pagina: "Maquillaje",
    subcategoria: "Labios",
    precio: "$45.000",
    calificacion: 5,
    numero_resenas: 28,
    imagen_url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p2",
    nombre_producto: "Sérum Hidratante Glow C",
    pagina: "Skincare",
    subcategoria: "Rostro",
    precio: "$68.000",
    calificacion: 5,
    numero_resenas: 34,
    imagen_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p3",
    nombre_producto: "Bolso Mini Tote Noir",
    pagina: "Bolsos",
    subcategoria: "Bolsos",
    precio: "$120.000",
    calificacion: 5,
    numero_resenas: 19,
    imagen_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p4",
    nombre_producto: "Paleta Sombras Nude Luxe",
    pagina: "Maquillaje",
    subcategoria: "Ojos y cejas",
    precio: "$85.000",
    calificacion: 5,
    numero_resenas: 42,
    imagen_url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p5",
    nombre_producto: "Aretes Perla Minimalista",
    pagina: "Accesorios",
    subcategoria: "Joyería",
    precio: "$35.000",
    calificacion: 4,
    numero_resenas: 15,
    imagen_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p6",
    nombre_producto: "Base Matte Perfection",
    pagina: "Maquillaje",
    subcategoria: "Rostro",
    precio: "$72.000",
    calificacion: 5,
    numero_resenas: 51,
    imagen_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p7",
    nombre_producto: "Crema Contorno de Ojos",
    pagina: "Skincare",
    subcategoria: "Rostro",
    precio: "$55.000",
    calificacion: 5,
    numero_resenas: 23,
    imagen_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p8",
    nombre_producto: "Bandolera Velvet Quilted",
    pagina: "Bolsos",
    subcategoria: "Bolsos",
    precio: "$135.000",
    calificacion: 5,
    numero_resenas: 17,
    imagen_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p9",
    nombre_producto: "Mascara Lash Drama Extreme",
    pagina: "Maquillaje",
    subcategoria: "Ojos y cejas",
    precio: "$48.000",
    calificacion: 5,
    numero_resenas: 39,
    imagen_url: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p10",
    nombre_producto: "Tónico Facial Iluminador",
    pagina: "Skincare",
    subcategoria: "Rostro",
    precio: "$52.000",
    calificacion: 4,
    numero_resenas: 18,
    imagen_url: "https://images.unsplash.com/photo-1608248597359-009180fbe52f?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p11",
    nombre_producto: "Collar Cadena Baño Oro 18K",
    pagina: "Accesorios",
    subcategoria: "Joyería",
    precio: "$62.000",
    calificacion: 5,
    numero_resenas: 26,
    imagen_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "p12",
    nombre_producto: "Labial Líquido Velvet Matte",
    pagina: "Maquillaje",
    subcategoria: "Labios",
    precio: "$42.000",
    calificacion: 5,
    numero_resenas: 45,
    imagen_url: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=700&auto=format&fit=crop",
  },
];

export default function MiniCatalogPlaceholder() {
  const [displayCount, setDisplayCount] = useState(8);

  const isExpanded = displayCount >= 12;

  const handleButtonClick = () => {
    if (isExpanded) {
      // Scroll suave hacia la Sección 3 (#categorias)
      const section = document.getElementById("categorias");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Revela 4 productos adicionales (llegando a 12)
      setDisplayCount(12);
    }
  };

  const visibleProducts = PLACEHOLDER_PRODUCTS.slice(0, displayCount);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Título de la sección */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
        <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#D89BA3]">
          Best Sellers
        </span>
        <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900 mt-2">
          Los más deseados
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-3 font-light">
          Nuestra selección de productos favoritos para añadir un toque de sofisticación.
        </p>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {visibleProducts.map((product, index) => {
          const isNew = index === 0 || index === 1;

          return (
            <div
              key={product.id}
              className="group flex flex-col bg-white border border-neutral-100 rounded-sm overflow-hidden transition-all duration-300 hover:border-neutral-200 hover:shadow-xs"
            >
              {/* Imagen con Badge de NUEVO */}
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-50">
                <Image
                  src={product.imagen_url}
                  alt={product.nombre_producto}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge NUEVO para los 2 primeros productos según especificación */}
                {isNew && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#1C1C1C] text-white rounded-none shadow-xs">
                    NUEVO
                  </span>
                )}

                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-white/90 text-neutral-800 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Información del producto */}
              <div className="p-3 sm:p-4 flex flex-col grow justify-between">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-neutral-400 block mb-1">
                    {product.pagina}
                  </span>
                  <h3 className="text-xs sm:text-sm font-medium text-neutral-900 line-clamp-1 group-hover:text-neutral-700">
                    {product.nombre_producto}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-neutral-900">
                    {product.precio}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                    <span className="text-neutral-500 text-[10px]">
                      ({product.numero_resenas})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón dinámico "Ver más" / "Ver catálogo" */}
      <div className="mt-12 text-center">
        <button
          type="button"
          onClick={handleButtonClick}
          className="px-8 py-3 text-xs sm:text-sm font-medium tracking-widest uppercase bg-transparent text-neutral-900 border border-neutral-900 rounded-sm hover:bg-neutral-900 hover:text-white transition-all active:scale-95 shadow-xs"
        >
          {isExpanded ? "Ver catálogo" : "Ver más"}
        </button>
      </div>
    </section>
  );
}
