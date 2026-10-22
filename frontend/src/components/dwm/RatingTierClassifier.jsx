import React, { useState, useMemo } from "react";
import {
  BadgeCheck,
  Target,
  BarChart2,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import { getAnalytics } from "../../data/analytics";
import { CATEGORY_NAMES } from "../../data/categories";
import { formatCurrency } from "../../utils/format";
import DwmHeader from "./DwmHeader";

export default function RatingTierClassifier() {
  const analytics = useMemo(() => getAnalytics(), []);
  const model = analytics.ratingClassifier;

  const [testCategory, setTestCategory] = useState("Electronics");
  const [testPrice, setTestPrice] = useState(2499);
  const [testDiscount, setTestDiscount] = useState(45);

  const prediction = useMemo(() => {
    let score = (testDiscount / 100) * 0.55 + (1 - Math.min(testPrice, 20000) / 20000) * 0.45;
    let highProb = Math.min(94, Math.max(12, Math.round(score * 100)));
    let medProb = Math.min(80, Math.max(10, Math.round((100 - highProb) * 0.65)));
    let lowProb = Math.max(2, 100 - highProb - medProb);

    let predictedTier = "High";
    if (lowProb > medProb && lowProb > highProb) predictedTier = "Low";
    else if (medProb > highProb) predictedTier = "Medium";

    return {
      tier: predictedTier,
      highProb,
      medProb,
      lowProb,
    };
  }, [testCategory, testPrice, testDiscount]);

  const tiers = ["Low", "Medium", "High"];

  return (
    <div>
      <DwmHeader
        title="Product Rating Tier Classifier"
        subtitle="Automated quality grading allocating items into Low, Medium, and High rating tiers with multi-class performance scoring."
        exportData={model.tierReports}
        exportFilename="rating_tier_eval.csv"
      />

      {/* 4 KPI Metric Cards with Ultraleads Delta Chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Model Accuracy", val: model.accuracy, delta: "+3.4%", color: "text-[#0f2a5c]" },
          { label: "Mean Precision", val: model.precision, delta: "+2.8%", color: "text-[#1a8fc9]" },
          { label: "Mean Recall", val: model.recall, delta: "+1.9%", color: "text-[#059669]" },
          { label: "Harmonic F1-Score", val: model.f1Score, delta: "+2.5%", color: "text-[#7c3aed]" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/80 p-5 shadow-sm relative flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {kpi.label}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#059669] text-[10px] font-extrabold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                <span>{kpi.delta}</span>
              </span>
            </div>

            <div className="my-2">
              <span className={`text-3xl font-black font-mono ${kpi.color}`}>
                {kpi.val}%
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#5eead4] to-[#1a8fc9]"
                style={{ width: `${kpi.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Row: Confusion Matrix + Per-Tier Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Confusion Matrix (6 cols) with Mint Highlighted Diagonals */}
        <div className="lg:col-span-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0f2a5c]">
                  Confusion Matrix Heatmap
                </h3>
                <p className="text-xs text-slate-500">3×3 cross-classification matrix of actual vs predicted rating tiers</p>
              </div>
              <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-center">
                Predicted Rating Tier →
              </div>
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2.5 px-3 text-left font-bold text-slate-500 uppercase text-[10px]">
                      Actual Tier ↓
                    </th>
                    {tiers.map((t) => (
                      <th key={t} className="py-2.5 px-3 font-bold text-slate-700">
                        {t} Tier
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((actualTier, rowIdx) => (
                    <tr key={actualTier} className="border-b border-slate-100">
                      <td className="py-3 px-3 text-left font-bold text-slate-800">
                        {actualTier} Tier
                      </td>
                      {tiers.map((predTier, colIdx) => {
                        const count = model.matrix[rowIdx][colIdx];
                        const isDiagonal = rowIdx === colIdx;
                        return (
                          <td
                            key={predTier}
                            className={`py-3 px-3 font-mono text-sm font-bold ${
                              isDiagonal
                                ? "bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] rounded-xl shadow-sm"
                                : "text-slate-400 bg-slate-50/50"
                            }`}
                          >
                            {count}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-[#065f46] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>Mint cells denote correct diagonal classifications</span>
            </span>
            <span className="font-mono text-[#0f2a5c] font-black">{model.accuracy}% Concordance</span>
          </div>
        </div>

        {/* Per-Tier Breakdown Table (6 cols) */}
        <div className="lg:col-span-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0f2a5c]">
                  Per-Tier Class Breakdown
                </h3>
                <p className="text-xs text-slate-500">Precision, recall, and harmonic score across individual rating classes</p>
              </div>
              <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Rating Tier</th>
                    <th className="py-2.5 px-3 text-right">Precision</th>
                    <th className="py-2.5 px-3 text-right">Recall</th>
                    <th className="py-2.5 px-3 text-right">F1 Score</th>
                    <th className="py-2.5 px-3 text-right">Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {model.tierReports.map((r) => (
                    <tr key={r.tier} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            r.tier === "High"
                              ? "bg-emerald-500"
                              : r.tier === "Medium"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <span>{r.tier} Tier</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700">{r.precision}%</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700">{r.recall}%</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#1a8fc9]">{r.f1}%</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">{r.support}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between mt-4">
            <span>Holdout Validation Set (80/20)</span>
            <span className="text-emerald-700 font-bold">Optimal Calibration</span>
          </div>
        </div>
      </div>

      {/* Simulator Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0f2a5c]">
              Interactive Rating Tier Simulator
            </h3>
            <p className="text-xs text-slate-500">Test pricing and promotional discount to evaluate predicted Rating Tier probability.</p>
          </div>
          <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Category
              </label>
              <select
                value={testCategory}
                onChange={(e) => setTestCategory(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
              >
                {CATEGORY_NAMES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Proposed Price: {formatCurrency(testPrice)}</span>
              </div>
              <input
                type="range"
                min="199"
                max="25000"
                step="100"
                value={testPrice}
                onChange={(e) => setTestPrice(Number(e.target.value))}
                className="w-full accent-[#1a8fc9]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Proposed Discount: {testDiscount}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="85"
                value={testDiscount}
                onChange={(e) => setTestDiscount(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          <div className="md:col-span-5 p-5 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Predicted Outcome
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-black text-[#0f2a5c]">
                  {prediction.tier} Rating Tier
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#059669]">
                  Fitted
                </span>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-0.5">
                  <span>High Tier Odds</span>
                  <span className="font-mono font-bold text-[#059669]">{prediction.highProb}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#10b981] h-full rounded-full" style={{ width: `${prediction.highProb}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-0.5">
                  <span>Medium Tier Odds</span>
                  <span className="font-mono font-bold text-amber-600">{prediction.medProb}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${prediction.medProb}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
