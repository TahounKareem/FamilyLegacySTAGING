import React, { useState, useEffect } from 'react';
import { X, User, Calendar, MapPin, Briefcase, FileText, Camera, Plus, Trash2, Tag, Book, Image as ImageIcon, CheckSquare } from 'lucide-react';
import type { FamilyMember, FamilyEvent, FamilyMedia } from '../../types/familyTree';

interface MemberEditorProps {
  member: FamilyMember | null;
  onSave: (member: FamilyMember) => void;
  onClose: () => void;
}

export function MemberEditor({ member, onSave, onClose }: MemberEditorProps) {
  const [formData, setFormData] = useState<FamilyMember | null>(null);

  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        titles: member.titles || [],
        languages: member.languages || [],
        events: member.events || [],
        media: member.media || []
      });
    } else {
      setFormData(null);
    }
  }, [member]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => prev ? ({ ...prev, [name]: checked }) : null);
    } else {
      setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
    }
  };

  const handleArrayChange = (field: 'titles' | 'languages', index: number, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'titles' | 'languages') => {
    setFormData(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: [...(prev[field] || []), ''] };
    });
  };

  const removeArrayItem = (field: 'titles' | 'languages', index: number) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newArray = [...(prev[field] || [])];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleEventChange = (index: number, field: keyof FamilyEvent, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newEvents = [...(prev.events || [])];
      newEvents[index] = { ...newEvents[index], [field]: value };
      return { ...prev, events: newEvents };
    });
  };

  const addEvent = () => {
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        events: [...(prev.events || []), { id: Math.random().toString(), date: '', type: 'أخرى', title: '' }]
      };
    });
  };

  const removeEvent = (index: number) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newEvents = [...(prev.events || [])];
      newEvents.splice(index, 1);
      return { ...prev, events: newEvents };
    });
  };

  const handleMediaChange = (index: number, field: keyof FamilyMedia, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newMedia = [...(prev.media || [])];
      newMedia[index] = { ...newMedia[index], [field]: value };
      return { ...prev, media: newMedia };
    });
  };

  const addMedia = () => {
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        media: [...(prev.media || []), { id: Math.random().toString(), url: '', title: '', description: '', type: 'image' }]
      };
    });
  };

  const removeMedia = (index: number) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newMedia = [...(prev.media || [])];
      newMedia.splice(index, 1);
      return { ...prev, media: newMedia };
    });
  };

  const handleSave = () => {
    if (formData && formData.firstName.trim()) {
      onSave(formData);
    } else {
      alert("الاسم الأول مطلوب لحفظ البيانات");
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-[450px] bg-white shadow-2xl border-r border-brand-200 flex flex-col z-50 transform transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b border-brand-100 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-900 font-serif">بيانات الفرد</h2>
        <button onClick={onClose} className="p-2 hover:bg-brand-200 rounded-full transition-colors">
          <X className="w-5 h-5 text-brand-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-brand-100 border-2 border-brand-200 flex items-center justify-center relative overflow-hidden group cursor-pointer">
            {formData.photoUrl ? (
              <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-brand-400" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-xs text-brand-500 mt-2">انقر لتغيير الصورة</span>
        </div>

        {/* Basic Info */}
        <div className="bg-white border border-brand-100 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-brand-800 flex items-center gap-2 border-b border-brand-50 pb-2">
            <User className="w-4 h-4 text-brand-500" />
            المعلومات الأساسية
          </h3>
          
          <div>
            <label className="block text-xs font-medium text-brand-700 mb-1">الاسم الأول <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500"
              placeholder="الاسم الأول"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-brand-700">الألقاب (تظهر بين أقواس)</label>
              <button onClick={() => addArrayItem('titles')} className="text-xs text-brand-600 flex items-center hover:text-brand-800">
                <Plus className="w-3 h-3 mr-1" /> إضافة لقب
              </button>
            </div>
            <div className="space-y-2">
              {(formData.titles || []).map((title, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleArrayChange('titles', idx, e.target.value)}
                    className="flex-1 border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500"
                    placeholder="مثال: الباشا، الدكتور..."
                  />
                  <button onClick={() => removeArrayItem('titles', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!formData.titles || formData.titles.length === 0) && (
                <div className="text-xs text-gray-400 text-center py-2 border border-dashed border-gray-200 rounded-lg">لا يوجد ألقاب مضافة</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-700 mb-1">الكنية (تظهر بين أقواس معقوفة)</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname || ''}
              onChange={handleChange}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500"
              placeholder="مثال: أبو محمد"
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-2 border-t border-brand-50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="noDescendants" checked={formData.noDescendants || false} onChange={handleChange} className="text-brand-600 focus:ring-brand-500 rounded" />
              <span className="text-sm text-gray-700">لم يعقب</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="femaleDominated" checked={formData.femaleDominated || false} onChange={handleChange} className="text-brand-600 focus:ring-brand-500 rounded" />
              <span className="text-sm text-gray-700">ميناث</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isFamous" checked={formData.isFamous || false} onChange={handleChange} className="text-brand-600 focus:ring-brand-500 rounded" />
              <span className="text-sm text-gray-700">من المشاهير والأعلام</span>
            </label>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-white border border-brand-100 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-brand-800 flex items-center gap-2 border-b border-brand-50 pb-2">
            <Tag className="w-4 h-4 text-brand-500" />
            البيانات الشخصية
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-700 mb-1">الجنس</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500">
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
                <option value="unknown">غير محدد</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-700 mb-1">الدين</label>
              <input type="text" name="religion" value={formData.religion || ''} onChange={handleChange} className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" placeholder="الدين" />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-700 mb-1">العرق</label>
              <input type="text" name="ethnicity" value={formData.ethnicity || ''} onChange={handleChange} className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" placeholder="العرق" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-brand-700">اللغات</label>
              <button onClick={() => addArrayItem('languages')} className="text-xs text-brand-600 flex items-center hover:text-brand-800">
                <Plus className="w-3 h-3 mr-1" /> إضافة لغة
              </button>
            </div>
            <div className="space-y-2">
              {(formData.languages || []).map((lang, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={lang}
                    onChange={(e) => handleArrayChange('languages', idx, e.target.value)}
                    className="flex-1 border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500"
                    placeholder="مثال: العربية، الإنجليزية"
                  />
                  <button onClick={() => removeArrayItem('languages', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-brand-700 mb-1">المهنة</label>
            <input type="text" name="profession" value={formData.profession || ''} onChange={handleChange} className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" placeholder="المهنة" />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-700 mb-1">مكان الميلاد / الإقامة</label>
            <input type="text" name="birthPlace" value={formData.birthPlace || ''} onChange={handleChange} className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" placeholder="المدينة، الدولة" />
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white border border-brand-100 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-brand-800 flex items-center gap-2 border-b border-brand-50 pb-2">
            <Calendar className="w-4 h-4 text-brand-500" />
            التواريخ
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-700 mb-1">تاريخ الميلاد</label>
              <input type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleChange} className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-700 mb-1">تاريخ الوفاة</label>
              <input type="date" name="deathDate" value={formData.deathDate || ''} onChange={handleChange} className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" />
            </div>
          </div>
        </div>

        {/* Important Events */}
        <div className="bg-white border border-brand-100 rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-brand-50 pb-2">
            <h3 className="text-sm font-bold text-brand-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-brand-500" />
              أحداث هامة
            </h3>
            <button onClick={addEvent} className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded hover:bg-brand-100 transition-colors flex items-center">
              <Plus className="w-3 h-3 mr-1" /> إضافة حدث
            </button>
          </div>
          
          <div className="space-y-4">
            {(formData.events || []).map((ev, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 relative group">
                <button onClick={() => removeEvent(idx)} className="absolute top-2 left-2 p-1 bg-white text-red-500 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">التاريخ</label>
                    <input type="date" value={ev.date} onChange={(e) => handleEventChange(idx, 'date', e.target.value)} className="w-full text-xs border border-gray-300 rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">نوع الحدث</label>
                    <select value={ev.type} onChange={(e) => handleEventChange(idx, 'type', e.target.value)} className="w-full text-xs border border-gray-300 rounded px-2 py-1">
                      <option value="زواج">زواج</option>
                      <option value="تخرج">تخرج</option>
                      <option value="هجرة">هجرة</option>
                      <option value="ميلاد طفل">ميلاد طفل</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">عنوان / تفاصيل الحدث</label>
                  <input type="text" value={ev.title} onChange={(e) => handleEventChange(idx, 'title', e.target.value)} placeholder="وصف الحدث..." className="w-full text-xs border border-gray-300 rounded px-2 py-1" />
                </div>
              </div>
            ))}
            {(!formData.events || formData.events.length === 0) && (
              <div className="text-xs text-gray-400 text-center py-4">لا توجد أحداث هامة مسجلة</div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white border border-brand-100 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-brand-800 flex items-center gap-2 border-b border-brand-50 pb-2">
            <FileText className="w-4 h-4 text-brand-500" />
            نبذة تعريفية
          </h3>
          <textarea
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            rows={4}
            className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 resize-none"
            placeholder="معلومات إضافية أو قصة قصيرة عن الفرد..."
          />
        </div>

        {/* Media */}
        <div className="bg-white border border-brand-100 rounded-xl p-4 shadow-sm space-y-4 mb-4">
          <div className="flex items-center justify-between border-b border-brand-50 pb-2">
            <h3 className="text-sm font-bold text-brand-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-brand-500" />
              الوسائط المرفقة
            </h3>
            <button onClick={addMedia} className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded hover:bg-brand-100 transition-colors flex items-center">
              <Plus className="w-3 h-3 mr-1" /> إضافة وسيطة
            </button>
          </div>
          
          <div className="space-y-4">
            {(formData.media || []).map((med, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 relative group">
                <button onClick={() => removeMedia(idx)} className="absolute top-2 left-2 p-1 bg-white text-red-500 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">نوع الوسيطة</label>
                    <select value={med.type} onChange={(e) => handleMediaChange(idx, 'type', e.target.value as any)} className="w-full text-xs border border-gray-300 rounded px-2 py-1">
                      <option value="image">صورة</option>
                      <option value="document">مستند</option>
                      <option value="audio">مقطع صوتي</option>
                      <option value="video">مقطع فيديو</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">العنوان</label>
                    <input type="text" value={med.title} onChange={(e) => handleMediaChange(idx, 'title', e.target.value)} placeholder="عنوان الوسيطة" className="w-full text-xs border border-gray-300 rounded px-2 py-1" />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-[10px] text-gray-500 mb-1">رابط الملف / URL (أو قم برفع الملف)</label>
                  <input type="text" value={med.url} onChange={(e) => handleMediaChange(idx, 'url', e.target.value)} placeholder="https://..." className="w-full text-xs border border-gray-300 rounded px-2 py-1" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">وصف</label>
                  <input type="text" value={med.description} onChange={(e) => handleMediaChange(idx, 'description', e.target.value)} placeholder="وصف قصير للوسيطة..." className="w-full text-xs border border-gray-300 rounded px-2 py-1" />
                </div>
              </div>
            ))}
            {(!formData.media || formData.media.length === 0) && (
              <div className="text-xs text-gray-400 text-center py-4">لا توجد وسائط مرفقة</div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-brand-100 bg-brand-50 flex gap-3 mt-auto">
        <button
          onClick={handleSave}
          className="flex-1 bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
        >
          حفظ التغييرات
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-white text-brand-700 border border-brand-200 py-2 rounded-lg hover:bg-brand-50 transition-colors font-medium text-sm"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}

