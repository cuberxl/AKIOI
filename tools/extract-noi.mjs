#!/usr/bin/env node
/**
 * 从「信奥通关」页面里抽出 NOI 大纲知识点（window.NOI_POINTS），
 * 只保留结构信息（id / 模块 / 层 / 标题 / 前置 / 必做题 pid），丢掉大段讲解。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = 'C:\\Users\\weihy\\Downloads\\信奥通关.html';
const html = readFileSync(SRC, 'utf8');

// 找出所有 .concat([ ... ]) 里的数组字面量
const chunks = [];
let idx = 0;
while (true) {
  const k = html.indexOf('NOI_POINTS', idx);
  if (k < 0) break;
  const open = html.indexOf('concat([', k);
  if (open < 0) { idx = k + 10; continue; }
  let i = open + 'concat('.length;
  const start = i;
  let depth = 0;
  let inStr = null;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '[' || c === '{' || c === '(') depth++;
    else if (c === ']' || c === '}' || c === ')') {
      depth--;
      if (depth === 0) { i++; break; }
    }
  }
  const literal = html.slice(start, i);
  try {
    const arr = vm.runInNewContext('(' + literal + ')', {});
    if (Array.isArray(arr)) chunks.push(...arr);
  } catch (e) {
    console.error('parse chunk failed: ' + e.message);
  }
  idx = i;
}

const seen = new Set();
const nodes = chunks.filter((n) => {
  if (!n || !n.id || seen.has(n.id)) return false;
  seen.add(n.id);
  return true;
}).map((n) => ({
  id: n.id,
  mod: n.mod || '',
  layer: typeof n.layer === 'number' ? n.layer : 0,
  t: n.t || '',
  s: n.s || '',
  pre: Array.isArray(n.pre) ? n.pre : [],
  req: Array.isArray(n.req) ? n.req.map((r) => (Array.isArray(r) ? r[0] : r)) : []
}));

const pids = new Set();
nodes.forEach((n) => n.req.forEach((p) => pids.add(p)));

writeFileSync(join(here, 'noi-points.json'), JSON.stringify({ nodes, pids: [...pids] }, null, 2), 'utf8');
console.log(`nodes=${nodes.length} uniquePids=${pids.size}`);
const mods = {};
nodes.forEach((n) => { mods[n.mod] = (mods[n.mod] || 0) + 1; });
console.log(Object.entries(mods).map(([k, v]) => k + ':' + v).join('  '));
