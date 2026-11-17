// 分页算术的唯一实现：三个页面以前各写了一遍，改一处分页就会漏。
import { blogListUrl } from './path';

export interface Pagination {
  /** 总页数（至少有 1 页，即使一篇文章都没有） */
  totalPages: number;
  /** [1, 2, …, totalPages]，直接用于渲染页码 */
  pageNumbers: number[];
}

/** 根据文章总数与每页条数算出分页信息。 */
export function paginationInfo(totalPosts: number, perPage: number): Pagination {
  const safePerPage = perPage > 0 ? perPage : 1;
  const totalPages = Math.max(1, Math.ceil(totalPosts / safePerPage));
  return {
    totalPages,
    pageNumbers: Array.from({ length: totalPages }, (_, i) => i + 1),
  };
}

/** 第 n 页的 URL：第 1 页是 /blog/，之后是 /blog/2/ …（带 base） */
export function blogPageUrl(page: number): string {
  return page <= 1 ? blogListUrl() : `${blogListUrl()}${page}/`;
}
