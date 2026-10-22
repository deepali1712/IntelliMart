import React, { useState, useMemo } from "react";
import {
  ShoppingBasket,
  ArrowRight,
  TrendingUp,
  Search,
  Sliders,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import { getAnalytics } from "../../data/analytics";
import DwmHeader from "./DwmHeader";

export default function CrossSell() {
  const analytics = useMemo(() => getAnalytics(), []);
  const allRules = analytics.crossSellRules;

  const [minSupport, setMinSupport] = useState(8.0);
  const [minConfidence, setMinConfidence] = useState(45.0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("confidence");

  const filteredRules = useMemo(() => {
    return allRules
      .filter((r) => {
        if (r.support < minSupport) return false;
        if (r.confidence < minConfidence) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchA = r.ifCustomerBuys.toLowerCase().includes(q) || r.exampleA.toLowerCase().includes(q);
          const matchB = r.recommendItem.toLowerCase().includes(q) || r.exampleB.toLowerCase().includes(q);
          if (!matchA && !matchB) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "confidence") return b.confidence - a.confidence;
        if (sortBy === "lift") return b.lift - a.lift;
        return b.support - a.support;
      });
  }, [allRules, minSupport, minConfidence, searchQuery, sortBy]);

  const topThree = useMemo(() => {
    return [...allRules].sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }, [allRules]);

  return (
    <div>
      <DwmHeader
        title="Frequently Bought Together (Cross-Sell)"
        subtitle="Market basket affinity mining quantifying joint purchase probabilities and category cross-selling opportunities."
        exportData={filteredRules}
        exportFilename="cross_sell_rules.csv"
      />

      {/* Top 3 Opportunities Highlight Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {topThree.map((item, idx) => (
          <div
            key={idx}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-sm flex flex-col justify-between relative"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1a8fc9] uppercase">
                  Top Opportunity #{idx + 1}
                </span>
                <span className="text-xs font-mono font-bold text-[#059669]">
                  {item.confidence}% Match
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl truncate">
                    {item.ifCustomerBuys}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-bold text-[#1a8fc9] bg-blue-50 px-2.5 py-1 rounded-xl truncate">
                    {item.recommendItem}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  Shoppers purchasing {item.exampleA} frequently add {item.exampleB} in {item.confidence}% of journeys.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Lift Multiplier:</span>
              <span className="font-mono font-bold text-pink-600">{item.lift}x Baseline</span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls & Filter Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm mb-6 relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1a8fc9]" />
            <h3 className="text-base font-bold text-[#0f2a5c]">Rule Filters & Thresholds</h3>
          </div>
          <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* Min Support */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Min Support:</span>
              <span className="font-mono font-bold text-[#1a8fc9]">{minSupport.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="0.5"
              value={minSupport}
              onChange={(e) => setMinSupport(Number(e.target.value))}
              className="w-full accent-[#1a8fc9]"
            />
          </div>

          {/* Min Confidence */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Min Confidence:</span>
              <span className="font-mono font-bold text-[#059669]">{minConfidence.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="75"
              step="1"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full accent-[#059669]"
            />
          </div>

          {/* Search Box */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Filter by Department
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Sort Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Sort Rules
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
            >
              <option value="confidence">Confidence (High to Low)</option>
              <option value="lift">Lift Multiplier (Boost)</option>
              <option value="support">Catalog Support</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm relative">
        <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">If Customer Buys (A)</th>
                <th className="py-3 px-4 text-center w-8"></th>
                <th className="py-3 px-4 font-bold">Recommend (B)</th>
                <th className="py-3 px-4 font-bold text-right">Support</th>
                <th className="py-3 px-4 font-bold w-44 text-right">Confidence Level</th>
                <th className="py-3 px-4 font-bold text-right">Lift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRules.map((rule, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#0f2a5c] block">{rule.ifCustomerBuys}</span>
                    <span className="text-[11px] text-slate-400">e.g. {rule.exampleA}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 inline" />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#1a8fc9] block">{rule.recommendItem}</span>
                    <span className="text-[11px] text-slate-400">e.g. {rule.exampleB}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-600">
                    {rule.support.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#1a8fc9] to-[#059669] h-full rounded-full"
                          style={{ width: `${rule.confidence}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900 w-10 text-right">
                        {rule.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-black text-[#059669]">
                    {rule.lift.toFixed(1)}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
