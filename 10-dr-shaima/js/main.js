/* Dr Shaima Buhamer concept. Plain JavaScript, no libraries, no network calls, no cookies.
   The only thing ever stored is the language choice, under the key drs-lang. */
(function () {
  'use strict';
  window.__drsReady = true;

  var D = document, H = D.documentElement;
  var DICT = window.DRS_I18N || { en: {}, ar: {} };
  var TOK = { name: 'Dr Shaima Buhamer', clinic: 'myPediaclinic', dh: 'Dubai Health', phone: '+971 55 931 1752' };
  var TOKRE = /(\{name\}|\{clinic\}|\{dh\}|\{phone\}|\{em\}|\{\/em\})/;
  var REDUCE = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var lang = H.lang === 'ar' ? 'ar' : 'en';

  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function plain(s) { return String(s).replace(/\{\/?em\}/g, '').replace(/\{(name|clinic|dh|phone)\}/g, function (_, k) { return TOK[k]; }); }

  /* ---------- Language ---------- */
  function T(key, vars) {
    var s = (lang === 'ar' ? DICT.ar[key] : DICT.en[key]);
    if (s == null) { s = DICT.en[key] != null ? DICT.en[key] : key; }
    if (vars) { for (var k in vars) { if (Object.prototype.hasOwnProperty.call(vars, k)) { s = s.split('{' + k + '}').join(vars[k]); } } }
    return s;
  }

  /* Put a string into an element. Latin names become bdi elements so they never flip.
     {em}...{/em} wraps the accent words of a heading, matching the em in the English markup. */
  function fill(el, s) {
    if (el.tagName === 'OPTION' || !TOKRE.test(s)) { el.textContent = plain(s); return; }
    el.textContent = '';
    var host = el;
    s.split(TOKRE).forEach(function (part) {
      if (!part) { return; }
      if (part === '{em}') { host = el.appendChild(D.createElement('em')); return; }
      if (part === '{/em}') { host = el; return; }
      var m = part.match(/^\{(name|clinic|dh|phone)\}$/);
      if (m) {
        var b = D.createElement('bdi');
        b.setAttribute('dir', 'ltr'); b.setAttribute('lang', 'en'); b.textContent = TOK[m[1]];
        host.appendChild(b);
      } else { host.appendChild(D.createTextNode(part)); }
    });
  }

  function cacheEl(el) {
    if (el.hasAttribute('data-i18n') && el.__en === undefined) { el.__en = el.innerHTML; }
    var at = el.getAttribute('data-i18n-attr');
    if (at && !el.__enA) {
      el.__enA = {};
      at.split('|').forEach(function (pair) { var a = pair.split(':')[0].trim(); el.__enA[a] = el.getAttribute(a); });
    }
  }

  function applyEl(el, l) {
    cacheEl(el);
    var key = el.getAttribute('data-i18n');
    if (key) {
      if (l === 'en') { el.innerHTML = el.__en; }
      else {
        var s = DICT.ar[key];
        if (s != null) {
          s = s.replace('{n}', el.getAttribute('data-n') || '').replace('{i}', el.getAttribute('data-i') || '');
          fill(el, s);
        }
      }
    }
    var at = el.getAttribute('data-i18n-attr');
    if (at) {
      at.split('|').forEach(function (pair) {
        var p = pair.split(':'), a = p[0].trim(), k = p[1].trim();
        if (l === 'en') { if (el.__enA[a] != null) { el.setAttribute(a, el.__enA[a]); } }
        else if (DICT.ar[k] != null) { el.setAttribute(a, plain(DICT.ar[k])); }
      });
    }
  }

  function applyAll(root, l) {
    $$('[data-i18n],[data-i18n-attr]', root).forEach(function (el) { applyEl(el, l); });
  }

  var langBtn = $('#langToggle');

  function setLang(l, persist) {
    lang = l;
    H.lang = l; H.dir = l === 'ar' ? 'rtl' : 'ltr';
    H.classList.toggle('lang-ar', l === 'ar');
    applyAll(D, l);
    D.title = l === 'ar' ? DICT.ar['meta.title'] : DICT.en['meta.title'];
    if (langBtn) { langBtn.setAttribute('lang', l === 'ar' ? 'en' : 'ar'); }
    refreshScrubber();
    if (persist) {
      try { localStorage.setItem('drs-lang', l); } catch (e) {}
      try { var u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u.toString()); } catch (e2) {}
    }
  }

  function switchLang(l) {
    if (REDUCE) { setLang(l, true); return; }
    H.classList.add('lang-fade');
    setTimeout(function () {
      setLang(l, true);
      requestAnimationFrame(function () { H.classList.remove('lang-fade'); });
    }, 130);
  }

  /* ---------- Age scrubber ---------- */
  var slider = $('#age'), readout = $('#readout'), rNum = $('#rNum'), live = $('#scrubLive');
  var chips = $$('.chip'), bands = $$('.band'), noteEl = $('#note'), bookAge = $('#bookAge');
  var BANDS = [[0, 0], [1, 2], [3, 5], [6, 8], [9, 12], [13, 15], [16, 18]];
  var age = 4, curBand = 0, liveTimer = 0;

  function bandOf(a) {
    for (var i = 0; i < BANDS.length; i++) { if (a >= BANDS[i][0] && a <= BANDS[i][1]) { return i + 1; } }
    return 3;
  }
  function bandTitle(b) { var h = $('#band-' + b + ' h3'); return h ? h.textContent : ''; }
  function ageLabel(a) {
    if (a === 0) { return T('age.0'); }
    if (a === 1) { return T('age.1'); }
    if (a === 2) { return T('age.2'); }
    return T(a <= 10 ? 'age.few' : 'age.many', { n: a });
  }
  function noteText(a) { return plain(T('msg.template', { age: ageLabel(a) })); }
  function valueText(a, b) {
    return a === 0 ? T('scrub.vt.first', { band: bandTitle(b) }) : T('scrub.vt.age', { n: a, band: bandTitle(b) });
  }

  function render(a, silent) {
    a = Math.max(0, Math.min(18, Math.round(Number(a))));
    if (isNaN(a)) { a = 4; }
    age = a;
    var b = bandOf(a);
    if (slider) {
      if (String(slider.value) !== String(a)) { slider.value = a; }
      slider.style.setProperty('--p', (a / 18).toFixed(4));
      slider.setAttribute('aria-valuetext', valueText(a, b));
    }
    if (readout && rNum) {
      readout.classList.toggle('is-first', a === 0);
      rNum.textContent = a === 0 ? T('scrub.first') : String(a);
    }
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(parseInt(c.getAttribute('data-first'), 10) === BANDS[b - 1][0])); });
    var changed = b !== curBand;
    bands.forEach(function (el, i) {
      var on = (i + 1 === b);
      el.hidden = !on;
      el.classList.toggle('cur', on);
      if (on && changed && !silent && curBand !== 0 && !REDUCE) {
        el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap');
      }
    });
    if (changed && !silent && curBand !== 0 && live) {
      clearTimeout(liveTimer);
      liveTimer = setTimeout(function () { live.textContent = T('scrub.live', { band: bandTitle(b), i: b }); }, 400);
    }
    curBand = b;
    if (noteEl) { noteEl.value = noteText(a); }
    if (bookAge && String(bookAge.value) !== String(a)) { bookAge.value = String(a); }
  }
  function refreshScrubber() { render(age, true); }

  if (slider) {
    slider.addEventListener('input', function () { render(slider.value); });
    slider.addEventListener('keydown', function (e) {
      var k = e.key, next = null;
      if (k === 'Home') { next = 0; }
      else if (k === 'End') { next = 18; }
      else if (k === 'PageUp') { next = Math.min(18, age + 3); }
      else if (k === 'PageDown') { next = Math.max(0, age - 3); }
      if (next !== null) { e.preventDefault(); render(next); }
    });
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () { render(parseInt(c.getAttribute('data-first'), 10)); });
  });
  if (bookAge) { bookAge.addEventListener('change', function () { render(bookAge.value); }); }

  /* ---------- Copy the note ---------- */
  function legacyCopy(text) {
    var ta = D.createElement('textarea'), ok = false;
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0';
    D.body.appendChild(ta); ta.select();
    try { ok = D.execCommand('copy'); } catch (e) { ok = false; }
    D.body.removeChild(ta);
    return ok;
  }
  function flash(btn, key, ms) {
    var lbl = $('.lbl', btn); if (!lbl) { return; }
    clearTimeout(btn.__t);
    lbl.textContent = T(key);
    btn.__t = setTimeout(function () { lbl.textContent = T(btn.getAttribute('data-lbl')); }, ms);
  }
  function wireCopy(btn, statusEl) {
    if (!btn) { return; }
    btn.addEventListener('click', function () {
      var text = noteText(age);
      function done(ok) {
        clearTimeout(statusEl && statusEl.__t);
        if (ok) { flash(btn, 'scrub.copy.done', 2000); if (statusEl) { statusEl.textContent = ''; } }
        else if (statusEl) {
          statusEl.textContent = T('scrub.copy.fail');
          statusEl.__t = setTimeout(function () { statusEl.textContent = ''; }, 8000);
        }
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(legacyCopy(text)); });
      } else { done(legacyCopy(text)); }
    });
  }
  wireCopy($('#copyScrub'), $('#copyStatus'));
  wireCopy($('#copyBook'), $('#copyStatusBook'));

  /* ---------- Library capture drawers ---------- */
  var tplCap = $('#tpl-capture'), tplStub = $('#tpl-stub');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var openBtn = null, capN = 0;

  function setI18n(el, key) {
    el.setAttribute('data-i18n', key);
    el.__en = DICT.en[key] != null ? DICT.en[key] : key;
    applyEl(el, lang);
  }

  function closeDrawer(btn, refocus) {
    if (!btn) { return; }
    var cap = D.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', 'false');
    if (cap) {
      cap.classList.remove('open');
      setTimeout(function () { if (!cap.classList.contains('open')) { cap.firstElementChild.textContent = ''; } }, 420);
    }
    if (openBtn === btn) { openBtn = null; }
    if (refocus) { btn.focus(); }
  }

  function showStub(cap, btn) {
    var inner = cap.firstElementChild;
    inner.textContent = '';
    var frag = tplStub.content.cloneNode(true);
    inner.appendChild(frag);
    applyAll(inner, lang);
    var close = $('[data-cap-close]', inner);
    if (close) { close.addEventListener('click', function () { closeDrawer(btn, true); }); close.focus(); }
  }

  function openDrawer(btn, focusInput) {
    if (!tplCap) { return; }
    if (openBtn && openBtn !== btn) { closeDrawer(openBtn, false); }
    var cap = D.getElementById(btn.getAttribute('aria-controls'));
    if (!cap) { return; }
    var inner = cap.firstElementChild;
    inner.textContent = '';
    inner.appendChild(tplCap.content.cloneNode(true));
    capN += 1;
    var form = $('form', inner), input = $('input[type="email"]', inner), label = $('label.fl', inner), err = $('.err', inner);
    input.id = 'cap-email-' + capN; label.setAttribute('for', input.id);
    err.id = 'cap-err-' + capN;
    applyAll(inner, lang);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = form.elements['company_site'];
      if (hp && hp.value) { showStub(cap, btn); return; }
      var v = input.value.trim(), key = null;
      if (!v) { key = 'lib.err.empty'; } else if (!EMAIL_RE.test(v)) { key = 'lib.err.bad'; }
      if (key) {
        setI18n(err, key);
        input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', err.id);
        input.focus();
        return;
      }
      showStub(cap, btn);
    });
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid')) {
        input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby');
        err.removeAttribute('data-i18n'); err.textContent = '';
      }
    });
    $('[data-cap-close]', inner).addEventListener('click', function () { closeDrawer(btn, true); });
    cap.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    openBtn = btn;
    if (focusInput !== false) {
      requestAnimationFrame(function () { input.focus({ preventScroll: !!focusInput && focusInput === 'quiet' }); });
    }
  }

  $$('[data-cap]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-expanded') === 'true') { closeDrawer(btn, true); } else { openDrawer(btn, true); }
    });
  });

  /* ---------- FAQ accordion ---------- */
  var accItems = $$('.acc-item');
  accItems.forEach(function (item) {
    var q = $('.acc-q', item);
    q.addEventListener('click', function () {
      var willOpen = q.getAttribute('aria-expanded') !== 'true';
      accItems.forEach(function (o) { o.classList.remove('open'); $('.acc-q', o).setAttribute('aria-expanded', 'false'); });
      if (willOpen) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- Header, menu ---------- */
  var hdr = $('#hdr'), menu = $('#menu'), menuBtn = $('#menuBtn');
  function onScroll() { if (hdr) { hdr.classList.toggle('scrolled', window.pageYOffset > 40); } }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* While the menu is open the page behind it is inert and Tab loops through the header controls and the menu. */
  var behind = [$('#main'), $('.foot'), $('#sticky')];
  function trapSet() {
    var sel = 'a[href], button:not([disabled])', out = [];
    $$(sel, hdr).concat($$(sel, menu)).forEach(function (el) { if (el.offsetParent !== null || el === menuBtn) { out.push(el); } });
    return out;
  }
  function trapKey(e) {
    if (e.key !== 'Tab' || !menu.classList.contains('open')) { return; }
    var set = trapSet(); if (!set.length) { return; }
    var first = set[0], last = set[set.length - 1], at = D.activeElement;
    if (set.indexOf(at) === -1) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && at === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  }

  function setMenu(open, refocus) {
    if (!menu || !menuBtn) { return; }
    menu.classList.toggle('open', open);
    menu.inert = !open;
    behind.forEach(function (el) { if (el) { el.inert = open; } });
    menuBtn.setAttribute('aria-expanded', String(open));
    D.body.classList.toggle('menu-open', open);
    if (open) { var a = $('a', menu); if (a) { a.focus(); } }
    else if (refocus) { menuBtn.focus(); }
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true', false); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) { setMenu(false, false); } });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1100) { setMenu(false, false); } });
  }

  if (langBtn) { langBtn.addEventListener('click', function () { switchLang(lang === 'ar' ? 'en' : 'ar'); }); }

  D.addEventListener('keydown', trapKey);
  D.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    if (menu && menu.classList.contains('open')) { setMenu(false, true); return; }
    if (openBtn) { closeDrawer(openBtn, true); }
  });

  /* ---------- Sticky call bar ---------- */
  var sticky = $('#sticky'), heroOut = false, covered = false, seen = false;
  function syncSticky() { if (sticky) { sticky.classList.toggle('show', heroOut && !covered); } }
  if (sticky) {
    if ('IntersectionObserver' in window) {
      var hero = $('#top'), cover = {};
      new IntersectionObserver(function (es) { seen = true; heroOut = !es[0].isIntersecting; syncSticky(); }, { threshold: 0 }).observe(hero);
      var io2 = new IntersectionObserver(function (es) {
        es.forEach(function (e) { cover[e.target.id] = e.isIntersecting; });
        covered = !!(cover.library || cover.book); syncSticky();
      }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });
      io2.observe($('#library')); io2.observe($('#book'));
      setTimeout(function () { if (!seen) { heroOut = window.pageYOffset > window.innerHeight; syncSticky(); } }, 1500);
    } else { setTimeout(function () { sticky.classList.add('show'); }, 1500); }
  }

  /* ---------- Reveal on scroll ---------- */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && H.classList.contains('motion')) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(function (el) { io.observe(el); });
  } else { rvs.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Start ---------- */
  $$('[data-i18n],[data-i18n-attr]').forEach(cacheEl);
  DICT.en['meta.title'] = D.title;
  if (lang === 'ar') { setLang('ar', false); } else { render(4, true); }
  if (menu) { menu.inert = true; }
})();
