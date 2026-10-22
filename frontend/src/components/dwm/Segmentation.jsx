import React, { useState, useMemo } from "react";
import {
  Users,
  Sliders,
  MoreHorizontal,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { getAnalytics } from "../../data/analytics";
import { formatCurrency, formatNumber } from "../../utils/format";
import { label } from "../../utils/labels";
import DwmHeader from "./DwmHeader";

const SEGMENT_PALETTE = [
  "#1a8fc9", // ocean blue
  "#10b981", // mint emerald
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f43f5e", // rose
  "#84cc16", // lime
];

export default function Segmentation() {
  const analytics = useMemo(() => getAnalytics(), []);
  const [k, setK] = useState(4);
  const [xAxisKey, setXAxisKey] = useState("actualPrice");
  const [yAxisKey, setYAxisKey] = useState("discountPercentage");

  const [selectedFeatures, setSelectedFeatures] = useState([
    "actualPrice",
    "discountPercentage",
    "rating",
    "ratingCount",
  ]);

  const toggleFeature = (key) => {
    if (selectedFeatures.includes(key)) {
      if (selectedFeatures.length > 2) {
        setSelectedFeatures(selectedFeatures.filter((f) => f !== key));
      }
    } else {
      setSelectedFeatures([...selectedFeatures, key]);
    }
  };

  const { segments, scatterPoints } =
    analytics.segmentationCache[k] || analytics.segmentationCache[4];

  const pointsBySegment = useMemo(() => {
    const map = {};
    segments.forEach((seg) => {
      map[seg.id] = [];
    });
    scatterPoints.forEach((pt) => {
      if (map[pt.segmentId]) {
        map[pt.segmentId].push(pt);
      }
    });
    return map;
  }, [segments, scatterPoints]);

  return (
    <div>
      <DwmHeader
        title="Market & Customer Segmentation"
        subtitle="Multivariate customer and product cohort clustering across catalog dimensions to identify target retail archetypes."
        exportData={segments}
        exportFilename="customer_segments.csv"
      />

      {/* Controls Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm mb-6 relative space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1a8fc9]" />
            <h3 className="text-base font-bold text-[#0f2a5c]">
              Clustering Control & Feature Dimensions
            </h3>
          </div>
          <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Segment Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Target Cohort Count:</span>
              <span className="font-mono text-base font-black text-[#1a8fc9]">
                k = {k} Segments
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-full accent-[#1a8fc9]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>2</span>
              <span>4 (Recommended)</span>
              <span>8</span>
            </div>
          </div>

          {/* Feature Chips */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Clustering Feature Dimensions:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "actualPrice", label: "Actual Price" },
                { key: "discountPercentage", label: "Discount %" },
                { key: "rating", label: "Customer Rating" },
                { key: "ratingCount", label: "Number of Reviews" },
              ].map((feat) => {
                const isSelected = selectedFeatures.includes(feat.key);
                return (
                  <button
                    key={feat.key}
                    type="button"
                    onClick={() => toggleFeature(feat.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-[#1e3a6e] text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    {feat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Axis Selectors */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">X-Axis:</span>
              <select
                value={xAxisKey}
                onChange={(e) => setXAxisKey(e.target.value)}
                className="font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
              >
                <option value="actualPrice">Actual Price</option>
                <option value="discountedPrice">Discounted Price</option>
                <option value="discountPercentage">Discount %</option>
                <option value="rating">Customer Rating</option>
                <option value="ratingCount">Number of Reviews</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Y-Axis:</span>
              <select
                value={yAxisKey}
                onChange={(e) => setYAxisKey(e.target.value)}
                className="font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
              >
                <option value="discountPercentage">Discount %</option>
                <option value="actualPrice">Actual Price</option>
                <option value="rating">Customer Rating</option>
                <option value="ratingCount">Number of Reviews</option>
              </select>
            </div>
          </div>

          <span className="text-slate-400 font-mono">
            {scatterPoints.length} Sample Catalog Points
          </span>
        </div>
      </div>

      {/* Colorful 2D Scatter Plot Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-sm mb-8 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0f2a5c]">
              Multi-Cluster Scatter Visualization
            </h3>
            <p className="text-xs text-slate-500">Interactive 2D spatial mapping colored by assigned segment membership</p>
          </div>
          <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600" aria-label="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey={xAxisKey}
                name={label(xAxisKey)}
                tick={{ fontSize: 11, fill: "#64748b" }}
                unit={xAxisKey.includes("Price") ? "₹" : xAxisKey.includes("Percentage") ? "%" : ""}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey={yAxisKey}
                name={label(yAxisKey)}
                tick={{ fontSize: 11, fill: "#64748b" }}
                unit={yAxisKey.includes("Price") ? "₹" : yAxisKey.includes("Percentage") ? "%" : ""}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#0f2a5c] text-white p-3 rounded-2xl shadow-xl border border-white/10 text-xs space-y-1">
                        <div className="font-bold text-cyan-neon truncate max-w-xs">{data.productName}</div>
                        <div className="text-slate-300 font-semibold">{data.category}</div>
                        <div className="text-emerald-400 font-bold">Cohort: {data.segmentName}</div>
                        <div className="text-slate-300 font-mono pt-1 border-t border-white/10">
                          {label(xAxisKey)}: {data[xAxisKey]} | {label(yAxisKey)}: {data[yAxisKey]}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend formatter={(value) => <span className="text-xs font-bold text-slate-700">{value}</span>} />
              {segments.map((seg, idx) => (
                <Scatter
                  key={seg.id}
                  name={seg.name}
                  data={pointsBySegment[seg.id] || []}
                  fill={SEGMENT_PALETTE[idx % SEGMENT_PALETTE.length]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Centroid Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {segments.map((seg, idx) => {
          const color = SEGMENT_PALETTE[idx % SEGMENT_PALETTE.length];
          return (
            <div
              key={seg.id}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: color }} />

              <div>
                <div className="flex items-start justify-between gap-2 mb-2 pt-2">
                  <h4 className="font-bold text-slate-900 text-sm">{seg.name}</h4>
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: color }}
                  >
                    {seg.share}%
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-4 font-mono">
                  {formatNumber(seg.size)} products
                </div>

                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Average Price:</span>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(seg.avgPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Average Discount:</span>
                    <span className="font-mono font-bold text-emerald-600">{seg.avgDiscount}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Average Rating:</span>
                    <span className="font-mono font-bold text-amber-600">★ {seg.avgRating}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Centroid Fitted</span>
                <MoreHorizontal className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
