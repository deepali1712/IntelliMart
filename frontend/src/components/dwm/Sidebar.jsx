import React from "react";
import {
  LayoutDashboard,
  Database,
  Layers,
  BadgeCheck,
  Users,
  MessageSquareHeart,
  ShoppingBasket,
  TrendingUp,
  Target,
  ArrowLeft,
  X,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const DWM_SECTIONS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: "explorer",
    label: "Dataset Explorer",
    icon: Database,
    badge: "1,465",
  },
  {
    id: "slicer",
    label: "Custom Data Slicer",
    icon: Layers,
    badge: "5 Ops",
  },
  {
    id: "classifier",
    label: "Product Rating Tier Classifier",
    icon: BadgeCheck,
    badge: "Model",
  },
  {
    id: "segmentation",
    label: "Market & Customer Segmentation",
    icon: Users,
    badge: "k=2-8",
  },
  {
    id: "sentiment",
    label: "Customer Review Sentiment Insights",
    icon: MessageSquareHeart,
    badge: "Voice",
  },
  {
    id: "cross-sell",
    label: "Frequently Bought Together (Cross-Sell)",
    icon: ShoppingBasket,
    badge: "Rules",
  },
  {
    id: "trends",
    label: "Price & Discount Impact Trends",
    icon: TrendingUp,
    badge: "Fitted",
  },
  {
    id: "forecaster",
    label: "Sales Success Forecaster",
    icon: Target,
    badge: "Predict",
  },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { state, dispatch } = useApp();
  const activeSection = state.dwmSection || "overview";

  const handleSelect = (id) => {
    dispatch({ type: "SET_DWM_SECTION", payload: id });
    if (onCloseMobile) onCloseMobile();
  };

  const handleReturnToStore = () => {
    dispatch({ type: "SET_STORE_TAB", payload: "storefront" });
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-sidebar text-slate-300 flex flex-col border-r border-white/10 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-cyan-neon">DWM</span>{" "}
                <span className="text-pink-neon">Center</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-glow/20 text-violet-300 border border-violet-500/30">
                v2.0
              </span>
            </div>
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">Analytics Workstation</p>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Workstation Modules
          </div>

          {DWM_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSelect(sec.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_24px_rgba(124,58,237,0.55)] border border-violet-400/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-cyan-neon" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{sec.label}</span>
                </div>
                {sec.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 font-medium ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer / Return Button */}
        <div className="p-4 border-t border-white/10 bg-sidebar/50">
          <button
            type="button"
            onClick={handleReturnToStore}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-neon" />
            <span>Return to Storefront</span>
          </button>
        </div>
      </aside>
    </>
  );
}
