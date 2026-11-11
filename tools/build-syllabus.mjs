#!/usr/bin/env node
/**
 * 把 NOI 大纲条目 + 洛谷官方题面信息合成 data/syllabus.js。
 * 级别按「模块序号 + 层级×2」估算（1-10 级），仅用于图谱展示。
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

const src = readJson(join(here, 'noi-points.json'));
const meta = readJson(join(here, 'meta.json'));

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const nodes = src.nodes.map((n) => {
  const modNum = Number(String(n.mod).replace(/\D/g, '')) || 1;
  const level = clamp(modNum + n.layer * 2, 1, 10);
  const problems = n.req
    .filter((pid) => meta[pid])
    .map((pid) => ({ pid, name: meta[pid].name, difficulty: meta[pid].difficulty }));
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

const totalProblems = nodes.reduce((a, n) => a + n.problems.length, 0);
const payload = { updated: new Date().toISOString().slice(0, 10), modules: MODULES, nodes, totalProblems };
writeFileSync(join(root, 'data', 'syllabus.js'), `/* 由 tools/build-syllabus.mjs 生成，数据来源：NOI 大纲条目 + 洛谷 */\nwindow.AKIOI_SYLLABUS = ` + JSON.stringify(payload, null, 2) + ';\n', 'utf8');

console.log(`nodes=${nodes.length} problems=${totalProblems}`);
Object.entries(MODULES).forEach(([id, name]) => {
  const list = nodes.filter((n) => n.mod === id);
  console.log(`  ${id} ${name}: ${list.length} 条，${list.reduce((a, n) => a + n.problems.length, 0)} 题`);
});
