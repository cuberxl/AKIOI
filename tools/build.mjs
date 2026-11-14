#!/usr/bin/env node
/**
 * 把 tools/source.json（章 → 节 → 主题 → 题号）与 tools/meta.json（洛谷抓来的
 * 官方标题、难度）合并成：
 *   - data/problems.js  站点运行时数据（window.AKIOI_DATA）
 *   - README.md         仓库首页说明
 *
 * 用法：node tools/build.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const DIFF_NAMES = ['暂无评定', '入门', '普及−', '普及', '普及+/提高−', '提高', '提高+/省选−', '省选/NOI−', 'NOI/NOI+/CTSC'];
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

const source = readJson(join(here, 'source.json'));
const meta = readJson(join(here, 'meta.json'));

const missing = [];
const chapters = source.chapters.map((ch) => {
  const sections = ch.sections.map((sec) => {
    const topics = sec.topics.map((t) => {
      const problems = [];
      for (const pid of t.problems) {
        const m = meta[pid];
        if (!m) { missing.push(pid); continue; }
        problems.push({ pid, name: m.name, difficulty: m.difficulty });
      }
      // 主题内部按难度从低到高，同难度保持人工编排顺序
      problems.sort((a, b) => a.difficulty - b.difficulty);
      return { id: t.id, name: t.name, desc: t.desc, note: t.note || '', level: t.level || 0, pre: t.pre || [], problems };
    }).filter((t) => t.problems.length > 0);
    const count = topics.reduce((n, t) => n + t.problems.length, 0);
    return { id: sec.id, name: sec.name, count, topics };
  }).filter((s) => s.topics.length > 0);
  const count = sections.reduce((n, s) => n + s.count, 0);
  return { id: ch.id, code: ch.code || '', name: ch.name, note: ch.note || '', count, sections };
}).filter((c) => c.sections.length > 0);

const total = chapters.reduce((n, c) => n + c.count, 0);
const today = new Date().toISOString().slice(0, 10);

const payload = { site: 'AKIOI', title: 'AKIOI · 洛谷题单', updated: today, total, chapters };
const banner = `/* 由 tools/build.mjs 生成，请勿手改。题目信息来自洛谷。 */\n`;
writeFileSync(join(root, 'data', 'problems.js'), banner + 'window.AKIOI_DATA = ' + JSON.stringify(payload, null, 2) + ';\n', 'utf8');

/* ---------------- README ---------------- */

const span = (list) => {
  const ls = list.map((p) => p.difficulty).sort((a, b) => a - b);
  const lo = DIFF_NAMES[ls[0]] ?? '—';
  const hi = DIFF_NAMES[ls[ls.length - 1]] ?? '—';
  return lo === hi ? lo : `${lo} → ${hi}`;
};

const overview = chapters.map((ch) => {
  const all = ch.sections.flatMap((s) => s.topics.flatMap((t) => t.problems));
  return `| **${ch.code}** | ${ch.name} | ${ch.count} | ${span(all)} | ${ch.note ? `[笔记](${ch.note})` : '—'} |`;
}).join('\n');

const dist = new Array(DIFF_NAMES.length).fill(0);
chapters.forEach((ch) => ch.sections.forEach((s) => s.topics.forEach((t) => t.problems.forEach((p) => { dist[p.difficulty] = (dist[p.difficulty] || 0) + 1; }))));
const maxCount = Math.max(...dist);
const distBar = DIFF_NAMES.map((n, i) => {
  const c = dist[i] || 0;
  const width = maxCount ? Math.round((c / maxCount) * 20) : 0;
  return `| ${n} | ${c} | ${'█'.repeat(width)} |`;
}).join('\n');

const details = chapters.map((ch) => {
  const body = ch.sections.map((sec) => {
    const topicBlocks = sec.topics.map((t) => {
      const items = t.problems.map((p) => `- [${p.pid} ${p.name}](https://www.luogu.com.cn/problem/${p.pid}) · ${DIFF_NAMES[p.difficulty] ?? '未评定'}`).join('\n');
      const note = t.note ? ` · [笔记](${t.note})` : '';
      return `**${t.name}**（${t.problems.length} 题${note}）\n\n${items}\n`;
    }).join('\n');
    const head = sec.name === ch.name ? '' : `#### ${sec.name}\n\n`;
    return head + topicBlocks;
  }).join('\n');
  const note = ch.note ? ` · [对应笔记](${ch.note})` : '';
  return `### ${ch.code} ${ch.name}（${ch.count} 题${note}）\n\n${body}`;
}).join('\n');

