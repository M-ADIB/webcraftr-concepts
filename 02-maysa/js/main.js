/* Maysa Piller, concept site by Webcraftr.
   No dependencies and no network calls. Dynamic strings mirror the keys in COPY.md. */
(function () {
  "use strict";

  // Tells the head script the page booted, so its 4 second fallback stays quiet.
  window.__maysa = true;

  var root = document.documentElement;
  var still = root.classList.contains("no-motion");

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var WA = "https://wa.me/971529888575?text=";

  /* ---------- Hero entrance ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add("is-ready"); });
  });

  /* ---------- Scroll reveal ---------- */
  (function () {
    var items = $$("[data-reveal]");
    if (still || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Header state and mobile menu ---------- */
  var header = $("#site-header");
  var sheet = $("#menu-sheet");
  var menuBtn = $("#menu-btn");
  var menuLabel = $("#menu-label");
  var sheetTimer = 0;
  // Everything outside the header and the sheet goes inert while the menu is open,
  // so Tab and screen readers cannot reach the page behind the overlay.
  var behind = [$("#main"), $(".site-footer"), $("#sticky"), $(".skip")].filter(Boolean);

  function headerState() {
    header.classList.toggle("is-scrolled", window.scrollY > 80);
  }

  function menuIsOpen() { return menuBtn.getAttribute("aria-expanded") === "true"; }

  // Header controls and the sheet links, in page order. Tab loops through these only.
  function trapNodes() {
    return $$("a[href], button", header).concat($$("a[href]", sheet)).filter(function (el) {
      return el.getClientRects().length > 0;
    });
  }

  function setMenu(open, returnFocus) {
    clearTimeout(sheetTimer);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuLabel.textContent = open ? "Close" : "Menu";
    header.classList.toggle("menu-open", open);
    root.classList.toggle("lock", open);
    behind.forEach(function (el) {
      if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert");
    });
    if (open) {
      sheet.hidden = false;
      requestAnimationFrame(function () { sheet.classList.add("is-open"); });
      var first = $("a", sheet);
      if (first) first.focus({ preventScroll: true });
    } else {
      sheet.classList.remove("is-open");
      sheetTimer = setTimeout(function () { sheet.hidden = true; }, still ? 0 : 280);
      if (returnFocus) menuBtn.focus({ preventScroll: true });
    }
  }

  menuBtn.addEventListener("click", function () {
    setMenu(!menuIsOpen(), true);
  });
  // A link tap leaves focus to the page jump it triggers.
  $$("a", sheet).forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (!menuIsOpen()) return;
    if (e.key === "Escape") { setMenu(false, true); return; }
    if (e.key !== "Tab") return;
    var nodes = trapNodes();
    if (!nodes.length) return;
    var lead = nodes[0];
    var tail = nodes[nodes.length - 1];
    var at = document.activeElement;
    var inside = nodes.indexOf(at) !== -1;
    if (e.shiftKey && (at === lead || !inside)) { e.preventDefault(); tail.focus(); }
    else if (!e.shiftKey && (at === tail || !inside)) { e.preventDefault(); lead.focus(); }
  });
  window.matchMedia("(min-width: 1120px)").addEventListener("change", function (e) {
    if (e.matches && menuIsOpen()) setMenu(false);
  });

  /* ---------- Dubai clock ---------- */
  (function () {
    var clock = $("#clock");
    var out = $("#clock-time");
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Dubai"
      });
    } catch (err) { return; }
    function tick() { out.textContent = fmt.format(new Date()); }
    tick();
    clock.hidden = false;
    // Reduced motion gets one static reading, no ticking.
    if (!still) setInterval(tick, 15000);
  })();

  /* ---------- Hero tide pause ---------- */
  (function () {
    var btn = $("#tide-btn");
    var fig = $("#horizon");
    var icon = $("#tide-icon");
    btn.addEventListener("click", function () {
      var paused = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", paused ? "true" : "false");
      var label = paused ? "Play tide animation" : "Pause tide animation";
      btn.setAttribute("aria-label", label);
      btn.title = label;
      icon.setAttribute("href", paused ? "#i-play" : "#i-pause");
      fig.classList.toggle("is-paused", paused);
    });
  })();

  /* ---------- Questions accordion, one open at a time ---------- */
  (function () {
    var items = $$(".faq__item");
    items.forEach(function (item) {
      var btn = $("button", item);
      btn.addEventListener("click", function () {
        var willOpen = btn.getAttribute("aria-expanded") !== "true";
        items.forEach(function (other) {
          var open = other === item && willOpen;
          other.classList.toggle("is-open", open);
          $("button", other).setAttribute("aria-expanded", open ? "true" : "false");
        });
      });
    });
  })();

  /* ---------- Investor profile qualifier (the signature interaction) ---------- */
  (function () {
    var builder = $("#builder");
    var panel = $("#panel");
    var ta = $("#msg");
    var send = $("#wa-send");
    var sendLabel = $("#wa-label");
    var copyBtn = $("#copy");
    var copyFail = $("#copy-fail");
    var sendFail = $("#send-fail");
    var clearBtn = $("#clear");
    var count = $("#count");
    var live = $("#live");
    var baseIn = $("#p-base");
    var hp = $("#p-hp");

    var HEAD = "Hello Maysa, I found your page and would like to request a private consultation.";
    var TAIL = "Please let me know a good time to speak.";
    var KEYS = ["budget", "timeline", "base", "type"];
    var NAME = { budget: "Budget", timeline: "Timeline", base: "Base", type: "Type" };
    var WALINE = {
      budget: "Budget",
      timeline: "Timeline",
      base: "Passport country or investor base",
      type: "Off-plan or ready"
    };
    var OPT = {
      budget: { o1: "Under AED 5M", o2: "AED 5M to 20M", o3: "Above AED 20M", o4: "Prefer to discuss" },
      timeline: { o1: "Within 3 months", o2: "3 to 12 months", o3: "Over 12 months" },
      type: { o1: "Off-plan", o2: "Ready", o3: "Not sure yet" }
    };
    var IDLE = {
      budget: "Is this the capital you can leave untouched for the full hold, or does part of it need to stay liquid?",
      timeline: "When do you expect to exit, and what would make you leave earlier?",
      base: "Where is the capital based today, and where does it need to be when you exit?",
      type: "Would you rather carry delivery risk or the risk of a ready property?"
    };
    var ASK = {
      budget: {
        o1: "Is this the whole budget, or the first of several purchases?",
        o2: "Can all of this stay untouched for the full hold, or does part of it need to stay liquid?",
        o3: "At this size, who else needs to review the plan, a partner, a family office or an adviser?",
        o4: "No figure is needed here. We start with what the capital must protect."
      },
      timeline: {
        o1: "That is a short window. Is the exit date fixed, or can it move?",
        o2: "A workable window. When do you expect to exit, and what would make you leave earlier?",
        o3: "Time is on your side. When do you expect to exit, and what would make you leave earlier?"
      },
      type: {
        o1: "Off-plan: how much delay are you prepared to carry, and what happens to the plan if handover slips?",
        o2: "Ready: how long do you plan to hold, and who is the buyer when you sell?",
        o3: "Not sure yet is a fine place to start. We compare both against your timeline."
      }
    };

    var rows = {};
    KEYS.forEach(function (k) {
      var row = $('[data-row="' + k + '"]', panel);
      rows[k] = { el: row, ans: $(".qrow__a", row), q: $(".qrow__q", row) };
    });

    var announceTimer = 0;
    var copyTimer = 0;

    // Trim, collapse spaces, drop control characters, cap at 40.
    function clean(v) {
      return v.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40);
    }

    function read() {
      var a = {};
      ["budget", "timeline", "type"].forEach(function (k) {
        var c = $('input[name="' + k + '"]:checked', builder);
        if (c) a[k] = c.value;
      });
      var b = clean(baseIn.value);
      if (b) a.base = b;
      return a;
    }

    function compose(a) {
      var lines = [];
      ["budget", "timeline", "base", "type"].forEach(function (k) {
        if (a[k] === undefined) return;
        lines.push(WALINE[k] + ": " + (k === "base" ? a.base : OPT[k][a[k]]));
      });
      if (!lines.length) return HEAD + " " + TAIL;
      return HEAD + "\n\nMy profile:\n" + lines.join("\n") + "\n\n" + TAIL;
    }

    function answerText(k, a) { return k === "base" ? a.base : OPT[k][a[k]]; }

    function questionText(k, a) {
      if (k === "base") return "From " + a.base + ": where does the capital sit today, and where does it need to be when you exit?";
      return ASK[k][a[k]];
    }

    function swap(el) {
      el.classList.remove("is-swap");
      void el.offsetWidth;
      el.classList.add("is-swap");
    }

    function announce(text) { live.textContent = text; }

    // The whole message stays visible, so the box grows with the answers instead of scrolling.
    function fit() {
      ta.style.height = "auto";
      ta.style.height = (ta.scrollHeight + 2) + "px";
    }

    function render(changed) {
      var a = read();
      var n = 0;
      KEYS.forEach(function (k) {
        var r = rows[k];
        var set = a[k] !== undefined;
        if (set) n += 1;
        r.el.classList.toggle("is-set", set);
        r.ans.textContent = set ? answerText(k, a) : "Waiting for your answer";
        r.q.textContent = set ? questionText(k, a) : IDLE[k];
        if (k === changed) swap(r.el);
      });
      count.textContent = n + " of 4 answered";
      clearBtn.hidden = n === 0;
      var msg = compose(a);
      ta.value = msg;
      fit();
      send.href = WA + encodeURIComponent(msg);
      sendLabel.textContent = n ? "Send my profile on WhatsApp" : "Send on WhatsApp";
      copyFail.hidden = true;
      sendFail.hidden = true;
      return { a: a, n: n };
    }

    builder.addEventListener("change", function (e) {
      var t = e.target;
      if (t.type !== "radio") return;
      var res = render(t.name);
      announce(NAME[t.name] + " answered: " + OPT[t.name][t.value] + ". " + res.n + " of 4 answered.");
    });

    baseIn.addEventListener("input", function () {
      var res = render("base");
      clearTimeout(announceTimer);
      announceTimer = setTimeout(function () {
        announce(res.a.base ? "Base answered: " + res.a.base + ". " + res.n + " of 4 answered." : "Base cleared. " + res.n + " of 4 answered.");
      }, 800);
    });

    clearBtn.addEventListener("click", function () {
      $$('input[type="radio"]', builder).forEach(function (r) { r.checked = false; });
      baseIn.value = "";
      render();
      announce("Answers cleared. 0 of 4 answered.");
      baseIn.focus({ preventScroll: true });
    });

    // A filled honeypot means a bot or an autofill. The link does nothing, and says so,
    // so a real person is never left with a silent button.
    function blocked() {
      sendFail.hidden = false;
      announce("Nothing was sent.");
    }
    send.addEventListener("click", function (e) {
      if (hp.value) { e.preventDefault(); blocked(); }
    });

    function copied() {
      copyBtn.textContent = "Copied";
      announce("Message copied.");
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () { copyBtn.textContent = "Copy message"; }, 2000);
    }
    function copyFallback() {
      var ok = false;
      try {
        ta.focus();
        ta.select();
        ok = document.execCommand("copy");
      } catch (err) { ok = false; }
      if (ok) { copied(); } else { copyFail.hidden = false; announce("Select the text above and copy it."); }
    }
    copyBtn.addEventListener("click", function () {
      if (hp.value) { blocked(); return; }
      copyFail.hidden = true;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(ta.value).then(copied, copyFallback);
        } else {
          copyFallback();
        }
      } catch (err) { copyFallback(); }
    });

    render();
    window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  })();

  /* ---------- Contact note (honest stub) ---------- */
  (function () {
    var tpl = $("#note-form-tpl");
    var slot = $("#note-slot");
    if (!tpl || !slot || !tpl.content) return;
    slot.textContent = "";
    slot.appendChild(tpl.content.cloneNode(true));

    var form = $("form", slot);
    var stub = $("#note-stub", slot);
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var fields = [
      { el: form.elements.name, err: $("#n-name-err", slot), ok: function (v) { return v.trim().length > 0; } },
      { el: form.elements.email, err: $("#n-email-err", slot), ok: function (v) { return EMAIL.test(v.trim()); } },
      { el: form.elements.message, err: $("#n-msg-err", slot), ok: function (v) { return v.trim().length > 0; } }
    ];

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      stub.textContent = "";
      // A filled honeypot skips validation and gets the same "nothing was sent" line as everyone else.
      if (!form.elements.hp_trap_7q.value) {
        fields.forEach(function (f) {
          var good = f.ok(f.el.value);
          f.err.hidden = good;
          f.el.setAttribute("aria-invalid", good ? "false" : "true");
          if (!good && !firstBad) firstBad = f.el;
        });
        if (firstBad) { firstBad.focus(); return; }
      }

      var p = document.createElement("p");
      p.textContent = "This form isn't connected yet, so nothing was sent.";
      var a = document.createElement("a");
      a.className = "link";
      a.href = WA + encodeURIComponent("Hello Maysa, I found your page and would like to request a private consultation. Please let me know a good time to speak.");
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Message on WhatsApp instead";
      stub.appendChild(p);
      stub.appendChild(a);
    });
  })();

  /* ---------- Sticky bar ---------- */
  (function () {
    var bar = $("#sticky");
    var hero = $("#top");
    var quiet = [$("#profile"), $("#consult")];
    var queued = false;

    // Hidden while the hero is in view, and while another call to action owns the screen.
    function update() {
      queued = false;
      var vh = window.innerHeight;
      // The fixed header covers the top of the screen, so the hero counts as gone once it ends behind it.
      var show = hero.getBoundingClientRect().bottom <= header.offsetHeight;
      if (show) {
        quiet.forEach(function (s) {
          var r = s.getBoundingClientRect();
          var seen = Math.min(r.bottom, vh) - Math.max(r.top, 0);
          if (seen >= 0.3 * Math.min(r.height, vh)) show = false;
        });
      }
      bar.classList.toggle("is-on", show);
    }
    function queue() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", function () { headerState(); queue(); }, { passive: true });
    window.addEventListener("resize", queue);
    headerState();
    update();
  })();
})();
