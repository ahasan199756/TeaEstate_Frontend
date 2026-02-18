// src/components/Admin/Settings/Settings.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const location = useLocation();
  const currentTab = location.pathname.split("/").pop() || "profile";

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4">
      <div className="mb-10">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
          Admin <span className="text-emerald-500">Settings</span>
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <SettingsIcon
            size={12}
            className="text-emerald-500 animate-spin-slow"
          />
          <p className="text-white/20 font-bold text-[10px] uppercase tracking-[0.2em]">
            Admin / Settings /{" "}
            <span className="text-white/60">{currentTab}</span>
          </p>
        </div>
      </div>

      {/* ✅ Only the content card (no left sidebar) */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[520px]">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