const readme = `# AKIOI · 洛谷题单

按算法编排的洛谷刷题站，分三块：**专项训练**（${chapters.length} 个 Part、${total} 题）、**实用工具**、**真题模拟**。

章节编号与 [Coders-Note](https://cuberxl.github.io/Coders-Note/) 的笔记一一对应（B 基础、P 提高），每个 Part 都能直接跳到对应笔记。

经典题目参考《算法竞赛进阶指南》、AcWing 算法基础课 / 提高课与洛谷《深入浅出》，再按算法重新编排。每一章都从入门铺到省选——「算法基础」不等于简单。

在线访问：[cuberxl.github.io/AKIOI](https://cuberxl.github.io/AKIOI/)

![AKIOI 题单预览](docs/preview.png)

## 章节总览

编号与 [Coders-Note](https://cuberxl.github.io/Coders-Note/) 的笔记章节一一对应（B 为基础、P 为提高），每章末尾可直接跳到对应笔记。

| 编号 | 章 | 题数 | 难度跨度 | 笔记 |
| :-: | :-- | :-: | :-- | :-- |
${overview}

## 难度分布

| 难度 | 题数 | |
| :-- | :-: | :-- |
${distBar}

## 章节明细

${details}
## 本地预览

纯静态站点，没有任何构建依赖：

\`\`\`bash
# 方式一：直接双击 index.html
# 方式二：起一个静态服务器（推荐）
python -m http.server 8080
# 首页 http://localhost:8080/
# 专项训练 http://localhost:8080/training/
\`\`\`

页面结构：

| 路径 | 内容 |
| :-- | :-- |
| \`index.html\` | 首页：三块入口 + 总进度 |
| \`training/\` | 专项训练总览（11 个 Part） |
| \`training/<code>.html\` | 每个 Part 一页，题目 + 打卡 |
| \`tools/\` | 实用工具（进度导入导出 + 建设中） |
| \`exam/\` | 真题模拟（占位） |

## 功能

- 首页三入口，Part 独立页面，不再是单页折叠
- 专项训练支持「列表 / 图谱」切换：图谱按 NOI 大纲 79 条细目展开（全屏、可拖拽缩放、带星空背景），点节点看该条的必做题与前置知识
- 每个 Part 内按小题单折叠，支持题号 / 题名搜索（快捷键 \`/\`）、难度筛选
- 打卡后进度保存在浏览器 localStorage，可在「实用工具」里导出 / 导入
- 浅色 / 深色主题，全站共用；移动端适配
- 数据与页面分离：题目在 \`data/problems.js\`，页面由 \`tools/build.mjs\` 生成

## 重新生成数据

\`\`\`bash
# 1. 编辑 tools/source.json（章 → 节 → 主题 → 题号）
# 2. 重新抓取标题与难度（需要能访问洛谷）
#    tools/fetch-metadata.ps1 会写入 tools/meta.json
# 3. 合并生成 data/problems.js 与 README.md
node tools/build.mjs
\`\`\`

## 部署到 GitHub Pages

1. 仓库 Settings → Pages → Source 选 \`Deploy from a branch\`，分支 \`main\`、目录 \`/\`（根目录）。
2. 稍等一两分钟，访问 \`https://<用户名>.github.io/AKIOI/\`。

## 版权

题目内容、标题与难度评级归 [洛谷](https://www.luogu.com.cn/) 及各题作者所有，本仓库只做题单编排与学习进度记录。
`;

writeFileSync(join(root, 'README.md'), readme, 'utf8');

console.log(`chapters=${chapters.length} total=${total} missing=${missing.length}`);
if (missing.length) console.log('missing pids:', [...new Set(missing)].join(', '));

/* ---------------- 生成 training/ 页面 ---------------- */

const THEME_BOOT = `<script>
  (function () {
    try {
      var saved = localStorage.getItem('akioi.theme');
      var forced = new URLSearchParams(location.search).get('theme');
      var dark = forced ? forced === 'dark' : (saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    } catch (e) {}
  })();
</script>`;

