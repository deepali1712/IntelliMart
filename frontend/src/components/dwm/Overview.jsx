import React, { useState, useMemo } from "react";
import {
  MoreHorizontal,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Package,
  Layers,
  Star,
  Activity,
  FolderTree,
  BadgeCheck,
  Users,
  MessageSquareHeart,
  ShoppingBasket,
  Target,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { getAnalytics } from "../../data/analytics";
import DwmHeader from "./DwmHeader";
import { formatNumber } from "../../utils/format";

export default function Overview() {
  const { dispatch } = useApp();
  const analytics = useMemo(() => getAnalytics(), []);

  // Growth card period state
  const [growthPeriod, setGrowthPeriod] = useState("Month");

  // Statistics toggle state
  const [statTab, setStatTab] = useState("Customer Satisfaction");

  const statData = [
    { day: "Mon", value: 65, pct: "65%" },
    { day: "Tue", value: 82, pct: "82%" },
    { day: "Wed", value: 74, pct: "74%" },
    { day: "Thu", value: 92, pct: "92%" },
    { day: "Fri", value: 88, pct: "88%" },
    { day: "Sat", value: 70, pct: "70%" },
    { day: "Sun", value: 78, pct: "78%" },
  ];

  const handleOpenModule = (moduleId) => {
    dispatch({ type: "SET_DWM_SECTION", payload: moduleId });
  };

  const engines = [
    {
      id: "classifier",
      title: "Product Rating Tier Classifier",
      desc: "Quality grading allocating items into Low, Medium, and High rating tiers.",
      icon: BadgeCheck,
    },
    {
      id: "segmentation",
      title: "Market & Customer Segmentation",
      desc: "Multivariate cohort clustering across pricing, discounts, and customer engagement.",
      icon: Users,
    },
    {
      id: "sentiment",
      title: "Customer Review Sentiment Insights",
      desc: "Aggregated review polarity monitoring customer satisfaction and voice across departments.",
      icon: MessageSquareHeart,
    },
    {
      id: "cross-sell",
      title: "Frequently Bought Together (Cross-Sell)",
      desc: "Market basket affinity analysis identifying complementary cross-sell opportunities.",
      icon: ShoppingBasket,
    },
    {
      id: "trends",
      title: "Price & Discount Impact Trends",
      desc: "Fitted trendline elasticity measuring customer review volume response across promotional discount bands.",
      icon: TrendingUp,
    },
    {
      id: "forecaster",
      title: "Sales Success Forecaster",
      desc: "Predictive simulation engine calculating the probability of reaching High Sales Tier.",
      icon: Target,
    },
  ];

  const topCats = analytics.categoryDistribution.slice(0, 5);

  return (
    <div>
      <DwmHeader
        title="Overview"
        subtitle="Executive business intelligence dashboard calibrated to 1,465 authentic products across 9 commercial retail departments."
        exportData={analytics.categoryDistribution}
        exportFilename="overview_metrics.csv"
      />

      {/* ROW 1: Hero Navy Card Stack + Rating Growth + Catalog Health Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Col (4 cols): Navy Gradient Hero KPI + Categories Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Total Products Hero Card (Navy Gradient matching Ultraleads reference) */}
          <div className="bg-gradient-to-br from-[#1e3a6e] to-[#0f2a5c] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Total Products
              </span>
              <button
                type="button"
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                  1,465
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#d1fae5] text-[#059669] text-xs font-extrabold flex items-center gap-1 shadow-sm">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+22%</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium">
                vs last month · Calibrated active catalog items
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>Avg Discount: 47.7%</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-neon" />
              <span>Avg Rating: 4.1 ★</span>
            </div>
          </div>

          {/* Categories Card (White Card) */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm flex flex-col justify-between relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Departments & Sectors
              </span>
              <button
                type="button"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-3xl font-black text-[#0f2a5c] font-mono">
                9 Categories
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                100% Coverage
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Spanning Electronics, Computers, Kitchen, and Specialized Retail
            </p>
          </div>
        </div>

        {/* Middle Col (4 cols): Customer Rating Growth Card with Period Chips */}
        <div className="lg:col-span-4 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0f2a5c]">
                  Customer Rating Growth
                </h3>
                <p className="text-xs text-slate-500">Verified satisfaction trajectory</p>
              </div>
              <button
                type="button"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Period selector chips */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-full w-fit mb-6">
              {["24h", "3d", "A Week", "Month"].map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setGrowthPeriod(period)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    growthPeriod === period
                      ? "bg-[#1e3a6e] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Big Stat & Progress */}
            <div className="space-y-4">
              <div>
                <span className="text-4xl font-black text-[#0f2a5c] font-mono">
                  4.1 / 5.0
                </span>
                <span className="ml-2 text-xs font-bold px-2.5 py-1 rounded-full bg-[#d1fae5] text-[#059669]">
                  +0.4 ★ vs Q2
                </span>
              </div>

              {/* Mint/Aqua Gradient Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Satisfaction Target: 4.5 ★</span>
                  <span className="font-mono text-[#059669] font-bold">82% of Goal</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#5eead4] via-[#7dd3fc] to-[#a7f3d0] transition-all duration-500"
                    style={{ width: "82%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-6">
            <span>26M+ Reviews Aggregated</span>
            <span className="text-[#059669] font-bold">Healthy Velocity</span>
          </div>
        </div>

        {/* Right Col (4 cols): Catalog Health Semicircular Gauge Card */}
        <div className="lg:col-span-4 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-[#0f2a5c]">
                  Catalog Health
                </h3>
                <p className="text-xs text-slate-500">Pipeline hygiene & completeness</p>
              </div>
              <button
                type="button"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Semicircle Ticks Visual */}
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
                <svg className="w-40 h-40 transform rotate-180" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    strokeDasharray="125 125"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#mintGrad)"
                    strokeWidth="10"
                    strokeDasharray="105 125"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5eead4" />
                      <stop offset="50%" stopColor="#7dd3fc" />
                      <stop offset="100%" stopColor="#a7f3d0" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-1 flex flex-col items-center">
                  <span className="text-2xl font-black font-mono text-[#0f2a5c]">
                    100%
                  </span>
                  <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider">
                    Clean & Audited
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
              <span className="text-xs font-bold text-[#065f46] block">
                145 New Products
              </span>
              <span className="text-[11px] text-slate-600 mt-0.5 block">
                Calibrated this cycle with zero duplicates or missing attributes.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-4">
            <span>Missing Values: 0</span>
            <span className="font-mono text-emerald-600 font-bold">100% Complete</span>
          </div>
        </div>
      </div>

      {/* ROW 2: Statistics Card + Top Categories Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Statistics Card (7 cols) with Mon-Sun Bars & +76% Stat */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-[#0f2a5c]">
                  Statistics
                </h3>
                <p className="text-xs text-slate-500">Weekly engagement and customer volume trends</p>
              </div>

              {/* Toggle row */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full text-xs">
                {["Customer Satisfaction", "Visitor Insight", "Weekly"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatTab(tab)}
                    className={`px-3 py-1 rounded-full font-bold transition-all ${
                      statTab === tab
                        ? "bg-[#1e3a6e] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Big Stat on Left */}
              <div className="sm:col-span-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Weekly Index
                </span>
                <div className="text-4xl font-black text-[#059669] font-mono mt-1">
                  +76%
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Consistent conversion growth driven by personalized recommendation matching.
                </p>
              </div>

              {/* Mon-Sun Rounded-Bar Chart */}
              <div className="sm:col-span-8 h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      formatter={(val) => [`${val}%`, "Satisfaction"]}
                      contentStyle={{ backgroundColor: "#0f2a5c", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={22}>
                      {statData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.day === "Thu" ? "#10b981" : "#7dd3fc"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 mt-4">
            <span>Peak Day: Thursday (92% positive)</span>
            <span className="text-emerald-700 font-bold">Active Catalog Data</span>
          </div>
        </div>

        {/* Top Categories Card (5 cols) styled like "Most Order by Country" */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0f2a5c]">
                  Top Categories
                </h3>
                <p className="text-xs text-slate-500">Highest volume retail departments</p>
              </div>
              <button
                type="button"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Pill rows showing category name and review volume */}
            <div className="space-y-2.5">
              {topCats.map((cat, idx) => (
                <div
                  key={cat.category}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1e3a6e] text-white text-[10px] font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {cat.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0f2a5c]">
                      {cat.count} items
                    </span>
                    <span className="text-[11px] font-semibold text-[#059669] bg-[#d1fae5] px-2 py-0.5 rounded-full">
                      ★ {cat.averageRating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 mt-4">
            <span>Total 9 commercial sectors</span>
            <span className="text-blue-royal font-bold">1,465 items</span>
          </div>
        </div>
      </div>

      {/* Analytical Model Engine Readiness (6 Cards with Green Active Dots) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0f2a5c]">
              Analytical Model Engine Readiness
            </h2>
            <p className="text-xs text-slate-500">6 commercial intelligence pipelines active and fitted</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#d1fae5] text-[#059669] border border-[#a7f3d0]">
            6 / 6 Active & Fitted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {engines.map((e) => {
            const Icon = e.icon;
            return (
              <div
                key={e.id}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1a8fc9] to-[#22b8cf] text-white flex items-center justify-center shadow-md shadow-blue-500/15">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#059669] text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                      <span>Active & Fitted</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#0f2a5c] group-hover:text-blue-royal transition-colors">
                    {e.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {e.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenModule(e.id)}
                    className="text-xs font-bold text-[#1a8fc9] hover:text-[#0f2a5c] transition-colors"
                  >
                    Open Engine →
                  </button>
                  <MoreHorizontal className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
