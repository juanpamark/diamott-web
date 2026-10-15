/**
 * Formateador de moneda en pesos colombianos (COP).
 * Garantiza formato estándar: ej. $ 35.000
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}
