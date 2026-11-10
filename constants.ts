export const ADMIN_CREDENTIALS = {
  username: "123",
  password: "123"
};

export const UI_STRINGS = {
  appName: "انجمن علمی علوم کامپیوتر",
  home: "خانه",
  about: "درباره ما",
  activists: "فعالین",
  education: "آموزش",
  events: "رویدادها",
  documents: "مستندات",
  login: "ورود",
  register: "ثبت‌نام",
  adminPanel: "پنل مدیریت",
  logout: "خروج",
  studentId: "شماره دانشجویی",
  nationalId: "کد ملی",
  name: "نام و نام خانوادگی",
  email: "ایمیل",
  password: "رمز عبور",
  submit: "ارسال",
  cancel: "لغو",
  foundingMembers: "اعضای موسس",
  secretary: "دبیر انجمن",
  academicRank: "مرتبه علمی",
  course: "درس",
  notes: "جزوات",
  videos: "ویدیوها",
  pastEvents: "رویدادهای گذشته",
  ongoingEvents: "رویدادهای در حال برگزاری",
  upcomingEvents: "رویدادهای آینده",
  approve: "تایید",
  reject: "رد",
  pendingApproval: "در انتظار تایید",
  approved: "تایید شده",
  rejected: "رد شده",
};

import { EventCategory, CSField } from './types';

export const MOCK_DATA = {
  foundingMembers: [
    {
      id: "1",
      name: "دکتر مریم سعیدی",
      role: "دبیر کل",
      description: "متخصص هوش مصنوعی و داده‌کاوی",
      image: "https://picsum.photos/200/200?random=1",
      term: "۱۴۰۲-۱۴۰۳",
      field: "هوش مصنوعی"
    },
    {
      id: "2",
      name: "مهندس علی حسینی",
      role: "نایب دبیر",
      description: "برنامه‌نویس ارشد و پژوهشگر بلاک‌چین",
      image: "https://picsum.photos/200/200?random=2",
      term: "۱۴۰۲-۱۴۰۳",
      field: "امنیت شبکه"
    }
  ],
  professors: [
    {
      id: "p1",
      name: "دکتر رضایی",
      academicRank: "دانشیار",
      field: "نظریه محاسبات",
      bio: "بیش از ۲۰ سال سابقه تدریس در حوزه ساختمان‌های گسسته و نظریه زبان‌ها.",
      image: "https://picsum.photos/200/200?random=3"
    }
  ],
  events: [
    {
      id: "e1",
      title: "کارگاه پایتون مقدماتی",
      description: "آموزش گام به گام زبان برنامه‌نویسی پایتون برای دانشجویان ورودی جدید.",
      category: EventCategory.PAST,
      date: "۱۴۰۲/۰۷/۱۵",
      image: "https://picsum.photos/600/400?random=4"
    },
    {
      id: "e2",
      title: "مسابقه الگوریتمی خوارزمی",
      description: "بزرگترین مسابقه برنامه‌نویسی دانشگاه با جوایز ارزنده.",
      category: EventCategory.UPCOMING,
      date: "۱۴۰۴/۰۲/۲۰",
      image: "https://picsum.photos/600/400?random=5"
    }
  ]
};

