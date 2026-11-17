import { describe, expect, it } from 'vitest';
import { blogPageUrl, paginationInfo } from '../src/utils/pagination';

describe('paginationInfo', () => {
  it('0 篇文章也有 1 页', () => {
    expect(paginationInfo(0, 12)).toEqual({ totalPages: 1, pageNumbers: [1] });
  });

  it('刚好整除不多出空页', () => {
    expect(paginationInfo(12, 12).totalPages).toBe(1);
    expect(paginationInfo(24, 12).totalPages).toBe(2);
  });

  it('边界：11 / 13 篇', () => {
    expect(paginationInfo(11, 12).totalPages).toBe(1);
    expect(paginationInfo(13, 12).totalPages).toBe(2);
    expect(paginationInfo(13, 12).pageNumbers).toEqual([1, 2]);
  });

  it('perPage 非法时按 1 处理，不会除以 0', () => {
    expect(paginationInfo(3, 0).totalPages).toBe(3);
  });
});

describe('blogPageUrl', () => {
  it('第 1 页是列表根路径，其余带页码', () => {
    expect(blogPageUrl(1)).toBe('/blog/');
    expect(blogPageUrl(2)).toBe('/blog/2/');
  });
});
