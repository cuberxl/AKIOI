#!/usr/bin/env node
/**
 * 合成 data/syllabus.js：
 *   1. NOI 大纲 79 条细目（来自 tools/noi-points.json）
 *   2. 每条自带的大纲必做题（req）
 *   3. 把「专项训练」707 道题按知识点并入对应条目
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

const MODULES = {
  M1: '编程基础与模拟',
  M2: '排序与贪心',
  M3: '数据结构',
  M4: '搜索与枚举',
  M5: '动态规划',
  M6: '图论',
  M7: '数学与数论',
  M8: '字符串与其他'
};

// 专项训练主题 -> 大纲条目
const TOPIC_TO_NODE = {
  basic: 'M1-1',
  enum: 'M4-3',
  sort: 'M2-1',
  binary: 'M3-4',
  prefix: 'M3-3',
  recur: 'M5-1',
  bignum: 'M1-7',
  bit: 'M7-1',
  divide: 'M3-11',

  'ds-stack': 'M3-2',
  bintree: 'M3-1',
  string: 'M8-1',
  trie: 'M8-5',

  dsu: 'M3-5',
  'ds-tree': 'M3-7',
  balanced: 'M3-12',
  'ds-adv': 'M3-13',
  'ds-advanced': 'M3-14',

  'search-basic': 'M4-1',
  'search-adv': 'M4-4',

  'graph-shortest': 'M6-3',
  mst: 'M6-5',
  bipartite: 'M6-6',
  'graph-topo': 'M6-2',
  'graph-flow': 'M6-10',
  'spfa-diff': 'M6-11',

  'dp-linear': 'M5-2',
  'dp-knapsack': 'M5-4',
  'dp-interval': 'M5-5',
  'dp-tree': 'M5-6',
  'dp-state': 'M5-7',

  greedy: 'M2-2',
  'math-nt': 'M7-2',
  'math-comb': 'M7-9'
};

const src = readJson(join(here, 'noi-points.json'));
const meta = readJson(join(here, 'meta.json'));
const training = readJson(join(here, 'source.json'));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// 1) 主题题号按节点归拢
const extra = {};
training.chapters.forEach((ch) => {
  ch.sections.forEach((sec) => {
    sec.topics.forEach((t) => {
      const nodeId = TOPIC_TO_NODE[t.id];
      if (!nodeId) { console.warn('未映射主题: ' + t.id + ' ' + t.name); return; }
      (extra[nodeId] = extra[nodeId] || []).push(...t.problems);
    });
  });
});

const nodes = src.nodes.map((n) => {
  const modNum = Number(String(n.mod).replace(/\D/g, '')) || 1;
  const level = clamp(modNum + n.layer * 2, 1, 10);

  const pids = [];
  const push = (pid) => { if (!pids.includes(pid) && meta[pid]) pids.push(pid); };
  n.req.forEach(push);
  (extra[n.id] || []).forEach(push);

  const problems = pids
    .map((pid) => ({ pid, name: meta[pid].name, difficulty: meta[pid].difficulty }))
    .sort((a, b) => a.difficulty - b.difficulty);

  return {
    id: n.id,
    mod: n.mod,
    modName: MODULES[n.mod] || n.mod,
    layer: n.layer,
    level,
    t: n.t,
    s: n.s,
    pre: n.pre,
    problems
  };
});

const total = nodes.reduce((a, n) => a + n.problems.length, 0);
const payload = { updated: new Date().toISOString().slice(0, 10), modules: MODULES, nodes, totalProblems: total };
writeFileSync(join(root, 'data', 'syllabus.js'), `/* 由 tools/build-syllabus.mjs 生成，数据来源：NOI 大纲 + 洛谷题单 */\nwindow.AKIOI_SYLLABUS = ` + JSON.stringify(payload, null, 2) + ';\n', 'utf8');

console.log(`nodes=${nodes.length} problems=${total}`);
Object.entries(MODULES).forEach(([id, name]) => {
  const list = nodes.filter((n) => n.mod === id);
  console.log(`  ${id} ${name}: ${list.length} 条，${list.reduce((a, n) => a + n.problems.length, 0)} 题`);
});
