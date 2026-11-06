import { channels, education, learningNow, navSections } from "./site";
import { experiences } from "./experience";
import { skillGroups } from "./skills";
import type { Experience } from "./types";
import type { Locale } from "./locale";

const roles: Record<
  string,
  Pick<Experience, "description" | "achievements" | "location" | "position" | "engagement">
> = {
  mismar: {
    position: "مطور Flutter",
    location: "السعودية (عن بُعد)",
    engagement: "عن بُعد، بعقد وبدوام كامل",
    description:
      "مساهم أساسي في NAAS، منصة Flutter Web للشركات التابعة لـMisMar لإدارة إصلاح الأساطيل ومطالبات تأمين السيارات، والتي تربط شركات التأمين والأساطيل والورش وموردي القطع. عملت قبل ذلك لفترة قصيرة على تطبيق السائقين للهاتف.",
    achievements: [
      "تطوير ميزات لتطبيق Flutter Web مستخدم في شركات التأمين والأساطيل والورش وموردي القطع.",
      "بناء وحدات المطالبات وعروض الأسعار والطلبات والفواتير وطلبات الحطام وفق Clean Architecture وفصل طبقات البيانات والنطاق والعرض.",
      "تنفيذ صلاحيات لأكثر من 20 دورًا، من حسابات الشركات والورش والموردين إلى المديرين ومديري الفروع والمشاهدين فقط.",
      "تقديم واجهات عربية وإنجليزية متكاملة، بما فيها اتجاه اليمين إلى اليسار.",
      "إطلاق مسارات عمل قابلة للتهيئة وإشعارات Firebase ودردشة وتذكيرات، مع اختبارات للوحدات والواجهات.",
    ],
  },
  demeter: {
    position: "مطور Flutter متوسط الخبرة",
    location: "المغرب (عن بُعد)",
    engagement: "عن بُعد، بعقد وبدوام كامل",
    description:
      "قدت تطوير Lpermis من البنية الأولى إلى الإصدار، باستخدام GetX لإدارة الحالة في منتج للاختبارات النظرية وحجز مواعيد القيادة.",
    achievements: [
      "بناء Lpermis Pro باستخدام Cubit لإدارة حجز الدروس متعدد الأدوار ومنطق العمل لمدارس القيادة.",
      "ربط واجهات خارجية للتتبع الفوري والمصادقة والمدفوعات.",
      "التعاون مع المصممين لتقديم تجربة موحدة على الهاتف والجهاز اللوحي.",
    ],
  },
  ebdda: {
    position: "مطور Flutter متوسط الخبرة",
    location: "ليبيا (عن بُعد)",
    engagement: "عن بُعد، بعقد وبدوام جزئي بالتزامن مع أعمال أخرى",
    description:
      "طورت Mutabbib باستخدام Bloc لإدارة المسارات المعقدة ومزامنة البيانات الفورية والتخزين الآمن الملائم لاحتياجات التطبيق الطبي.",
    achievements: [
      "بناء الإشعارات الفورية والجدولة للتواصل بين المرضى ومقدمي الرعاية، مع زيادة الحجوزات بنسبة 25%.",
      "التنسيق مع فريق الخدمات الخلفية لدمج الواجهات بما يلبي متطلبات الأداء والأمان.",
    ],
  },
  "arcit-ai": {
    position: "مطور Flutter متوسط الخبرة",
    location: "السعودية (عن بُعد)",
    engagement: "عن بُعد وبدوام جزئي بالتزامن مع أعمال أخرى",
    description:
      "طورت Arcit-AI باستخدام Bloc، وهي منصة تربط مقدمي خدمات العمارة وتحسين المنازل بالعملاء، مع أدوات ذكاء اصطناعي للتوفيق وأتمتة المهام.",
    achievements: [
      "التعاون مع فرق البيانات والخدمات الخلفية لدمج نماذج الذكاء الاصطناعي وتوفير البيانات الفورية.",
      "تصميم وتحسين واجهات التفاعل مع البيانات، مع تحسن الاحتفاظ بالمستخدمين والتفاعل بنسبة 15%.",
    ],
  },
  "eleven-stars": {
    position: "مطور Flutter متوسط الخبرة",
    location: "تركيا (عن بُعد)",
    engagement: "عن بُعد وبدوام جزئي بالتزامن مع أعمال أخرى",
    description:
      "بنيت Saber Yamen من الصفر باستخدام GetX، مع إدارة التنقل وتدفق البيانات عبر رحلة الشراء في سوق متعدد البائعين.",
    achievements: [
      "تطوير Dental Dinar باستخدام Cubit، بما يشمل الجدولة ومزامنة بيانات المرضى ودمج المدفوعات.",
      "تحسين إدارة الحالة لتقليل زمن تحميل البيانات بنسبة 20% لدى العملاء والمشرفين.",
    ],
  },
  "bracket-media": {
    position: "مطور Flutter مبتدئ",
    location: "المملكة المتحدة (عن بُعد)",
    engagement: "عن بُعد",
    description:
      "قدت ترقية التطبيق الرئيسي للشركة إلى Null Safety وأعدت تصميم مكونات أساسية في الواجهة، مع تحسن رضا المستخدمين وتفاعلهم بنسبة 15%.",
    achievements: [
      "تحديث الكود القديم إلى Null Safety قبل أن تتحول صيانته إلى مشكلة عاجلة.",
      "إعادة تصميم مكونات واجهة مهمة وإطلاق ميزات جديدة وإصلاح الأخطاء.",
    ],
  },
  cyparta: {
    position: "مطور Flutter مبتدئ",
    location: "مصر",
    engagement: "دوام كامل",
    description:
      "طورت تطبيقًا متعدد المنصات مع تحليلات مدمجة، مع تحسن الاحتفاظ بالمستخدمين بنسبة 12%.",
    achievements: [
      "تقليل حجم التطبيق بنسبة 20% بإزالة الحزم غير المستخدمة وتحسين الأصول.",
      "توسيع الواجهات لدعم تخطيطات الأجهزة اللوحية بملء الشاشة والتوافق مع iPad.",
    ],
  },
};
export function getExperiences(locale: Locale) {
  return experiences.map((role) =>
    locale === "en"
      ? role
      : {
          ...role,
          ...roles[role.slug],
          startDate: month(role.start),
          endDate: role.end ? month(role.end) : "حتى الآن",
        },
  );
}
const arabicMonths = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];
// Fixed labels avoid Node/Chrome ICU differences during hydration.
function month(value: string) {
  const [year, number] = value.split("-");
  return `${arabicMonths[Number(number) - 1]} ${year}`;
}

