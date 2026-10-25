/**
 * vectorize-icon.mjs — 把 DrawThings 生成的位图描成干净的矢量 SVG
 *
 * 这是「品牌图标生成」流水线的第二步：第一步用本机 Draw Things CLI 生成位图，
 * 第二步把位图描成矢量，并把颜色**强制映射**到设计系统的 token 色。
 *
 * 为什么不直接用生成图当图标？
 *   1. 扩散模型无法保证命中精确的品牌色（黄铜必须是 --accent 的那个值）
 *   2. 位图在 32×32 的 favicon 上必然糊
 *   描成矢量后，形状来自生成图（真正的 AI 产出），颜色由设计系统说了算。
 *
 * 用法：
 *   node scripts/vectorize-icon.mjs <in.png> <out.svg> [选项]
 *
 * 选项：
 *   --size 256        栅格化工作分辨率（越大越精细，也越慢）
 *   --hued            按色相分类（金色 vs 中性钢灰），不受明暗影响
 *   --sat 0.20        判定金色的最低饱和度
 *   --hue 18 --hue2 62   判定金色的色相区间
 *   --map 2c333a,f2b33d   品牌色（钢 / 黄铜）
 *   --fills "url(#gDisc),url(#gBrass)"  每簇的填充（可用渐变 url）
 *   --defs "<defs>...</defs>"  注入的渐变定义
 *   --crop            裁掉背景，只留前景包围盒
 *   --pad 12          裁切后留白（像素）
 *   --mask-down 2     掩膜降采样倍数（抹掉生成图的颗粒噪点）
 *   --dilate 1        掩膜膨胀（轨道加粗，小尺寸更清晰）
 *   --chaikin 3       角切平滑迭代次数
 *   --eps 0.9         Douglas-Peucker 简化容差
 *   --vb 32           输出 viewBox 边长（输出即 32×32 坐标系）
 *
 * 依赖 sharp（未列入 package.json，见 scripts/README 说明）。
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error(
    '缺少 sharp。这个脚本是一次性的图标矢量化工具，sharp 未列入项目依赖。\n' +
      '需要时临时安装：npm i -D sharp  （用完可 npm uninstall sharp）',
  );
  process.exit(1);
}

const argv = process.argv.slice(2);
const [input, output] = argv;
const arg = (k, d) => {
  const i = argv.indexOf(k);
  return i >= 0 ? argv[i + 1] : d;
};
const SIZE = parseInt(arg('--size', '512'), 10);
const K = parseInt(arg('--clusters', '3'), 10);
const EPS = parseFloat(arg('--eps', '0.35'));
const CHA = parseInt(arg('--chaikin', '3'), 10);
const CROP = argv.includes('--crop');
const PAD = parseFloat(arg('--pad', '0'));
const BG_TOL = parseFloat(arg('--bg-tol', '28'));
const DOWN = parseFloat(arg('--mask-down', '2'));
const DILATE = parseInt(arg('--dilate', '0'), 10);
const VB = parseFloat(arg('--vb', '0')); // >0 时把路径缩放到该 viewBox 边长
const MAP = arg('--map', '12161a,2c333a,f2b33d')
  .split(',')
  .map((v) => v.trim().replace(/^#/, ''))
  .filter(Boolean)
  .map((h) => [
    h,
    [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)],
  ]);
// 每簇（按亮度排序，从暗到亮）的填充值；可用 url(#id) 引用渐变
const FILLS = arg('--fills', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const DEFS = arg('--defs', '');

const load = async (buf) => {
  const r = await sharp(buf)
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return r;
};

let { data, info } = await load(input);
let W = info.width,
  H = info.height;

// ---------------------------------------------------------- 背景 / 前景判定
const rgba = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3] / 255];
const alphaOf = (i) => data[i * 4 + 3] / 255;

let transparent = 0;
for (let i = 0; i < W * H; i++) if (alphaOf(i) < 0.4) transparent++;
const useAlpha = transparent > W * H * 0.1;

let bgColor = null;
if (!useAlpha) {
  const corners = [
    [0, 0],
    [W - 1, 0],
    [0, H - 1],
    [W - 1, H - 1],
  ];
  bgColor = [0, 1, 2].map((c) => corners.reduce((s, [x, y]) => s + rgba(y * W + x)[c], 0) / 4);
}
const isBg = (i) => {
  if (useAlpha) return alphaOf(i) < 0.5;
  const p = rgba(i);
  return Math.hypot(p[0] - bgColor[0], p[1] - bgColor[1], p[2] - bgColor[2]) < BG_TOL;
};

// 裁切到前景包围盒
if (CROP) {
  let x0 = W,
    y0 = H,
    x1 = -1,
    y1 = -1;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (isBg(y * W + x)) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  if (x1 > x0 && y1 > y0) {
    const p = Math.round(PAD);
    const l = Math.max(0, x0 - p),
      t = Math.max(0, y0 - p);
    const w = Math.min(W - l, x1 - x0 + 1 + p * 2),
      h = Math.min(H - t, y1 - y0 + 1 + p * 2);
    ({ data, info } = await sharp(input)
      .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extract({ left: l, top: t, width: w, height: h })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true }));
    W = info.width;
    H = info.height;
  }
}

// ------------------------------------------------------------------ 像素
const n = W * H;
const R = new Float32Array(n),
  G = new Float32Array(n),
  B = new Float32Array(n);
const fg = new Uint8Array(n);
for (let i = 0; i < n; i++) {
  R[i] = data[i * 4];
  G[i] = data[i * 4 + 1];
  B[i] = data[i * 4 + 2];
  fg[i] = isBg(i) ? 0 : 1;
}
const fgIdx = [];
for (let i = 0; i < n; i++) if (fg[i]) fgIdx.push(i);
if (!fgIdx.length) {
  console.error('没有前景像素');
  process.exit(1);
}

// ------------------------------------------------------------ k-means 聚色
const lum = (i) => 0.2126 * R[i] + 0.7152 * G[i] + 0.0722 * B[i];
const sorted = [...fgIdx].sort((a, b) => lum(a) - lum(b));
const cents = [];
for (let c = 0; c < K; c++) {
  const i = sorted[Math.floor(((c + 0.5) / K) * sorted.length)];
  cents.push([R[i], G[i], B[i]]);
}
const assign = new Int32Array(n).fill(-1);
for (let iter = 0; iter < 30; iter++) {
  let moved = 0;
  for (const i of fgIdx) {
    let best = 0,
      bestD = Infinity;
    for (let c = 0; c < K; c++) {
      const d = (R[i] - cents[c][0]) ** 2 + (G[i] - cents[c][1]) ** 2 + (B[i] - cents[c][2]) ** 2;
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    if (assign[i] !== best) {
      assign[i] = best;
      moved++;
    }
  }
  const sums = Array.from({ length: K }, () => [0, 0, 0, 0]);
  for (const i of fgIdx) {
    const s = sums[assign[i]];
    s[0] += R[i];
    s[1] += G[i];
    s[2] += B[i];
    s[3]++;
  }
  for (let c = 0; c < K; c++)
    if (sums[c][3])
      cents[c] = [sums[c][0] / sums[c][3], sums[c][1] / sums[c][3], sums[c][2] / sums[c][3]];
  if (!moved) break;
}

// ------------------------------------------------------------ 颜色分类
// 模式 A（默认）：k-means 聚色后按质心最近邻映射品牌色
// 模式 B（--hued）：按 HSV 规则分类 —— 金色靠色相分离，不受明暗影响
const HUED = argv.includes('--hued');
const SAT_MIN = parseFloat(arg('--sat', '0.20'));
const HUE_MIN = parseFloat(arg('--hue', '18'));
const HUE_MAX = parseFloat(arg('--hue2', '62'));

const rgb2hsv = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b),
    mn = Math.min(r, g, b),
    d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, mx ? d / mx : 0, mx];
};

let clusterInfo;
if (HUED) {
  // 两个类：0 = 中性（钢），1 = 金色（黄铜）
  const masks = [new Uint8Array(n), new Uint8Array(n)];
  for (const i of fgIdx) {
    const [h, s] = rgb2hsv(R[i], G[i], B[i]);
    masks[s >= SAT_MIN && h >= HUE_MIN && h <= HUE_MAX ? 1 : 0][i] = 1;
  }
  const cnt = [0, 0];
  for (const i of fgIdx) {
    const [h, s] = rgb2hsv(R[i], G[i], B[i]);
    cnt[s >= SAT_MIN && h >= HUE_MIN && h <= HUE_MAX ? 1 : 0]++;
  }
  const ids = [0, 1];
  clusterInfo = ids
    .map((id, rank) => {
      let s = 0,
        c = 0;
      for (const i of fgIdx) {
        const [h, sa] = rgb2hsv(R[i], G[i], B[i]);
        const k = sa >= SAT_MIN && h >= HUE_MIN && h <= HUE_MAX ? 1 : 0;
        if (k === id) {
          s += lum(i);
          c++;
        }
      }
      const fallback = ['2c333a', 'f2b33d'][rank] ?? '888888';
      return {
        i: id,
        cnt: c,
        lum: c ? s / c : 0,
        hex: (MAP[rank]?.[0] ?? fallback).replace('#', ''),
      };
    })
    .filter((c) => c.cnt > 0);
  globalThis.__maskOverride = masks;
} else {
  clusterInfo = cents
    .map((c, i) => {
      let cnt = 0,
        s = 0;
      for (const p of fgIdx)
        if (assign[p] === i) {
          cnt++;
          s += lum(p);
        }
      let best = MAP[0],
        bestD = Infinity;
      for (const m of MAP) {
        const d = (c[0] - m[1][0]) ** 2 + (c[1] - m[1][1]) ** 2 + (c[2] - m[1][2]) ** 2;
        if (d < bestD) {
          bestD = d;
          best = m;
        }
      }
      return { i, cnt, lum: cnt ? s / cnt : 0, hex: best[0] };
    })
    .filter((c) => c.cnt > 0);
}

// --------------------------------------------- 整数网格边界追踪（精确）
// 掩膜先按 DOWN 因子降采样（面积平均 = 多数表决）抹掉噪点，再在整数网格上追踪
async function buildMask(clusterIdx) {
  const raw = Buffer.alloc(n);
  const ov = globalThis.__maskOverride;
  for (let i = 0; i < n; i++)
    raw[i] = ov ? ov[clusterIdx][i] * 255 : fg[i] && assign[i] === clusterIdx ? 255 : 0;
  let mask = raw;
  if (DOWN <= 1) return { mask, w: W, h: H, k: 1 };
  const dw = Math.max(8, Math.round(W / DOWN));
  const dh = Math.max(8, Math.round(H / DOWN));
  const r = await sharp(raw, { raw: { width: W, height: H, channels: 1 } })
    .resize(dw, dh, { kernel: 'lanczos3' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(dw * dh);
  for (let i = 0; i < dw * dh; i++) out[i] = r.data[i] >= 128 ? 255 : 0;
  mask = out;
  if (DILATE > 0) {
    for (let k = 0; k < DILATE; k++) {
      const out = Buffer.from(mask);
      for (let y = 0; y < dh; y++) {
        for (let x = 0; x < dw; x++) {
          if (mask[y * dw + x]) continue;
          let hit = 0;
          for (let dy = -1; dy <= 1 && !hit; dy++)
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx,
                ny = y + dy;
              if (nx < 0 || ny < 0 || nx >= dw || ny >= dh) continue;
              if (mask[ny * dw + nx]) {
                hit = 1;
                break;
              }
            }
          if (hit) out[y * dw + x] = 255;
        }
      }
      mask = out;
    }
  }

  return { mask, w: dw, h: dh, k: W / dw };
}

function traceMask(mask, GW, GH) {
  const at = (x, y) => (x < 0 || y < 0 || x >= GW || y >= GH ? 0 : mask[y * GW + x]);
  const edges = [];
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      if (!at(x, y)) continue;
      if (!at(x, y - 1)) edges.push([x, y, x + 1, y]);
      if (!at(x + 1, y)) edges.push([x + 1, y, x + 1, y + 1]);
      if (!at(x, y + 1)) edges.push([x + 1, y + 1, x, y + 1]);
      if (!at(x - 1, y)) edges.push([x, y + 1, x, y]);
    }
  }
  const byStart = new Map();
  const index = new Map();
  edges.forEach((e, i) => {
    const k = `${e[0]},${e[1]}`;
    if (!byStart.has(k)) byStart.set(k, []);
    byStart.get(k).push(i);
    index.set(i, e);
  });
  const used = new Uint8Array(edges.length);
  const loops = [];
  for (let i = 0; i < edges.length; i++) {
    if (used[i]) continue;
    const loop = [];
    let cur = i;
    used[cur] = 1;
    let guard = 0;
    while (guard++ < 2000000) {
      const e = index.get(cur);
      loop.push([e[0], e[1]]);
      const cand = byStart.get(`${e[2]},${e[3]}`) || [];
      const nx = cand.find((c) => !used[c]);
      if (nx === undefined) break;
      used[nx] = 1;
      cur = nx;
    }
    if (loop.length > 2) loops.push(loop);
  }
  return loops;
}

// ------------------------------------------------------------- 平滑 + 简化
function chaikin(pts, iters) {
  let p = pts;
  for (let k = 0; k < iters; k++) {
    const out = [];
    const m = p.length;
    for (let i = 0; i < m; i++) {
      const a = p[i],
        b = p[(i + 1) % m];
      out.push([a[0] + (b[0] - a[0]) * 0.25, a[1] + (b[1] - a[1]) * 0.25]);
      out.push([a[0] + (b[0] - a[0]) * 0.75, a[1] + (b[1] - a[1]) * 0.75]);
    }
    p = out;
  }
  return p;
}

function dp(points, eps) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let maxD = 0,
      idx = -1;
    const [ax, ay] = points[a],
      [bx, by] = points[b];
    const dx = bx - ax,
      dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * points[i][0] - dx * points[i][1] + bx * ay - by * ax) / len;
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (maxD > eps && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const area = (loop) => {
  let a = 0;
  for (let i = 0; i < loop.length; i++) {
    const [x1, y1] = loop[i];
    const [x2, y2] = loop[(i + 1) % loop.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
};

// ------------------------------------------- 轮廓分组：外形 + 它的洞（同一 path）
const signedArea = (loop) => {
  let a = 0;
  for (let i = 0; i < loop.length; i++) {
    const [x1, y1] = loop[i];
    const [x2, y2] = loop[(i + 1) % loop.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
};

const pointInLoop = (loop, px, py) => {
  let inside = false;
  for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
    const [xi, yi] = loop[i];
    const [xj, yj] = loop[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

const centroid = (loop) => {
  let x = 0,
    y = 0;
  for (const [px, py] of loop) {
    x += px;
    y += py;
  }
  return [x / loop.length, y / loop.length];
};

// 外形（正面积）按 |面积| 升序；洞（负面积）挂到包含它的最小外形下
function groupPaths(loops) {
  const withArea = loops.map((l) => ({ loop: l, a: signedArea(l) }));
  const outers = withArea.filter((o) => o.a > 0).sort((x, y) => x.a - y.a);
  const holes = withArea.filter((o) => o.a <= 0).sort((x, y) => x.a - y.a);
  const groups = outers.map((o) => ({ root: o.loop, holes: [] }));
  for (const h of holes) {
    const [cx, cy] = centroid(h.loop);
    let best = null;
    for (const g of groups) {
      if (pointInLoop(g.root, cx, cy)) {
        const ga = Math.abs(signedArea(g.root));
        if (!best || ga < best.area) best = { g, area: ga };
      }
    }
    if (best) best.g.holes.push(h.loop);
    else groups.push({ root: h.loop, holes: [] });
  }
  return groups;
}

const toPath = (loop) => {
  const pts = loop.slice();
  const f = pts[0],
    l = pts[pts.length - 1];
  if (f[0] !== l[0] || f[1] !== l[1]) pts.push(f);
  return 'M' + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z';
};

// ----------------------------------------------------------------- 主流程
const VS = VB > 0 ? VB / W : 1;
const OUT_W = VB > 0 ? VB : W;
const OUT_H = VB > 0 ? VB : H;
const layers = [];
for (let rank = 0; rank < clusterInfo.length; rank++) {
  const cl = clusterInfo[rank];
  const fill = FILLS[rank] ?? '#' + cl.hex;
  const { mask, w: gw, h: gh, k } = await buildMask(cl.i);
  const loops = traceMask(mask, gw, gh)
    .map((l) => chaikin(l, CHA))
    .map((l) => dp(l, EPS))
    .filter((l) => l.length > 2 && Math.abs(area(l)) > (W * H) / 6000);
  if (!loops.length) continue;
  const groups = groupPaths(loops).map((g) => ({
    d:
      toPath(g.root.map(([x, y]) => [x * k * VS, y * k * VS])) +
      g.holes.map((hl) => toPath(hl.map(([x, y]) => [x * k * VS, y * k * VS]))).join(''),
    a: Math.abs(signedArea(g.root)) * k * k,
  }));
  groups.sort((x, y) => y.a - x.a);
  layers.push({
    fill,
    paths: groups.map((g) => g.d),
    area: groups[0]?.a ?? 0,
  });
}
if (!layers.length) {
  console.error('没有抽出任何轮廓');
  process.exit(1);
}
// 暗的在下、亮的在上
layers.sort((a, b) => b.area - a.area);

const body = layers
  .map(
    (l) =>
      `  <g fill="${l.fill}" fill-rule="evenodd">\n` +
      l.paths.map((p) => `    <path d="${p}"/>`).join('\n') +
      `\n  </g>`,
  )
  .join('\n');

fs.writeFileSync(
  output,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OUT_W} ${OUT_H}" width="${OUT_W}" height="${OUT_H}">\n  <title>Atom</title>\n${DEFS ? `  ${DEFS}\n` : ''}${body}\n</svg>\n`,
);
console.log(
  `${output}: ${layers.length} 层 [${layers.map((l) => l.fill).join(', ')}], ` +
    `${layers.reduce((s, l) => s + l.paths.length, 0)} 条路径, ${OUT_W}×${OUT_H}`,
);
