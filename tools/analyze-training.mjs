#!/usr/bin/env node
/** 分析题单与现有题目的重叠，输出待抓取的新题号。 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

const data = readFileSync(join(root, 'data', 'problems.js'), 'utf8');
const site = JSON.parse(data.slice(data.indexOf('{'), data.lastIndexOf('}') + 1));
const existing = new Set();
site.chapters.forEach((c) => c.sections.forEach((s) => s.topics.forEach((t) => t.problems.forEach((p) => existing.add(p.pid)))));

const training = readJson(join(here, 'training-1128351.json'));

// part -> 目标主题（现有 id 或 NEW:xxx）
const MAP = {
  '1.1': 'basic', '1.2': 'enum', '1.3': 'sort', '1.4': 'bignum',
  '1.5': 'binary', '1.6': 'prefix', '1.7': 'NEW:divide',
  '2.1': 'NEW:linear', '2.2': 'NEW:bintree', '2.3': 'NEW:ds-advanced', '2.4': 'string', '2.5': 'ds-adv',
  '3.1': 'search-basic', '3.2': 'search-adv',
  '4.1': 'graph-shortest', '4.2': 'mst', '4.3': 'graph-flow', '4.4': 'graph-topo',
  '5.1': 'dp-knapsack', '5.2': 'dp-linear', '5.3': 'dp-tree', '5.4': 'dp-interval', '5.5': 'dp-state',
  '6': 'greedy'
};

const seen = new Set();
const newPids = [];
const rows = [];
let dupInTraining = 0;
let dupWithSite = 0;

for (const t of training.trainings) {
  const target = MAP[t.part];
  if (!target) throw new Error('no mapping for part ' + t.part);
  const fresh = [];
  for (const pid of t.pids) {
    if (seen.has(pid)) { dupInTraining++; continue; }
    seen.add(pid);
    if (existing.has(pid)) { dupWithSite++; continue; }
    fresh.push(pid);
    newPids.push(pid);
  }
  rows.push({ part: t.part, name: t.name, target, total: t.pids.length, fresh: fresh.length, pids: fresh });
}

console.log(`题单总数=${seen.size}  与现有重叠=${dupWithSite}  题单内部重复=${dupInTraining}  新增=${newPids.length}`);
console.log(`现有 ${existing.size} + 新增 ${newPids.length} = ${existing.size + newPids.length}`);
console.log('');
rows.forEach((r) => {
  console.log(`  Part ${r.part.padEnd(4)} ${r.name.replace(/^【Part [^】]+】/, '').padEnd(18)} 现有目标 ${String(r.target).padEnd(14)} 新增 ${String(r.fresh).padStart(3)}/${r.total}`);
});

writeFileSync(join(here, 'new-pids.json'), JSON.stringify({ rows, pids: newPids }, null, 2), 'utf8');
console.log('\n已写出 tools/new-pids.json');
