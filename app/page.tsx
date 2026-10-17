import HeroVideo from "@/components/home/HeroVideo";
import MarqueeTicker from "@/components/home/MarqueeTicker";
import PromoBannerSection from "@/components/home/PromoBannerSection";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import SpecialOrder from "@/components/shared/SpecialOrder";
import InstagramCommunitySection from "@/components/home/InstagramCommunitySection";
import AboutFounder from "@/components/home/AboutFounder";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* Sección 1: Hero Video de Alto Impacto */}
      <HeroVideo />

      {/* Sección 2: Cinta Morada / Marquee con todas las categorías */}
      <MarqueeTicker />

      {/* Sección 3: Los Imperdibles (3 destacados en PC / Rotación 5s en Móvil) */}
      <PromoBannerSection />

      {/* Sección 4: Nuevos Lanzamientos (Carrusel Infinito / Cuadrícula) */}
      <NewArrivalsSection />

      {/* Sección 5: Compra por Categoría (6 colecciones oficiales) */}
      <CategoriesGrid />

      {/* Sección 6: Encarga tu Producto (con nueva imagen y formulario) */}
      <SpecialOrder />

      {/* Sección 7: Comunidad VIP en Instagram (@diamott_beauty) */}
      <InstagramCommunitySection />

      {/* Sección 8: Conoce a la Creadora (Jeniffer Motato) */}
      <AboutFounder />
    </div>
  );
}
