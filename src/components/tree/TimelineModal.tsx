import React from 'react';
import { X, Calendar, MapPin, Briefcase, Info, Tag } from 'lucide-react';
import type { FamilyMember } from '../../types/familyTree';

interface TimelineModalProps {
  members: FamilyMember[];
  onClose: () => void;
}

interface TimelineItem {
  id: string;
  date: Date;
  dateStr: string;
  type: 'birth' | 'death' | 'event';
  title: string;
  memberId: string;
  memberName: string;
  details?: string;
}

export function TimelineModal({ members, onClose }: TimelineModalProps) {
  // Aggregate all events
  const timelineItems: TimelineItem[] = [];

  members.forEach(m => {
    const fullName = `${m.firstName} ${m.lastName || ''}`.trim();

    if (m.birthDate) {
      timelineItems.push({
        id: `birth-${m.id}`,
        date: new Date(m.birthDate),
        dateStr: m.birthDate,
        type: 'birth',
        title: 'ميلاد',
        memberId: m.id,
        memberName: fullName,
        details: m.birthPlace ? `في ${m.birthPlace}` : undefined
      });
    }

    if (m.deathDate) {
      timelineItems.push({
        id: `death-${m.id}`,
        date: new Date(m.deathDate),
        dateStr: m.deathDate,
        type: 'death',
        title: 'وفاة',
        memberId: m.id,
        memberName: fullName
      });
    }

    if (m.events && m.events.length > 0) {
      m.events.forEach(ev => {
        if (ev.date) {
          timelineItems.push({
            id: `event-${m.id}-${ev.id}`,
            date: new Date(ev.date),
            dateStr: ev.date,
            type: 'event',
            title: ev.type,
            memberId: m.id,
            memberName: fullName,
            details: ev.title
          });
        }
      });
    }
  });

  // Sort chronologically
  timelineItems.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-4xl max-h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-brand-100 bg-brand-50">
          <h2 className="text-2xl font-bold text-brand-900 font-serif flex items-center gap-3">
            <Calendar className="w-6 h-6 text-brand-600" />
            الخط الزمني للعائلة
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-brand-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {timelineItems.length === 0 ? (
            <div className="text-center py-20 text-brand-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">لا توجد أحداث زمنية مسجلة بعد.</p>
              <p className="text-sm mt-2">قم بإضافة تواريخ الميلاد أو الوفاة أو الأحداث الهامة للأفراد لتبدأ في بناء الخط الزمني.</p>
            </div>
          ) : (
            <div className="relative border-r-2 border-brand-200 pr-6 mr-4 space-y-8">
              {timelineItems.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -right-[31px] w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                    item.type === 'birth' ? 'bg-green-500' : 
                    item.type === 'death' ? 'bg-red-500' : 
                    'bg-brand-500'
                  }`} />
                  
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-brand-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                      <span className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full font-mono">
                        {item.date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        item.type === 'birth' ? 'bg-green-50 text-green-700' : 
                        item.type === 'death' ? 'bg-red-50 text-red-700' : 
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {item.title}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-brand-900 mb-1">{item.memberName}</h3>
                    
                    {item.details && (
                      <p className="text-brand-700 text-sm flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-brand-400" />
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
