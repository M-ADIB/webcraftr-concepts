/* Plan D concept site. Vanilla JS, no dependencies.
   1. Language toggle (EN and AR) driven by data-i18n and js/i18n.js
   2. Scroll reveal
   3. Sticky call bar
   4. The PROGRAM comment demo in the hero
   5. Form stub that never pretends to send */
(function () {
  'use strict';

  var root = document.documentElement;
  var DICT = window.PLAND_I18N || { en: {}, ar: {} };
  var motion = root.classList.contains('motion');
  var WA = 'https://wa.me/971507572808?text=';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------------------------------------------------------------
     1. Language
     The head script already set lang and dir. EN lives in the HTML, so
     only a switch away from EN needs the dictionary. Latin tokens inside
     Arabic text are isolated with bdi so punctuation does not jump sides.
     --------------------------------------------------------------- */
  var LATIN = /(Plan D Wellbeing Sport Coaching Services|Plan D|PROGRAM|hello@pland\.ae|@plandhealth|\+971 50 757 2808|1:1|Webcraftr)/g;
  var texts = $$('[data-i18n]');
  var attrs = $$('[data-i18n-attr]');
  var langBtn = $('#lang');
  var langTxt = $('#lang-txt');
  var reel = $('#reel');
  var ctl = $('#reel-ctl');

  function dict(lang) { return DICT[lang] || DICT.en; }

  function applyLang(lang, keepText) {
    var d = dict(lang);
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    /* keepText: the page already shows this language (EN on first load) */
    if (!keepText) texts.forEach(function (el) {
      var v = d[el.getAttribute('data-i18n')];
      if (v == null) { return; }
      if (el.tagName === 'TITLE') { el.textContent = v; }
      else { el.innerHTML = lang === 'ar' ? v.replace(LATIN, '<bdi dir="ltr">$1</bdi>') : v; }
    });

    /* data-i18n-attr="aria-label:key|content:other.key" */
    if (!keepText) attrs.forEach(function (el) {
      el.getAttribute('data-i18n-attr').split('|').forEach(function (pair) {
        var i = pair.indexOf(':');
        var v = d[pair.slice(i + 1)];
        if (i > 0 && v != null) { el.setAttribute(pair.slice(0, i), v); }
      });
    });

    /* The toggle names the language you will switch TO, written in that language */
    if (langTxt) { langTxt.setAttribute('lang', lang === 'ar' ? 'en' : 'ar'); }

    /* WhatsApp links carry a prefilled message in the active language */
    var href = WA + encodeURIComponent(d['wa.prefill'] || dict('en')['wa.prefill']);
    $$('.wa-link').forEach(function (a) { a.setAttribute('href', href); });

    labelCtl();
  }

  function switchLang() {
    var next = root.lang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('pland-lang', next); } catch (e) {}
    /* Keep a ?lang= in the address bar honest so a reload does not undo the switch */
    try {
      if (/[?&]lang=/.test(location.search)) {
        var u = new URL(location.href);
        u.searchParams.set('lang', next);
        history.replaceState(null, '', u);
      }
    } catch (e) {}
    if (!motion) { applyLang(next); return; }
    root.classList.add('lang-fade');
    setTimeout(function () {
      applyLang(next);
      root.classList.remove('lang-fade');
    }, 240);
  }

  if (langBtn) { langBtn.addEventListener('click', switchLang); }

  /* ---------------------------------------------------------------
     2. Reveal
     Rise 28px, blur 6px to 0. Hidden states exist only under .motion in
     the stylesheet, so a failure here can never leave text invisible.
     --------------------------------------------------------------- */
  var rv = $$('.rv');
  if (motion && 'IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { revealIO.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------------------------------------------------------
     3. Sticky call bar
     On once the hero has left the screen, off again while #call is in view.
     --------------------------------------------------------------- */
  var sticky = $('#sticky');
  var hero = $('#hero');
  var callSec = $('#call');
  if (sticky && hero && callSec && 'IntersectionObserver' in window) {
    var heroOut = false, callIn = false;
    var stickyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === hero) { heroOut = !e.isIntersecting; }
        if (e.target === callSec) { callIn = e.isIntersecting; }
      });
      sticky.classList.toggle('on', heroOut && !callIn);
    }, { threshold: 0 });
    stickyIO.observe(hero);
    stickyIO.observe(callSec);
  } else if (sticky) {
    sticky.classList.add('on');
  }

  /* ---------------------------------------------------------------
     4. The PROGRAM comment demo
     The markup is authored in its final state (posted, replied, DM open,
     all three rows ticked), which is what no-JS and reduced motion see.
     Under .motion this resets it to idle and plays it once, about six
     seconds, with a Skip and Replay control. Classes are cumulative,
     the stylesheet turns each one into a visible change.
     --------------------------------------------------------------- */
  var STAGES = ['s-send', 's-posted', 's-replied', 's-dm', 's-n1', 's-n2', 's-n3'];
  var WORD = 'PROGRAM';
  var field = $('#reel-field');
  var typed = reel && $('.typed', reel);
  var timers = [];
  var started = false;

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function setState(s) { reel.setAttribute('data-state', s); labelCtl(); }
  function stage(cls, state) { reel.classList.add(cls); if (state) { setState(state); } }
  function clearInput() { typed.textContent = ''; field.classList.remove('has-text'); }

  function labelCtl() {
    if (!ctl || !reel) { return; }
    var done = reel.getAttribute('data-state') === 'done';
    ctl.setAttribute('aria-label', dict(root.lang)[done ? 'reel.replay.aria' : 'reel.skip.aria'] || '');
  }

  function resetReel() {
    clearTimers();
    STAGES.forEach(function (c) { reel.classList.remove(c); });
    clearInput();
    setState('idle');
  }

  function finishReel() {
    clearTimers();
    STAGES.forEach(function (c) { reel.classList.add(c); });
    clearInput();
    setState('done');
  }

  function playReel() {
    resetReel();
    for (var i = 0; i < WORD.length; i++) {
      (function (n) {
        later(function () {
          if (n === 0) { field.classList.add('has-text'); setState('typing'); }
          typed.textContent = WORD.slice(0, n + 1);
        }, 500 + n * 110);
      })(i);
    }
    later(function () { stage('s-send', 'send'); }, 1720);
    later(function () { clearInput(); stage('s-posted', 'posted'); }, 1860);
    later(function () { stage('s-replied', 'replied'); }, 3060);
    later(function () { stage('s-dm', 'dm'); }, 3700);
    later(function () { stage('s-n1', 'next'); }, 4500);
    later(function () { stage('s-n2'); }, 5100);
    later(function () { stage('s-n3'); }, 5700);
    later(function () { setState('done'); }, 6100);
    later(finishReel, 9000); /* failsafe */
  }

  if (reel && field && typed) {
    if (motion) {
      resetReel();
      if (ctl) {
        ctl.hidden = false;
        ctl.addEventListener('click', function () {
          if (reel.getAttribute('data-state') === 'done') { playReel(); } else { finishReel(); }
        });
      }
      /* Clicking the input replays it once it has finished, a mouse convenience only */
      field.addEventListener('click', function () {
        if (reel.getAttribute('data-state') === 'done') { playReel(); }
      });
      if ('IntersectionObserver' in window) {
        var reelIO = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting && !started) {
            started = true;
            reelIO.disconnect();
            later(playReel, 400);
          }
        }, { threshold: 0.4 });
        reelIO.observe(reel);
      } else {
        finishReel();
      }
    }
  }

  /* ---------------------------------------------------------------
     5. Form stub
     Nothing is sent anywhere. A visible, honest note replaces any success
     message, and a filled honeypot is dropped without a trace.
     --------------------------------------------------------------- */
  var form = $('#lead-form');
  if (form) {
    var nameIn = $('#f-name'), mailIn = $('#f-email');
    var nameErr = $('#e-name'), mailErr = $('#e-email');
    var stub = $('#stub');
    var honey = $('input[name="website"]', form);

    var flag = function (input, err, bad) {
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      err.hidden = !bad;
    };
    nameIn.addEventListener('input', function () { flag(nameIn, nameErr, false); });
    mailIn.addEventListener('input', function () { flag(mailIn, mailErr, false); });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (honey && honey.value) { return; }
      var badName = !nameIn.value.trim();
      var badMail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailIn.value.trim());
      flag(nameIn, nameErr, badName);
      flag(mailIn, mailErr, badMail);
      if (badName) { nameIn.focus(); return; }
      if (badMail) { mailIn.focus(); return; }
      stub.hidden = false;
      stub.focus();
    });
  }

  /* ---------------------------------------------------------------
     Start
     --------------------------------------------------------------- */
  var startLang = root.lang === 'ar' ? 'ar' : 'en';
  applyLang(startLang, startLang === 'en');
  root.classList.remove('i18n-wait');
})();
