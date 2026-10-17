"use client";

import { Sparkles, Gift, Zap, Heart, ExternalLink } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function InstagramCommunitySection() {
  const benefits = [
    {
      icon: Gift,
      title: "Descuentos Ocultos",
      desc: "Códigos promocionales secretos en Stories y flash sales de fin de semana exclusivos para nuestra comunidad.",
    },
    {
      icon: Zap,
      title: "Acceso Prioritario",
      desc: "Aparta antes que nadie los nuevos lotes, tonos limitados y bolsos de edición especial antes de que se agoten.",
    },
    {
      icon: Heart,
      title: "Tips & Masterclasses",
      desc: "Aprende técnicas profesionales, combinaciones de tonos y rutinas de cuidado personal impartidas por Jeniffer Motato.",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-[#2B0C2D] via-[#220824] to-[#1A051B] border-y border-[#421446] py-16 sm:py-24 relative overflow-hidden text-white">
      {/* Resplandores decorativos de fondo con tonos Instagram / Champagne */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D89BA3]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#FD1D1D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera Principal */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#E8C5C8] text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E8C5C8]" />
            <span>Comunidad Exclusiva VIP</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
            Síguenos en Instagram
          </h2>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-sm sm:text-base font-semibold tracking-wider text-[#E8C5C8] bg-white/10 px-4 py-1 rounded-full border border-white/15 backdrop-blur-xs">
              @diamott_beauty
            </span>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-xl mx-auto">
            Sé parte de nuestro círculo íntimo de belleza. Al seguirnos en Instagram desbloqueas beneficios, promociones relámpago y regalos que no publicamos en ningún otro canal.
          </p>
        </div>

        {/* Tarjetas de Beneficios por Seguir */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto mb-12 sm:mb-16">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-2xl p-6 sm:p-7 shadow-xl transition-all duration-300 text-center md:text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[#E8C5C8] mb-5 mx-auto md:mx-0 shadow-inner group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold tracking-wide text-white mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                    {b.desc}
                  </p>
                </div>
                <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-center md:justify-start gap-1 text-[10px] uppercase tracking-wider text-[#E8C5C8] font-semibold">
                  <span>Beneficio activo</span>
                  <span>✦</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón de Llamada a la Acción Principal */}
        <div className="text-center max-w-md mx-auto space-y-3">
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-sm text-xs sm:text-sm font-bold tracking-widest uppercase text-white shadow-2xl transition-all duration-300 active:scale-98 cursor-pointer bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:brightness-110"
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

          <p className="text-[11px] text-neutral-400 font-light">
            Únete hoy y no te pierdas la próxima venta privada en Stories.
          </p>
        </div>
      </div>
    </section>
  );
}
