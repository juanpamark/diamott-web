import Image from "next/image";

interface CategoryHeroProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
}

export default function CategoryHero({
  title,
  subtitle,
  imageUrl,
}: CategoryHeroProps) {
  return (
    <div className="relative w-full h-56 sm:h-72 md:h-80 flex items-center justify-center overflow-hidden bg-neutral-900 text-white">
      {/* Imagen de fondo */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-80"
      />

      {/* Overlay oscuro para contraste y elegancia */}
      <div className="absolute inset-0 bg-black/45 backdrop-contrast-105" />

      {/* Contenido centrado */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#E8C5C8] block mb-2">
          Colección Di&apos;amott
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-widest uppercase text-white drop-shadow-md">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-xs sm:text-sm text-neutral-200 font-light tracking-wide max-w-md mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
