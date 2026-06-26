import React from "react";

export function MinimalFooter() {
  return (
    <footer className="bg-[#8E9091] text-white pt-8 pb-8 border-t-4 border-brand-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-sm text-white">
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="text-3xl font-bold font-serif mb-4 text-white">ما لا يُوثق اليوم… قد يصبح مجرد رواية غامضة غدًا.</p>
            <div className="bg-white p-2 rounded-md mb-2 mt-4 inline-block">
              <img src="https://i.postimg.cc/cHChY5vS/Genea-Lab-Logo.jpg" alt="GeneaLab LLC" className="h-8 w-auto object-contain block" />
            </div>
            <p className="text-[#D1D5DB] text-xs">تعمل المنصة من خلال شركة جينيا لاب - الولايات المتحدة الأمريكية.</p>
            <p className="text-[#D1D5DB] text-xs mt-1">© 2026 GeneaLab LLC — جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
