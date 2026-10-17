export default function MarqueeTicker() {
  const tickerItem = "MAQUILLAJE • BOLSOS • CUIDADO FACIAL • ACCESORIOS • CAPILAR • MÁS VENDIDOS • ";
  // Repetimos varias veces para garantizar continuidad en cualquier ancho de pantalla
  const items = Array(8).fill(tickerItem);

  return (
    <section
      className="w-full h-11 sm:h-12 bg-[#F6D5D9] text-[#5A202A] flex items-center overflow-hidden select-none border-y border-[#EBBDC3]"
      aria-label="Cinta de categorías"
    >
      <div className="animate-marquee whitespace-nowrap">
        {items.map((text, idx) => (
          <span
            key={idx}
            className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase px-4 text-[#5A202A]"
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
