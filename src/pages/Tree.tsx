import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { AdvancedTreeBuilder } from "../components/tree/AdvancedTreeBuilder";
import { Save, Loader2, Download, Upload, Clock, Trees, MoreVertical, Map, PieChart, Book, Image as ImageIcon, BookOpen, HeartPulse } from "lucide-react";
import { useAppStore } from "../lib/store";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as htmlToImage from 'html-to-image';

export function Tree() {
  const navigate = useNavigate();
  const currentUser = useAppStore(state => state.currentUser);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadTree = async () => {
      if (!currentUser?.id) {
        setIsLoading(false);
        return;
      }
      try {
        const treeDoc = await getDoc(doc(db, "familyTrees", currentUser.id));
        if (treeDoc.exists()) {
          const data = treeDoc.data();
          if (data.nodes) setNodes(data.nodes);
          if (data.edges) setEdges(data.edges);
        }
      } catch (error) {
        console.error("Error loading tree:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTree();
  }, [currentUser?.id]);

  const handleSave = async () => {
    if (!currentUser?.id) {
      alert("يجب تسجيل الدخول لحفظ الشجرة");
      return;
    }
    
    setIsSaving(true);
    try {
      await setDoc(doc(db, "familyTrees", currentUser.id), {
        nodes,
        edges,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      alert("تم حفظ الشجرة بنجاح في قاعدة البيانات");
    } catch (error) {
      console.error("Error saving tree:", error);
      alert("حدث خطأ أثناء حفظ الشجرة");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportImage = async () => {
    if (!treeContainerRef.current) return;
    setIsExporting(true);
    try {
      const element = treeContainerRef.current.querySelector('.react-transform-component') as HTMLElement || treeContainerRef.current;
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        backgroundColor: '#f6f6f6',
        style: {
          transform: 'scale(1)', 
          transformOrigin: 'top left'
        }
      });
      
      const link = document.createElement('a');
      link.download = 'شجرة-العائلة.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
      alert('حدث خطأ أثناء تصدير الصورة');
    } finally {
      setIsExporting(false);
    }
  };

  const generateGedcom = () => {
    let gedcom = `0 HEAD\n1 SOUR FamilyLegacy\n1 CHAR UTF-8\n`;
    nodes.forEach(m => {
      gedcom += `0 @I${m.id}@ INDI\n`;
      gedcom += `1 NAME ${m.firstName} /${m.lastName || ''}/\n`;
      if (m.gender === 'male') gedcom += `1 SEX M\n`;
      else if (m.gender === 'female') gedcom += `1 SEX F\n`;
      if (m.birthDate) {
        gedcom += `1 BIRT\n2 DATE ${m.birthDate}\n`;
        if (m.birthPlace) gedcom += `2 PLAC ${m.birthPlace}\n`;
      }
      if (m.deathDate) {
        gedcom += `1 DEAT\n2 DATE ${m.deathDate}\n`;
      }
      if (m.bio) gedcom += `1 NOTE ${m.bio.replace(/\n/g, ' ')}\n`;
    });
    // Add basic FAM structures for relations if needed (simplified for now)
    gedcom += `0 TRLR\n`;
    
    const blob = new Blob([gedcom], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'family-tree.ged';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportGedcom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      alert('جاري تطوير خوارزمية استيراد ملفات GEDCOM بالكامل. هذه ميزة تجريبية.');
      // Full GEDCOM parsing logic is complex and will be implemented iteratively.
      // For now, just acknowledging the upload.
      console.log("GEDCOM Uploaded", content.substring(0, 100));
    };
    reader.readAsText(file);
    // reset
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-50 pt-24 pb-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-900 font-serif mb-2">منشئ شجرة العائلة (النسخة المطورة)</h1>
            <p className="text-brand-700">هذه نسخة تجريبية لتطوير وتحسين واجهة بناء شجرة العائلة.</p>
          </div>
          <div className="flex gap-2 flex-wrap items-center relative" ref={menuRef}>
            <input type="file" accept=".ged" className="hidden" ref={fileInputRef} onChange={handleImportGedcom} />
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50 text-sm font-medium"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ الشجرة
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center justify-center gap-1 px-5 py-3 text-white transition-all shadow-sm font-medium border-2 border-emerald-500/30 bg-gradient-to-br from-[#bef264] to-[#16a34a] hover:from-[#a3e635] hover:to-[#15803d]"
              style={{ 
                borderRadius: '0 24px 0 24px', 
                boxShadow: 'inset 2px 2px 6px rgba(255,255,255,0.4), inset -2px -2px 6px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.15)' 
              }}
              title="ميزات إضافية"
            >
              <Trees className="w-7 h-7 drop-shadow-md text-emerald-900" />
              <MoreVertical className="w-5 h-5 drop-shadow-md text-emerald-900" />
            </button>
            
            {showMenu && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-xl shadow-xl border border-brand-100 py-2 z-50 overflow-hidden flex flex-col">
                <button onClick={() => { handleExportImage(); setShowMenu(false); }} disabled={isExporting || nodes.length === 0} className="w-full text-right px-4 py-2 hover:bg-brand-50 text-sm flex items-center gap-2 text-brand-700">
                  <ImageIcon className="w-4 h-4" /> تصدير صورة
                </button>
                <button onClick={() => { fileInputRef.current?.click(); setShowMenu(false); }} className="w-full text-right px-4 py-2 hover:bg-brand-50 text-sm flex items-center gap-2 text-brand-700">
                  <Upload className="w-4 h-4" /> إستيراد GEDCOM
                </button>
                <button onClick={() => { generateGedcom(); setShowMenu(false); }} disabled={nodes.length === 0} className="w-full text-right px-4 py-2 hover:bg-brand-50 text-sm flex items-center gap-2 text-brand-700">
                  <Download className="w-4 h-4" /> تصدير GEDCOM
                </button>
                
                <div className="h-px bg-brand-100 my-1"></div>
                
                <button onClick={() => { setShowMenu(false); navigate('/TreeFeatures?tab=timeline'); }} className="w-full text-right px-4 py-2 hover:bg-brand-50 text-sm flex items-center gap-2 text-brand-700">
                  <Clock className="w-4 h-4" /> الخط الزمني
                </button>
                <button onClick={() => { setShowMenu(false); navigate('/TreeFeatures?tab=map'); }} className="w-full text-right px-4 py-2 hover:bg-brand-50 text-sm flex items-center gap-2 text-brand-700">
                  <Map className="w-4 h-4" /> الخريطة التفاعلية ومسارات الهجرة
                </button>
                <button onClick={() => { setShowMenu(false); navigate('/TreeFeatures?tab=analytics'); }} className="w-full text-right px-4 py-2 hover:bg-brand-50 text-sm flex items-center gap-2 text-brand-700">
                  <PieChart className="w-4 h-4" /> لوحة التحليلات والإحصائيات
                </button>
                <button onClick={() => { setShowMenu(false); navigate('/TreeFeatures?tab=book'); }} className="w-full text-right px-4 py-2 hover:bg-brand-50 text-sm flex items-center gap-2 text-brand-700">
                  <Book className="w-4 h-4" /> إنشاء "كتاب العائلة" للطباعة
                </button>
                <button onClick={() => { setShowMenu(false); navigate('/TreeFeatures?tab=media'); }} className="w-full text-right px-4 py-2 hover:bg-brand-50 text-sm flex items-center gap-2 text-brand-700">
                  <ImageIcon className="w-4 h-4" /> معرض الوسائط المجمع
                </button>
                <button onClick={() => { setShowMenu(false); navigate('/TreeFeatures?tab=story'); }} className="w-full text-right px-4 py-2 hover:bg-brand-50 text-sm flex items-center gap-2 text-brand-700">
                  <BookOpen className="w-4 h-4" /> قصة قصيرة أو سيرة ذاتية أدبية
                </button>
                <button onClick={() => { setShowMenu(false); navigate('/TreeFeatures?tab=medical'); }} className="w-full text-right px-4 py-2 hover:bg-brand-50 text-sm flex items-center gap-2 text-brand-700">
                  <HeartPulse className="w-4 h-4" /> التاريخ الطبي والوراثي
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-brand-100 p-6" ref={treeContainerRef}>
          <AdvancedTreeBuilder 
            initialNodes={nodes} 
            initialEdges={edges}
            onChange={(newNodes, newEdges) => {
              setNodes(newNodes);
              setEdges(newEdges);
            }}
          />
        </div>
      </div>
    </div>
  );
}
