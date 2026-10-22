"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import Papa from "papaparse";
import { BRAND, Product, HeroConfig } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";

interface RawHeroRow {
  activo?: string | boolean;
  tipo_fondo?: string;
  media_url?: string;
  titulo?: string;
  subtitulo?: string;
  texto_boton?: string;
  enlace_boton?: string;
}

interface RawProductRow {
  id?: string;
  nombre_producto?: string;
  pagina?: string;
  subcategoria?: string;
  precio?: string | number;
  calificacion?: string | number;
  numero_resenas?: string | number;
  imagen_principal_url?: string;
  imagen_secundaria_url?: string;
  imagen_url?: string;
  descripcion_corta?: string;
  disponible?: string | boolean;
  es_nuevo?: string | boolean;
  es_mas_vendido?: string | boolean;
  es_promocion_banner?: string | boolean;
}

interface CatalogContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refreshCatalog: () => void;
  getProductsByPage: (pageName: string) => Product[];
  newProducts: Product[];
  bestSellerProducts: Product[];
  promoProduct: Product | null;
  featuredImperdibles: Product[];
  selectedProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  creatorImageUrl: string | null;
  heroConfig: HeroConfig;
  heroSlides: HeroConfig[];
  isHeroLoading: boolean;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export { formatCurrency as formatPrice };

import {
  normalizeCleanText,
  parseBooleanFlag,
  parseAvailability,
} from "@/lib/catalog-utils";

// Sanitizador básico contra inyección XSS
function sanitizeText(input: string | undefined): string {
  if (!input) return "";
  return String(input)
    .replace(/[<>]/g, "")
    .trim();
}

