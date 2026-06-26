import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { 
  ArrowRight, Clock, Map, PieChart, Book, Image as ImageIcon, BookOpen, HeartPulse, 
  Dna, Utensils, Calendar, Contact, Award, Mic, Wand2, Bot, ScrollText, ScanFace, 
  Lock, Shield, Globe, Users, Timer, Landmark, Wallet, Briefcase, Library, 
  Newspaper, Archive, Gamepad2, Tent, HeartHandshake, Home,
  Search, Film, BrainCircuit, Ticket, Building2, Scale,
  Activity, ShieldPlus, Brain, Sparkles, Baby, UserPlus, Fingerprint,
  Crown, Pill, Plane, Dumbbell, TestTubes,
  GraduationCap, MapPin, Radio, Compass, Store, Vote, TreeDeciduous
} from "lucide-react";
import { useAppStore } from "../lib/store";
import { MinimalFooter } from "../components/layout/MinimalFooter";

const categoriesConfig = [
  { id: 'tree-builder', title: 'بناء شجرة العائلة', desc: 'محرك مرئي متطور يمنحك السيطرة الكاملة لتصميم، تعديل، وتوسيع شجرة عائلتك بمرونة فائقة.', theme: 'emerald', icon: TreeDeciduous },
  { id: 'ai', title: 'الاستكشاف والتحليل المتقدم', desc: 'أدوات وحلول تقنية متطورة لاكتشاف، تحليل وتجسيد تاريخ عائلتك بطرق مبتكرة.', theme: 'blue', icon: Bot },
  { id: 'heritage', title: 'التراث وحفظ الذاكرة العائلية', desc: 'أدوات مخصصة لتوثيق وحفظ الموروث الثقافي، والقصص الشفوية، والتاريخ الطبي، والمقتنيات الثمينة لتتناقلها الأجيال.', theme: 'amber', icon: Archive },
  { id: 'media', title: 'إنتاج الوسائط والتوثيق البصري', desc: 'حول بيانات وصور عائلتك إلى أعمال فنية، أفلام وثائقية، وكتب مطبوعة تروي إرثكم بأبهى حلة.', theme: 'rose', icon: ImageIcon },
  { id: 'social', title: 'التواصل والمجتمع العائلي', desc: 'عزز الترابط بين أفراد العائلة عبر منصات تفاعلية للتواصل، التخطيط للمناسبات، وتوثيق الإنجازات.', theme: 'emerald', icon: Users },
  { id: 'wealth', title: 'الإدارة المالية والقانونية', desc: 'حلول مؤسسية متكاملة لإدارة الأوقاف، تخطيط الوصايا، وحماية الإرث المادي والرقمي للعائلة.', theme: 'slate', icon: Building2 },
  { id: 'dna', title: 'الحمض النووي (DNA)', desc: 'استثمر في مستقبلك وصحتك عبر باقات تحليل الجينات الحصرية، واكتشف أسرار شيفرتك الوراثية.', theme: 'purple', icon: Dna }
];

const themeStyles: Record<string, any> = {
  blue: { bg: 'bg-blue-50/70', border: 'border-blue-100', text: 'text-blue-700', hover: 'hover:border-blue-300', iconBg: 'from-blue-50 to-white text-blue-600 group-hover:from-blue-100 group-hover:to-blue-50', gradient: 'from-blue-600/5 to-cyan-600/5', title: 'from-blue-700 to-cyan-700' },
  amber: { bg: 'bg-amber-50/70', border: 'border-amber-100', text: 'text-amber-700', hover: 'hover:border-amber-300', iconBg: 'from-amber-50 to-white text-amber-600 group-hover:from-amber-100 group-hover:to-amber-50', gradient: 'from-amber-600/5 to-orange-600/5', title: 'from-amber-700 to-orange-700' },
  rose: { bg: 'bg-rose-50/70', border: 'border-rose-100', text: 'text-rose-700', hover: 'hover:border-rose-300', iconBg: 'from-rose-50 to-white text-rose-600 group-hover:from-rose-100 group-hover:to-rose-50', gradient: 'from-rose-600/5 to-pink-600/5', title: 'from-rose-700 to-pink-700' },
  emerald: { bg: 'bg-emerald-50/70', border: 'border-emerald-100', text: 'text-emerald-700', hover: 'hover:border-emerald-300', iconBg: 'from-emerald-50 to-white text-emerald-600 group-hover:from-emerald-100 group-hover:to-emerald-50', gradient: 'from-emerald-600/5 to-teal-600/5', title: 'from-emerald-700 to-teal-700' },
  slate: { bg: 'bg-slate-50/70', border: 'border-slate-200', text: 'text-slate-700', hover: 'hover:border-slate-400', iconBg: 'from-slate-100 to-white text-slate-700 group-hover:from-slate-200 group-hover:to-slate-100', gradient: 'from-slate-600/5 to-gray-600/5', title: 'from-slate-700 to-gray-700' },
  purple: { bg: 'bg-purple-50/70', border: 'border-purple-100', text: 'text-purple-700', hover: 'hover:border-purple-300', iconBg: 'from-purple-50 to-white text-purple-600 group-hover:from-purple-100 group-hover:to-purple-50', gradient: 'from-purple-600/5 to-indigo-600/5', title: 'from-purple-700 to-indigo-700' },
};

