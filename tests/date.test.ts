import { describe, it, expect } from 'vitest';
import { formatDateISO } from '../src/utils/date';

describe('formatDateISO', () => {
  it('输出 YYYY/MM/DD 且补零', () => {
    expect(formatDateISO(new Date(2026, 0, 5))).toBe('2026/01/05');
    expect(formatDateISO(new Date(2026, 11, 31))).toBe('2026/12/31');
  });
});
