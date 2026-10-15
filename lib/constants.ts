export const BRAND = {
  name: "Di'amott",
  domain: "diamott.com",
  instagramUrl: "https://instagram.com/juanpablohernandezz_?rpxt=MXRjaWU5eGYxMnB3bw%3D%3D&utm_source=qr",
  officialLogoUrl: "https://res.cloudinary.com/xdjdubsz/image/upload/v1792027702/di_amott_3.png",
  fallbackImageUrl: "https://res.cloudinary.com/xdjdubsz/image/upload/v1792027702/di_amott_3.png",
  heroVideoUrl: "https://res.cloudinary.com/xdjdubsz/video/upload/v1792029359/gemini_generated_video_872ab39f.mp4",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+573170593785",
  whatsappCheckoutUrl: "https://wa.me/573170593785",
  sheetsCsvUrl:
    process.env.NEXT_PUBLIC_SHEETS_CSV_URL ||
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm6VelNXSvA07xJ_p4nYWfc_GHHpBtKuE7UfiQAJCbBWrCYiLVdC49V9e9n0zb6ULapqOrTuP4b9AZ/pub?output=csv",
};

export interface Product {
  id: string;
  nombre_producto: string;
  pagina: string;
  subcategoria: string;
  precio: number;
  precioFormateado: string;
  calificacion: number;
  numero_resenas: number;
  imagen_url: string;
  disponible: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutCustomerData {
  nombre: string;
  cedula: string;
  direccionCiudad: string;
  metodoPago: "Nequi" | "Daviplata" | "Bancolombia" | string;
}

export const NAV_LINKS = [
  { label: "inicio", href: "/" },
  { label: "maquillaje", href: "/maquillaje" },
  { label: "bolsos", href: "/bolsos" },
  { label: "skincare", href: "/skincare" },
  { label: "accesorios", href: "/accesorios" },
];

export const CATEGORIES = [
  {
    id: "maquillaje",
    name: "Maquillaje",
    href: "/maquillaje",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop",
    subtitle: "Rostro, labios, ojos y cejas de alta definición",
  },
  {
    id: "bolsos",
    name: "Bolsos",
    href: "/bolsos",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
    subtitle: "Diseños exclusivos y acabados sofisticados",
  },
  {
    id: "skincare",
    name: "Skincare",
    href: "/skincare",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=900&auto=format&fit=crop",
    subtitle: "Cuidado facial profesional y luminosidad natural",
  },
  {
    id: "accesorios",
    name: "Accesorios",
    href: "/accesorios",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=900&auto=format&fit=crop",
    subtitle: "Detalles que transforman y completan tu estilo",
  },
];
