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

  var PAGE = document.body.getAttribute('data-page') || 'home';
  var BASE = document.body.getAttribute('data-base') || '';
  var RING_C = 2 * Math.PI * 52;

  var done = loadSet(PROGRESS_KEY);
  var expandedTopics = loadSet(EXPANDED_TOPIC_KEY);
  var filters = { q: '', diff: 'all', hideDone: false };

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
  }

  function renderTopic(t) {
    var card = el('section', 'group collapsed');
    card.dataset.topic = t.id;

    var head = el('div', 'group-head');
    head.appendChild(el('h3', 'group-title-text', t.name));
    head.appendChild(el('span', 'count', t.problems.length + ' 题'));
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

    EX.sets.forEach(function (set) {
      var card = el('button', 'exam-card');
      card.type = 'button';

      var top = el('div', 'exam-top');
      top.appendChild(el('span', 'exam-group', set.group));
      top.appendChild(el('h2', 'exam-name', set.name));
      top.appendChild(el('span', 'exam-count', set.problems.length + ' 题'));
      card.appendChild(top);

      var meta = el('div', 'exam-meta');
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
      list.appendChild(card);
    });
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

  /* ---------------- 启动 ---------------- */

  function init() {
    initTheme();
    window.__akioiToast = toast;
    if (PAGE === 'home') renderHome();
    else if (PAGE === 'parts') renderParts();
    else if (PAGE === 'part') renderPart();
    else if (PAGE === 'exam') renderExam();
    initTransfer();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
