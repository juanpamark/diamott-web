"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

const INSTAGRAM_POSTS = [
  {
    id: "post-1",
    imageUrl: optimizeCloudinaryUrl(
      "https://res.cloudinary.com/xdjdubsz/image/upload/v1792703921/WhatsApp_Image_2026-10-17_at_12.28.50.jpg"
    ),
    alt: "Di'amott Beauty Lookbook Publicitario 1",
  },
  {
    id: "post-2",
    imageUrl: optimizeCloudinaryUrl(
      "https://res.cloudinary.com/xdjdubsz/image/upload/v1792703922/WhatsApp_Image_2026-10-17_at_12.28.44.jpg"
    ),
    alt: "Di'amott Beauty Lookbook Publicitario 2",
  },
  {
    id: "post-3",
    imageUrl: optimizeCloudinaryUrl(
      "https://res.cloudinary.com/xdjdubsz/image/upload/v1792703922/WhatsApp_Image_2026-10-17_at_12.28.32.jpg"
    ),
    alt: "Di'amott Beauty Lookbook Publicitario 3",
  },
  {
    id: "post-4",
    imageUrl: optimizeCloudinaryUrl(
      "https://res.cloudinary.com/xdjdubsz/image/upload/v1792703923/WhatsApp_Image_2026-10-17_at_12.28.23.jpg"
    ),
    alt: "Di'amott Beauty Lookbook Publicitario 4",
  },
];

export default function InstagramCommunitySection() {
  return (
    <section className="w-full bg-[#121113] border-y border-neutral-800/80 py-16 sm:py-24 relative overflow-hidden text-white">
      {/* Resplandor ambiental de lujo para dar profundidad editorial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D89BA3]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera Editorial Limpia (Sin textos excesivos ni artificiales) */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D89BA3]/50 text-[#E8C5C8] text-[11px] font-medium tracking-wider uppercase mb-3 transition-colors group cursor-pointer"
          >
            {/* Ícono de Instagram SVG */}
            <svg
              className="w-3.5 h-3.5 fill-none stroke-current stroke-2 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>@diamott_beauty</span>
          </a>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
            Síguenos en Instagram
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-lg mx-auto">
            Nuevos lanzamientos, tutoriales y estilo editorial en nuestra comunidad oficial.
          </p>
        </div>

        {/* Cuadrícula de 4 Fotos Publicitarias (Proporción 3:4) */}
        {/* En Móvil: Cuadrícula simétrica 2x2. En Escritorio: Fila de 4 columnas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-10 sm:mb-14">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver publicación en Instagram de ${post.alt}`}
              className="group relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#D89BA3]/60 shadow-xl transition-all duration-300 cursor-pointer"
            >
              <Image
                src={post.imageUrl}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Overlay suave al interactuar */}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 fill-none stroke-current stroke-2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-white drop-shadow-md">
                  Ver en Instagram ↗
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Botón de Llamada a la Acción Principal */}
        <div className="text-center max-w-sm mx-auto">
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-white shadow-xl transition-all duration-300 active:scale-98 cursor-pointer bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:brightness-110"
          >
            {/* Ícono de Instagram SVG */}
            <svg
              className="w-4 h-4 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>Seguir a @diamott_beauty</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-90" />
          </a>
        </div>
      </div>
    </section>
  );
}
