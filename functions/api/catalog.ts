import Papa from "papaparse";

interface Env {
  SHEETS_CSV_URL?: string;
}

const DEFAULT_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm6VelNXSvA07xJ_p4nYWfc_GHHpBtKuE7UfiQAJCbBWrCYiLVdC49V9e9n0zb6ULapqOrTuP4b9AZ/pub?output=csv";

function cleanText(input: unknown): string {
  if (!input) return "";
  return String(input)
    .replace(/[<>]/g, "")
    .trim();
}

function parseBoolean(val: unknown): boolean {
  if (typeof val === "boolean") return val;
  if (!val) return false;
  const str = String(val).trim().toLowerCase();
  return (
    str === "sí" ||
    str === "si" ||
    str === "true" ||
    str === "1" ||
    str === "yes" ||
    str === "activo"
  );
}

function parseAvailability(val: unknown): boolean {
  if (val === undefined || val === null) return true;
  const str = String(val).trim().toLowerCase();
  if (str === "" || str === "sí" || str === "si" || str === "true" || str === "1") return true;
  if (str === "no" || str === "false" || str === "0" || str === "agotado") return false;
  return true;
}

function formatCurrencyCop(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function optimizeCloudinary(url: string | undefined): string {
  if (!url || typeof url !== "string") return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url;
  if (url.includes("f_auto") || url.includes("q_auto")) return url;
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const sheetUrl = context.env?.SHEETS_CSV_URL || DEFAULT_SHEET_URL;

  try {
    const res = await fetch(sheetUrl, {
      headers: {
        Accept: "text/csv, text/plain, */*",
      },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Google Sheets devolvió status ${res.status}` }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }

    const csvText = await res.text();
    const results = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: "greedy",
      dynamicTyping: false,
      transformHeader: (header: string) =>
        header
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, "_")
          .trim(),
    });

    // 1. Identificar fila de configuración de la creadora si existe
    const creatorRow = results.data.find(
      (row) =>
        cleanText(row.id).toLowerCase() === "config_creadora" ||
        cleanText(row.pagina).toLowerCase() === "config"
    );
    const rawCreatorImg = cleanText(
      creatorRow?.imagen_principal_url || creatorRow?.imagen_url
    );
    const creatorImageUrl =
      rawCreatorImg.startsWith("http://") || rawCreatorImg.startsWith("https://")
        ? optimizeCloudinary(rawCreatorImg)
        : null;

    // 2. Filtrar y sanitizar productos públicos (descartando cualquier columna privada o sensible)
    const products = results.data
      .filter((row) => {
        if (!row.id || !row.nombre_producto) return false;
        if (
          cleanText(row.id).toLowerCase() === "config_creadora" ||
          cleanText(row.pagina).toLowerCase() === "config"
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

        const rawMain = cleanText(row.imagen_principal_url || row.imagen_url);
        const isMainValid = rawMain.startsWith("http://") || rawMain.startsWith("https://");
        const mainImageUrl = isMainValid ? optimizeCloudinary(rawMain) : "";

        const rawSec = cleanText(row.imagen_secundaria_url);
        const isSecValid = rawSec.startsWith("http://") || rawSec.startsWith("https://");
        const secondaryImageUrl = isSecValid ? optimizeCloudinary(rawSec) : undefined;

        return {
          id: cleanText(row.id) || `prod-${index}`,
          nombre_producto: cleanText(row.nombre_producto),
          pagina: cleanText(row.pagina),
          subcategoria: cleanText(row.subcategoria),
          precio: numericPrice,
          precioFormateado: formatCurrencyCop(numericPrice),
          calificacion: numericRating,
          numero_resenas: numericReviews,
          imagen_principal_url: mainImageUrl,
          imagen_secundaria_url: secondaryImageUrl,
          imagen_url: mainImageUrl,
          descripcion_corta: cleanText(row.descripcion_corta),
          disponible: true,
          es_nuevo: parseBoolean(row.es_nuevo),
          es_mas_vendido: parseBoolean(row.es_mas_vendido),
          es_promocion_banner: parseBoolean(row.es_promocion_banner),
        };
      });

    return new Response(JSON.stringify({ products, creatorImageUrl }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // Cachear en Edge CDN de Cloudflare durante 10 minutos (600s)
        "Cache-Control": "public, max-age=600, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno al procesar catálogo";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
