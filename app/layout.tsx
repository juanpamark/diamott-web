import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CatalogProvider } from "@/context/CatalogContext";
import { CartProvider } from "@/context/CartContext";
import ProductQuickViewModal from "@/components/product/ProductQuickViewModal";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppFloatingButton from "@/components/shared/WhatsAppFloatingButton";

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
    "Cosméticos de excelente calidad, maquillaje, cuidado personal, fragancias y accesorios de estilo. Atención personalizada y envíos a todo el país.",
  keywords: [
    "Di'amott",
    "maquillaje",
    "cuidado personal",
    "fragancias",
    "bolsos",
    "accesorios",
    "Jeniffer Motato",
    "beauty and accessories",
  ],
  authors: [{ name: "Jeniffer Motato" }, { name: "Juan Pablo Hernández" }],
  creator: "Di'amott",
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/xdjdubsz/image/upload/v1792697255/clogodia.png",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "https://res.cloudinary.com/xdjdubsz/image/upload/v1792697255/clogodia.png",
        sizes: "180x180",
      },
    ],
    shortcut: "https://res.cloudinary.com/xdjdubsz/image/upload/v1792697255/clogodia.png",
  },
  openGraph: {
    title: "Di'amott | Beauty and Accessories",
    description:
      "Cosméticos de excelente calidad, maquillaje, cuidado personal, fragancias y accesorios de estilo.",
    url: "https://diamott.com",
    siteName: "Di'amott",
    images: [
      {
        url: "https://res.cloudinary.com/xdjdubsz/image/upload/e_trim/v1792191401/Dise%C3%B1o_sin_t%C3%ADtulo.png",
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
      "Cosméticos de excelente calidad, maquillaje, cuidado personal, fragancias y accesorios de estilo.",
    images: [
      "https://res.cloudinary.com/xdjdubsz/image/upload/e_trim/v1792191401/Dise%C3%B1o_sin_t%C3%ADtulo.png",
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
      data-scroll-behavior="smooth"
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
            <WhatsAppFloatingButton />
          </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
