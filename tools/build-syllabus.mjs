#!/usr/bin/env node
/**
 * 合成 data/syllabus.js：官方 NOI 大纲 241 条知识点 + 按洛谷标签归类的题目。
 * 难度直接用大纲给出的系数（1-10），不再推算。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

const outline = readJson(join(here, 'noi-outline.json')).items;
const meta = readJson(join(here, 'meta.json'));
const training = readJson(join(here, 'source.json'));
const tagDict = readJson(join(here, 'tags.json'));
const nodeProblems = readJson(join(here, 'node-problems.json'));
const tagPool = readJson(join(here, 'tag-pool.json'));
const poolMeta = {};
Object.values(tagPool).forEach((list) => list.forEach((p) => { poolMeta[p.pid] = p; }));
const lookup = (pid) => meta[pid] || poolMeta[pid];
const probTags = readJson(join(here, 'problem-tags.json'));

const PHASE = (lv) => (lv <= 4 ? 'B' : lv <= 7 ? 'P' : 'X');

// ---------- 标签 -> 知识点 ----------
const norm = (s) => String(s).toLowerCase().replace(/[\s\-—、，,（）()【】\[\]：:·/]/g, '');
const freq = {};
Object.values(probTags).forEach((ids) => (ids || []).forEach((id) => {
  const nm = tagDict[String(id)];
  if (nm) freq[nm] = (freq[nm] || 0) + 1;
}));

const GENERIC = new Set(['图论', '动态规划 DP', '搜索', '贪心', '数学', '模拟', '数据结构', '暴力数据结构',
  '字符串', '数论', '算法', '﻿基础算法', '其它技巧', '枚举', '递推', '递归', '分治', '排序', '二分',
  '数据结构', '来源', '时间', '模板题']);

// 每个标签名 -> 可能的知识点（双向包含）
const tagToItems = {};
outline.forEach((it) => {
  const key = norm(it.title);
  if (key.length < 2) return;
  Object.values(tagDict).forEach((nm) => {
    const t = norm(nm);
    if (t.length < 2) return;
    if (key.includes(t) || t.includes(key)) {
      (tagToItems[nm] = tagToItems[nm] || []).push(it);
    }
  });
});

// 标签名与大纲条目名对不上的，用别名兜住
const ALIAS = [
  [/双连通|割点|桥/, '割点与割边'],
  [/强连通|Tarjan|缩点/, '强连通分量'],
  [/LCA|最近公共祖先/, '最近公共祖先 LCA'],
  [/树链剖分/, '树链剖分'],
  [/LCT|动态树/, '动态树 LCT'],
  [/树套树/, '树套树'],
  [/可持久化/, '可持久化线段树'],
  [/网络流|Dinic|Sap|最小割|费用流|最大流/, '网络流'],
  [/匈牙利|二分图最大匹配/, '匈牙利算法'],
  [/KM\s*算法/, 'KM 算法'],
  [/背包\s*DP/, '简单背包类型动态规划'],
  [/状压\s*DP/, '状态压缩动态规划'],
  [/树形\s*DP/, '树型动态规划'],
  [/区间\s*DP/, '简单区间类型动态规划'],
  [/期望|概率论/, '离散随机变量的期望与方差'],
  [/矩阵乘法|矩阵加速|矩阵运算/, '矩阵的初等变换与运算'],
  [/线性基/, '基与线性基'],
  [/逆元/, '模意义下的乘法逆元'],
  [/欧拉函数/, '欧拉定理与欧拉函数'],
  [/中国剩余/, '中国剩余定理'],
  [/卡特兰/, '卡特兰数'],
  [/容斥/, '容斥原理'],
  [/莫比乌斯/, '莫比乌斯反演'],
  [/凸包/, '二维凸包'],
  [/半平面交/, '半平面交'],
  [/二分图判定/, '二分图的判定'],
  [/拓扑排序/, '有向无环图的拓扑排序'],
  [/最小生成树/, '最小生成树 Prim 与 Kruskal'],
  [/最短路/, '单源最短路 Bellman-Ford、Dijkstra、SPFA'],
  [/Floyd/, 'Floyd-Warshall 算法'],
  [/高精度/, '高精度加法与减法'],
  [/哈希\s*hashing|字符串哈希/, '字符串哈希函数构造'],
  [/Nim|SG\s*函数/, 'SG 函数']
];

function pickItem(pid) {
  const ids = probTags[pid];
  if (!Array.isArray(ids)) return null;
  let best = null, bestScore = Infinity;
  ids.forEach((id) => {
    const nm = tagDict[String(id)];
    if (!nm) return;
    for (const [re, title] of ALIAS) {
      if (!re.test(nm)) continue;
      const it = outline.find((x) => x.title === title);
      if (it) { const sc = (freq[nm] || 1) + (GENERIC.has(nm) ? 1000 : 0); if (sc < bestScore) { bestScore = sc; best = it; } return; }
    }
    const cands = tagToItems[nm];
    if (!cands) return;
    const score = (freq[nm] || 1) + (GENERIC.has(nm) ? 1000 : 0);
    if (score >= bestScore) return;
    cands.forEach((it) => { if (score < bestScore) { bestScore = score; best = it; } });
  });
  return best;
}

// ---------- 题目归拢 ----------
const buckets = {};
let assigned = 0, unassigned = 0;
const seen = new Set();
training.chapters.forEach((ch) => ch.sections.forEach((sec) => sec.topics.forEach((tp) => (
  tp.problems.forEach((pid) => {
    if (!meta[pid] || seen.has(pid)) return;
    seen.add(pid);
    const it = pickItem(pid);
    if (!it) { unassigned++; return; }
    assigned++;
    (buckets[it.id] = buckets[it.id] || []).push(pid);
  })
))));

// ---------- 组装节点 ----------
const nodes = outline.map((it, idx) => {
  const pids = [];
  (buckets[it.id] || []).forEach((pid) => { if (lookup(pid) && !pids.includes(pid)) pids.push(pid); });
  (nodeProblems[it.id] || []).forEach((pid) => { if (lookup(pid) && !pids.includes(pid)) pids.push(pid); });
  const problems = pids
    .map((pid) => ({ pid, name: lookup(pid).name, difficulty: lookup(pid).difficulty }))
    .sort((a, b) => a.difficulty - b.difficulty);
  const prev = outline[idx - 1];
  const pre = prev && prev.sub === it.sub ? prev.id : [];
  return {
    id: it.id, sec: it.sec, sub: it.sub, title: it.title, level: it.level,
    phase: PHASE(it.level), pre: Array.isArray(pre) ? pre : [pre].filter(Boolean), problems
  };
});

const counters = {};
nodes.slice().sort((a, b) => a.level - b.level || a.id.localeCompare(b.id)).forEach((n) => {
  counters[n.phase] = (counters[n.phase] || 0) + 1;
  n.num = counters[n.phase];
});
nodes.forEach((n) => { n.label = '归属·' + n.phase + n.num + '-NOI' + n.level + '级'; });

const total = nodes.reduce((a, n) => a + n.problems.length, 0);
const withProblems = nodes.filter((n) => n.problems.length).length;
writeFileSync(join(root, 'data', 'syllabus.js'),
  `/* 由 tools/build-syllabus.mjs 生成：NOI 大纲 2025 + 洛谷标签归类 */\nwindow.AKIOI_SYLLABUS = ` +
  JSON.stringify({ updated: new Date().toISOString().slice(0, 10), totalProblems: total, nodes }, null, 2) + ';\n', 'utf8');

console.log(`节点=${nodes.length} 有题条目=${withProblems} 题位=${total} 归类=${assigned} 未归类=${unassigned}`);
const byPhase = {};
nodes.forEach((n) => { byPhase[n.phase] = (byPhase[n.phase] || 0) + 1; });
console.log('B/P/X = ' + byPhase.B + '/' + byPhase.P + '/' + byPhase.X);
['最近公共祖先 LCA', '强连通分量', '割点与割边', '树链剖分', '分块', '树状数组'].forEach((t) => {
  const n = nodes.find((x) => x.title === t);
  if (n) console.log(`  ${n.label} ${t} (${n.problems.length} 题)`);
});


