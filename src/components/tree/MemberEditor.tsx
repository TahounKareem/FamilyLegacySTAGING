import React, { useState, useEffect } from 'react';
import { X, User, Calendar, MapPin, Briefcase, FileText, Camera } from 'lucide-react';
import type { FamilyMember } from '../../types/familyTree';

interface MemberEditorProps {
  member: FamilyMember | null;
  onSave: (member: FamilyMember) => void;
  onClose: () => void;
}

export function MemberEditor({ member, onSave, onClose }: MemberEditorProps) {
  const [formData, setFormData] = useState<FamilyMember | null>(null);

  useEffect(() => {
    setFormData(member);
  }, [member]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-96 bg-white shadow-2xl border-r border-brand-200 flex flex-col z-50 transform transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b border-brand-100 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-900 font-serif">بيانات الفرد</h2>
        <button onClick={onClose} className="p-2 hover:bg-brand-200 rounded-full transition-colors">
          <X className="w-5 h-5 text-brand-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">الاسم الأول</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">اسم العائلة / اللقب</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">الجنس</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
              <option value="unknown">غير محدد</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-4 pt-4 border-t border-brand-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-brand-500" />
                تاريخ الميلاد
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate || ''}
                onChange={handleChange}
                className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-brand-500" />
                تاريخ الوفاة
              </label>
              <input
                type="date"
                name="deathDate"
                value={formData.deathDate || ''}
                onChange={handleChange}
                className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4 pt-4 border-t border-brand-100">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-brand-500" />
              مكان الميلاد / الإقامة
            </label>
            <input
              type="text"
              name="birthPlace"
              value={formData.birthPlace || ''}
              onChange={handleChange}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
              placeholder="مثال: القاهرة، مصر"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1 flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-brand-500" />
              المهنة
            </label>
            <input
              type="text"
              name="profession"
              value={formData.profession || ''}
              onChange={handleChange}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
              placeholder="مثال: طبيب، مهندس، تاجر"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1 flex items-center gap-1">
              <FileText className="w-4 h-4 text-brand-500" />
              نبذة تعريفية
            </label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              rows={4}
              className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white resize-none"
              placeholder="معلومات إضافية أو قصة قصيرة عن الفرد..."
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-brand-100 bg-brand-50 flex gap-3">
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
