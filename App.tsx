
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Globe, Send, Stethoscope, BookOpen, Award, Zap, 
  ShieldCheck, X, FileText, ChevronLeft, ArrowLeft, 
  Trash2, BarChart3, Languages, PenTool, Library, MessageSquare, 
  CreditCard, Presentation, Search, CheckCircle, Target, 
  Eye, UserCheck, TrendingUp, FileSearch, School, LayoutDashboard, 
  LogIn, UserPlus, LogOut, Upload, Clock, 
  CheckCircle as CheckIcon, AlertCircle, FileSignature, Sparkles, 
  Building2, Hash, User, Mail, MapPin, ExternalLink, Plus,
  FileCode, ListChecks, PieChart, Info, Microscope, Dna, Activity,
  ClipboardList, CheckCircle2, Star, Sparkle, Heart, Stethoscope as StethIcon,
  ShoppingCart, Settings, ListCheck, BookCheck, Share2, ClipboardCheck,
  Newspaper, Users, Trophy
} from 'lucide-react';

// --- Types & Interfaces ---
type Page = 'home' | 'bachelor' | 'graduate' | 'medical' | 'login' | 'dashboard' | 'admin';
type MedicalSubPage = 'medical-home' | 'medical-shop' | 'medical-about' | 'medical-store-policy' | 'medical-policy';
type OrderStatus = 'pending' | 'awaiting_receipt' | 'paid' | 'in_progress' | 'completed';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface MedicalSpecialty {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  outcomes: string[];
  icon: any;
  difficulty: 'High' | 'Medium' | 'Competitive';
}

interface MedicalCartItem {
  id: string;
  specialty: string;
  role: 'First Author' | 'Co-Author';
  price: number;
}

interface Service {
  id: string;
  name: string;
  price: number | string;
  description: string;
  category: 'bachelor' | 'graduate' | 'medical' | 'general';
  icon: any;
  unit?: string;
  benefits?: string[];
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  serviceId: string;
  serviceName: string;
  status: OrderStatus;
  createdAt: string;
  amount: number | string;
  receiptUrl?: string;
  formData: any;
}

// --- Constants ---
const ADMIN_CREDENTIALS = {
  email: "SciCoordX@gmail.com",
  password: "0541175648"
};

const MEDICAL_SPECIALTIES: MedicalSpecialty[] = [
  { 
    id: "GS", 
    name: "General Surgery", 
    description: "أبحاث Systematic Review متقدمة تغطي أحدث تقنيات الجراحة العامة والمناظير، مع التركيز على نتائج العمليات الجراحية والابتكارات الحديثة مثل الجراحة الروبوتية.", 
    benefits: ["نشر في PubMed (Q1)", "دعم ملف البورد السعودي", "توثيق 5 نقاط كاملة"], 
    outcomes: ["إدراج اسمك في قاعدة بيانات PubMed", "تحسين فرص القبول في برامج الإقامة"],
    icon: StethIcon,
    difficulty: 'Competitive'
  },
  { 
    id: "ENT", 
    name: "ENT (Otolaryngology)", 
    description: "دراسات بحثية متخصصة في أمراض وجراحة الأذن والأنف والحنجرة، تستهدف المجلات العالمية المصنفة لدعم المتقدمين لهذا التخصص التنافسي.", 
    benefits: ["دقة في التحليل الإحصائي", "متابعة مع محكمي المجلة", "قيمة بحثية مضافة"], 
    outcomes: ["شهادة مشاركة بحثية معتمدة", "فرصة الحصول على خطاب توصية"],
    icon: Microscope,
    difficulty: 'High'
  },
  { 
    id: "ICU", 
    name: "Critical Care (ICU)", 
    description: "أبحاث مكثفة في طب العناية المركزة، تتناول بروتوكولات العلاج الحديثة وحالات الرعاية الحرجة لتعزيز الـ CV الخاص بك.", 
    benefits: ["منهجية Meta-Analysis", "بيانات سريرية رصينة", "سرعة في القبول النهائي"], 
    outcomes: ["نشر مضمون في مجلات Scopus", "تعزيز المعرفة السريرية بالبروتوكولات"],
    icon: Activity,
    difficulty: 'Medium'
  },
  { 
    id: "Dentist", 
    name: "Dentistry", 
    description: "فرص بحثية شاملة في تخصصات طب الأسنان المختلفة (جراحة الوجه والفكين، التقويم، والتركيبات) مصممة للنشر في أرقى المجلات.", 
    benefits: ["تغطية شاملة للمراجع", "تنسيق أكاديمي فائق", "نشر في مجلات Scopus"], 
    outcomes: ["بناء سمعة أكاديمية في تخصصك", "الوفاء بمتطلبات التخرج"],
    icon: Sparkle,
    difficulty: 'Medium'
  },
  { 
    id: "Pediatric", 
    name: "Pediatrics", 
    description: "بحوث متميزة في طب الأطفال وحديثي الولادة، تركز على القضايا الصحية المعاصرة والوقاية، مما يضمن لك مكاناً متميزاً في المنافسة.", 
    benefits: ["إشراف استشاريين أطفال", "محتوى علمي حصري", "ضمان القبول العلمي"], 
    outcomes: ["توثيق الخبرة في أبحاث الطفولة", "التميز في المقابلات الشخصية"],
    icon: Heart,
    difficulty: 'High'
  },
  { 
    id: "Internal Medicine", 
    name: "Internal Medicine", 
    description: "أبحاث عميقة في الطب الباطني وفروعه، تعتمد على قواعد بيانات ضخمة وتغطية واسعة للأدبيات الطبية الحديثة لعام 2026.", 
    benefits: ["قوة في الطرح العلمي", "إضافة نوعية للملف البحثي", "نشر في Clarivate (Q2)"], 
    outcomes: ["رابط مباشر للبحث فور النشر", "قوة تحليلية نقدية في الـ CV"],
    icon: ClipboardList,
    difficulty: 'Medium'
  },
  { 
    id: "Radiology", 
    name: "Radiology", 
    description: "دراسات في التصوير الطبي والأشعة التداخلية، تستكشف أحدث تطبيقات الذكاء الاصطناعي والتقنيات التشخيصية الحديثة.", 
    benefits: ["ابتكار في مواضيع البحث", "صور توضيحية احترافية", "دعم تقني مستمر"], 
    outcomes: ["توثيق مهارات التفسير الإشعاعي", "نشر في مجلات الأشعة المتخصصة"],
    icon: FileSearch,
    difficulty: 'Competitive'
  },
  { 
    id: "Family Medicine", 
    name: "Family Medicine", 
    description: "بحوث في طب الأسرة والمجتمع، تركز على الرعاية الأولية والوقاية صحية بما يخدم توجهات رؤية المملكة 2030.", 
    benefits: ["مواكبة لرؤية 2030", "تأثير مجتمعي عالٍ", "سهولة في النشر المعتمد"], 
    outcomes: ["شهادة حضور ومشاركة بحثية", "تعزيز فرص القبول في الرعاية الأولية"],
    icon: Globe,
    difficulty: 'Medium'
  }
];

