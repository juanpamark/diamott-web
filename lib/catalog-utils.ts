/**
 * Utilidades robustas para el catálogo y sincronización con Google Sheets.
 * Diseñadas para ser tolerantes a fallos humanos, acentos Unicode, espacios invisibles y variaciones de texto.
 */

/**
 * Normaliza un texto eliminando tildes, diacríticos y caracteres invisibles.
 */
export function normalizeCleanText(text: unknown): string {
  if (text === null || text === undefined) return "";
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remueve acentos (ej: SÍ -> SI, Á -> A)
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "") // Remueve espacios de ancho cero y NBSP
    .trim();
}

/**
 * Validador booleano ultra-robusto para Google Sheets.
 * Reconoce: SÍ, SI, Sí, sí, s, S, TRUE, true, True, 1, YES, yes, X, x, S? (corrupción de codificación).
 */
export function parseBooleanFlag(val: unknown): boolean {
  if (val === true) return true;
  if (!val) return false;
  // Limpiar diacríticos y cualquier signo de puntuación residual (? o ¿ por codificación)
  const raw = normalizeCleanText(val).toUpperCase();
  const s = raw.replace(/[^A-Z0-9]/g, "");

  if (s === "NO" || s === "FALSE" || s === "0" || s === "N") {
    return false;
  }

  return (
    s === "SI" ||
    s === "S" ||
    s === "TRUE" ||
    s === "1" ||
    s === "YES" ||
    s === "Y" ||
    s === "X" ||
    raw.startsWith("S") && !raw.startsWith("SIN")
  );
}

/**
 * Validador de disponibilidad en inventario.
 * Si la celda está vacía pero el producto existe con datos válidos, se considera disponible por defecto
 * para evitar que productos nuevos queden invisibles si el creador olvida escribir "SÍ".
 * Solo se oculta si explícitamente se marca como NO, FALSE, 0, AGOTADO.
 */
export function parseAvailability(val: unknown): boolean {
  if (val === false) return false;
  if (val === true) return true;
  if (val === undefined || val === null) return true;
  const raw = normalizeCleanText(val).toUpperCase();
  const s = raw.replace(/[^A-Z0-9]/g, "");

  if (s === "NO" || s === "FALSE" || s === "0" || s === "AGOTADO" || s === "N") {
    return false;
  }
  if (
    s === "SI" ||
    s === "S" ||
    s === "TRUE" ||
    s === "1" ||
    s === "YES" ||
    s === "Y" ||
    raw.startsWith("S")
  ) {
    return true;
  }
  // Celda vacía = disponible por defecto
  return s === "";
}

/**
 * Comparador inteligente de subcategorías.
 * Permite que filtros como "Rostro" o "Cuerpo" coincidan con productos etiquetados como "rostro y cuerpo",
 * o "ojos y cejas" con "Ojos y cejas", etc.
 */
export function matchesSubcategory(productSubcat: string | undefined, filter: string): boolean {
  const normFilter = normalizeCleanText(filter).toLowerCase();
  if (!normFilter || normFilter === "todo" || normFilter === "todos") return true;

  const normSub = normalizeCleanText(productSubcat).toLowerCase();

  // Alias para cuidado personal
  if (normFilter === "facial" && (normSub.includes("rostro") || normSub.includes("facial"))) return true;
  if (normFilter === "corporal" && (normSub.includes("cuerpo") || normSub.includes("corporal"))) return true;
  if (normFilter === "capilar" && (normSub.includes("capilar") || normSub.includes("cabello"))) return true;
  if (
    (normFilter.includes("fragancia") || normFilter.includes("splash")) &&
    (normSub.includes("fragancia") || normSub.includes("splash"))
  ) {
    return true;
  }

  // Alias para maquillaje: ojos vs cejas
  if (normFilter === "ojos" && normSub.includes("ojos")) return true;
  if (normFilter === "cejas" && normSub.includes("cejas")) return true;

  if (!normSub) return false;

  // Coincidencia exacta
  if (normSub === normFilter) return true;

  // Coincidencia de subcadena (ej: "rostro y cuerpo" incluye "rostro")
  if (normSub.includes(normFilter) || normFilter.includes(normSub)) return true;

  // Separar por delimitadores comunes ("y", ",", "/", "&")
  const parts = normSub.split(/\s*(?:y|,|\/|&)\s*/);
  return parts.some((p) => p === normFilter || p.includes(normFilter) || normFilter.includes(p));
}
