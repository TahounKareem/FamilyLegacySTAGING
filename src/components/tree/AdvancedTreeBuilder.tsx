import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit2, ZoomIn, ZoomOut, Maximize, User, Users, LayoutGrid, Leaf } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MemberEditor } from "./MemberEditor";
import type { FamilyMember, FamilyRelation } from "../../types/familyTree";

interface AdvancedTreeBuilderProps {
  initialNodes?: any[];
  initialEdges?: any[];
  onChange?: (nodes: any[], edges: any[]) => void;
  readOnly?: boolean;
  familyName?: string;
}

export function AdvancedTreeBuilder({ initialNodes = [], initialEdges = [], onChange, readOnly = false, familyName }: AdvancedTreeBuilderProps) {
  // Convert initial props to our typed versions
  const [members, setMembers] = useState<FamilyMember[]>(
    initialNodes.length 
      ? initialNodes.map(n => ({
          id: n.id,
          firstName: n.firstName || (n.name ? n.name.split(' ')[0] : 'بدون اسم') || 'بدون اسم',
          lastName: n.lastName || (n.name ? n.name.split(' ').slice(1).join(' ') : '') || '',
          gender: n.gender || 'unknown',
          birthDate: n.birthDate,
          deathDate: n.deathDate,
          photoUrl: n.photoUrl,
          x: n.x || 1500,
          y: n.y || 1500,
        }))
      : [{ id: "root", firstName: familyName || "العائلة", lastName: "", gender: "unknown", x: 1500, y: 1500 }]
  );

  const [relations, setRelations] = useState<FamilyRelation[]>(
    initialEdges.length 
      ? initialEdges.map(e => ({
          id: e.id,
          sourceId: e.sourceId || e.source,
          targetId: e.targetId || e.target,
          type: e.type || 'child'
        }))
      : []
  );

  useEffect(() => {
    if (initialNodes && initialNodes.length > 0) {
      setMembers(initialNodes.map(n => ({
        id: n.id,
        firstName: n.firstName || (n.name ? n.name.split(' ')[0] : 'بدون اسم') || 'بدون اسم',
        lastName: n.lastName || '',
        titles: n.titles || [],
        nickname: n.nickname || '',
        noDescendants: n.noDescendants || false,
        femaleDominated: n.femaleDominated || false,
        isFamous: n.isFamous || false,
        gender: n.gender || 'unknown',
        religion: n.religion || '',
        ethnicity: n.ethnicity || '',
        languages: n.languages || [],
        profession: n.profession || '',
        birthPlace: n.birthPlace || '',
        birthDate: n.birthDate,
        deathDate: n.deathDate,
        events: n.events || [],
        bio: n.bio || '',
        media: n.media || [],
        photoUrl: n.photoUrl,
        x: n.x || 1500,
        y: n.y || 1500,
      })));
    }
  }, [initialNodes]);

  useEffect(() => {
    if (initialEdges && initialEdges.length > 0) {
      setRelations(initialEdges.map(e => ({
        id: e.id,
        sourceId: e.sourceId || e.source,
        targetId: e.targetId || e.target,
        type: e.type || 'child'
      })));
    }
  }, [initialEdges]);

  useEffect(() => {
    if (!initialNodes.length && familyName) {
      setMembers(prev => prev.map(m => m.id === "root" ? { ...m, firstName: familyName } : m));
    }
  }, [familyName, initialNodes.length]);

  const [editingMemberId, setEditingMemberId] = useState<string | null>("root");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>("root");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'traditional' | 'organic'>('organic');

  // Use a ref to track if we're panning to prevent accidental node selection on drag end
  const isPanning = useRef(false);

  const handlePointerDownNode = (e: React.PointerEvent, id: string) => {
    if (readOnly) return;
    // e.stopPropagation(); // Don't stop propagation, let pan pinch handle it if needed, but we disable panning when dragging
    setDraggingId(id);
    setSelectedMemberId(id);
  };

  const handlePointerMoveContainer = (e: React.PointerEvent) => {
    if (readOnly || !draggingId) return;
    
    // Quick approximation for drag (zoom scale makes it complex, ideally we'd use mouse deltas)
    // For simplicity without calculating inverse scale matrix, we update position
    const movementX = e.movementX;
    const movementY = viewMode === 'organic' ? -e.movementY : e.movementY;
    
    // In a real app with zoom, we need to divide movement by current scale
    // We will just do a simple update here
    setMembers(prev => prev.map(m => m.id === draggingId ? { ...m, x: m.x + movementX, y: m.y + movementY } : m));
  };

  const handlePointerUpContainer = () => {
    if (readOnly) return;
    if (draggingId) {
      setDraggingId(null);
      if (onChange) onChange(members as any, relations as any);
    }
  };

  const addRelative = (parentId: string, relationType: 'child' | 'spouse' | 'parent') => {
    const parent = members.find(m => m.id === parentId);
    if (!parent) return;

    const newId = Math.random().toString(36).substring(7);
    
    let dx = 0;
    let dy = 0;
    
    if (relationType === 'child') { dy = 200; }
    if (relationType === 'spouse') { dx = 220; }
    if (relationType === 'parent') { dy = -200; }

    const newMember: FamilyMember = {
      id: newId,
      firstName: "فرد جديد",
      lastName: parent.lastName,
      gender: "unknown",
      x: parent.x + dx,
      y: parent.y + dy
    };
    
    const newRelation: FamilyRelation = {
      id: `${parentId}-${newId}`,
      sourceId: parentId,
      targetId: newId,
      type: relationType
    };

    const newMembers = [...members, newMember];
    const newRelations = [...relations, newRelation];
    
    setMembers(newMembers);
    setRelations(newRelations);
    setSelectedMemberId(newId);
    setEditingMemberId(newId); // Auto open editor
    
    if (onChange) onChange(newMembers as any, newRelations as any);
  };

  const deleteMember = (id: string) => {
    if (id === "root" || readOnly) return;
    const newMembers = members.filter(m => m.id !== id);
    const newRelations = relations.filter(r => r.sourceId !== id && r.targetId !== id);
    setMembers(newMembers);
    setRelations(newRelations);
    setSelectedMemberId(null);
    setEditingMemberId(null);
    if (onChange) onChange(newMembers as any, newRelations as any);
  };

  const handleSaveMember = (updatedMember: FamilyMember) => {
    const newMembers = members.map(m => m.id === updatedMember.id ? updatedMember : m);
    setMembers(newMembers);
    setEditingMemberId(null);
    if (onChange) onChange(newMembers as any, relations as any);
  };

  const editingMember = members.find(m => m.id === editingMemberId) || null;

  return (
    <div className={`relative flex flex-col h-[70vh] border border-brand-200 rounded-2xl overflow-hidden ${viewMode === 'organic' ? 'bg-gradient-to-b from-[#e8f3ed] to-[#d4e4da]' : 'bg-brand-50'}`} style={{ direction: 'ltr' }}>
      {/* LTR for Canvas coordinates, content inside nodes will be RTL */}
      
      {/* Background Pattern for Organic Mode */}
      {viewMode === 'organic' && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)]"></div>
          <div className="absolute w-full h-full" style={{ backgroundImage: 'radial-gradient(#2f855a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
      )}
      
      <TransformWrapper
        initialScale={0.48}
        minScale={0.1}
        maxScale={4}
        centerOnInit={true}
        panning={{ disabled: draggingId !== null }}
        onPanningStart={() => isPanning.current = true}
        onPanningStop={() => {
          setTimeout(() => isPanning.current = false, 100);
        }}
      >
        {({ zoomIn, zoomOut, resetTransform, centerView }) => (
          <>
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-md border border-brand-100">
              <button onClick={() => setViewMode(prev => prev === 'organic' ? 'traditional' : 'organic')} className="p-2 hover:bg-brand-50 rounded-lg text-brand-700 transition-colors" title="تغيير طريقة العرض">
                {viewMode === 'organic' ? <LayoutGrid className="w-5 h-5 text-emerald-700" /> : <Leaf className="w-5 h-5 text-emerald-600" />}
              </button>
              <div className="h-px bg-brand-100 my-1 mx-1"></div>
              <button onClick={() => zoomIn()} className="p-2 hover:bg-brand-50 rounded-lg text-brand-700 transition-colors" title="تكبير">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button onClick={() => zoomOut()} className="p-2 hover:bg-brand-50 rounded-lg text-brand-700 transition-colors" title="تصغير">
                <ZoomOut className="w-5 h-5" />
              </button>
              <button onClick={() => centerView()} className="p-2 hover:bg-brand-50 rounded-lg text-brand-700 transition-colors" title="توسيط">
                <Maximize className="w-5 h-5" />
              </button>
            </div>

            <div 
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              onPointerMove={handlePointerMoveContainer}
              onPointerUp={handlePointerUpContainer}
              onPointerLeave={handlePointerUpContainer}
            >
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '3000px', height: '3000px', position: 'relative' }}>
                {/* Connections (Edges) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {relations.map(rel => {
                    const source = members.find(m => m.id === rel.sourceId);
                    const target = members.find(m => m.id === rel.targetId);
                    if (!source || !target) return null;

                    const getRenderY = (y: number) => viewMode === 'organic' ? 3000 - y : y;
                    const sX = source.x;
                    const sY = getRenderY(source.y);
                    const tX = target.x;
                    const tY = getRenderY(target.y);
                    
                    const isSpouse = rel.type === 'spouse';
                    
                    if (viewMode === 'organic') {
                      const strokeColor = isSpouse ? '#8b5a2b' : '#6b4423';
                      const strokeWidth = isSpouse ? "3" : "5";
                      const strokeDash = isSpouse ? '5,5' : 'none';
                      const midX = (sX + tX) / 2;
                      const midY = (sY + tY) / 2;
                      
                      if (isSpouse) {
                        return (
                          <g key={rel.id}>
                            <path
                              d={`M ${sX} ${sY} Q ${midX} ${sY - 30} ${tX} ${tY}`}
                              fill="none"
                              stroke="#6b4423"
                              strokeWidth="6"
                              strokeLinecap="round"
                              opacity={0.3}
                            />
                            <path
                              d={`M ${sX} ${sY} Q ${midX} ${sY - 30} ${tX} ${tY}`}
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth={strokeWidth}
                              strokeDasharray={strokeDash}
                              strokeLinecap="round"
                            />
                          </g>
                        );
                      }
                      
                      return (
                        <g key={rel.id}>
                          {/* Trunk Shadow / Thicker base */}
                          <path
                            d={`M ${sX} ${sY} C ${sX} ${midY}, ${tX} ${midY}, ${tX} ${tY}`}
                            fill="none"
                            stroke="#5c4033"
                            strokeWidth={sY > tY ? "12" : "8"}
                            strokeLinecap="round"
                            opacity={0.6}
                          />
                          {/* Trunk Main body */}
                          <path
                            d={`M ${sX} ${sY} C ${sX} ${midY}, ${tX} ${midY}, ${tX} ${tY}`}
                            fill="none"
                            stroke="#8b5a2b"
                            strokeWidth={sY > tY ? "8" : "5"}
                            strokeLinecap="round"
                          />
                          {/* Trunk Highlight */}
                          <path
                            d={`M ${sX} ${sY} C ${sX} ${midY}, ${tX} ${midY}, ${tX} ${tY}`}
                            fill="none"
                            stroke="#a67b5b"
                            strokeWidth={sY > tY ? "3" : "2"}
                            strokeLinecap="round"
                            opacity={0.5}
                          />
                        </g>
                      );
                    } else {
                      const strokeColor = isSpouse ? '#e0b589' : '#a37b54';
                      const strokeDash = isSpouse ? '5,5' : 'none';
                      
                      const startY = sY < tY ? sY + 40 : sY - 40;
                      const endY = tY > sY ? tY - 40 : tY + 40;
                      const midY = (startY + endY) / 2;

                      if (isSpouse) {
                        return (
                          <line
                            key={rel.id}
                            x1={sX} y1={sY}
                            x2={tX} y2={tY}
                            stroke={strokeColor}
                            strokeWidth="3"
                            strokeDasharray={strokeDash}
                          />
                        );
                      }

                      return (
                        <path
                          key={rel.id}
                          d={`M ${sX} ${startY} L ${sX} ${midY} L ${tX} ${midY} L ${tX} ${endY}`}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      );
                    }
                  })}
                </svg>

                {/* Nodes */}
                {members.map(member => {
                  const isSelected = selectedMemberId === member.id;
                  const isRoot = member.id === 'root';
                  
                  const getRenderY = (y: number) => viewMode === 'organic' ? 3000 - y : y;
                  return (
                    <div
                      key={member.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 select-none ${isSelected ? 'z-[60]' : 'z-10'} ${isRoot && viewMode === 'organic' ? 'scale-[1.7]' : ''}`}
                      style={{ left: member.x, top: getRenderY(member.y), direction: 'rtl' }}
                    >
                      <div
                        onPointerDown={(e) => handlePointerDownNode(e, member.id)}
                        onClick={() => {
                          if (!isPanning.current && !readOnly) setSelectedMemberId(member.id);
                        }}
                        style={viewMode === 'organic' ? { 
                          borderRadius: '0 65px 0 65px',
                          boxShadow: isSelected && !readOnly 
                            ? 'inset 2px 2px 8px rgba(255,255,255,0.5), inset -3px -3px 8px rgba(0,0,0,0.3), 0 15px 25px rgba(0,0,0,0.2)' 
                            : 'inset 2px 2px 6px rgba(255,255,255,0.4), inset -2px -2px 6px rgba(0,0,0,0.2), 0 8px 15px rgba(0,0,0,0.1)'
                        } : undefined}
                        className={
                          viewMode === 'organic'
                            ? `relative overflow-hidden flex flex-col items-center justify-center w-40 min-h-[140px] p-3 transition-all duration-300
                               ${isSelected && !readOnly ? 'ring-4 ring-emerald-300 ring-offset-2 ring-offset-transparent bg-gradient-to-br from-[#84cc16] to-[#15803d] z-[60] scale-110' : 'border-2 border-emerald-500/30 bg-gradient-to-br from-[#bef264] to-[#16a34a] hover:from-[#a3e635] hover:to-[#15803d] z-10'}
                               ${readOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`
                            : `flex flex-col items-center justify-center w-40 p-3 rounded-2xl border-2 shadow-sm transition-all duration-200 bg-white
                               ${isSelected && !readOnly ? 'border-brand-600 ring-4 ring-brand-100 z-20' : 'border-brand-200 hover:border-brand-400 z-10'}
                               ${readOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`
                        }
                      >
                        {/* Leaf Veins effect for organic mode */}
                        {viewMode === 'organic' && (
                          <div className="absolute inset-0 pointer-events-none" style={{
                            background: 'linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.15) 49%, rgba(255,255,255,0.15) 51%, transparent 52%), linear-gradient(-45deg, transparent 48%, rgba(0,0,0,0.05) 49%, rgba(0,0,0,0.05) 51%, transparent 52%)'
                          }} />
                        )}
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 overflow-hidden relative z-10
                          ${viewMode === 'organic' ? 'border-2 border-white/40 bg-white/20 shadow-inner backdrop-blur-sm' : ''}
                          ${member.gender === 'male' && viewMode !== 'organic' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''} 
                          ${member.gender === 'female' && viewMode !== 'organic' ? 'bg-pink-50 text-pink-600 border-pink-200' : ''}
                          ${member.gender === 'unknown' && viewMode !== 'organic' ? 'bg-brand-50 text-brand-600 border-brand-200' : ''}
                          ${member.gender === 'male' && viewMode === 'organic' ? 'text-blue-900' : ''} 
                          ${member.gender === 'female' && viewMode === 'organic' ? 'text-pink-900' : ''}
                          ${member.gender === 'unknown' && viewMode === 'organic' ? 'text-emerald-900' : ''}
                          ${viewMode !== 'organic' ? 'border-2' : ''}`}
                        >
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.firstName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        <div className="text-center w-full mt-1 relative z-10">
                          <div className="flex flex-wrap items-center justify-center gap-1 leading-tight">
                            <span 
                              className={`font-bold ${viewMode === 'organic' ? 'text-white text-base tracking-wide drop-shadow-md' : 'text-brand-900 text-sm'}`}
                              style={viewMode === 'organic' ? { textShadow: '1px 1px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8), 0px 2px 4px rgba(0,0,0,0.5)' } : {}}
                            >
                              {member.firstName} {member.lastName}
                            </span>
                            {member.titles && member.titles.length > 0 && (
                              <span className={`text-xs font-medium ${viewMode === 'organic' ? 'text-white drop-shadow-sm' : 'text-brand-600'}`}
                                style={viewMode === 'organic' ? { textShadow: '1px 1px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8)' } : {}}
                              >
                                ({member.titles.join('، ')})
                              </span>
                            )}
                            {member.nickname && (
                              <span className={`text-xs font-bold ${viewMode === 'organic' ? 'text-lime-300 drop-shadow-sm' : 'text-accent'}`}
                                style={viewMode === 'organic' ? { textShadow: '1px 1px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8)' } : {}}
                              >
                                {`{${member.nickname}}`}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                            {member.noDescendants && <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${viewMode === 'organic' ? 'bg-black/20 text-white border-white/20' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>لم يعقب</span>}
                            {member.femaleDominated && <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${viewMode === 'organic' ? 'bg-pink-400/50 text-pink-900 border-pink-500/50' : 'bg-pink-50 text-pink-600 border-pink-200'}`}>ميناث</span>}
                            {member.isDeceased && <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${viewMode === 'organic' ? 'bg-black/20 text-white border-white/20' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>متوفى</span>}
                            {member.isFamous && <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${viewMode === 'organic' ? 'bg-yellow-300/40 text-yellow-900 border-yellow-400/50' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>مشهور</span>}
                          </div>
                          {member.birthDate && (
                            <div className={`text-[10px] mt-1 flex items-center justify-center gap-1 font-mono ${viewMode === 'organic' ? 'text-emerald-900 opacity-80' : 'text-brand-500'}`}>
                              <span>{new Date(member.birthDate).getFullYear()}</span>
                              {member.deathDate && <span> - {new Date(member.deathDate).getFullYear()}</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Floating Actions Menu for Selected Node */}
                      {isSelected && !readOnly && (
                        <div className={`absolute ${viewMode === 'organic' ? '-top-[72px]' : '-bottom-[72px]'} left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white p-1.5 rounded-full shadow-xl border border-brand-100 z-30`} style={{ direction: 'rtl' }}>
                          <button 
                            onPointerDown={(e) => { e.stopPropagation(); addRelative(member.id, 'child'); }} 
                            className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 font-bold shadow-sm ${viewMode === 'organic' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                            title="إضافة ابن/ابنة"
                          >
                            <User className="w-4 h-4" />
                            <span className="text-xs">إضافة أبناء</span>
                          </button>
                          <div className="w-px h-6 bg-gray-200 mx-1"></div>
                          <button 
                            onPointerDown={(e) => { e.stopPropagation(); addRelative(member.id, 'spouse'); }} 
                            className={`p-2 rounded-full transition-colors ${viewMode === 'organic' ? 'bg-teal-50 text-teal-700 hover:bg-teal-100' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                            title="إضافة زوج/زوجة"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                          <div className="w-px h-6 bg-gray-200 mx-1"></div>
                          <button 
                            onPointerDown={(e) => { e.stopPropagation(); setEditingMemberId(member.id); }} 
                            className="p-2 bg-yellow-50 text-yellow-700 rounded-full hover:bg-yellow-100 hover:text-yellow-900 transition-colors"
                            title="تعديل البيانات"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {member.id !== "root" && (
                            <button 
                              onPointerDown={(e) => { e.stopPropagation(); deleteMember(member.id); }} 
                              className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </TransformComponent>
            </div>
          </>
        )}
      </TransformWrapper>

      {/* Editor Side Panel */}
      {editingMember && (
        <div className="absolute inset-y-0 right-0 z-[100]" style={{ direction: 'rtl' }}>
           <MemberEditor 
             member={editingMember} 
             onSave={handleSaveMember} 
             onClose={() => setEditingMemberId(null)} 
             viewMode={viewMode}
           />
        </div>
      )}
    </div>
  );
}