export const CS_FIELDS: CSField[] = [
  {
    id: 'web',
    label: '۱. طراحی و توسعه وب',
    subfields: [
      { id: 'web-basics', label: 'مبانی وب (HTML, CSS, JavaScript)' },
      { id: 'web-front', label: 'فرانت‌اند (React, Vue, Angular, Svelte, Next.js)' },
      { id: 'web-ui', label: 'رابط کاربری و استایل (Tailwind, Bootstrap, MUI)' },
      { id: 'web-back', label: 'بک‌اند (Node.js, Django, FastAPI, Laravel, .NET)' },
      { id: 'web-api', label: 'ارتباطات و API (REST, GraphQL, WebSocket)' },
      { id: 'web-full', label: 'فول‌استک (فرانت‌اند + بک‌اند)' },
      { id: 'web-arch', label: 'معماری وب (MVC, Microservices)' },
      { id: 'web-auth', label: 'احراز هویت (OAuth, JWT)' },
      { id: 'web-db', label: 'پایگاه‌داده وب (SQL, NoSQL, MongoDB)' },
      { id: 'web-opt', label: 'بهینه‌سازی کارایی و کش' },
      { id: 'web-seo', label: 'سئو فنی (Technical SEO)' },
      { id: 'web-a11y', label: 'دسترس‌پذیری (WCAG)' },
      { id: 'web-devops', label: 'دواپس وب (Docker, CI/CD)' },
      { id: 'web-pwa', label: 'وب‌اپلیکیشن پیش‌رونده (PWA)' },
      { id: 'web-cms', label: 'مدیریت محتوا (WordPress, Strapi)' },
      { id: 'web-mon', label: 'مانیتورینگ و لاگینگ وب' },
      { id: 'web-scale', label: 'مقیاس‌پذیری و توازن بار' },
      { id: 'web-wasm', label: 'وب‌اسمبلی (WASM)' }
    ]
  },
  {
    id: 'mobile',
    label: '۲. توسعه اپلیکیشن موبایل',
    subfields: [
      { id: 'mob-basics', label: 'مبانی موبایل و چرخه حیات اپلیکیشن' },
      { id: 'mob-android', label: 'اندروید نیتیو (Java, Kotlin)' },
      { id: 'mob-ios', label: 'آی‌اواس نیتیو (Swift)' },
      { id: 'mob-cross', label: 'چندپلتفرمی (Flutter, React Native)' },
      { id: 'mob-ui', label: 'طراحی رابط کاربری موبایل' },
      { id: 'mob-arch', label: 'معماری موبایل (MVVM, Clean Arch)' },
      { id: 'mob-state', label: 'مدیریت وضعیت در موبایل' },
      { id: 'mob-server', label: 'ارتباط با سرور (REST, GraphQL)' },
      { id: 'mob-db', label: 'پایگاه‌داده داخلی (SQLite, Realm)' },
      { id: 'mob-auth', label: 'احراز هویت و امنیت بایومتریک' },
      { id: 'mob-sec', label: 'امنیت اپلیکیشن و ذخیره‌سازی امن' },
      { id: 'mob-test', label: 'تست موبایل (Unit, UI Test)' },
      { id: 'mob-pub', label: 'انتشار در گوگل‌پلی و اپ‌استور' },
      { id: 'mob-opt', label: 'بهینه‌سازی باتری و عملکرد' },
      { id: 'mob-push', label: 'اعلان‌های آنی (Push Notifications)' },
      { id: 'mob-offline', label: 'عملکرد آفلاین و همگام‌سازی' },
      { id: 'mob-mon', label: 'مانیتورینگ و تحلیل خطاها' },
      { id: 'mob-iap', label: 'پرداخت درون‌برنامه‌ای' }
    ]
  },
  {
    id: 'ai',
    label: '۳. هوش مصنوعی و داده',
    subfields: [
      { id: 'ai-concepts', label: 'مفاهیم پایه هوش مصنوعی' },
      { id: 'ai-ml', label: 'یادگیری ماشین (کلاسیک)' },
      { id: 'ai-dl', label: 'یادگیری عمیق و شبکه‌های عصبی' },
      { id: 'ai-stats', label: 'تحلیل داده، آمار و تجسم‌سازی' },
      { id: 'ai-mining', label: 'داده‌کاوی و کشف الگو' },
      { id: 'ai-nlp', label: 'پردازش زبان طبیعی (NLP)' },
      { id: 'ai-cv', label: 'بینایی ماشین (Computer Vision)' },
      { id: 'ai-speech', label: 'پردازش صوت و گفتار' },
      { id: 'ai-recommender', label: 'سیستم‌های توصیه‌گر' },
      { id: 'ai-llm', label: 'مدل‌های زبانی بزرگ (LLM)' },
      { id: 'ai-reinforcement', label: 'یادگیری تقویتی و عامل‌ها' },
      { id: 'ai-fe', label: 'مهندسی ویژگی (Feature Engineering)' },
      { id: 'ai-etl', label: 'پاکسازی داده و فرآیندهای ETL' },
      { id: 'ai-mlops', label: 'عملیات هوش مصنوعی (MLOps)' },
      { id: 'ai-ethics', label: 'اخلاق و سوگیری در هوش مصنوعی' },
      { id: 'ai-xai', label: 'هوش مصنوعی قابل توضیح (XAI)' },
      { id: 'ai-industry', label: 'هوش مصنوعی در صنعت و رباتیک' }
    ]
  },
  {
    id: 'bigdata',
    label: '۴. پایگاه‌داده و کلان‌داده',
    subfields: [
      { id: 'db-basics', label: 'مبانی پایگاه‌داده (SQL & NoSQL)' },
      { id: 'db-common', label: 'کار با PostgreSQL, MySQL, MongoDB' },
      { id: 'db-big', label: 'کلان‌داده (Spark, Hadoop)' },
      { id: 'db-analysis', label: 'تحلیل داده‌های انبوه' }
    ]
  },
  {
    id: 'networking',
    label: '۵. شبکه و زیرساخت',
    subfields: [
      { id: 'net-basics', label: 'مبانی شبکه (OSI, TCP/IP)' },
      { id: 'net-server', label: 'مدیریت و پیکربندی سرور' },
      { id: 'net-os', label: 'سیستم‌عامل سرور (Linux, Windows)' },
      { id: 'net-virt', label: 'مجازی‌سازی و کانتینر (Docker, K8s)' },
      { id: 'net-adv', label: 'شبکه‌های پیشرفته (VLAN, Routing)' },
      { id: 'net-prot', label: 'پروتکل‌های سرویس (DNS, DHCP, SSH)' },
      { id: 'net-mon', label: 'مانیتورینگ (Zabbix, Prometheus)' },
      { id: 'net-sec', label: 'امنیت شبکه (VPN, Firewall, IDS)' },
      { id: 'net-storage', label: 'ذخیره‌سازی تحت شبکه (NAS, SAN)' },
      { id: 'net-cloud', label: 'سرویس‌های ابری (AWS, Azure, GCP)' },
      { id: 'net-scaling', label: 'توازن بار و مقیاس‌پذیری' },
      { id: 'net-access', label: 'مدیریت دسترسی (AD, LDAP, SSO)' },
      { id: 'net-backup', label: 'پشتیبان‌گیری و بازیابی فاجعه' },
      { id: 'net-trouble', label: 'عیب‌یابی و تحلیل ترافیک (Wireshark)' },
      { id: 'net-infra-sec', label: 'امنیت زیرساخت و تست نفوذ' },
      { id: 'net-devops', label: 'دواپس و اتوماسیون زیرساخت' },
      { id: 'net-perf', label: 'بهینه‌سازی عملکرد سرور' },
      { id: 'net-service-mon', label: 'مانیتورینگ سرویس‌ها و هشدارها' },
      { id: 'net-messaging', label: 'پروتکل‌های پیام‌رسانی (Kafka, MQTT)' },
      { id: 'net-orchestration', label: 'مدیریت و ارکستراسیون کانتینر' }
    ]
  },
  {
    id: 'cybersecurity',
    label: '۶. امنیت سایبری',
    subfields: [
      { id: 'sec-info', label: 'امنیت اطلاعات و مثلث CIA' },
      { id: 'sec-net', label: 'امنیت شبکه و دیواره آتش' },
      { id: 'sec-web', label: 'امنیت وب و استانداردهای OWASP' },
      { id: 'sec-os', label: 'امنیت سیستم‌عامل' },
      { id: 'sec-coding', label: 'کدنویسی امن و امنیت اپلیکیشن' },
      { id: 'sec-pen', label: 'تست نفوذ (Penetration Testing)' },
      { id: 'sec-eth', label: 'هک اخلاقی (Ethical Hacking)' },
      { id: 'sec-vuln', label: 'ارزیابی آسیب‌پذیری' },
      { id: 'sec-crypto', label: 'رمزنگاری و زیرساخت کلید عمومی' },
      { id: 'sec-iam', label: 'مدیریت هویت و دسترسی' },
      { id: 'sec-cloud', label: 'امنیت در محیط‌های ابری' },
      { id: 'sec-kube', label: 'امنیت کانتینر و کوبرنتیز' },
      { id: 'sec-devsecops', label: 'عملیات توسعه امن (DevSecOps)' },
      { id: 'sec-mob', label: 'امنیت دستگاه‌های موبایل' },
      { id: 'sec-iot', label: 'امنیت اینترنت اشیا (IoT)' },
      { id: 'sec-db', label: 'امنیت پایگاه‌داده' },
      { id: 'sec-malware', label: 'تحلیل بدافزار' },
      { id: 'sec-rev', label: 'مهندسی معکوس (Reverse Engineering)' },
      { id: 'sec-forensics', label: 'جرم‌شناسی دیجیتال' },
      { id: 'sec-soc', label: 'مرکز عملیات امنیت (SOC)' },
      { id: 'sec-ir', label: 'پاسخ به حوادث امنیتی' },
      { id: 'sec-phi', label: 'امنیت ایمیل و فیشینگ' },
      { id: 'sec-bc', label: 'امنیت بلاک‌چین و وب ۳' },
      { id: 'sec-industrial', label: 'امنیت سیستم‌های صنعتی' },
      { id: 'sec-phys', label: 'امنیت فیزیکی زیرساخت فاوا' },
      { id: 'sec-standards', label: 'استانداردها (ISO 27001, NIST)' },
      { id: 'sec-priv', label: 'حریم خصوصی و حفاظت از داده' }
    ]
  },
  {
    id: 'cloud-devops',
    label: '۷. رایانش ابری و دواپس',
    subfields: [
      { id: 'c-concepts', label: 'مفاهیم ابری (IaaS, PaaS, SaaS)' },
      { id: 'c-providers', label: 'ارائه‌دهندگان ابری برتر' },
      { id: 'c-compute', label: 'رایانش سرورلس و کانتینری' },
      { id: 'c-storage', label: 'ذخیره‌سازی ابری و بازیابی' },
      { id: 'c-net', label: 'شبکه‌سازی ابری و CDN' },
      { id: 'c-acc', label: 'امنیت و مدیریت دسترسی ابری' },
      { id: 'c-db', label: 'پایگاه‌داده‌های ابری' },
      { id: 'c-mon', label: 'مانیتورینگ و پایش ابری' },
      { id: 'd-concepts', label: 'مفاهیم دواپس و تحویل مستمر' },
      { id: 'd-iac', label: 'زیرساخت به عنوان کد (Terraform, Ansible)' },
      { id: 'd-pipeline', label: 'خط لوله استقرار (GitHub Actions, Jenkins)' },
      { id: 'd-orchestration', label: 'ارکستراسیون (Docker, K8s, Helm)' },
      { id: 'd-config', label: 'مدیریت پیکربندی' },
      { id: 'd-qa', label: 'تست‌های خودکار و تضمین کیفیت' },
      { id: 'd-perf', label: 'تنظیم عملکرد و مقیاس‌پذیری' },
      { id: 'd-dr', label: 'پشتیبان‌گیری و بازیابی فاجعه' },
      { id: 'd-sec', label: 'امنیت در دواپس (DevSecOps)' },
      { id: 'd-elk', label: 'لاگینگ و پایش (ELK, Grafana)' },
      { id: 'd-sla', label: 'مانیتورینگ سطح سرویس (SLA)' },
      { id: 'd-auto', label: 'اتوماسیون گردش کار و اسکریپت‌نویسی' }
    ]
  },
  {
    id: 'hardware',
    label: '۸. سیستم‌ها و سخت‌افزار',
    subfields: [
      { id: 'h-arch', label: 'معماری کامپیوتر و مفاهیم سیستم‌عامل' },
      { id: 'h-cpu', label: 'پردازنده، GPU و اجزای داخلی' },
      { id: 'h-os', label: 'کار با لینوکس، ویندوز و مک' },
      { id: 'h-mem', label: 'مدیریت حافظه و حافظه مجازی' },
      { id: 'h-file', label: 'سیستم‌های فایل و ذخیره‌سازی' },
      { id: 'h-net', label: 'سخت‌افزارهای شبکه (Router, Switch)' },
      { id: 'h-device', label: 'مدیریت درایورها و وقفه‌ها' },
      { id: 'h-parallel', label: 'معماری‌های موازی و توزیع‌شده' },
      { id: 'h-io', label: 'دستگاه‌های ورودی و خروجی' },
      { id: 'h-perf', label: 'بنچمارک و سنجش عملکرد' },
      { id: 'h-sec', label: 'امنیت سخت‌افزار (TPM, Secure Boot)' },
      { id: 'h-virt', label: 'مجازی‌سازی و شبیه‌سازی' },
      { id: 'h-mon', label: 'پایش سخت‌افزار و سنسورها' },
      { id: 'h-cache', label: 'سلسله مراتب حافظه و کش' },
      { id: 'h-electronics', label: 'مبانی الکترونیک دیجیتال' },
      { id: 'h-power', label: 'مدیریت توان و حرارت' },
      { id: 'h-soc', label: 'ارتباطات روی تراشه (SoC)' },
      { id: 'h-embedded', label: 'سیستم‌های نهفته و میکروکنترلرها' },
      { id: 'h-repair', label: 'عیب‌یابی و تعمیرات سخت‌افزاری' },
      { id: 'h-lifecycle', label: 'ارتقا و چرخه عمر قطعات' }
    ]
  },
  {
    id: 'graphics',
    label: '۹. گرافیک، بازی و واقعیت گسترده',
    subfields: [
      { id: 'g-basics', label: 'مبانی گرافیک کامپیوتری' },
      { id: 'g-3d', label: 'مدل‌سازی سه‌بعدی و بافت‌دهی' },
      { id: 'g-anim', label: 'انیمیشن و حرکت' },
      { id: 'g-engines', label: 'موتورهای بازی (Unity, Unreal)' },
      { id: 'g-prog', label: 'برنامه‌نویسی بازی (C#, C++)' },
      { id: 'g-rendering', label: 'رندرینگ آنی و شیدرها' },
      { id: 'g-phys', label: 'فیزیک در محیط‌های مجازی' },
      { id: 'g-audio', label: 'طراحی صدا و موسیقی بازی' },
      { id: 'g-ai', label: 'هوش مصنوعی در بازی' },
      { id: 'g-xr', label: 'فناوری‌های AR/VR و واقعیت گسترده' },
      { id: 'g-ux', label: 'تجربه کاربری در بازی و XR' },
      { id: 'g-net', label: 'شبکه‌سازی و بازی‌های چندنفره' },
      { id: 'g-tools', label: 'ابزارهای گرافیکی (Photoshop, Blender)' },
      { id: 'g-opt', label: 'بهینه‌سازی گرافیک و بازی' },
      { id: 'g-vr-phys', label: 'تعاملات فیزیکی در واقعیت مجازی' },
      { id: 'g-pub', label: 'پلتفرم‌های انتشار (کنسول، موبایل)' },
      { id: 'g-test', label: 'تست و عیب‌یابی گرافیکی' },
      { id: 'g-gpu', label: 'برنامه‌نویسی پیشرفته GPU' }
    ]
  },
  {
    id: 'blockchain-web3',
    label: '۱۰. بلاک‌چین و وب ۳',
    subfields: [
      { id: 'b-basics', label: 'مبانی بلاک‌چین و مکانیزم اجماع' },
      { id: 'b-crypto', label: 'ارزهای دیجیتال و توکن‌ها' },
      { id: 'b-smart', label: 'قراردادهای هوشمند (Solidity)' },
      { id: 'b-plat', label: 'پلتفرم‌ها (Ethereum, Solana)' },
      { id: 'b-prot', label: 'پروتکل‌های اجماع (PoW, PoS)' },
      { id: 'b-wallet', label: 'امنیت کیف‌پول و کلیدها' },
      { id: 'b-nft', label: 'دارایی‌های دیجیتال و NFT' },
      { id: 'b-dapps', label: 'توسعه اپلیکیشن‌های غیرمتمرکز' },
      { id: 'b-l2', label: 'راهکارهای لایه ۲ و شاردینگ' },
      { id: 'b-tok', label: 'اقتصاد توکنی (Tokenomics)' },
      { id: 'b-anal', label: 'تحلیل داده‌های بلاک‌چین' },
      { id: 'b-sec', label: 'امنیت در دنیای بلاک‌چین' },
      { id: 'b-ex', label: 'صرافی‌های غیرمتمرکز (DEX)' },
      { id: 'b-storage', label: 'ذخیره‌سازی غیرمتمرکز (IPFS)' },
      { id: 'b-ora', label: 'اوراکل‌ها و داده‌های خارجی' },
      { id: 'b-dev', label: 'توسعه وب ۳ و اتصال کیف‌پول' },
      { id: 'b-dao', label: 'حاکمیت غیرمتمرکز (DAO)' },
      { id: 'b-perf', label: 'موازی‌سازی و کارایی بلاک‌چین' },
      { id: 'b-mon', label: 'مانیتورینگ تراکنش‌ها' },
      { id: 'b-future', label: 'آینده وب ۳ و تعامل‌پذیری' }
    ]
  },
  {
    id: 'theoretical',
    label: '۱۱. علوم کامپیوتر نظری',
    subfields: [
      { id: 't-computation', label: 'نظریه محاسبات و خودکارها' },
      { id: 't-fsm', label: 'ماشین‌های حالت محدود و تورینگ' },
      { id: 't-computability', label: 'محاسبه‌پذیری و تصمیم‌ناپذیری' },
      { id: 't-complexity', label: 'پیچیدگی زمان و فضا' },
      { id: 't-classes', label: 'کلاس‌های پیچیدگی (P, NP)' },
      { id: 't-algo', label: 'طراحی الگوریتم و بهینه‌سازی' },
      { id: 't-graph', label: 'نظریه گراف و شبکه‌ها' },
      { id: 't-formal', label: 'زبان‌های صوری و گرامرها' },
      { id: 't-logic', label: 'منطق ریاضی و روش‌های اثبات' }
    ]
  }
];

