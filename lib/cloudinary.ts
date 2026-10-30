/**
 * Inyecta parámetros de transformación automática f_auto,q_auto a URLs de Cloudinary
 * para servir formatos de próxima generación (AVIF/WebP) y compresión perceptiva.
 * Reduce el peso de las imágenes entre un 60% y 85% sin pérdida visible de calidad.
 */
export function optimizeCloudinaryUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";

  // Si no es Cloudinary o no es una imagen subida, retornar la URL original
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }

  // Si ya tiene f_auto o q_auto, no duplicar las transformaciones
  if (url.includes("f_auto") || url.includes("q_auto")) {
    return url;
  }

  // Insertar /f_auto,q_auto/ justo después de /image/upload/
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}
