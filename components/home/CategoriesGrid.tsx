import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";

export default function CategoriesGrid() {
  return (
    <section
      id="categorias"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-20"
    >
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16">
        <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#D89BA3]">
          Colecciones Exclusivas
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mt-2">
          Compra por categoría
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-3 font-light max-w-md mx-auto">
          Explora los esenciales de belleza seleccionados para elevar tu rutina diaria con estética de pasarela.
        </p>
      </div>

      {/* Cuadrícula Imponente: 2 columnas en móvil, 4 columnas amplias en escritorio */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group relative w-full aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 block focus:outline-none cursor-pointer"
          >
            {/* Imagen de fondo editorial vertical */}
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 320px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Degradado oscuro profesional para máxima legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 group-hover:from-black/90 group-hover:via-black/45 transition-colors duration-500" />

            {/* Contenido centrado inferior estilo revista de moda */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 sm:p-6 pb-6 sm:pb-8 text-center">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-widest uppercase text-white drop-shadow-md w-full px-1">
                {category.name}
              </h3>
              <p className="hidden sm:block text-[11px] text-neutral-300 font-light mt-1 max-w-[200px] line-clamp-1">
                {category.subtitle}
              </p>
              <span className="mt-2 text-[10px] sm:text-xs font-medium text-white tracking-widest uppercase flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">
                Ver Colección <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
