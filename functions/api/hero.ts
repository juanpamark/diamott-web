import Papa from "papaparse";

interface Env {
  SHEETS_HERO_CSV_URL?: string;
}

const DEFAULT_HERO_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm6VelNXSvA07xJ_p4nYWfc_GHHpBtKuE7UfiQAJCbBWrCYiLVdC49V9e9n0zb6ULapqOrTuP4b9AZ/pub?gid=95694404&single=true&output=csv";

const DEFAULT_HERO_CONFIG = {
  activo: true,
  tipo_fondo: "video" as const,
  media_url: "https://res.cloudinary.com/xdjdubsz/video/upload/v1792198504/hero2.mp4",
  titulo: "Luce tu belleza con estilo propio",
  subtitulo: "Maquillaje, fragancias y accesorios en tendencia",
  texto_boton: "Descubre",
  enlace_boton: "/#imperdibles",
};

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

function optimizeCloudinary(url: string | undefined): string {
  if (!url || typeof url !== "string") return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url;
  if (url.includes("f_auto") || url.includes("q_auto")) return url;
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const sheetUrl = context.env?.SHEETS_HERO_CSV_URL || DEFAULT_HERO_SHEET_URL;

  try {
    const res = await fetch(sheetUrl, {
      headers: {
        Accept: "text/csv, text/plain, */*",
      },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          heroSlides: [DEFAULT_HERO_CONFIG],
          heroConfig: DEFAULT_HERO_CONFIG,
        }),
        {
          status: 200,
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

    const activeRows = results.data.filter((row) => row && parseBoolean(row.activo));

    const heroSlides = activeRows.map((row) => {
      const rawMedia = cleanText(row.media_url);
      const isValidMedia =
        (rawMedia.startsWith("http://") || rawMedia.startsWith("https://")) &&
        !rawMedia.includes("[PEGAR");

      const fondoLower = cleanText(row.tipo_fondo).toLowerCase();
      const isVideo =
        fondoLower === "video" ||
        rawMedia.endsWith(".mp4") ||
        rawMedia.endsWith(".webm") ||
        rawMedia.includes("/video/");

      const optimizedMedia = isValidMedia
        ? isVideo
          ? rawMedia
          : optimizeCloudinary(rawMedia)
        : "";

      return {
        activo: true,
        tipo_fondo: (isVideo ? "video" : "imagen") as "video" | "imagen",
        media_url: optimizedMedia,
        titulo: cleanText(row.titulo) || DEFAULT_HERO_CONFIG.titulo,
        subtitulo: cleanText(row.subtitulo) || DEFAULT_HERO_CONFIG.subtitulo,
        texto_boton: cleanText(row.texto_boton) || DEFAULT_HERO_CONFIG.texto_boton,
        enlace_boton: cleanText(row.enlace_boton) || DEFAULT_HERO_CONFIG.enlace_boton,
      };
    });

    const primaryHero = heroSlides.length > 0 ? heroSlides[0] : DEFAULT_HERO_CONFIG;

    return new Response(
      JSON.stringify({
        heroSlides: heroSlides.length > 0 ? heroSlides : [DEFAULT_HERO_CONFIG],
        heroConfig: primaryHero,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=600, s-maxage=600, stale-while-revalidate=1200",
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        heroSlides: [DEFAULT_HERO_CONFIG],
        heroConfig: DEFAULT_HERO_CONFIG,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }
}
