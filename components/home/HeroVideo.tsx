"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useCatalog } from "@/context/CatalogContext";

export default function HeroVideo() {
  const { heroConfig } = useCatalog();

  // Fondo dinámico: video o imagen
  const isVideo = heroConfig.tipo_fondo === "video";
  const mediaSource = heroConfig.media_url || BRAND.heroVideoUrl;
  const buttonText = heroConfig.texto_boton || "Explorar Catálogo";
  const buttonHref = heroConfig.enlace_boton || "/#imperdibles";

  return (
    <section className="relative w-full h-[85vh] sm:h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
      {/* 1. Fondo multimedia autogestionable (Video o Imagen) */}
      {isVideo ? (
        <video
          key={mediaSource}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src={mediaSource} type="video/mp4" />
          Tu navegador no soporta el formato de video.
        </video>
      ) : (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src={mediaSource}
            alt="Di'amott Hero"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* 2. Backdrop overlay (15% a 20% de opacidad) para resaltar el texto con máxima elegancia */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* 3. Degradado adicional suave para garantizar contraste y legibilidad cristalina */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25 pointer-events-none" />

      {/* 4. Contenido Central: H1 protegido para SEO + H2 y Subtítulo dinámicos del CSV */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Etiqueta superior de la marca */}
        <span className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-neutral-200 mb-3 drop-shadow-md">
          {BRAND.name} • Beauty Studio
        </span>

        {/* H1 Principal: INTACTO en el código fuente para SEO e indexación */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white max-w-3xl leading-[1.15] drop-shadow-lg">
          Eleva tu estilo.{" "}
          <span className="font-semibold block sm:inline">
            Maquillaje, Fragancias y Accesorios
          </span>
        </h1>

        {/* Título dinámico autogestionable desde el CSV (renderizado como H2 armónico de tamaño grande) */}
        {heroConfig.titulo && (
          <h2 className="mt-3 text-lg sm:text-2xl md:text-3xl font-normal text-white/95 max-w-2xl tracking-wide drop-shadow-md">
            {heroConfig.titulo}
          </h2>
        )}

        {/* Subtítulo dinámico autogestionable desde el CSV */}
        <p className="mt-3 text-xs sm:text-sm md:text-base text-neutral-200/95 max-w-xl font-light tracking-wide leading-relaxed drop-shadow">
          {heroConfig.subtitulo ||
            "Descubre productos de excelente calidad seleccionados para resaltar tu belleza auténtica todos los días y a precios que te encantarán."}
        </p>

        {/* Botón dinámico con texto_boton y enlace_boton (scroll suave a la sección elegida) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={buttonHref}
            className="px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-widest uppercase bg-white text-neutral-900 rounded-sm hover:bg-neutral-100 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {buttonText}
          </Link>
        </div>
      </div>

      {/* Indicador de scroll inferior */}
      <Link
        href={buttonHref}
        aria-label="Desplazarse a la siguiente sección"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/80 hover:text-white transition-colors animate-bounce cursor-pointer"
      >
        <ChevronDown className="w-5 h-5" />
      </Link>
    </section>
  );
}
