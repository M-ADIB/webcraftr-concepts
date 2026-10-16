/* Haya Al-Bitar, concept page. Plain JavaScript, no libraries, no network calls.
   What runs here: language toggle, the "Where are you now?" chooser, the two honest form stubs,
   the FAQ, the mobile menu, one scroll loop (header + sticky bar) and the reveal. */
(function () {
  "use strict";

  var WA = "971545606007"; /* B16: read from her public site on 2026-10-15, confirm with Haya */
  var doc = document, html = doc.documentElement;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var motion = html.classList.contains("motion");

  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }

  /* ------------------------------------------------------------------ dictionary
     Each row is  key: [arabic, english].  Keys match COPY.md.
     B17: the Arabic is a first draft and needs a native read before launch.
     A <bdi> keeps a Latin word (Reset, ICF) from reordering the Arabic around it. Only rows that
     contain <bdi> are written with innerHTML, everything else is plain text. */
  var S = {
    "meta.title": ["هيا البيطار · كوتش حياة في دبي، كوتشنغ يبدأ بالعربي", "Haya Al-Bitar · Life coach in Dubai, coaching that starts in Arabic"],
    "meta.desc": ["كوتشنغ بالعربي والإنجليزي لنساء شكلهن بخير وحاسّات بالضياع. انضمي لقائمة الانتظار للتحدي القادم أو احجزي مكالمة تعارف مجانية.", "Coaching in Arabic and English for women who look fine and feel lost. Join the waitlist for the next 2-day challenge or book a free discovery call."],
    "meta.og.title": ["هيا البيطار، كوتشنغ يبدأ بالعربي", "Haya Al-Bitar, coaching that starts in Arabic"],
    "meta.og.desc": ["انضمي لقائمة الانتظار للتحدي القادم، أو احجزي مكالمة تعارف مجانية.", "Join the waitlist for the next challenge, or book a free discovery call."],
    "meta.og.alt": ["بطاقة هيا البيطار: كوتشنغ يبدأ بالعربي، لحياة إلك", "Haya Al-Bitar card: coaching that starts in Arabic, for a life that's yours"],
    "gate.note": ["مسودة للمراجعة. النماذج مش موصولة بعد، وكل شي بين الأقواس بانتظار تأكيد هيا. والعربي بدو قراءة من متحدثة أصلية.", "Draft for review. The forms are not connected and every bracketed item waits for Haya's confirmation. The Arabic needs a native read."],
    "gate.note.short": ["مسودة للمراجعة. النماذج مش موصولة، والأقواس بانتظار هيا.", "Draft for review. Forms are not connected and brackets wait for Haya."],
    "gate.hide": ["إخفاء", "Hide"],
    "ph.confirm": ["[للتأكيد]", "[to confirm]"],
    "sr.newtab": ["(بتفتح بتبويب جديد)", "(opens in a new tab)"],

    "nav.skip": ["انتقلي إلى المحتوى", "Skip to content"],
    "brand.name": ["هيا البيطار", "Haya Al-Bitar"],
    "brand.role": ["كوتش حياة · دبي", "Life coach · Dubai"],
    "nav.path": ["من وين أبدأ", "Where to start"],
    "nav.about": ["عن هيا", "About Haya"],
    "nav.faq": ["أسئلة", "Questions"],
    "nav.cta": ["قائمة الانتظار", "Waitlist"],
    "nav.menu": ["القائمة", "Menu"],
    "nav.close": ["إغلاق", "Close"],
    "nav.lang": ["English", "عربي"],
    "nav.lang.aria": ["تغيير اللغة إلى الإنجليزية", "Switch the language to Arabic"],

    "hero.eyebrow": ["هيا البيطار · كوتش حياة · دبي", "Haya Al-Bitar · Life coach · Dubai"],
    "hero.h1.l1": ["كوتشنغ يبدأ بالعربي،", "Coaching that starts in Arabic,"],
    "hero.h1.l2a": ["لحياة", "for a life that's"],
    "hero.h1.l2b": ["إلك.", "yours."],
    "hero.lede": ["هيا كوتش في دبي لنساء حياتهن شكلها كاملة من برّا، وحاسّات بالضياع من جوّا. ابدئي بتحدّي يومين، أو احكي معها أول.", "Haya is a life coach in Dubai for women whose lives look complete from the outside and who feel lost inside. Start with a two-day challenge, or talk to her first."],
    "hero.cta1": ["انضمي لقائمة الانتظار", "Join the waitlist"],
    "hero.cta2": ["احجزي مكالمة تعارف مجانية", "Book a free discovery call"],

    "card.badge": ["قائمة الانتظار", "Waitlist"],
    "card.kicker": ["التحدّي القادم · يومين", "The next challenge · 2 days"],
    "card.title": ["حياتك إلك", "Your life is yours"],
    "card.status": ["التسجيل للتحدّي الأخير انتهى. القائمة مفتوحة للتحدّي القادم.", "Registration for the last challenge has closed. The list is open for the next one."],
    "card.f.name": ["الاسم", "Name"],
    "card.f.name.ph": ["اسمك", "Your name"],
    "card.f.email": ["الإيميل", "Email"],
    "card.f.email.ph": ["name@example.com", "name@example.com"],
    "card.f.wa": ["واتساب (اختياري)", "WhatsApp (optional)"],
    "card.f.wa.ph": ["+971 ...", "+971 ..."],
    "card.submit": ["انضمي لقائمة الانتظار للتحدي القادم", "Join the waitlist for the next challenge"],
    "card.privacy": ["[ملاحظة الخصوصية بتأكدها هيا]", "[privacy note to confirm with Haya]"],
    "card.more": ["طرق تانية للشغل مع هيا", "Other ways to work with Haya"],
    "offer.reset.name": ["استشارة <bdi>Reset</bdi>", "Reset Consultation"],
    "offer.reset.meta": ["90 دقيقة", "90 minutes"],
    "offer.journey.name": ["رحلة الـ 6 أسابيع", "The 6-week journey"],
    "offer.journey.meta": ["10 جلسات فردية", "10 one-to-one sessions"],

    /* proof strip: the "[to confirm]" bracket is its own key (ph.confirm) so it can be styled as a tag. Art therapy is held back on purpose (R1), see the comment in index.html */
    "proof.label": ["التدريب والخلفية", "Training and background"],
    "proof.icf": ["كوتش معتمدة من <bdi>ICF</bdi>", "ICF certified coach"],
    "proof.ont": ["كوتش أونتولوجي", "Ontological coach"],
    "press.slot": ["[ظهرت في: شعارات المنشورات بعد تأكيد هيا]", "[As featured in: press logos, once Haya confirms]"],

    "path.slate": ["01 · من وين أبدأ", "01 · Where to start"],
    "path.h2": ["وينك هلأ؟", "Where are you now?"],
    "path.sub": ["اختاري الجملة الأقرب إلك، وبتشوفي الخطوة اللي بتناسبك.", "Pick the sentence closest to you and see the step that fits."],
    "path.card.lost.t": ["تايهة وما بعرف من وين أبدأ", "I feel lost and don't know where to start"],
    "path.card.lost.s": ["التحدّي القادم", "The next challenge"],
    "path.card.reset.t": ["عندي سؤال أو قرار وبدي جلسة وحدة مركّزة", "I have a question or a decision and I want one focused session"],
    "path.card.reset.s": ["استشارة <bdi>Reset</bdi>", "Reset Consultation"],
    "path.card.guided.t": ["جاهزة أمشي الطريق مع حدا، خطوة خطوة", "I'm ready to be guided, step by step"],
    "path.card.guided.s": ["رحلة الـ 6 أسابيع", "The 6-week journey"],
    "path.panel.lost.h": ["يومين مباشرين مع هيا", "Two live days with Haya"],
    "path.panel.lost.p": ["بالعربي. هو المدخل الأول للشغل مع هيا.", "In Arabic. It is the first way in to working with Haya."],
    "path.panel.lost.meta": ["[التاريخ والمنصة وموضوع اليومين للتأكيد]", "[date, platform and the two daily themes, to confirm]"],
    "path.panel.reset.h": ["جلسة 90 دقيقة مع هيا", "A 90 minute session with Haya"],
    "path.panel.reset.p": ["بتبدأ بمكالمة تعارف مجانية، وبعدها بتحجزي الجلسة.", "It starts with a free discovery call, then you book the session."],
    "path.panel.reset.what": ["[شو بتغطي الجلسة بتأكده هيا]", "[what the session covers, to confirm with Haya]"],
    "path.panel.guided.h": ["6 أسابيع و10 جلسات فردية", "Six weeks and 10 one-to-one sessions"],
    "path.panel.guided.p": ["بتبدأ بمكالمة تعارف مجانية، وبعدها بتقرري إذا الرحلة بتناسبك.", "It starts with a free discovery call, then you decide if the journey fits."],
    "path.fact.price": ["السعر", "Price"],
    "path.price.ph": ["[السعر للتأكيد]", "[price to confirm]"],
    "path.fact.when": ["التفاصيل", "Details"],
    "cta.lost": ["انضمي لقائمة الانتظار على واتساب", "Join the waitlist on WhatsApp"],
    "cta.reset": ["احكي مع هيا عن الاستشارة", "Ask Haya about the consultation"],
    "cta.guided": ["احكي مع هيا عن الرحلة", "Ask Haya about the journey"],
    "cta.call": ["احجزي مكالمة تعارف مجانية", "Book a free discovery call"],
    "path.alt": ["أو احجزي مكالمة تعارف مجانية", "Or book a free discovery call"],
    "path.check.sr": ["(مختارة)", "(selected)"],
    "path.sr.selected": ["تم اختيار: {label}. الخطوة التالية: {offer}.", "Selected: {label}. Next step: {offer}."],

    "manifesto.l1": ["بعض الكلام ما بيوصل", "Some things only land"],
    "manifesto.l2": ["إلا بلغة بيتك.", "in the language of home."],
    "manifesto.p": ["هيا بتعمل كوتشنغ بالعربي وبالإنجليزي. اختاري اللغة اللي بتفكري فيها، وابدئي من خطوة صغيرة.", "Haya coaches in Arabic and in English. Choose the language you think in and begin with one small step."],
    "manifesto.ph": ["[أي جلسة بأي لغة بتأكده هيا]", "[which offers run in which language, to confirm with Haya]"],

    "steps.slate": ["02 · كيف بتبدأ الرحلة", "02 · How it starts"],
    "steps.h2": ["ثلاث خطوات وإنتِ بتحددي السرعة", "Three steps, at your own pace"],
    "steps.n.1": ["01", "01"],
    "steps.n.2": ["02", "02"],
    "steps.n.3": ["03", "03"],
    "steps.1.t": ["ابدئي صغيرة", "Start small"],
    "steps.1.p": ["انضمي لقائمة التحدّي القادم، أو راسلي هيا مباشرة.", "Join the list for the next challenge, or message Haya directly."],
    "steps.2.t": ["احكي قبل ما تقرري", "Talk before you decide"],
    "steps.2.p": ["مكالمة تعارف مجانية بتحجزيها بنفسك من الرابط.", "A free discovery call that you book yourself from the link."],
    "steps.2.ph": ["[مين بيرد على المكالمة: هيا أو فريقها]", "[who takes the call, Haya or her team, to confirm]"],
    "steps.3.t": ["اختاري الجلسة اللي بتناسبك", "Choose the session that fits"],
    "steps.3.p": ["استشارة مدتها 90 دقيقة، أو رحلة 6 أسابيع بـ 10 جلسات فردية.", "A 90 minute consultation, or a 6-week journey of 10 one-to-one sessions."],

    "about.slate": ["03 · عن هيا", "03 · About Haya"],
    "about.h2": ["تعرّفي على هيا", "Meet Haya"],
    "about.p1": ["هيا بتعمل كوتشنغ مع نساء ناطقات بالعربي ومقيمات بالخليج، بجلسات فردية وورشات وتحديات مباشرة.", "Haya coaches Arabic-speaking and Gulf-based women through one-to-one sessions, workshops and live challenges."],
    "about.story": ["[قصة هيا بكلماتها، من جملتين لثلاث]", "[Haya's story in her own words, two to three sentences]"],
    "about.photo": ["[صورة هيا، بتزودنا فيها هي]", "[photo of Haya, supplied by her]"],
    "art.initial": ["هيا", "H"],

    "voices.slate": ["04 · بأصواتهن", "04 · In their words"],
    "voices.h2": ["كلام من شاركن", "Words from women who joined"],
    "voices.ph.q": ["[اقتباس حقيقي من مشاركة، بموافقتها وبتزودنا فيه هيا]", "[a real quote from an attendee, with her consent, supplied by Haya]"],
    "voices.ph.who": ["[الاسم الأول والمدينة]", "[first name and city]"],

    /* faq answers: the trailing "[... to confirm]" bracket of a1, a3 and a5 is split into its own .ph key */
    "faq.slate": ["05 · أسئلة", "05 · Questions"],
    "faq.h2": ["أسئلة قبل ما تبدي", "Questions before you start"],
    "faq.q1": ["بأي لغة بتصير الجلسات؟", "In which language do the sessions run?"],
    "faq.a1": ["التحدّي بالعربي. لغة الجلسات الفردية والورشات بتتأكدي منها مع هيا قبل ما تحجزي.", "The challenge runs in Arabic. Check the language of one-to-one sessions and workshops with Haya before you book."],
    "faq.a1.ph": ["[اللغة للتأكيد]", "[language to confirm]"],
    "faq.q2": ["هل هاد علاج نفسي؟", "Is this therapy?"],
    "faq.a2": ["لا. هيا بتشتغل ككوتش. الكوتشنغ مش علاج نفسي ولا نصيحة طبية، وما بيحل محل الرعاية الصحية. إذا حاسّة إنو الأمر أكبر من هيك، تواصلي مع مختصة مرخّصة.", "No. Haya works as a coach. Coaching is not therapy or medical advice and does not replace health care. If things feel heavier than that, please speak to a licensed professional."],
    "faq.q3": ["متى التحدّي القادم؟", "When is the next challenge?"],
    "faq.a3": ["ما في موعد محدد على هالصفحة. انضمي للقائمة أو اسألي هيا مباشرة.", "No date is set on this page. Join the list or ask Haya directly."],
    "faq.a3.ph": ["[الموعد للتأكيد]", "[date to confirm]"],
    "faq.q4": ["كم التكلفة؟", "What does it cost?"],
    "faq.a4": ["[الأسعار بتأكدها هيا قبل النشر]", "[prices to be confirmed by Haya before launch]"],
    "faq.q5": ["شو بيصير بمكالمة التعارف؟", "What happens on the discovery call?"],
    "faq.a5": ["مكالمة مجانية لتتعارفوا وتشوفوا أي خطوة بتناسبك.", "A free call to get to know each other and see which step fits."],
    "faq.a5.ph": ["[المدة ومين بيرد للتأكيد]", "[length, and whether Haya or her team takes it, to confirm]"],

    "join.slate": ["06 · ابدئي", "06 · Begin"],
    "join.h2": ["لما تكوني جاهزة", "When you are ready"],
    "join.k.lost": ["خطوتك: قائمة التحدّي القادم", "Your step: the next challenge list"],
    "join.k.reset": ["خطوتك: استشارة <bdi>Reset</bdi>", "Your step: the Reset Consultation"],
    "join.k.guided": ["خطوتك: رحلة الـ 6 أسابيع", "Your step: the 6-week journey"],
    "join.p": ["اتركي اسمك وإيميلك، وبعدها افتحي واتساب لتكملي مع هيا.", "Leave your name and email, then open WhatsApp to continue with Haya."],
    "join.channels.h": ["طرق تانية للوصول لهيا", "Other ways to reach Haya"],
    "join.ch.wa": ["واتساب", "WhatsApp"],
    "join.ch.email": ["إيميل", "Email"],
    "join.ch.ig": ["انستغرام", "Instagram"],

    "form.err.name": ["اكتبي اسمك", "Please add your name"],
    "form.err.email": ["اكتبي إيميل صحيح", "Please add a valid email"],
    "form.stub": ["هاد النموذج مش موصول بعد، فما انبعت شي.", "This form isn't connected yet, so nothing was sent."],
    "form.stub.hint": ["الرسالة جاهزة، بس اضغطي إرسال بواتساب.", "The message is ready. Just press send in WhatsApp."],
    "form.stub.cta": ["افتحي واتساب", "Open WhatsApp"],
    "form.noscript": ["النموذج بحاجة للجافاسكربت. فيكي تراسلي هيا مباشرة على واتساب.", "The form needs JavaScript. You can message Haya directly on WhatsApp."],

    /* WhatsApp text: plain strings only, no markup. Greeting and body are joined, then encodeURIComponent */
    "wa.greet": ["مرحبا هيا،", "Hello Haya,"],
    "wa.greet.name": ["مرحبا هيا، أنا {name}.", "Hello Haya, I'm {name}."],
    "wa.body.lost": ["شفت صفحتك وبدي انضم لقائمة الانتظار للتحدي القادم (يومين). ممكن تخبريني لما يتفتح التسجيل؟", "I found your page and I'd like to join the waitlist for the next 2-day challenge. Please let me know when it opens."],
    "wa.body.reset": ["شفت صفحتك وبدي اسأل عن استشارة Reset (90 دقيقة). كيف منبدأ؟", "I found your page and I'd like to ask about the 90 minute Reset Consultation. How do we start?"],
    "wa.body.guided": ["شفت صفحتك وبدي اسأل عن رحلة الـ 6 أسابيع (جلسات فردية). كيف منبدأ؟", "I found your page and I'd like to ask about the 6 week one-to-one journey. How do we start?"],

    "sticky.text": ["جاهزة تبدي؟", "Ready to begin?"],
    "footer.tag": ["حياتك إلك.", "Your life is yours."],
    "footer.note": ["الكوتشنغ مش علاج نفسي ولا نصيحة طبية، وما بيحل محل الرعاية الصحية.", "Coaching is not therapy or medical advice and does not replace health care."],
    "footer.copy": ["© 2026 [الاسم القانوني للتأكيد]", "© 2026 [legal name to confirm]"],
    "footer.privacy": ["[سياسة الخصوصية]", "[privacy policy]"],
    "footer.top": ["للأعلى", "Back to top"]
  };

  var lang = html.lang === "en" ? "en" : "ar";
  function raw(k) { var r = S[k]; return r ? r[lang === "en" ? 1 : 0] : null; }
  function plain(k) { var v = raw(k); return v == null ? "" : v.replace(/<[^>]+>/g, ""); }
  function put(el, v) { if (v.indexOf("<bdi>") > -1) el.innerHTML = v; else el.textContent = v; }

  function applyI18n(root) {
    $$("[data-i18n]", root).forEach(function (el) {
      if (el.hasAttribute("data-path-cta")) return; /* the chosen path owns these labels */
      var v = raw(el.getAttribute("data-i18n"));
      if (v != null) put(el, v);
    });
    $$("[data-i18n-ph]", root).forEach(function (el) { var v = plain(el.getAttribute("data-i18n-ph")); if (v) el.setAttribute("placeholder", v); });
    $$("[data-i18n-aria]", root).forEach(function (el) { var v = plain(el.getAttribute("data-i18n-aria")); if (v) el.setAttribute("aria-label", v); });
  }

  /* ------------------------------------------------------------------ WhatsApp links */
  var path = "lost"; /* "lost", "reset" or "guided": one is always chosen, so the panel is never empty */
  function currentKey() { return path; }
  function cleanName(v) {
    return String(v || "").replace(/[\u0000-\u001f\u007f-\u009f‎‏‪-‮⁦-⁩]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
  }
  function waUrl(key, name) {
    var greet = name ? plain("wa.greet.name").replace("{name}", name) : plain("wa.greet");
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(greet + " " + plain("wa.body." + key));
  }
  function refreshWa() {
    $$("[data-wa]").forEach(function (a) {
      var k = a.getAttribute("data-wa");
      if (k === "current") k = currentKey();
      a.setAttribute("href", waUrl(k, a.getAttribute("data-wa-name") || ""));
    });
    $$("[data-path-cta]").forEach(function (el) { el.textContent = plain("cta." + currentKey()); });
  }

  /* ------------------------------------------------------------------ the chooser */
  var radios = $$('input[name="path"]');
  var live = $("#path-live"), joinK = $("#join-k");
  if (joinK) joinK.removeAttribute("data-i18n"); /* renderPath owns this text */

  function renderPath() {
    if (joinK) put(joinK, raw("join.k." + currentKey()));
    refreshWa();
  }
  function validPath(k) { return k === "lost" || k === "reset" || k === "guided"; }
  function setPath(key, o) {
    o = o || {};
    path = validPath(key) ? key : "lost";
    html.setAttribute("data-path", path || "");
    radios.forEach(function (r) { r.checked = r.value === path; });
    store("haya-path", path);
    renderPath();
    if (o.announce && live) {
      live.textContent = plain("path.sr.selected").replace("{label}", plain("path.card." + path + ".t")).replace("{offer}", plain("path.card." + path + ".s"));
    }
    if (o.scroll && window.innerWidth < 760) {
      var p = $(".panel--" + path);
      if (p) requestAnimationFrame(function () { p.scrollIntoView({ block: "nearest", behavior: motion ? "smooth" : "auto" }); });
    }
  }
  radios.forEach(function (r) { r.addEventListener("change", function () { setPath(r.value, { announce: true, scroll: true }); }); });
  $$("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var k = a.getAttribute("data-pick");
      setPath(k, { announce: true });
      var sec = $("#path");
      if (sec) sec.scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "start" });
      var r = $("#path-" + k);
      if (r) r.focus({ preventScroll: true });
    });
  });

  /* ------------------------------------------------------------------ forms (honest stubs) */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function el(tag, key) { var n = doc.createElement(tag); n.setAttribute("data-i18n", key); return n; }
  function flag(input, msg, bad) {
    if (bad) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
    msg.hidden = !bad;
  }
  function showStub(status, waKey, name) {
    status.textContent = "";
    var a = doc.createElement("a");
    a.className = "btn btn--primary btn--block";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("data-wa", waKey);
    a.setAttribute("data-wa-name", name);
    a.innerHTML = '<span data-i18n="form.stub.cta"></span><span class="sr-only" data-i18n="sr.newtab"></span><svg class="ic ic-arrow" aria-hidden="true"><use href="#i-arrow"/></svg>';
    status.appendChild(el("p", "form.stub"));
    status.appendChild(el("p", "form.stub.hint"));
    status.appendChild(a);
    applyI18n(status);
    refreshWa();
  }
  function wireForm(form, id) {
    var status = $(".form__status", form);
    var nameEl = $('[name="name"]', form), emailEl = $('[name="email"]', form);
    var nameErr = $("#" + id + "-name-e"), emailErr = $("#" + id + "-email-e");
    nameEl.addEventListener("input", function () { if (nameEl.value.trim()) flag(nameEl, nameErr, false); });
    emailEl.addEventListener("input", function () { if (EMAIL.test(emailEl.value.trim())) flag(emailEl, emailErr, false); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if ($('[name="company_site"]', form).value) return; /* honeypot filled: swallow it, show nothing */
      var name = cleanName(nameEl.value);
      var okName = name.length > 0, okEmail = EMAIL.test(emailEl.value.trim());
      flag(nameEl, nameErr, !okName);
      flag(emailEl, emailErr, !okEmail);
      if (!okName || !okEmail) { status.textContent = ""; (okName ? emailEl : nameEl).focus(); return; }
      /* Nothing is sent. Only the first name can reach the WhatsApp text, and only when the visitor taps the link. */
      showStub(status, id === "hero" ? "lost" : "current", name);
    });
  }
  function mountForms() {
    var tpl = $("#tpl-form");
    if (!tpl) return;
    var src = tpl.innerHTML;
    $$("[data-form-mount]").forEach(function (m) {
      var id = m.getAttribute("data-form-mount");
      m.innerHTML = src.split("__P__").join(id);
      var form = $("form", m), btn = $("[data-submit]", m);
      if (m.getAttribute("data-form-sub") === "path") btn.setAttribute("data-path-cta", "");
      else btn.setAttribute("data-i18n", "card.submit");
      wireForm(form, id);
    });
  }

  /* ------------------------------------------------------------------ language */
  function setMeta(sel, attr, val) { var m = $(sel); if (m) m.setAttribute(attr, val); }
  function setLang(l, persist) {
    lang = l === "en" ? "en" : "ar";
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    applyI18n();
    doc.title = plain("meta.title");
    setMeta('meta[name="description"]', "content", plain("meta.desc"));
    setMeta('meta[property="og:title"]', "content", plain("meta.og.title"));
    setMeta('meta[property="og:description"]', "content", plain("meta.og.desc"));
    setMeta('meta[property="og:image:alt"]', "content", plain("meta.og.alt"));
    setMeta('meta[name="twitter:title"]', "content", plain("meta.og.title"));
    setMeta('meta[name="twitter:description"]', "content", plain("meta.og.desc"));
    setMeta('meta[name="twitter:image:alt"]', "content", plain("meta.og.alt"));
    setMeta('meta[property="og:locale"]', "content", lang === "ar" ? "ar_AE" : "en_AE");
    var btn = $("#lang");
    if (btn) btn.setAttribute("lang", lang === "ar" ? "en" : "ar");
    renderPath();
    if (persist) {
      store("haya-lang", lang);
      try { /* keep a ?lang= in the address bar in step, so a reload does not undo the switch */
        var u = new URL(location.href);
        if (u.searchParams.has("lang")) { u.searchParams.set("lang", lang); history.replaceState(null, "", u.pathname + u.search + u.hash); }
      } catch (e) {}
    }
    html.removeAttribute("data-i18n-pending");
  }
  var langBtn = $("#lang");
  if (langBtn) langBtn.addEventListener("click", function () { setLang(lang === "ar" ? "en" : "ar", true); });

  /* ------------------------------------------------------------------ FAQ (one open at a time) */
  $$(".faq__q").forEach(function (b) {
    b.addEventListener("click", function () {
      var item = b.closest(".faq__item"), open = !item.classList.contains("is-open");
      $$(".faq__item.is-open").forEach(function (o) {
        if (o === item) return;
        o.classList.remove("is-open");
        $(".faq__q", o).setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", open);
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ------------------------------------------------------------------ mobile menu */
  var sheet = $("#sheet"), burger = $("#burger"), sheetClose = $("#sheet-close");
  function closeSheet(returnFocus) {
    if (!sheet.classList.contains("is-open")) return;
    sheet.classList.remove("is-open");
    html.classList.remove("sheet-open");
    burger.setAttribute("aria-expanded", "false");
    if (returnFocus) burger.focus({ preventScroll: true });
  }
  if (sheet && burger) {
    burger.addEventListener("click", function () {
      sheet.classList.add("is-open");
      html.classList.add("sheet-open");
      burger.setAttribute("aria-expanded", "true");
      sheetClose.focus({ preventScroll: true });
    });
    sheetClose.addEventListener("click", function () { closeSheet(true); });
    $$("[data-close-sheet]", sheet).forEach(function (a) { a.addEventListener("click", function () { closeSheet(false); }); });
    doc.addEventListener("keydown", function (e) {
      if (!sheet.classList.contains("is-open")) return;
      if (e.key === "Escape") { closeSheet(true); return; }
      if (e.key !== "Tab") return;
      var f = $$("a[href], button", sheet).filter(function (n) { return n.offsetParent !== null || n === doc.activeElement; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 900) closeSheet(false); });
  }

  /* buttons that point at the hero card: scroll there, then focus the name field */
  $$("[data-focus-form]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var card = $("#hero-card"), input = $("#hero-name");
      if (!card) return;
      closeSheet(false);
      card.scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "start" });
      if (input) setTimeout(function () { input.focus({ preventScroll: true }); }, motion ? 380 : 0);
    });
  });

  /* ------------------------------------------------------------------ draft ribbon (tap to hide, ?clean=1 hides it) */
  var ribbon = $("#ribbon");
  if (ribbon) {
    if (/[?&]clean=1(&|$)/.test(location.search)) ribbon.hidden = true;
    ribbon.addEventListener("click", function () { ribbon.hidden = true; });
  }

  /* ------------------------------------------------------------------ one scroll loop: header state + sticky bar */
  var hdr = $("#hdr"), sticky = $("#sticky"), heroEl = $("#hero"), joinEl = $("#join"), ticking = false;
  function frame() {
    ticking = false;
    hdr.classList.toggle("is-stuck", window.scrollY > 8);
    var vh = window.innerHeight, h = heroEl.getBoundingClientRect(), j = joinEl.getBoundingClientRect();
    var visible = Math.max(0, Math.min(j.bottom, vh) - Math.max(j.top, 0));
    var joinReached = visible / Math.max(1, Math.min(j.height, vh)) >= 0.3 || j.bottom < vh;
    sticky.classList.toggle("is-on", h.bottom < 0 && !joinReached);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ------------------------------------------------------------------ reveal */
  function reveal() {
    var items = $$("[data-reveal]");
    if (!motion || !("IntersectionObserver" in window)) { items.forEach(function (n) { n.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ------------------------------------------------------------------ start */
  mountForms();
  setLang(lang, false);
  var qp = null;
  try { qp = new URLSearchParams(location.search).get("path"); } catch (e) {}
  var saved = load("haya-path");
  setPath(validPath(qp) ? qp : (validPath(saved) ? saved : "lost"), {});
  reveal();
  frame();
  window.__hayaReady = true;
})();
