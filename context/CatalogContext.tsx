"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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
  imagen_url?: string;
  disponible?: string | boolean;
}

interface CatalogContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refreshCatalog: () => void;
  getProductsByPage: (pageName: string) => Product[];
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
              const rawCreatorImg = sanitizeText(creatorRow?.imagen_url);
              if (rawCreatorImg.startsWith("http://") || rawCreatorImg.startsWith("https://")) {
                setCreatorImageUrl(rawCreatorImg);
              } else {
                setCreatorImageUrl(null);
              }

              const parsedProducts: Product[] = results.data
                .filter((row) => {
                  if (!row.id || !row.nombre_producto) return false;

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
                  // Si viene con decimales como 35000.00 o $ 35.000,00 descartamos los 2 decimales finales para evitar inflar el precio
                  const rawPriceStr = String(row.precio ?? "0").trim();
                  const withoutDecimals = rawPriceStr.replace(/[.,]\d{2}$/, "");
                  const cleanDigits = withoutDecimals.replace(/[^0-9]/g, "");
                  const numericPrice = parseInt(cleanDigits, 10) || 0;

                  const numericRating = Math.min(
                    5,
                    Math.max(1, parseInt(String(row.calificacion ?? "5"), 10) || 5)
                  );

                  const numericReviews = parseInt(String(row.numero_resenas ?? "0"), 10) || 0;

                  const rawImageUrl = sanitizeText(row.imagen_url);
                  const isValidUrl =
                    rawImageUrl.startsWith("http://") || rawImageUrl.startsWith("https://");
                  const safeImageUrl = isValidUrl ? rawImageUrl : BRAND.fallbackImageUrl;

                  return {
                    id: sanitizeText(row.id) || `prod-${index}`,
                    nombre_producto: sanitizeText(row.nombre_producto),
                    pagina: sanitizeText(row.pagina),
                    subcategoria: sanitizeText(row.subcategoria),
                    precio: numericPrice,
                    precioFormateado: formatCurrency(numericPrice),
                    calificacion: numericRating,
                    numero_resenas: numericReviews,
                    imagen_url: safeImageUrl,
                    disponible: true,
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
      const normalizedTarget = pageName.trim().toLowerCase();
      return products.filter(
        (p) => p.pagina.trim().toLowerCase() === normalizedTarget
      );
    },
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
