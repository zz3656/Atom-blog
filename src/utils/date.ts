// Atom Blog — 日期格式化

/**
 * 中文格式化日期
 */
export function formatDateCN(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  });
}

/**
 * 完整中文日期
 */
export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * ISO 短日期（YYYY/MM/DD）—— 等宽字体排版时对齐更整齐
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}
