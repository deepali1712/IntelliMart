import React from "react";
import {
  Send,
  Bell,
  Settings,
  ArrowLeft,
  Sparkles,
  User,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const DWM_NAV_ITEMS = [
  { id: "overview", label: "1 Overview", fullTitle: "Overview" },
  { id: "explorer", label: "2 Dataset", fullTitle: "Dataset Explorer" },
  { id: "slicer", label: "3 Data Slicer", fullTitle: "Custom Data Slicer & Dimension Explorer" },
  { id: "classifier", label: "4 Rating Tiers", fullTitle: "Product Rating Tier Classifier" },
  { id: "segmentation", label: "5 Segmentation", fullTitle: "Market & Customer Segmentation" },
  { id: "sentiment", label: "6 Sentiment", fullTitle: "Customer Review Sentiment Insights" },
  { id: "cross-sell", label: "7 Cross-Sell", fullTitle: "Frequently Bought Together (Cross-Sell)" },
  { id: "trends", label: "8 Trends", fullTitle: "Price & Discount Impact Trends" },
  { id: "forecaster", label: "9 Forecaster", fullTitle: "Sales Success Forecaster" },
];

export default function TopNav() {
  const { state, dispatch } = useApp();
  const activeSection = state.dwmSection || "overview";

  const handleSelect = (id) => {
    dispatch({ type: "SET_DWM_SECTION", payload: id });
  };

  const handleBackToStore = () => {
    dispatch({ type: "SET_STORE_TAB", payload: "storefront" });
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-white/80 rounded-t-[28px] px-6 py-4 transition-all">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left: Brand Logo matching Ultraleads reference */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1a8fc9] to-[#22b8cf] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Send className="w-4 h-4 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-[#0f2a5c] tracking-tight">
                IntelliMart <span className="text-cyan-neon">DWM</span>{" "}
                <span className="text-pink-neon">Center</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a8fc9] border border-blue-200">
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Center: Horizontal Pill Navigation with exact 9 short labels */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none px-2 py-1 bg-white/60 rounded-full border border-slate-200/60 shadow-inner">
          {DWM_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#1e4a7a] to-[#2b5c93] text-white shadow-md shadow-slate-900/15"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right side: Bell, Gear, User Avatar & Back to Storefront */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification Bell */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 border-2 border-white" />
          </button>

          {/* Settings Gear */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Chip (matching reference "Sarah Collins") */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 pr-3 py-1 bg-white border border-slate-200/80 rounded-full shadow-sm">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-inner">
              SC
            </div>
            <div className="text-left text-xs leading-tight">
              <span className="font-bold text-slate-900 block">Sarah Collins</span>
              <span className="text-[10px] text-slate-400 font-medium">Sales Manager</span>
            </div>
          </div>

          {/* Back to Storefront Button */}
          <button
            type="button"
            onClick={handleBackToStore}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1a8fc9] hover:bg-[#167cae] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