// 构建版本：写进静态资源的 query，发布后自动击穿旧缓存
const assetHash = createHash('sha1')
  .update(readFileSync(join(root, 'assets', 'style.css')))
  .update(readFileSync(join(root, 'assets', 'app.js')))
  .digest('hex')
  .slice(0, 7);
const VERSION = assetHash;

const SHELL = (o) => `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${o.title}</title>
<meta name="theme-color" id="meta-theme" content="#f6f7fb">
<link rel="icon" href="../assets/logo.svg" type="image/svg+xml">
${THEME_BOOT}
<link rel="stylesheet" href="../assets/style.css?v=${VERSION}" onerror="this.onerror=null;this.href='https://cdn.jsdelivr.net/gh/cuberxl/AKIOI@main/assets/style.css'">
</head>
<body data-page="${o.page}" data-base="../"${o.chapter ? ` data-chapter="${o.chapter}"` : ''}>
<header class="topbar">
  <a class="brand" href="../index.html">
    <img class="brand-logo" src="../assets/logo.svg" alt="" width="28" height="28">
    <span class="brand-text">AKIOI</span>
  </a>
  <nav class="topnav">
    <a href="../training/"${o.active === 'training' ? ' class="active"' : ''}>专项训练</a>
    <a href="../tools/">实用工具</a>
    <a href="../exam/">真题模拟</a>
  </nav>
  <div class="topbar-right">
    <button class="icon-btn" id="theme-toggle" type="button" title="切换主题" aria-label="切换主题">
      <svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
      <svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 13a8.5 8.5 0 1 1-9.6-9.4 7 7 0 0 0 9.6 9.4z"/></svg>
    </button>
  </div>
</header>
<main class="wrap">
${o.main}
</main>
<footer class="footer wrap">
  <p>AKIOI · 题目版权归 <a href="https://www.luogu.com.cn/" target="_blank" rel="noopener">洛谷</a> 及原作者所有。</p>
  <p class="muted">Built by cuberxl · 笔记站点：<a href="https://cuberxl.github.io/Coders-Note/" target="_blank" rel="noopener">Coders-Note</a></p>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script src="../data/problems.js?v=${VERSION}"></script>
<script src="../data/syllabus.js?v=${VERSION}"></script>
<script src="../assets/app.js?v=${VERSION}"></script>
</body>
</html>
`;

const DIFF_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8']
  .map((v, i) => `          <option value="${v}">${DIFF_NAMES[Number(v)]}</option>`)
  .join('\n');

mkdirSync(join(root, 'training'), { recursive: true });

/* 专项训练总览 */
writeFileSync(join(root, 'training', 'index.html'), SHELL({
  title: '专项训练 · AKIOI',
  page: 'parts',
  active: 'training',
  main: `  <section class="page-head">
    <nav class="crumbs"><a href="../index.html">首页</a> / <span>专项训练</span></nav>
    <h1>专项训练</h1>
    <p class="lead">按笔记章节编号划分 Part，共 ${chapters.length} 个 Part、${total} 道题。可以切到「图谱」看知识点之间的依赖关系。</p>
    <div class="view-switch" id="view-switch">
      <button type="button" id="view-list" class="active">列表</button>
      <button type="button" id="view-dag">图谱</button>
    </div>
  </section>
  <section class="part-list" id="part-list"></section>

  <div class="dag-overlay" id="dag-overlay" hidden>
    <canvas id="stars" class="dag-stars"></canvas>
    <div class="dag-bar">
      <div class="dag-bar-title">
        <span class="dag-dot"></span>
        知识图谱
        <span class="dag-bar-sub">拖动平移 · 滚轮缩放 · 点节点跳到小题单</span>
      </div>
      <div class="dag-levels" id="dag-levels" role="group" aria-label="按等级筛选">
        <button type="button" data-ph="B" title="只看入门级">B</button>
        <button type="button" data-ph="P" title="入门级 + 提高级">P</button>
        <button type="button" data-ph="X" class="on" title="全部">X</button>
      </div>
      <button type="button" class="dag-next" id="dag-next" hidden></button>
      <div class="dag-legend" id="dag-legend"></div>
      <div class="dag-bar-actions">
        <button type="button" id="dag-zoom-out" title="缩小">－</button>
        <button type="button" id="dag-zoom-in" title="放大">＋</button>
        <button type="button" id="dag-reset" title="复位">复位</button>
        <button type="button" id="dag-theme" title="切换深浅色">◐</button>
        <button type="button" id="dag-close" class="primary">关闭</button>
      </div>
    </div>
    <svg id="dag-svg" class="dag-svg" xmlns="http://www.w3.org/2000/svg"><g id="dag-viewport"></g></svg>
    <aside class="dag-panel" id="dag-panel" hidden>
      <div class="dag-panel-head">
        <div class="dag-panel-title">
          <span class="dp-mod" id="dp-mod"></span>
          <h2 id="dp-title"></h2>
        </div>
        <button type="button" id="dp-close" title="关闭">✕</button>
      </div>
      <p class="dag-panel-sub" id="dp-sub"></p>
      <div class="dag-panel-meta" id="dp-meta"></div>
      <div class="dag-panel-body" id="dp-body"></div>
    </aside>
  </div>`
}), 'utf8');

