import { reviews } from "./reviews";
import { fixReviewCount, services } from "./services";
import type { Locale } from "./locale";
import type { Service, ServiceId } from "./types";

/**
 * The Arabic text of every service, written in Arabic rather than translated.
 * Each headline carries the phrase an Arabic buyer searches for, once: "برمجة
 * تطبيقات الجوال" on the new-app page, "إصلاح تطبيق Flutter" on the fix page.
 * Ids, slugs, proof targets and FAQ ids are shared.
 */
type ServiceText = Pick<
  Service,
  | "title"
  | "headline"
  | "summary"
  | "audience"
  | "body"
  | "includes"
  | "situations"
  | "scope"
  | "deliverables"
  | "boundaries"
  | "message"
> & {
  /** In the same order as the English proof. A name is only given when it changes. */
  proof: { name?: string; note: string }[];
  /** In the same order as the English FAQ. */
  faq: { q: string; a: string }[];
};

const ar: Partial<Record<ServiceId, ServiceText>> = {
  new_app: {
    title: "تطبيق جديد، من الفكرة إلى المتاجر",
    headline: "برمجة تطبيقات الجوال لنظامي Android وiOS",
    summary:
      "تطبيق جوال جديد لنشاطك: كود Flutter واحد لنظامي Android وiOS، بالعربية والإنجليزية، من الفكرة حتى النشر على App Store وGoogle Play.",
    audience: "لأصحاب الأفكار والشركات التي تبدأ من الصفر",
    body: "كود Flutter واحد لنظامي Android وiOS، أتولاه من المعمارية حتى نشره في المتاجر.",
    includes: [
      "العربية والإنجليزية، مع دعم الاتجاه من اليمين إلى اليسار",
      "ربط مع Firebase أو واجهات REST أو GraphQL",
      "النشر على App Store وGoogle Play",
    ],
    situations: [
      {
        title: "لديك فكرة وليس لديك فريق تقني",
        body: "تعرف ما يجب أن يقدمه التطبيق لعملائك، وتحتاج من يحوّل ذلك إلى نطاق عمل مكتوب ثم إلى تطبيق يعمل.",
      },
      {
        title: "الحجوزات أو الطلبات أو التقارير ما زالت بالهاتف والورق",
        body: "العمل قائم كل يوم، ويحتاج أن ينتقل إلى الجوال، كما نقل AYCO تقارير الصيانة الموقّعة من الورق.",
      },
      {
        title: "عملاؤك يقرؤون العربية",
        body: "يجب أن يكون التطبيق من اليمين إلى اليسار من أول شاشة، لا أن يُعكس اتجاهه في النهاية.",
      },
      {
        title: "تحتاج Android وiOS معًا",
        body: "كود واحد يبني النسختين، فتُبنيان وتُحدَّثان معًا.",
      },
    ],
    scope: [
      {
        title: "قبل كتابة أي كود",
        items: ["نطاق عمل مكتوب: ما سيُبنى وما لن يُبنى", "سعر ومدة واقعيان، مقسّمان إلى مراحل"],
      },
      {
        title: "التطبيق",
        items: [
          "كود Flutter واحد لنظامي Android وiOS",
          "العربية والإنجليزية، مع دعم الاتجاه من اليمين إلى اليسار",
          "تسجيل الدخول والإشعارات والخرائط والدفع حيث يحتاجها التطبيق",
        ],
      },
      {
        title: "الخدمات الخلفية",
        items: [
          "Firebase، أو واجهات REST أو GraphQL الموجودة لديك",
          "أدوار وصلاحيات يفرضها الخادم",
          "عمل دون اتصال يتزامن عند عودة الإنترنت",
        ],
      },
      {
        title: "النشر",
        items: ["تجهيز صفحات التطبيق في المتاجر", "النشر على App Store وGoogle Play"],
      },
    ],
    deliverables: [
      "التطبيق منشورًا على App Store وGoogle Play",
      "نطاق عمل مكتوب وتقدير قبل بدء العمل",
      "تحديث عند كل مرحلة دون أن تضطر للسؤال",
      "الكود المصدري كاملًا بين يديك",
    ],
    proof: [
      {
        note: "بنيته بمفردي، من تطبيق Flutter إلى الخدمات الخلفية على Firebase ونسخ الإصدار: زيارات تعمل دون اتصال وتقارير PDF عربية موقّعة.",
      },
      {
        note: "قدته من المعمارية الأولى حتى الإطلاق: تدريب على اختبار القيادة النظري وحجز الدروس للمتعلمين في المغرب.",
      },
      {
        note: "شبكة طبية في ليبيا تربط الناس بالمستشفيات والعيادات والأطباء، مع إشعارات فورية وجدولة للمواعيد.",
      },
      { note: "سوق متعدد البائعين للمنتجات الجديدة والمستعملة." },
    ],
    faq: [
      {
        q: "لدي فكرة فقط. هل تكفي للبدء؟",
        a: "نعم. الخطوة الأولى نطاق عمل مكتوب: نتفق على ما سيُبنى وما لن يُبنى قبل كتابة أي كود، ومنه يأتي التقدير.",
      },
      {
        q: "هل أحصل على نسختي Android وiOS؟",
        a: "نعم. يُبنى التطبيق مرة واحدة بـFlutter ويُنشر على App Store وGoogle Play.",
      },
      {
        q: "هل يمكن أن يكون التطبيق بالعربية؟",
        a: "نعم، ويُصمَّم من اليمين إلى اليسار من أول شاشة. في AYCO بُنيت الشاشات وتقارير PDF والنماذج المطبوعة بالعربية أولًا.",
      },
      {
        q: "كم يكلّف تطبيق جديد؟",
        a: "يعتمد ذلك على ما يجب أن يفعله التطبيق، لذلك أحدد السعر بعد الاتفاق على نطاق العمل. تحصل على سعر ومدة مقسّمين إلى مراحل يمكنك مراجعتها.",
      },
      {
        q: "هل أحتاج إلى خدمات خلفية جاهزة؟",
        a: "لا. أستطيع بناءها على Firebase كما فعلت في AYCO، أو ربط التطبيق بواجهات REST أو GraphQL الموجودة لدى فريقك.",
      },
      {
        q: "لمن يكون الكود؟",
        a: "لك. تحصل على الكود المصدري كاملًا.",
      },
      {
        q: "هل يمكنك الاستمرار بعد الإطلاق؟",
        a: "نعم، للإصلاحات والميزات التالية: بمراحل متفق عليها، أو بالساعة عبر Upwork أو Freelancer.",
      },
    ],
    boundaries: [
      "سعرًا قبل الاتفاق على نطاق العمل. أي رقم قبل ذلك تخمين.",
      "موعد إطلاق قبل التقدير. المدة تأتي مع المراحل لا قبلها.",
    ],
    message: "مرحبًا محمد، أريد بناء تطبيق جديد.",
  },
  existing_app: {
    title: "إصلاح تطبيقك الحالي وتطويره",
    headline: "إصلاح تطبيق Flutter وتطويره",
    summary:
      "تطبيق فلاتر يتوقف أو لا يُبنى، أو تعطّل بعد رحيل المطور؟ أصلحه وأكمل البناء على الكود والخدمات الخلفية الموجودة لديك.",
    audience: "للفرق التي توقف تطبيقها أو غادرها المطور",
    body: "تطبيق بدأه مطور آخر. أعمل على ما هو موجود بدل البدء من جديد.",
    includes: [
      "إصلاح الأعطال وحالات الانهيار",
      "تحديث Flutter والحزم",
      "ميزات جديدة على الخدمات الخلفية الحالية",
    ],
    situations: [
      {
        title: "لم يعد التطبيق يُبنى",
        body: "ترقية Flutter أو إحدى الحزم كسرت البناء، أو صار Xcode وGradle يرفضان ما كان يعمل.",
      },
      {
        title: "يتوقف فجأة، أو فيه ميزة لم تعمل يومًا",
        body: "يواجه المستخدمون انهيارًا، أو تتجمد شاشة، أو تفشل خطوة في منتصفها ولا أحد يعرف السبب.",
      },
      {
        title: "المطور رحل",
        body: "لديك الكود أو جزء منه، ولم يبقَ من يعرف كيف تترابط أجزاؤه.",
      },
      {
        title: "التطبيق يحتاج أن يكبر",
        body: "الخدمات الخلفية تبقى كما هي، والتطبيق يحتاج ميزات جديدة فوقها.",
      },
    ],
    scope: [
      {
        title: "الإصلاحات",
        items: [
          "الأعطال وحالات الانهيار",
          "أخطاء البناء على Android وiOS",
          "رفض التطبيق في المتجر",
          "الخطوات التي تفشل في منتصفها، من تسجيل الدخول إلى الدفع",
        ],
      },
      {
        title: "الترقيات",
        items: [
          "إصدارات Flutter وDart، ومنها الترقية إلى Null Safety",
          "تحديث الحزم، أو استبدال ما توقف تطويره منها",
          "بناء يستوفي متطلبات المتاجر الحالية",
        ],
      },
      {
        title: "عمل جديد على الكود نفسه",
        items: [
          "ميزات جديدة على الخدمات الخلفية الحالية",
          "تجديد الشاشات دون إعادة كتابة التطبيق",
          "إضافة الدفع أو الإشعارات أو دعم العربية",
        ],
      },
      {
        title: "صحة الكود",
        items: ["بنية أوضح، ميزةً بعد ميزة", "اختبارات حول الأجزاء التي تتعطل باستمرار"],
      },
    ],
    deliverables: [
      "التطبيق يعمل على Android وiOS",
      "تحديث عند كل مرحلة دون أن تضطر للسؤال",
      "الكود المصدري كاملًا بين يديك",
      "نشر التحديث على المتاجر إن أردت",
    ],
    proof: [
      {
        note: "أعدت بناءه وفق حدود واضحة لكل ميزة، مع بقاء المسارات وواجهات API ومفاتيح JSON كما هي، و78 ملف اختبار خلفه.",
      },
      { note: "عقد على Upwork لتحسينات في تطبيق Lpermis." },
      {
        note: "قدت ترقية التطبيق الرئيسي للشركة إلى Null Safety، وأعدت تصميم مكونات واجهته الأساسية.",
      },
      { note: "صغّرت حجم التطبيق بنسبة 20%." },
    ],
    faq: [
      {
        q: "هل تعمل على كود كتبه مطور آخر؟",
        a: `نعم، وهذا معظم هذا العمل: ${fixReviewCount} من أصل ${reviews.length} تقييمًا على هذا الموقع كانت عن إصلاح تطبيق بدأه شخص آخر أو تعديله. أقرأ الكود أولًا، ثم أخبرك بما سأصلحه وبأي ترتيب.`,
      },
      {
        q: "ماذا لو لم يكن لدي الكود كاملًا؟",
        a: "أرسل ما لديك، وسأخبرك خلال يوم بما يمكن إصلاحه منه وما يحتاج إلى إعادة بناء.",
      },
      {
        q: "كم تكلّف الخدمة؟",
        a: "يعتمد ذلك على ما تعطّل وعلى طريقة بناء الكود، لذلك أحدد السعر بعد قراءته. أرسل المشكلة والكود، وستصلك خطة وتقدير واقعي خلال يوم.",
      },
      {
        q: "هل ستعيد كتابة تطبيقي؟",
        a: "فقط إذا كانت إعادة الكتابة أوفر لك من الإصلاح، وسأخبرك بذلك قبل البدء. في SAAD أعدت تنظيم الكود كله دون تغيير مسار API واحد.",
      },
      {
        q: "توقف تطبيقي عن البناء بعد ترقية. هل تصلح ذلك؟",
        a: "نعم. ترقيات Flutter وDart والحزم جزء من هذه الخدمة، ومنها نقل التطبيقات القديمة إلى Null Safety كما فعلت مع التطبيق الرئيسي لـBracket Media.",
      },
      {
        q: "لمن يكون الكود بعد الانتهاء؟",
        a: "لك. تحصل على الكود المصدري كاملًا بكل التعديلات.",
      },
      {
        q: "هل يمكنك الاستمرار بعد الإصلاح؟",
        a: "نعم، للإصلاحات والميزات التالية: بمراحل متفق عليها، أو بالساعة عبر Upwork أو Freelancer.",
      },
    ],
    boundaries: [
      "سعرًا قبل قراءة الكود. أي رقم قبل ذلك تخمين.",
      "إعادة كتابة لا تحتاجها. لن أقترحها إلا إذا كانت أوفر لك من إصلاح الموجود.",
    ],
    message: "مرحبًا محمد، لدي تطبيق قائم يحتاج إلى إصلاح أو تطوير.",
  },
};

export function localizeService(service: Service, locale: Locale): Service {
  if (locale === "en") return service;
  const text = ar[service.id];
  if (!text) throw new Error(`Missing Arabic service: ${service.id}`);
  if (text.faq.length !== service.faq.length || text.proof.length !== service.proof.length) {
    throw new Error(`Arabic service ${service.id} must match the English FAQ and proof one to one`);
  }
  return {
    ...service,
    ...text,
    proof: service.proof.map((p, i) => ({ ...p, ...text.proof[i], name: text.proof[i].name ?? p.name })),
    faq: service.faq.map((f, i) => ({ id: f.id, ...text.faq[i] })),
  };
}

export function getServices(locale: Locale) {
  return services.map((s) => localizeService(s, locale));
}

export function getService(slug: string, locale: Locale) {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`No service at /services/${slug}/`);
  return localizeService(service, locale);
}

/** The localized service with this id, if it has a page yet. */
export function findService(id: ServiceId, locale: Locale) {
  const service = services.find((s) => s.id === id);
  return service && localizeService(service, locale);
}
