const fs = require('fs');
const path = require('path');

// ---- build-syllabus.mjs ----
let b = fs.readFileSync('tools/build-syllabus.mjs', 'utf8').replace(/\r\n/g, '\n');
if (!b.includes("deps.cjs")) {
  b = b.replace(
    "const probTags = readJson(join(here, 'problem-tags.json'));",
    "const probTags = readJson(join(here, 'problem-tags.json'));\nimport { createRequire } from 'node:module';\nconst require_ = createRequire(import.meta.url);\nconst DEPS = require_(join(here, 'deps.cjs'));\nconst titleToId = {};\noutline.forEach((i) => { titleToId[i.title] = i.id; });\nconst depMap = {};\nconst depsMissing = [];\nDEPS.forEach(([child, parents]) => {\n  const cid = titleToId[child];\n  if (!cid) { depsMissing.push(child); return; }\n  const ids = parents.map((t) => titleToId[t]).filter(Boolean);\n  if (ids.length) depMap[cid] = ids;\n});\nif (depsMissing.length) console.warn('依赖表里找不到的条目: ' + depsMissing.join(' / '));"
  );
}
b = b.replace(
  "  const prev = outline[idx - 1];\n  const pre = prev && prev.sub === it.sub ? prev.id : [];",
  "  const sem = depMap[it.id];\n  const prev = outline[idx - 1];\n  const pre = sem && sem.length ? sem : (prev && prev.sub === it.sub ? [prev.id] : []);\n  const preSem = !!(sem && sem.length);"
);
b = b.replace(
  "    pre: Array.isArray(pre) ? pre : [pre].filter(Boolean), problems",
  "    pre: Array.isArray(pre) ? pre : [pre].filter(Boolean), preSem, problems"
);
fs.writeFileSync('tools/build-syllabus.mjs', b.replace(/\n/g, '\r\n'));

// ---- app.js：用 preSem 决定边的样式，去掉章节出入口补边 ----
let a = fs.readFileSync('assets/app.js', 'utf8').replace(/\r\n/g, '\n');
const start = a.indexOf('    // 跨章节依赖：每个章节的入口节点挂到上一级');
const end = a.indexOf('    nodes.forEach(function (n) {', start);
if (start >= 0 && end > start) a = a.slice(0, start) + a.slice(end);
a = a.replace(
  "        path.setAttribute('class', p.sub !== n.sub ? 'dag-edge cross' : 'dag-edge');",
  "        path.setAttribute('class', n.preSem ? 'dag-edge sem' : 'dag-edge chain');"
);
fs.writeFileSync('assets/app.js', a.replace(/\n/g, '\r\n'));
console.log('semEdges=' + a.includes("'dag-edge sem'") + ' depsInBuild=' + b.includes('deps.cjs'));
