import React from 'react';
import { Outlet } from 'react-router-dom';

import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full relative bg-[#010801] text-white overflow-hidden font-sans">
      
      {/* --- CINEMATIC AMBIENCE --- */}
      {/* Top right soft emerald glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none" />
      {/* Bottom left deep forest glow */}
      <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* --- FLOATING SIDEBAR FRAME --- */}
      <div className="py-6 pl-6 h-full flex flex-col z-30">
        <div className="h-full w-72 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[45px] shadow-2xl overflow-hidden relative group">
          {/* Subtle Inner Border Glow */}
          <div className="absolute inset-0 border border-emerald-500/5 rounded-[45px] pointer-events-none group-hover:border-emerald-500/10 transition-colors duration-700" />
          
          <AdminSidebar />
        </div>
      </div>

      {/* --- MAIN CONTENT AREA: THE GALLERY STAGE --- */}
      <main className="flex-grow overflow-y-auto relative flex flex-col no-scrollbar">
        
        {/* Gallery Top Navigation / Header */}
        <div className="h-20 w-full flex items-center justify-between px-12 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#010801]/10">
           <div className="flex items-center gap-4">
              {/* Pulsing Live Status Dot */}
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse" />
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 leading-none">Estate Management</p>
                <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-emerald-500/60 mt-1">Status: Operational</p>
              </div>
           </div>
           
           {/* Decorative Profile Icon - Replace with your User component if needed */}
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer overflow-hidden group">
                 <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-transparent group-hover:opacity-100 opacity-50 transition-opacity" />
              </div>
           </div>
        </div>

        {/* --- PAGE CONTENT --- */}
        <div className="max-w-[1600px] w-full mx-auto p-10 lg:p-16 relative">
          <div className="relative z-10 animate-gallery-slide">
            <Outlet />
          </div>
        </div>

        {/* --- LUXE FINISHING OVERLAYS --- */}
        {/* Technical scanline at the very top */}
        <div className="fixed top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none z-50" />
        
        {/* Soft bottom vignette to ground the page */}
        <div className="fixed bottom-0 right-0 left-0 h-32 bg-gradient-to-t from-[#010801] to-transparent pointer-events-none z-20" />
      </main>

      {/* Global Scoped Styles */}
      <style>{`
        /* Hide scrollbar for cleaner gallery look */
        .no-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        
        /* Smooth entrance animation for all admin pages */
        .animate-gallery-slide {
          animation: gallerySlide 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes gallerySlide {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.99); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        /* Text selection color to match theme */
        ::selection {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;