import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit2, ZoomIn, ZoomOut, Maximize, User, Users } from "lucide-react";
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
          firstName: n.name.split(' ')[0] || '',
          lastName: n.name.split(' ').slice(1).join(' ') || '',
          gender: 'unknown',
          x: n.x,
          y: n.y,
        }))
      : [{ id: "root", firstName: familyName || "العائلة", lastName: "", gender: "unknown", x: 1000, y: 1000 }]
  );

  const [relations, setRelations] = useState<FamilyRelation[]>(
    initialEdges.length 
      ? initialEdges.map(e => ({
          id: e.id,
          sourceId: e.source,
          targetId: e.target,
          type: 'child'
        }))
      : []
  );

  useEffect(() => {
    if (!initialNodes.length && familyName) {
      setMembers(prev => prev.map(m => m.id === "root" ? { ...m, firstName: familyName } : m));
    }
  }, [familyName, initialNodes.length]);

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

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
    const movementY = e.movementY;
    
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
    
    if (relationType === 'child') { dy = 150; }
    if (relationType === 'spouse') { dx = 180; }
    if (relationType === 'parent') { dy = -150; }

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
    <div className="relative flex flex-col h-[70vh] border border-brand-200 rounded-2xl overflow-hidden bg-brand-50" style={{ direction: 'ltr' }}>
      {/* LTR for Canvas coordinates, content inside nodes will be RTL */}
      
      <TransformWrapper
        initialScale={1}
        minScale={0.2}
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
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-md border border-brand-100">
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
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onPointerMove={handlePointerMoveContainer}
              onPointerUp={handlePointerUpContainer}
              onPointerLeave={handlePointerUpContainer}
            >
              <TransformComponent wrapperClass="w-full h-full" contentClass="w-[2000px] h-[2000px] relative">
                {/* Connections (Edges) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {relations.map(rel => {
                    const source = members.find(m => m.id === rel.sourceId);
                    const target = members.find(m => m.id === rel.targetId);
                    if (!source || !target) return null;
                    
                    // Different stroke style based on relation
                    const isSpouse = rel.type === 'spouse';
                    const strokeColor = isSpouse ? '#e0b589' : '#a37b54';
                    const strokeDash = isSpouse ? '5,5' : 'none';
                    
                    // Draw orthogonal lines for parents/children
                    const midY = (source.y + target.y) / 2;

                    if (isSpouse) {
                      return (
                        <line
                          key={rel.id}
                          x1={source.x} y1={source.y}
                          x2={target.x} y2={target.y}
                          stroke={strokeColor}
                          strokeWidth="3"
                          strokeDasharray={strokeDash}
                        />
                      );
                    }

                    return (
                      <path
                        key={rel.id}
                        d={`M ${source.x} ${source.y + 40} L ${source.x} ${midY} L ${target.x} ${midY} L ${target.x} ${target.y - 40}`}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  })}
                </svg>

                {/* Nodes */}
                {members.map(member => {
                  const isSelected = selectedMemberId === member.id;
                  
                  return (
                    <div
                      key={member.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none"
                      style={{ left: member.x, top: member.y, direction: 'rtl' }}
                    >
                      <div
                        onPointerDown={(e) => handlePointerDownNode(e, member.id)}
                        onClick={() => {
                          if (!isPanning.current && !readOnly) setSelectedMemberId(member.id);
                        }}
                        className={`flex flex-col items-center justify-center w-40 p-3 rounded-2xl border-2 shadow-sm transition-all duration-200 bg-white
                          ${isSelected && !readOnly ? 'border-brand-600 ring-4 ring-brand-100 z-20' : 'border-brand-200 hover:border-brand-400 z-10'}
                          ${readOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 overflow-hidden
                          ${member.gender === 'male' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                            member.gender === 'female' ? 'bg-pink-50 text-pink-600 border-pink-200' : 
                            'bg-brand-50 text-brand-600 border-brand-200'} border-2`}
                        >
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.firstName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        <div className="text-center w-full">
                          <div className="text-sm font-bold text-brand-900 truncate" title={`${member.firstName} ${member.lastName}`}>
                            {member.firstName} {member.lastName}
                          </div>
                          {member.birthDate && (
                            <div className="text-[10px] text-brand-500 mt-1 flex items-center justify-center gap-1">
                              <span>{new Date(member.birthDate).getFullYear()}</span>
                              {member.deathDate && <span> - {new Date(member.deathDate).getFullYear()}</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Floating Actions Menu for Selected Node */}
                      {isSelected && !readOnly && (
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white p-1.5 rounded-full shadow-lg border border-brand-100 z-30" style={{ direction: 'rtl' }}>
                          <button 
                            onPointerDown={(e) => { e.stopPropagation(); addRelative(member.id, 'child'); }} 
                            className="p-2 bg-brand-50 text-brand-700 rounded-full hover:bg-brand-100 hover:text-brand-900 transition-colors"
                            title="إضافة ابن/ابنة"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button 
                            onPointerDown={(e) => { e.stopPropagation(); addRelative(member.id, 'spouse'); }} 
                            className="p-2 bg-brand-50 text-brand-700 rounded-full hover:bg-brand-100 hover:text-brand-900 transition-colors"
                            title="إضافة زوج/زوجة"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                          <button 
                            onPointerDown={(e) => { e.stopPropagation(); setEditingMemberId(member.id); }} 
                            className="p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 shadow-md transition-colors"
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
        <div className="absolute inset-y-0 right-0 z-40" style={{ direction: 'rtl' }}>
           <MemberEditor 
             member={editingMember} 
             onSave={handleSaveMember} 
             onClose={() => setEditingMemberId(null)} 
           />
        </div>
      )}
    </div>
  );
}