export function TreeFeatures() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppStore(state => state.currentUser);
  
  // Initialize with empty string for Landing Page view
  const [activeTab, setActiveTab] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("");
    }
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentUser?.id]);

  const tabs: Array<{ id: string, category: string, label: string, icon: any, description: React.ReactNode }> = [
    { 
      id: "tree-builder-platform", 
      category: "tree-builder", 
      label: "منصة جذور وأغصان العائلة", 
      icon: TreeDeciduous, 
      description: (
        <div className="space-y-4">
          <p className="font-medium">
            محرك مرئي متطور يمنحك السيطرة الكاملة لتصميم، تعديل، وتوسيع شجرة عائلتك بمرونة فائقة. ابنِ قاعدة بيانات عائلية ضخمة ومتشعبة بأسلوب تفاعلي جذاب، واحتفظ بتاريخ عائلتك مفصلاً للأجيال القادمة.
          </p>
          <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm mt-4">
            <h4 className="text-emerald-800 font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              الملف الشخصي الشامل لكل فرد:
            </h4>
            <ul className="list-disc list-inside text-brand-700 space-y-2 text-base marker:text-emerald-400">
              <li><strong>البيانات الأساسية:</strong> الاسم الكامل، اللقب، الجنس، وتاريخ ومكان الميلاد والوفاة.</li>
              <li><strong>الروابط العائلية الدقيقة:</strong> تحديد الوالدين، إضافة الزوج/الزوجة بتواريخ الزواج، وربط الأبناء بمرونة عالية.</li>
              <li><strong>السيرة الذاتية والقصة:</strong> مساحة حرة لتدوين إنجازات الفرد، مسيرته المهنية، وقصص نجاحه لتبقى خالدة.</li>
              <li><strong>معرض الوسائط والوثائق:</strong> إرفاق صور شخصية، وثائق تاريخية، شهادات ميلاد، ومقتنيات رقمية لكل سجل.</li>
              <li><strong>تتبع الحالة:</strong> تحديد ما إذا كان الفرد على قيد الحياة مع حساب العمر تلقائياً أو تاريخ الوفاة بدقة.</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
            <h4 className="text-emerald-800 font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              أدوات الإدارة المتقدمة:
            </h4>
            <ul className="list-disc list-inside text-brand-700 space-y-2 text-base marker:text-emerald-400">
              <li><strong>الاستيراد والتصدير (GEDCOM):</strong> توافق كامل مع الأنظمة العالمية لتبادل بيانات شجرة العائلة.</li>
              <li><strong>التصدير المرئي:</strong> تحويل الشجرة إلى صور عالية الجودة قابلة للطباعة والمشاركة.</li>
              <li><strong>الحفظ السحابي:</strong> حفظ التعديلات بأمان مع الحماية من فقدان البيانات.</li>
            </ul>
          </div>
        </div>
      )
    },
    { id: "vip-concierge", category: "ai", label: "الباحث النساب الخاص (VIP)", icon: Search, description: "خدمة كونسيرج حصرية تخصص خبيراً محترفاً للبحث في الأرشيفات العالمية، واستخراج الوثائق، وتوثيق شجرة عائلتك بالنيابة عنك لضمان أعلى درجات الدقة." },
    { id: "timeline", category: "ai", label: "الخط الزمني", icon: Clock, description: "استعراض الأحداث الهامة والذكريات والمحطات البارزة في تاريخ العائلة على خط زمني تفاعلي يعرض تعاقب الأجيال." },
    { id: "map", category: "ai", label: "الخريطة التفاعلية ومسارات الهجرة", icon: Map, description: "خريطة تفاعلية توضح أماكن تواجد أفراد العائلة جغرافياً، وتتتبع مسارات الهجرة والتنقلات عبر الأجيال." },
    { id: "interviews", category: "heritage", label: "التاريخ الشفوي والمقابلات", icon: Mic, description: "مساحة مخصصة لحفظ وتسجيل المقابلات الصوتية مع كبار السن لتوثيق التاريخ الشفوي وحكاياتهم بأصواتهم." },
    { id: "smart-documents", category: "heritage", label: "أرشفة المخطوطات والوثائق", icon: ScrollText, description: "تحليل وقراءة المخطوطات القديمة والوثائق المكتوبة بخط اليد وفهرستها ذكياً لتسهيل البحث في محتواها." },
    { id: "media", category: "media", label: "معرض الوسائط المجمع", icon: ImageIcon, description: "معرض شامل ومنظم يجمع كافة الصور، ومقاطع الفيديو، والوثائق التاريخية المرتبطة بأفراد العائلة في مكان واحد." },
    { id: "heirlooms-gallery", category: "heritage", label: "متحف المقتنيات الأثرية", icon: Archive, description: "معرض رقمي لتوثيق وعرض المقتنيات العائلية المتوارثة والقطع الأثرية وقصصها." },
    { id: "photo-ai", category: "media", label: "ترميم وتلوين الصور", icon: Wand2, description: "أداة ذكية لإصلاح الصور القديمة الممزقة وتلوين الصور بالأبيض والأسود، وتحسين جودتها لإعادتها للحياة والمحافظة عليها." },
    { id: "face-matching", category: "ai", label: "تطابق الوجوه عبر الأجيال", icon: ScanFace, description: "تحليل ملامح الوجوه في صور العائلة لمعرفة نسبة الشبه بين الأجداد والأحفاد واكتشاف تناقل الملامح الجينية." },
    { id: "family-netflix", category: "media", label: "الإنتاج السينمائي لتاريخ العائلة", icon: Film, description: "إنتاج فيلم وثائقي سينمائي احترافي يروي قصة العائلة، ومسيرة الأجداد، وتطور الأجيال، بجودة عالية ومؤثرات تليق بإرثكم ليعرض كفيلم عائلي خاص." },
    { id: "family-podcast", category: "media", label: "راديو وبودكاست العائلة", icon: Radio, description: "منصة بث صوتي (بودكاست) لإنتاج وعرض حوارات ممتعة وقصص ملهمة مع رموز العائلة وشبابها." },
    { id: "story", category: "media", label: "قصة قصيرة أو سيرة ذاتية أدبية", icon: BookOpen, description: "محرك ذكي يجمع تفاصيل حياة الأفراد ليصيغ منها قصة أدبية أو سيرة ذاتية سردية ممتعة تحفظ إرثهم بأسلوب قصصي." },
    { id: "book", category: "media", label: "إنشاء كتاب العائلة للطباعة", icon: Book, description: "تحويل بيانات وصور الشجرة إلى كتاب مصمم بشكل احترافي وجاهز للطباعة ليصبح إرثاً مادياً ملموساً للعائلة." },
    { id: "directory", category: "social", label: "دليل العائلة", icon: Contact, description: "دليل شامل يحتوي على أرقام الهواتف، العناوين، وحسابات التواصل الاجتماعي المحدثة لجميع أفراد العائلة." },
    { id: "reunion-concierge", category: "social", label: "تنظيم المؤتمرات العائلية", icon: Ticket, description: "فريق تخطيط مخصص لتنظيم التجمعات العائلية الكبرى والمؤتمرات العالمية، متضمنة حجوزات الطيران، والفنادق، وتصميم الفعاليات والأنشطة المشتركة." },
    { id: "family-forum", category: "social", label: "مجتمع ومنتدى العائلة", icon: Users, description: "شبكة اجتماعية مغلقة ومؤمنة لأفراد العائلة لتبادل الأخبار، مشاركة التحديثات، وتنظيم التجمعات والفعاليات العائلية." },
    { id: "family-mentorship", category: "social", label: "التوجيه المهني والإرشاد", icon: Compass, description: "برنامج يربط خبراء العائلة بشبابها لتقديم التوجيه، ونقل الخبرات المهنية، ومساعدتهم في التخطيط لمسارهم الوظيفي." },
    { id: "voting-system", category: "social", label: "منصة التصويت العائلي", icon: Vote, description: "نظام ديمقراطي وشفاف لاتخاذ القرارات العائلية المشتركة وتحديد مواعيد التجمعات وتوجيه صناديق الدعم." },
    { id: "skills-market", category: "social", label: "دليل الأعمال والمهارات", icon: Briefcase, description: "منصة للتعريف بمهن وأعمال أفراد العائلة لتعزيز التعاون المهني وتبادل المنفعة بينهم." },
    { id: "calendar", category: "social", label: "تقويم العائلة والمناسبات", icon: Calendar, description: "تقويم ذكي يجمع أعياد الميلاد، ومناسبات الزواج، والذكرى السنوية للوفاة لتذكير أفراد العائلة وتعزيز الروابط." },
    { id: "family-newsletter", category: "social", label: "المجلة العائلية الرقمية", icon: Newspaper, description: "نشرة دورية تصدر تلقائياً لجمع أخبار العائلة، إنجازات أفرادها، وتحديثات الشجرة." },
    { id: "family-chatbot", category: "ai", label: "المساعد الذكي لتاريخ العائلة", icon: Bot, description: "مساعد ذكي (شات بوت) مخصص لعائلتك، يجيب على استفساراتك حول الأجداد، وتواريخ الأحداث، والأماكن بناءً على بيانات الشجرة." },
    { id: "ai-ancestor", category: "ai", label: "اللقاء الافتراضي مع الأجداد", icon: BrainCircuit, description: "إحياء شخصيات الأجداد عبر تقنية الهولوجرام والذكاء الاصطناعي، لتتمكن الأجيال الجديدة من التحدث معهم وسماع قصصهم وحكمتهم في تجربة تفاعلية مذهلة." },
    { id: "analytics", category: "ai", label: "لوحة التحليلات والإحصائيات", icon: PieChart, description: "لوحة معلومات متقدمة توفر إحصائيات دقيقة حول العائلة مثل التوزيع العمري، والمهن، والمناطق الجغرافية، ونسبة الذكور للإناث." },
    { id: "vr-tree", category: "media", label: "الشجرة بالواقع الافتراضي 3D", icon: Globe, description: "استكشاف شجرة العائلة ومسارات هجرتهم في تجربة غامرة ثلاثية الأبعاد (3D) لتجربة بصرية فريدة تفاعلية." },
    { id: "medical", category: "heritage", label: "التاريخ الطبي والوراثي", icon: HeartPulse, description: "سجل أمن وموثوق لتتبع التاريخ المرضي، والأمراض الوراثية، ومتوسط الأعمار لمساعدة الأجيال القادمة في الجانب الصحي." },
    { id: "dna", category: "dna", label: "مكتشف الأصول والقرابات الجينية", icon: Dna, description: "منصة ذكية لاكتشاف الأصول العرقية والقرابات البعيدة وربطها أوتوماتيكياً بشجرة العائلة." },
    { id: "dna-ancient", category: "dna", label: "الربط الجيني بالشخصيات التاريخية", icon: Crown, description: "تحليل الحمض النووي لاكتشاف الروابط الجينية التي تجمعك بالشخصيات التاريخية، والملوك، والقادة القدماء عبر العصور." },
    { id: "dna-diet", category: "dna", label: "باقة التغذية واللياقة الجينية", icon: Activity, description: "تحليل جيني يحدد أفضل نظام غذائي وأنسب التمارين الرياضية لجسمك، لبناء خطة حياة صحية تعتمد على شيفرتك الوراثية بدلاً من التجربة والخطأ." },
    { id: "dna-athlete", category: "dna", label: "تحليل الأداء الرياضي الاحترافي", icon: Dumbbell, description: "اكتشف قدراتك البدنية الحقيقية، ونوع أليافك العضلية، ومعدلات الاستشفاء لديك لبناء خطة تدريب رياضية احترافية." },
    { id: "dna-longevity", category: "dna", label: "المستشار الصحي الوقائي وبرنامج إطالة العمر", icon: ShieldPlus, description: "برنامج متقدم يتتبع المؤشرات الجينية للأمراض المحتملة ويقدم خططاً وقائية وعلاجات مخصصة لإطالة العمر وتحسين جودة الحياة." },
    { id: "dna-pharma", category: "dna", label: "تقرير الاستجابة للأدوية (Pharmacogenomics)", icon: Pill, description: "وفر نفقاتك العلاجية وتجنب الآثار الجانبية عبر تحليل جيني يحدد بدقة مدى استجابة جسمك لمختلف الأدوية الطبية." },
    { id: "dna-skincare", category: "dna", label: "روتين العناية بالبشرة والجمال الجيني", icon: Sparkles, description: "وداعاً للتجارب العشوائية؛ احصل على منتجات وروتين عناية بالبشرة مصمم خصيصاً ليناسب تركيبة حمضك النووي ومقاومة علامات التقدم بالسن." },
    { id: "dna-allergy", category: "dna", label: "تحليل الحساسية الجينية والسموم", icon: TestTubes, description: "اكتشف مبكراً الحساسيات الغذائية والبيئية المخفية، وقدرة جسمك على التخلص من السموم، لضبط نمط حياتك بوعي." },
    { id: "dna-executive", category: "dna", label: "التحليل الذهني المتقدم للمديرين والتنفيذيين", icon: Brain, description: "اكتشف قدراتك الذهنية الكامنة عبر تحليل جيني يوضح أنماط الاستجابة للضغط، والتركيز، واتخاذ القرار لتعزيز أدائك القيادي." },
    { id: "dna-kids", category: "dna", label: "تقرير مواهب وقدرات الأطفال", icon: Baby, description: "اكتشف مبكراً الاستعداد الجيني لأطفالك في مجالات الرياضة، والذكاء، والفنون، لتوجيههم وتنمية مهاراتهم في المسار الأنسب لطبيعتهم." },
    { id: "dna-marital", category: "dna", label: "التوافق الجيني للزواج وتخطيط الأسرة", icon: UserPlus, description: "تحليل جيني للمقبلين على الزواج للتأكد من التوافق الصحي، وتجنب الأمراض الوراثية المحتملة لضمان مستقبل صحي وآمن للعائلة." },
    { id: "dna-traits", category: "dna", label: "مؤشر التشابه العائلي وتوريث الملامح", icon: Fingerprint, description: "مقارنة ممتعة لنتائج الجينات بين أفراد العائلة لاكتشاف من ورث أي الملامح، وتتبع انتقال الصفات الوراثية عبر الأجيال." },
    { id: "dna-travel", category: "dna", label: "السياحة الجينية واستكشاف الجذور", icon: Plane, description: "برنامج كونسيرج سياحي حصري يصمم لك رحلات مخصصة لزيارة مواطن أجدادك الأصلية واختبار ثقافاتهم بناءً على خريطتك الجينية." },
    { id: "legal-estate", category: "wealth", label: "المخطط القانوني للوصايا والإرث", icon: Scale, description: "منصة قانونية وشرعية معتمدة لتخطيط الوصايا، وتقسيم المواريث آلياً، وإدارة الإجراءات القانونية لنقل الملكيات بين الورثة وتصفية التركات بسلاسة." },
    { id: "legacy-vault", category: "wealth", label: "صندوق الإرث الرقمي", icon: Lock, description: "خزنة رقمية مشفرة تعمل كمستودع آمن لحفظ كلمات المرور، المفاتيح الرقمية، والوثائق الحساسة لضمان عدم ضياعها، بدون تدخل في الجانب القانوني." },
    { id: "wealth-management", category: "wealth", label: "الإدارة الذكية للثروات العائلية", icon: Building2, description: "أداة استثمارية متقدمة لإدارة وتنمية الثروات والأصول التجارية العائلية، وحساب العوائد وتوزيع الأرباح بدقة على المستحقين، منفصلة تماماً عن العمل الخيري." },
    { id: "family-fund", category: "wealth", label: "صندوق التكافل العائلي", icon: Wallet, description: "شبكة أمان اجتماعي لتوفير الدعم الأساسي للحالات الطارئة، وتغطية تكاليف العلاج، وسداد ديون المتعثرين من أفراد العائلة." },
    { id: "scholarship-fund", category: "wealth", label: "صندوق المنح ورعاية النوابغ", icon: GraduationCap, description: "صندوق استثماري مخصص حصرياً لدعم وتطوير الأذكياء، وتمويل المنح الدراسية والابتعاث الخارجي للمتفوقين لضمان مستقبل مشرق لشباب العائلة." },
    { id: "charity-waqf", category: "wealth", label: "الأوقاف والأعمال الخيرية", icon: HeartHandshake, description: "منصة مخصصة حصرياً لتنظيم وإدارة الأوقاف الخيرية، وتوجيه التبرعات العائلية، وتوثيق أثر المبادرات المجتمعية لخدمة المجتمع." },
    { id: "family-store", category: "wealth", label: "متجر العائلة الحصري", icon: Store, description: "متجر إلكتروني لتسويق منتجات العائلة، والمحاصيل الخاصة، والكتب العائلية، مع خصومات حصرية للأقارب." },
    { id: "achievements", category: "social", label: "سجل الإنجازات والأوسمة", icon: Award, description: "سجل فخر يوثق الجوائز، والشهادات الأكاديمية، والبطولات، والإسهامات المجتمعية التي حققها أفراد العائلة." },
    { id: "family-crest", category: "media", label: "تصميم ختم وشعار العائلة", icon: Shield, description: "تصميم شعار وختم مميز (Crest) يعبر عن تاريخ العائلة، مهن أجدادها، ومناطقها الجغرافية ليكون رمزاً يجمعها." },
    { id: "recipes", category: "heritage", label: "الوصفات المتوارثة", icon: Utensils, description: "كتاب إلكتروني تفاعلي لتوثيق الوصفات السرية والمأكولات المتوارثة، والقصص المرتبطة بموائد العائلة عبر الزمن." },
    { id: "cultural-heritage", category: "heritage", label: "التراث الثقافي والتقاليد", icon: Tent, description: "توثيق العادات والتقاليد، والأمثال الشعبية، والقصائد التي تميز ثقافة العائلة عبر الأجيال." },
    { id: "geo-heritage", category: "heritage", label: "الموثق الجغرافي لأملاك العائلة", icon: MapPin, description: "منصة لتوثيق الأراضي، والمزارع، والبيوت القديمة التي امتلكتها العائلة تاريخياً على خرائط تفاعلية دقيقة." },
    { id: "heritage-names", category: "heritage", label: "معجم الأسماء والمصطلحات", icon: Library, description: "قاموس يوثق الأسماء المتكررة في العائلة ومعانيها، والمصطلحات الخاصة المتداولة بين أفرادها." },
    { id: "time-capsule", category: "heritage", label: "كبسولة الزمن العائلية", icon: Timer, description: "إيداع رسائل وصور وفيديوهات لا يتم فتحها إلا في تاريخ مستقبلي محدد للأجيال القادمة." },
    { id: "family-trivia", category: "social", label: "ألعاب ومسابقات عائلية", icon: Gamepad2, description: "ألعاب وتحديات تفاعلية مبنية على بيانات العائلة لاختبار المعرفة بتاريخ وأفراد العائلة." },
    { id: "virtual-cemetery", category: "heritage", label: "المزارات التذكارية والمقابر", icon: Landmark, description: "توثيق أماكن الدفن رقمياً مع إتاحة مساحة افتراضية للدعاء وكتابة الرثاء في ذكرى الراحلين." }
  ];

  // Landing Page View
  if (!activeTab) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-50/30" style={{ direction: 'rtl' }}>
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-100">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <button 
              onClick={() => navigate('/tree')} 
              className="p-2 hover:bg-brand-50 rounded-full transition-colors text-brand-700"
              title="العودة لشجرة العائلة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-brand-900 font-serif">ميزات الشجرة المتقدمة</h1>
              <p className="text-brand-600 text-sm">استكشف تاريخ عائلتك بطرق مبتكرة وتفاعلية</p>
            </div>
          </div>
        </div>

        <div className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-brand-600 font-serif leading-relaxed drop-shadow-sm max-w-5xl mx-auto">
              أحلام "حارس العرين" القابلة للتطوير والتنفيذ بواسطة "المايسترو المدلل"
            </h2>
          </div>

          {/* Tree Builder Pro */}
          <div className="mb-16 max-w-5xl mx-auto px-4">
            <div className="relative group overflow-hidden rounded-3xl border border-emerald-200 shadow-xl bg-gradient-to-br from-emerald-50 to-white p-1">
              <div className="absolute inset-0 bg-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="bg-white/80 backdrop-blur-sm rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative z-10 border border-emerald-50/50">
                <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-200">
                  <TreeDeciduous className="w-12 h-12" />
                </div>
                <div className="flex-1 text-center md:text-right">
                  <div className="inline-block px-3 py-1 mb-3 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold tracking-wide border border-emerald-200">
                    الأساس والنواة
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-teal-700 mb-4 font-serif">
                    جذور وأغصان العائلة: المنصة الذكية لبناء الشجرة
                  </h2>
                  <p className="text-lg text-emerald-800/80 leading-relaxed font-medium">
                    محرك مرئي متطور يمنحك السيطرة الكاملة لتصميم، تعديل، وتوسيع شجرة عائلتك بمرونة فائقة. يدعم السحب والإفلات، استيراد السجلات الضخمة، والتعرف التلقائي على التكرار لبناء قاعدة بيانات دقيقة ومترابطة مهما بلغ حجم العائلة.
                  </p>
                </div>
                <div className="w-full md:w-auto">
                  <button 
                    onClick={() => navigate('/TreeFeatures?tab=tree-builder-platform')}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-emerald-500/25"
                  >
                    <span>إعرف المزيد</span>
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-16 pb-8">
            {categoriesConfig.map((category) => {
              if (category.id === 'tree-builder') return null;
              
              const theme = themeStyles[category.theme];
              const CategoryIcon = category.icon;
              const categoryTabs = tabs.filter(t => t.category === category.id);
              
              if (categoryTabs.length === 0) return null;

              return (
                <div key={category.id} className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} rounded-3xl border ${theme.border} shadow-inner transform -skew-y-1`}></div>
                  <div className={`relative bg-white/80 backdrop-blur-sm rounded-3xl border ${theme.border} shadow-xl p-8 md:p-10`}>
                    <div className="text-center mb-10">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${theme.bg} ${theme.text} mb-4 shadow-sm border ${theme.border}`}>
                        <CategoryIcon className="w-8 h-8" />
                      </div>
                      <h2 className={`text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.title} mb-4 font-serif`}>
                        {category.title}
                      </h2>
                      <p className={`text-lg opacity-80 ${theme.text} max-w-2xl mx-auto font-medium leading-relaxed`}>
                        {category.desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                      {categoryTabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => navigate(`/TreeFeatures?tab=${tab.id}`)}
                            className={`group flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center h-full relative overflow-hidden ${theme.hover}`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            <div className={`relative z-10 w-16 h-16 bg-gradient-to-br ${theme.iconBg} rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 duration-300 shadow-inner border border-white group-hover:${theme.border}`}>
                              <Icon className="w-8 h-8 drop-shadow-sm" />
                            </div>
                            <h3 className={`relative z-10 font-bold text-gray-800 group-hover:${theme.text} transition-colors text-[14px] md:text-[15px] leading-snug`}>
                              {tab.label}
                            </h3>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Block */}
          <div className="mt-16 mb-8 text-center border-t border-brand-100 pt-16 px-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-brand-600 mb-8 font-serif leading-relaxed drop-shadow-sm max-w-5xl mx-auto flex flex-col items-center gap-2">
              <span>أحلام "حارس العرين" القابلة للتطوير والتنفيذ بواسطة "المايسترو المدلل"</span>
              <span className="text-sm md:text-base opacity-80 font-bold text-gray-900 drop-shadow-none">بإعتبار ماسيكون</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://docs.google.com/spreadsheets/d/1DOfanlArfA04y9haLAXesykIL0d2ApxGY_-lqF93MN4/edit?gid=1282448457#gid=1282448457"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-center"
              >
                أضف حلم جديد
              </a>
              <a 
                href="https://docs.google.com/spreadsheets/d/1DOfanlArfA04y9haLAXesykIL0d2ApxGY_-lqF93MN4/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-600 rounded-xl font-bold text-lg shadow-md hover:bg-emerald-50 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-center"
              >
                رتب أولوية تنفيذ الأحلام
              </a>
            </div>
          </div>
        </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Feature Detail View (Sidebar + Content)
  return (
    <div className="min-h-screen flex flex-col bg-brand-50/30" style={{ direction: 'rtl' }}>
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/TreeFeatures')}
            className="p-2 hover:bg-brand-50 rounded-full transition-colors text-brand-700"
            title="العودة إلى ميزات الشجرة المتقدمة"
          >
            <Home className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-brand-900 font-serif">ميزات الشجرة المتقدمة</h1>
            <p className="text-brand-600 text-sm">استكشف تاريخ عائلتك بطرق مبتكرة وتفاعلية</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 flex-grow w-full py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-72 flex-shrink-0 bg-white rounded-2xl p-3 shadow-sm border border-brand-100 h-fit max-h-[80vh] overflow-y-auto custom-scrollbar">
          <nav className="space-y-6">
            {categoriesConfig.map((category) => {
              const categoryTabs = tabs.filter(t => t.category === category.id);
              if (categoryTabs.length === 0) return null;
              const theme = themeStyles[category.theme];
              
              return (
                <div key={category.id}>
                  <h4 className={`text-xs font-bold ${theme.text} mb-2 px-3 uppercase tracking-wider`}>{category.title}</h4>
                  <div className="space-y-1">
                    {categoryTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => navigate(`/TreeFeatures?tab=${tab.id}`)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                            isActive 
                              ? `${theme.bg} ${theme.text} shadow-sm border ${theme.border}` 
                              : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                          }`}
                        >
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? theme.text.replace('text-', 'text-') : 'text-gray-400'}`} />
                          <span className="truncate text-right w-full">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-brand-100 p-8 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-50 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-brand-50 rounded-full opacity-50 blur-3xl pointer-events-none"></div>

          {isLoading ? (
            <div className="text-brand-400 flex flex-col items-center gap-2 relative z-10">
              <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
              <p>جاري التحميل...</p>
            </div>
          ) : (
            <div className="text-center max-w-lg relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100/50 shadow-sm">
                {tabs.find(t => t.id === activeTab) && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { className: "w-12 h-12 text-emerald-600 drop-shadow-sm" })}
              </div>
              
              {activeTab !== "tree-builder-platform" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-xs font-medium mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  هذه الميزة قيد التطوير وستظهر للنور قريباً
                </div>
              )}

              <h2 className="text-3xl font-bold text-brand-900 mb-4 font-serif">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              
              <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-6 text-right shadow-sm">
                <h3 className="text-sm font-bold text-brand-800 mb-2">ماذا ستقدم هذه الميزة؟</h3>
                <div className="text-brand-700 leading-relaxed text-lg">
                  {tabs.find(t => t.id === activeTab)?.description}
                </div>
              </div>

              {activeTab === "tree-builder-platform" ? (
                <button 
                  onClick={() => navigate('/Tree')}
                  className="mt-8 px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all w-full sm:w-auto"
                >
                  ابدأ البناء
                </button>
              ) : (
                <button className="mt-8 px-6 py-2.5 bg-white border-2 border-brand-200 text-brand-700 rounded-xl font-medium hover:bg-brand-50 hover:border-brand-300 transition-all shadow-sm">
                  أعلمني عند الإطلاق
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
      <MinimalFooter />
    </div>
  );
}
