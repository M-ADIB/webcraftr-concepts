/* Dr Muna Balfaqeeh, MB Lifestyle Consulting. Concept by Webcraftr.
   Plain JavaScript, no dependencies. Sections: config, dictionary, helpers,
   language, "Who are you right now" selector, booking message and email,
   course form, booking bar, reveal on scroll. */

/* CONFIRM BEFORE LAUNCH (B1): paste her own calendar link (Acuity or Cal.com) into bookingUrl.
   While it is empty, every Book button leads to the booking section (a demo preview), and the
   button there opens an email draft with the message shown in the preview card.
   CONFIRM BEFORE LAUNCH (README row 3): paste her confirmed address into email. While it is empty,
   no address is printed anywhere and every draft goes to DEMO_EMAIL, an address on the reserved
   .invalid domain that cannot receive mail, so a click on the demo can never reach her inbox. */
var MB_CONFIG = {
  bookingUrl: "",
  email: ""
};
var DEMO_EMAIL = "her-email@example.invalid";

(function () {
  "use strict";

  /*DICT-START*/
  var DICT = {
    ar: {
      "meta.title": "د. منى بالفقيه · MB Lifestyle Consulting",
      "meta.desc": "كوتشينغ بالعربية والإنجليزية للنساء في بداية فصل جديد، مع د. منى بالفقيه، كوتش تنفيذي وفنانة تشكيلية إماراتية في أبوظبي.",
      "skip": "تخطَّ إلى المحتوى",
      "nav.who": "لمن هذا",
      "nav.services": "الخدمات",
      "nav.about": "عن د. منى",
      "nav.course": "دورة الطلاب",
      "nav.cta": "احجزي جلستك",
      "nav.cta.short": "احجزي",
      "lang.toggle": "English",
      "lang.aria": "Switch to English",
      "sticky.name": "د. منى بالفقيه",
      "sticky.cta": "احجزي جلستك",
      "ph.portrait": "مكان الصورة الشخصية",

      "hero.eyebrow": "د. منى بالفقيه · كوتشينغ تنفيذي وانتقالات الحياة · أبوظبي",
      "hero.h1a": "ابدئي من جديد",
      "hero.h1b": "بكل ما تعرفينه.",
      "hero.lead": "كوتشينغ فردي بالعربية والإنجليزية للنساء في بداية فصل جديد، يبدأ مما تملكينه أصلًا من سنوات ومهارات وعلاقات.",
      "hero.cta1": "احجزي جلستك",
      "hero.cta2": "لمن هذا الكوتشينغ؟",

      "proof.eyebrow": "الخلفية",
      "proof.aoec.l": "الاعتماد",
      "proof.aoec.v": "دبلوم الممارسة في الكوتشينغ التنفيذي، أكاديمية الكوتشينغ التنفيذي (<bdi>AOEC</bdi>)",
      "proof.soas.l": "اللغويات",
      "proof.soas.v": "دكتوراه وماجستير، كلية الدراسات الشرقية والأفريقية (<bdi>SOAS</bdi>)، جامعة لندن",
      "proof.zu.l": "الإدارة",
      "proof.zu.v": "ماجستير إدارة الأعمال التنفيذي، جامعة زايد",

      "who.eyebrow": "لكِ",
      "who.title": "من أنتِ الآن؟",
      "who.sub": "اختاري ما يناسبكِ اليوم. تتغيّر الصفحة معكِ ويمكنكِ تغييره في أي وقت.",
      "who.chip.mother": "أم عاملة",
      "who.chip.career": "أعيد صياغة مساري المهني",
      "who.chip.retire": "أقترب من التقاعد",
      "who.chip.student": "طالب أو ولي أمر",
      "who.line.default": "اختاري البطاقة الأقرب إليكِ، وسيظهر هنا سطر موجّه إليكِ مع الخدمة التي نبدأ منها.",
      "who.line.mother": "أسبوعكِ مزدحم أصلًا. نبدأ منه كما هو، ثم نختار معًا أول قرار يستحق وقتكِ.",
      "who.line.career": "تحملين سنوات من المهارات والعلاقات والخبرة. نرسمها معًا ونختار وجهتها التالية.",
      "who.line.retire": "مرحلة جديدة تغيّر شكل الأيام. نحدد معًا ما تريدين أن يتسع له يومكِ، ونضع أول الخطوات.",
      "who.line.student": "اختيار التخصص وبداية الجامعة قراران كبيران في وقت واحد. تبدأ الرحلة بالدورة المجانية.",
      "who.student.link": "إلى الدورة المجانية",
      "who.reset": "إلغاء الاختيار",
      "who.tag.start": "ابدئي من هنا",
      "who.tag.also": "يناسب أيضًا",

      "svc.eyebrow": "الخدمات",
      "svc.title": "ثلاث طرق للعمل معًا",
      "svc.sub": "ابدئي بجلسة واحدة. وما بعدها قراركِ أنتِ.",
      "svc.1.name": "كوتشينغ فردي",
      "svc.1.body": "في جلسات الكوتشينغ نعمل معًا على طريقة التفكير والأهداف والمهارات التي تحتاجينها للانتقال إلى مرحلتكِ القادمة.",
      "svc.2.name": "ورش عمل مباشرة",
      "svc.2.body": "ورش مباشرة تفاعلية وعملية، تساعدكِ على الانتقال من التأمل إلى الخطوات الفعلية.",
      "svc.3.name": "دورات ذاتية",
      "svc.3.body": "مكتبة دورات تتعلمين منها في وقتكِ، سواء أردتِ بدء شيء جديد أو تغيير اتجاهكِ أو تحويل فكرة إلى خطة واضحة.",
      "svc.link": "كيف أحجز",
      "svc.ph": "مواعيد الورش القادمة وقائمة الدورات: بانتظار التأكيد",

      "about.eyebrow": "عنّي",
      "about.title": "الكوتش والفنانة",
      "about.tag": "مساحة لتبدئي من جديد.",
      "about.p1": "أنا فنانة تشكيلية إماراتية (ماجستير في الفنون الجميلة)، ولغوية وقيادية تنفيذية، وكوتش تنفيذي معتمد، وأمضيت أكثر من عقدين في التعليم ووضع السياسات وتمكين القيادات.",
      "about.p2": "يلتقي عملي بالناس عند مفترق: عودة إلى العمل، أو تغيير مجال، أو مرحلة جديدة في الحياة. أمنح كل واحدة الانتباه نفسه، بالعربية أو بالإنجليزية.",
      "about.ph": "ظهور على قناة بيوتنا ولجنة الشباب في <bdi>TEDx</bdi>: بانتظار التأكيد",

      "course.eyebrow": "للطلاب وأولياء الأمور",
      "course.badge": "مجانية",
      "course.title": "دورة مجانية للطلاب",
      "course.lead": "اختيار التخصص وبناء المسار والاستعداد للجامعة. سجّلوا بياناتكم لتصلكم تفاصيل الدورة.",
      "form.name": "الاسم",
      "form.email": "البريد الإلكتروني",
      "form.phone": "رقم الهاتف (اختياري)",
      "form.role": "أنا",
      "form.role.student": "طالب",
      "form.role.parent": "ولي أمر",
      "form.consent": "عمري ١٨ سنة فأكثر، أو يعبّئ النموذج ولي أمر.",
      "form.submit": "إرسال البيانات",
      "form.privacy": "تُستخدم هذه البيانات للرد بخصوص الدورة فقط. وإذا كان عمر الطالب أقل من ١٨ سنة فيُرجى أن يعبّئ ولي أمره النموذج أو يضيف بيانات تواصله.",
      "form.err.name": "يُرجى كتابة الاسم.",
      "form.err.email": "يُرجى كتابة بريد إلكتروني صحيح.",
      "form.err.consent": "يُرجى تأشير المربع للمتابعة.",
      "form.ok": "هذا النموذج غير موصول بعد، لذلك لم يُرسل شيء حتى الآن. فُتح بريدكم وفيه رسالة جاهزة، ولن تصل إلا إذا ضغطتم إرسال من هناك. وإن لم يفتح شيء فانسخوا الرسالة وأرسلوها من أي بريد.",
      "form.hp": "يُترك فارغًا",
      "form.copy": "نسخ الرسالة",
      "form.copied": "تم النسخ",
      "form.copy.fail": "تعذّر النسخ تلقائيًا. الرسالة جاهزة أدناه لتنسخوها.",

      "cmail.subject": "طلب تفاصيل الدورة المجانية للطلاب",
      "cmail.l1": "مرحبًا،",
      "cmail.l2": "أرغب في الحصول على تفاصيل الدورة المجانية.",
      "cmail.l3": "الاسم: {name}",
      "cmail.l4": "أنا: {role}",
      "cmail.l5": "البريد الإلكتروني: {email}",
      "cmail.l6": "الهاتف: {phone}",
      "cmail.l7": "شكرًا لكم.",

      "art.eyebrow": "الفن",
      "art.title": "الفن إلى جانب الكوتشينغ",
      "art.body": "وأعمل أيضًا فنانة تشكيلية في الوسائط المتعددة والخط العربي، وأتناول في أعمالي التراث والهوية والتحوّل.",
      "art.f1": "عمل فني قادم",
      "art.spec": "مثال طباعي بخط عارف رقعة، إلى أن تحل أعمالها مكانه.",

      "faq.eyebrow": "أسئلة",
      "faq.title": "أربعة أسئلة شائعة",
      "faq.q1": "هل الكوتشينغ مثل العلاج النفسي؟",
      "faq.a1": "لا. الكوتشينغ ينظر في أهدافكِ وقراراتكِ وخطواتكِ التالية. لا يشخّص أي حالة ولا يعالجها، وليس نصيحة طبية أو نفسية. وإذا احتجتِ هذا النوع من الدعم فتحدثي إلى مختص مرخّص.",
      "faq.q2": "بأي لغة تكون الجلسات؟",
      "faq.a2": "بالعربية أو بالإنجليزية، حسب ما يكون أقرب إليكِ.",
      "faq.q3": "ما النتائج التي يمكنني توقعها؟",
      "faq.a3": "لا يمكن للكوتشينغ أن يعد بنتيجة معينة، لأن القرارات قراركِ أنتِ. ما أقدمه نظرة واضحة إلى خياراتكِ، وأسئلة صريحة، وانتباهي الكامل.",
      "faq.q4": "أنا ولي أمر. هل يستطيع ابني أو ابنتي الانضمام إلى الدورة المجانية؟",
      "faq.a4": "نعم. يمكن لولي الأمر تعبئة النموذج نيابةً عن ابنه أو ابنته، أو إضافة بيانات تواصله.",

      "book.eyebrow": "الحجز",
      "book.demo": "معاينة تجريبية",
      "book.title": "ابدئي بجلسة واحدة.",
      "book.body": "هذه معاينة تجريبية. بعد ربط تقويم د. منى ستختارين وقتكِ هنا مباشرة. حتى ذلك الحين يفتح الزر رسالة جاهزة في بريدكِ.",
      "book.body.live": "اختاري وقتًا يناسبكِ من تقويم د. منى.",
      "book.preview": "الرسالة التي ستفتح في بريدكِ",
      "book.cta": "احجزي جلستك",
      "book.alt": "أو راسلي",

      "mail.subject": "طلب حجز جلسة من موقع MB Lifestyle Consulting",
      "mail.l1": "مرحبًا د. منى،",
      "mail.l2": "أرغب في حجز جلسة.",
      "mail.l3": "أين أنا الآن: {persona}.",
      "mail.l4": "اللغة المفضلة: {lang}.",
      "mail.l5": "اسمي:",
      "mail.l6": "وسيلة التواصل المناسبة:",
      "mail.l7": "شكرًا لكِ.",
      "mail.lang.ar": "العربية",
      "mail.lang.en": "الإنجليزية",
      "mail.persona.mother": "أم عاملة",
      "mail.persona.career": "أعيد صياغة مساري المهني",
      "mail.persona.retire": "أقترب من التقاعد",
      "mail.persona.student": "طالب أو ولي أمر",

      "foot.place": "أبوظبي، الإمارات العربية المتحدة",
      "foot.contact": "التواصل",
      "foot.email.ph": "البريد الإلكتروني: بانتظار التأكيد",
      "foot.ig": "إنستغرام",
      "foot.yt": "يوتيوب",
      "foot.compliance": "الكوتشينغ ليس علاجًا نفسيًا ولا نصيحة طبية أو نفسية، ولا يشخّص أي حالة ولا يعالجها.",
    },
    en: {
      "meta.title": "Dr Muna Balfaqeeh · MB Lifestyle Consulting",
      "meta.desc": "Coaching in Arabic and English for women choosing their next chapter, with Dr Muna Balfaqeeh, an Emirati executive coach and visual artist in Abu Dhabi.",
      "skip": "Skip to content",
      "nav.who": "Who it is for",
      "nav.services": "Services",
      "nav.about": "About",
      "nav.course": "Student course",
      "nav.cta": "Book your session",
      "nav.cta.short": "Book",
      "lang.toggle": "العربية",
      "lang.aria": "التبديل إلى العربية",
      "sticky.name": "Dr Muna Balfaqeeh",
      "sticky.cta": "Book your session",
      "ph.portrait": "Portrait to come",

      "hero.eyebrow": "Dr Muna Balfaqeeh · Executive and life-transition coaching · Abu Dhabi",
      "hero.h1a": "Begin again,",
      "hero.h1b": "with all you know.",
      "hero.lead": "One-to-one coaching in Arabic and English for women choosing their next chapter, built on the years, skills and people you already have.",
      "hero.cta1": "Book your session",
      "hero.cta2": "Who is this for?",

      "proof.eyebrow": "Background",
      "proof.aoec.l": "Credential",
      "proof.aoec.v": "Practitioner Diploma in Executive Coaching, Academy of Executive Coaching (<bdi>AOEC</bdi>)",
      "proof.soas.l": "Linguistics",
      "proof.soas.v": "PhD and MA, <bdi>SOAS</bdi>, University of London",
      "proof.zu.l": "Business",
      "proof.zu.v": "Executive MBA, Zayed University",

      "who.eyebrow": "For you",
      "who.title": "Who are you right now?",
      "who.sub": "Choose the one that fits today. The page adjusts, and you can change it any time.",
      "who.chip.mother": "A working mother",
      "who.chip.career": "Reinventing my career",
      "who.chip.retire": "Entering retirement",
      "who.chip.student": "A student or a parent",
      "who.line.default": "Choose the card closest to you and a line written for you appears here, with the service we would start from.",
      "who.line.mother": "Your week is already full. We start from it as it is, then choose the first decision worth your time.",
      "who.line.career": "You carry years of skills, contacts and judgement. We map them and choose where to take them next.",
      "who.line.retire": "A new stage changes the shape of every day. We look at what you want it to hold and plan the first steps.",
      "who.line.student": "Choosing a major and starting university are two big decisions at once. The free course is where to start.",
      "who.student.link": "Go to the free course",
      "who.reset": "Clear",
      "who.tag.start": "Start here",
      "who.tag.also": "Also fits",

      "svc.eyebrow": "Services",
      "svc.title": "Three ways to work together",
      "svc.sub": "Start with one session. What comes next is your decision.",
      "svc.1.name": "One-to-one coaching",
      "svc.1.body": "Every new stage needs new strategies. In coaching sessions we work together on your mindset, your goals and the skills for your next chapter.",
      "svc.2.name": "Live workshops",
      "svc.2.body": "Live workshops that are interactive and practical, to help you move from reflection to action.",
      "svc.3.name": "Self-paced courses",
      "svc.3.body": "A library of courses you take in your own time, whether you want to start something new, change direction or turn an idea into a plan.",
      "svc.link": "See how to book",
      "svc.ph": "Next workshop dates and the course list: awaiting confirmation",

      "about.eyebrow": "About",
      "about.title": "The coach and the artist",
      "about.tag": "A space to begin again.",
      "about.p1": "I am an Emirati visual artist (Master of Fine Arts), linguist and executive leader, and a certified executive coach, with more than two decades in education, policy development and leadership empowerment.",
      "about.p2": "My work meets people at a turn: a return to work, a change of field, a new stage of life. I give each of them the same attention, in Arabic or in English.",
      "about.ph": "Bayootna TV appearance and <bdi>TEDx</bdi> youth committee: awaiting confirmation",

      "course.eyebrow": "For students and parents",
      "course.badge": "Free",
      "course.title": "A free course for students",
      "course.lead": "Choosing a major, building your path and getting ready for university. Leave your details and the course information will reach you.",
      "form.name": "Name",
      "form.email": "Email",
      "form.phone": "Phone (optional)",
      "form.role": "I am",
      "form.role.student": "A student",
      "form.role.parent": "A parent or guardian",
      "form.consent": "I am 18 or older, or a parent or guardian is filling this in.",
      "form.submit": "Send my details",
      "form.privacy": "We use these details only to reply about the course. If you are under 18, please ask a parent or guardian to fill this in or to add their own contact details.",
      "form.err.name": "Please add your name.",
      "form.err.email": "Please add a valid email.",
      "form.err.consent": "Please tick the box to continue.",
      "form.ok": "This form isn't connected yet, so nothing has been sent. Your email app should have opened with the message ready, and it only arrives if you press send there. If nothing opened, copy the message and send it from any email app.",
      "form.hp": "Leave this field empty",
      "form.copy": "Copy the message",
      "form.copied": "Copied",
      "form.copy.fail": "Copying did not work automatically. The message is below so you can copy it.",

      "cmail.subject": "Free student course: details request",
      "cmail.l1": "Hello,",
      "cmail.l2": "I would like the details of the free course.",
      "cmail.l3": "Name: {name}",
      "cmail.l4": "I am: {role}",
      "cmail.l5": "Email: {email}",
      "cmail.l6": "Phone: {phone}",
      "cmail.l7": "Thank you.",

      "art.eyebrow": "Art",
      "art.title": "Art beside the coaching",
      "art.body": "I also work as a visual artist in mixed media and Arabic calligraphy, exploring heritage, identity and transformation.",
      "art.f1": "Artwork to come",
      "art.spec": "Heritage, identity, transformation, set in Aref Ruqaa. A typographic stand-in until her own work goes here.",

      "faq.eyebrow": "Questions",
      "faq.title": "Four common questions",
      "faq.q1": "Is coaching the same as therapy?",
      "faq.a1": "No. Coaching looks at your goals, decisions and next steps. It does not diagnose or treat any condition, and it is not medical or mental-health advice. If you need that kind of support, please speak to a licensed professional.",
      "faq.q2": "Which language are sessions in?",
      "faq.a2": "Arabic or English, whichever feels natural to you.",
      "faq.q3": "What results can I expect?",
      "faq.a3": "Coaching cannot promise an outcome, because the decisions are yours. What I offer is a clear look at your options, honest questions and my full attention.",
      "faq.q4": "I am a parent. Can my child join the free course?",
      "faq.a4": "Yes. A parent or guardian can fill in the form on behalf of their child, or add their own contact details.",

      "book.eyebrow": "Book",
      "book.demo": "Demo preview",
      "book.title": "Start with one session.",
      "book.body": "This is a demo preview. Once Dr Muna's calendar is connected you will choose your time here. Until then the button opens a ready message in your email app.",
      "book.body.live": "Choose a time that suits you in Dr Muna's calendar.",
      "book.preview": "The message your email app will open",
      "book.cta": "Book your session",
      "book.alt": "Or write to",

      "mail.subject": "Session request from the MB Lifestyle Consulting site",
      "mail.l1": "Hello Dr Muna,",
      "mail.l2": "I would like to book a session.",
      "mail.l3": "Where I am right now: {persona}.",
      "mail.l4": "Preferred language: {lang}.",
      "mail.l5": "My name:",
      "mail.l6": "How to reach me:",
      "mail.l7": "Thank you.",
      "mail.lang.ar": "Arabic",
      "mail.lang.en": "English",
      "mail.persona.mother": "a working mother",
      "mail.persona.career": "reinventing my career",
      "mail.persona.retire": "entering retirement",
      "mail.persona.student": "a student or a parent",

      "foot.place": "Abu Dhabi, UAE",
      "foot.contact": "Contact",
      "foot.email.ph": "Email: awaiting confirmation",
      "foot.ig": "Instagram",
      "foot.yt": "YouTube",
      "foot.compliance": "Coaching is not therapy, medical or mental-health advice. It does not diagnose or treat any condition.",
    }
  };
  /*DICT-END*/

  /* CONFIRM BEFORE LAUNCH (B9): which service suits which person is a design assumption. */
  var PERSONAS = ["mother", "career", "retire", "student"];
  var MAP = {
    mother: { primary: "one", also: "work" },
    career: { primary: "one", also: "course" },
    retire: { primary: "one", also: "work" },
    student: { primary: "course", also: "one" }
  };
  var ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

  var root = document.documentElement;
  var lang = root.lang === "en" ? "en" : "ar";
  var persona = "";
  var preloaded = {};

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function t(key) {
    var L = DICT[lang];
    if (L && L[key] != null) { return L[key]; }
    return DICT.ar[key] || "";
  }
  function reduced() {
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  }
  function save(key, value) {
    try {
      if (value) { localStorage.setItem(key, value); } else { localStorage.removeItem(key); }
    } catch (e) {}
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function setParam(key, value) {
    try {
      var u = new URL(window.location.href);
      if (value) { u.searchParams.set(key, value); } else { u.searchParams.delete(key); }
      window.history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch (e) {}
  }
  function formatNum(s) {
    if (lang !== "ar") { return s; }
    return String(s).replace(/[0-9]/g, function (d) { return ARABIC_DIGITS.charAt(+d); });
  }
  function fill(str, token, value) {
    return str.replace(token, function () { return value; });
  }

  /* ---------- dictionary ---------- */
  function setMeta(sel, value) {
    var el = $(sel);
    if (el) { el.setAttribute("content", value); }
  }
  function apply() {
    $$("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (el.textContent !== v) { el.textContent = v; }
    });
    $$("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    $$("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var i = pair.indexOf(":");
        if (i > 0) { el.setAttribute(pair.slice(0, i).trim(), t(pair.slice(i + 1).trim())); }
      });
    });
    $$("[data-num]").forEach(function (el) {
      el.textContent = formatNum(el.getAttribute("data-num"));
    });
    document.title = t("meta.title");
    setMeta('meta[name="description"]', t("meta.desc"));
    setMeta('meta[property="og:title"]', t("meta.title"));
    setMeta('meta[property="og:description"]', t("meta.desc"));
    setMeta('meta[name="twitter:title"]', t("meta.title"));
    setMeta('meta[name="twitter:description"]', t("meta.desc"));
    setMeta('meta[property="og:locale"]', lang === "ar" ? "ar_AE" : "en_US");
    setMeta('meta[property="og:locale:alternate"]', lang === "ar" ? "en_US" : "ar_AE");
  }

  /* ---------- language ---------- */
  function preloadFonts(l) {
    if (preloaded[l]) { return; }
    preloaded[l] = true;
    var files = l === "ar"
      ? ["almarai-arabic-400-normal", "almarai-arabic-700-normal", "aref-ruqaa-arabic-700-normal"]
      : ["instrument-serif-latin-400-normal", "hanken-grotesk-latin-wght-normal"];
    files.forEach(function (f) {
      var href = "assets/fonts/" + f + ".woff2";
      if ($('link[rel="preload"][href="' + href + '"]')) { return; }
      var k = document.createElement("link");
      k.rel = "preload"; k.as = "font"; k.type = "font/woff2"; k.crossOrigin = "anonymous"; k.href = href;
      document.head.appendChild(k);
    });
  }
  function setLang(l) {
    lang = l;
    root.lang = l;
    root.dir = l === "ar" ? "rtl" : "ltr";
    apply();
    var toggle = $("#lang-toggle");
    if (toggle) { toggle.setAttribute("lang", l === "ar" ? "en" : "ar"); }
    renderPersona(false);
    renderPreview();
    renderEmail();
    reserveLine();
  }
  function switchLang() {
    var next = lang === "ar" ? "en" : "ar";
    save("mb-lang", next);
    setParam("lang", next);
    preloadFonts(next);
    if (reduced()) { setLang(next); return; }
    root.classList.add("lang-fade");
    window.setTimeout(function () {
      setLang(next);
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { root.classList.remove("lang-fade"); });
      });
    }, 140);
  }

  /* ---------- "Who are you right now?" ---------- */
  function renderPersona(animate) {
    var chips = $$(".chip");
    chips.forEach(function (c, i) {
      var on = c.getAttribute("data-persona") === persona;
      c.setAttribute("aria-checked", on ? "true" : "false");
      c.tabIndex = (persona ? on : i === 0) ? 0 : -1;
    });
    var map = MAP[persona];
    $$(".card").forEach(function (card) {
      var id = card.getAttribute("data-svc");
      var role = map ? (map.primary === id ? "primary" : (map.also === id ? "also" : "")) : "";
      card.setAttribute("data-role", role);
      var tag = $(".card__tag", card);
      if (tag) { tag.textContent = role === "primary" ? t("who.tag.start") : (role === "also" ? t("who.tag.also") : ""); }
    });
    var link = $("#who-student-link");
    var reset = $("#who-reset");
    if (link) { link.hidden = persona !== "student"; }
    if (reset) { reset.hidden = !persona; }

    var line = $("#who-line");
    if (!line) { return; }
    var key = "who.line." + (persona || "default");
    if (line.getAttribute("data-i18n") === key && line.textContent === t(key)) { return; }
    line.setAttribute("data-i18n", key);
    if (animate && !reduced()) {
      line.classList.add("is-swapping");
      window.setTimeout(function () {
        line.textContent = t(line.getAttribute("data-i18n"));
        line.classList.remove("is-swapping");
      }, 120);
    } else {
      line.textContent = t(key);
    }
  }
  /* The answer slot is as tall as the tallest of its five lines at the current width and language, so choosing a
     card never moves the page and no empty space is reserved beyond that. Measured on a hidden copy. */
  function reserveLine() {
    var line = $("#who-line");
    if (!line || !line.parentNode) { return; }
    var width = line.getBoundingClientRect().width;
    if (!width) { return; }
    var probe = line.cloneNode(false);
    probe.removeAttribute("id");
    probe.removeAttribute("aria-live");
    probe.removeAttribute("data-i18n");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;min-block-size:0;inline-size:" + width + "px";
    line.parentNode.appendChild(probe);
    var tallest = 0;
    ["default"].concat(PERSONAS).forEach(function (k) {
      probe.textContent = t("who.line." + k);
      tallest = Math.max(tallest, probe.getBoundingClientRect().height);
    });
    line.parentNode.removeChild(probe);
    line.style.minBlockSize = Math.ceil(tallest) + "px";
  }
  function selectPersona(p) {
    persona = PERSONAS.indexOf(p) > -1 ? p : "";
    save("mb-persona", persona);
    setParam("persona", persona);
    renderPersona(true);
    renderPreview();
  }
  function initPersona() {
    var chips = $("#chips");
    if (!chips) { return; }
    var fromUrl = null;
    try { fromUrl = new URLSearchParams(window.location.search).get("persona"); } catch (e) {}
    var start = PERSONAS.indexOf(fromUrl) > -1 ? fromUrl : read("mb-persona");
    persona = PERSONAS.indexOf(start) > -1 ? start : "";

    chips.addEventListener("click", function (e) {
      var chip = e.target.closest ? e.target.closest(".chip") : null;
      if (chip) { selectPersona(chip.getAttribute("data-persona")); }
    });
    chips.addEventListener("keydown", function (e) {
      var list = $$(".chip");
      var i = list.indexOf(document.activeElement);
      if (i < 0) { return; }
      var rtl = root.dir === "rtl";
      var n;
      switch (e.key) {
        case "ArrowRight": n = rtl ? i - 1 : i + 1; break;
        case "ArrowLeft": n = rtl ? i + 1 : i - 1; break;
        case "ArrowDown": n = i + 1; break;
        case "ArrowUp": n = i - 1; break;
        case "Home": n = 0; break;
        case "End": n = list.length - 1; break;
        default: return;
      }
      e.preventDefault();
      n = (n + list.length) % list.length;
      list[n].focus();
      selectPersona(list[n].getAttribute("data-persona"));
    });
    var reset = $("#who-reset");
    if (reset) {
      reset.addEventListener("click", function () {
        selectPersona("");
        var first = $(".chip");
        if (first) { first.focus(); }
      });
    }
  }

  /* ---------- booking message ---------- */
  function bookingMessage() {
    var lines = [t("mail.l1"), t("mail.l2")];
    if (persona) { lines.push(fill(t("mail.l3"), "{persona}", t("mail.persona." + persona))); }
    lines.push(fill(t("mail.l4"), "{lang}", t("mail.lang." + lang)));
    lines.push(t("mail.l5"), t("mail.l6"), t("mail.l7"));
    return { subject: t("mail.subject"), body: lines.join("\n") };
  }
  function mailto(subject, body) {
    return "mailto:" + (MB_CONFIG.email || DEMO_EMAIL) +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body.replace(/\n/g, "\r\n"));
  }
  function renderPreview() {
    var m = bookingMessage();
    var subject = $("#prev-subject");
    var msg = $("#prev-msg");
    var cta = $("#book-cta");
    if (subject) { subject.textContent = m.subject; }
    if (msg) { msg.textContent = m.body; }
    if (cta && !MB_CONFIG.bookingUrl) { cta.setAttribute("href", mailto(m.subject, m.body)); }
  }
  /* Her address is printed only once it is confirmed and set in MB_CONFIG.email. */
  function renderEmail() {
    var email = MB_CONFIG.email;
    [["#foot-email", "#foot-email-ph"], ["#book-email", null]].forEach(function (pair) {
      var a = $(pair[0]);
      var ph = pair[1] ? $(pair[1]) : null;
      if (a) {
        if (email) { a.setAttribute("href", "mailto:" + email); a.textContent = email; }
        a.hidden = !email;
      }
      if (ph) { ph.hidden = !!email; }
    });
    var alt = $("#book-alt");
    if (alt) { alt.hidden = !email; }
  }
  function wireBooking() {
    if (!MB_CONFIG.bookingUrl) { return; }
    $$("[data-book], #book-cta").forEach(function (a) {
      a.setAttribute("href", MB_CONFIG.bookingUrl);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
    var prev = $("#book-preview");
    var tag = $("#demo-tag");
    var body = $("#book-body");
    if (prev) { prev.hidden = true; }
    if (tag) { tag.hidden = true; }
    if (body) { body.setAttribute("data-i18n", "book.body.live"); body.textContent = t("book.body.live"); }
  }

  /* ---------- course form (sends nothing, opens a prefilled email) ---------- */
  function setError(inputId, errId, key) {
    var input = $("#" + inputId);
    var err = $("#" + errId);
    if (!input || !err) { return; }
    if (key) {
      input.setAttribute("aria-invalid", "true");
      err.setAttribute("data-i18n", key);
      err.textContent = t(key);
    } else {
      input.removeAttribute("aria-invalid");
      err.removeAttribute("data-i18n");
      err.textContent = "";
    }
  }
  function initForm() {
    var form = $("#course-form");
    if (!form) { return; }
    var status = $("#form-status");
    var fallback = $("#form-fallback");
    var copyBtn = $("#form-copy");
    var msgBox = $("#form-msg");
    var lastMessage = "";
    var copyTimer = 0;
    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return Promise.reject(new Error("no clipboard"));
    }
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (!lastMessage) { return; }
        copyText(lastMessage).then(function () {
          copyBtn.setAttribute("data-i18n", "form.copied");
          copyBtn.textContent = t("form.copied");
          window.clearTimeout(copyTimer);
          copyTimer = window.setTimeout(function () {
            copyBtn.setAttribute("data-i18n", "form.copy");
            copyBtn.textContent = t("form.copy");
          }, 2400);
        }, function () {
          if (msgBox) {
            msgBox.hidden = false;
            msgBox.value = lastMessage;
            msgBox.focus();
            msgBox.select();
          }
          if (status) { status.setAttribute("data-i18n", "form.copy.fail"); status.textContent = t("form.copy.fail"); }
        });
      });
    }
    [["f-name", "e-name"], ["f-email", "e-email"], ["f-consent", "e-consent"]].forEach(function (p) {
      var el = $("#" + p[0]);
      if (el) {
        el.addEventListener(el.type === "checkbox" ? "change" : "input", function () { setError(p[0], p[1], null); });
      }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.elements.company_url && form.elements.company_url.value) { return; } /* honeypot: dropped silently */
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var phone = form.elements.phone.value.trim();
      var consent = form.elements.consent.checked;
      var first = null;
      var nameBad = !name;
      var emailBad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setError("f-name", "e-name", nameBad ? "form.err.name" : null);
      setError("f-email", "e-email", emailBad ? "form.err.email" : null);
      setError("f-consent", "e-consent", consent ? null : "form.err.consent");
      if (nameBad) { first = $("#f-name"); }
      else if (emailBad) { first = $("#f-email"); }
      else if (!consent) { first = $("#f-consent"); }
      if (first) {
        if (status) { status.hidden = true; status.removeAttribute("data-i18n"); }
        if (fallback) { fallback.hidden = true; }
        first.focus();
        return;
      }
      var roleEl = form.querySelector('input[name="role"]:checked');
      var role = t("form.role." + (roleEl ? roleEl.value : "student"));
      if (lang === "en") { role = role.charAt(0).toLowerCase() + role.slice(1); }
      var lines = [
        t("cmail.l1"),
        t("cmail.l2"),
        fill(t("cmail.l3"), "{name}", name),
        fill(t("cmail.l4"), "{role}", role),
        fill(t("cmail.l5"), "{email}", email)
      ];
      if (phone) { lines.push(fill(t("cmail.l6"), "{phone}", phone)); }
      lines.push(t("cmail.l7"));
      var body = lines.join("\n");
      var href = mailto(t("cmail.subject"), body);
      lastMessage = t("cmail.subject") + "\n\n" + body;
      if (status) {
        status.hidden = false;
        status.setAttribute("data-i18n", "form.ok");
        status.textContent = t("form.ok");
      }
      /* The form keeps what was typed. A mail link cannot report that no mail app opened, so nothing is cleared,
         and the copy button below the status gives a way to send the message from anywhere. */
      if (fallback) { fallback.hidden = false; }
      if (msgBox) { msgBox.hidden = true; }
      var a = document.createElement("a");
      a.href = href;
      a.hidden = true;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /* ---------- booking bar ---------- */
  function initSticky() {
    var bar = $("#sticky");
    var heroCta = $("#hero-cta");
    if (!bar || !heroCta || !("IntersectionObserver" in window)) { return; }
    var heroGone = false;
    var seen = {};
    function update() {
      var ending = Object.keys(seen).some(function (k) { return seen[k]; });
      bar.classList.toggle("is-on", heroGone && !ending);
    }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { heroGone = !en.isIntersecting && en.boundingClientRect.top < 0; });
      update();
    }).observe(heroCta);
    var endIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.id || "footer"] = en.isIntersecting; });
      update();
    }, { rootMargin: "0px 0px -25% 0px" });
    /* The bar stays out of the way where the visitor is already acting: the course form (it would cover the
       fields and the submit button on a phone), the booking section and the footer. */
    var course = $("#course");
    var book = $("#book");
    var foot = $(".site-footer");
    if (course) { endIO.observe(course); }
    if (book) { endIO.observe(book); }
    if (foot) { endIO.observe(foot); }
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    var els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }); /* a block reveals once 12% of it is past the 8% line. The hero parts do not wait for this, see below. */
    els.forEach(function (el) { io.observe(el); });
    /* The hero is the first composition: its parts (portrait included) reveal on load, staggered by their own delays,
       whatever the screen height, instead of waiting for the portrait to scroll into the observer's window. */
    $$(".hero [data-reveal]").forEach(function (el) {
      window.requestAnimationFrame(function () { el.classList.add("in"); io.unobserve(el); });
    });
  }

  /* ---------- start ---------- */
  function init() {
    if (lang !== "ar") { apply(); }
    var toggle = $("#lang-toggle");
    if (toggle) {
      toggle.setAttribute("lang", lang === "ar" ? "en" : "ar");
      toggle.addEventListener("click", switchLang);
    }
    initPersona();
    renderPersona(false);
    wireBooking();
    renderPreview();
    renderEmail();
    initForm();
    initSticky();
    initReveal();
    reserveLine();
    var rz = 0;
    window.addEventListener("resize", function () {
      window.clearTimeout(rz);
      rz = window.setTimeout(reserveLine, 120);
    });
    if (document.fonts) {
      if (document.fonts.ready) { document.fonts.ready.then(reserveLine); }
      if (document.fonts.addEventListener) { document.fonts.addEventListener("loadingdone", reserveLine); }
    }
    window.__mbReady = true;
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
