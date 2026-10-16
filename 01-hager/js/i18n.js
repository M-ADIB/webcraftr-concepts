/* Beat Fitness Dubai: English and Arabic.
   English lives in the HTML (it is what loads without script). This file holds:
   - AR: every Arabic string, keyed by data-i18n. FIRST PASS: needs a native speaker before launch.
   - EN: only the strings that are built by script or carry a {n} token.
   Text in [square brackets] is unverified and is drawn as a placeholder (.ph).
   Latin words inside Arabic text are wrapped in <bdi> so they keep their own direction.
   The Arabic page keeps the ENGLISH tagline (Get fit, stay beat!) because no Arabic tagline is confirmed.
   CONFIRM BEFORE LAUNCH (B10): the Arabic spelling of Hager's name is bracketed on purpose.
   CONFIRM BEFORE LAUNCH (B13): the Arabic perimenopause label ("ما حول انقطاع الطمث") is the formal clinical term
   and may read heavy. A native speaker picks the everyday wording and checks it against UAE health advertising rules. */
(function () {
  'use strict';

  var AR = {
    "meta.title": "Beat Fitness دبي: Get Fit, Stay Beat!",
    "meta.desc": "موقع تصوري لـ Beat Fitness دبي. تدريب شخصي للنساء وبرنامج UNBEATABLE لمدة 12 أسبوعاً ومكالمة استراتيجية مجانية مدتها 15 دقيقة مع هاجر.",
    "a11y.skip": "تخطي إلى المحتوى",
    "a11y.external": "(يفتح في تبويب جديد)",
    "lang.toggle.label": "English",
    "lang.toggle.aria": "التبديل إلى الإنجليزية",
    "cta.book": "احجزي المكالمة المجانية (15 دقيقة)",
    "cta.book.short": "احجزي المكالمة المجانية",
    "cta.book.sticky": "احجزي",
    "nav.aria": "التنقل الرئيسي",
    "nav.program": "البرنامج",
    "nav.tracks": "المسارات",
    "nav.start": "ابدئي",
    "nav.faq": "الأسئلة",

    "hero.slate": "(01) هاجر",
    "hero.eyebrow": "تدريب شخصي للنساء في دبي",
    "hero.h1.l1": "Get fit,",
    "hero.h1.l2": "Stay Beat!",
    "hero.sub": "تدرّبك هاجر عبر UNBEATABLE، برنامج مدته 12 أسبوعاً. ابدئي بمكالمة استراتيجية مجانية مدتها 15 دقيقة لتري إن كان مناسباً لك.",
    "hero.cta.secondary": "شاهدي الأسابيع الـ12",
    "hero.glance.label": "نظرة سريعة",
    "hero.glance.role.k": "الدور",
    "hero.glance.role.v": "مؤسسة ورئيسة تنفيذية ومدربة شخصية في Beat Fitness دبي",
    "hero.glance.for.k": "لمن",
    "hero.glance.for.v": "النساء في دبي، وأولياء أمور المراهقات",
    "hero.glance.lang.k": "اللغات",
    "hero.glance.lang.v": "الإنجليزية والعربية",
    "hero.glance.int.k": "مقابلة",
    "hero.glance.int.v": "صباح الخير يا عرب",
    "hero.glance.ig.k": "إنستغرام",
    "hero.glance.rail": "UNBEATABLE: 12 أسبوعاً",
    "hero.strip.1.l": "أسبوعاً",
    "hero.strip.1.s": "برنامج UNBEATABLE",
    "hero.strip.2.l": "مسارات",
    "hero.strip.2.s": "المراهقات، فوق الأربعين، ما حول انقطاع الطمث",
    "hero.strip.3.l": "دقيقة",
    "hero.strip.3.s": "مكالمة استراتيجية مجانية",
    "hero.strip.4.l": "دقيقة",
    "hero.strip.4.s": "تقييم Personal Blueprint",

    "strip.1": "Get fit, stay beat!",
    "strip.3": "12 أسبوعاً",
    "strip.4": "مكالمة مجانية 15 دقيقة",
    "strip.pause": "إيقاف النص المتحرك",
    "strip.play": "تشغيل النص المتحرك",

    "proof.slate": "(02) المقابلة",
    "proof.h2": "اسمعي من هاجر مباشرة.",
    "proof.lead": "شاهدي مقابلة هاجر في برنامج صباح الخير يا عرب.",
    "proof.card.kicker": "مقابلة",
    "proof.card.title": "صباح الخير يا عرب",
    "proof.card.guest": "[هاجر أبو طالب]",
    "proof.card.channel.ph": "[القناة وتاريخ العرض: يجب التأكد قبل عرض أي شعار]",
    "proof.card.cta": "شاهدي على يوتيوب",
    "proof.card.note": "يفتح يوتيوب في تبويب جديد. لا يتم تحميل أي شيء من يوتيوب قبل النقر.",
    "proof.facts.show.k": "البرنامج",
    "proof.facts.show.v": "صباح الخير يا عرب",
    "proof.facts.lang.k": "اللغة",
    "proof.facts.lang.v": "العربية",
    "proof.facts.about.k": "عن ماذا",
    "proof.facts.about.v": "امرأة تركت وظيفتها واختارت المجازفة (من عنوان الفيديو)",
    "proof.quote.ph": "[اقتباس من المقابلة: بموافقة هاجر]",
    "proof.testi.ph": "[آراء العميلات: الحقيقية فقط وبإذنهن]",

    "prog.slate": "(03) UNBEATABLE",
    "prog.h2.l1": "12 أسبوعاً.",
    "prog.h2.l2": "أسبوع بعد أسبوع.",
    "prog.lead": "UNBEATABLE برنامج مدته 12 أسبوعاً مع هاجر. اختاري أسبوعاً لترَي كيف ينتظم.",
    "prog.rail.aria": "أسابيع UNBEATABLE الاثنا عشر",
    "prog.tab.aria": "الأسبوع {n}",
    "prog.week.label": "الأسبوع {n}",
    "prog.frame.ph": "[محتوى الأسابيع من هاجر: اسم المرحلة وما يحدث كل أسبوع]",
    "prog.status": "الأسبوع {n} من 12.",
    "prog.details.ph": "[الصيغة والجدول والسعر وما يشمله البرنامج: تؤكدها هاجر]",
    "prog.nojs": "كل أسبوع من UNBEATABLE مدرج أدناه.",

    "tracks.slate": "(04) المسارات",
    "tracks.h2.l1": "ثلاثة مسارات.",
    "tracks.h2.l2": "مدربة واحدة.",
    "tracks.lead": "اختاري المسار الذي يشبهك أو يشبه ابنتك.",
    "tracks.tablist.aria": "اختاري مساراً",
    "tracks.care.label": "اقرئي هذا أولاً",
    "tracks.cta": "اسألي عن هذا المسار",
    "tracks.t1.tab": "المراهقات",
    "tracks.t1.h3": "لأولياء أمور المراهقات",
    "tracks.t1.p": "[يبدأ ولي الأمر أو الوصي هذا المسار: تؤكده هاجر.] احجزوا المكالمة المجانية (15 دقيقة) واطرحوا أسئلتكم.",
    "tracks.t1.fit.ph": "[ما يغطيه مسار المراهقات والأعمار وهل هو جماعي أم فردي: تؤكدها هاجر]",
    "tracks.t1.care": "الحماية وموافقة ولي الأمر: [صياغة هاجر هنا]",
    "tracks.t1.cta": "اسألوا عن مسار المراهقات",
    "tracks.t2.tab": "النساء فوق الأربعين",
    "tracks.t2.h3": "للنساء فوق الأربعين",
    "tracks.t2.p": "خطة واضحة ومدربة ترافقك في تنفيذها ضمن برنامج UNBEATABLE لمدة 12 أسبوعاً.",
    "tracks.t2.fit.ph": "[ما يتكيّف في البرنامج للنساء فوق الأربعين: تؤكده هاجر]",
    "tracks.t2.care": "تحدثي إلى طبيبك قبل أن تبدئي برنامج تمارين جديداً.",
    "tracks.t3.tab": "ما حول انقطاع الطمث",
    "tracks.t3.h3": "للنساء في مرحلة ما حول انقطاع الطمث",
    "tracks.t3.p": "تدريب يخطط لتمارينك بحسب مرحلتك الحالية. هاجر مدربة شخصية وليست طبيبة.",
    "tracks.t3.fit.ph": "[ما يتكيّف في البرنامج خلال هذه المرحلة: تؤكده هاجر]",
    "tracks.t3.care": "هذا تدريب وليس رعاية طبية. استشيري طبيبك بشأن الأعراض أو الهرمونات أو الأدوية. [صياغة الإعلانات الصحية في الإمارات: يجب التحقق قبل الإطلاق]",

    "start.slate": "(05) ابدئي من هنا",
    "start.h2.l1": "مكالمتان.",
    "start.h2.l2": "وبرنامج واحد.",
    "start.c1.n": "15 دقيقة",
    "start.c1.h3": "مكالمة استراتيجية",
    "start.c1.p": "مجانية. أخبري هاجر أين أنتِ وماذا تريدين، واسألي عمّا يتضمنه UNBEATABLE.",
    "start.c2.n": "45 دقيقة",
    "start.c2.h3": "تقييم Personal Blueprint",
    "start.c2.p.ph": "مكالمة مدتها 45 دقيقة مع هاجر. [ما تغطيه وسعرها: تؤكدها هاجر]",
    "start.c2.cta": "احجزي التقييم",
    "start.c3.n": "12 أسبوعاً",
    "start.c3.h3": "UNBEATABLE",
    "start.c3.p.ph": "برنامج الـ12 أسبوعاً. [الصيغة والجدول والسعر: تؤكدها هاجر]",
    "start.c3.cta": "اسألي على إنستغرام",
    "start.note": "لستِ متأكدة أيهما تختارين؟ ابدئي بالمكالمة المجانية.",

    "kw.slate": "(06) الكلمة المفتاحية",
    "kw.h2.l1": "أرسلي",
    "kw.h2.l2": "الكلمة.",
    "kw.lead": "على إنستغرام، أرسلي UNBEATABLE إلى @hager_aboutaleb لمعرفة المزيد عن برنامج الـ12 أسبوعاً. وأولياء أمور المراهقات يرسلون TEEN.",
    "kw.copy.btn": "انسخي UNBEATABLE",
    "kw.copy.done": "تم النسخ. افتحي إنستغرام الآن.",
    "kw.copy.fail": "حددي الكلمة وانسخيها: UNBEATABLE",
    "kw.ig.btn": "افتحي إنستغرام",
    "kw.form.h3": "لا تستخدمين إنستغرام؟ اتركي بريدك الإلكتروني.",
    "kw.form.label": "البريد الإلكتروني",
    "kw.form.placeholder": "you@example.com",
    "kw.form.btn": "إرسال",
    "kw.form.hp": "اتركي هذا الحقل فارغاً",
    "kw.form.invalid": "أدخلي بريداً إلكترونياً صحيحاً.",
    "kw.form.stub": "هذا النموذج غير متصل بعد، لذلك لم يُرسل شيء. يمكنك مراسلة hager@beatfitness.me أو إرسال رسالة إلى @hager_aboutaleb على إنستغرام.",
    "kw.form.fail": "لم يتم الإرسال. إجاباتك ما زالت هنا ويمكنك المحاولة مجدداً.",
    "kw.form.ok": "شكراً. تم إرسال بريدك الإلكتروني.",
    "kw.form.privacy.ph": "يُستخدم للرد عليك فقط. [سياسة الخصوصية: تضاف قبل الإطلاق]",

    "coach.slate": "(07) المدربة",
    "coach.h2": "[هاجر أبو طالب]",
    "coach.role": "مؤسسة ورئيسة تنفيذية ومدربة شخصية في Beat Fitness دبي",
    "coach.bio.ph": "[جملتان عن هاجر بكلماتها]",
    "coach.langs.label": "اللغات",
    "coach.langs.value": "الإنجليزية والعربية",
    "coach.ig.label": "إنستغرام",
    "coach.photo.ph": "[صورة: تستبدل بصورة هاجر الخاصة]",
    "coach.photo.alt": "صورة هاجر",

    "faq.slate": "(08) أسئلة شائعة",
    "faq.h2": "أسئلة.",
    "faq.q1": "ما هو UNBEATABLE؟",
    "faq.a1": "برنامج مدته 12 أسبوعاً مع هاجر. [الصيغة والجدول وما يتضمنه: تؤكدها هاجر]",
    "faq.q2": "كيف أبدأ؟",
    "faq.a2": "احجزي المكالمة الاستراتيجية المجانية (15 دقيقة)، أو أرسلي UNBEATABLE إلى @hager_aboutaleb على إنستغرام.",
    "faq.q3": "ما هو تقييم Personal Blueprint؟",
    "faq.a3": "مكالمة مدتها 45 دقيقة مع هاجر. [ما تغطيه وسعرها: تؤكدها هاجر]",
    "faq.q4": "كيف يعمل مسار المراهقات؟",
    "faq.a4": "[يبدأ ولي الأمر أو الوصي المسار بمكالمة. الحماية والموافقة وتفاصيل الجلسات: تزوّدنا بها هاجر]",
    "faq.q5": "أنا في مرحلة ما حول انقطاع الطمث. هل هذه نصيحة طبية؟",
    "faq.a5": "لا. هاجر مدربة شخصية وليست طبيبة. استشيري طبيبك بشأن الأعراض أو الهرمونات أو الأدوية قبل أن تبدئي.",
    "faq.q6": "كم التكلفة؟",
    "faq.a6": "المكالمة الاستراتيجية مجانية. [أسعار التقييم وبرنامج UNBEATABLE: تؤكدها هاجر]",
    "faq.q7": "أين تُقام الجلسات وبأي لغة؟",
    "faq.a7": "[المكان والصيغة، عن بُعد أو حضورياً: تؤكدها هاجر] تتحدث هاجر الإنجليزية والعربية.",

    "book.slate": "(09) الحجز",
    "book.h2.l1": "ابدئي",
    "book.h2.l2": "بمكالمة مجانية.",
    "book.lead": "خمس عشرة دقيقة مع هاجر لتري إن كان UNBEATABLE مناسباً لك.",
    "book.cal.title": "مكالمة استراتيجية مجانية",
    "book.cal.len": "15 دقيقة",
    "book.stub.t": "تقويم هاجر يوضع هنا",
    "book.stub.ph": "[تضمين Calendly: غير متصل بعد]",
    "book.stub.s": "إلى أن يتم ربطه، راسلي هاجر بالبريد الإلكتروني أو على إنستغرام.",
    "book.embed.title": "حجز مكالمة استراتيجية مجانية مدتها 15 دقيقة مع هاجر",
    "book.open": "افتحي التقويم في تبويب جديد",
    "book.row1.label": "الحجز",
    "book.row1.value": "[Calendly، 15 دقيقة: الرابط قريباً]",
    "book.row2.label": "إنستغرام",
    "book.row3.label": "البريد الإلكتروني",
    "book.mail.btn": "راسلي هاجر",
    "book.ig.btn": "راسلي على إنستغرام",

    "msg.subject": "مكالمة استراتيجية مجانية مدتها 15 دقيقة",
    "msg.body.unbeatable": "مرحباً هاجر، أود حجز المكالمة الاستراتيجية المجانية (15 دقيقة). أسأل عن: UNBEATABLE. اسمي:",
    "msg.body.teen": "مرحباً هاجر، أنا ولي أمر مراهقة وأود حجز المكالمة الاستراتيجية المجانية (15 دقيقة). أسأل عن: مسار المراهقات. اسمي:",
    "msg.body.over40": "مرحباً هاجر، أود حجز المكالمة الاستراتيجية المجانية (15 دقيقة). أسأل عن: مسار النساء فوق الأربعين. اسمي:",
    "msg.body.peri": "مرحباً هاجر، أود حجز المكالمة الاستراتيجية المجانية (15 دقيقة). أسأل عن: مسار ما حول انقطاع الطمث. اسمي:",

    "sticky.text": "مكالمة استراتيجية مجانية مدتها 15 دقيقة",

    "foot.nav.aria": "روابط التذييل",
    "foot.tag": "Get fit, stay beat!",
    "foot.demo": "موقع تصوري. هذا ليس موقع Beat Fitness الفعلي.",
    "foot.disc1": "تدريب وليس رعاية طبية. استشيري طبيبك قبل أن تبدئي برنامج تمارين جديداً.",
    "foot.disc2": "[يبدأ ولي الأمر أو الوصي مسار المراهقات: تؤكده هاجر]"
  };

  /* English strings that script builds, or that carry a {n} token. Everything else is read from the HTML. */
  var EN = {
    "meta.title": "Beat Fitness Dubai: Get Fit, Stay Beat!",
    "meta.desc": "Concept site for Beat Fitness Dubai. Personal training for women, the 12-week UNBEATABLE program and a free 15 minute strategy call with Hager.",
    "prog.tab.aria": "Week {n}",
    "prog.week.label": "Week {n}",
    "prog.frame.ph": "[Week content from Hager: the phase name and what happens each week]",
    "prog.status": "Week {n} of 12.",
    "book.embed.title": "Book a free 15 minute strategy call with Hager",
    "strip.pause": "Pause scrolling text",
    "strip.play": "Play scrolling text",
    "kw.copy.done": "Copied. Now open Instagram.",
    "kw.copy.fail": "Select the word and copy it: UNBEATABLE",
    "kw.form.invalid": "Enter a valid email address.",
    "kw.form.stub": "This form isn't connected yet, so nothing was sent. You can email hager@beatfitness.me or message @hager_aboutaleb on Instagram.",
    "kw.form.fail": "That didn't go through. Your answers are still here, so you can try again.",
    "kw.form.ok": "Thanks. Your email was sent.",
    "msg.subject": "Free 15 minute strategy call",
    "msg.body.unbeatable": "Hi Hager, I would like to book the free 15 minute strategy call. I am asking about: UNBEATABLE. My name is",
    "msg.body.teen": "Hi Hager, I am the parent of a teen girl and would like to book the free 15 minute strategy call. I am asking about: the teen track. My name is",
    "msg.body.over40": "Hi Hager, I would like to book the free 15 minute strategy call. I am asking about: the women over 40 track. My name is",
    "msg.body.peri": "Hi Hager, I would like to book the free 15 minute strategy call. I am asking about: the perimenopause track. My name is"
  };

  var root = document.documentElement;
  var cur = root.lang === 'ar' ? 'ar' : 'en';
  var LATIN = /[A-Za-z@][A-Za-z0-9@._\-]*(?:(?: |, )[A-Za-z][A-Za-z0-9._\-]*)*(?:[,!]+(?=$))?/g;

  function dict(l) { return l === 'ar' ? AR : EN; }
  function fill(s, v) {
    if (!v) return s;
    return s.replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; });
  }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  /* Plain text for the active language. */
  function t(key, vars, lang) {
    var l = lang || cur;
    var s = dict(l)[key];
    if (s == null) s = EN[key];
    if (s == null) s = key;
    return fill(s, vars);
  }
  /* HTML for the active language: [..] becomes a placeholder, Latin runs get a bdi in Arabic. */
  function html(key, vars, lang) {
    var l = lang || cur;
    var s = esc(t(key, vars, l));
    s = s.replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>');
    if (l !== 'ar') return s;
    return s.split(/(<[^>]+>)/).map(function (seg) {
      return seg.charAt(0) === '<' ? seg : seg.replace(LATIN, '<bdi lang="en" dir="ltr">$&</bdi>');
    }).join('');
  }

  var cached = false;
  function cacheEnglish() {
    if (cached) return;
    cached = true;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      el.__en = el.innerHTML;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-attr]'), function (el) {
      el.__enAttr = {};
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var a = pair.split(':')[0].trim();
        if (a) el.__enAttr[a] = el.getAttribute(a);
      });
    });
  }

  function setMeta(sel, attr, val) {
    var m = document.querySelector(sel);
    if (m) m.setAttribute(attr, val);
  }

  function apply(lang) {
    cacheEnglish();
    cur = lang === 'ar' ? 'ar' : 'en';
    root.lang = cur;
    root.dir = cur === 'ar' ? 'rtl' : 'ltr';

    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var key = el.getAttribute('data-i18n');
      var n = el.getAttribute('data-n');
      var vars = n != null ? { n: n } : null;
      if (cur === 'ar') {
        if (AR[key] != null) el.innerHTML = html(key, vars, 'ar');
      } else if (vars && EN[key] != null) {
        el.innerHTML = html(key, vars, 'en');
      } else if (el.__en != null) {
        el.innerHTML = el.__en;
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-attr]'), function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var bits = pair.split(':');
        var a = (bits[0] || '').trim(), key = (bits[1] || '').trim();
        if (!a || !key) return;
        if (cur === 'ar' && AR[key] != null) el.setAttribute(a, AR[key]);
        else if (cur === 'en' && el.__enAttr && el.__enAttr[a] != null) el.setAttribute(a, el.__enAttr[a]);
      });
    });

    var btn = document.getElementById('lang-btn');
    if (btn) btn.lang = cur === 'ar' ? 'en' : 'ar';

    var title = t('meta.title'), desc = t('meta.desc');
    document.title = title;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', desc);

    root.classList.remove('i18n-pending');
    document.dispatchEvent(new CustomEvent('beat:lang', { detail: { lang: cur } }));
  }

  window.BeatI18n = {
    AR: AR,
    EN: EN,
    lang: function () { return cur; },
    t: t,
    html: html,
    apply: apply
  };

  /* First paint language was already set by the inline script in the head. */
  cacheEnglish();
  if (cur === 'ar') apply('ar');
})();
