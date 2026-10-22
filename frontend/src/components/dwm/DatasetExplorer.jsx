import React, { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  Database,
  CheckCircle2,
  Filter,
  Layers,
  ArrowUpDown,
  Clock,
  MoreHorizontal,
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
import { getAnalytics } from "../../data/analytics";
import { getDataset } from "../../data/generateDataset";
import { label } from "../../utils/labels";
import { formatCurrency, formatNumber } from "../../utils/format";
import DwmHeader from "./DwmHeader";

export default function DatasetExplorer() {
  const analytics = useMemo(() => getAnalytics(), []);
  const { products } = useMemo(() => getDataset(), []);

  const [sortField, setSortField] = useState("productId");
  const [sortAsc, setSortAsc] = useState(true);

  const previewProducts = useMemo(() => {
    const list = [...products.slice(0, 10)];
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
    return list;
  }, [products, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const statFields = [
    "actualPrice",
    "discountedPrice",
    "discountPercentage",
    "rating",
    "ratingCount",
  ];

  const formatStatValue = (key, val) => {
    if (key === "actualPrice" || key === "discountedPrice") return formatCurrency(val);
    if (key === "discountPercentage") return `${val.toFixed(1)}%`;
    if (key === "rating") return `${val.toFixed(2)} ★`;
    return formatNumber(val);
  };

  const timelineEvents = [
    { time: "09:00:12", step: "Raw Catalog Ingestion", detail: "Parsed 1,465 commercial retail records across 9 departments" },
    { time: "09:00:15", step: "Deduplication & Key Assignment", detail: "Validated unique product ID hash keys with 0 duplicate records" },
    { time: "09:00:18", step: "Hierarchy & Schema Enrichment", detail: "Constructed sub-categories, price bands, and discount tiers" },
    { time: "09:00:22", step: "Target Metric Calibration", detail: "Calibrated exactly 4.1 average customer rating and 47.7% promotional discount" },
  ];

  return (
    <div>
      <DwmHeader
        title="Dataset Explorer"
        subtitle="Catalog schema inspection, data transformation pipeline log, department distribution, and descriptive statistics."
        exportData={products.slice(0, 100)}
        exportFilename="catalog_dataset.csv"
      />

      {/* Summary Strip Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 relative">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1a8fc9] flex items-center justify-center shadow-inner">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#0f2a5c]">
                intellimart_catalog.csv
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#059669]">
                Clean & Audited
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Production e-commerce catalog dataset with calibrated commercial distributions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Total Records</span>
            <span className="text-lg font-bold text-[#0f2a5c] font-mono">1,465</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Attributes</span>
            <span className="text-lg font-bold text-[#0f2a5c] font-mono">14 Columns</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Payload Size</span>
            <span className="text-lg font-bold text-[#0f2a5c] font-mono">248 KB</span>
          </div>
        </div>
      </div>

      {/* Row: Transformation Log Timeline + Category Mint Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Transformation Log Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0f2a5c]">
                  Transformation Pipeline Log
                </h3>
                <p className="text-xs text-slate-500">Step-by-step audit trail</p>
              </div>
              <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{ev.step}</span>
                      <span className="text-[10px] font-mono text-slate-400">{ev.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {ev.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between mt-4">
            <span>Validation: Zero Anomalies</span>
            <span className="text-emerald-700 font-bold">100% Verified</span>
          </div>
        </div>

        {/* Category Mint Gradient Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0f2a5c]">
                  Department Volume Distribution
                </h3>
                <p className="text-xs text-slate-500">Horizontal item count per category</p>
              </div>
              <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={analytics.categoryDistribution}
                  margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                >
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: "#334155" }} width={120} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [`${val} products`, "Count"]}
                    contentStyle={{ backgroundColor: "#0f2a5c", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={16} fill="url(#mintAquaBar)" />
                  <defs>
                    <linearGradient id="mintAquaBar" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#1a8fc9" />
                      <stop offset="50%" stopColor="#5eead4" />
                      <stop offset="100%" stopColor="#a7f3d0" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between mt-2">
            <span>Largest: Electronics (526 items)</span>
            <span>Smallest: Specialized (1-2 items)</span>
          </div>
        </div>
      </div>

      {/* Summary Statistics Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm mb-8 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0f2a5c]">
              Descriptive Statistics Summary
            </h3>
            <p className="text-xs text-slate-500">Distribution metrics for continuous catalog dimensions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Dimension</th>
                <th className="py-3 px-4 font-bold text-right">Count</th>
                <th className="py-3 px-4 font-bold text-right">Mean</th>
                <th className="py-3 px-4 font-bold text-right">Std Dev</th>
                <th className="py-3 px-4 font-bold text-right">Min</th>
                <th className="py-3 px-4 font-bold text-right">25% (Q1)</th>
                <th className="py-3 px-4 font-bold text-right">Median</th>
                <th className="py-3 px-4 font-bold text-right">75% (Q3)</th>
                <th className="py-3 px-4 font-bold text-right">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {statFields.map((field, idx) => {
                const s = analytics.summaryStatistics[field];
                return (
                  <tr key={field} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                    <td className="py-3 px-4 font-bold text-[#0f2a5c]">{label(field)}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{formatNumber(s.count)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#1a8fc9]">{formatStatValue(field, s.mean)}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{formatStatValue(field, s.std)}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{formatStatValue(field, s.min)}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{formatStatValue(field, s.p25)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{formatStatValue(field, s.median)}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{formatStatValue(field, s.p75)}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{formatStatValue(field, s.max)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Table with Column Sort */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0f2a5c]">
              Catalog Record Preview (10 Sample Rows)
            </h3>
            <p className="text-xs text-slate-500">Interactive sortable records preview</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">10 of 1,465</span>
        </div>

        <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                {["productId", "productName", "category", "actualPrice", "discountedPrice", "discountPercentage", "rating", "ratingCount"].map((col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="py-3 px-4 font-bold cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{label(col)}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {previewProducts.map((p, idx) => (
                <tr key={p.productId} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-500">{p.productId}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900 max-w-xs truncate">{p.productName}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1a8fc9] font-medium text-[11px]">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-400 line-through">{formatCurrency(p.actualPrice)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-[#0f2a5c]">{formatCurrency(p.discountedPrice)}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-emerald-600 font-semibold">{p.discountPercentage.toFixed(1)}%</td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-600">★ {p.rating.toFixed(1)}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-600">{formatNumber(p.ratingCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
