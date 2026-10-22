"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";
import TermsModal from "./TermsModal";

export default function Footer() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="w-full bg-[#FAFAFA] border-t border-neutral-200/70 pt-14 pb-10 text-neutral-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-neutral-200/60">
            {/* Identidad de Marca Tipográfica */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
              <span className="font-playfair font-bold text-2xl tracking-widest text-neutral-900 uppercase">
                DI&apos;AMOTT
              </span>
              <span className="text-[9px] tracking-[0.25em] text-neutral-500 uppercase font-medium">
                BEAUTY & ACCESSORIES
              </span>
              <p className="text-xs text-neutral-500 max-w-xs leading-relaxed font-light pt-2">
                Cosméticos de excelente calidad, cuidado personal, fragancias y accesorios. Resalta tu belleza con la curaduría de Jeniffer Motato.
              </p>
            </div>

            {/* Enlaces de Exploración */}
            <div className="flex flex-col items-center text-center space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-1">
                Explorar
              </h4>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs lowercase text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contacto y Redes */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                Atención Directa
              </h4>
              <div className="flex items-center space-x-3">
                {/* Instagram Icon SVG */}
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors"
                  aria-label="Instagram oficial"
                >
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
                </a>

                {/* WhatsApp Icon SVG */}
                <a
                  href="https://wa.me/573170593785"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors"
                  aria-label="WhatsApp de atención"
                >
                  <svg
                    className="w-4 h-4 fill-none stroke-current stroke-2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-light">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compras personalizadas vía WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Créditos, Copyright y Términos */}
          <div className="pt-8 flex flex-col items-center justify-center space-y-2.5 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-neutral-500">
              <span>© {new Date().getFullYear()} Di&apos;amott. Todos los derechos reservados.</span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="underline underline-offset-4 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                Términos, Condiciones y Política de Privacidad
              </button>
            </div>
            <p className="text-xs text-neutral-500 font-light">
              Desarrollado por{" "}
              <a
                href="https://instagram.com/juanpablohernandezz_?rpxt=MXRjaWU5eGYxMnB3bw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-neutral-900 hover:text-black underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition-colors"
              >
                Juan Pablo Hernández
              </a>
            </p>
          </div>
        </div>
      </footer>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
}