/* 每个 Part 一页 */
for (const ch of chapters) {
  const slug = ch.id.replace(/^ch-/, '');
  writeFileSync(join(root, 'training', slug + '.html'), SHELL({
    title: `${ch.code} ${ch.name} · AKIOI 题单`,
    page: 'part',
    active: 'training',
    chapter: ch.id,
    main: `  <section class="part-hero">
    <nav class="crumbs"><a href="../index.html">首页</a> / <a href="./">专项训练</a> / <span id="crumb-name">${ch.code} ${ch.name}</span></nav>
    <div class="part-hero-main">
      <span class="part-code" id="part-code">${ch.code}</span>
      <h1 id="part-name">${ch.name}</h1>
      <span class="part-count" id="part-count">${ch.count} 题</span>
      <a class="note-link" id="part-note" href="${ch.note || '#'}" target="_blank" rel="noopener"${ch.note ? '' : ' hidden'}>笔记 ↗</a>
    </div>
    <div class="part-hero-meta">
      <span id="part-span"></span>
      <div class="part-progress">
        <div class="progress-track"><div class="progress-fill" id="part-progress-fill"></div></div>
        <b id="part-progress-pct">0%</b>
      </div>
      <span>已完成 <b id="part-done">0</b> 题</span>
    </div>
  </section>

  <section class="toolbar toolbar-inline">
    <div class="search-box">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      <input id="search" type="search" placeholder="搜索题号或题名，如 P3371 / 最短路" autocomplete="off" spellcheck="false">
      <kbd>/</kbd>
    </div>
    <div class="toolbar-row">
      <div class="toolbar-tools">
        <button class="btn btn-ghost btn-sm" id="expand-all" type="button">全部展开</button>
        <select id="diff-filter" title="按难度筛选">
          <option value="all">全部难度</option>
${DIFF_OPTIONS}
        </select>
        <label class="switch" title="只看还没做的题">
          <input type="checkbox" id="hide-done">
          <span>只看未完成</span>
        </label>
        <label class="switch" title="只看标记为错题的">
          <input type="checkbox" id="wrong-only">
          <span>只看错题</span>
        </label>
        <button class="btn btn-ghost btn-sm" id="shuffle-btn" type="button">重排</button>
      </div>
    </div>
  </section>

  <div id="topic-list"></div>
  <p class="empty" id="empty" hidden>没有匹配的题目，换个关键词试试。</p>`
  }), 'utf8');
}

console.log(`training pages: ${chapters.length + 1}  version=${VERSION}`);

/* 手写页面（首页 / 工具 / 真题）的静态资源也带上版本号 */
function versionize(file) {
  const p = join(root, file);
  let html;
  try { html = readFileSync(p, 'utf8'); } catch (e) { return; }
  const next = html
    .replace(/((?:\.\.\/)?assets\/(?:style\.css|app\.js))(\?v=[^"']*)?/g, '$1?v=' + VERSION)
    .replace(/((?:\.\.\/)?data\/(?:problems|exams|syllabus)\.js)(\?v=[^"']*)?/g, '$1?v=' + VERSION);
  if (next !== html) writeFileSync(p, next, 'utf8');
}
['index.html', 'tools/index.html', 'exam/index.html'].forEach(versionize);














