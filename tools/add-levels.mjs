#!/usr/bin/env node
/**
 * 给每个主题补上 NOI 大纲级别（1-10）与前置知识（DAG 的边）。
 * 级别按《NOI 大纲》的分级思路标注，用于图谱排序与展示。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const LEVEL = {
  // 2B 基本算法
  basic: { level: 3, pre: [] },
  enum: { level: 3, pre: ['basic'] },
  sort: { level: 3, pre: ['basic'] },
  binary: { level: 4, pre: ['sort'] },
  prefix: { level: 4, pre: ['basic'] },
  recur: { level: 4, pre: ['basic'] },
  bignum: { level: 4, pre: ['basic'] },
  bit: { level: 4, pre: ['basic'] },
  divide: { level: 5, pre: ['recur', 'sort'] },

  // 3B 数据结构
  'ds-stack': { level: 4, pre: ['basic'] },
  bintree: { level: 5, pre: ['recur'] },
  string: { level: 6, pre: ['enum', 'binary'] },
  trie: { level: 6, pre: ['string'] },

  // 3P 数据结构进阶
  dsu: { level: 5, pre: ['ds-stack'] },
  'ds-tree': { level: 6, pre: ['prefix', 'divide'] },
  balanced: { level: 7, pre: ['bintree', 'ds-tree'] },
  'ds-adv': { level: 8, pre: ['ds-tree', 'balanced'] },
  'ds-advanced': { level: 8, pre: ['ds-tree'] },

  // 4B / 4P 搜索
  'search-basic': { level: 4, pre: ['recur'] },
  'search-adv': { level: 5, pre: ['search-basic'] },

  // 5B 图论
  'graph-shortest': { level: 6, pre: ['ds-stack'] },
  mst: { level: 6, pre: ['dsu', 'graph-shortest'] },
  bipartite: { level: 7, pre: ['search-basic'] },

  // 5P 图论进阶
  'graph-topo': { level: 6, pre: ['ds-stack'] },
  'graph-flow': { level: 8, pre: ['graph-shortest', 'graph-topo'] },
  'spfa-diff': { level: 7, pre: ['graph-shortest'] },

  // 6B 动态规划
  'dp-linear': { level: 5, pre: ['recur'] },
  'dp-knapsack': { level: 5, pre: ['dp-linear'] },
  'dp-interval': { level: 6, pre: ['dp-linear'] },

  // 6P 动态规划进阶
  'dp-tree': { level: 6, pre: ['bintree', 'dp-linear'] },
  'dp-state': { level: 7, pre: ['bit', 'dp-linear'] },

  // 7B 贪心
  greedy: { level: 4, pre: ['sort'] },

  // 8B 数学
  'math-nt': { level: 7, pre: ['bignum'] },
  'math-comb': { level: 7, pre: ['math-nt'] }
};

const src = JSON.parse(readFileSync(join(here, 'source.json'), 'utf8').replace(/^\uFEFF/, ''));
let n = 0;
for (const ch of src.chapters) {
  for (const sec of ch.sections) {
    for (const t of sec.topics) {
      const meta = LEVEL[t.id];
      if (!meta) { console.error('缺少级别定义: ' + t.id + ' (' + t.name + ')'); continue; }
      t.level = meta.level;
      t.pre = meta.pre;
      n++;
    }
  }
}
writeFileSync(join(here, 'source.json'), JSON.stringify(src, null, 2) + '\n', 'utf8');
console.log(`annotated ${n} topics`);
