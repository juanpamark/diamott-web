"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useCatalog } from "@/context/CatalogContext";

export default function HeroVideo() {
  const { heroSlides, heroConfig, isHeroLoading } = useCatalog();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Usar heroSlides si hay filas activas, o fallback a heroConfig
  const slides = heroSlides.length > 0 ? heroSlides : [heroConfig];
  const hasMultipleSlides = slides.length > 1;

  // Rotación automática cada 4 segundos si hay 2 o más slides activas
  useEffect(() => {
    if (!hasMultipleSlides || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [hasMultipleSlides, slides.length, isPaused]);

  const activeIndex = currentIndex < slides.length ? currentIndex : 0;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    setIsPaused(false);
  };

  // 1. Estado de carga inicial limpio (sin video provisional para evitar parpadeos)
  if (isHeroLoading) {
    return (
      <section className="relative w-full h-[85vh] sm:h-[90vh] flex items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#D89BA3] border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-neutral-400">
            {BRAND.name}
          </span>
        </div>
      </section>
    );
  }

  const currentSlide = slides[activeIndex] || slides[0];
  const isVideo = currentSlide.tipo_fondo === "video";
  const mediaSource = currentSlide.media_url;
  const buttonText = currentSlide.texto_boton || "Descubre";
  const buttonHref = currentSlide.enlace_boton || "/#imperdibles";

  return (
    <section
      className="relative w-full h-[85vh] sm:h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ============================================================ */}
      {/* 1. Fondo Multimedia Dinámico (Video o Imagen)                */}
      {/* ============================================================ */}
      {mediaSource ? (
        isVideo ? (
          <video
            key={`hero-video-${activeIndex}-${mediaSource}`}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700"
          >
            <source src={mediaSource} type="video/mp4" />
            Tu navegador no soporta el formato de video.
          </video>
        ) : (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Image
              key={`hero-img-${activeIndex}-${mediaSource}`}
              src={mediaSource}
              alt={currentSlide.titulo || "Di'amott Hero"}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-opacity duration-700"
            />
          </div>
        )
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[#1C1A1C]" />
      )}

      {/* ============================================================ */}
      {/* 2. Backdrop Overlay sutil (5% de opacidad)                   */}
      {/* ============================================================ */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      {/* Degradado tenue superior e inferior para legibilidad tipográfica */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

      {/* ============================================================ */}
      {/* 3. SEO H1 (Oculto visualmente con sr-only)                   */}
      {/* ============================================================ */}
      <h1 className="sr-only">
        Di&apos;amott | Eleva tu estilo. Maquillaje, Fragancias y Accesorios. Jeniffer Motato
      </h1>

      {/* ============================================================ */}
      {/* 4. Contenido Central Editorial con Protagonismo a Título/Sub */}
      {/* ============================================================ */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
        {/* Etiqueta superior de marca */}
        <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-white/90 drop-shadow-md">
          {BRAND.name} • Beauty Studio
        </span>

        {/* Título Principal proveniente del CSV (Protagonista visual en negrita grande) */}
        {currentSlide.titulo && (
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight max-w-3xl drop-shadow-lg">
            {currentSlide.titulo}
          </h2>
        )}

        {/* Subtítulo grande proveniente del CSV */}
        {currentSlide.subtitulo && (
          <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-xl font-light tracking-wide leading-relaxed drop-shadow-md">
            {currentSlide.subtitulo}
          </p>
        )}

        {/* Botón principal dinámico */}
        <div className="pt-4 flex items-center justify-center">
          <Link
            href={buttonHref}
            className="px-8 py-3.5 sm:px-10 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase bg-white text-neutral-900 rounded-sm hover:bg-neutral-100 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            {buttonText}
          </Link>
        </div>

        {/* Indicadores de slides si hay múltiples */}
        {hasMultipleSlides && (
          <div className="flex items-center gap-2 pt-4">
            {slides.map((_, idx) => (
              <button
                key={`slide-dot-${idx}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 5. Controles de Navegación Manual Minimalistas (Chevrons)     */}
      {/* Solo se muestran cuando hay 2 o más slides activas           */}
      {/* ============================================================ */}
      {hasMultipleSlides && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Slide anterior"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 text-white/30 hover:text-white/90 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-hidden"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.25]" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Siguiente slide"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 text-white/30 hover:text-white/90 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-hidden"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.25]" />
          </button>
        </>
      )}

      {/* Indicador de scroll inferior */}
      <Link
        href={buttonHref}
        aria-label="Desplazarse a la siguiente sección"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors animate-bounce cursor-pointer"
      >
        <ChevronDown className="w-5 h-5 stroke-[1.5]" />
      </Link>
    </section>
  );
}
