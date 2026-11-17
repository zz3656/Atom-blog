/**
 * 新文章 frontmatter 组装 —— 供 scripts/atom-cli.mjs 复用，便于单元测试。
 *
 * 历史 bug：`--draft` 与 `--reward` 被推到了 frontmatter 收尾 `---` **之后**，
 * 于是 `draft: true` 落进正文、schema 里 draft 恒为 undefined，
 * 用 `--draft` 建的文章会立刻发布；`--reward` 则从来没有写进文件。
 * 这里把「哪些字段属于 frontmatter」一次性写死，避免再漏。
 */

const NEEDS_QUOTE = /[:#]|^\s|\s$|^$|^[-?&*!|>'"%@`]/;

/** 只在必要的时候加引号，保持生成的文件可读。 */
export function yamlScalar(value) {
  const str = String(value);
  if (NEEDS_QUOTE.test(str)) return JSON.stringify(str);
  return str;
}

/**
 * @param {object} fields
 * @param {string} fields.title
 * @param {string} [fields.description]
 * @param {string} [fields.pubDate]      YYYY-MM-DD
 * @param {string} [fields.category]
 * @param {string[]} [fields.tags]
 * @param {string} [fields.heroImage]
 * @param {string} [fields.featuredImage]
 * @param {boolean} [fields.reward]
 * @param {boolean} [fields.draft]
 * @returns {string} 含 frontmatter 的 markdown 骨架（以换行结尾）
 */
export function composeFrontmatter(fields) {
  const {
    title,
    description = '',
    pubDate = new Date().toISOString().slice(0, 10),
    category = '',
    tags = [],
    heroImage = '',
    featuredImage = '',
    reward = false,
    draft = false,
  } = fields;

  const lines = ['---'];
  lines.push(`title: ${yamlScalar(title)}`);
  lines.push(`description: ${yamlScalar(description)}`);
  lines.push(`pubDate: ${pubDate}`);
  if (category) lines.push(`category: ${yamlScalar(category)}`);
  if (tags.length > 0) lines.push(`tags: [${tags.map((t) => yamlScalar(t)).join(', ')}]`);
  if (heroImage) lines.push(`heroImage: ${yamlScalar(heroImage)}`);
  if (featuredImage) lines.push(`featuredImage: ${yamlScalar(featuredImage)}`);
  if (reward) lines.push('reward: true');
  if (draft) lines.push('draft: true');
  lines.push('---', '');

  return lines.join('\n');
}
