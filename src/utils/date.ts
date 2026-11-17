// Atom Blog — 日期格式化

/**
 * ISO 短日期（YYYY/MM/DD）—— 等宽字体排版时对齐更整齐
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}
