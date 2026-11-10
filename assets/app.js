/* ============================================================
   AKIOI · 洛谷题单
   章（基本算法 / 数据结构 / …）→ 节（数据结构进阶…）→ 主题（模拟、最短路…）
   渲染、筛选、本地进度。无框架、无构建。
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.AKIOI_DATA;
  var PROGRESS_KEY = 'akioi.progress.v1';
  var THEME_KEY = 'akioi.theme';
  var COLLAPSE_TOPIC_KEY = 'akioi.expanded.topics.v2';
  var EXPANDED_KEY = 'akioi.expanded.v2';
  var RING_C = 2 * Math.PI * 52;

  // 洛谷难度共 8 级（0 表示暂无评定）
  var DIFF_NAMES = ['暂无评定', '入门', '普及−', '普及', '普及+/提高−', '提高', '提高+/省选−', '省选/NOI−', 'NOI/NOI+/CTSC'];

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ---------------- 状态 ---------------- */

  var done = loadDone();
  var expandedChapters = loadSet(EXPANDED_KEY);    // 章默认收起，只记「已展开」的
  var expandedTopics = loadSet(COLLAPSE_TOPIC_KEY); // 小题单默认收起，只记「已展开」的
  var filters = { q: '', chapter: 'all', diff: 'all', hideDone: false };
  var index = {};   // pid -> { pid, name, difficulty, chapter }
  var allTopics = [];

  /* ---------------- 进度存储 ---------------- */

  function loadDone() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return new Set();
      var arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveDone() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(done)));
    } catch (e) {
      toast('浏览器禁止了本地存储，进度无法保存');
    }
  }

  /* ---------------- 折叠状态 ---------------- */

  function loadSet(key) {
    try {
      var arr = JSON.parse(localStorage.getItem(key) || '[]');
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveSet(key, set) {
    try { localStorage.setItem(key, JSON.stringify(Array.from(set))); } catch (e) {}
  }

  function isFiltering() {
    return !!filters.q || filters.diff !== 'all' || filters.hideDone;
  }

  function applyCollapse(animate) {
    var forceOpen = isFiltering();
    document.querySelectorAll('.chapter').forEach(function (ch) {
      // 默认收起：只有显式展开过的章才展开
      setCollapsed(ch, ch.querySelector('.chapter-body'), !forceOpen && !expandedChapters.has(ch.dataset.chapter), animate);
    });
    document.querySelectorAll('.group').forEach(function (card) {
      // 默认收起：只有显式展开过的小题单才展开
      setCollapsed(card, card.querySelector('.group-body'), !forceOpen && !expandedTopics.has(card.dataset.topic), animate);
    });
    updateCollapseBtn();
  }

  // 统一的折叠实现：给容器加 .collapsed，并用高度过渡收放
  function setCollapsed(box, body, isCollapsed, animate) {
    if (!body) return;
    var was = box.classList.contains('collapsed');
    box.classList.toggle('collapsed', isCollapsed);
    var head = box.querySelector('.chapter-head, .group-head');
    if (head) head.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
    if (was === isCollapsed) return;

    if (!animate) {
      body.style.height = '';
      body.hidden = isCollapsed;
      return;
    }

    if (isCollapsed) {
      body.style.height = body.scrollHeight + 'px';
      body.offsetHeight; // 强制回流，让起始高度生效
      body.style.transition = 'height .24s ease';
      body.style.height = '0px';
      setTimeout(function () {
        body.hidden = true;
        body.style.transition = '';
        body.style.height = '';
      }, 250);
    } else {
      body.hidden = false;
      body.style.height = '0px';
      body.offsetHeight;
      body.style.transition = 'height .24s ease';
      body.style.height = body.scrollHeight + 'px';
      setTimeout(function () {
        body.style.transition = '';
        body.style.height = '';
      }, 250);
    }
  }

  function toggleChapter(id) {
    if (expandedChapters.has(id)) expandedChapters.delete(id); else expandedChapters.add(id);
    saveSet(EXPANDED_KEY, expandedChapters);
    applyCollapse(true);
  }

  function toggleTopic(id) {
    if (expandedTopics.has(id)) expandedTopics.delete(id); else expandedTopics.add(id);
    saveSet(COLLAPSE_TOPIC_KEY, expandedTopics);
    applyCollapse(true);
  }

  function updateCollapseBtn() {
    var btn = $('#collapse-all');
    if (!btn) return;
    if (isFiltering()) {
      btn.textContent = '全部展开';
      btn.disabled = true;
      btn.title = '筛选时自动展开全部内容';
      return;
    }
    btn.disabled = false;
    btn.title = '';
    var boxes = document.querySelectorAll('.chapter, .group');
    var collapsedCount = document.querySelectorAll('.chapter.collapsed, .group.collapsed').length;
    btn.textContent = collapsedCount < boxes.length ? '全部收起' : '全部展开';
  }

  /* ---------------- 提示 ---------------- */

  var toastTimer = null;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ---------------- 主题 ---------------- */

  function initTheme() {
    // 主题已在 index.html 的 head 内同步确定，这里只负责切换
    $('#theme-toggle').addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------------- 索引 ---------------- */

  function buildIndex() {
    DATA.chapters.forEach(function (ch) {
      ch.sections.forEach(function (sec) {
        sec.topics.forEach(function (t) {
          allTopics.push(t);
          t.problems.forEach(function (p) {
            index[p.pid] = { pid: p.pid, name: p.name, difficulty: p.difficulty, chapter: ch.id };
          });
        });
      });
    });
  }

  /* ---------------- 筛选 ---------------- */

  function match(p) {
    if (filters.chapter !== 'all' && p.chapter !== filters.chapter) return false;
    if (filters.diff !== 'all' && String(p.difficulty) !== filters.diff) return false;
    if (filters.hideDone && done.has(p.pid)) return false;
    if (filters.q) {
      var q = filters.q.toLowerCase();
      if (p.pid.toLowerCase().indexOf(q) === -1 && p.name.toLowerCase().indexOf(q) === -1) return false;
    }
    return true;
  }

  /* ---------------- 渲染：章筛选 ---------------- */

  function renderChips() {
    var box = $('#group-chips');
    box.innerHTML = '';

    var all = el('button', 'chip');
    all.type = 'button';
    all.setAttribute('role', 'tab');
    all.dataset.chapter = 'all';
    all.innerHTML = '全部<span class="n">' + DATA.total + '</span>';
    box.appendChild(all);

    DATA.chapters.forEach(function (ch) {
      var b = el('button', 'chip');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.dataset.chapter = ch.id;
      b.innerHTML = (ch.code ? ch.code + ' ' : '') + ch.name + '<span class="n">' + ch.count + '</span>';
      box.appendChild(b);
    });

    box.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      filters.chapter = chip.dataset.chapter;
      syncChips();
      applyFilters();
      window.scrollTo({ top: $('#toolbar').offsetTop - 58, behavior: 'smooth' });
    });

    // 竖向滚轮在芯片栏上转成横向滚动，方便鼠标用户
    box.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (box.scrollWidth <= box.clientWidth) return;
      box.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  }

  function syncChips() {
    var box = $('#group-chips');
    document.querySelectorAll('.chip').forEach(function (c) {
      var on = c.dataset.chapter === filters.chapter;
      c.setAttribute('aria-selected', on ? 'true' : 'false');
      if (!on) return;
      var left = c.offsetLeft;
      var right = left + c.offsetWidth;
      if (left < box.scrollLeft) box.scrollLeft = Math.max(0, left - 8);
      else if (right > box.scrollLeft + box.clientWidth) box.scrollLeft = right - box.clientWidth + 8;
    });
  }

  /* ---------------- 渲染：章 → 节 → 主题 ---------------- */

  function renderList() {
    var list = $('#list');
    list.innerHTML = '';

    DATA.chapters.forEach(function (ch, ci) {
      var chapter = el('section', 'chapter');
      chapter.dataset.chapter = ch.id;

      // 章头
      var head = el('header', 'chapter-head');
      head.appendChild(el('span', 'chapter-code', ch.code || String(ci + 1)));
      head.appendChild(el('h2', 'chapter-name', ch.name));
      head.appendChild(el('span', 'chapter-count', ch.count + ' 题'));
      if (ch.note) head.appendChild(makeNoteLink(ch.note));

      var cprog = el('div', 'chapter-progress');
      var ctrack = el('div', 'progress-track');
      var cfill = el('div', 'progress-fill');
      ctrack.appendChild(cfill);
      cprog.appendChild(ctrack);
      var cpct = el('span', 'pct', '0%');
      cprog.appendChild(cpct);
      head.appendChild(cprog);

      head.appendChild(makeChevron());

      head.setAttribute('role', 'button');
      head.setAttribute('tabindex', '0');
      head.setAttribute('aria-expanded', 'true');
      head.setAttribute('aria-controls', 'chapter-body-' + ch.id);
      head.addEventListener('click', function () { toggleChapter(ch.id); });
      head.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleChapter(ch.id); }
      });
      chapter.appendChild(head);

      var body = el('div', 'chapter-body');
      body.id = 'chapter-body-' + ch.id;
      var inner = el('div', 'chapter-inner');

      ch.sections.forEach(function (sec) {
        var section = el('div', 'section');
        section.dataset.section = sec.id;

        if (sec.name !== ch.name) {
          var sh = el('h3', 'section-head');
          sh.appendChild(el('span', 'section-name', sec.name));
          sh.appendChild(el('span', 'section-count', sec.count + ' 题'));
          section.appendChild(sh);
        }

        sec.topics.forEach(function (t) { section.appendChild(renderTopic(t)); });
        inner.appendChild(section);
      });

      body.appendChild(inner);
      chapter.appendChild(body);

      list.appendChild(chapter);
    });
  }

  function makeChevron() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'chevron');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<path d="M6 9l6 6 6-6"/>';
    return svg;
  }

  function makeNoteLink(href) {
    var a = el('a', 'note-link', '笔记 ↗');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.title = '在 Coders-Note 查看对应笔记';
    a.addEventListener('click', function (e) { e.stopPropagation(); });
    return a;
  }

  function renderTopic(t) {
    var card = el('section', 'group');
    card.dataset.topic = t.id;

    var head = el('div', 'group-head');
    head.appendChild(el('h4', 'group-title-text', t.name));
    head.appendChild(el('span', 'count', t.problems.length + ' 题'));
    if (t.note) head.appendChild(makeNoteLink(t.note));

    var prog = el('div', 'group-progress');
    var track = el('div', 'progress-track');
    var fill = el('div', 'progress-fill');
    track.appendChild(fill);
    prog.appendChild(track);
    prog.appendChild(el('span', 'pct', '0%'));
    head.appendChild(prog);

    head.appendChild(makeChevron());
    head.setAttribute('role', 'button');
    head.setAttribute('tabindex', '0');
    head.setAttribute('aria-expanded', 'true');
    head.addEventListener('click', function () { toggleTopic(t.id); });
    head.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTopic(t.id); }
    });
    card.appendChild(head);

    var body = el('div', 'group-body');
    if (t.desc) {
      var desc = el('div', 'group-desc');
      desc.appendChild(el('p', null, t.desc));
      body.appendChild(desc);
    }
    var rows = el('div', 'rows');
    t.problems.forEach(function (p) { rows.appendChild(renderRow(p)); });
    body.appendChild(rows);
    card.appendChild(body);

    return card;
  }

  function renderRow(p) {
    var url = 'https://www.luogu.com.cn/problem/' + p.pid;
    var row = el('div', 'row');
    row.dataset.pid = p.pid;

    var check = el('button', 'check');
    check.type = 'button';
    check.setAttribute('role', 'checkbox');
    check.setAttribute('aria-checked', 'false');
    check.setAttribute('aria-label', '标记 ' + p.pid + ' 已完成');
    check.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>';
    check.addEventListener('click', function () { toggle(p.pid); });
    row.appendChild(check);

    row.appendChild(el('span', 'pid', p.pid));

    var t = el('div', 'ptitle');
    var a = el('a', null, p.name);
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.title = p.pid + ' ' + p.name;
    t.appendChild(a);
    row.appendChild(t);

    row.appendChild(el('span', 'diff diff-' + p.difficulty, DIFF_NAMES[p.difficulty] || '未评定'));

    var go = el('a', 'go');
    go.href = url;
    go.target = '_blank';
    go.rel = 'noopener';
    go.title = '在洛谷打开';
    go.setAttribute('aria-label', '在洛谷打开 ' + p.pid);
    go.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M17 7H9M17 7v8"/></svg>';
    row.appendChild(go);

    return row;
  }

  /* ---------------- 交互：打卡 ---------------- */

  function toggle(pid) {
    if (done.has(pid)) done.delete(pid); else done.add(pid);
    saveDone();
    var row = document.querySelector('.row[data-pid="' + pid + '"]');
    if (row) paintRow(row, done.has(pid));
    updateProgress();
    if (filters.hideDone && done.has(pid)) {
      row.style.opacity = '0';
      setTimeout(function () { applyFilters(); }, 160);
    }
  }

  function paintRow(row, isDone) {
    row.classList.toggle('done', isDone);
    var c = row.querySelector('.check');
    c.setAttribute('aria-checked', isDone ? 'true' : 'false');
  }

  /* ---------------- 进度统计 ---------------- */

  function updateProgress() {
    var total = DATA.total;
    var n = 0;

    DATA.chapters.forEach(function (ch) {
      var chHit = 0;
      var chTotal = 0;
      ch.sections.forEach(function (sec) {
        sec.topics.forEach(function (t) {
          var hit = 0;
          t.problems.forEach(function (p) { if (done.has(p.pid)) hit++; });
          chHit += hit;
          chTotal += t.problems.length;
          var pct = t.problems.length ? Math.round((hit / t.problems.length) * 100) : 0;
          var card = document.querySelector('.group[data-topic="' + t.id + '"]');
          if (card) {
            card.querySelector('.progress-fill').style.width = pct + '%';
            card.querySelector('.pct').textContent = pct + '%';
          }
        });
      });
      n += chHit;
      var cpct = chTotal ? Math.round((chHit / chTotal) * 100) : 0;
      var chapter = document.querySelector('.chapter[data-chapter="' + ch.id + '"]');
      if (chapter) {
        chapter.querySelector('.chapter-progress .progress-fill').style.width = cpct + '%';
        chapter.querySelector('.chapter-progress .pct').textContent = cpct + '%';
      }
    });

    var percent = total ? Math.round((n / total) * 100) : 0;
    $('#stat-total').textContent = total;
    $('#stat-groups').textContent = DATA.chapters.length;
    $('#stat-done').textContent = n;
    $('#stat-percent').textContent = percent + '%';
    var ring = $('#ring-fg');
    ring.style.strokeDasharray = RING_C;
    ring.style.strokeDashoffset = RING_C * (1 - percent / 100);
  }

  /* ---------------- 筛选应用 ---------------- */

  function applyFilters() {
    var visible = 0;

    DATA.chapters.forEach(function (ch) {
      var chapter = document.querySelector('.chapter[data-chapter="' + ch.id + '"]');
      if (!chapter) return;

      ch.sections.forEach(function (sec) {
        var section = chapter.querySelector('.section[data-section="' + sec.id + '"]');
        if (!section) return;
        var secShown = 0;

        sec.topics.forEach(function (t) {
          var card = section.querySelector('.group[data-topic="' + t.id + '"]');
          var shown = 0;
          t.problems.forEach(function (p) {
            var row = card.querySelector('.row[data-pid="' + p.pid + '"]');
            var ok = match(index[p.pid]);
            row.hidden = !ok;
            row.style.opacity = '';
            if (ok) shown++;
          });
          card.hidden = shown === 0;
          secShown += shown;
        });

        section.hidden = secShown === 0;
        visible += secShown;
      });

      var chShown = chapter.querySelectorAll('.group:not([hidden])').length;
      chapter.hidden = chShown === 0;
    });

    $('#empty').hidden = visible !== 0;
    syncChips();
    applyCollapse(false);
  }

  /* ---------------- 工具栏事件 ---------------- */

  function initToolbar() {
    var search = $('#search');
    var timer = null;
    search.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        filters.q = search.value.trim();
        applyFilters();
      }, 90);
    });

    $('#diff-filter').addEventListener('change', function (e) {
      filters.diff = e.target.value;
      applyFilters();
    });

    $('#hide-done').addEventListener('change', function (e) {
      filters.hideDone = e.target.checked;
      applyFilters();
    });

    $('#collapse-all').addEventListener('click', function () {
      var boxes = document.querySelectorAll('.chapter, .group');
      var collapsedCount = document.querySelectorAll('.chapter.collapsed, .group.collapsed').length;
      var collapseAll = collapsedCount < boxes.length;

      expandedChapters.clear();
      expandedTopics.clear();
      if (!collapseAll) {
        document.querySelectorAll('.chapter').forEach(function (c) { expandedChapters.add(c.dataset.chapter); });
        document.querySelectorAll('.group').forEach(function (g) { expandedTopics.add(g.dataset.topic); });
      }
      saveSet(EXPANDED_KEY, expandedChapters);
      saveSet(COLLAPSE_TOPIC_KEY, expandedTopics);
      applyCollapse(false);
      toast(collapseAll ? '已收起全部章和题单' : '已展开全部内容');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== search) {
        e.preventDefault();
        search.focus();
        search.select();
      } else if (e.key === 'Escape' && document.activeElement === search) {
        search.value = '';
        filters.q = '';
        applyFilters();
        search.blur();
      }
    });
  }

  /* ---------------- 随机一题 ---------------- */

  function initRandom() {
    $('#random-btn').addEventListener('click', function () {
      var pool = Object.keys(index).filter(function (pid) { return match(index[pid]); });
      if (!pool.length) { toast('当前筛选下没有题目'); return; }
      var pid = pool[Math.floor(Math.random() * pool.length)];
      var p = index[pid];
      toast('随机到 ' + p.pid + ' ' + p.name);
      window.open('https://www.luogu.com.cn/problem/' + p.pid, '_blank', 'noopener');
    });
  }

  /* ---------------- 导入 / 导出 ---------------- */

  function initTransfer() {
    $('#export-btn').addEventListener('click', function () {
      var payload = {
        site: 'AKIOI',
        exportedAt: new Date().toISOString(),
        done: Array.from(done).sort()
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'akioi-progress.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      toast('已导出 ' + done.size + ' 条记录');
    });

    $('#import-btn').addEventListener('click', function () { $('#import-file').click(); });

    $('#import-file').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(String(reader.result));
          var arr = Array.isArray(data) ? data : data.done;
          if (!Array.isArray(arr)) throw new Error('格式不对');
          var added = 0;
          arr.forEach(function (pid) {
            if (index[pid] && !done.has(pid)) { done.add(pid); added++; }
          });
          saveDone();
          repaintAll();
          toast('导入完成，新增 ' + added + ' 条');
        } catch (err) {
          toast('导入失败：文件格式不正确');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    $('#reset-btn').addEventListener('click', function () {
      if (!done.size) { toast('还没有打卡记录'); return; }
      if (!window.confirm('确定清空全部 ' + done.size + ' 条打卡记录吗？此操作不可撤销。')) return;
      done.clear();
      saveDone();
      repaintAll();
      toast('进度已清空');
    });
  }

  function repaintAll() {
    document.querySelectorAll('.row').forEach(function (row) {
      paintRow(row, done.has(row.dataset.pid));
    });
    updateProgress();
    applyFilters();
  }

  /* ---------------- 启动 ---------------- */

  function init() {
    initTheme();

    if (!DATA || !Array.isArray(DATA.chapters)) {
      $('#list').innerHTML = '<p class="empty">数据文件 data/problems.js 没有加载成功。</p>';
      return;
    }

    buildIndex();
    renderChips();
    renderList();
    document.querySelectorAll('.row').forEach(function (row) {
      paintRow(row, done.has(row.dataset.pid));
    });
    updateProgress();
    initToolbar();
    initRandom();
    initTransfer();

    // 点「开始刷题」时顺手展开第一章和它的第一组题，免得用户以为列表是空的
    var cta = document.querySelector('.hero-actions .btn-primary');
    var firstChapter = DATA.chapters[0];
    if (cta && firstChapter) {
      var firstTopic = firstChapter.sections[0] && firstChapter.sections[0].topics[0];
      cta.addEventListener('click', function () {
        expandedChapters.add(firstChapter.id);
        saveSet(EXPANDED_KEY, expandedChapters);
        if (firstTopic) {
          expandedTopics.add(firstTopic.id);
          saveSet(COLLAPSE_TOPIC_KEY, expandedTopics);
        }
        applyCollapse(false);
      });
    }

    if (DATA.updated) $('#build-date').textContent = DATA.updated;
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

