#!/usr/bin/env node
/**
 * 通过 GitHub REST API 发布本站（本机连不上 github.com，只能走 api.github.com）。
 *
 * 用法：
 *   $env:GITHUB_TOKEN="ghp_xxx"; node tools/publish.mjs ["提交说明"]
 *
 * 会把当前目录下（除临时文件外）的所有文件作为一个提交推到 main 分支。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const OWNER = 'cuberxl';
const REPO = 'AKIOI';
const BRANCH = 'main';
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('缺少 GITHUB_TOKEN 环境变量');
  process.exit(1);
}

const SKIP_DIRS = new Set(['.git', 'node_modules', 'tools/pages']);
const SKIP_FILES = new Set(['tools/cookies.txt', 'tools/live-data.js', 'probe.html']);

function skipped(rel) {
  if (SKIP_FILES.has(rel)) return true;
  if (rel.split('/').some((seg) => seg.startsWith('chrome-prof') || seg === 'node_modules')) return true;
  if (rel.startsWith('tools/') && /\.(png|txt|bak\.json|backup\.json)$/.test(rel)) return true;
  return false;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(root, full).split(sep).join('/');
    const st = statSync(full);
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(rel) || skipped(rel)) continue;
      walk(full, out);
    } else {
      if (skipped(rel)) continue;
      out.push(rel);
    }
  }
  return out;
}

const api = `https://api.github.com/repos/${OWNER}/${REPO}`;
const headers = {
  Authorization: `token ${token}`,
  'User-Agent': 'akioi-publish',
  Accept: 'application/vnd.github+json',
  'Content-Type': 'application/json; charset=utf-8'
};

async function call(url, method = 'GET', body) {
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

const ref = await call(`${api}/git/ref/heads/${BRANCH}`);
const base = ref.object.sha;
const baseCommit = await call(`${api}/git/commits/${base}`);

const files = walk(root).sort();
if (files.length > 40) {
  console.error(`文件数异常（${files.length}），可能混入了临时目录，已中止`);
  console.error(files.slice(0, 20).join('\n'));
  process.exit(1);
}
console.log(`files=${files.length} base=${base.slice(0, 7)}`);

const tree = [];
for (const f of files) {
  const buf = readFileSync(join(root, f));
  const blob = await call(`${api}/git/blobs`, 'POST', { content: buf.toString('base64'), encoding: 'base64' });
  tree.push({ path: f, mode: '100644', type: 'blob', sha: blob.sha });
}

const newTree = await call(`${api}/git/trees`, 'POST', { base_tree: baseCommit.tree.sha, tree });
const message = process.argv[2] || 'chore: 更新站点';
const commit = await call(`${api}/git/commits`, 'POST', { message, tree: newTree.sha, parents: [base] });
await call(`${api}/git/refs/heads/${BRANCH}`, 'PATCH', { sha: commit.sha, force: true });

console.log(`pushed ${commit.sha.slice(0, 7)} — ${message}`);
console.log(`https://${OWNER.toLowerCase()}.github.io/${REPO}/`);
