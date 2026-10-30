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
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

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

const CATALOG_STORAGE_KEY = "diamott_catalog_cache_v2";
const HERO_STORAGE_KEY = "diamott_hero_cache_v2";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos de caché local

interface CatalogCachePayload {
  timestamp: number;
  products: Product[];
  creatorImageUrl: string | null;
}

interface HeroCachePayload {
  timestamp: number;
  heroSlides: HeroConfig[];
  heroConfig: HeroConfig;
}

function readCatalogCache(): CatalogCachePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) return null;
    const parsed: CatalogCachePayload = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.products) && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed;
    }
  } catch {
    // Silencioso
  }
  return null;
}

function readHeroCache(): HeroCachePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(HERO_STORAGE_KEY);
    if (!raw) return null;
    const parsed: HeroCachePayload = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.heroSlides) && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed;
    }
  } catch {
    // Silencioso
  }
  return null;
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  // Inicialización perezosa desde caché de sessionStorage para 0ms de espera y cero parpadeo
  const initialCatalog = readCatalogCache();
  const initialHero = readHeroCache();

  const [products, setProducts] = useState<Product[]>(() => initialCatalog?.products || []);
  const [creatorImageUrl, setCreatorImageUrl] = useState<string | null>(
    () => initialCatalog?.creatorImageUrl || null
  );
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(
    () => initialHero?.heroConfig || DEFAULT_HERO_CONFIG
  );
  const [heroSlides, setHeroSlides] = useState<HeroConfig[]>(() => initialHero?.heroSlides || []);
  const [isHeroLoading, setIsHeroLoading] = useState<boolean>(() => !initialHero);
  const [isLoading, setIsLoading] = useState<boolean>(() => !initialCatalog);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const refreshCatalog = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(CATALOG_STORAGE_KEY);
        sessionStorage.removeItem(HERO_STORAGE_KEY);
      } catch {
        // Silencioso
      }
    }
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function fetchCatalogData() {
      // 1. Si ya tenemos caché válida y no es un refresco manual deliberado, no hacer fetch
      const cachedCatalog = readCatalogCache();
      if (cachedCatalog && reloadTrigger === 0) {
        setProducts(cachedCatalog.products);
        setCreatorImageUrl(cachedCatalog.creatorImageUrl);
        setIsLoading(false);
        return;
      }

      try {
        let catalogData: { products: Product[]; creatorImageUrl: string | null } | null = null;

        // Intentar primero el endpoint de Edge / Cloudflare Pages Functions (/api/catalog)
        try {
          const apiRes = await fetch("/api/catalog");
          if (apiRes.ok) {
            const json = await apiRes.json();
            if (json && Array.isArray(json.products)) {
              catalogData = {
                products: json.products,
                creatorImageUrl: json.creatorImageUrl || null,
              };
            }
          }
        } catch {
          // Fallback en desarrollo local sin Cloudflare Functions
        }

        // Si el endpoint de API no está activo (ej. dev local), fallback a Google Sheets CSV directo
        if (!catalogData) {
          const response = await fetch(BRAND.sheetsCsvUrl);
          if (!response.ok) {
            throw new Error(`Error al descargar el catálogo CSV (${response.status})`);
          }

          const csvText = await response.text();
          if (isCancelled) return;

          const results = Papa.parse<RawProductRow>(csvText, {
            header: true,
            skipEmptyLines: "greedy",
            dynamicTyping: false,
            transformHeader: (header: string) =>
              normalizeCleanText(header).toLowerCase().replace(/\s+/g, "_"),
            transform: (val: string) => (typeof val === "string" ? val.trim() : val),
          });

          const creatorRow = results.data.find(
            (row) =>
              sanitizeText(row.id).toLowerCase() === "config_creadora" ||
              sanitizeText(row.pagina).toLowerCase() === "config"
          );
          const rawCreatorImg = sanitizeText(
            creatorRow?.imagen_principal_url || creatorRow?.imagen_url
          );
          const cImg =
            rawCreatorImg.startsWith("http://") || rawCreatorImg.startsWith("https://")
              ? optimizeCloudinaryUrl(rawCreatorImg)
              : null;

          const parsedProducts: Product[] = results.data
            .filter((row) => {
              if (!row.id || !row.nombre_producto) return false;
              if (
                sanitizeText(row.id).toLowerCase() === "config_creadora" ||
                sanitizeText(row.pagina).toLowerCase() === "config"
              ) {
                return false;
              }
              return parseAvailability(row.disponible);
            })
            .map((row, index) => {
              const rawPriceStr = String(row.precio ?? "0").trim();
              const withoutDecimals = rawPriceStr.replace(/[.,]\d{2}$/, "");
              const cleanDigits = withoutDecimals.replace(/[^0-9]/g, "");
              const numericPrice = parseInt(cleanDigits, 10) || 0;

              const rawRating = parseFloat(String(row.calificacion ?? "5").replace(",", "."));
              const numericRating = Math.min(5, Math.max(1, isNaN(rawRating) ? 5 : rawRating));
              const numericReviews = parseInt(String(row.numero_resenas ?? "0"), 10) || 0;

              const rawMainImg = sanitizeText(row.imagen_principal_url || row.imagen_url);
              const isMainValid =
                rawMainImg.startsWith("http://") || rawMainImg.startsWith("https://");
              const mainImageUrl = isMainValid
                ? optimizeCloudinaryUrl(rawMainImg)
                : BRAND.fallbackImageUrl;

              const rawSecImg = sanitizeText(row.imagen_secundaria_url);
              const isSecValid =
                rawSecImg.startsWith("http://") || rawSecImg.startsWith("https://");
              const secondaryImageUrl = isSecValid
                ? optimizeCloudinaryUrl(rawSecImg)
                : undefined;

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

          catalogData = { products: parsedProducts, creatorImageUrl: cImg };
        }

        if (isCancelled || !catalogData) return;

        setProducts(catalogData.products);
        setCreatorImageUrl(catalogData.creatorImageUrl);
        setError(null);
        setIsLoading(false);

        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(
              CATALOG_STORAGE_KEY,
              JSON.stringify({
                timestamp: Date.now(),
                products: catalogData.products,
                creatorImageUrl: catalogData.creatorImageUrl,
              })
            );
          } catch {
            // Silencioso
          }
        }
      } catch (err: unknown) {
        if (isCancelled) return;
        console.error("Error al cargar inventario:", err);
        setError(err instanceof Error ? err.message : "Error al conectar con Google Sheets");
        setIsLoading(false);
      }
    }

    async function fetchHeroData() {
      const cachedHero = readHeroCache();
      if (cachedHero && reloadTrigger === 0) {
        setHeroSlides(cachedHero.heroSlides);
        setHeroConfig(cachedHero.heroConfig);
        setIsHeroLoading(false);
        return;
      }

      try {
        let heroData: { heroSlides: HeroConfig[]; heroConfig: HeroConfig } | null = null;

        // Intentar primero el endpoint de Edge (/api/hero)
        try {
          const heroApiRes = await fetch("/api/hero");
          if (heroApiRes.ok) {
            const json = await heroApiRes.json();
            if (json && Array.isArray(json.heroSlides)) {
              heroData = {
                heroSlides: json.heroSlides,
                heroConfig: json.heroConfig || DEFAULT_HERO_CONFIG,
              };
            }
          }
        } catch {
          // Fallback en desarrollo local
        }

        if (!heroData) {
          const heroResponse = await fetch(BRAND.heroSheetsCsvUrl);
          if (heroResponse.ok) {
            const heroCsvText = await heroResponse.text();
            if (!isCancelled) {
              const heroResults = Papa.parse<RawHeroRow>(heroCsvText, {
                header: true,
                skipEmptyLines: "greedy",
                dynamicTyping: false,
                transformHeader: (header: string) =>
                  normalizeCleanText(header).toLowerCase().replace(/\s+/g, "_"),
                transform: (val: string) => (typeof val === "string" ? val.trim() : val),
              });

              const activeRows = (heroResults.data || []).filter(
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

                const optimizedMedia = isValidMedia
                  ? isVideo
                    ? rawMedia
                    : optimizeCloudinaryUrl(rawMedia)
                  : "";

                return {
                  activo: true,
                  tipo_fondo: (isVideo ? "video" : "imagen") as "video" | "imagen",
                  media_url: optimizedMedia,
                  titulo: sanitizeText(row.titulo) || DEFAULT_HERO_CONFIG.titulo,
                  subtitulo: sanitizeText(row.subtitulo) || DEFAULT_HERO_CONFIG.subtitulo,
                  texto_boton: sanitizeText(row.texto_boton) || DEFAULT_HERO_CONFIG.texto_boton,
                  enlace_boton: sanitizeText(row.enlace_boton) || DEFAULT_HERO_CONFIG.enlace_boton,
                };
              });

              const primaryHero = parsedSlides.length > 0 ? parsedSlides[0] : DEFAULT_HERO_CONFIG;
              heroData = {
                heroSlides: parsedSlides.length > 0 ? parsedSlides : [DEFAULT_HERO_CONFIG],
                heroConfig: primaryHero,
              };
            }
          }
        }

        if (isCancelled || !heroData) {
          setIsHeroLoading(false);
          return;
        }

        setHeroSlides(heroData.heroSlides);
        setHeroConfig(heroData.heroConfig);
        setIsHeroLoading(false);

        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(
              HERO_STORAGE_KEY,
              JSON.stringify({
                timestamp: Date.now(),
                heroSlides: heroData.heroSlides,
                heroConfig: heroData.heroConfig,
              })
            );
          } catch {
            // Silencioso
          }
        }
      } catch (heroErr) {
        console.warn("Aviso: No se pudo cargar el banner hero:", heroErr);
        setIsHeroLoading(false);
      }
    }

    fetchCatalogData();
    fetchHeroData();

    return () => {
      isCancelled = true;
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
