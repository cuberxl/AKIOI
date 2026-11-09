#!/usr/bin/env node
/**
 * 把 tools/source.json（章 → 节 → 主题 → 题号）与 tools/meta.json（洛谷抓来的
 * 官方标题、难度）合并成：
 *   - data/problems.js  站点运行时数据（window.AKIOI_DATA）
 *   - README.md         仓库首页说明
 *
 * 用法：node tools/build.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
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
      return { id: t.id, name: t.name, desc: t.desc, problems };
    }).filter((t) => t.problems.length > 0);
    const count = topics.reduce((n, t) => n + t.problems.length, 0);
    return { id: sec.id, name: sec.name, count, topics };
  }).filter((s) => s.topics.length > 0);
  const count = sections.reduce((n, s) => n + s.count, 0);
  return { id: ch.id, name: ch.name, count, sections };
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

const overview = chapters.map((ch, i) => {
  const all = ch.sections.flatMap((s) => s.topics.flatMap((t) => t.problems));
  return `| ${i + 1} | **${ch.name}** | ${ch.sections.map((s) => s.name).join('、')} | ${ch.count} | ${span(all)} |`;
}).join('\n');

const dist = new Array(DIFF_NAMES.length).fill(0);
chapters.forEach((ch) => ch.sections.forEach((s) => s.topics.forEach((t) => t.problems.forEach((p) => { dist[p.difficulty] = (dist[p.difficulty] || 0) + 1; }))));
const maxCount = Math.max(...dist);
const distBar = DIFF_NAMES.map((n, i) => {
  const c = dist[i] || 0;
  const width = maxCount ? Math.round((c / maxCount) * 20) : 0;
  return `| ${n} | ${c} | ${'█'.repeat(width)} |`;
}).join('\n');

const details = chapters.map((ch, i) => {
  const body = ch.sections.map((sec) => {
    const topicBlocks = sec.topics.map((t) => {
      const items = t.problems.map((p) => `- [${p.pid} ${p.name}](https://www.luogu.com.cn/problem/${p.pid}) · ${DIFF_NAMES[p.difficulty] ?? '未评定'}`).join('\n');
      return `**${t.name}**（${t.problems.length} 题）\n\n${items}\n`;
    }).join('\n');
    const head = sec.name === ch.name ? '' : `#### ${sec.name}\n\n`;
    return head + topicBlocks;
  }).join('\n');
  return `### ${i + 1}. ${ch.name}（${ch.count} 题）\n\n${body}`;
}).join('\n');

const readme = `# AKIOI · 洛谷题单

按算法编排的洛谷刷题路线，共 **${total}** 题，分 **${chapters.length}** 章：${chapters.map((c) => '**' + c.name + '**').join(' · ')}。

经典题目参考《算法竞赛进阶指南》、AcWing 算法基础课 / 提高课与洛谷《深入浅出》，再按算法重新编排。每一章都从入门铺到省选——「算法基础」不等于简单。

在线访问：[cuberxl.github.io/AKIOI](https://cuberxl.github.io/AKIOI/)

![AKIOI 题单预览](docs/preview.png)

## 章节总览

| # | 章 | 节 | 题数 | 难度跨度 |
| :-: | :-- | :-- | :-: | :-- |
${overview}

## 难度分布

| 难度 | 题数 | |
| :-- | :-: | :-- |
${distBar}

## 章节明细

${details}
## 本地预览

纯静态站点，没有任何构建依赖，直接打开即可：

\`\`\`bash
# 方式一：直接双击 index.html
# 方式二：起一个静态服务器（推荐，避免部分浏览器的 file:// 限制）
python -m http.server 8080
# 然后访问 http://localhost:8080
\`\`\`

## 功能

- 按章、难度筛选，支持题号 / 题名搜索（快捷键 \`/\`）
- 打卡后进度保存在浏览器 localStorage，可导出 / 导入 JSON
- 浅色 / 深色主题，移动端适配
- 数据与页面分离：题目在 \`data/problems.js\`，改题单只改 \`tools/source.json\` 再重新生成

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
