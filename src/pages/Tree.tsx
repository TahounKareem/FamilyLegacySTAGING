import React, { useState } from "react";
import { AdvancedTreeBuilder } from "../components/tree/AdvancedTreeBuilder";
import { Save, RefreshCw } from "lucide-react";

export function Tree() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleSave = () => {
    // In the future, this will save to the database
    console.log("Saving tree data:", { nodes, edges });
    alert("تم حفظ الشجرة بنجاح (نسخة تجريبية)");
  };

  return (
    <div className="min-h-screen bg-brand-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-900 font-serif mb-2">منشئ شجرة العائلة (النسخة المطورة)</h1>
            <p className="text-brand-700">هذه نسخة تجريبية لتطوير وتحسين واجهة بناء شجرة العائلة.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 border border-brand-300 text-brand-700 bg-white rounded-lg hover:bg-brand-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة ضبط
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              حفظ الشجرة
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-brand-100 p-6">
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
