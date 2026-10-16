/* Nada Hawa, concept site. Vanilla JS, no dependencies.
   Order: dictionary, language, reveal, header and sticky bar, ticker, RISE sunrise, forms, boot.
   The head script in index.html has already set lang, dir and the .motion or .no-motion class. */
(function () {
  'use strict';

  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || doc).querySelectorAll(s)); };
  var motion = root.classList.contains('motion');
  var lang = root.lang === 'ar' ? 'ar' : 'en';
  var hooks = []; // callbacks that re-run after a language change

  /* ---------- 1. Dictionary: one row per key, [key, English, Arabic] ----------
     Keys follow COPY.md. Rows marked "added" are not in COPY.md. Arabic is a first pass and needs a native read. */
  var ROWS = [
    ['meta.title', 'Nada Hawa, career transition coach for women', 'Nada Hawa، كوتش للانتقال المهني للنساء'],
    ['meta.desc', 'One-to-one career transition coaching in English and Arabic for professional women in Lebanon and the UAE. Book a call with Nada Hawa.', 'كوتشينغ فردي للانتقال المهني لنساء في لبنان والإمارات، بالعربية والإنجليزية. احجزي مكالمة مع Nada Hawa.'],
    ['a11y.skip', 'Skip to content', 'تخطي إلى المحتوى'],
    ['lang.btn', 'العربية', 'English'],
    // Written in the target language so the accessible name contains the visible label (added, replaces COPY.md lang.aria)
    ['lang.aria', 'التبديل إلى العربية', 'Switch language to English'],
    ['nav.aria', 'Sections', 'الأقسام'],
    ['nav.rise', 'RISE', 'RISE'],
    ['nav.for', 'Who it’s for', 'لمن هذا'],
    ['nav.how', 'How it works', 'كيف يعمل'],
    ['nav.about', 'About', 'عن ندى'],
    ['nav.faq', 'Questions', 'أسئلة'],
    ['cta.book', 'Book a call', 'احجزي مكالمة'],
    ['cta.rise', 'Meet RISE', 'تعرّفي على RISE'],
    ['cta.calendly', 'Book a call on Calendly', 'احجزي عبر Calendly'],
    ['ph.photo', 'Photo of Nada', 'صورة ندى'],
    ['ph.photo2', 'Second photo of Nada', 'صورة ثانية لندى'],

    ['hero.eyebrow', 'Career transition coaching for women in Lebanon and the UAE', 'كوتشينغ للانتقال المهني للنساء في لبنان والإمارات'],
    ['hero.h1a', 'Your next career move,', 'خطوتك المهنية التالية،'],
    ['hero.h1b', 'in English and Arabic.', 'بالعربية والإنجليزية.'],
    ['hero.lede', 'One-to-one coaching with Nada Hawa for professional women who are changing careers, negotiating pay or preparing to interview.', 'كوتشينغ فردي مع Nada Hawa لنساء في مسيرتهن المهنية يغيّرن مسارهن، أو يتفاوضن على الراتب، أو يستعددن لمقابلة عمل.'],
    ['hero.note', 'Booking opens Nada’s calendar.', 'عند الحجز يُفتح تقويم ندى.'],
    ['hero.quote', 'Opportunities don’t happen, you create them.', 'الفرص لا تأتي وحدها، أنتِ من تصنعينها.'],
    ['strip.aria', 'Quick facts', 'حقائق سريعة'],                              // added
    ['strip.pause', 'Pause scrolling', 'إيقاف الحركة مؤقتاً'],                  // added
    ['strip.play', 'Resume scrolling', 'استئناف الحركة'],                       // added
    ['strip.1', 'One-to-one coaching', 'كوتشينغ فردي'],
    ['strip.2', 'English and Arabic', 'بالعربية والإنجليزية'],
    ['strip.3', 'Lebanon and the UAE', 'لبنان والإمارات'],
    ['strip.4', 'Career change, pay and interviews', 'تغيير المسار والراتب والمقابلات'],

    ['for.label', 'Who it’s for', 'لمن هذا'],
    ['for.h2', 'Made for women at a turning point in their work.', 'صُمّم لنساء يقفن عند منعطف في مسارهن المهني.'],
    ['for.1.t', 'Changing careers', 'تغيير المسار المهني'],
    ['for.1.d', 'Working out what comes next, and how to get there.', 'تحديد الخطوة التالية وكيفية الوصول إليها.'],
    ['for.2.t', 'Negotiating your pay', 'التفاوض على الراتب'],
    ['for.2.d', 'Preparing what to say, and when to say it.', 'التحضير لما ستقولينه ومتى تقولينه.'],
    ['for.3.t', 'Interviewing with confidence', 'الثقة في المقابلات'],
    ['for.3.d', 'Practising your answers in the language the interview is in.', 'التدرّب على إجاباتك باللغة التي تُجرى بها المقابلة.'],
    ['for.foot', 'Not sure which one is you? Book a call and say so.', 'لستِ متأكدة أيّها يخصّك؟ احجزي مكالمة وأخبري ندى.'],

    ['rise.label', 'The RISE framework', 'إطار RISE'],
    ['rise.h2', 'Meet RISE, Nada’s framework.', 'تعرّفي على RISE، إطار ندى.'],
    ['rise.lede', '[One line on what RISE is, in Nada’s words]', '[سطر واحد عن RISE بكلمات ندى]'],
    ['rise.hint', 'Tap a letter', 'اختاري حرفاً'],
    ['rise.tablist.aria', 'RISE letters', 'أحرف RISE'],
    // The page does not say the letters are steps (Nada has not told us), so the label only names the letter
    ['rise.step', 'The letter {letter}', 'الحرف {letter}'],
    ['rise.stop.aria', 'The letter {letter}', 'الحرف {letter}'],
    ['rise.r.t', '[What R stands for]', '[ماذا يعني الحرف R]'],
    ['rise.r.d', '[One sentence on this letter, to come from Nada]', '[جملة واحدة عن هذا الحرف، تزوّدنا بها ندى]'],
    ['rise.i.t', '[What I stands for]', '[ماذا يعني الحرف I]'],
    ['rise.i.d', '[One sentence on this letter, to come from Nada]', '[جملة واحدة عن هذا الحرف، تزوّدنا بها ندى]'],
    ['rise.s.t', '[What S stands for]', '[ماذا يعني الحرف S]'],
    ['rise.s.d', '[One sentence on this letter, to come from Nada]', '[جملة واحدة عن هذا الحرف، تزوّدنا بها ندى]'],
    ['rise.e.t', '[What E stands for]', '[ماذا يعني الحرف E]'],
    ['rise.e.d', '[One sentence on this letter, to come from Nada]', '[جملة واحدة عن هذا الحرف، تزوّدنا بها ندى]'],

    ['how.label', 'How it works', 'كيف يعمل'],
    ['how.h2', 'Start with a call.', 'ابدئي بمكالمة.'],
    ['how.1.t', 'Book a call', 'احجزي مكالمة'],
    ['how.1.d', 'Pick a time on Nada’s calendar.', 'اختاري موعداً في تقويم ندى.'],
    ['how.2.t', '[What happens on the call]', '[ماذا يحدث في المكالمة]'],
    ['how.3.t', '[How the coaching runs]', '[كيف يسير الكوتشينغ]'],
    ['how.4.t', '[What comes next]', '[ما الذي يأتي بعد ذلك]'],
    ['how.pl.len', '[Session length]', '[مدة الجلسة]'],
    ['how.pl.count', '[Number of sessions]', '[عدد الجلسات]'],
    ['how.pl.price', '[Price or package]', '[السعر أو الباقة]'],

    ['about.label', 'About Nada', 'عن ندى'],
    ['about.h2', 'Meet Nada Hawa.', 'تعرّفي إلى Nada Hawa.'],
    ['about.p1', 'Nada Hawa is a career transition coach. She works one-to-one with professional women in Lebanon and the UAE.', 'Nada Hawa كوتش للانتقال المهني. تعمل فردياً مع نساء في مسيرتهن المهنية في لبنان والإمارات.'],
    ['about.p2', '[Qualifications, to confirm with Nada]', '[المؤهلات، بانتظار تأكيد ندى]'],
    ['about.values.label', 'What guides the work', 'ما يوجّه العمل'],
    ['about.v.tag', 'H.I.T.', 'H.I.T.'],
    ['about.v.h', 'Honesty', 'الصدق'],
    ['about.v.i', 'Integrity', 'النزاهة'],
    ['about.v.t', 'Trust', 'الثقة'],

    ['proof.label', 'Reels', 'ريلز'],
    ['proof.h2', 'Watch Nada on Instagram.', 'شاهدي ندى على Instagram.'],
    ['proof.reel.ph', '[A reel from Nada, to pick with her]', '[ريل من ندى، يُختار معها]'],
    ['proof.reel.cta', 'Watch on Instagram', 'شاهدي على Instagram'],
    ['proof.quote.ph', '[Client words, shared with permission]', '[كلمات العميلة، بإذنها]'],
    ['proof.name.ph', '[First name, role, city]', '[الاسم الأول، المسمى الوظيفي، المدينة]'],
    ['proof.note', 'Dashed outlines mark placeholders. Real client words and reels replace them before launch.', 'الإطارات المتقطعة تحدد أماكن المحتوى المؤقت. تحلّ كلمات العميلات والفيديوهات الحقيقية محلها قبل الإطلاق.'],

    ['news.label', 'Newsletter', 'النشرة'],
    ['news.h2', 'Read Nada on LinkedIn.', 'اقرئي ندى على LinkedIn.'],
    ['news.p', 'Her LinkedIn newsletter is called <span class="ph">[Career Transition]</span>.', 'عنوان نشرتها على LinkedIn هو <span class="ph">[Career Transition]</span>.'],
    ['news.alt', 'Read it on LinkedIn', 'اقرئيها على LinkedIn'],
    ['news.opt', '[Optional email signup, only if Nada runs a list]', '[اشتراك اختياري بالبريد، فقط إن كان لدى ندى قائمة بريدية]'],
    ['news.email.label', 'Email', 'البريد الإلكتروني'],
    ['news.cta', 'Sign up by email', 'الاشتراك بالبريد'],
    ['news.stub', 'This form isn’t connected yet, so nothing was sent.', 'هذا النموذج غير مربوط بعد، لذلك لم يُرسل شيء.'],

    ['faq.label', 'Questions', 'أسئلة'],
    ['faq.h2', 'Five questions before you book.', 'خمسة أسئلة قبل أن تحجزي.'],
    ['faq.1.q', 'Which language will we use?', 'بأي لغة نتحدث؟'],
    ['faq.1.a', 'This page is in English and Arabic. <span class="ph">[Languages for calls and sessions, to confirm with Nada]</span>', 'هذه الصفحة بالعربية والإنجليزية. <span class="ph">[لغات المكالمات والجلسات، بانتظار تأكيد ندى]</span>'],
    ['faq.2.q', 'Is it one-to-one?', 'هل الكوتشينغ فردي؟'],
    ['faq.2.a', 'Yes. Nada’s coaching is one-to-one.', 'نعم. كوتشينغ ندى فردي.'],
    ['faq.3.q', 'What happens on the first call?', 'ماذا يحدث في المكالمة الأولى؟'],
    ['faq.3.a', '<span class="ph">[What happens on the first call, to come from Nada]</span>', '<span class="ph">[ماذا يحدث في المكالمة الأولى، تزوّدنا به ندى]</span>'],
    ['faq.4.q', 'What does it cost?', 'كم تبلغ التكلفة؟'],
    ['faq.4.a', '<span class="ph">[Price or package, to be confirmed by Nada]</span>', '<span class="ph">[السعر أو الباقة، تؤكدها ندى]</span>'],
    ['faq.5.q', 'Can Nada promise me a new job or a raise?', 'هل تعدني ندى بوظيفة جديدة أو بزيادة في الراتب؟'],
    ['faq.5.a', 'No, and no honest coach can. Coaching helps you prepare, practise and decide. What follows depends on you and on the market. Coaching is not therapy.', 'لا، ولا يستطيع أي كوتش صادق ذلك. يساعدك الكوتشينغ على الاستعداد والتدرّب واتخاذ القرار. وما يأتي بعد ذلك يعتمد عليك وعلى سوق العمل. والكوتشينغ ليس علاجاً نفسياً.'],

    ['contact.label', 'Book', 'الحجز'],
    ['contact.h2', 'Pick a time that suits you.', 'اختاري الموعد الذي يناسبك.'],
    ['contact.p', 'One call to talk through your next move.', 'مكالمة واحدة للحديث عن خطوتك التالية.'],
    ['contact.row.book', 'Booking', 'الحجز'],
    ['contact.row.email', 'Email', 'البريد'],
    ['contact.row.linkedin', 'LinkedIn', 'LinkedIn'],
    ['contact.row.ig', 'Instagram', 'Instagram'],
    ['contact.form.h', 'Prefer to write first?', 'تفضّلين أن تكتبي أولاً؟'],

    ['form.name', 'Your name', 'اسمك'],
    ['form.email', 'Email', 'البريد الإلكتروني'],
    ['form.phone', 'Phone (optional)', 'الهاتف (اختياري)'],
    ['form.lang', 'Preferred language', 'اللغة المفضلة'],
    ['form.lang.en', 'English', 'الإنجليزية'],
    ['form.lang.ar', 'Arabic', 'العربية'],
    ['form.topic', 'What is it about?', 'ما موضوعك؟'],
    ['form.topic.unsure', 'Not sure yet', 'لست متأكدة بعد'],
    ['form.msg', 'Your situation in one line (optional)', 'وضعك في سطر واحد (اختياري)'],
    ['form.submit', 'Prepare my message', 'تجهيز الرسالة'],
    ['form.copy', 'Copy message', 'نسخ الرسالة'],
    ['form.copied', 'Copied.', 'تم النسخ.'],
    ['form.err.name', 'Please add your name.', 'يرجى إضافة اسمك.'],
    ['form.err.email', 'Please add a valid email.', 'يرجى إضافة بريد إلكتروني صحيح.'],
    // The page no longer opens a mail draft by itself, so the demo cannot put a draft in Nada's real inbox
    ['form.ok', 'Your message is ready. Copy it and send it from your own email to info@nadahawa.com.', 'رسالتك جاهزة. انسخيها وأرسليها من بريدك الإلكتروني إلى info@nadahawa.com.'],
    ['form.stub', 'This form isn’t connected yet, so nothing was sent from this page.', 'هذا النموذج غير مربوط بعد، لذلك لم يُرسل شيء من هذه الصفحة.'],

    ['mail.subject', 'Career call with Nada Hawa', 'حجز مكالمة مع Nada Hawa'],           // kept for the launch-day mailto line
    ['mail.hello', 'Hello Nada,', 'مرحباً ندى،'],
    ['mail.intro', 'I found your website and I would like to book a call about my career.', 'وجدت موقعك وأرغب في حجز مكالمة حول مساري المهني.'],
    ['mail.l.name', 'Name', 'الاسم'],
    ['mail.l.topic', 'Topic', 'الموضوع'],
    ['mail.l.lang', 'Preferred language', 'اللغة المفضلة'],
    ['mail.l.phone', 'Phone', 'الهاتف'],
    ['mail.l.situation', 'My situation in one line', 'وضعي في سطر واحد'],
    ['mail.thanks', 'Thank you,', 'شكراً،'],

    ['sticky.text', 'Career call with Nada', 'مكالمة مهنية مع ندى'],
    ['foot.tag', 'Career transition coaching in English and Arabic.', 'كوتشينغ للانتقال المهني بالعربية والإنجليزية.'],
    ['foot.legal', 'Coaching is not therapy, medical or legal advice. No coach can promise a job offer or a pay rise, and this page promises none.', 'الكوتشينغ ليس علاجاً نفسياً ولا مشورة طبية أو قانونية. لا يستطيع أي كوتش أن يعد بوظيفة أو بزيادة في الراتب، وهذه الصفحة لا تعد بذلك.'],
    ['foot.demo', 'Concept page. Items in brackets are waiting for Nada’s confirmation.', 'صفحة تجريبية. العناصر بين الأقواس بانتظار تأكيد ندى.'],
    ['foot.ar', 'The Arabic version is a first draft and still needs a native read.', 'النسخة العربية مسودة أولى وتحتاج إلى قراءة من متحدث أصلي.'],
    ['foot.concept', 'Concept by Webcraftr', 'تصميم تجريبي من Webcraftr']
  ];
  var T = { en: {}, ar: {} };
  ROWS.forEach(function (r) { T.en[r[0]] = r[1]; T.ar[r[0]] = r[2]; });
  var t = function (k) { return T[lang][k]; };

  /* ---------- 2. Language ---------- */
  var ARABIC = /[؀-ۿ]/;
  // A Latin run is letters, digits and the joiners . @ / _ - and may span spaces, but never ends on a joiner,
  // so the full stop closing an Arabic sentence stays outside the isolate.
  var LATIN = '[A-Za-z0-9](?:[A-Za-z0-9@._/-]*[A-Za-z0-9])?(?:\\s+[A-Za-z0-9](?:[A-Za-z0-9@._/-]*[A-Za-z0-9])?)*';

  function num(n, pad) {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en', { useGrouping: false, minimumIntegerDigits: pad || 1 }).format(n);
  }
  function fill(s, el) {
    return s.replace(/\{(n|total|letter)\}/g, function (_, k) { return k === 'letter' ? el.dataset.letter : num(el.dataset[k]); });
  }
  // Wrap each Latin run in <bdi dir="ltr"> so punctuation beside "RISE" or "Nada Hawa" does not jump sides.
  function isolateLatin(el) {
    var walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [], n;
    while ((n = walker.nextNode())) { if (!n.parentNode.closest('bdi')) nodes.push(n); }
    nodes.forEach(function (node) {
      var s = node.nodeValue, re = new RegExp(LATIN, 'g'), last = 0, m, frag = doc.createDocumentFragment();
      while ((m = re.exec(s))) {
        if (m.index > last) frag.appendChild(doc.createTextNode(s.slice(last, m.index)));
        var b = doc.createElement('bdi'); b.dir = 'ltr'; b.textContent = m[0]; frag.appendChild(b);
        last = m.index + m[0].length;
      }
      if (last) { if (last < s.length) frag.appendChild(doc.createTextNode(s.slice(last))); node.parentNode.replaceChild(frag, node); }
    });
  }
  function setMeta(sel, v) { var m = $(sel); if (m) m.setAttribute('content', v); }

  function applyLang(l, chosen) {
    lang = l;
    root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
    var D = T[l];
    doc.title = D['meta.title'];
    setMeta('meta[name="description"]', D['meta.desc']);
    setMeta('meta[property="og:title"]', D['meta.title']);
    setMeta('meta[property="og:description"]', D['meta.desc']);
    setMeta('meta[name="twitter:title"]', D['meta.title']);
    setMeta('meta[name="twitter:description"]', D['meta.desc']);
    setMeta('meta[property="og:locale"]', l === 'ar' ? 'ar_AR' : 'en_US');
    setMeta('meta[property="og:locale:alternate"]', l === 'ar' ? 'en_US' : 'ar_AR');

    $$('[data-i18n],[data-i18n-html]').forEach(function (el) {
      var html = el.hasAttribute('data-i18n-html');
      var s = fill(D[html ? el.dataset.i18nHtml : el.dataset.i18n], el);
      if (html) el.innerHTML = s; else el.textContent = s;
      // Latin-only strings (H.I.T., LinkedIn) get their own direction, mixed strings get isolates.
      el.removeAttribute('dir');
      if (l === 'ar') { if (ARABIC.test(s)) isolateLatin(el); else el.dir = 'ltr'; }
    });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', fill(D[el.dataset.i18nAria], el)); });
    $$('[data-n]:not([data-i18n]):not([data-i18n-aria])').forEach(function (el) { el.textContent = num(el.dataset.n, +el.dataset.pad || 1); });

    // The toggle names the other language in its own script
    var target = l === 'ar' ? 'en' : 'ar';
    $$('[data-lang-toggle]').forEach(function (b) { b.textContent = D['lang.btn']; b.lang = target; b.setAttribute('aria-label', D['lang.aria']); });

    if (!formState.langTouched) { var r = $('input[name="lang"][value="' + l + '"]'); if (r) r.checked = true; }
    hooks.forEach(function (h) { h(); });

    if (chosen) {
      try { localStorage.setItem('nada-lang', l); } catch (e) { /* private mode: the choice just will not persist */ }
      try { var u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u); } catch (e) { /* file:// or sandboxed */ }
    }
  }
  var formState = { langTouched: false };

  /* ---------- 3. Reveal on scroll ---------- */
  function reveal() {
    var els = $$('.reveal');
    if (!motion || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 4. Header glass and the sticky booking bar ---------- */
  function chrome() {
    var hdr = $('#hdr');
    var onScroll = function () { hdr.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    var bar = $('#sticky'), heroGone = false, contactIn = false;
    var sync = function () { bar.classList.toggle('show', heroGone && !contactIn); };
    if (!('IntersectionObserver' in window)) return; // the header pill and every section CTA still work
    new IntersectionObserver(function (e) { heroGone = !e[0].isIntersecting; sync(); }).observe($('#hero'));
    new IntersectionObserver(function (e) { contactIn = e[0].isIntersecting; sync(); }, { threshold: 0.1 }).observe($('#contact'));
  }

  /* ---------- 5. Proof strip ticker ---------- */
  function ticker() {
    if (!motion) return; // without motion the strip stays a static wrapped row
    var box = $('#ticker'), track = $('.track', box), set = $('.track-set', track), btn = $('#pause');
    // Three aria-hidden copies: two sets are wider than the widest screen, so the -50% loop never shows a gap
    for (var i = 0; i < 3; i++) { var c = set.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); }
    btn.addEventListener('click', function () {
      var paused = box.classList.toggle('is-paused');
      btn.setAttribute('aria-pressed', paused);
      btn.dataset.i18nAria = paused ? 'strip.play' : 'strip.pause';
      btn.setAttribute('aria-label', t(btn.dataset.i18nAria));
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { box.classList.toggle('is-off', !e[0].isIntersecting); }).observe(box);
  }

  /* ---------- 6. The RISE sunrise ---------- */
  function rise() {
    var stage = $('#stage');
    var arc = $('#arc-track'), prog = $('#arc-prog'), sun = $('#sun'), hint = $('#hint'), box = $('#panels');
    var tabs = $$('.stop', stage), panels = $$('.panel', box), rings = $$('.ring', stage);
    var F = [0.10, 0.36, 0.64, 0.92];   // stops sit at equal arc length, f is a fraction of it
    var len = arc.getTotalLength();     // ignores pathLength, so sun and dash agree only because both use f
    var idx = 0, cur = F[0], raf = 0, touched = false;
    var ease = function (k) { return 1 - Math.pow(1 - k, 4); }; // easeOutQuart

    function place(f) {
      cur = f;
      var p = arc.getPointAtLength(len * f), x = p.x / 640 * 100, y = p.y / 460 * 100;
      sun.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ')');
      prog.style.strokeDashoffset = (100 - f * 100).toFixed(2);
      // The SVG is mirrored in RTL, the glow is plain CSS, so mirror its centre by hand
      stage.style.setProperty('--gx', (root.dir === 'rtl' ? 100 - x : x).toFixed(2) + '%');
      stage.style.setProperty('--gy', y.toFixed(2) + '%');
    }
    function tween(to, ms) {
      cancelAnimationFrame(raf);
      if (!motion) { place(to); return; }
      var from = cur, t0 = null;
      (function step(ts) {
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / ms);
        place(from + (to - from) * ease(k));
        if (k < 1) raf = requestAnimationFrame(step);
      })(performance.now());
    }
    function select(i, byUser) {
      if (byUser && !touched) {
        touched = true; stage.classList.add('touched'); hint.style.visibility = 'hidden';
        box.setAttribute('aria-live', 'polite'); // only now, so nothing is announced on load
      }
      idx = i;
      tabs.forEach(function (b, k) {
        b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; b.classList.toggle('done', k < i);
      });
      rings.forEach(function (r, k) { r.classList.toggle('lit', i >= k + 1); });
      panels.forEach(function (p, k) {
        if (k !== i) { p.hidden = true; return; }
        if (p.hidden) { p.hidden = false; p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
      });
      tween(F[i], 900);
    }

    tabs.forEach(function (b, i) { b.addEventListener('click', function () { select(i, true); }); });
    stage.addEventListener('keydown', function (e) {
      var from = tabs.indexOf(e.target.closest('.stop')), n = tabs.length, rtl = root.dir === 'rtl', j;
      if (from < 0) return;
      switch (e.key) {
        case 'ArrowRight': j = from + (rtl ? -1 : 1); break;   // arrows follow reading direction
        case 'ArrowLeft': j = from + (rtl ? 1 : -1); break;
        case 'ArrowDown': j = from + 1; break;
        case 'ArrowUp': j = from - 1; break;
        case 'Home': j = 0; break;
        case 'End': j = n - 1; break;
        default: return;
      }
      e.preventDefault(); j = (j + n) % n; tabs[j].focus(); select(j, true); // selection follows focus
    });

    // First time the stage is 35% visible, the sun rises from the horizon to R
    if (motion && 'IntersectionObserver' in window) {
      var seen = new IntersectionObserver(function (e) {
        if (!e[0].isIntersecting) return;
        seen.disconnect();
        if (!touched) { place(0); tween(F[idx], 1400); }
      }, { threshold: 0.35 });
      seen.observe(stage);
    }
    hooks.push(function () { place(cur); });
  }

  /* ---------- 7. Forms: honest stubs, nothing is posted and no mail app is opened ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function setErr(input, box, msg) {
    box.textContent = msg;
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return !msg;
  }
  function flash(stub) { stub.classList.add('hit'); setTimeout(function () { stub.classList.remove('hit'); }, 2400); }

  function newsletter() {
    var f = $('#news-form'), email = $('#n-email'), err = $('#n-err'), stub = $('#n-stub');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.elements.company.value) return; // a person never fills the hidden field, so drop it without a word
      if (setErr(email, err, EMAIL.test(email.value.trim()) ? '' : t('form.err.email'))) flash(stub); else email.focus();
    });
  }

  function contact() {
    var f = $('#contact-form'), stub = $('#c-stub'), box = $('#compose'), msg = $('#msg'), copy = $('#copy'), done = $('#copied');
    var name = $('#c-name'), email = $('#c-email');
    $$('input[name="lang"]', f).forEach(function (r) { r.addEventListener('change', function () { formState.langTouched = true; }); });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.elements.company.value) return; // honeypot
      var okName = setErr(name, $('#c-name-err'), name.value.trim() ? '' : t('form.err.name'));
      var okMail = setErr(email, $('#c-email-err'), EMAIL.test(email.value.trim()) ? '' : t('form.err.email'));
      if (!okName) { name.focus(); return; }
      if (!okMail) { email.focus(); return; }

      var picked = $('input[name="lang"]:checked', f).parentNode.textContent.trim();
      var topic = f.elements.topic.selectedOptions[0].textContent.trim();
      var phone = f.elements.phone.value.trim(), situation = f.elements.situation.value.trim(), who = name.value.trim();
      var lines = [t('mail.hello'), t('mail.intro'), t('mail.l.name') + ': ' + who, t('mail.l.topic') + ': ' + topic, t('mail.l.lang') + ': ' + picked];
      if (phone) lines.push(t('mail.l.phone') + ': ' + phone);
      if (situation) lines.push(t('mail.l.situation') + ': ' + situation);
      lines.push(t('mail.thanks'), who);

      var body = lines.join('\n');
      // Writes the draft on the page only. It does not open a mail app, so testing the demo cannot put a draft in Nada's real inbox.
      // At launch, once she confirms info@nadahawa.com, add here: window.location.href = 'mailto:info@nadahawa.com?subject=' + encodeURIComponent(t('mail.subject')) + '&body=' + encodeURIComponent(body.replace(/\n/g, '\r\n'));
      msg.textContent = body; box.hidden = false; done.textContent = ''; flash(stub);
    });

    copy.addEventListener('click', function () {
      var text = msg.textContent;
      var write = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text) : new Promise(function (ok, no) {
        var r = doc.createRange(), s = getSelection(); r.selectNodeContents(msg); s.removeAllRanges(); s.addRange(r);
        try { doc.execCommand('copy') ? ok() : no(); } catch (x) { no(); } s.removeAllRanges();
      });
      write.then(function () { done.textContent = t('form.copied'); }, function () { /* the text is on screen and selectable */ });
    });
  }

  /* ---------- 8. Boot ---------- */
  $$('[data-lang-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(lang === 'ar' ? 'en' : 'ar', true); });
  });
  ticker();   // clones the strip before the dictionary runs so the copies get translated too
  rise();
  newsletter();
  contact();
  chrome();
  reveal();
  applyLang(lang, false);
})();
