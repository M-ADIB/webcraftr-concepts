/* Samovar Dubai concept site. Plain JavaScript, no libraries, no network calls.
   Order: language, WhatsApp links, room and rug tool, menu, dock, form stub, reveal. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var T = window.SAMOVAR_T || { en: {}, ar: {} };
  /* CONFIRM BEFORE LAUNCH (C3): 971000000000 is a dead demo placeholder so the concept cannot message the real showroom.
     At launch set the real line in <body data-wa> and here (see README). Never print the number as visible text. */
  var NUMBER = (doc.body.getAttribute('data-wa') || '971000000000').replace(/\D/g, '');
  var lang = root.lang === 'ar' ? 'ar' : 'en';

  function byId(id) { return doc.getElementById(id); }
  function all(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function t(key) {
    var d = T[lang] || {};
    if (d[key] != null) return d[key];
    return (T.en && T.en[key] != null) ? T.en[key] : key;
  }
  function fill(str, vars) {
    return str.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : ''; });
  }
  function waHref(text) { return 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(text); }
  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* storage can be blocked */ } }

  /* ---------- language ---------- */
  var langBtn = byId('langBtn');
  var onLang = [];

  function setMeta(sel, attr, val) {
    var n = doc.querySelector(sel);
    if (n && val != null) n.setAttribute(attr, val);
  }

  function applyLang(next, opts) {
    opts = opts || {};
    lang = next === 'ar' ? 'ar' : 'en';
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    var d = T[lang] || {};

    all('[data-i18n]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });
    all('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var i = pair.indexOf(':');
        var v = d[pair.slice(i + 1).trim()];
        if (i > 0 && v != null) el.setAttribute(pair.slice(0, i).trim(), v);
      });
    });

    if (d['meta.title']) doc.title = d['meta.title'];
    setMeta('meta[name="description"]', 'content', d['meta.desc']);
    setMeta('meta[property="og:title"]', 'content', d['meta.title']);
    setMeta('meta[property="og:description"]', 'content', d['meta.desc']);
    setMeta('meta[name="twitter:title"]', 'content', d['meta.title']);
    setMeta('meta[name="twitter:description"]', 'content', d['meta.desc']);

    if (langBtn) langBtn.setAttribute('lang', lang === 'ar' ? 'en' : 'ar');

    if (opts.persist) {
      store('samovar-lang', lang);
      try {
        var u = new URL(location.href);
        u.searchParams.set('lang', lang);
        history.replaceState(null, '', u.pathname + u.search + u.hash);
      } catch (e) { /* replaceState can be refused on some file URLs */ }
    }

    refreshWa();
    onLang.forEach(function (fn) { fn(); });
    root.classList.remove('i18n-wait');
  }

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(lang === 'ar' ? 'en' : 'ar', { persist: true });
    });
  }

  /* ---------- WhatsApp links (one number, message in the active language) ---------- */
  function refreshWa() {
    all('a[data-wa]').forEach(function (a) {
      var k = a.getAttribute('data-wa');
      if (k === 'tool') return;
      var text = k === 'wa.range'
        ? fill(t('wa.range'), { range: t(a.getAttribute('data-wa-range')) })
        : t(k);
      a.setAttribute('href', waHref(text));
    });
  }

  /* ---------- room and rug size tool ---------- */
  var SIZES = [[1.4, 2.0], [1.7, 2.4], [2.0, 3.0], [2.5, 3.5], [3.0, 4.0], [3.5, 5.0], [4.0, 6.0]];
  var MIN = 1.5, MAX = 12;
  var NS = 'http://www.w3.org/2000/svg';

  var toolRoot = byId('toolRoot');
  if (toolRoot) {
    var form = byId('toolForm');
    var wIn = byId('roomW'), lIn = byId('roomL');
    var errW = byId('errW'), errL = byId('errL');
    var plan = byId('plan'), planG = byId('planG');
    var msgEl = byId('toolMsg');
    var rSug = byId('rSug'), rSmall = byId('rSmall'), rRoom = byId('rRoom'), rRug = byId('rRug'), rCover = byId('rCover');
    var cta = byId('toolCta');
    var touched = false;
    var good = { w: 4, l: 5, m: 0.6 };
    var lastKey = null;

    var rowSug = rSug.parentNode, rowSmall = rSmall.parentNode, rowRug = rRug.parentNode, rowCover = rCover.parentNode;

    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var f1 = function (n) { return r1(n).toFixed(1); };
    var trim = function (n) { return String(r1(n)); };

    var readNum = function (inp) {
      if (inp.validity && inp.validity.badInput) return NaN;
      var v = String(inp.value).replace(',', '.').trim();
      if (v === '') return NaN;
      var n = Number(v);
      return isFinite(n) ? n : NaN;
    };
    var inRange = function (n) { return n >= MIN && n <= MAX; };
    var margin = function () {
      var c = form.querySelector('input[name="margin"]:checked');
      return c ? Number(c.value) : 0.6;
    };

    var fit = function (w, l, m) {
      var uw = w - 2 * m, ul = l - 2 * m;
      var a = Math.min(uw, ul), b = Math.max(uw, ul);
      var ok = SIZES.filter(function (s) { return s[0] <= a + 1e-9 && s[1] <= b + 1e-9; });
      return {
        sug: ok.length ? ok[ok.length - 1] : null,
        small: ok.length > 1 ? ok[ok.length - 2] : null
      };
    };

    var svgEl = function (name, attrs, text) {
      var e = doc.createElementNS(NS, name);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      if (text != null) e.textContent = text;
      return e;
    };

    var draw = function (w, l, m, res, animate) {
      var s = Math.min(340 / w, 280 / l);
      var rw = w * s, rh = l * s;
      var ox = (360 - rw) / 2, oy = (300 - rh) / 2;
      var mm = m * s;
      var unit = t('tool.unit.m');
      planG.textContent = '';
      planG.appendChild(svgEl('rect', { 'class': 'p-room', x: ox, y: oy, width: rw, height: rh }));
      if (rw - 2 * mm > 4 && rh - 2 * mm > 4) {
        planG.appendChild(svgEl('rect', { 'class': 'p-margin', x: ox + mm, y: oy + mm, width: rw - 2 * mm, height: rh - 2 * mm }));
      }
      var placed = function (size) {
        var longPx = size[1] * s, shortPx = size[0] * s;
        var pw = w >= l ? longPx : shortPx;
        var ph = w >= l ? shortPx : longPx;
        return { x: ox + (rw - pw) / 2, y: oy + (rh - ph) / 2, width: pw, height: ph };
      };
      if (res.sug) {
        var g = placed(res.sug);
        planG.appendChild(svgEl('rect', { 'class': 'p-rug' + (animate ? ' fade' : ''), x: g.x, y: g.y, width: g.width, height: g.height }));
        if (res.small) {
          var q = placed(res.small);
          planG.appendChild(svgEl('rect', { 'class': 'p-small', x: q.x, y: q.y, width: q.width, height: q.height }));
        }
        if (g.width >= 78 && g.height >= 28) {
          planG.appendChild(svgEl('text', {
            'class': 'p-rl', x: g.x + g.width / 2, y: g.y + g.height / 2 + 4, 'text-anchor': 'middle'
          }, f1(res.sug[0]) + ' × ' + f1(res.sug[1])));
        }
      }
      planG.appendChild(svgEl('text', { x: ox + rw / 2, y: oy + 15, 'text-anchor': 'middle' }, f1(w) + ' ' + unit));
      var yMid = oy + rh / 2;
      planG.appendChild(svgEl('text', {
        x: ox + 15, y: yMid, 'text-anchor': 'middle', transform: 'rotate(-90 ' + (ox + 15) + ' ' + yMid + ')'
      }, f1(l) + ' ' + unit));
    };

    var setInvalid = function (inp, err, bad) {
      if (bad) { inp.setAttribute('aria-invalid', 'true'); } else { inp.removeAttribute('aria-invalid'); }
      err.hidden = !bad;
    };

    var setNum = function (dd, text, isText) {
      dd.textContent = text;
      dd.classList.toggle('is-text', !!isText);
    };

    var render = function (animate) {
      var w = good.w, l = good.l, m = good.m;
      var res = fit(w, l, m);
      var unit = t('tool.unit.m'), unit2 = t('tool.unit.m2');
      var hasRug = !!res.sug;

      msgEl.hidden = hasRug;
      rowSug.hidden = rowSmall.hidden = rowRug.hidden = rowCover.hidden = !hasRug;
      setNum(rRoom, f1(w * l) + ' ' + unit2);
      if (hasRug) {
        var area = res.sug[0] * res.sug[1];
        setNum(rSug, f1(res.sug[0]) + ' × ' + f1(res.sug[1]) + ' ' + unit);
        if (res.small) { setNum(rSmall, f1(res.small[0]) + ' × ' + f1(res.small[1]) + ' ' + unit); }
        else { setNum(rSmall, t('tool.nosmaller'), true); }
        setNum(rRug, f1(area) + ' ' + unit2);
        setNum(rCover, Math.round(area / (w * l) * 100) + '%');
      }

      var key = hasRug ? res.sug.join('x') : 'none';
      draw(w, l, m, res, animate && key !== lastKey);
      lastKey = key;

      var label = hasRug
        ? fill(t('tool.aria.fit'), { w: trim(w), l: trim(l), rw: trim(res.sug[0]), rl: trim(res.sug[1]) })
        : fill(t('tool.aria.nofit'), { w: trim(w), l: trim(l) });
      plan.setAttribute('aria-label', label);

      var text;
      if (!touched) { text = t('wa.trial.general'); }
      else if (hasRug) {
        text = fill(t('wa.trial.sized'), { w: trim(w), l: trim(l), rw: trim(res.sug[0]), rl: trim(res.sug[1]) });
      } else {
        text = fill(t('wa.trial.nofit'), { w: trim(w), l: trim(l) });
      }
      cta.setAttribute('href', waHref(text));
    };

    var onInput = function (fromUser) {
      var w = readNum(wIn), l = readNum(lIn);
      var okW = inRange(w), okL = inRange(l);
      if (fromUser) {
        setInvalid(wIn, errW, !okW);
        setInvalid(lIn, errL, !okL);
      }
      if (okW && okL) {
        good.w = w; good.l = l;
      }
      good.m = margin();
      render(fromUser);
    };

    form.addEventListener('input', function () { touched = true; onInput(true); });
    form.addEventListener('change', function () { touched = true; onInput(true); });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    [wIn, lIn].forEach(function (inp) {
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); inp.blur(); }
      });
    });

    onLang.push(function () { render(false); });
    onInput(false);
  }

  /* ---------- menu sheet ---------- */
  var menuBtn = byId('menuBtn'), menu = byId('menu');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      root.classList.toggle('menu-open', open);
    };
    menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1080 && !menu.hidden) setMenu(false);
    });
  }

  /* ---------- sticky WhatsApp dock: after the hero buttons leave view, away from the contact block ---------- */
  var dock = byId('dock');
  if (dock) {
    var seen = { hero: true, contact: false, foot: false };
    var setDock = function () {
      dock.classList.toggle('on', !seen.hero && !seen.contact && !seen.foot);
    };
    var heroCta = doc.querySelector('.hero__cta');
    var contact = byId('contact');
    var footer = doc.querySelector('.foot');
    if ('IntersectionObserver' in window && heroCta) {
      var watch = function (node, key) {
        if (!node) return;
        new IntersectionObserver(function (es) {
          seen[key] = es[es.length - 1].isIntersecting;
          setDock();
        }, { threshold: 0 }).observe(node);
      };
      watch(heroCta, 'hero');
      watch(contact, 'contact');
      watch(footer, 'foot');
    } else {
      window.addEventListener('scroll', function () {
        seen.hero = window.pageYOffset < 480;
        setDock();
      }, { passive: true });
    }
  }

  /* ---------- form stub: nothing is sent ---------- */
  var lead = byId('leadForm');
  if (lead) {
    lead.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = byId('fHp');
      if (hp && hp.value) return;
      var name = (byId('fName').value || '').trim();
      var msg = (byId('fMsg').value || '').trim();
      var link = byId('formWa');
      var text;
      if (msg) { text = fill(t('wa.form'), { msg: msg + (name ? ' (' + name + ')' : '') }); }
      else { text = t('wa.trial.general'); }
      link.setAttribute('href', waHref(text));
      byId('formStub').hidden = false;
    });
  }

  /* ---------- reveal on scroll ---------- */
  var items = all('[data-reveal]');
  if (root.classList.contains('motion') && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- start ---------- */
  applyLang(lang, { persist: false });
})();