// Localized Numbers
export const toPersianDigits = (str: string | number) => {
  return str.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

export const toEnglishDigits = (str: string) => {
  if (!str) return "";
  return str.toString().replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
};

export const getCurrentShamsiDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const parts = new Intl.DateTimeFormat('fa-IR', options).formatToParts(date);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  
  return toEnglishDigits(`${year}/${month}/${day}`);
};

export function jalaliToGregorian(jy: number, jm: number, jd: number) {
  let g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  let jy_f = jy - 979;
  let jm_f = jm - 1;
  let jd_f = jd - 1;
  let j_day_no = 365 * jy_f + Math.floor(jy_f / 33) * 8 + Math.floor((jy_f % 33 + 3) / 4);
  for (let i = 0; i < jm_f; ++i) j_day_no += j_days_in_month[i];
  j_day_no += jd_f;
  let g_day_no = j_day_no + 79;
  let gy = 1600 + 400 * Math.floor(g_day_no / 146097);
  g_day_no = g_day_no % 146097;
  let leap = true;
  if (g_day_no >= 36525) {
    g_day_no--;
    gy += 100 * Math.floor(g_day_no / 36524);
    g_day_no = g_day_no % 36524;
    if (g_day_no >= 365) g_day_no++;
    else leap = false;
  }
  gy += 4 * Math.floor(g_day_no / 1461);
  g_day_no %= 1461;
  if (g_day_no >= 366) {
    leap = false;
    g_day_no--;
    gy += Math.floor(g_day_no / 365);
    g_day_no = g_day_no % 365;
  }
  let i = 0;
  for (i = 0; g_day_no >= g_days_in_month[i] + (i === 1 && leap ? 1 : 0); i++)
    g_day_no -= g_days_in_month[i] + (i === 1 && leap ? 1 : 0);
  const result = new Date(gy, i, g_day_no + 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

export const getShamsiEventTimestamp = (dateStr: string) => {
  const normalized = toEnglishDigits(dateStr).replace(/-/g, '/');
  const parts = normalized.split('/').map(Number);
  if (parts.length !== 3) return null;
  return jalaliToGregorian(parts[0], parts[1], parts[2]).getTime();
};