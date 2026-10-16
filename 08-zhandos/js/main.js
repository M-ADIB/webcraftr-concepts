/* Dos, Dubai Creek Harbour. No framework, no build step.
 * Order: language, reveal and count-up, header scene and sticky bar (one rAF loop),
 * the Creek Harbour estimator, hero button, contact form stub, FAQ fallback. */
(function () {
  'use strict';

  // CONFIRM BEFORE LAUNCH (C1): WhatsApp number. This is the fake 971000000000. The same number is in every wa.me href in index.html.
  var WA = 'https://wa.me/971000000000';

  var root = document.documentElement;
  var D = window.I18N || { en: {}, ru: {} };
  var lang = root.getAttribute('data-lang') === 'ru' ? 'ru' : 'en';
  var motion = root.classList.contains('motion');
  var NBSP = String.fromCharCode(160);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function t(key) {
    var l = D[lang] || {};
    if (Object.prototype.hasOwnProperty.call(l, key)) { return l[key]; }
    return (D.en && D.en[key]) || '';
  }

  /* ---------- text helpers ---------- */
  // "*word*" in a dictionary string becomes the accent word (wave underline).
  function setText(el, str) {
    if (str.indexOf('*') === -1) { el.textContent = str; return; }
    el.textContent = '';
    str.split('*').forEach(function (part, i) {
      if (!part) { return; }
      if (i % 2 === 1) {
        var em = document.createElement('em');
        em.className = 'ac';
        em.textContent = part;
        el.appendChild(em);
      } else {
        el.appendChild(document.createTextNode(part));
      }
    });
  }

  function setMeta(sel, val) {
    var m = $(sel);
    if (m && val) { m.setAttribute('content', val); }
  }

  /* ---------- WhatsApp links ---------- */
  function waHref(text) {
    return WA + '?text=' + encodeURIComponent(text.split(NBSP).join(' '));
  }
  function waText(kind) {
    return t('msg.' + kind) + ' ' + t('msg.close');
  }
  function refreshWaLinks() {
    $$('[data-wa]').forEach(function (a) {
      a.setAttribute('href', waHref(waText(a.getAttribute('data-wa'))));
    });
  }

  /* ---------- language ---------- */
  var langBtn = $('#langBtn');

  function applyLang(l, persist) {
    lang = l === 'ru' ? 'ru' : 'en';
    root.lang = lang;
    root.setAttribute('data-lang', lang);
    $$('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v) { setText(el, v); }
    });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var p = pair.split(':');
        if (p.length === 2) {
          var v = t(p[1].trim());
          if (v) { el.setAttribute(p[0].trim(), v); }
        }
      });
    });
    document.title = t('meta.title');
    setMeta('meta[name="description"]', t('meta.description'));
    setMeta('meta[property="og:title"]', t('meta.og.title'));
    setMeta('meta[property="og:description"]', t('meta.og.description'));
    setMeta('meta[name="twitter:title"]', t('meta.og.title'));
    setMeta('meta[name="twitter:description"]', t('meta.og.description'));
    if (langBtn) { langBtn.setAttribute('lang', lang === 'en' ? 'ru' : 'en'); }
    var size = $('#size');
    if (size) { size.setAttribute('placeholder', lang === 'ru' ? '1 100' : '1,100'); }
    refreshWaLinks();
    renderEstimate(false);
    if (persist) {
      try { localStorage.setItem('dos-lang', lang); } catch (e) {}
      try {
        var u = new URL(location.href);
        u.searchParams.set('lang', lang);
        history.replaceState(null, '', u.pathname + u.search + u.hash);
      } catch (e) {}
    }
    root.classList.remove('i18n-pending');
  }

  if (langBtn) {
    langBtn.addEventListener('click', function () { applyLang(lang === 'en' ? 'ru' : 'en', true); });
  }

  /* ---------- estimator ---------- */
  var form = $('#estimate');
  var harbour = $('#harbour');
  var sendBtn = $('#send');
  var sizeInput = $('#size');
  var live = $('#liveMsg');
  var segs = {};
  $$('.seg', form || document).forEach(function (s) { segs[s.getAttribute('data-seg')] = s; });
  var st = { unit: '', view: '', size: '' };
  var windows = $$('#harbour .lit:not(.lit-v) .w');
  var vwin = $$('#harbour .lit-v .w');
  var liveTimer = 0;
  var lastText = { base: '', unit: '', view: '', size: '', close: '' };

  function groupDigits(d) {
    var sep = lang === 'ru' ? NBSP : ',';
    return d.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  }

  function parts() {
    var out = { base: t('msg.base'), unit: '', view: '', size: '', close: t('msg.close') };
    if (st.unit) { out.unit = t('msg.unit').replace('{v}', t('msg.unit.' + st.unit)); }
    if (st.view) { out.view = t('msg.view').replace('{v}', t('msg.view.' + st.view)); }
    if (st.size && parseInt(st.size, 10) >= 100) { out.size = t('msg.size').replace('{v}', groupDigits(st.size)); }
    return out;
  }

  function renderEstimate(fromInput) {
    if (!form) { return; }
    var p = parts();
    ['base', 'unit', 'view', 'size', 'close'].forEach(function (k) {
      var el = segs[k];
      if (!el) { return; }
      var text = p[k];
      if (!text) { el.hidden = true; el.textContent = ''; lastText[k] = ''; return; }
      var changed = lastText[k] !== text;
      el.hidden = false;
      if (changed) {
        el.textContent = text;
        if (fromInput && motion && k !== 'base' && k !== 'close') {
          el.classList.remove('swap');
          void el.offsetWidth;
          el.classList.add('swap');
        }
        lastText[k] = text;
      }
    });
    var full = [p.base, p.unit, p.view, p.size, p.close].filter(Boolean).join(' ');
    if (sendBtn) { sendBtn.setAttribute('href', waHref(full)); }
    if (live) {
      clearTimeout(liveTimer);
      liveTimer = setTimeout(function () { live.textContent = full.split(NBSP).join(' '); }, fromInput ? 600 : 0);
    }
    // drawing state
    if (harbour) {
      // Studio to 3 bedroom light 1 to 4 windows in the tower. Villa or townhouse lights the low block on the left instead.
      var n = { studio: 1, '1br': 2, '2br': 3, '3br': 4 }[st.unit] || 0;
      var villa = st.unit === 'villa';
      harbour.setAttribute('data-unit', st.unit);
      harbour.setAttribute('data-view', st.view);
      harbour.setAttribute('data-n', String(villa ? 4 : n));
      windows.forEach(function (w, i) { w.classList.toggle('on', i < n); });
      vwin.forEach(function (w) { w.classList.toggle('on', villa); });
    }
  }

  var shimTimer = 0;
  if (form) {
    form.addEventListener('change', function (e) {
      var el = e.target;
      if (!el || el.type !== 'radio') { return; }
      st[el.name] = el.value;
      if (el.name === 'view' && harbour && motion) {
        clearTimeout(shimTimer);
        harbour.classList.remove('shim');
        void harbour.offsetWidth;
        if (el.value === 'lagoon') {
          harbour.classList.add('shim');
          shimTimer = setTimeout(function () { harbour.classList.remove('shim'); }, 950);
        }
      }
      renderEstimate(true);
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }
  if (sizeInput) {
    sizeInput.addEventListener('input', function () {
      var d = sizeInput.value.replace(/\D/g, '').slice(0, 5);
      st.size = d;
      sizeInput.value = groupDigits(d);
      renderEstimate(true);
    });
    sizeInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (sendBtn) { sendBtn.focus(); }
      }
    });
  }

  // Draw-in is a one-time load animation. After it, drop the animation so state changes can restyle freely.
  if (harbour) {
    setTimeout(function () { harbour.classList.add('drawn'); }, motion ? 2300 : 0);
  }

  /* ---------- hero button: go to the card, focus the first option, pulse once ---------- */
  var heroCta = $('#heroCta');
  if (heroCta && form) {
    heroCta.addEventListener('click', function (e) {
      e.preventDefault();
      form.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'center' });
      var first = $('input[name="unit"]', form);
      setTimeout(function () {
        if (first) { first.focus({ preventScroll: true }); }
        if (motion) {
          form.classList.remove('pulse');
          void form.offsetWidth;
          form.classList.add('pulse');
          setTimeout(function () { form.classList.remove('pulse'); }, 700);
        }
      }, motion ? 450 : 0);
    });
  }

  /* ---------- reveal on scroll and count-up ---------- */
  var revealEls = $$('.rv, .rf, .band-art');
  var hasIO = 'IntersectionObserver' in window;
  if (!motion || !hasIO) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  function easeOutQuart(x) { return 1 - Math.pow(1 - x, 4); }
  $$('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (!motion || !hasIO || isNaN(target)) { return; }
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        cio.unobserve(el);
        var t0 = performance.now();
        (function tick(now) {
          var k = Math.min(1, (now - t0) / 1300);
          el.textContent = String(Math.round(target * easeOutQuart(k)));
          if (k < 1) { requestAnimationFrame(tick); } else { el.textContent = String(target); }
        })(t0);
      });
    }, { threshold: 0.6 });
    cio.observe(el);
  });

  /* ---------- header scene swap and sticky bar: one rAF loop ---------- */
  var hdr = $('#hdr');
  var hero = $('#top');
  var contact = $('#contact');
  var band = $('#band');
  var sticky = $('#sticky');
  var scenes = $$('[data-scene]');
  var queued = false;

  function nearView(el) {
    if (!el) { return false; }
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.9 && r.bottom > 0;
  }

  function frame() {
    queued = false;
    var y = 40, cur = 'dark';
    for (var i = 0; i < scenes.length; i++) {
      var r = scenes[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { cur = scenes[i].getAttribute('data-scene'); break; }
    }
    var hs = cur === 'light' ? 'light' : 'dark';
    if (hdr && hdr.getAttribute('data-hs') !== hs) { hdr.setAttribute('data-hs', hs); }
    if (sticky && hero) {
      var heroGone = hero.getBoundingClientRect().bottom < 0;
      /* The bar steps aside wherever the page already shows a full WhatsApp call to action: the band and the contact section. */
      var show = heroGone && !nearView(contact) && !nearView(band);
      if (sticky.classList.contains('show') !== show) {
        sticky.classList.toggle('show', show);
        if (show) { sticky.removeAttribute('inert'); } else { sticky.setAttribute('inert', ''); }
      }
    }
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);

  /* ---------- contact form: honest stub, composes a WhatsApp message ---------- */
  var cf = $('#contactForm');
  if (cf) {
    var nameI = $('#cf-name'), unitI = $('#cf-unit'), contactI = $('#cf-contact');
    var errEl = $('#cf-err'), stub = $('#cf-stub'), stubSend = $('#cf-send'), editBtn = $('#cf-edit');
    var hpI = $('input[name="company"]', cf);

    var dropClause = function (tpl, token) {
      return tpl.replace(new RegExp('\\s*[^.!?]*\\{' + token + '\\}\\.?'), '');
    };

    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (hpI && hpI.value) { return; }
      var name = nameI.value.trim();
      if (!name) {
        errEl.hidden = false;
        nameI.setAttribute('aria-invalid', 'true');
        nameI.focus();
        return;
      }
      errEl.hidden = true;
      nameI.removeAttribute('aria-invalid');
      var vals = { name: name, unit: unitI.value.trim(), contact: contactI.value.trim() };
      var tpl = t('msg.form');
      if (!vals.unit) { tpl = dropClause(tpl, 'unit'); }
      if (!vals.contact) { tpl = dropClause(tpl, 'contact'); }
      var msg = tpl.replace(/\{(name|unit|contact)\}/g, function (m, k) { return vals[k]; }) + ' ' + t('msg.close');
      stubSend.setAttribute('href', waHref(msg));
      cf.setAttribute('data-state', 'stub');
      stub.hidden = false;
      stub.focus();
    });
    nameI.addEventListener('input', function () {
      if (nameI.value.trim()) { errEl.hidden = true; nameI.removeAttribute('aria-invalid'); }
    });
    editBtn.addEventListener('click', function () {
      cf.setAttribute('data-state', 'edit');
      stub.hidden = true;
      nameI.focus();
    });
  }

  /* ---------- FAQ: one open at a time, also where the name attribute is not supported ---------- */
  var faqs = $$('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) { return; }
      faqs.forEach(function (o) { if (o !== d) { o.open = false; } });
    });
  });

  /* ---------- start ---------- */
  applyLang(lang, false);
  queue();
})();
