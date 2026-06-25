import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowRight, Clock, Map, PieChart, Book, Image as ImageIcon, BookOpen, HeartPulse } from "lucide-react";
import { useAppStore } from "../lib/store";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function TreeFeatures() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppStore(state => state.currentUser);
  const [activeTab, setActiveTab] = useState("timeline");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    // محاكاة تحميل بيانات الشجرة أو التحقق من وجودها
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentUser?.id]);

  const tabs = [
    { id: "timeline", label: "الخط الزمني", icon: Clock },
    { id: "map", label: "الخريطة التفاعلية ومسارات الهجرة", icon: Map },
    { id: "analytics", label: "لوحة التحليلات والإحصائيات", icon: PieChart },
    { id: "book", label: "إنشاء كتاب العائلة للطباعة", icon: Book },
    { id: "media", label: "معرض الوسائط المجمع", icon: ImageIcon },
    { id: "story", label: "قصة قصيرة أو سيرة ذاتية أدبية", icon: BookOpen },
    { id: "medical", label: "التاريخ الطبي والوراثي", icon: HeartPulse },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-100">
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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-2xl p-3 shadow-sm border border-brand-100 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm' 
                      : 'text-brand-700 hover:bg-brand-50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-brand-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-brand-100 p-8 min-h-[500px] flex items-center justify-center">
          {isLoading ? (
            <div className="text-brand-400 flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
              <p>جاري تحميل البيانات...</p>
            </div>
          ) : (
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                {tabs.find(t => t.id === activeTab) && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { className: "w-10 h-10 text-emerald-600" })}
              </div>
              <h2 className="text-2xl font-bold text-brand-900 mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-brand-600 leading-relaxed">
                هذه المساحة مخصصة لعرض {tabs.find(t => t.id === activeTab)?.label}. سيتم تطوير التفاصيل والوظائف الخاصة بهذا القسم قريباً.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
