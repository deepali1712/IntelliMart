import React, { useState, useMemo } from "react";
import {
  MessageSquareHeart,
  Smile,
  Meh,
  Frown,
  ArrowUpDown,
  MoreHorizontal,
  Quote,
  Star,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getAnalytics } from "../../data/analytics";
import { formatNumber } from "../../utils/format";
import DwmHeader from "./DwmHeader";

export default function SentimentInsights() {
  const analytics = useMemo(() => getAnalytics(), []);
  const { proportions, polarityBins, categorySentiment, voiceOfCustomer } =
    analytics.sentimentInsights;

  const [sortField, setSortField] = useState("positivePct");
  const [sortAsc, setSortAsc] = useState(false);

  const sortedCategories = useMemo(() => {
    const list = [...categorySentiment];
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
    return list;
  }, [categorySentiment, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const donutColors = ["#10b981", "#f59e0b", "#f43f5e"];

  return (
    <div>
      <DwmHeader
        title="Customer Review Sentiment Insights"
        subtitle="Catalog-wide natural language sentiment distribution, polarity spectrum histograms, and verified customer testimonials."
        exportData={categorySentiment}
        exportFilename="sentiment_benchmarks.csv"
      />

      {/* Row 1: Donut Chart + Polarity Spectrum Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Donut Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-[#0f2a5c]">
                  Sentiment Proportions
                </h3>
                <p className="text-xs text-slate-500">Aggregate customer evaluation tone</p>
              </div>
              <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="h-60 w-full relative my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={proportions}
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {proportions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name, item) => [
                      `${formatNumber(val)} reviews (${item.payload.percentage}%)`,
                      item.payload.name,
                    ]}
                    contentStyle={{ backgroundColor: "#0f2a5c", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-[#0f2a5c] font-mono">
                  {proportions[0]?.percentage}%
                </span>
                <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider">
                  Positive Tone
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
              <div className="p-2.5 rounded-2xl bg-[#d1fae5]/70">
                <span className="text-[11px] font-bold text-[#065f46] block">Positive</span>
                <span className="text-sm font-mono font-black text-[#065f46]">{proportions[0]?.percentage}%</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50">
                <span className="text-[11px] font-bold text-amber-700 block">Neutral</span>
                <span className="text-sm font-mono font-black text-amber-800">{proportions[1]?.percentage}%</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50">
                <span className="text-[11px] font-bold text-rose-700 block">Negative</span>
                <span className="text-sm font-mono font-black text-rose-800">{proportions[2]?.percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Polarity Histogram (6 cols) */}
        <div className="lg:col-span-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-[#0f2a5c]">
                  Polarity Spectrum Histogram
                </h3>
                <p className="text-xs text-slate-500">Distribution from -1.0 (Critical) to +1.0 (Delighted)</p>
              </div>
              <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="h-60 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={polarityBins} margin={{ top: 20, right: 10, bottom: 10, left: -10 }}>
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val, name, item) => [`${val} products`, item.payload.label]}
                    contentStyle={{ backgroundColor: "#0f2a5c", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {polarityBins.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span className="text-rose-600 font-bold">← Critical (-1.0)</span>
            <span className="text-slate-400 font-medium">Neutral (0.0)</span>
            <span className="text-[#059669] font-bold">Delighted (+1.0) →</span>
          </div>
        </div>
      </div>

      {/* Department Sentiment Breakdown Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm mb-8 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0f2a5c]">
              Department Sentiment Benchmarks
            </h3>
            <p className="text-xs text-slate-500">Stacked proportion ratios and average polarity by commercial category</p>
          </div>
          <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th onClick={() => handleSort("category")} className="py-3 px-4 font-bold cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span>Department</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 font-bold text-center w-48">Stacked Sentiment Ratio</th>
                <th onClick={() => handleSort("positivePct")} className="py-3 px-4 font-bold text-right cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Positive %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("neutralPct")} className="py-3 px-4 font-bold text-right cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Neutral %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("negativePct")} className="py-3 px-4 font-bold text-right cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Negative %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort("averagePolarity")} className="py-3 px-4 font-bold text-right cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Avg Polarity</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedCategories.map((cat, idx) => (
                <tr key={cat.category} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                  <td className="py-3 px-4 font-bold text-[#0f2a5c]">{cat.category}</td>
                  <td className="py-3 px-4">
                    <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100">
                      <div className="bg-[#10b981] h-full" style={{ width: `${cat.positivePct}%` }} />
                      <div className="bg-amber-400 h-full" style={{ width: `${cat.neutralPct}%` }} />
                      <div className="bg-rose-500 h-full" style={{ width: `${cat.negativePct}%` }} />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#059669]">{cat.positivePct}%</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-amber-600">{cat.neutralPct}%</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-rose-600">{cat.negativePct}%</td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-[#1a8fc9]">
                    {cat.averagePolarity > 0 ? `+${cat.averagePolarity}` : cat.averagePolarity}
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
