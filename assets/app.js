/* ============================================================
   AKIOI · 洛谷题单
   多页面运行时：首页 / 专项训练列表 / Part 页 / 工具 / 真题
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.AKIOI_DATA || { chapters: [], total: 0 };
  var DIFF_NAMES = ['暂无评定', '入门', '普及−', '普及', '普及+/提高−', '提高', '提高+/省选−', '省选/NOI−', 'NOI/NOI+/CTSC'];
  var THEME_KEY = 'akioi.theme';
  var PROGRESS_KEY = 'akioi.progress.v1';
  var EXPANDED_TOPIC_KEY = 'akioi.expanded.topics.v2';
  var WRONG_KEY = 'akioi.wrong.v1';

  var PAGE = document.body.getAttribute('data-page') || 'home';
  var BASE = document.body.getAttribute('data-base') || '';
  var RING_C = 2 * Math.PI * 52;

  var done = loadSet(PROGRESS_KEY);
  var wrong = loadSet(WRONG_KEY);
  var expandedTopics = loadSet(EXPANDED_TOPIC_KEY);
  var filters = { q: '', diff: 'all', hideDone: false, wrongOnly: false };

  /* ---------------- 小工具 ---------------- */

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function setText(id, v) { var n = document.getElementById(id); if (n) n.textContent = v; }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }
  function diffName(d) { return DIFF_NAMES[d] || '未评定'; }

  function loadSet(key) {
    try { var a = JSON.parse(localStorage.getItem(key) || '[]'); return new Set(Array.isArray(a) ? a : []); }
    catch (e) { return new Set(); }
  }
  function saveSet(key, set) {
    try { localStorage.setItem(key, JSON.stringify(Array.from(set))); } catch (e) {}
  }

  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ---------------- 数据聚合 ---------------- */

  function chapterProblems(ch) {
    return ch.sections.reduce(function (acc, s) {
      return acc.concat(s.topics.reduce(function (a, t) { return a.concat(t.problems); }, []));
    }, []);
  }
  function chapterDone(ch) {
    return chapterProblems(ch).filter(function (p) { return done.has(p.pid); }).length;
  }
  function totalDone() {
    var n = 0;
    DATA.chapters.forEach(function (ch) { n += chapterDone(ch); });
    return n;
  }
  function spanOf(problems) {
    if (!problems.length) return '—';
    var ds = problems.map(function (p) { return p.difficulty; }).sort(function (a, b) { return a - b; });
    var lo = diffName(ds[0]), hi = diffName(ds[ds.length - 1]);
    return lo === hi ? lo : lo + ' → ' + hi;
  }

  /* ---------------- 主题 ---------------- */

  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var meta = document.getElementById('meta-theme');
    function sync() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (meta) meta.setAttribute('content', dark ? '#0c0e13' : '#f6f7fb');
    }
    sync();
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      sync();
    });
  }

  /* ---------------- 首页 ---------------- */

  function renderHome() {
    var total = DATA.total || 0;
    var d = totalDone();
    setText('stat-total', total);
    setText('stat-parts', DATA.chapters.length);
    setText('stat-done', d);
    setText('stat-percent', pct(d, total) + '%');
    var ring = document.getElementById('ring-fg');
    if (ring) {
      ring.style.strokeDasharray = RING_C;
      ring.style.strokeDashoffset = RING_C * (1 - pct(d, total) / 100);
    }
    setText('entry-training-count', total + ' 题 · ' + DATA.chapters.length + ' 个 Part');
    var bar = document.getElementById('entry-training-bar');
    if (bar) bar.style.width = pct(d, total) + '%';
  }

  /* ---------------- 专项训练：Part 列表 ---------------- */

  function renderParts() {
    var box = document.getElementById('part-list');
    if (!box) return;
    DATA.chapters.forEach(function (ch, i) {
      var probs = chapterProblems(ch);
      var d = probs.filter(function (p) { return done.has(p.pid); }).length;
      var slug = ch.id.replace(/^ch-/, '');

      var card = el('div', 'part-card');
      card.style.animationDelay = Math.min(i * 30, 300) + 'ms';

      var main = el('a', 'part-main');
      main.href = BASE + 'training/' + slug + '.html';

      var top = el('div', 'part-top');
      top.appendChild(el('span', 'part-code', ch.code));
      top.appendChild(el('h2', 'part-name', ch.name));
      top.appendChild(el('span', 'part-count', probs.length + ' 题'));
      if (ch.note) {
        var note = el('a', 'note-link part-note', '笔记 ↗');
        note.href = ch.note;
        note.target = '_blank';
        note.rel = 'noopener';
        top.appendChild(note);
      }
      main.appendChild(top);

      main.appendChild(el('p', 'part-span', spanOf(probs)));

      var prog = el('div', 'part-progress');
      var track = el('div', 'progress-track');
      var fill = el('div', 'progress-fill');
      fill.style.width = pct(d, probs.length) + '%';
      track.appendChild(fill);
      prog.appendChild(track);
      prog.appendChild(el('span', 'pct', pct(d, probs.length) + '%'));
      main.appendChild(prog);
      card.appendChild(main);
      box.appendChild(card);
    });
  }

  /* ---------------- Part 页 ---------------- */

  function renderPart() {
    var id = document.body.getAttribute('data-chapter');
    var ch = null;
    for (var i = 0; i < DATA.chapters.length; i++) if (DATA.chapters[i].id === id) ch = DATA.chapters[i];
    if (!ch) return;

    var probs = chapterProblems(ch);
    document.title = ch.code + ' ' + ch.name + ' · AKIOI 题单';

    setText('part-code', ch.code);
    setText('part-name', ch.name);
    setText('part-count', probs.length + ' 题');
    setText('part-span', spanOf(probs));
    var crumb = document.getElementById('crumb-name');
    if (crumb) crumb.textContent = ch.code + ' ' + ch.name;

    var noteLink = document.getElementById('part-note');
    if (noteLink && ch.note) {
      noteLink.href = ch.note;
      noteLink.hidden = false;
    }

    var list = document.getElementById('topic-list');
    ch.sections.forEach(function (sec) {
      sec.topics.forEach(function (t) { list.appendChild(renderTopic(t)); });
    });

    updateProgress();
    initPartToolbar();
    applyFilters();
    applyCollapse(false);

    // 从图谱点进来：展开对应小题单并滚到它
    if (location.hash.indexOf('#t-') === 0) {
      var tid = decodeURIComponent(location.hash.slice(3));
      expandedTopics.add(tid);
      saveSet(EXPANDED_TOPIC_KEY, expandedTopics);
      applyCollapse(false);
      var card = document.querySelector('.group[data-topic="' + tid + '"]');
      if (card) setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120);
    }
  }

  function renderTopic(t) {
    var card = el('section', 'group collapsed');
    card.dataset.topic = t.id;

    var head = el('div', 'group-head');
    head.appendChild(el('h3', 'group-title-text', t.name));
    head.appendChild(el('span', 'count', t.problems.length + ' 题'));
    if (t.level) head.appendChild(el('span', 'topic-level', 'NOI ' + t.level + ' 级'));
    if (t.note) head.appendChild(makeNoteLink(t.note));
    head.appendChild(el('span', 'topic-span', spanOf(t.problems)));

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
    head.setAttribute('aria-expanded', 'false');
    head.addEventListener('click', function () { toggleTopic(t.id); });
    head.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTopic(t.id); }
    });
    card.appendChild(head);

    var body = el('div', 'group-body');
    body.hidden = true;
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
    row._p = p;
    if (done.has(p.pid)) row.classList.add('done');

    var check = el('button', 'check');
    check.type = 'button';
    check.setAttribute('role', 'checkbox');
    check.setAttribute('aria-checked', done.has(p.pid) ? 'true' : 'false');
    check.setAttribute('aria-label', '标记 ' + p.pid + ' 已完成');
    check.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>';
    check.addEventListener('click', function () { toggleDone(p.pid, row); });
    row.appendChild(check);

    row.appendChild(el('span', 'pid', p.pid));

    var flag = el('button', 'flag' + (wrong.has(p.pid) ? ' on' : ''));
    flag.type = 'button';
    flag.title = '标记为不会/做错';
    flag.setAttribute('aria-pressed', wrong.has(p.pid) ? 'true' : 'false');
    flag.textContent = '错';
    flag.addEventListener('click', function () { toggleWrong(p.pid, flag); });
    row.appendChild(flag);

    var t = el('div', 'ptitle');
    var a = el('a', null, p.name);
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.title = p.pid + ' ' + p.name;
    t.appendChild(a);
    row.appendChild(t);

    row.appendChild(el('span', 'diff diff-' + p.difficulty, diffName(p.difficulty)));

    var go = el('a', 'go');
    go.href = url; go.target = '_blank'; go.rel = 'noopener';
    go.setAttribute('aria-label', '在洛谷打开 ' + p.pid);
    go.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M17 7H9M17 7v8"/></svg>';
    row.appendChild(go);

    return row;
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

  function makeChevron() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'chevron');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<path d="M6 9l6 6 6-6"/>';
    return svg;
  }

  /* ---------------- 打卡 ---------------- */

  function toggleDone(pid, row) {
    if (done.has(pid)) done.delete(pid); else done.add(pid);
    saveSet(PROGRESS_KEY, done);
    row.classList.toggle('done', done.has(pid));
    row.querySelector('.check').setAttribute('aria-checked', done.has(pid) ? 'true' : 'false');
    updateProgress();
    if (filters.hideDone && done.has(pid)) {
      row.style.opacity = '0';
      setTimeout(applyFilters, 160);
    }
  }

  function toggleWrong(pid, btn) {
    if (wrong.has(pid)) wrong.delete(pid); else wrong.add(pid);
    saveSet(WRONG_KEY, wrong);
    if (btn) {
      btn.classList.toggle('on', wrong.has(pid));
      btn.setAttribute('aria-pressed', wrong.has(pid) ? 'true' : 'false');
    }
    if (filters.wrongOnly) applyFilters();
  }

  function updateProgress() {
    DATA.chapters.forEach(function (ch) {
      var chTotal = 0, chDone = 0;
      ch.sections.forEach(function (s) {
        s.topics.forEach(function (t) {
          var hit = t.problems.filter(function (p) { return done.has(p.pid); }).length;
          chTotal += t.problems.length;
          chDone += hit;
          var card = document.querySelector('.group[data-topic="' + t.id + '"]');
          if (card) {
            card.querySelector('.progress-fill').style.width = pct(hit, t.problems.length) + '%';
            card.querySelector('.pct').textContent = pct(hit, t.problems.length) + '%';
          }
        });
      });
      var hp = document.getElementById('part-progress-fill');
      if (hp && document.body.getAttribute('data-chapter') === ch.id) {
        hp.style.width = pct(chDone, chTotal) + '%';
        setText('part-progress-pct', pct(chDone, chTotal) + '%');
        setText('part-done', chDone);
      }
    });
    setText('stat-done', totalDone());
  }

  /* ---------------- 折叠（小题单） ---------------- */

  function toggleTopic(id) {
    if (expandedTopics.has(id)) expandedTopics.delete(id); else expandedTopics.add(id);
    saveSet(EXPANDED_TOPIC_KEY, expandedTopics);
    applyCollapse(true);
  }

  function setTopicCollapsed(card, isExpanded, animate) {
    var body = card.querySelector('.group-body');
    if (!body) return;
    var was = !card.classList.contains('collapsed');
    card.classList.toggle('collapsed', !isExpanded);
    var head = card.querySelector('.group-head');
    if (head) head.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    if (was === isExpanded) return;

    if (!animate) {
      body.style.height = '';
      body.hidden = !isExpanded;
      return;
    }
    if (!isExpanded) {
      body.style.height = body.scrollHeight + 'px';
      body.offsetHeight;
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

  function isFiltering() { return !!filters.q || filters.diff !== 'all' || filters.hideDone; }

  function applyCollapse(animate) {
    var forceOpen = isFiltering();
    $$('.group').forEach(function (card) {
      var isExpanded = forceOpen || expandedTopics.has(card.dataset.topic);
      setTopicCollapsed(card, isExpanded, animate);
    });
    var btn = document.getElementById('expand-all');
    if (btn) {
      btn.disabled = forceOpen;
      btn.textContent = forceOpen ? '筛选时自动展开' : '全部展开';
    }
  }

  /* ---------------- 筛选 ---------------- */

  function match(p) {
    if (filters.diff !== 'all' && String(p.difficulty) !== filters.diff) return false;
    if (filters.hideDone && done.has(p.pid)) return false;
    if (filters.wrongOnly && !wrong.has(p.pid)) return false;
    if (filters.q) {
      var q = filters.q.toLowerCase();
      if (p.pid.toLowerCase().indexOf(q) === -1 && p.name.toLowerCase().indexOf(q) === -1) return false;
    }
    return true;
  }

  function applyFilters() {
    var visible = 0;
    $$('.group').forEach(function (card) {
      var shown = 0;
      $$('.row', card).forEach(function (row) {
        var ok = match(row._p);
        row.hidden = !ok;
        if (ok) shown++;
      });
      card.hidden = shown === 0;
      visible += shown;
    });
    var empty = document.getElementById('empty');
    if (empty) empty.hidden = visible !== 0;
    applyCollapse(false);
  }

  function initPartToolbar() {
    var search = document.getElementById('search');
    if (search) {
      var timer = null;
      search.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { filters.q = search.value.trim(); applyFilters(); }, 90);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === '/' && document.activeElement !== search) { e.preventDefault(); search.focus(); search.select(); }
        else if (e.key === 'Escape' && document.activeElement === search) {
          search.value = ''; filters.q = ''; applyFilters(); search.blur();
        }
      });
    }
    var diff = document.getElementById('diff-filter');
    if (diff) diff.addEventListener('change', function (e) { filters.diff = e.target.value; applyFilters(); });
    var hide = document.getElementById('hide-done');
    if (hide) hide.addEventListener('change', function (e) { filters.hideDone = e.target.checked; applyFilters(); });

    var wrongOnly = document.getElementById('wrong-only');
    if (wrongOnly) wrongOnly.addEventListener('change', function (e) { filters.wrongOnly = e.target.checked; applyFilters(); });

    var shuffle = document.getElementById('shuffle-btn');
    if (shuffle) shuffle.addEventListener('click', function () {
      $$('.group').forEach(function (card) {
        var rows = $$('.row:not([hidden])', card);
        if (rows.length < 2) return;
        var box = rows[0].parentNode;
        rows.slice().sort(function () { return Math.random() - 0.5; }).forEach(function (r) { box.appendChild(r); });
      });
      toast('已重排当前可见题目');
    });

    var expand = document.getElementById('expand-all');
    if (expand) expand.addEventListener('click', function () {
      var all = $$('.group');
      var allOpen = all.every(function (c) { return !c.classList.contains('collapsed'); });
      expandedTopics.clear();
      if (!allOpen) all.forEach(function (c) { expandedTopics.add(c.dataset.topic); });
      saveSet(EXPANDED_TOPIC_KEY, expandedTopics);
      applyCollapse(true);
    });
  }

  /* ---------------- 进度导入导出（工具页） ---------------- */

  function initTransfer() {
    var exp = document.getElementById('export-btn');
    if (!exp) return;
    exp.addEventListener('click', function () {
      var blob = new Blob([JSON.stringify({ site: 'AKIOI', exportedAt: new Date().toISOString(), done: Array.from(done).sort() }, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'akioi-progress.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      toast('已导出 ' + done.size + ' 条记录');
    });
    var imp = document.getElementById('import-btn');
    var file = document.getElementById('import-file');
    if (imp && file) {
      imp.addEventListener('click', function () { file.click(); });
      file.addEventListener('change', function (e) {
        var f = e.target.files && e.target.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var data = JSON.parse(String(reader.result));
            var arr = Array.isArray(data) ? data : data.done;
            if (!Array.isArray(arr)) throw new Error('bad');
            var known = new Set();
            DATA.chapters.forEach(function (ch) { chapterProblems(ch).forEach(function (p) { known.add(p.pid); }); });
            var added = 0;
            arr.forEach(function (pid) { if (known.has(pid) && !done.has(pid)) { done.add(pid); added++; } });
            saveSet(PROGRESS_KEY, done);
            updateProgress();
            toast('导入完成，新增 ' + added + ' 条');
          } catch (err) { toast('导入失败：文件格式不正确'); }
        };
        reader.readAsText(f);
        e.target.value = '';
      });
    }
    var reset = document.getElementById('reset-btn');
    if (reset) reset.addEventListener('click', function () {
      if (!done.size) { toast('还没有打卡记录'); return; }
      if (!window.confirm('确定清空全部 ' + done.size + ' 条打卡记录吗？')) return;
      done.clear();
      saveSet(PROGRESS_KEY, done);
      updateProgress();
      toast('进度已清空');
    });
  }

  /* ---------------- 完成度雷达 ---------------- */

  /* ---------------- 完成度雷达（按大纲级别 1-10） ---------------- */

  function renderRadar() {
    var svg = document.getElementById('radar');
    var S = window.AKIOI_SYLLABUS;
    if (!svg || !S || !S.nodes) return;
    var NS = 'http://www.w3.org/2000/svg';

    var stats = [];
    for (var lv = 1; lv <= 10; lv++) {
      var total = 0, hit = 0;
      S.nodes.forEach(function (n) {
        if (n.level !== lv) return;
        n.problems.forEach(function (p) { total++; if (done.has(p.pid)) hit++; });
      });
      stats.push({ key: 'L' + lv, name: lv + ' 级', total: total, hit: hit, pct: total ? hit / total : 0 });
    }
    var use = stats.filter(function (s) { return s.total > 0; });
    if (use.length < 3) use = stats;

    var c = 170, R = 116;
    svg.innerHTML = '';
    function pt(i, r) {
      var a = -Math.PI / 2 + (Math.PI * 2 * i) / use.length;
      return [c + Math.cos(a) * r, c + Math.sin(a) * r];
    }
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      var d = use.map(function (_, i) {
        var p = pt(i, R * f);
        return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1);
      }).join(' ') + ' Z';
      var ring = document.createElementNS(NS, 'path');
      ring.setAttribute('d', d);
      ring.setAttribute('class', 'radar-ring');
      svg.appendChild(ring);
    });
    use.forEach(function (_, i) {
      var p = pt(i, R);
      var line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', c); line.setAttribute('y1', c);
      line.setAttribute('x2', p[0].toFixed(1)); line.setAttribute('y2', p[1].toFixed(1));
      line.setAttribute('class', 'radar-axis');
      svg.appendChild(line);
    });
    var dvals = use.map(function (s, i) {
      var p = pt(i, R * Math.max(s.pct, 0.02));
      return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1);
    }).join(' ') + ' Z';
    var poly = document.createElementNS(NS, 'path');
    poly.setAttribute('d', dvals);
    poly.setAttribute('class', 'radar-area');
    svg.appendChild(poly);

    use.forEach(function (s, i) {
      var p = pt(i, R * Math.max(s.pct, 0.02));
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', p[0].toFixed(1));
      dot.setAttribute('cy', p[1].toFixed(1));
      dot.setAttribute('r', '3');
      dot.setAttribute('class', 'radar-dot');
      svg.appendChild(dot);

      var lab = pt(i, R + 20);
      var txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x', lab[0].toFixed(1));
      txt.setAttribute('y', lab[1].toFixed(1));
      txt.setAttribute('class', 'radar-label');
      txt.setAttribute('text-anchor', Math.abs(lab[0] - c) < 12 ? 'middle' : (lab[0] > c ? 'start' : 'end'));
      txt.setAttribute('dominant-baseline', 'middle');
      txt.textContent = s.key;
      svg.appendChild(txt);
    });

    var legend = document.getElementById('radar-legend');
    if (legend) {
      legend.innerHTML = '';
      stats.forEach(function (s) {
        var row = el('div', 'radar-row');
        row.appendChild(el('span', 'radar-key', s.key));
        row.appendChild(el('span', 'radar-name', 'NOI 大纲 ' + s.name + ' · ' + s.total + ' 题'));
        var meter = el('span', 'radar-meter');
        var fill = el('i');
        fill.style.width = Math.round(s.pct * 100) + '%';
        meter.appendChild(fill);
        row.appendChild(meter);
        row.appendChild(el('span', 'radar-pct', Math.round(s.pct * 100) + '%'));
        row.title = s.hit + '/' + s.total;
        legend.appendChild(row);
      });
    }
  }
  /* ---------------- 真题模拟 ---------------- */

  var EXAM_EXPAND = {};
  var examTick = null;

  function renderExam() {
    var EX = window.AKIOI_EXAMS || { sets: [] };
    var list = document.getElementById('exam-list');
    var run = document.getElementById('exam-run');
    if (!list) return;

    if (!EX.sets.length) {
      list.innerHTML = '<p class="empty">还没有导入套卷。</p>';
      return;
    }

    var hint = document.getElementById('exam-hint');
    if (hint) hint.textContent = '目前收录 ' + EX.sets.length + ' 套、' + EX.sets.reduce(function (n, s) { return n + s.problems.length; }, 0) + ' 道题，覆盖 CSP-J/S 与 NOIP 提高组 / 普及组。';

    var groups = [];
    EX.sets.forEach(function (s) {
      var g = groups.filter(function (x) { return x.name === s.group; })[0];
      if (!g) { g = { name: s.group, sets: [] }; groups.push(g); }
      g.sets.push(s);
    });

    groups.forEach(function (g) {
      var title = el('h2', 'exam-section-title');
      title.appendChild(el('span', null, g.name === 'CSP' ? 'CSP-J / CSP-S' : 'NOIP'));
      title.appendChild(el('span', 'exam-section-count', g.sets.length + ' 套'));
      list.appendChild(title);

      var grid = el('div', 'exam-grid');
      g.sets.slice().sort(function (a, b) { return b.year - a.year; }).forEach(function (set) {
        grid.appendChild(renderExamCard(set, run));
      });
      list.appendChild(grid);
    });
  }

  function renderExamCard(set, run) {
    var card = el('button', 'exam-card');
    card.type = 'button';

    var top = el('div', 'exam-top');
    top.appendChild(el('span', 'exam-group', set.group));
    top.appendChild(el('h2', 'exam-name', set.name));
    card.appendChild(top);

    var meta = el('div', 'exam-meta');
    meta.appendChild(el('span', 'exam-num', set.problems.length + ' 题'));
    meta.appendChild(el('span', null, set.duration + ' 分钟'));
    meta.appendChild(el('span', null, spanOf(set.problems)));
    var d = set.problems.filter(function (p) { return done.has(p.pid); }).length;
    meta.appendChild(el('span', 'exam-done', '已完成 ' + d + '/' + set.problems.length));
    card.appendChild(meta);

    var bar = el('div', 'entry-bar');
    var fill = el('i');
    fill.style.width = pct(d, set.problems.length) + '%';
    bar.appendChild(fill);
    card.appendChild(bar);

    card.addEventListener('click', function () { openExam(set, run); });
    return card;
  }

  function openExam(set, run) {
    run.hidden = false;
    run.innerHTML = '';

    var head = el('div', 'run-head');
    var titleWrap = el('div', 'run-title');
    titleWrap.appendChild(el('span', 'exam-group', set.group));
    titleWrap.appendChild(el('h2', null, set.name));
    titleWrap.appendChild(el('span', 'exam-meta-line', set.duration + ' 分钟 · ' + set.problems.length + ' 题'));
    head.appendChild(titleWrap);

    var timer = el('div', 'run-timer');
    var clock = el('strong', null, '00:00');
    clock.id = 'run-clock';
    timer.appendChild(clock);
    timer.appendChild(el('span', 'run-timer-label', '剩余时间'));
    head.appendChild(timer);
    run.appendChild(head);

    var actions = el('div', 'run-actions');
    var bStart = el('button', 'btn btn-primary btn-sm', '开始计时');
    bStart.type = 'button';
    var bPause = el('button', 'btn btn-ghost btn-sm', '暂停');
    bPause.type = 'button';
    var bReset = el('button', 'btn btn-ghost btn-sm', '重置');
    bReset.type = 'button';
    actions.appendChild(bStart);
    actions.appendChild(bPause);
    actions.appendChild(bReset);
    actions.appendChild(el('span', 'run-hint', '题目在新标签页打开，做题进度可勾选'));
    run.appendChild(actions);

    var rows = el('div', 'run-rows');
    set.problems.forEach(function (p, i) {
      var row = el('div', 'run-row');
      row.dataset.pid = p.pid;

      var check = el('button', 'check');
      check.type = 'button';
      check.setAttribute('role', 'checkbox');
      check.setAttribute('aria-checked', done.has(p.pid) ? 'true' : 'false');
      check.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>';
      check.addEventListener('click', function () {
        if (done.has(p.pid)) done.delete(p.pid); else done.add(p.pid);
        saveSet(PROGRESS_KEY, done);
        row.classList.toggle('done', done.has(p.pid));
        check.setAttribute('aria-checked', done.has(p.pid) ? 'true' : 'false');
        var dd = set.problems.filter(function (x) { return done.has(x.pid); }).length;
        if (progressText) progressText.textContent = '已完成 ' + dd + '/' + set.problems.length;
      });
      row.appendChild(check);

      row.appendChild(el('span', 'run-idx', String(i + 1)));
      row.appendChild(el('span', 'pid', p.pid));

      var t = el('div', 'ptitle');
      var a = el('a', null, p.name);
      a.href = 'https://www.luogu.com.cn/problem/' + p.pid;
      a.target = '_blank';
      a.rel = 'noopener';
      t.appendChild(a);
      row.appendChild(t);

      row.appendChild(el('span', 'diff diff-' + p.difficulty, diffName(p.difficulty)));
      rows.appendChild(row);
    });
    run.appendChild(rows);

    var progressText = el('p', 'run-progress');
    var dd = set.problems.filter(function (x) { return done.has(x.pid); }).length;
    progressText.textContent = '已完成 ' + dd + '/' + set.problems.length;
    run.appendChild(progressText);

    run.scrollIntoView({ behavior: 'smooth', block: 'start' });

    /* --- 计时器 --- */
    var storageKey = 'akioi.exam.' + set.id;
    var state = loadTimer(storageKey, set.duration);

    function save() {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ endAt: state.endAt, remaining: state.remaining, running: state.running }));
      } catch (e) {}
    }

    function paint() {
      var left = state.running ? Math.max(0, Math.round((state.endAt - Date.now()) / 1000)) : state.remaining;
      var h = Math.floor(left / 3600), m = Math.floor((left % 3600) / 60), s = left % 60;
      clock.textContent = (h > 0 ? String(h).padStart(2, '0') + ':' : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      timer.classList.toggle('running', state.running);
      timer.classList.toggle('danger', left <= 60 && left > 0);
      if (left <= 0 && state.running) {
        state.running = false;
        state.remaining = 0;
        save();
        bStart.disabled = false;
        toast('时间到！');
      }
    }

    bStart.addEventListener('click', function () {
      if (state.running) return;
      if (state.remaining <= 0) state.remaining = set.duration * 60;
      state.endAt = Date.now() + state.remaining * 1000;
      state.running = true;
      save();
      bStart.disabled = true;
      paint();
    });
    bPause.addEventListener('click', function () {
      if (!state.running) return;
      state.remaining = Math.max(0, Math.round((state.endAt - Date.now()) / 1000));
      state.running = false;
      save();
      bStart.disabled = false;
      paint();
    });
    bReset.addEventListener('click', function () {
      state.remaining = set.duration * 60;
      state.running = false;
      state.endAt = null;
      save();
      bStart.disabled = false;
      paint();
    });

    bStart.disabled = state.running;
    paint();
    if (examTick) clearInterval(examTick);
    examTick = setInterval(paint, 500);
  }

  function loadTimer(key, durationMin) {
    try {
      var s = JSON.parse(localStorage.getItem(key) || 'null');
      if (!s) return { endAt: null, remaining: durationMin * 60, running: false };
      if (s.running && s.endAt) {
        var left = Math.max(0, Math.round((s.endAt - Date.now()) / 1000));
        return { endAt: s.endAt, remaining: left, running: left > 0 };
      }
      return { endAt: null, remaining: s.remaining == null ? durationMin * 60 : s.remaining, running: false };
    } catch (e) {
      return { endAt: null, remaining: durationMin * 60, running: false };
    }
  }

  /* ---------------- 知识图谱（DAG） ---------------- */

  var DAG_COLORS = ['#60a5fa', '#a78bfa', '#f472b6', '#fbbf24', '#34d399', '#22d3ee', '#fb923c', '#c084fc', '#4ade80', '#f87171', '#38bdf8'];

  function initViewSwitch() {
    var list = document.getElementById('part-list');
    var dag = document.getElementById('dag-overlay');
    var bList = document.getElementById('view-list');
    var bDag = document.getElementById('view-dag');
    if (!list || !dag || !bList || !bDag) return;

    var built = false;
    function show(which) {
      var isDag = which === 'dag';
      dag.hidden = !isDag;
      document.body.classList.toggle('dag-open', isDag);
      if (!isDag) closeNodePanel();
      bList.classList.toggle('active', !isDag);
      bDag.classList.toggle('active', isDag);
      try { localStorage.setItem('akioi.training.view', which); } catch (e) {}
      if (isDag) {
        if (!built) { buildDag(); built = true; }
        startStars();
      } else {
        stopStars();
      }
    }
    bList.addEventListener('click', function () { show('list'); });
    bDag.addEventListener('click', function () { show('dag'); });
    var closeBtn = document.getElementById('dag-close');
    if (closeBtn) closeBtn.addEventListener('click', function () { show('list'); });
    var dpClose = document.getElementById('dp-close');
    var lvBox = document.getElementById('dag-levels');
    if (lvBox) lvBox.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-ph]') : null;
      if (!b) return;
      dagPhase = b.dataset.ph;
      Array.prototype.forEach.call(lvBox.querySelectorAll('button'), function (x) {
        x.classList.toggle('on', x === b);
      });
      buildDag();
    });
    if (dpClose) dpClose.addEventListener('click', closeNodePanel);

    var themeBtn = document.getElementById('dag-theme');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      var m = document.getElementById('meta-theme');
      if (m) m.setAttribute('content', next === 'dark' ? '#0c0e13' : '#f6f7fb');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var panel = document.getElementById('dag-panel');
      if (panel && !panel.hidden) { closeNodePanel(); return; }
      if (!dag.hidden) show('list');
    });

    var saved = 'list';
    try { saved = localStorage.getItem('akioi.training.view') || 'list'; } catch (e) {}
    show(saved);
  }

  var PHASE_COLORS = { B: '#60a5fa', P: '#a78bfa', X: '#f472b6' };
  var PHASE_NAMES = { B: '入门级', P: '提高级', X: 'NOI 级' };
  var SEC_ORDER = ['入门', '提高', 'NOI'];
  var dagPhase = 'X';
  var dagView = { x: 0, y: 0, k: 1 };
  var dagVP = null;

  function buildDag() {
    var S = window.AKIOI_SYLLABUS;
    var svg = document.getElementById('dag-svg');
    var vp = document.getElementById('dag-viewport');
    if (!svg || !vp || !S || !S.nodes) return;

    var nodes = S.nodes.map(function (n) {
      return {
        id: n.id, name: n.title, sub: n.sub, sec: n.sec, level: n.level, phase: n.phase,
        label: n.label, pre: (n.pre || []).slice(), problems: n.problems || []
      };
    });
    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });
    nodes.forEach(function (n) {
      n.pre = n.pre.filter(function (p) { return byId[p]; });
      n.hit = n.problems.filter(function (p) { return done.has(p.pid); }).length;
      n.pct = n.problems.length ? Math.round(n.hit / n.problems.length * 100) : 0;
    });

    // 等级筛选：B 只看入门，P 看入门+提高，X 全部
    var RANK = { B: 0, P: 1, X: 2 };
    var cap = RANK[dagPhase] === undefined ? 2 : RANK[dagPhase];
    nodes = nodes.filter(function (n) { return RANK[n.phase] <= cap; });
    byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });
    nodes.forEach(function (n) { n.pre = n.pre.filter(function (p) { return byId[p]; }); });
    if (!nodes.length) return;

    // 按「章节 + 小结」分组
    var groups = [];
    nodes.forEach(function (n) {
      var key = n.sec + '|' + n.sub;
      var g = null;
      for (var i = 0; i < groups.length; i++) if (groups[i].key === key) { g = groups[i]; break; }
      if (!g) { g = { key: key, sec: n.sec, sub: n.sub, items: [] }; groups.push(g); }
      g.items.push(n);
    });
    groups.sort(function (a, b) { return SEC_ORDER.indexOf(a.sec) - SEC_ORDER.indexOf(b.sec); });

    var COL = 286, ROW = 62, PAD = 34, NW = 178, NH = 52, TOP = 40;
    var maxRows = 0;
    groups.forEach(function (g) {
      g.items.sort(function (a, b) { return a.level - b.level || a.id.localeCompare(b.id); });
      maxRows = Math.max(maxRows, g.items.length);
    });

    groups.forEach(function (g, gi) {
      // 每组一个色相，区分度更高
      g.hue = Math.round((gi * 360) / groups.length);
      g.color = 'hsl(' + g.hue + ', 68%, 55%)';
      g.soft = 'hsl(' + g.hue + ', 68%, 55%, .07)';
      var offset = (maxRows - g.items.length) / 2;
      g.items.forEach(function (n, i) {
        n.color = g.color;
        n.x = PAD + gi * COL;
        n.y = PAD + TOP + (i + offset) * ROW;
        n.w = NW;
        n.h = NH;
      });
    });

    var width = PAD * 2 + Math.max(1, groups.length - 1) * COL + NW;
    var height = PAD * 2 + TOP + Math.max(1, maxRows) * ROW;

    var NS = 'http://www.w3.org/2000/svg';
    vp.innerHTML = '';

    var defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = '<marker id="dag-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker>';
    vp.appendChild(defs);

    // 每章一个框
    var gBands = document.createElementNS(NS, 'g');
    gBands.setAttribute('class', 'dag-frames');
    groups.forEach(function (g) {
      var minY = Infinity, maxY = -Infinity;
      g.items.forEach(function (n) { minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y + n.h); });
      var pad = 18;
      var frame = document.createElementNS(NS, 'rect');
      frame.setAttribute('x', g.items[0].x - pad);
      frame.setAttribute('y', minY - pad - 24);
      frame.setAttribute('width', NW + pad * 2);
      frame.setAttribute('height', (maxY - minY) + pad * 2 + 24);
      frame.setAttribute('rx', '20');
      frame.setAttribute('class', 'dag-frame');
      frame.setAttribute('fill', g.soft);
      frame.setAttribute('stroke', g.color);
      gBands.appendChild(frame);

      var head = document.createElementNS(NS, 'text');
      head.setAttribute('x', g.items[0].x - 2);
      head.setAttribute('y', minY - pad - 6);
      head.setAttribute('class', 'dag-frame-t');
      head.setAttribute('fill', g.color);
      head.textContent = g.sec + ' · ' + g.sub;
      gBands.appendChild(head);
    });
    vp.appendChild(gBands);

    var gEdges = document.createElementNS(NS, 'g');
    gEdges.setAttribute('class', 'dag-edges');
    var gNodes = document.createElementNS(NS, 'g');
    gNodes.setAttribute('class', 'dag-nodes');

    nodes.forEach(function (n) {
      n.pre.forEach(function (pid) {
        var p = byId[pid];
        if (!p) return;
        var x1 = p.x + p.w, y1 = p.y + p.h / 2;
        var x2 = n.x, y2 = n.y + n.h / 2;
        var mx = (x1 + x2) / 2;
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + mx + ',' + y1 + ' ' + mx + ',' + y2 + ' ' + x2 + ',' + y2);
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', 'url(#dag-arrow)');
        gEdges.appendChild(path);
      });
    });

    nodes.forEach(function (n) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'dag-node');
      g.setAttribute('transform', 'translate(' + n.x + ',' + n.y + ')');
      g.setAttribute('data-id', n.id);

      var rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('width', n.w);
      rect.setAttribute('height', n.h);
      rect.setAttribute('class', 'dag-box' + (n.pct === 100 ? ' is-full' : ''));
      rect.setAttribute('rx', '10');
      rect.setAttribute('stroke', n.color);
      rect.setAttribute('stroke-opacity', (0.18 + 0.82 * (n.pct / 100)).toFixed(2));
      g.appendChild(rect);

      var bar = document.createElementNS(NS, 'rect');
      bar.setAttribute('class', 'dag-bar-accent');
      bar.setAttribute('width', '6');
      bar.setAttribute('height', n.h - 10);
      bar.setAttribute('x', '0');
      bar.setAttribute('y', '5');
      bar.setAttribute('rx', '3');
      bar.setAttribute('fill', n.color);
      g.appendChild(bar);

      // 完成度圈
      var R = 9, C = 2 * Math.PI * R, cx = n.w - 20, cy = 18;
      var ringBg = document.createElementNS(NS, 'circle');
      ringBg.setAttribute('cx', cx); ringBg.setAttribute('cy', cy); ringBg.setAttribute('r', R);
      ringBg.setAttribute('class', 'dag-ring-bg');
      g.appendChild(ringBg);

      var ringFg = document.createElementNS(NS, 'circle');
      ringFg.setAttribute('cx', cx); ringFg.setAttribute('cy', cy); ringFg.setAttribute('r', R);
      ringFg.setAttribute('class', 'dag-ring-fg');
      ringFg.setAttribute('stroke', n.pct === 100 ? '#10b981' : n.color);
      ringFg.setAttribute('stroke-dasharray', C.toFixed(2));
      ringFg.setAttribute('stroke-dashoffset', (C * (1 - n.pct / 100)).toFixed(2));
      ringFg.setAttribute('transform', 'rotate(-90 ' + cx + ' ' + cy + ')');
      g.appendChild(ringFg);

      var pctText = document.createElementNS(NS, 'text');
      pctText.setAttribute('x', cx);
      pctText.setAttribute('y', cy + 3);
      pctText.setAttribute('text-anchor', 'middle');
      pctText.setAttribute('class', 'dag-pct');
      pctText.textContent = n.pct + '%';
      g.appendChild(pctText);

      var t1 = document.createElementNS(NS, 'text');
      t1.setAttribute('x', '18');
      t1.setAttribute('y', '22');
      t1.setAttribute('class', 'dag-t');
      t1.textContent = n.name.length > 10 ? n.name.slice(0, 10) + '…' : n.name;
      g.appendChild(t1);

      var t2 = document.createElementNS(NS, 'text');
      t2.setAttribute('x', '18');
      t2.setAttribute('y', '38');
      t2.setAttribute('class', 'dag-s');
      t2.textContent = n.label + ' · ' + n.problems.length + ' 题';
      g.appendChild(t2);

      var tip = document.createElementNS(NS, 'title');
      tip.textContent = n.name + '（' + n.sec + ' · ' + n.sub + '）\n' + n.label + '\n已完成 ' + n.hit + '/' + n.problems.length;
      g.appendChild(tip);

      g.addEventListener('click', function (e) { e.stopPropagation(); openNodePanel(n); });
      gNodes.appendChild(g);
    });

    vp.appendChild(gEdges);
    vp.appendChild(gNodes);

    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    // 图例：章节
    var legend = document.getElementById('dag-legend');
    if (legend) {
      legend.innerHTML = '';
      groups.forEach(function (g) {
        var item = el('span', 'dag-legend-item');
        var dot = el('i');
        dot.style.background = g.color;
        item.appendChild(dot);
        item.appendChild(el('span', null, g.sec + '·' + g.sub));
        legend.appendChild(item);
      });
    }

    var nextNode = null;
    nodes.forEach(function (n) {
      var unlocked = n.pre.every(function (pid) { var p = byId[pid]; return p ? p.pct === 100 : true; });
      if (!unlocked || n.pct === 100 || !n.problems.length) return;
      if (!nextNode) { nextNode = n; return; }
      if (n.pct > 0 && nextNode.pct === 0) { nextNode = n; return; }
      if ((n.pct > 0) === (nextNode.pct > 0) && n.level < nextNode.level) nextNode = n;
    });
    if (nextNode) {
      var g2 = gNodes.querySelector('[data-id="' + nextNode.id + '"]');
      if (g2) g2.classList.add('is-next');
      var pill = document.getElementById('dag-next');
      if (pill) {
        pill.hidden = false;
        pill.textContent = '下一步 · ' + nextNode.name;
        pill.addEventListener('click', function () { openNodePanel(nextNode); });
      }
    }

    initPanZoom(svg, vp, width, height);
  }

    function openNodePanel(n) {
    var panel = document.getElementById('dag-panel');
    if (!panel) return;
    setText('dp-mod', (n.sec || '') + ' · ' + (n.sub || ''));
    setText('dp-title', n.name || '');
    setText('dp-sub', n.label || '');
    var meta = document.getElementById('dp-meta');
    if (meta) {
      meta.innerHTML = '';
      meta.appendChild(el('span', 'dp-pill', 'NOI 大纲 ' + n.level + ' 级'));
      meta.appendChild(el('span', 'dp-pill', n.problems.length + ' 题'));
      var hit = n.problems.filter(function (p) { return done.has(p.pid); }).length;
      meta.appendChild(el('span', 'dp-pill', '已完成 ' + hit + '/' + n.problems.length));
    }

    var body = document.getElementById('dp-body');
    if (!body) return;
    body.innerHTML = '';

    if (n.pre.length) {
      var preBox = el('div', 'dp-pre');
      preBox.appendChild(el('span', 'dp-label', '前置：'));
      n.pre.forEach(function (pid) {
        (window.AKIOI_SYLLABUS.nodes || []).forEach(function (x) {
          if (x.id !== pid) return;
          var a = el('button', 'dp-pre-link', x.title);
          a.type = 'button';
          a.addEventListener('click', function () {
            openNodePanel({ id: x.id, name: x.title, sub: x.sub, sec: x.sec, level: x.level, label: x.label, pre: x.pre || [], problems: x.problems || [] });
          });
          preBox.appendChild(a);
        });
      });
      body.appendChild(preBox);
    }

    var list = el('div', 'dp-list');
    if (!n.problems.length) list.appendChild(el('p', 'dp-empty', '大纲里有这一条，但题单暂时没有对应题目。'));
    n.problems.forEach(function (p) {
      var row = el('div', 'dp-row');
      row.dataset.pid = p.pid;
      if (done.has(p.pid)) row.classList.add('done');

      var check = el('button', 'check');
      check.type = 'button';
      check.setAttribute('role', 'checkbox');
      check.setAttribute('aria-checked', done.has(p.pid) ? 'true' : 'false');
      check.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>';
      check.addEventListener('click', function () {
        if (done.has(p.pid)) done.delete(p.pid); else done.add(p.pid);
        saveSet(PROGRESS_KEY, done);
        row.classList.toggle('done', done.has(p.pid));
        check.setAttribute('aria-checked', done.has(p.pid) ? 'true' : 'false');
      });
      row.appendChild(check);
      row.appendChild(el('span', 'pid', p.pid));

      var t = el('div', 'ptitle');
      var a = el('a', null, p.name);
      a.href = 'https://www.luogu.com.cn/problem/' + p.pid;
      a.target = '_blank';
      a.rel = 'noopener';
      t.appendChild(a);
      row.appendChild(t);
      row.appendChild(el('span', 'diff diff-' + p.difficulty, diffName(p.difficulty)));
      list.appendChild(row);
    });
    body.appendChild(list);

    panel.hidden = false;
    document.body.classList.add('dag-panel-open');
  }

    function closeNodePanel() {
    var panel = document.getElementById('dag-panel');
    if (panel) panel.hidden = true;
    document.body.classList.remove('dag-panel-open');
  }
    function initPanZoom(svg, vp, width, height) {
    dagVP = vp;
    var state = dagView;
    var raf = null;
    function paintNow() {
      raf = null;
      vp.setAttribute('transform', 'translate(' + state.x + ',' + state.y + ') scale(' + state.k + ')');
    }
    function apply() {
      if (raf) return;
      raf = requestAnimationFrame(paintNow);
    }
    apply();

    var host = document.getElementById('dag-overlay');
    var MIN_K = 0.22;
    function fit() {
      var cw = host.clientWidth, chh = host.clientHeight;
      var k = Math.min(1, (cw - 24) / width, (chh - 24) / height);
      k = Math.max(MIN_K, k);
      state.k = k;
      state.x = (cw - width * k) / 2;
      state.y = (chh - height * k) / 2;
      apply();
    }
    requestAnimationFrame(fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(host);

    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      var k = state.k * (e.deltaY > 0 ? 0.92 : 1.08);
      k = Math.max(0.3, Math.min(2, k));
      var r = svg.getBoundingClientRect();
      var px = e.clientX - r.left, py = e.clientY - r.top;
      state.x = px - (px - state.x) * (k / state.k);
      state.y = py - (py - state.y) * (k / state.k);
      state.k = k;
      apply();
    }, { passive: false });

    var dragHost = svg.parentElement;
    if (dragHost && !dragHost.__panBound) {
      dragHost.__panBound = true;
      dragHost.addEventListener('pointerdown', function (e) {
        if (e.target.closest && e.target.closest('.dag-node, .dag-bar, .dag-panel')) return;
        dragHost.__drag = true;
        dragHost.__sx = e.clientX - dagView.x;
        dragHost.__sy = e.clientY - dagView.y;
        svg.classList.add('dragging');
      });
      dragHost.addEventListener('pointermove', function (e) {
        if (!dragHost.__drag) return;
        dagView.x = e.clientX - dragHost.__sx;
        dagView.y = e.clientY - dragHost.__sy;
        apply();
      });
      var stopDrag = function () { dragHost.__drag = false; svg.classList.remove('dragging'); };
      dragHost.addEventListener('pointerup', stopDrag);
      dragHost.addEventListener('pointercancel', stopDrag);
      dragHost.addEventListener('pointerleave', stopDrag);
    }

    var reset = document.getElementById('dag-reset');
    if (reset) reset.addEventListener('click', fit);
    var zin = document.getElementById('dag-zoom-in');
    var zout = document.getElementById('dag-zoom-out');
    if (zin) zin.addEventListener('click', function () { state.k = Math.min(2, state.k * 1.15); apply(); });
    if (zout) zout.addEventListener('click', function () { state.k = Math.max(0.3, state.k / 1.15); apply(); });
  }

  /* ---------------- 星空背景 ---------------- */

  var starRaf = null;
  function startStars() {
    var cv = document.getElementById('stars');
    if (!cv || starRaf) return;
    var ctx = cv.getContext('2d');
    var host = cv.parentElement;
    var stars = [];
    function resize() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = host.clientWidth * dpr;
      cv.height = host.clientHeight * dpr;
      cv.style.width = host.clientWidth + 'px';
      cv.style.height = host.clientHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = [];
      var n = Math.round((host.clientWidth * host.clientHeight) / 11000);
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * host.clientWidth,
          y: Math.random() * host.clientHeight,
          r: Math.random() * 1.3 + 0.3,
          a: Math.random(),
          sp: Math.random() * 0.018 + 0.004,
          dx: (Math.random() - 0.5) * 0.06,
          dy: Math.random() * 0.05 + 0.012
        });
      }
    }
    resize();
    var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(host);

    function frame() {
      var w = host.clientWidth, h = host.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.a += s.sp;
        var alpha = 0.35 + 0.6 * Math.abs(Math.sin(s.a));
        s.x += s.dx; s.y += s.dy;
        if (s.y > h + 2) { s.y = -2; s.x = Math.random() * w; }
        if (s.x < -2) s.x = w + 2;
        if (s.x > w + 2) s.x = -2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,' + (alpha * 0.85).toFixed(3) + ')';
        ctx.fill();
      }
      starRaf = requestAnimationFrame(frame);
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (var i = 0; i < stars.length; i++) {
        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, stars[i].r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,.45)';
        ctx.fill();
      }
      return;
    }
    starRaf = requestAnimationFrame(frame);
  }

  function stopStars() {
    if (starRaf) { cancelAnimationFrame(starRaf); starRaf = null; }
  }

  /* ---------------- 启动 ---------------- */

  function init() {
    initTheme();
    window.__akioiToast = toast;
    if (PAGE === 'home') { renderHome(); renderRadar(); }
    else if (PAGE === 'parts') { renderParts(); initViewSwitch(); }
    else if (PAGE === 'part') renderPart();
    else if (PAGE === 'exam') renderExam();
    initTransfer();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

























