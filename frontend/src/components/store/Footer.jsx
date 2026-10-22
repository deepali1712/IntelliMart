import React from "react";
import { Sparkles, ShoppingBag, ShieldCheck, Zap, Heart } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Footer() {
  const { dispatch } = useApp();

  return (
    <footer className="bg-ink-950 border-t border-white/10 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-glow to-pink-neon flex items-center justify-center shadow-lg shadow-violet-glow/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-white">Intelli</span>
                <span className="text-hot-pink">Mart</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              A modern, intelligent e-commerce shopping platform and analytical workstation, calibrated to 1,465 authentic products across 9 retail categories.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Client-Side Ready</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Zap className="w-4 h-4 text-cyan-neon" />
                <span>Zero Latency</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Storefront
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_STORE_TAB", payload: "storefront" })}
                  className="hover:text-cyan-neon transition-colors"
                >
                  Featured Collections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_STORE_TAB", payload: "catalog" })}
                  className="hover:text-cyan-neon transition-colors"
                >
                  Browse Full Catalog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_STORE_TAB", payload: "about" })}
                  className="hover:text-cyan-neon transition-colors"
                >
                  Catalog Highlights
                </button>
              </li>
            </ul>
          </div>

          {/* Analytics Hub */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              DWM Center
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_DWM_SECTION", payload: "overview" })}
                  className="hover:text-pink-neon transition-colors"
                >
                  Workstation Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_DWM_SECTION", payload: "explorer" })}
                  className="hover:text-pink-neon transition-colors"
                >
                  Dataset Explorer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_DWM_SECTION", payload: "slicer" })}
                  className="hover:text-pink-neon transition-colors"
                >
                  Custom Data Slicer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_DWM_SECTION", payload: "forecaster" })}
                  className="hover:text-pink-neon transition-colors"
                >
                  Sales Success Forecaster
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Standards */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Intelligence
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_DWM_SECTION", payload: "sentiment" })}
                  className="hover:text-violet-glow transition-colors"
                >
                  Review Sentiment Insights
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_DWM_SECTION", payload: "cross-sell" })}
                  className="hover:text-violet-glow transition-colors"
                >
                  Frequently Bought Together
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_DWM_SECTION", payload: "trends" })}
                  className="hover:text-violet-glow transition-colors"
                >
                  Price & Discount Impact Trends
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_DWM_SECTION", payload: "segmentation" })}
                  className="hover:text-violet-glow transition-colors"
                >
                  Market & Customer Segmentation
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} IntelliMart. All product metrics deterministic and calibrated.</p>
          <div className="flex items-center gap-2">
            <span>Powered by dynamic frontend architecture</span>
            <span>•</span>
            <span className="text-slate-400">1,465 Products Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
