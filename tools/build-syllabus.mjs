#!/usr/bin/env node
/**
 * 合成 data/syllabus.js：
 *   1. NOI 大纲 79 条细目（tools/noi-points.json）
 *   2. 每条自带的大纲必做题
 *   3. 专项训练 707 题按「洛谷算法标签」归到最贴合的条目（标签优先，主题兜底）
 *   4. 归属标签：按该条目大纲例题的难度中位数定 B/P/X
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

const MODULES = {
  M1: '编程基础与模拟', M2: '排序与贪心', M3: '数据结构', M4: '搜索与枚举',
  M5: '动态规划', M6: '图论', M7: '数学与数论', M8: '字符串与其他'
};

// 标签 -> 大纲条目（按顺序匹配，越具体越靠前）
const TAG_RULES = [
  [/AC\s*自动机/i, 'M8-6'],
  [/后缀自动机|后缀数组|后缀树|后缀平衡树|Lyndon/i, 'M8-7'],
  [/回文自动机|Manacher/i, 'M8-4'],
  [/KMP|Z\s*函数/i, 'M8-3'],
  [/字典树|Trie/i, 'M8-5'],
  [/字符串哈希|哈希\s*hashing|^哈希$/i, 'M8-2'],
  [/字符串/i, 'M8-1'],

  [/中国剩余|CRT/i, 'M7-6'],
  [/莫比乌斯|杜教筛|Dirichlet/i, 'M7-10'],
  [/高斯消元|线性基|异或方程组/i, 'M7-11'],
  [/Pólya|置换|群论/i, 'M7-12'],
  [/矩阵乘法|矩阵加速|矩阵运算|线性递推/i, 'M7-7'],
  [/概率|期望|Bayes/i, 'M7-8'],
  [/逆元/i, 'M7-5'],
  [/组合数学|排列组合|二项式|Catalan|Stirling|鸽笼|容斥|Lucas/i, 'M7-9'],
  [/扩展欧几里德|欧拉函数|Bézout|裴蜀/i, 'M7-4'],
  [/gcd|最大公约数|快速幂/i, 'M7-3'],
  [/素数|筛法|数论/i, 'M7-2'],
  [/进制|位运算/i, 'M7-1'],

  [/费用流|Dinic|Sap|最小割|最大流|网络流(?!与线性规划)/i, 'M6-10'],
  [/2-SAT|差分约束/i, 'M6-11'],
  [/双连通|割点|桥/i, 'M6-9'],
  [/强连通|Tarjan|缩点/i, 'M6-8'],
  [/二分图|匈牙利|KM\s*算法|最大匹配/i, 'M6-6'],
  [/欧拉回路|哈密顿/i, 'M6-7'],
  [/次小生成树|生成树|Kruskal|Prim/i, 'M6-5'],
  [/拓扑排序/i, 'M6-2'],
  [/Floyd/i, 'M6-4'],
  [/最短路|Dijkstra|SPFA|Bellman/i, 'M6-3'],
  [/LCA|最近公共祖先|树的直径|树的遍历|树上|树论|图遍历|图论/i, 'M6-1'],

  [/插头\s*DP|DP\s*套\s*DP|轮廓线/i, 'M5-11'],
  [/斜率优化|动态规划优化|决策单调性|四边形不等式|wqs/i, 'M5-10'],
  [/数位\s*DP/i, 'M5-9'],
  [/状压\s*DP/i, 'M5-7'],
  [/树形\s*DP/i, 'M5-6'],
  [/区间\s*DP|环形\s*dp/i, 'M5-5'],
  [/背包\s*DP/i, 'M5-4'],
  [/LIS|LCS|最长(上升|公共)/i, 'M5-3'],
  [/多维状态/i, 'M5-8'],
  [/线性\s*DP/i, 'M5-2'],
  [/递推/i, 'M5-1'],

  [/记忆化/i, 'M4-5'],
  [/迭代加深|IDA\*|A\*\s*算法|折半搜索/i, 'M4-6'],
  [/剪枝/i, 'M4-4'],
  [/BFS|广度优先/i, 'M4-2'],
  [/DFS|深度优先|搜索/i, 'M4-1'],
  [/枚举/i, 'M4-3'],

  [/线段树合并|线段树分治|整体二分|cdq/i, 'M3-15'],
  [/可持久化/i, 'M3-13'],
  [/树链剖分|LCT|动态树/i, 'M3-14'],
  [/平衡树|Treap|Splay|AVL|SBT|替罪羊/i, 'M3-12'],
  [/ST\s*表|RMQ|倍增/i, 'M3-11'],
  [/树套树|二维线段树|李超线段树|线段树/i, 'M3-8'],
  [/树状数组/i, 'M3-7'],
  [/并查集/i, 'M3-5'],
  [/可并堆|堆|优先队列/i, 'M3-6'],
  [/单调队列|单调栈/i, 'M3-9'],
  [/哈希表/i, 'M3-10'],
  [/分块|莫队|根号分治/i, 'M3-10'],
  [/栈|队列|链表|线性数据结构/i, 'M3-2'],
  [/数组|vector|STL/i, 'M3-1'],

  [/快速排序|堆排序|希尔排序|排序/i, 'M2-1'],
  [/反悔贪心/i, 'M2-3'],
  [/贪心/i, 'M2-2'],

  [/高精度/i, 'M1-7'],
  [/二分|三分/i, 'M3-4'],
  [/前缀和|差分|离散化/i, 'M3-3'],
  [/递归|分治/i, 'M1-4'],
  [/模拟|语言入门|顺序结构|分支结构|循环结构/i, 'M1-1']
];

// 主题兜底
const TOPIC_TO_NODE = {
  basic: 'M1-1', enum: 'M4-3', sort: 'M2-1', binary: 'M3-4', prefix: 'M3-3',
  recur: 'M5-1', bignum: 'M1-7', bit: 'M7-1', divide: 'M3-11',
  'ds-stack': 'M3-2', bintree: 'M6-1', string: 'M8-1', trie: 'M8-5',
  dsu: 'M3-5', 'ds-tree': 'M3-7', balanced: 'M3-12', 'ds-adv': 'M3-13', 'ds-advanced': 'M3-14',
  'search-basic': 'M4-1', 'search-adv': 'M4-4',
  'graph-shortest': 'M6-3', mst: 'M6-5', bipartite: 'M6-6',
  'graph-topo': 'M6-2', 'graph-flow': 'M6-10', 'spfa-diff': 'M6-11',
  'dp-linear': 'M5-2', 'dp-knapsack': 'M5-4', 'dp-interval': 'M5-5',
  'dp-tree': 'M5-6', 'dp-state': 'M5-7',
  greedy: 'M2-2', 'math-nt': 'M7-2', 'math-comb': 'M7-9'
};

const src = readJson(join(here, 'noi-points.json'));
const meta = readJson(join(here, 'meta.json'));
const training = readJson(join(here, 'source.json'));
const tagDict = readJson(join(here, 'tags.json'));
const probTags = readJson(join(here, 'problem-tags.json'));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// 标签稀有度：出现越少越具体
const freq = {};
Object.values(probTags).forEach((ids) => {
  (ids || []).forEach((id) => {
    const nm = tagDict[String(id)];
    if (nm) freq[nm] = (freq[nm] || 0) + 1;
  });
});
const GENERIC = new Set(['图论', '动态规划 DP', '搜索', '贪心', '数学', '模拟', '数据结构', '暴力数据结构', '字符串', '数论', '算法', '﻿基础算法', '其它技巧', '枚举', '递推', '递归', '分治', '排序', '二分']);

function nodeByTags(pid) {
  const ids = probTags[pid];
  if (!Array.isArray(ids)) return null;
  const names = ids.map((id) => tagDict[String(id)]).filter(Boolean);
  let best = null, bestScore = Infinity;
  for (const nm of names) {
    for (const [re, node] of TAG_RULES) {
      if (!re.test(nm)) continue;
      const score = (freq[nm] || 1) + (GENERIC.has(nm) ? 1000 : 0);
      if (score < bestScore) { bestScore = score; best = node; }
      break;
    }
  }
  return best;
}

// 1) 归拢专项训练的题
const extra = {};
let byTag = 0, byTopic = 0;
training.chapters.forEach((ch) => {
  ch.sections.forEach((sec) => {
    sec.topics.forEach((t) => {
      const fallback = TOPIC_TO_NODE[t.id];
      t.problems.forEach((pid) => {
        if (!meta[pid]) return;
        const hit = nodeByTags(pid);
        const target = hit || fallback;
        if (!target) return;
        if (hit) byTag++; else byTopic++;
        (extra[target] = extra[target] || []).push(pid);
      });
    });
  });
});

const median = (arr) => {
  if (!arr.length) return 2;
  const a = arr.slice().sort((x, y) => x - y);
  return a[Math.floor(a.length / 2)];
};

const nodes = src.nodes.map((n) => {
  const pids = [];
  const push = (pid) => { if (!pids.includes(pid) && meta[pid]) pids.push(pid); };
  n.req.forEach(push);
  (extra[n.id] || []).forEach(push);

  const problems = pids
    .map((pid) => ({ pid, name: meta[pid].name, difficulty: meta[pid].difficulty }))
    .sort((a, b) => a.difficulty - b.difficulty);

  const refDiffs = n.req.map((pid) => meta[pid] && meta[pid].difficulty).filter((x) => typeof x === 'number');
  const md = refDiffs.length ? median(refDiffs) : (problems.length ? median(problems.map((p) => p.difficulty)) : 2);
  const phase = md <= 2 ? 'B' : (md <= 4 ? 'P' : 'X');
  const level = clamp(Math.round(md * 1.25) + 1, 1, 10);

  return { id: n.id, mod: n.mod, modName: MODULES[n.mod] || n.mod, layer: n.layer, level, phase, t: n.t, s: n.s, pre: n.pre, problems };
});

const counters = { B: 0, P: 0, X: 0 };
nodes.slice().sort((a, b) => a.level - b.level || a.id.localeCompare(b.id)).forEach((n) => { n.num = ++counters[n.phase]; });
nodes.forEach((n) => { n.label = '归属·' + n.phase + n.num + '-NOI' + n.level + '级'; });

const total = nodes.reduce((a, n) => a + n.problems.length, 0);
writeFileSync(join(root, 'data', 'syllabus.js'),
  `/* 由 tools/build-syllabus.mjs 生成，数据来源：NOI 大纲 + 洛谷 */\nwindow.AKIOI_SYLLABUS = ` + JSON.stringify({ updated: new Date().toISOString().slice(0, 10), modules: MODULES, nodes, totalProblems: total }, null, 2) + ';\n', 'utf8');

console.log(`nodes=${nodes.length} problems=${total}  标签归类=${byTag} 主题兜底=${byTopic}`);
const empty = nodes.filter((n) => n.problems.length < 3);
console.log('题数<3 的条目: ' + (empty.length ? empty.map((n) => n.id + '(' + n.problems.length + ')').join(' ') : '无'));

