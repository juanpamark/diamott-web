import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

export default function HeroVideo() {
  return (
    <section className="relative w-full h-[85vh] sm:h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Video de fondo en bucle infinito, sin audio, autoplay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-85"
      >
        <source src={BRAND.heroVideoUrl} type="video/mp4" />
        Tu navegador no soporta el formato de video.
      </video>

      {/* Overlay oscuro sutil con degradado profesional para legibilidad de alta gama */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 backdrop-contrast-105" />

      {/* Contenido Central y SEO */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Subtítulo de marca */}
        <span className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-neutral-200 mb-3 drop-shadow-md">
          {BRAND.name} • Beauty Studio
        </span>

        {/* Título Principal Requerido por SEO */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white max-w-3xl leading-[1.15] drop-shadow-lg">
          Eleva tu estilo.{" "}
          <span className="font-semibold block sm:inline">
            Maquillaje y Accesorios Premium
          </span>
        </h1>

        <p className="mt-4 text-xs sm:text-sm md:text-base text-neutral-200/90 max-w-xl font-light tracking-wide leading-relaxed drop-shadow">
          Descubre colecciones seleccionadas para resaltar tu belleza auténtica con acabados de alta costura.
        </p>

        {/* Botón de exploración directa */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="#categorias"
            className="px-7 py-3 text-xs sm:text-sm font-medium tracking-widest uppercase bg-white text-neutral-900 rounded-sm hover:bg-neutral-100 transition-all shadow-md active:scale-95"
          >
            Explorar Catálogo
          </Link>
        </div>
      </div>

      {/* Indicador de scroll inferior */}
      <Link
        href="#categorias"
        aria-label="Ir a categorías"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/80 hover:text-white transition-colors animate-bounce"
      >
        <ChevronDown className="w-5 h-5" />
      </Link>
    </section>
  );
}
