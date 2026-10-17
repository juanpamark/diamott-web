"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import Papa from "papaparse";
import { BRAND, Product } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";

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
  selectedProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  creatorImageUrl: string | null;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export { formatCurrency as formatPrice };

// Sanitizador básico contra inyección XSS
function sanitizeText(input: string | undefined): string {
  if (!input) return "";
  return String(input)
    .replace(/[<>]/g, "")
    .trim();
}

function checkBool(val: string | boolean | undefined): boolean {
  if (typeof val === "boolean") return val;
  const s = String(val ?? "").trim().toUpperCase();
  return s === "SÍ" || s === "SI" || s === "TRUE" || s === "1";
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [creatorImageUrl, setCreatorImageUrl] = useState<string | null>(null);
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
          skipEmptyLines: true,
          dynamicTyping: false,
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

                  const disponibleStr = String(row.disponible ?? "").trim().toUpperCase();
                  const isAvailable =
                    disponibleStr === "TRUE" ||
                    disponibleStr === "1" ||
                    disponibleStr === "SI" ||
                    disponibleStr === "SÍ" ||
                    row.disponible === true;
                  return isAvailable;
                })
                .map((row, index) => {
                  // Precios: descartar decimales si vienen como 35000.00
                  const rawPriceStr = String(row.precio ?? "0").trim();
                  const withoutDecimals = rawPriceStr.replace(/[.,]\d{2}$/, "");
                  const cleanDigits = withoutDecimals.replace(/[^0-9]/g, "");
                  const numericPrice = parseInt(cleanDigits, 10) || 0;

                  const numericRating = Math.min(
                    5,
                    Math.max(1, parseInt(String(row.calificacion ?? "5"), 10) || 5)
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
                    es_nuevo: checkBool(row.es_nuevo),
                    es_mas_vendido: checkBool(row.es_mas_vendido),
                    es_promocion_banner: checkBool(row.es_promocion_banner),
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
      } catch (err: unknown) {
        if (isCancelled) return;
        console.error("Error en Client-side fetch del CSV:", err);
        setError(err instanceof Error ? err.message : "Error al conectar con Google Sheets");
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [reloadTrigger]);

  const getProductsByPage = useCallback(
    (pageName: string): Product[] => {
      const target = pageName.trim().toLowerCase();
      return products.filter((p) => {
        const pPage = p.pagina.trim().toLowerCase();
        if (pPage === target) return true;
        if (
          (target === "cuidado facial" || target === "cuidado-facial" || target === "skincare") &&
          (pPage === "cuidado facial" || pPage === "skincare")
        ) {
          return true;
        }
        return false;
      });
    },
    [products]
  );

  const newProducts = useMemo(
    () => products.filter((p) => p.es_nuevo),
    [products]
  );

  const bestSellerProducts = useMemo(
    () => products.filter((p) => p.es_mas_vendido),
    [products]
  );

  const promoProduct = useMemo(
    () => products.find((p) => p.es_promocion_banner) || null,
    [products]
  );

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
        selectedProduct,
        openQuickView,
        closeQuickView,
        creatorImageUrl,
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
