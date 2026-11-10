#!/usr/bin/env node
/**
 * 把「算法精炼」题单的新题并入 tools/source.json。
 * 规则：按 Part 映射到现有主题；没有对应主题的，新建主题挂到对应章。
 * 只并入 tools/meta.json 里能查到官方信息的题（抓取失败的自动丢弃并报告）。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

const source = readJson(join(here, 'source.json'));
const meta = readJson(join(here, 'meta.json'));
const plan = readJson(join(here, 'new-pids.json'));

const NOTE = 'https://cuberxl.github.io/Coders-Note/';

// Part -> 目标主题（覆盖 analyze 的默认映射）
const TARGET = {
  '1.1': 'basic', '1.2': 'enum', '1.3': 'sort', '1.4': 'bignum',
  '1.5': 'binary', '1.6': 'prefix', '1.7': 'NEW:divide',
  '2.1': 'ds-stack', '2.2': 'NEW:bintree', '2.3': 'NEW:ds-advanced',
  '2.4': 'string', '2.5': 'ds-adv',
  '3.1': 'search-basic', '3.2': 'search-adv',
  '4.1': 'graph-shortest', '4.2': 'mst', '4.3': 'graph-flow', '4.4': 'graph-topo',
  '5.1': 'dp-knapsack', '5.2': 'dp-linear', '5.3': 'dp-tree', '5.4': 'dp-interval', '5.5': 'dp-state',
  '6': 'greedy'
};

const NEW_TOPICS = {
  divide: {
    id: 'divide', name: '分治与倍增',
    desc: '分治把区间一分为二分别处理；倍增用 2^k 的跳跃把 O(n) 压到 O(log n)，ST 表与倍增求 LCA 都靠它。',
    note: NOTE + '2B-基本算法/', chapter: 'ch-2b'
  },
  bintree: {
    id: 'bintree', name: '二叉树',
    desc: '二叉树的遍历、由遍历序列重建、以及堆式编号等性质；是后面树形结构与树形 DP 的地基。',
    note: NOTE + '3B-数据结构/', chapter: 'ch-3b'
  },
  'ds-advanced': {
    id: 'ds-advanced', name: '高级数据结构',
    desc: '树链剖分、ST 表、单调结构与并查集扩展——把「路径/区间上的查询」压到 log 级。',
    note: NOTE + '3P-数据结构进阶/', chapter: 'ch-3p'
  }
};

/* ---------- 1. 收集要并入的题号 ---------- */
const chapterById = {};
source.chapters.forEach((c) => { chapterById[c.id] = c; });

const topicById = {};
source.chapters.forEach((c) => c.sections.forEach((s) => s.topics.forEach((t) => { topicById[t.id] = t; })));

const toAdd = {};       // topicId -> [pid...]
const dropped = [];
const added = new Set();

for (const row of plan.rows) {
  const target = TARGET[row.part] || row.target;
  for (const pid of row.pids) {
    if (!meta[pid]) { dropped.push(pid); continue; }
    if (target.startsWith('NEW:')) {
      const key = target.slice(4);
      if (!NEW_TOPICS[key]) throw new Error('unknown new topic ' + key);
      (toAdd['NEW:' + key] = toAdd['NEW:' + key] || []).push(pid);
    } else {
      if (!topicById[target]) throw new Error('unknown topic ' + target);
      (toAdd[target] = toAdd[target] || []).push(pid);
    }
    added.add(pid);
  }
}

/* ---------- 2. 并入 source ---------- */
for (const [key, pids] of Object.entries(toAdd)) {
  if (key.startsWith('NEW:')) {
    const def = NEW_TOPICS[key.slice(4)];
    const chapter = chapterById[def.chapter];
    chapter.sections[0].topics.push({
      id: def.id, name: def.name, desc: def.desc, note: def.note, problems: pids
    });
  } else {
    const topic = topicById[key];
    const set = new Set(topic.problems);
    pids.forEach((p) => { if (!set.has(p)) { topic.problems.push(p); set.add(p); } });
  }
}

// 清理：每章至少一个主题
source.chapters.forEach((c) => { c.sections = c.sections.filter((s) => s.topics.length > 0); });
source.chapters = source.chapters.filter((c) => c.sections.length > 0);

const total = source.chapters.reduce((n, c) => n + c.sections[0].topics.reduce((m, t) => m + t.problems.length, 0), 0);
writeFileSync(join(here, 'source.json'), JSON.stringify(source, null, 2) + '\n', 'utf8');

console.log(`并入 ${added.size} 题，丢弃（抓取失败）${dropped.length} 题，总题数 ${total}`);
if (dropped.length) console.log('丢弃的题号：' + dropped.join(' '));
console.log('');
source.chapters.forEach((c) => {
  const cnt = c.sections[0].topics.reduce((a, t) => a + t.problems.length, 0);
  console.log(`  ${c.code} ${c.name} ${cnt} 题`);
});
