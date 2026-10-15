import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center px-4 py-20 text-center bg-white">
      <div className="max-w-md mx-auto space-y-6">
        {/* Badge de marca */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF3F4] text-[#B8707A] text-[11px] font-semibold tracking-widest uppercase border border-[#F2D8DB]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Error 404</span>
        </div>

        {/* Título de la marca */}
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold tracking-widest text-neutral-900 uppercase">
          DI&apos;AMOTT
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-light text-neutral-800 tracking-tight">
            Página no encontrada
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-sm mx-auto leading-relaxed">
            Lo sentimos, la página que buscas no existe o ha sido movida. Te invitamos a explorar nuestras colecciones exclusivas.
          </p>
        </div>

        {/* Botones minimalistas de retorno */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-7 py-3 text-xs font-semibold tracking-widest uppercase bg-neutral-900 text-white rounded-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Inicio</span>
          </Link>

          <Link
            href="/#categorias"
            className="w-full sm:w-auto px-7 py-3 text-xs font-semibold tracking-widest uppercase bg-transparent text-neutral-900 border border-neutral-300 rounded-sm hover:border-neutral-900 transition-all flex items-center justify-center"
          >
            <span>Ver Catálogo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
