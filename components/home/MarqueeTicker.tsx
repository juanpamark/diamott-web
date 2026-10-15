export default function MarqueeTicker() {
  const tickerItem = "DI´AMOTT ✦ MAKEUP ✦ BOLSOS ✦ SKINCARE ✦ ACCESORIOS ✦ ";
  // Repetimos varias veces para garantizar continuidad en cualquier ancho de pantalla
  const items = Array(8).fill(tickerItem);

  return (
    <section
      className="w-full h-11 sm:h-12 bg-[#D89BA3] text-white flex items-center overflow-hidden select-none border-y border-[#d18e97]"
      aria-label="Cinta destacada"
    >
      <div className="animate-marquee whitespace-nowrap">
        {items.map((text, idx) => (
          <span
            key={idx}
            className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase px-3"
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
