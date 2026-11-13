#!/usr/bin/env node
/**
 * 三步走：
 *   node tools/collect-problems.mjs --tags   -> tools/node-tags.json（每条大纲用哪些标签）
 *   （PowerShell 抓取 tag 题池 -> tools/tag-pool.json）
 *   node tools/collect-problems.mjs --assign -> tools/node-problems.json（每条约 10 题）
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const mode = process.argv[2] || '--assign';

const outline = readJson(join(here, 'noi-outline.json')).items;
const tagDict = readJson(join(here, 'tags.json'));

const norm = (s) => String(s).toLowerCase().replace(/[\s\-—、，,（）()【】\[\]：:·/+]/g, '');
const GENERIC = /^(图论|动态规划|搜索|贪心|数学|模拟|数据结构|字符串|数论|算法|枚举|递推|递归|分治|排序|二分|来源|时间|模板题)$/;

const ALIAS_TAG = [
  [/双连通|割点|桥/, '割点与割边'], [/强连通|Tarjan|缩点/, '强连通分量'],
  [/LCA|最近公共祖先/, '最近公共祖先 LCA'], [/树链剖分/, '树链剖分'],
  [/LCT|动态树/, '动态树 LCT'], [/树套树/, '树套树'], [/可持久化/, '可持久化线段树'],
  [/网络流|Dinic|Sap|最小割|费用流|最大流/, '网络流'], [/匈牙利|二分图最大匹配/, '匈牙利算法'],
  [/KM\s*算法/, 'KM 算法'], [/背包\s*DP/, '简单背包类型动态规划'],
  [/状压\s*DP/, '状态压缩动态规划'], [/树形\s*DP/, '树型动态规划'],
  [/区间\s*DP/, '简单区间类型动态规划'], [/期望|概率论/, '离散随机变量的期望与方差'],
  [/矩阵乘法|矩阵加速|矩阵运算/, '矩阵的初等变换与运算'], [/线性基/, '基与线性基'],
  [/逆元/, '模意义下的乘法逆元'], [/欧拉函数/, '欧拉定理与欧拉函数'],
  [/中国剩余/, '中国剩余定理'], [/卡特兰/, '卡特兰数'], [/容斥/, '容斥原理'],
  [/莫比乌斯/, '莫比乌斯反演'], [/凸包/, '二维凸包'], [/半平面交/, '半平面交'],
  [/二分图判定/, '二分图的判定'], [/拓扑排序/, '有向无环图的拓扑排序'],
  [/最小生成树/, '最小生成树 Prim 与 Kruskal'], [/最短路/, '单源最短路 Bellman-Ford、Dijkstra、SPFA'],
  [/Floyd/, 'Floyd-Warshall 算法'], [/高精度/, '高精度加法与减法'],
  [/哈希\s*hashing|字符串哈希/, '字符串哈希函数构造'], [/Nim|SG\s*函数/, 'SG 函数']
];

// 反向：标签名 -> 大纲条目标题（别名优先）
function titleForTag(name) {
  for (const [re, title] of ALIAS_TAG) if (re.test(name)) return title;
  return null;
}

if (mode === '--tags') {
  const byTitle = {};
  outline.forEach((it) => { byTitle[it.title] = it.id; });
  const map = {};
  outline.forEach((it) => {
    const key = norm(it.title);
    const tags = [];
    for (const [id, name] of Object.entries(tagDict)) {
      const t = norm(name);
      if (t.length < 2 || GENERIC.test(t)) continue;
      if (key.includes(t) || t.includes(key)) tags.push({ id: Number(id), len: t.length });
    }
    // 别名带来的标签
    for (const [id, name] of Object.entries(tagDict)) {
      const aliasTitle = titleForTag(name);
      if (aliasTitle && aliasTitle === it.title) tags.push({ id: Number(id), len: 4 });
    }
    // 关键词兜底：标题切词，命中标签名即可
    if (!tags.length) {
      const tokens = it.title.split(/[、，,（）()【】\s]+/).filter((w) => norm(w).length >= 2);
      for (const [id, name] of Object.entries(tagDict)) {
        const t2 = norm(name);
        if (t2.length < 2 || GENERIC.test(t2)) continue;
        if (tokens.some((w) => norm(w).includes(t2) || t2.includes(norm(w)))) {
          tags.push({ id: Number(id), len: t2.length });
        }
      }
    }
    tags.sort((a, b) => b.len - a.len);
    const uniq = [];
    tags.forEach((t) => { if (!uniq.find((x) => x.id === t.id)) uniq.push(t); });
    map[it.id] = uniq.slice(0, 4).map((t) => t.id);
  });
  writeFileSync(join(here, 'node-tags.json'), JSON.stringify(map), 'utf8');
  const total = Object.values(map).reduce((a, b) => a + b.length, 0);
  console.log('nodes=' + outline.length + ' tagLinks=' + total + ' withTags=' + Object.values(map).filter((a) => a.length).length);
  process.exit(0);
}

// ---- assign ----
const nodeTags = readJson(join(here, 'node-tags.json'));
const pool = existsSync(join(here, 'tag-pool.json')) ? readJson(join(here, 'tag-pool.json')) : {};
const used = new Set();
const result = {};

// 先给标签少（更专）的节点发题
const order = outline.slice();
order.forEach((item) => {
  const candidates = [];
  (nodeTags[item.id] || []).forEach((tid) => {
    (pool[String(tid)] || []).forEach((p) => {
      if (!candidates.find((x) => x.pid === p.pid)) candidates.push(p);
    });
  });
  const want = Math.max(0, Math.min(7, item.level - 1));
  candidates.sort((a, b) => Math.abs(a.difficulty - want) - Math.abs(b.difficulty - want));
  const picked = [];
  for (const p of candidates) {
    if (picked.length >= 10) break;
    if (picked.includes(p.pid)) continue;
    picked.push(p.pid);
  }
  if (picked.length) result[item.id] = picked;
});

// 兜底：同一小结里其它条目有题，就借几条（理论类条目至少不空）
outline.forEach((item) => {
  if (result[item.id] && result[item.id].length >= 5) return;
  const sibs = outline.filter((x) => x.sub === item.sub && x.id !== item.id && result[x.id]);
  const cand = [];
  sibs.forEach((s) => result[s.id].forEach((pid) => { if (!cand.includes(pid)) cand.push(pid); }));
  if (!cand.length) return;
  const have = new Set(result[item.id] || []);
  const need = Math.max(0, 10 - have.size);
  result[item.id] = (result[item.id] || []).concat(cand.filter((p) => !have.has(p)).slice(0, need));
});

writeFileSync(join(here, 'node-problems.json'), JSON.stringify(result), 'utf8');
const counts = Object.values(result).map((a) => a.length);
console.log(`nodes=${outline.length} withProblems=${Object.keys(result).length} >=10:${counts.filter((c) => c >= 10).length} >=5:${counts.filter((c) => c >= 5).length}`);





