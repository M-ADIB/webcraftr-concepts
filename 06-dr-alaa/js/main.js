/*
 * Dr Alaa Aljameel concept page. Behaviour only.
 *   1. Language (Arabic default, English toggle in place, no reload)
 *   2. Concern selector: one shared WhatsApp message for every link on the page
 *   3. Pause control for the quiet disc behind the hero card
 *   4. WhatsApp demo sheet (while the page is a concept every WhatsApp button opens it and nothing leaves the page)
 *   5. Reveal on scroll, mobile bottom bar, reels strip, honest form stub
 * Strings live in js/dictionary.js. The Arabic strings are also in index.html, so the page reads with no JS.
 */
(function () {
  'use strict';

  var T = window.DRA_T;
  /* Demo mode: while this is empty, every WhatsApp button opens the #demo sheet and no wa.me link exists on the page.
     CONFIRM BEFORE LAUNCH: the clinic line below is the one in the qualification note. Set WA_LIVE_BASE to it only after
     Dr Alaa and the clinic owner agree on the number and who answers it:
     var WA_LIVE_BASE = 'https://wa.me/966593338893'; */
  var WA_LIVE_BASE = '';
  var STORE_KEY = 'dralaa-lang';
  var root = document.documentElement;
  var motion = root.classList.contains('motion');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var state = { lang: root.lang === 'en' ? 'en' : 'ar', concern: '', age: '', paused: false };

  function t(key) {
    var d = T && T[state.lang];
    return d && d[key] != null ? d[key] : '';
  }

  /* ---------- Message: greeting + chosen concern + optional age + closing, in the current language ---------- */
  function buildMessage(o) { // o = { concern, age } builds a fixed example, as in the hero card
    var concern = o ? o.concern : state.concern;
    var age = o ? o.age : state.age;
    var parts = [t('msg.greet')];
    if (concern) parts.push(t('msg.' + concern));
    if (age) parts.push(t('msg.age').replace('{a}', age));
    parts.push(t('msg.close'));
    return parts.filter(Boolean).join(' ');
  }
  function waHref(text) { return WA_LIVE_BASE + '?text=' + encodeURIComponent(text); }

  function renderMessage() {
    var msg = buildMessage();
    if (WA_LIVE_BASE) { // live mode only: demo mode keeps href="#demo" and sends nothing
      var href = waHref(msg);
      $$('[data-wa]').forEach(function (a) {
        a.setAttribute('href', href); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
      });
    }
    $$('[data-msg]').forEach(function (el) {
      var fixed = el.getAttribute('data-msg'); // data-msg="c3" is a fixed example, a bare data-msg follows the chosen chip
      el.textContent = '“' + (fixed ? buildMessage({ concern: fixed, age: '' }) : msg) + '”';
      el.lang = state.lang;
      el.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    });
  }

  /* ---------- Answer panel ---------- */
  function renderPanel() {
    var title, text;
    if (!state.concern) {
      title = t('worry.idle.title');
      text = t('worry.idle.text');
    } else {
      var n = state.concern.slice(1);
      title = t('worry.' + state.concern);
      text = t('worry.b' + n);
    }
    $('#panel-title').textContent = title;
    $('#panel-answer').textContent = text;
    renderMessage();
  }

  var swapTimer = 0;
  function swapPanel(done) {
    var box = $('#panel-in');
    clearTimeout(swapTimer);
    if (!motion) { renderPanel(); if (done) done(); return; }
    box.classList.add('out'); // 120ms out, 120ms in
    swapTimer = setTimeout(function () { renderPanel(); box.classList.remove('out'); if (done) done(); }, 120);
  }

  function initConcern() {
    $$('input[name="concern"]').forEach(function (r) {
      r.addEventListener('change', function () {
        state.concern = r.value;
        // On a phone the panel sits below the chips: once the new answer is in (it can be taller than the old one), make sure it is on screen. Focus never moves.
        swapPanel(function () {
          if (window.innerWidth < 900) {
            $('#panel-live').scrollIntoView({ block: 'nearest', behavior: motion ? 'smooth' : 'auto' });
          }
        });
      });
    });
    var age = $('#age');
    var live = $('#panel-live');
    age.addEventListener('input', function () {
      live.setAttribute('aria-live', 'off'); // typing must not re-announce the whole panel on each key
      state.age = age.value.replace(/\s+/g, ' ').trim();
      renderMessage();
    });
    age.addEventListener('blur', function () { live.setAttribute('aria-live', 'polite'); });
  }

  /* ---------- Hero backdrop: the disc breathes quietly behind the card. The button stops it (WCAG 2.2.2) ---------- */
  function renderPause() {
    var btn = $('#pause');
    if (btn) btn.textContent = t(state.paused ? 'hero.circle.play' : 'hero.circle.pause');
  }

  function initPause() {
    var btn = $('#pause'), box = $('#hero-proof');
    if (!btn || !box || !motion) return;
    btn.addEventListener('click', function () {
      state.paused = !state.paused;
      box.classList.toggle('paused', state.paused);
      renderPause();
    });
  }

  /* ---------- WhatsApp demo sheet: shows the built message, copies it, never opens a chat ---------- */
  var demoText = '';

  function openDemo(text) {
    var dlg = $('#demo');
    if (!dlg) return;
    demoText = text;
    var box = $('#demo-msg');
    box.textContent = text;
    box.lang = state.lang;
    box.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    $('#demo-status').textContent = '';
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else { dlg.setAttribute('open', ''); }
  }

  function closeDemo() {
    var dlg = $('#demo');
    if (!dlg) return;
    if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
  }

  function copyDemo() {
    var status = $('#demo-status');
    var done = function () { status.textContent = t('demo.copied'); };
    var fallback = function () { // no clipboard API (older Safari, file://): select the text and try the old command
      try {
        var range = document.createRange();
        range.selectNodeContents($('#demo-msg'));
        var sel = window.getSelection();
        sel.removeAllRanges(); sel.addRange(range);
        if (document.execCommand && document.execCommand('copy')) { done(); return; }
      } catch (e) { /* fall through to the message below */ }
      status.textContent = t('demo.copyfail');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(demoText).then(done, fallback);
    else fallback();
  }

  function initDemo() {
    var dlg = $('#demo');
    if (!dlg) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-wa], #stub-wa') : null;
      if (!a || WA_LIVE_BASE) return; // live mode: these are real links
      e.preventDefault();
      openDemo(a.dataset.waText || buildMessage());
    });
    $('#demo-copy').addEventListener('click', copyDemo);
    $('#demo-close').addEventListener('click', closeDemo);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDemo(); }); // a click on the backdrop
    dlg.addEventListener('close', function () { $('#demo-status').textContent = ''; });
  }

  /* ---------- Language ---------- */
  function setMeta(sel, attr, val) { var el = $(sel); if (el && val) el.setAttribute(attr, val); }

  function applyLang(lang) {
    var d = T && T[lang];
    if (!d) return;
    state.lang = lang;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    $$('[data-i18n]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n')];
      if (v == null) return;
      if (el.hasAttribute('data-html')) el.innerHTML = v; else el.textContent = v;
    });
    $$('[data-i18n-ph]').forEach(function (el) {
      var v = d['ph:' + el.getAttribute('data-i18n-ph')];
      if (v != null) el.setAttribute('placeholder', v);
    });
    $$('[data-i18n-aria]').forEach(function (el) {
      var v = d['aria:' + el.getAttribute('data-i18n-aria')];
      if (v != null) el.setAttribute('aria-label', v);
    });

    document.title = d['meta.title'];
    setMeta('meta[name="description"]', 'content', d['meta.desc']);
    setMeta('meta[property="og:title"]', 'content', d['meta.title']);
    setMeta('meta[property="og:description"]', 'content', d['meta.desc']);
    setMeta('meta[property="og:locale"]', 'content', lang === 'ar' ? 'ar_SA' : 'en_US');
    setMeta('meta[name="twitter:title"]', 'content', d['meta.title']);
    setMeta('meta[name="twitter:description"]', 'content', d['meta.desc']);

    $('#lang').lang = lang === 'ar' ? 'en' : 'ar'; // the button is written in the other language

    renderPanel();
    renderPause();
    syncReelsControls();
    root.classList.remove('i18n-pending');
  }

  function initLang() {
    $('#lang').addEventListener('click', function () {
      var next = state.lang === 'ar' ? 'en' : 'ar';
      var go = function () {
        applyLang(next);
        try { localStorage.setItem(STORE_KEY, next); } catch (e) { /* private window: the choice just won't be kept */ }
        try { history.replaceState(null, '', '?lang=' + next + location.hash); } catch (e) { /* file:// */ }
        document.body.classList.remove('lang-fade');
      };
      if (motion) { document.body.classList.add('lang-fade'); setTimeout(go, 120); } else { go(); }
    });
  }

  /* ---------- Reveal on scroll (M2): .in is added once, then the element is released ---------- */
  function initReveal() {
    var els = $$('.rv');
    if (!motion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    var hero = $('#top');
    els.forEach(function (el) {
      if (hero && hero.contains(el)) {
        // The first screen reveals on load. The bottom rootMargin would hold back the proof strip pinned at its edge.
        requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
      } else {
        io.observe(el);
      }
    });
  }

  /* ---------- Mobile bottom bar (M4): shown once the hero has left the screen, hidden over the booking section ---------- */
  function initSticky() {
    var bar = $('#sticky'), hero = $('#top'), book = $('#book');
    if (!bar || !hero) return;
    if (!('IntersectionObserver' in window)) { setTimeout(function () { bar.classList.add('on'); }, 1500); return; }
    var heroIn = true, bookIn = false;
    var update = function () { bar.classList.toggle('on', !heroIn && !bookIn); };
    new IntersectionObserver(function (e) { heroIn = e[e.length - 1].isIntersecting; update(); }).observe(hero);
    if (book) new IntersectionObserver(function (e) { bookIn = e[e.length - 1].isIntersecting; update(); }).observe(book);
  }

  /* ---------- Reels strip: a real scroll container. In RTL scrollLeft runs negative, so "next" moves left ---------- */
  function syncReelsControls() {
    var strip = $('#reels-strip'), ctl = $('#reels-ctl');
    if (!strip || !ctl) return;
    ctl.hidden = !(strip.scrollWidth > strip.clientWidth + 8);
  }

  function initReels() {
    var strip = $('#reels-strip');
    if (!strip) return;
    $$('[data-reel-dir]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = $('.reel', strip);
        var gap = parseFloat(getComputedStyle($('.reels-track', strip)).columnGap) || 20;
        var step = card.getBoundingClientRect().width + gap;
        var forward = btn.getAttribute('data-reel-dir') === 'next';
        var dir = (forward ? 1 : -1) * (state.lang === 'ar' ? -1 : 1);
        strip.scrollBy({ left: dir * step, behavior: motion ? 'smooth' : 'auto' });
      });
    });
    window.addEventListener('resize', syncReelsControls);
    syncReelsControls();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncReelsControls);
  }

  /* ---------- In-page links: smooth only when motion is allowed (the skip link keeps native behaviour) ---------- */
  function initAnchors() {
    if (!motion) return;
    $$('a[href^="#"]:not(.skip):not([data-wa]):not(#stub-wa)').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = id && document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try { history.replaceState(null, '', '#' + id); } catch (err) { /* file:// */ }
      });
    });
  }

  /* ---------- Form stub (M7): sends nothing, says so, offers WhatsApp instead ---------- */
  function initForm() {
    var form = $('#book-form'), stub = $('#stub'), link = $('#stub-wa');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.company_website.value) return; // honeypot: bots fill it, drop silently
      var typed = form.elements.message.value.replace(/\s+/g, ' ').trim();
      var age = form.elements.age.value.replace(/\s+/g, ' ').trim();
      var text = typed || buildMessage();
      if (typed && age) text += ' ' + t('msg.age').replace('{a}', age);
      link.dataset.waText = text; // the demo sheet shows this text
      if (WA_LIVE_BASE) { link.setAttribute('href', waHref(text)); link.setAttribute('target', '_blank'); link.setAttribute('rel', 'noopener'); }
      stub.hidden = false;
    });
  }

  /* ---------- Start ---------- */
  initReveal();
  if (T) {
    initLang();
    initConcern();
    initPause();
    initDemo();
    initSticky();
    initReels();
    initAnchors();
    initForm();
    applyLang(state.lang);
  } else {
    // dictionary failed to load: the static Arabic page still works, only the toggle and selector are inert
    root.classList.remove('i18n-pending');
    initSticky();
  }
})();
