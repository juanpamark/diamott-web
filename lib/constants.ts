export const BRAND = {
  name: "Di'amott",
  domain: "diamott.com",
  instagramUrl: "https://www.instagram.com/diamott_beauty?xtok=MXhvdXo0aGFlNGNydw==",
  officialLogoUrl: "https://res.cloudinary.com/xdjdubsz/image/upload/e_trim/v1792191401/Dise%C3%B1o_sin_t%C3%ADtulo.png",
  fallbackImageUrl: "https://res.cloudinary.com/xdjdubsz/image/upload/v1792027702/di_amott_3.png",
  heroVideoUrl: "https://res.cloudinary.com/xdjdubsz/video/upload/v1792198504/hero2.mp4",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+573170593785",
  whatsappCheckoutUrl: "https://wa.me/573170593785",
  sheetsCsvUrl:
    process.env.NEXT_PUBLIC_SHEETS_CSV_URL ||
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm6VelNXSvA07xJ_p4nYWfc_GHHpBtKuE7UfiQAJCbBWrCYiLVdC49V9e9n0zb6ULapqOrTuP4b9AZ/pub?output=csv",
  heroSheetsCsvUrl:
    process.env.NEXT_PUBLIC_SHEETS_HERO_CSV_URL ||
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm6VelNXSvA07xJ_p4nYWfc_GHHpBtKuE7UfiQAJCbBWrCYiLVdC49V9e9n0zb6ULapqOrTuP4b9AZ/pub?gid=95694404&single=true&output=csv",
};

export interface HeroConfig {
  activo: boolean;
  tipo_fondo: "video" | "imagen";
  media_url: string;
  titulo: string;
  subtitulo: string;
  texto_boton: string;
  enlace_boton: string;
}

export interface Product {
  id: string;
  nombre_producto: string;
  pagina: string;
  subcategoria: string;
  precio: number;
  precioFormateado: string;
  calificacion: number;
  numero_resenas: number;
  imagen_principal_url: string;
  imagen_secundaria_url?: string;
  imagen_url: string; // retrocompatibilidad con componentes existentes
  descripcion_corta?: string;
  disponible: boolean;
  es_nuevo: boolean;
  es_mas_vendido: boolean;
  es_promocion_banner: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutCustomerData {
  nombre?: string;
  direccionCiudad?: string;
  metodoPago: "Nequi" | "Daviplata" | "Bancolombia" | string;
}

export interface NavLinkItem {
  label: string;
  href: string;
  isDropdown?: boolean;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "inicio", href: "/" },
  { label: "nuevo", href: "/#nuevos" },
  { label: "más vendidos", href: "/mas-vendidos" },
  { label: "categorías", href: "/#categorias", isDropdown: true },
  { label: "maquillaje", href: "/maquillaje" },
  { label: "¿no lo ves? pídelo aquí", href: "/#encargar" },
  { label: "nosotros", href: "/#nosotros" },
];

export const CATEGORIES = [
  {
    id: "maquillaje",
    name: "Maquillaje",
    href: "/maquillaje",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop",
    subtitle: "Rostro, labios, ojos y cejas con acabados profesionales",
  },
  {
    id: "cuidado-personal",
    name: "Cuidado personal",
    href: "/cuidado-personal",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=900&auto=format&fit=crop",
    subtitle: "Facial, corporal, capilar, fragancias y splashes",
  },
  {
    id: "accesorios",
    name: "Accesorios",
    href: "/accesorios",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=900&auto=format&fit=crop",
    subtitle: "Aretes, cadenas, pulseras y detalles que transforman tu look",
  },
  {
    id: "bolsos",
    name: "Bolsos",
    href: "/bolsos",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
    subtitle: "Diseños versátiles, estilo y acabados modernos",
  },
];
