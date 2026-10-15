export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center py-24 bg-white text-neutral-800">
      <div className="relative flex items-center justify-center">
        {/* Spinner elegante con el color de acento #D89BA3 */}
        <div className="w-12 h-12 rounded-full border-2 border-neutral-100 border-t-[#D89BA3] animate-spin" />
        <div className="absolute w-6 h-6 rounded-full bg-[#FAF3F4] animate-pulse" />
      </div>

      <div className="mt-6 text-center space-y-1">
        <p className="font-playfair text-lg font-bold tracking-widest text-neutral-900 uppercase">
          DI&apos;AMOTT
        </p>
        <p className="text-xs font-light tracking-[0.2em] uppercase text-neutral-500">
          Cargando colecciones...
        </p>
      </div>
    </div>
  );
}