const DEFAULT_HERO_CONFIG: HeroConfig = {
  activo: true,
  tipo_fondo: "video",
  media_url: BRAND.heroVideoUrl,
  titulo: "Luce tu belleza con estilo propio",
  subtitulo: "Maquillaje, fragancias y accesorios en tendencia",
  texto_boton: "Descubre",
  enlace_boton: "/#imperdibles",
};

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [creatorImageUrl, setCreatorImageUrl] = useState<string | null>(null);
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [heroSlides, setHeroSlides] = useState<HeroConfig[]>([]);
  const [isHeroLoading, setIsHeroLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const refreshCatalog = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      try {
        const response = await fetch(`${BRAND.sheetsCsvUrl}&t=${Date.now()}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Error al descargar el catálogo CSV (${response.status})`);
        }

        const csvText = await response.text();
        if (isCancelled) return;

        Papa.parse<RawProductRow>(csvText, {
          header: true,
          skipEmptyLines: "greedy",
          dynamicTyping: false,
          // Normalizar encabezados: minúsculas, sin tildes, sin espacios para tolerancia total
          transformHeader: (header: string) => {
            return normalizeCleanText(header)
              .toLowerCase()
              .replace(/\s+/g, "_");
          },
          // Limpiar cada celda de texto
          transform: (val: string) => {
            return typeof val === "string" ? val.trim() : val;
          },
          complete: (results) => {
            if (isCancelled) return;
            try {
              // Buscar fila especial de configuración para la creadora
              const creatorRow = results.data.find(
                (row) =>
                  sanitizeText(row.id).toLowerCase() === "config_creadora" ||
                  sanitizeText(row.pagina).toLowerCase() === "config"
              );
              const rawCreatorImg = sanitizeText(
                creatorRow?.imagen_principal_url || creatorRow?.imagen_url
              );
              if (rawCreatorImg.startsWith("http://") || rawCreatorImg.startsWith("https://")) {
                setCreatorImageUrl(rawCreatorImg);
              } else {
                setCreatorImageUrl(null);
              }

              const parsedProducts: Product[] = results.data
                .filter((row) => {
                  if (!row.id || !row.nombre_producto) return false;
                  // Si es la fila de configuración de la creadora, omitirla del catálogo comercial
                  if (
                    sanitizeText(row.id).toLowerCase() === "config_creadora" ||
                    sanitizeText(row.pagina).toLowerCase() === "config"
                  ) {
                    return false;
                  }

                  // Tolerancia total a disponibilidad (disponible si SÍ o celda vacía; oculto si NO)
                  return parseAvailability(row.disponible);
                })
                .map((row, index) => {
                  // Precios: descartar decimales si vienen como 35000.00
                  const rawPriceStr = String(row.precio ?? "0").trim();
                  const withoutDecimals = rawPriceStr.replace(/[.,]\d{2}$/, "");
                  const cleanDigits = withoutDecimals.replace(/[^0-9]/g, "");
                  const numericPrice = parseInt(cleanDigits, 10) || 0;

                  // Calificación flotante (admite 4.8, 5, etc.)
                  const rawRating = parseFloat(
                    String(row.calificacion ?? "5").replace(",", ".")
                  );
                  const numericRating = Math.min(
                    5,
                    Math.max(1, isNaN(rawRating) ? 5 : rawRating)
                  );

                  const numericReviews = parseInt(String(row.numero_resenas ?? "0"), 10) || 0;

                  // Imágenes: soporte imagen_principal_url y retrocompatibilidad imagen_url
                  const rawMainImg = sanitizeText(
                    row.imagen_principal_url || row.imagen_url
                  );
                  const isMainValid =
                    rawMainImg.startsWith("http://") || rawMainImg.startsWith("https://");
                  const mainImageUrl = isMainValid ? rawMainImg : BRAND.fallbackImageUrl;

                  const rawSecImg = sanitizeText(row.imagen_secundaria_url);
                  const isSecValid =
                    rawSecImg.startsWith("http://") || rawSecImg.startsWith("https://");
                  const secondaryImageUrl = isSecValid ? rawSecImg : undefined;

                  return {
                    id: sanitizeText(row.id) || `prod-${index}`,
                    nombre_producto: sanitizeText(row.nombre_producto),
                    pagina: sanitizeText(row.pagina),
                    subcategoria: sanitizeText(row.subcategoria),
                    precio: numericPrice,
                    precioFormateado: formatCurrency(numericPrice),
                    calificacion: numericRating,
                    numero_resenas: numericReviews,
                    imagen_principal_url: mainImageUrl,
                    imagen_secundaria_url: secondaryImageUrl,
                    imagen_url: mainImageUrl,
                    descripcion_corta: sanitizeText(row.descripcion_corta),
                    disponible: true,
                    es_nuevo: parseBooleanFlag(row.es_nuevo),
                    es_mas_vendido: parseBooleanFlag(row.es_mas_vendido),
                    es_promocion_banner: parseBooleanFlag(row.es_promocion_banner),
                  };
                });

              setProducts(parsedProducts);
              setError(null);
            } catch (err) {
              console.error("Error al procesar los datos del CSV:", err);
              setError("Error al procesar el inventario");
            } finally {
              setIsLoading(false);
            }
          },
          error: (err: Error) => {
            if (isCancelled) return;
            console.error("Error en PapaParse:", err);
            setError("Error al leer el archivo de Google Sheets");
            setIsLoading(false);
          },
        });

        // Cargar configuración de Hero dinámico desde la pestaña correspondiente
        try {
          const heroResponse = await fetch(`${BRAND.heroSheetsCsvUrl}&t=${Date.now()}`, {
            cache: "no-store",
          });
          if (heroResponse.ok) {
            const heroCsvText = await heroResponse.text();
            if (!isCancelled) {
              Papa.parse<RawHeroRow>(heroCsvText, {
                header: true,
                skipEmptyLines: "greedy",
                dynamicTyping: false,
                transformHeader: (header: string) =>
                  normalizeCleanText(header).toLowerCase().replace(/\s+/g, "_"),
                transform: (val: string) => (typeof val === "string" ? val.trim() : val),
                complete: (heroResults) => {
                  if (isCancelled || !heroResults.data || heroResults.data.length === 0) {
                    setIsHeroLoading(false);
                    return;
                  }

                  // Filtrar todas las filas del CSV donde activo sea "SÍ"
                  const activeRows = heroResults.data.filter(
                    (row) => row && parseBooleanFlag(row.activo)
                  );

                  const parsedSlides: HeroConfig[] = activeRows.map((row) => {
                    const rawMedia = sanitizeText(row.media_url);
                    const isValidMedia =
                      (rawMedia.startsWith("http://") || rawMedia.startsWith("https://")) &&
                      !rawMedia.includes("[PEGAR");

                    const fondoLower = sanitizeText(row.tipo_fondo).toLowerCase();
                    const isVideo =
                      fondoLower === "video" ||
                      rawMedia.endsWith(".mp4") ||
                      rawMedia.endsWith(".webm") ||
                      rawMedia.includes("/video/");

                    return {
                      activo: true,
                      tipo_fondo: isVideo ? "video" : "imagen",
                      media_url: isValidMedia ? rawMedia : "",
                      titulo: sanitizeText(row.titulo) || DEFAULT_HERO_CONFIG.titulo,
                      subtitulo: sanitizeText(row.subtitulo) || DEFAULT_HERO_CONFIG.subtitulo,
                      texto_boton: sanitizeText(row.texto_boton) || DEFAULT_HERO_CONFIG.texto_boton,
                      enlace_boton: sanitizeText(row.enlace_boton) || DEFAULT_HERO_CONFIG.enlace_boton,
                    };
                  });

                  setHeroSlides(parsedSlides);
                  if (parsedSlides.length > 0) {
                    setHeroConfig(parsedSlides[0]);
                  }
                  setIsHeroLoading(false);
                },
              });
            }
          } else {
            setIsHeroLoading(false);
          }
        } catch (heroErr) {
          console.warn("Aviso: No se pudo cargar el CSV dinámico del hero:", heroErr);
          setIsHeroLoading(false);
        }
      } catch (err: unknown) {
        if (isCancelled) return;
        console.error("Error en Client-side fetch del CSV:", err);
        setError(err instanceof Error ? err.message : "Error al conectar con Google Sheets");
        setIsLoading(false);
      }
    }

    loadData();

    // Actualización periódica en segundo plano cada 60 segundos
    const interval = setInterval(loadData, 60000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [reloadTrigger]);

  const getProductsByPage = useCallback(
    (pageName: string): Product[] => {
      const target = normalizeCleanText(pageName).toLowerCase();
      const isPersonalCareTarget =
        target === "cuidado personal" ||
        target === "cuidado-personal" ||
        target === "cuidado facial" ||
        target === "cuidado-facial" ||
        target === "skincare";

      return products.filter((p) => {
        const pPage = normalizeCleanText(p.pagina).toLowerCase();
        if (pPage === target) return true;
        const isPersonalCarePage =
          pPage === "cuidado personal" ||
          pPage === "cuidado-personal" ||
          pPage === "cuidado facial" ||
          pPage === "cuidado-facial" ||
          pPage === "skincare" ||
          pPage === "capilar" ||
          pPage === "fragancias";
        if (isPersonalCareTarget && isPersonalCarePage) return true;
        return false;
      });
    },
    [products]
  );

  // Los productos nuevos se muestran con los más recientes al principio
  const newProducts = useMemo(
    () => [...products].filter((p) => p.es_nuevo).reverse(),
    [products]
  );

  const bestSellerProducts = useMemo(
    () => products.filter((p) => p.es_mas_vendido),
    [products]
  );

  // La promoción activa selecciona la más recientemente configurada (compatibilidad)
  const promoProduct = useMemo(
    () => [...products].reverse().find((p) => p.es_promocion_banner) || null,
    [products]
  );

  // Todos los productos de "Los Imperdibles" (marcados en Google Sheets con es_promocion_banner)
  const featuredImperdibles = useMemo(() => {
    const marked = products.filter((p) => p.es_promocion_banner);
    if (marked.length > 0) return marked;
    // Si ninguno está marcado explícitamente, tomar los más vendidos como respaldo
    return products.filter((p) => p.es_mas_vendido);
  }, [products]);

  const openQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  return (
    <CatalogContext.Provider
      value={{
        products,
        isLoading,
        error,
        refreshCatalog,
        getProductsByPage,
        newProducts,
        bestSellerProducts,
        promoProduct,
        featuredImperdibles,
        selectedProduct,
        openQuickView,
        closeQuickView,
        creatorImageUrl,
        heroConfig,
        heroSlides,
        isHeroLoading,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog debe ser usado dentro de un CatalogProvider");
  }
  return context;
}