const skillNames: Record<string, string> = {
  "Languages & frameworks": "اللغات وأطر العمل",
  "State management": "إدارة الحالة",
  "Mobile & integrations": "الهاتف والتكاملات",
  "Back end & cloud": "الخدمات الخلفية والسحابة",
  Payments: "المدفوعات",
  "Architecture, process & testing": "البنية وأساليب العمل والاختبارات",
  "Android + iOS cross-platform": "تطبيقات متعددة المنصات لـAndroid وiOS",
  "Offline-first synchronisation": "مزامنة تدعم العمل دون اتصال",
  "On-device PDF generation": "توليد PDF على الجهاز",
  "Barcode & QR scanning": "مسح الباركود ورموز QR",
  "Localisation & RTL (Arabic)": "التعريب ودعم اتجاه RTL",
  "Responsive design": "تصميم متجاوب",
  "Unit testing": "اختبارات الوحدات",
  "Widget testing": "اختبارات الواجهات",
  "Feature-first architecture": "بنية قائمة على الميزات",
};
export function getSkills(locale: Locale) {
  return skillGroups.map((group) =>
    locale === "en"
      ? group
      : {
          ...group,
          label: skillNames[group.label],
          items: group.items.map((item) => skillNames[item] ?? item),
        },
  );
}

export function getProfile(locale: Locale) {
  if (locale === "en") return { channels, education, learningNow, navSections };
  const labels = ["نبذة عني", "الخبرة", "المشاريع", "المهارات", "التقييمات", "التواصل"];
  const notes = [
    "أسرع وسيلة للرد",
    "عمل بعقد وضمان الدفع",
    "للعمل بدوام كامل والتفاصيل المطولة",
    "عروض المشاريع",
    "خدمات محددة النطاق",
    "للعملاء الناطقين بالعربية",
  ];
  return {
    navSections: navSections.map((item, i) => ({ ...item, label: labels[i] })),
    channels: channels.map((item, i) => ({
      ...item,
      label: item.id === "email" ? "البريد الإلكتروني" : item.label,
      note: notes[i],
    })),
    education: [
      "بكالوريوس المعلوماتية الحيوية — جامعة المنصورة، 2021 (مشروع التخرج بتقدير A+)",
      "Learn JavaScript · Learn React — Scrimba، 2026",
      "Android Basics Nanodegree — Udacity، 2020",
      "العربية (اللغة الأم) · الإنجليزية (كفاءة مهنية)",
    ],
    learningNow: {
      ...learningNow,
      period: "سبتمبر 2026",
      inProgress: [{ title: "أساسيات Next.js", provider: "قيد التعلم" }],
      built: { ...learningNow.built, note: "مسار JavaScript من 100 سؤال، متاح على الويب" },
    },
  };
}