const INITIAL_SERVICES: Service[] = [
  // --- Bachelor Services (Full List) ---
  { 
    id: 'b1', 
    name: "حل الواجبات والتكاليف", 
    price: 75, 
    description: "حل احترافي لكافة الواجبات الجامعية بدقة عالية مع شرح مفصل للخطوات لضمان فهمك العميق للمادة.", 
    category: 'bachelor', 
    icon: FileSignature,
    benefits: ["حلول نموذجية خالية من الأخطاء", "شرح توضيحي للخطوات", "التزام تام بموعد التسليم"]
  },
  { 
    id: 'b2', 
    name: "إعداد الأبحاث الجامعية", 
    price: 150, 
    description: "كتابة أبحاث أكاديمية رصينة لطلاب البكالوريوس تعتمد على مصادر موثوقة ومنهجية علمية واضحة.", 
    category: 'bachelor', 
    icon: Search,
    benefits: ["مراجع موثوقة وحديثة", "تنسيق أكاديمي (APA/MLA)", "نسبة اقتباس منخفضة"]
  },
  { 
    id: 'b3', 
    name: "تحليل إحصائي (SPSS)", 
    price: 300, 
    description: "تحليل البيانات لطلاب البكالوريوس باستخدام برنامج SPSS مع شرح النتائج والرسوم البيانية.", 
    category: 'bachelor', 
    icon: BarChart3,
    benefits: ["دقة متناهية في التحليل", "شرح وتفسير الجداول", "سرعة في الإنجاز"]
  },
  { 
    id: 'b4', 
    name: "تصميم عروض التقديم (PPT)", 
    price: 100, 
    description: "تصميم عروض تقديمية احترافية وجذابة لمشاريع التخرج والواجبات تبرز مهاراتك العلمية.", 
    category: 'bachelor', 
    icon: Presentation,
    benefits: ["تصاميم عصرية وجذابة", "ترتيب منطقي للمحتوى", "توافق مع الهوية الجامعية"]
  },
  { 
    id: 'b5', 
    name: "مشروع تخرج متكامل", 
    price: 950, 
    description: "دعم شامل لمشروع التخرج من الفكرة واختيار العنوان حتى إتمام كافة الفصول وضمان الجودة النهائية.", 
    category: 'bachelor', 
    icon: School,
    benefits: ["إشراف متخصص", "توفير الأدوات اللازمة", "دعم حتى يوم المناقشة"]
  },
  { 
    id: 'b6', 
    name: "تلخيص الكتب والمواد", 
    price: 50, 
    description: "تلخيص دقيق للمواد الدراسية والكتب العلمية بأسلوب يسهل الحفظ والمراجعة قبل الاختبارات.", 
    category: 'bachelor', 
    icon: BookOpen,
    benefits: ["تغطية شاملة للنقاط الهامة", "تبسيط المفاهيم المعقدة", "توفير وقت المراجعة"]
  },

  // --- Graduate Services (Full List) ---
  { 
    id: 'g1', 
    name: "كتابة رسائل ماجستير ودكتوراه", 
    price: 2500, 
    unit: "تبدأ من", 
    description: "خدمة رائدة بإشراف نخبة من الأكاديميين لصياغة أطروحتك العلمية بأسلوب رصين ومنهجية بحثية متطورة.", 
    category: 'graduate', 
    icon: GraduationCap,
    benefits: ["إشراف أكاديمي متخصص", "منهجية بحثية رصينة", "توفير مراجع أصلية"]
  },
  { 
    id: 'g2', 
    name: "إعداد المقترح البحثي (Proposal)", 
    price: 600, 
    description: "كتابة مقترح بحثي قوي ومقنع للجامعة يبرز أهمية دراستك ومنهجيتك المقترحة.", 
    category: 'graduate', 
    icon: Target,
    benefits: ["خطة بحثية محكمة", "مراجعة نقدية للأدبيات", "فرص قبول عالية للموضوع"]
  },
  { 
    id: 'g3', 
    name: "تحليل إحصائي متقدم", 
    price: 800, 
    description: "تحليل إحصائي معقد لرسائل الدراسات العليا باستخدام AMOS, SmartPLS, SPSS مع التعليق الأكاديمي.", 
    category: 'graduate', 
    icon: PieChart,
    benefits: ["استخدام أحدث البرمجيات", "اختبارات الفرضيات المتقدمة", "تفسير أكاديمي عميق"]
  },
  { 
    id: 'g4', 
    name: "مراجعة الدراسات السابقة", 
    price: 400, 
    description: "إعداد فصل مراجعة الأدبيات (Literature Review) بشكل نقدي ومنظم يبرز الفجوة البحثية.", 
    category: 'graduate', 
    icon: Library,
    benefits: ["تصنيف موضوعي للدراسات", "نقد علمي رصين", "تحديث شامل للمراجع"]
  },
  { 
    id: 'g5', 
    name: "نشر في مجلات سكوبس (Q1/Q2)", 
    price: 1500, 
    description: "دعم فني وأكاديمي متكامل لنشر ورقتك العلمية في مجلات عالمية مصنفة لرفع مكانتك الأكاديمية.", 
    category: 'graduate', 
    icon: Newspaper,
    benefits: ["تنسيق وفق شروط المجلة", "متابعة مع المحررين", "ضمان معايير النشر العالمية"]
  },
  { 
    id: 'g6', 
    name: "تدقيق لغوي + فحص سرقة (Turnitin)", 
    price: 500, 
    description: "تصحيح لغوي دقيق وفحص انتحال باستخدام النسخة الأصلية من Turnitin لضمان أصالة العمل.", 
    category: 'graduate', 
    icon: ShieldCheck,
    benefits: ["تصحيح إملائي ونحوي فائق", "تقرير أصالة رسمي", "تحسين صياغة الجمل"]
  }
];

