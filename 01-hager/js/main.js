/* Beat Fitness Dubai: page behaviour.
   Reveal, count-up, statement strip, sticky bar, booking links, track tabs, the 12-week rail,
   language switch, the Calendly frame and the two honest form stubs. */

/* The one place the real booking links go. Empty means "not connected yet".
   book15: when filled, the Calendly calendar appears inside the frame in #book and every Book button scrolls to it.
   book45: when filled, the "Book the assessment" button opens it in a new tab. Empty, it scrolls to #book.
   Email and Instagram sit under the frame in both states.
   CONFIRM BEFORE LAUNCH (B1, B2): paste Hager's Calendly links here. The only third-party request this site
   can ever make is the calendly.com embed, and only once book15 is set. */
var BEAT_CONFIG = {
  book15: '',
  book45: '',
  email: 'hager@beatfitness.me',
  instagram: 'https://www.instagram.com/hager_aboutaleb/'
};

(function () {
  'use strict';

  var root = document.documentElement;
  var I = window.BeatI18n;
  var reduce = root.classList.contains('no-motion');
  var HAS_IO = 'IntersectionObserver' in window;
  var state = { track: 'unbeatable' };

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function safe(fn) {
    try { fn(); } catch (e) { if (window.console && console.warn) console.warn('beat:', e); }
  }

  /* Reveal: 28px rise, 6px blur, once. Stagger by order inside one batch. */
  function initReveal() {
    var els = $$('[data-reveal]');
    if (reduce || !HAS_IO) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      var k = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.setProperty('--i', Math.min(k++, 5));
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Count-up: 1300ms easeOutQuart at 60% visible. Final numbers stay in the HTML. */
  function initCount() {
    var els = $$('[data-count]');
    if (reduce || !HAS_IO || !els.length) return;
    function run(el) {
      var to = parseFloat(el.getAttribute('data-count')) || 0;
      var t0 = performance.now(), dur = 1300;
      (function frame(now) {
        var p = Math.min(1, (now - t0) / dur);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(frame);
      })(t0);
    }
    els.forEach(function (el) { el.textContent = '0'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        run(e.target);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Statement strip: loops, pauses on the button and when off screen. */
  function initStrip() {
    var strip = $('#strip'), btn = $('#strip-toggle');
    if (!strip || !btn) return;
    var paused = false;
    function label() {
      var txt = I.t(paused ? 'strip.play' : 'strip.pause');
      btn.setAttribute('aria-label', txt);
      btn.title = txt;
    }
    btn.addEventListener('click', function () {
      paused = !paused;
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      strip.classList.toggle('is-paused', paused);
      label();
    });
    if (HAS_IO) {
      new IntersectionObserver(function (es) {
        strip.classList.toggle('is-off', !es[0].isIntersecting);
      }).observe(strip);
    }
    label();
    document.addEventListener('beat:lang', label);
  }

  /* Sticky bar: shows once the hero has gone, hides on #book, the footer and while typing. */
  function initSticky() {
    var bar = $('#stickybar'), hero = $('#hero'), book = $('#book'), foot = $('#footer');
    if (!bar) return;
    var s = { gone: false, book: false, foot: false, typing: false };
    function upd() { bar.classList.toggle('show', s.gone && !s.book && !s.foot && !s.typing); }
    if (hero && HAS_IO) {
      new IntersectionObserver(function (es) {
        var e = es[0];
        s.gone = !e.isIntersecting && e.boundingClientRect.top < 0;
        upd();
      }).observe(hero);
    } else {
      setTimeout(function () { s.gone = true; upd(); }, 1500);
    }
    if (book && HAS_IO) {
      new IntersectionObserver(function (es) { s.book = es[0].intersectionRatio >= 0.2; upd(); }, { threshold: [0, 0.2, 0.4] }).observe(book);
    }
    if (foot && HAS_IO) {
      new IntersectionObserver(function (es) { s.foot = es[0].isIntersecting; upd(); }).observe(foot);
    }
    document.addEventListener('focusin', function (e) {
      s.typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName); upd();
    });
    document.addEventListener('focusout', function () { s.typing = false; upd(); });
  }

  /* Booking links. Mail links carry the prefilled message. Book buttons scroll to the frame in #book,
     except the 45 minute button, which opens its own link once one is set. */
  function refreshLinks() {
    var subj = I.t('msg.subject');
    var body = I.t('msg.body.' + state.track) + ' ';
    $$('[data-mail]').forEach(function (a) {
      a.href = 'mailto:' + BEAT_CONFIG.email + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
    });
    $$('[data-book]').forEach(function (a) {
      var ext = a.getAttribute('data-book') === '45' && BEAT_CONFIG.book45;
      if (ext) {
        a.href = BEAT_CONFIG.book45;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      } else {
        a.href = '#book';
        a.removeAttribute('target');
        a.removeAttribute('rel');
      }
    });
  }
  function initBooking() {
    refreshLinks();
    document.addEventListener('beat:lang', refreshLinks);
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('[data-book]') : null;
      if (!a) return;
      var tr = a.getAttribute('data-track');
      if (tr) { state.track = tr; refreshLinks(); }
      if (a.getAttribute('href') === '#book') {
        var cal = $('#cal');
        if (cal) {
          cal.classList.remove('is-flash');
          void cal.offsetWidth;
          setTimeout(function () { cal.classList.add('is-flash'); }, 350);
        }
      }
    });
  }

  /* Calendly frame. With book15 empty the designed stub stays and nothing is requested.
     With book15 set the iframe is created once #book is close to the screen, so a visitor who never
     scrolls that far never loads calendly.com. */
  function initCalendar() {
    var body = $('#cal-body'), stub = $('#book-stub'), cal = $('#cal'), open = $('#cal-open'), book = $('#book');
    var base = BEAT_CONFIG.book15;
    if (!body || !stub || !cal || !base) return;
    var made = false;
    function mount() {
      if (made) return;
      made = true;
      var f = document.createElement('iframe');
      f.id = 'cal-embed';
      f.className = 'cal-embed';
      f.title = I.t('book.embed.title');
      f.loading = 'lazy';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.src = base + (base.indexOf('?') < 0 ? '?' : '&') + 'embed_type=Inline&hide_gdpr_banner=1&embed_domain=' + encodeURIComponent(location.hostname || 'localhost');
      body.appendChild(f);
      stub.hidden = true;
      cal.classList.add('is-live');
      if (open) { open.href = base; open.hidden = false; }
    }
    if (HAS_IO && book) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); mount(); }
      }, { rootMargin: '600px 0px' });
      io.observe(book);
    } else {
      mount();
    }
    document.addEventListener('beat:lang', function () {
      var f = $('#cal-embed');
      if (f) f.title = I.t('book.embed.title');
    });
  }

  /* Track tabs: ARIA tabs, selection follows focus. */
  function initTracks() {
    var tabs = $$('#track-tabs [role="tab"]'), panels = $$('.track-panel');
    var sect = $('#tracks');
    if (!tabs.length || tabs.length !== panels.length) return;
    function select(i, user, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
      });
      if (user) {
        state.track = tabs[i].getAttribute('data-track') || 'unbeatable';
        refreshLinks();
      }
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { select(k, true, false); });
    });
    $('#track-tabs').addEventListener('keydown', function (e) {
      var cur = tabs.indexOf(document.activeElement);
      if (cur < 0) return;
      var dir = root.dir === 'rtl' ? -1 : 1, to = null;
      if (e.key === 'ArrowRight') to = cur + dir;
      else if (e.key === 'ArrowLeft') to = cur - dir;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = tabs.length - 1;
      else return;
      e.preventDefault();
      select(Math.max(0, Math.min(tabs.length - 1, to)), true, true);
    });
    select(0, false, false);
    if (sect) sect.classList.add('tracks-ready');
  }

  /* The 12-week rail. Without script the plain list stays visible. */
  function initWeeks() {
    var rail = $('#rail'), panel = $('#wk-panel'), prog = $('#program'), status = $('#wk-status');
    if (!rail || !panel || !prog) return;
    var cur = 0, tok = 0, btns = [];
    for (var w = 1; w <= 12; w++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.id = 'wk-' + w;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'wk-panel');
      b.setAttribute('aria-selected', 'false');
      b.tabIndex = -1;
      b.textContent = pad(w);
      b.setAttribute('data-w', String(w));
      rail.appendChild(b);
      btns.push(b);
    }
    function labels() {
      btns.forEach(function (b, k) { b.setAttribute('aria-label', I.t('prog.tab.aria', { n: k + 1 })); });
    }
    /* One placeholder frame stands in for every week until Hager supplies the content. */
    function markup(w) {
      return '<div class="wk-inner"><div class="wk-id"><span class="wk-n num">' + pad(w) + '</span>' +
        '<span class="wk-label label">' + I.html('prog.week.label', { n: w }) + '</span></div>' +
        '<div class="wk-body"><p class="ph ph-block wk-frame">' + I.html('prog.frame.ph') + '</p></div></div>';
    }
    function select(w, user, focus) {
      if (w === cur) { if (focus) btns[w - 1].focus(); return; }
      var first = cur === 0;
      cur = w;
      btns.forEach(function (b, k) {
        var on = k + 1 === w;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        b.classList.toggle('is-done', k + 1 < w);
      });
      panel.setAttribute('aria-labelledby', 'wk-' + w);
      var my = ++tok;
      var old = panel.firstElementChild;
      if (first || reduce || !old) {
        panel.innerHTML = markup(w);
      } else {
        old.classList.add('is-swapping');
        setTimeout(function () {
          if (my !== tok) return;
          panel.innerHTML = markup(w);
          var inner = panel.firstElementChild;
          inner.classList.add('is-swapping');
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { inner.classList.remove('is-swapping'); });
          });
        }, 240);
      }
      if (user && status) status.textContent = I.t('prog.status', { n: w });
      if (focus) btns[w - 1].focus();
    }
    rail.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-w]') : null;
      if (b) select(parseInt(b.getAttribute('data-w'), 10), true, false);
    });
    rail.addEventListener('keydown', function (e) {
      var dir = root.dir === 'rtl' ? -1 : 1, to = null;
      if (e.key === 'ArrowRight') to = cur + dir;
      else if (e.key === 'ArrowLeft') to = cur - dir;
      else if (e.key === 'Home') to = 1;
      else if (e.key === 'End') to = 12;
      else return;
      e.preventDefault();
      select(Math.max(1, Math.min(12, to)), true, true);
    });
    document.addEventListener('beat:lang', function () {
      labels();
      if (cur) { tok++; panel.innerHTML = markup(cur); }
      if (status) status.textContent = '';
    });
    labels();
    select(1, false, false);
    prog.classList.add('weeks-ready');
  }

  /* Keyword: copy the word, then open Instagram. */
  function initKeyword() {
    var btn = $('#kw-copy'), out = $('#kw-status'), word = $('#kw-word');
    if (!btn || !out) return;
    function done(ok) {
      out.textContent = I.t(ok ? 'kw.copy.done' : 'kw.copy.fail');
    }
    function selectWord() {
      if (!word || !window.getSelection) return false;
      var r = document.createRange();
      r.selectNodeContents(word);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      try { return document.execCommand('copy'); } catch (e) { return false; }
    }
    btn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('UNBEATABLE').then(function () { done(true); }, function () { done(selectWord()); });
      } else {
        done(selectWord());
      }
    });
  }

  /* Email form stub: posts nowhere until data-endpoint is filled. */
  function initForm() {
    var form = $('#kw-form'), out = $('#kw-result');
    if (!form || !out) return;
    function show(key, kind, linkify) {
      var h = I.html(key);
      if (linkify) {
        h = h.replace(BEAT_CONFIG.email, '<a class="link" href="mailto:' + BEAT_CONFIG.email + '">' + BEAT_CONFIG.email + '</a>')
          .replace('@hager_aboutaleb', '<a class="link" href="' + BEAT_CONFIG.instagram + '" target="_blank" rel="noopener noreferrer">@hager_aboutaleb</a>');
      }
      out.innerHTML = h;
      out.setAttribute('data-state', kind);
    }
    function send(ep, email, attempt) {
      fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ email: email, source: 'beat-keyword' }) })
        .then(function (r) {
          if (!r.ok) throw new Error('bad status');
          show('kw.form.ok', 'ok');
          form.reset();
        })
        .catch(function () {
          if (attempt < 1) { setTimeout(function () { send(ep, email, attempt + 1); }, 1500); }
          else show('kw.form.fail', 'err');
        });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (form.elements.email.value || '').trim();
      if (form.elements.bt_trap && form.elements.bt_trap.value) {
        /* The hidden field was filled, so this is a bot or a stray autofill. Send nothing and never claim
           success: the visitor sees the honest "did not go through" line instead of a fake "sent". */
        show('kw.form.fail', 'err');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        show('kw.form.invalid', 'err');
        form.elements.email.focus();
        return;
      }
      var ep = form.getAttribute('data-endpoint') || '';
      if (!ep) { show('kw.form.stub', 'err', true); return; }
      send(ep, email, 0);
    });
  }

  /* Language switch: ink curtain, swap at the midpoint, no reload. */
  function initLang() {
    var btn = $('#lang-btn'), curtain = $('.curtain');
    if (!btn) return;
    function swap(l) {
      I.apply(l);
      try { localStorage.setItem('beat-lang', l); } catch (e) { /* storage can be blocked */ }
    }
    btn.addEventListener('click', function () {
      var next = I.lang() === 'ar' ? 'en' : 'ar';
      if (reduce || !curtain) { swap(next); return; }
      curtain.style.transformOrigin = 'bottom';
      curtain.classList.add('in');
      setTimeout(function () {
        swap(next);
        curtain.style.transformOrigin = 'top';
        curtain.classList.remove('in');
      }, 230);
    });
  }

  safe(initLang);
  safe(initBooking);
  safe(initCalendar);
  safe(initTracks);
  safe(initWeeks);
  safe(initKeyword);
  safe(initForm);
  safe(initStrip);
  safe(initSticky);
  safe(initCount);
  safe(initReveal);
  window.__beatReady = true;
})();
