#!/usr/bin/env node
/**
 * 校验真题套卷：抓到的标题必须包含赛事标签，否则丢弃（防止题号张冠李戴）。
 * 输出 data/exams.js
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

const src = readJson(join(here, 'exams-src.json'));
const meta = readJson(join(here, 'meta.json'));
const norm = (s) => s.replace(/\s+/g, ' ').toLowerCase();

const sets = [];
const dropped = [];

for (const s of src.sets) {
  const problems = [];
  for (const pid of s.problems) {
    const m = meta[pid];
    if (!m) { dropped.push(`${s.id}:${pid}(无数据)`); continue; }
    if (!norm(m.name).includes(norm(s.tag))) { dropped.push(`${s.id}:${pid}(${m.name})`); continue; }
    problems.push({ pid, name: m.name, difficulty: m.difficulty });
  }
  if (problems.length >= 3) sets.push({ ...s, problems, count: problems.length });
  else dropped.push(`${s.id}:整卷有效题不足`);
}

const payload = { updated: new Date().toISOString().slice(0, 10), sets };
writeFileSync(join(root, 'data', 'exams.js'), `/* 由 tools/build-exams.mjs 生成 */\nwindow.AKIOI_EXAMS = ` + JSON.stringify(payload, null, 2) + ';\n', 'utf8');

console.log(`sets=${sets.length} problems=${sets.reduce((n, s) => n + s.problems.length, 0)} dropped=${dropped.length}`);
sets.forEach((s) => console.log(`  ${s.name}  ${s.problems.length} 题`));
if (dropped.length) console.log('丢弃：\n  ' + dropped.join('\n  '));
