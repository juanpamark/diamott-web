"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Award, Phone, Mail } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

const DEFAULT_FOUNDER_IMAGE = optimizeCloudinaryUrl(
  "https://res.cloudinary.com/xdjdubsz/image/upload/v1792197616/WhatsApp_Image_2026-10-15_at_16.43.45_1.jpg"
);

export default function AboutFounder() {
  const { creatorImageUrl } = useCatalog();
  const [imgError, setImgError] = useState(false);

  const imgSrc = !imgError && creatorImageUrl ? creatorImageUrl : DEFAULT_FOUNDER_IMAGE;

  return (
    <section id="nosotros" className="w-full bg-[#FAFAFA] py-16 sm:py-24 border-t border-neutral-100 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Fotografía / Retrato */}
          <div className="relative aspect-[4/5] max-w-sm mx-auto md:max-w-none w-full rounded-2xl overflow-hidden shadow-lg border border-neutral-200/60">
            <Image
              src={imgSrc}
              alt="Jeniffer Motato - Fundadora de Di'amott"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white p-2">
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#E8C5C8]">
                Fundadora & Makeup Artist
              </span>
              <p className="text-base font-medium">Jeniffer Motato</p>
            </div>
          </div>

          {/* Biografía / Conexión Emocional */}
          <div className="flex flex-col justify-center text-center md:text-left space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-600 text-xs tracking-wider uppercase mx-auto md:mx-0 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#D89BA3]" />
              <span>Conoce a la creadora</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900 leading-tight">
              Pasión por el arte del maquillaje y el cuidado personal
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              Detrás de <strong className="font-semibold text-neutral-900">Di&apos;amott</strong> se encuentra{" "}
              <strong className="font-semibold text-neutral-900">Jeniffer Motato</strong>, una apasionada de la belleza y futura maquilladora profesional, cuya misión es acercar productos de excelente calidad, fórmulas confiables y técnicas prácticas a tu rutina diaria.
            </p>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              Cada cosmético, bolso, fragancia y accesorio de nuestro catálogo pasa por un riguroso criterio de selección: calidad comprobada, estética impecable y precios accesibles que te hacen sentir segura, radiante y auténtica en cada momento.
            </p>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-6 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D89BA3]" />
                <span>Asesoría personalizada</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D89BA3]" />
                <span>Productos garantizados</span>
              </div>
            </div>

            {/* Datos oficiales de contacto (informativo, texto plano, sin enlaces) */}
            <div className="mt-4 pt-6 border-t border-neutral-200/70">
              <p className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 mb-3 text-center md:text-left">
                Canales oficiales de atención
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-xs text-neutral-600 select-all">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>317 059 3785</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>diamott.beauty@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-neutral-400 fill-none stroke-current stroke-2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>@diamott_beauty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
