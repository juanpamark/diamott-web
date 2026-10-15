import HeroVideo from "@/components/home/HeroVideo";
import MarqueeTicker from "@/components/home/MarqueeTicker";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import MiniCatalog from "@/components/home/MiniCatalog";
import SpecialOrder from "@/components/shared/SpecialOrder";
import AboutFounder from "@/components/home/AboutFounder";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* Sección 1: Hero Video & SEO */}
      <HeroVideo />

      {/* Sección 2: Cinta Dinámica / Marquee */}
      <MarqueeTicker />

      {/* Sección 3: Categorías - "Compra por categoría" (id="categorias") */}
      <CategoriesGrid />

      {/* Sección 4: Mini Catálogo - "Los más deseados" (datos reales del CSV) */}
      <MiniCatalog />

      {/* Componente Reutilizable: Encarga tu producto */}
      <SpecialOrder />

      {/* Sección 5: Sobre Nosotros - Presentación Jennifer Motato */}
      <AboutFounder />
    </div>
  );
}
