import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CatalogProvider } from "@/context/CatalogContext";
import { CartProvider } from "@/context/CartContext";
import ProductQuickViewModal from "@/components/product/ProductQuickViewModal";
import CartDrawer from "@/components/cart/CartDrawer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://diamott.com"),
  title: {
    default: "Di'amott | Beauty and Accessories",
    template: "%s | Di'amott",
  },
  description:
    "E-commerce exclusivo de cosméticos premium, maquillaje de alta definición, skincare y accesorios de estilo. Calidad de estudio profesional y atención personalizada por WhatsApp.",
  keywords: [
    "Di'amott",
    "maquillaje premium",
    "cosméticos de alta gama",
    "skincare profesional",
    "bolsos",
    "accesorios",
    "Jennifer Motato",
    "beauty and accessories",
  ],
  authors: [{ name: "Jennifer Motato" }, { name: "Juan Pablo Hernández" }],
  creator: "Di'amott",
  openGraph: {
    title: "Di'amott | Beauty and Accessories",
    description:
      "E-commerce exclusivo de cosméticos premium, maquillaje de alta definición, skincare y accesorios de estilo. Calidad de estudio profesional.",
    url: "https://diamott.com",
    siteName: "Di'amott",
    images: [
      {
        url: "https://res.cloudinary.com/xdjdubsz/image/upload/v1792027702/di_amott_3.png",
        width: 800,
        height: 800,
        alt: "Di'amott Logo",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Di'amott | Beauty and Accessories",
    description:
      "E-commerce exclusivo de cosméticos premium, maquillaje de alta definición, skincare y accesorios de estilo.",
    images: [
      "https://res.cloudinary.com/xdjdubsz/image/upload/v1792027702/di_amott_3.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-white text-[#1C1C1C] font-sans antialiased selection:bg-[#E8C5C8] selection:text-neutral-900">
        <CatalogProvider>
          <CartProvider>
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
            <ProductQuickViewModal />
            <CartDrawer />
          </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
