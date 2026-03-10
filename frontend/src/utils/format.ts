/**
 * Format số tiền hiển thị VND (vd: 1500000 -> "1.500.000")
 */
export function formatPriceVND(value: string | number | null | undefined): string {
  if (value == null || value === "") return "0"
  const num = typeof value === "string" ? parseFloat(value.replace(/[^\d.-]/g, "")) : Number(value)
  if (!Number.isFinite(num)) return "0"
  return Math.round(num).toLocaleString("vi-VN")
}
