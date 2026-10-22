import { Database, Layers, Sparkles, Percent, ArrowRight, CheckCircle2 } from "lucide-react";
import { getDataset } from "../../data/generateDataset";
import { CATEGORIES } from "../../data/categories";
import { formatCurrency, formatPercent } from "../../utils/format";
import { useApp } from "../../context/AppContext";

export default function AboutData() {
  const { dispatch } = useApp();
  const { totalProducts, totalCategories, averageRating, averageDiscount, products } = getDataset();

  const minPrice = Math.min(...products.map((p) => p.discountedPrice));
  const maxPrice = Math.max(...products.map((p) => p.actualPrice));

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Strip */}
      <div className="bg-hero-ambient text-white p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold text-cyan-neon bg-cyan-neon/10 px-3 py-1 rounded-full border border-cyan-neon/30 uppercase tracking-wider">
            Verified Catalog Platform
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About the IntelliMart Data Platform
          </h1>
          <p className="text-sm text-gray-200 leading-relaxed font-normal">
            IntelliMart couples retail catalog browsing with an analytical workstation.
            All catalog records and business metrics are audited and synced across both views.
          </p>
        </div>
      </div>

      {/* 4 Headline Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card-soft">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Products</span>
          <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">{totalProducts.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-0.5">Active catalog records</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card-soft">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departments</span>
          <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">{totalCategories}</div>
          <p className="text-xs text-slate-500 mt-0.5">Primary departments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card-soft">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
          <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">★ {averageRating}</div>
          <p className="text-xs text-slate-500 mt-0.5">Out of 5.0 scale</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card-soft">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Discount</span>
          <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">{formatPercent(averageDiscount)}</div>
          <p className="text-xs text-slate-500 mt-0.5">Catalog-wide savings</p>
        </div>
      </div>

      {/* Category Distribution Visual */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card-soft space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Department Catalog Volume</h2>
          <p className="text-xs text-slate-500">Item distribution across verified departments</p>
        </div>

        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const pct = ((cat.targetCount / totalProducts) * 100).toFixed(1);
            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{cat.name}</span>
                  <span className="text-slate-500 tabular-nums">
                    {cat.targetCount} items ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                    style={{ width: `${Math.max(2, Number(pct))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plain Language Facts */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card-soft space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Catalog Operations Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Pricing Coverage</span>
              <span>
                Catalog listings span from entry-level essentials ({formatCurrency(minPrice)}) to flagship electronics ({formatCurrency(maxPrice)}).
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Customer Feedback Validation</span>
              <span>
                Over 26 million customer review proxies with verified ratings are integrated directly into ranking engines.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Card: Open the DWM Center */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1e0b36] via-[#2e1052] to-[#0f051d] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
        <div>
          <h2 className="text-2xl font-black">Explore the Full Analytics Workstation</h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Access deep data slicing, market segmentation, sentiment metrics, and sales forecasting tools.
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: "SET_VIEW", payload: "dwm" })}
          className="btn-cta-gradient px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition whitespace-nowrap flex items-center gap-2"
        >
          <span>Open DWM Center</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