const App: React.FC = () => {
  // --- States ---
  const [activePage, setActivePage] = useState<Page>('home');
  const [medicalSubPage, setMedicalSubPage] = useState<MedicalSubPage>('medical-home');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // --- Medical Specific States ---
  const [medicalCart, setMedicalCart] = useState<MedicalCartItem[]>([]);
  const [medicalGroupCount, setMedicalGroupCount] = useState<number>(1);
  const [isMedicalCartOpen, setIsMedicalCartOpen] = useState(false);
  const [isMedicalCheckout, setIsMedicalCheckout] = useState(false);

  // Form States
  const [orderForm, setOrderForm] = useState({
    fullName: '',
    phone: '',
    specialization: '',
    email: '',
    affiliation: '',
    country: 'Saudi Arabia',
    city: '',
    orcid: '',
    details: ''
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // --- Effects ---
  useEffect(() => {
    const savedOrders = localStorage.getItem('sci_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    localStorage.setItem('sci_orders', JSON.stringify(orders));
  }, [orders]);

  // --- Helpers ---
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email === ADMIN_CREDENTIALS.email && loginForm.password === ADMIN_CREDENTIALS.password) {
      setCurrentUser({ id: 'admin', name: 'مدير المنصة', email: loginForm.email, role: 'admin' });
      setActivePage('admin');
      showToast("تم تسجيل الدخول كمدير");
    } else {
      setCurrentUser({ id: 'u' + Date.now(), name: 'عميل المنصة', email: loginForm.email, role: 'user' });
      setActivePage('dashboard');
      showToast("تم تسجيل الدخول بنجاح");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('home');
    showToast("تم تسجيل الخروج");
  };

  const confirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    let msg = `*طلب خدمة جديد من SciCoordX*\n\n`;
    msg += `*الخدمة:* ${selectedService.name}\n`;
    msg += `*السعر:* ${selectedService.price} ${selectedService.unit || 'SAR'}\n\n`;
    msg += `*بيانات العميل:*\n`;
    msg += `👤 الاسم: ${orderForm.fullName}\n`;
    msg += `📞 الجوال: ${orderForm.phone}\n`;
    msg += `📧 البريد: ${orderForm.email}\n`;
    msg += `🏛️ الجامعة: ${orderForm.affiliation}\n`;
    msg += `📝 تفاصيل: ${orderForm.details}\n`;

    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/966541175648?text=${encodedMsg}`, '_blank');
    setIsOrderModalOpen(false);
    showToast("تم تحويلك للواتساب لتأكيد الطلب");
  };

  // --- Medical Logic ---
  const addToMedicalCart = (specialty: string, role: 'First Author' | 'Co-Author', price: number) => {
    const newItem: MedicalCartItem = { id: Date.now().toString(), specialty, role, price };
    setMedicalCart([...medicalCart, newItem]);
    setIsMedicalCartOpen(true);
    setIsMedicalCheckout(false);
  };

  const removeMedicalCartItem = (id: string) => {
    setMedicalCart(medicalCart.filter(item => item.id !== id));
  };

  const calculateMedicalTotal = () => {
    let subtotal = medicalCart.reduce((sum, item) => sum + item.price, 0);
    return medicalGroupCount >= 5 ? subtotal * 0.5 : subtotal;
  };

  const handleMedicalFinalCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicalCart.length === 0) return showToast("السلة فارغة", "error");
    
    const total = calculateMedicalTotal();
    let msg = `*طلب جديد من متجر الأبحاث الطبية للنشر ٢٠٢٦*\n\n`;
    msg += `*الأبحاث المطلوبة:*\n`;
    medicalCart.forEach((item, i) => msg += `${i+1}. ${item.specialty} (${item.role}) - ${item.price} SAR\n`);
    msg += `\n*الإجمالي النهائي:* ${total.toLocaleString()} SAR\n*عدد المجموعة:* ${medicalGroupCount}\n\n`;
    msg += `*بيانات PROSPERO:*\n`;
    msg += `1️⃣ Full Name: ${orderForm.fullName}\n`;
    msg += `2️⃣ Specialization: ${orderForm.specialization}\n`;
    msg += `3️⃣ Email: ${orderForm.email}\n`;
    msg += `4️⃣ Affiliation: ${orderForm.affiliation}\n`;
    msg += `5️⃣ Country: ${orderForm.country}\n`;
    msg += `6️⃣ City: ${orderForm.city}\n`;
    msg += `7️⃣ ORCID: ${orderForm.orcid}\n`;

    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/966541175648?text=${encodedMsg}`, '_blank');
    setIsMedicalCartOpen(false);
    showToast("تم تحويلك للواتساب");
  };

  // --- Views ---
  const renderMedicalHowItWorks = () => (
    <div className="max-w-7xl mx-auto px-6 py-24 bg-white border-b border-slate-100 rounded-[4rem] my-12 shadow-sm">
      <div className="text-center mb-20 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#003366]/5 text-[#003366] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#003366]/10">
          <Zap size={14} className="animate-pulse" /> مسار النجاح البحثي
        </div>
        <h3 className="text-4xl font-black text-[#003366] italic">خريطة طريق النشر العلمي 2026 🗺️</h3>
        <p className="text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed">
          نحن في SciCoordX نأخذك في رحلة أكاديمية متكاملة تضمن لك الحصول على (5 نقاط) في ملف الهيئة السعودية للتخصصات الصحية (Portfolio) بأمان واحترافية فائقة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative">
        <div className="hidden md:block absolute top-[45px] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00a859]/20 to-transparent -z-10"></div>
        
        {[
          { icon: Target, title: "اختيار التخصص", desc: "تحديد التخصص الطبي المستهدف للمنافسة في البورد." },
          { icon: ClipboardCheck, title: "تسجيل البحث", desc: "بدء تسجيل المقترح في سجلات PROSPERO العالمية وتعيين الفريق." },
          { icon: Newspaper, title: "كتابة المخطوطة", desc: "إعداد البحث وفق أعلى معايير الكتابة الطبية الأكاديمية ونظام الـ IMRAD." },
          { icon: Share2, title: "التقديم للنشر", desc: "رفع البحث للمجلات المصنفة (Q1/Q2) في WoS و Scopus ومتابعة المراجعة." },
          { icon: Trophy, title: "القبول النهائي", desc: "صدور رابط النشر المباشر (Direct Link) وإضافته رسمياً لملف إنجازك." }
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-6 group">
            <div className="w-24 h-24 bg-white border-8 border-slate-50 text-[#003366] rounded-[2.5rem] flex items-center justify-center shadow-lg relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#00a859]/20">
              <step.icon size={40} strokeWidth={1.5} />
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#00a859] text-white text-sm font-black rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all">
                {i + 1}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-black text-[#003366] italic group-hover:text-[#00a859] transition-colors">{step.title}</h4>
              <p className="text-[11px] text-slate-400 font-bold leading-relaxed px-2">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMedicalShop = () => (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-[#003366] italic underline decoration-[#00a859]/20 underline-offset-8">تخصصات البحوث المتوفرة 🛒</h2>
        <p className="text-slate-500 font-bold italic text-lg">👤 اختر دورك في البحث: First Author / Co-Author</p>
        <div className="flex justify-center gap-4 mt-8">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black border border-blue-100">Pubmed Indexed (Q1)</span>
          <span className="px-4 py-1.5 bg-green-50 text-[#00a859] rounded-full text-[10px] font-black border border-[#00a859]/20">WoS / Scopus Guaranteed</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {MEDICAL_SPECIALTIES.map((s, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[3.5rem] text-right border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="mb-8 flex justify-between items-start relative z-10">
              <div className="bg-white w-16 h-16 rounded-3xl flex items-center justify-center text-[#003366] shadow-xl border border-slate-50 group-hover:bg-[#003366] group-hover:text-white transition-all duration-500">
                {React.createElement(s.icon, { size: 32, strokeWidth: 1.5 })}
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                s.difficulty === 'Competitive' ? 'bg-red-50 text-red-600 border border-red-100' :
                s.difficulty === 'High' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                'bg-green-50 text-[#00a859] border border-[#00a859]/20'
              }`}>
                {s.difficulty} Demand
              </div>
            </div>
            
            <h4 className="font-black text-2xl mb-6 text-[#003366] italic group-hover:text-[#00a859] transition-colors">{s.name}</h4>
            
            <div className="space-y-6 flex-grow relative z-10">
              <p className="text-slate-400 text-xs font-bold leading-relaxed italic line-clamp-3">{s.description}</p>
              <div className="h-0.5 bg-gradient-to-r from-[#003366]/10 via-transparent to-transparent mb-6"></div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-[#003366] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Star size={12} className="text-[#00a859] fill-[#00a859]" /> الفوائد البحثية:
                </p>
                {s.benefits.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-3 text-[11px] text-slate-500 font-bold">
                    <div className="w-5 h-5 bg-[#00a859]/10 text-[#00a859] rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckIcon size={12} strokeWidth={3} />
                    </div>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4">
                <p className="text-[10px] font-black text-[#003366] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Award size={12} className="text-[#00a859]" /> مخرجات النشر:
                </p>
                {s.outcomes.map((o, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-3 text-[11px] text-blue-600 font-black italic">
                    <Zap size={10} className="fill-blue-600" />
                    <span>{o}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 space-y-4 pt-6 border-t border-dashed border-slate-100 relative z-10">
              <button 
                onClick={() => addToMedicalCart(s.name, 'Co-Author', 1200)}
                className="w-full text-sm bg-slate-50 text-[#003366] py-4 rounded-3xl font-black hover:bg-[#003366] hover:text-white transition-all shadow-sm flex items-center justify-center gap-3 italic"
              >
                Co-Author (1200 SAR) <Plus size={16} />
              </button>
              <button 
                onClick={() => addToMedicalCart(s.name, 'First Author', 1500)}
                className="w-full text-sm bg-[#00a859] text-white py-4 rounded-3xl font-black hover:bg-[#008f4c] transition-all shadow-xl flex items-center justify-center gap-3 italic"
              >
                First Author (1500 SAR) <CheckCircle size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 bg-gradient-to-r from-[#003366] to-[#0055a4] text-white p-16 rounded-[4rem] text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <Microscope size={160} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[#00a859] font-black text-xs uppercase tracking-widest animate-bounce">
            <Star size={16} /> فرص 2026 الذهبية
          </div>
          <h3 className="text-3xl font-black italic">⏳ المقاعد تنفد بسرعة - احجز تخصصك الآن! ✅</h3>
          <p className="text-blue-100 font-bold italic max-w-3xl mx-auto text-lg leading-relaxed">
            لا تضيع فرصة الحصول على النقاط الكاملة في البورد. فريقنا جاهز لبدء رحلتك البحثية وتغطية كافة خطوات التسجيل والنشر بدلاً عنك.
          </p>
          <div className="flex justify-center gap-6 pt-6">
            <button 
              onClick={() => setIsMedicalCartOpen(true)}
              className="bg-white text-[#003366] px-12 py-5 rounded-3xl font-black text-xl hover:bg-slate-100 transition-all shadow-2xl btn-animate flex items-center gap-4"
            >
              <ShoppingCart size={28} /> عرض سلة الحجز ({medicalCart.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalHome = () => (
    <div className="space-y-0">
      <div className="bg-gradient-to-br from-[#003366] to-[#0055a4] text-white py-24 px-6 text-center relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-5xl mx-auto relative z-10 space-y-8">
          <span className="bg-[#00a859] text-white text-[10px] font-black px-6 py-2 rounded-full mb-6 inline-block animate-pulse italic tracking-wider shadow-lg">متجر الأبحاث الطبية للنشر ٢٠٢٦ 🟢</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight italic tracking-tighter">🛑 إضمن (5 نقاط) في ملفك (Portfolio) 👌</h1>
          <p className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-3xl mx-auto leading-relaxed font-bold italic">
            خايف تدفع وما تستلم شغلك؟ فريق <span className="text-[#00a859]">SciCoordX</span> هو الوجهة الأولى للأطباء والممارسين في السعودية للحصول على فرص بحثية ونشر علمي موثوق.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <button 
              onClick={() => setMedicalSubPage('medical-shop')}
              className="bg-white text-[#003366] px-12 py-5 rounded-3xl font-black text-xl shadow-2xl hover:bg-slate-100 transition-all btn-animate italic flex items-center gap-4"
            >
              تصفح الأبحاث المتاحة <ArrowLeft size={28} />
            </button>
            <a href="https://t.me/SciCoordX" target="_blank" className="bg-[#00a859] text-white px-12 py-5 rounded-3xl font-black text-xl shadow-2xl flex items-center hover:bg-[#008f4c] transition-all btn-animate italic">
              قناة التلجرام <TrendingUp className="mr-4" size={28} />
            </a>
          </div>
        </div>
      </div>

      {renderMedicalHowItWorks()}

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-black text-[#003366] italic leading-tight underline decoration-[#00a859]/20 decoration-8 underline-offset-[16px]">هل تعاني من ضيق الوقت وشروط النشر المعقدة؟</h2>
            <p className="text-slate-500 leading-loose font-bold text-xl italic">
              نتفهم تخوفك كطبيب أو طالب تدخل الماتشينج لأول مرة.. ومشغول؟ هل شغلك بينجز؟ هل بتضيع فلوسك؟ <br />
              <span className="text-[#00a859] italic">متواجدون لنختصر عليك الطريق! 🚀</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                "أبحاث Systematic Reviews الأقوى علمياً",
                "مطابقة للبورد السعودي 2026✍",
                "نشر في PubMed , Scopus , WoS",
                "إشراف استشاريين معتمدين🌟"
              ].map((txt, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-white p-6 rounded-[2rem] shadow-sm border-r-4 border-[#00a859] italic font-black text-sm transition-transform hover:scale-105">
                  <CheckCircle2 size={18} className="text-[#00a859] mt-0.5" />
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#003366] text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#00a859] rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
            <h3 className="text-3xl font-black mb-8 italic tracking-tighter text-[#00a859]">✨ ماذا نقدم لك؟</h3>
            <p className="text-slate-100 leading-relaxed mb-10 italic font-bold text-lg">
              يتم تعزيز الـ CV الخاص بك والتقديم على برامج التخصص بما يتوافق مع متطلبات هيئة التخصصات الصحية (SCFHS) لعام 2026.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-5 bg-white/5 p-5 rounded-3xl italic font-black hover:bg-white/10 transition border border-white/5">
                <Globe className="text-[#00a859]" size={24} />
                <span>رابط مباشر (Direct Link) فور النشر</span>
              </div>
              <div className="flex items-center gap-5 bg-white/5 p-5 rounded-3xl italic font-black hover:bg-white/10 transition border border-white/5">
                <ShieldCheck className="text-[#00a859]" size={24} />
                <span>ضمان ذهبي للاسترداد والنشر المضمون</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalSubNavigation = () => (
    <div className="bg-white border-b border-slate-100 overflow-x-auto shadow-sm sticky top-[72px] z-[110]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-center gap-8 whitespace-nowrap">
        {[
          { id: 'medical-home', label: 'الرئيسية' },
          { id: 'medical-shop', label: 'الأبحاث الجاهزة' },
          { id: 'medical-about', label: 'من نحن' },
          { id: 'medical-store-policy', label: 'سياسة المتجر' },
          { id: 'medical-policy', label: 'الخصوصية' }
        ].map(link => (
          <button 
            key={link.id}
            onClick={() => setMedicalSubPage(link.id as MedicalSubPage)}
            className={`text-sm font-black transition-all pb-2 px-1 ${medicalSubPage === link.id ? 'text-[#00a859] border-b-2 border-[#00a859]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderMedicalCartSidebar = () => (
    <div className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl z-[200] transform transition-transform duration-500 p-6 flex flex-col border-r-4 border-[#003366] ${isMedicalCartOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="flex items-center gap-3">
          <ShoppingCart size={24} className="text-[#003366]" />
          <h2 className="text-xl font-black text-[#003366] italic">{isMedicalCheckout ? 'بيانات PROSPERO' : 'سلة الطلبات'}</h2>
        </div>
        <button onClick={() => setIsMedicalCartOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
          <X size={32} />
        </button>
      </div>

      {!isMedicalCheckout ? (
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto space-y-4 pr-1">
            {medicalCart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 opacity-20 italic text-slate-300">
                <ShoppingCart size={64} className="mb-4" />
                <p className="font-black">السلة فارغة حالياً</p>
              </div>
            ) : (
              medicalCart.map(item => (
                <div key={item.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:bg-white transition-all">
                  <div>
                    <p className="text-sm font-black text-[#003366] italic">{item.specialty}</p>
                    <p className="text-[10px] text-[#00a859] font-bold italic uppercase tracking-tighter">{item.role}</p>
                  </div>
                  <div className="text-left flex flex-col items-end">
                    <p className="text-sm font-black italic">{item.price} SAR</p>
                    <button onClick={() => removeMedicalCartItem(item.id)} className="text-[10px] text-red-500 font-black hover:underline mt-1">حذف</button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-auto border-t pt-6 space-y-6">
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <label className="block text-xs font-black mb-3 text-[#003366] italic">🎁 عرض المجموعة: خصم 50% لـ 5 أشخاص فأكثر!</label>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold">عدد المقاعد:</span>
                <input 
                  type="number" 
                  value={medicalGroupCount} 
                  min="1" 
                  onChange={(e) => setMedicalGroupCount(parseInt(e.target.value) || 1)}
                  className="w-24 p-3 border-2 rounded-2xl text-center font-black outline-none border-slate-200 focus:border-[#00a859] transition-all shadow-inner"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-end px-2">
              <span className="text-lg font-black text-slate-400 italic">الإجمالي:</span>
              <span className="text-3xl font-black text-[#003366] tracking-tighter">{calculateMedicalTotal().toLocaleString()} SAR</span>
            </div>
            
            <button 
              disabled={medicalCart.length === 0}
              onClick={() => setIsMedicalCheckout(true)} 
              className="w-full bg-[#003366] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl hover:bg-[#002244] disabled:opacity-50 transition-all flex items-center justify-center gap-4 group"
            >
              الاستمرار لتعبئة البيانات <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleMedicalFinalCheckout} className="flex flex-col h-full">
          <div className="bg-slate-50 p-5 rounded-[2rem] mb-6 text-[11px] font-bold text-[#003366] leading-relaxed italic border border-slate-100">
            *هذه البيانات المطلوبة للاضافة في سجلات PROSPERO والنشر الدولي لعام 2026:*
          </div>
          <div className="flex-grow overflow-y-auto space-y-5 px-1 custom-scroll">
            {[
              { id: 'fullName', label: '1️⃣ Full Name (English)', placeholder: 'الاسم الكامل بالإنجليزية' },
              { id: 'specialization', label: '2️⃣ Specialization (Exact Field)', placeholder: 'التخصص الدقيق' },
              { id: 'email', label: '3️⃣ Active Email', placeholder: 'البريد الإلكتروني' },
              { id: 'affiliation', label: '4️⃣ Affiliation / Institution', placeholder: 'الجامعة أو جهة العمل' },
              { id: 'country', label: '5️⃣ Country', placeholder: 'الدولة' },
              { id: 'city', label: '6️⃣ City', placeholder: 'المدينة' },
              { id: 'orcid', label: '7️⃣ ORCID Number', placeholder: '0000-0000-0000-0000' }
            ].map(field => (
              <div key={field.id} className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">{field.label}</label>
                <input 
                  required 
                  type="text" 
                  placeholder={field.placeholder}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#00a859] transition-all shadow-sm"
                  value={(orderForm as any)[field.id]}
                  onChange={e => setOrderForm({...orderForm, [field.id]: e.target.value})}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t space-y-4">
            <button type="submit" className="w-full bg-[#00a859] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl hover:bg-[#008f4c] transition-all flex items-center justify-center gap-4">
              تأكيد الطلب (واتساب) <MessageSquare size={24} />
            </button>
            <button type="button" onClick={() => setIsMedicalCheckout(false)} className="w-full text-slate-400 font-black text-xs py-2 hover:text-[#00a859] transition-colors uppercase tracking-widest">العودة لتعديل الأبحاث</button>
          </div>
        </form>
      )}
    </div>
  );

  const renderServiceList = (category: Service['category']) => {
    const filtered = services.filter(s => s.category === category);
    return (
      <div className="space-y-12 animate-slide-up">
        <div className="max-w-7xl mx-auto px-6 pt-16 text-center">
          <h2 className="text-4xl font-black text-[#003366] mb-4">
            {category === 'bachelor' ? 'خدمات مرحلة البكالوريوس' : 'خدمات الدراسات العليا (ماجستير ودكتوراه)'}
          </h2>
          <p className="text-slate-500 font-bold max-w-2xl mx-auto">نقدم حلولاً أكاديمية شاملة تضمن لك التفوق والنجاح في مسيرتك الجامعية بأعلى جودة واتقان.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 md:p-12">
          {filtered.map(s => (
            <div key={s.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-slate-100 group flex flex-col">
              <div className="w-16 h-16 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#003366] group-hover:text-white transition-all">
                {React.createElement(s.icon, { size: 32 })}
              </div>
              <h3 className="text-2xl font-black text-[#003366] mb-4">{s.name}</h3>
              <p className="text-slate-400 font-bold mb-8 text-sm leading-relaxed">{s.description}</p>
              
              {s.benefits && (
                <div className="space-y-3 mb-8 border-t border-dashed border-slate-100 pt-6">
                  {s.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-[#003366] font-bold">
                      <div className="w-5 h-5 bg-blue-50 text-[#00a859] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckIcon size={12} />
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#00a859]">{s.price} {s.unit ? '' : 'SAR'}</span>
                  <span className="text-[10px] text-slate-400 font-black">{s.unit || 'ريال'}</span>
                </div>
                <button 
                  onClick={() => { setSelectedService(s); setIsOrderModalOpen(true); }}
                  className="bg-[#003366] text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-[#002244] transition-all flex items-center gap-2 shadow-lg"
                >
                  طلب الخدمة <ChevronLeft size={16}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="space-y-20">
      <section className="relative h-[95vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] via-[#003366] to-[#001f3f] z-0"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
        <div className="relative z-10 max-w-6xl px-6 space-y-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-blue-300 font-black text-xs uppercase tracking-widest animate-bounce">
              <Sparkle size={14} /> منصة البحث العلمي الأولى لعام 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight drop-shadow-2xl">
              بوابتك للتميز <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#00a859] to-cyan-300">الأكاديمي</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/70 font-bold max-w-3xl mx-auto leading-loose italic">
              نحن في SciCoordX نقدم حلولاً متكاملة تضمن لك الوصول إلى أعلى المعايير البحثية في الجامعات السعودية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <button onClick={() => setActivePage('bachelor')} className="group relative bg-white text-[#001f3f] p-10 rounded-[3rem] shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-4 overflow-hidden">
              <div className="absolute inset-0 bg-blue-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10 w-16 h-16 bg-[#001f3f] text-white rounded-2xl flex items-center justify-center shadow-lg"><School size={32} /></div>
              <div className="relative z-10 text-center"><span className="block text-2xl font-black mb-2">خدمات البكالوريوس</span><span className="text-xs text-slate-400 font-bold uppercase">حلول متكاملة للمرحلة الجامعية</span></div>
            </button>

            <button onClick={() => setActivePage('graduate')} className="group relative bg-[#005bb5] text-white p-10 rounded-[3rem] shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-4 overflow-hidden">
              <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10 w-16 h-16 bg-white text-blue-900 rounded-2xl flex items-center justify-center shadow-lg"><GraduationCap size={32} /></div>
              <div className="relative z-10 text-center"><span className="block text-2xl font-black mb-2">الماجستير والدكتوراه</span><span className="text-xs text-blue-100/60 font-bold uppercase">إشراف أكاديمي وبحوث عليا</span></div>
            </button>

            <button onClick={() => { setActivePage('medical'); setMedicalSubPage('medical-home'); }} className="group relative bg-gradient-to-br from-[#00a859] to-[#008f4c] text-white p-10 rounded-[3rem] shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-4 overflow-hidden">
              <div className="absolute inset-0 bg-green-700 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="absolute top-4 right-4 bg-yellow-400 text-green-900 px-3 py-1 rounded-full font-black text-[10px] animate-pulse">2026 NEW</div>
              <div className="relative z-10 w-16 h-16 bg-white text-green-600 rounded-2xl flex items-center justify-center shadow-lg"><Microscope size={32} /></div>
              <div className="relative z-10 text-center"><span className="block text-xl font-black mb-2 leading-tight">متجر الأبحاث الطبية للنشر ٢٠٢٦</span><span className="text-xs text-green-100/60 font-bold uppercase leading-none">فرص نشر حصرية</span></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Cairo'] text-right selection:bg-blue-500/20" dir="rtl">
      {/* Top Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl sticky top-0 z-[120] border-b border-slate-100 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActivePage('home')}>
            <div className="bg-[#003366] text-white p-3 rounded-2xl shadow-xl"><GraduationCap size={28}/></div>
            <div>
              <span className="text-2xl font-black text-[#003366] tracking-tighter">SciCoordX</span>
              <p className="text-[10px] text-[#00a859] font-black uppercase tracking-[0.3em] leading-none">Hub for Excellence</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {[
              { id: 'home', label: 'الرئيسية' },
              { id: 'bachelor', label: 'البكالوريوس' },
              { id: 'graduate', label: 'الدراسات العليا' },
              { id: 'medical', label: 'الأبحاث الطبية' }
            ].map(link => (
              <button 
                key={link.id}
                onClick={() => { setActivePage(link.id as Page); if(link.id === 'medical') setMedicalSubPage('medical-home'); }}
                className={`text-sm font-black transition-all ${activePage === link.id ? 'text-[#00a859]' : 'text-[#003366] hover:text-[#00a859]'}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {activePage === 'medical' && (
              <div className="relative cursor-pointer bg-slate-50 p-3.5 rounded-2xl hover:bg-slate-100 transition shadow-inner" onClick={() => setIsMedicalCartOpen(true)}>
                <ShoppingCart size={22} className="text-[#003366]" />
                {medicalCart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#00a859] text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">{medicalCart.length}</span>
                )}
              </div>
            )}
            {!currentUser ? (
              <button onClick={() => setActivePage('login')} className="bg-[#003366] text-white px-8 py-3.5 rounded-2xl font-black text-xs hover:bg-[#002244] transition-all flex items-center gap-2"><LogIn size={18}/> دخول</button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setActivePage(currentUser.role === 'admin' ? 'admin' : 'dashboard')} className="bg-slate-50 text-[#003366] p-3.5 rounded-2xl border border-slate-100"><LayoutDashboard size={22}/></button>
                <button onClick={handleLogout} className="bg-red-50 text-red-500 p-3.5 rounded-2xl"><LogOut size={22}/></button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Medical Specific Sub-Nav */}
      {activePage === 'medical' && renderMedicalSubNavigation()}

      <main className="pb-24">
        {activePage === 'home' && renderHome()}
        {activePage === 'bachelor' && renderServiceList('bachelor')}
        {activePage === 'graduate' && renderServiceList('graduate')}
        
        {activePage === 'medical' && (
          <div className="animate-slide-up">
            {medicalSubPage === 'medical-home' && renderMedicalHome()}
            {medicalSubPage === 'medical-shop' && renderMedicalShop()}
            {medicalSubPage === 'medical-about' && (
              <div className="max-w-4xl mx-auto py-24 px-6">
                <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-t-[16px] border-[#003366] relative">
                  <div className="absolute -top-10 right-10 bg-[#00a859] text-white px-8 py-4 rounded-3xl shadow-xl font-black text-xl italic">من نحن؟</div>
                  <h2 className="text-3xl font-black text-[#003366] mb-10 italic">SciCoordX Medical Hub</h2>
                  <div className="space-y-8 text-slate-600 leading-[2.2] text-lg font-bold italic">
                    <p>نحن الوجهة الأولى للأطباء والممارسين الصحيين في السعودية للحصول على فرص بحثية ونشر علمي موثوق، مدركين تماماً لتحديات المنافسة على برامج البورد السعودي والزمالة.</p>
                    <p>نقدم حلولاً ذكية تشمل أبحاث Systematic Reviews & Meta-Analysis التي تعد الأقوى علمياً، بما يتوافق 100% مع دليل الهيئة السعودية للتخصصات الصحية (SCFHS) لعام 2026.</p>
                    <div className="bg-[#f0f9f4] p-8 rounded-[2.5rem] border-r-8 border-[#00a859]">
                      <h4 className="font-black text-[#003366] mb-6 text-xl">فريقنا يضمن لك:</h4>
                      <ul className="space-y-4">
                        <li className="flex items-center gap-4"><Star size={20} className="text-yellow-500 fill-yellow-500" /> النشر في مجلات مصنفة (Q1, Q2) في WoS و Scopus.</li>
                        <li className="flex items-center gap-4"><Star size={20} className="text-yellow-500 fill-yellow-500" /> إشراف استشاريين معتمدين وأكاديميين ذوي خبرة.</li>
                        <li className="flex items-center gap-4"><Star size={20} className="text-yellow-500 fill-yellow-500" /> توفير رابط مباشر للبحث فور نشره لتقديمه في الهيئة.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {medicalSubPage === 'medical-store-policy' && (
              <div className="max-w-5xl mx-auto py-24 px-6 bg-white rounded-[4rem] shadow-sm mt-12 mb-24 border border-slate-50 p-16 space-y-12">
                <div className="text-center"><h2 className="text-4xl font-black text-[#003366] italic underline decoration-[#00a859]/20 underline-offset-8">سياسة المتجر</h2></div>
                <div className="space-y-10 text-slate-500 leading-loose font-bold italic">
                  <section><h3 className="text-xl font-black text-[#003366] mb-4 border-r-4 border-[#00a859] pr-4">المادة الأولى - طبيعة الالتزام</h3><p>تلتزم SciCoordX بتقديم الخدمة البحثية كما هي موضحة، بما يشمل الكتابة، الإشراف، ومتابعة النشر مع ضمان ذهبي للنشر المضمون أو الاسترداد.</p></section>
                  <section><h3 className="text-xl font-black text-[#003366] mb-4 border-r-4 border-[#00a859] pr-4">المادة الثانية - الضمان الذهبي</h3><p>نضمن نشر البحث في مجلة معتمدة وفقاً لمتطلبات هيئة التخصصات الصحية 2026. يشمل الضمان إشراف استشاري، سرية تامة، ودعم كامل حتى القبول النهائي.</p></section>
                  <section><h3 className="text-xl font-black text-[#003366] mb-4 border-r-4 border-[#00a859] pr-4">المادة الثالثة - التوصيات</h3><p>لا نقدم توصيات شخصية؛ خدماتنا تقتصر على الدعم البحثي والأكاديمي فقط لضمان النزاهة العلمية.</p></section>
                </div>
              </div>
            )}
            {medicalSubPage === 'medical-policy' && (
              <div className="max-w-5xl mx-auto py-24 px-6 bg-white rounded-[4rem] shadow-sm mt-12 border border-slate-50 p-16 text-center">
                <h2 className="text-4xl font-black text-[#003366] mb-12 italic">الخصوصية والاستخدام</h2>
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 text-slate-600 font-bold leading-loose italic max-w-3xl mx-auto">
                  نلتزم في SciCoordX بالحفاظ على سرية بياناتك وعدم مشاركتها مع أي طرف ثالث. تعامل جميع الأبحاث والمعلومات بسرية تامة لضمان خصوصيتك الأكاديمية والمهنية.
                </div>
              </div>
            )}
          </div>
        )}

        {activePage === 'login' && (
          <div className="min-h-[80vh] flex items-center justify-center p-6 animate-slide-up"><div className="bg-white p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md border border-slate-50"><div className="text-center mb-10"><h2 className="text-3xl font-black text-[#003366]">دخول المنصة</h2></div><form onSubmit={handleLogin} className="space-y-6"><div className="space-y-2"><label className="text-xs font-black text-slate-400 mr-2 uppercase">البريد الإلكتروني</label><input required type="email" placeholder="example@gmail.com" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:border-[#00a859] font-bold" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} /></div><div className="space-y-2"><label className="text-xs font-black text-slate-400 mr-2 uppercase">كلمة المرور</label><input required type="password" placeholder="********" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:border-[#00a859] font-bold" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} /></div><button type="submit" className="w-full bg-[#003366] text-white py-5 rounded-3xl font-black text-lg hover:bg-[#002244] transition-all">تسجيل الدخول</button></form></div></div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#001f3f] text-white pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10 text-right">
          <div className="space-y-8">
            <div className="flex items-center gap-4"><div className="bg-[#00a859] p-2.5 rounded-xl shadow-lg"><GraduationCap size={32}/></div><h4 className="text-3xl font-black italic">SciCoordX</h4></div>
            <p className="text-blue-100/60 font-bold italic text-lg leading-relaxed">الوجهة الأولى للأبحاث الأكاديمية والخدمات التعليمية المتوافقة مع معايير ٢٠٢٦ في المملكة والخليج.</p>
          </div>
          <div><h5 className="text-lg font-black mb-8 text-[#00a859] border-r-4 border-[#00a859] pr-4 italic">أقسام المنصة</h5><ul className="space-y-4 font-bold text-blue-100/40"><li className="cursor-pointer hover:text-white" onClick={() => setActivePage('bachelor')}>البكالوريوس</li><li className="cursor-pointer hover:text-white" onClick={() => setActivePage('graduate')}>الدراسات العليا</li><li className="cursor-pointer hover:text-white" onClick={() => setActivePage('medical')}>الأبحاث الطبية ٢٠٢٦</li></ul></div>
          <div><h5 className="text-lg font-black mb-8 text-[#00a859] border-r-4 border-[#00a859] pr-4 italic">تواصل مباشر</h5><a href="https://wa.me/966541175648" className="bg-[#00a859] text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#008f4c] transition shadow-xl shadow-green-900/10"><MessageSquare size={20} /> راسلنا واتساب</a></div>
        </div>
      </footer>

      {renderMedicalCartSidebar()}

      {isOrderModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsOrderModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black mb-8 text-[#003366]">إكمال طلب الخدمة: {selectedService?.name}</h3>
            <form onSubmit={confirmOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="الاسم الكامل" className="w-full p-4 bg-slate-50 rounded-2xl shadow-sm outline-none focus:border-[#00a859]" value={orderForm.fullName} onChange={e => setOrderForm({...orderForm, fullName: e.target.value})} />
                <input required type="tel" placeholder="رقم الجوال" className="w-full p-4 bg-slate-50 rounded-2xl shadow-sm outline-none focus:border-[#00a859]" value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} />
                <input required type="email" placeholder="البريد الإلكتروني" className="w-full p-4 bg-slate-50 rounded-2xl shadow-sm outline-none focus:border-[#00a859]" value={orderForm.email} onChange={e => setOrderForm({...orderForm, email: e.target.value})} />
                <input required placeholder="الجامعة" className="w-full p-4 bg-slate-50 rounded-2xl shadow-sm outline-none focus:border-[#00a859]" value={orderForm.affiliation} onChange={e => setOrderForm({...orderForm, affiliation: e.target.value})} />
              </div>
              <textarea rows={4} placeholder="ملاحظات إضافية" className="w-full p-4 bg-slate-50 rounded-2xl shadow-sm outline-none focus:border-[#00a859]" value={orderForm.details} onChange={e => setOrderForm({...orderForm, details: e.target.value})} />
              <button type="submit" className="w-full bg-[#003366] text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-[#002244] transition-all">تأكيد الطلب واتساب</button>
            </form>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed bottom-10 right-10 z-[300] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up ${notification.type === 'success' ? 'bg-[#003366] text-white' : 'bg-red-500 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}<span className="font-black text-sm">{notification.msg}</span>
        </div>
      )}

      <a href="https://wa.me/966541175648" target="_blank" className="fixed bottom-6 right-6 bg-[#00a859] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-[150] hover:scale-110 transition btn-animate"><MessageSquare size={32}/></a>

      <style>{`
        @keyframes slide-up { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
      `}</style>
    </div>
  );
};

export default App;
