import React, { useState } from "react";
import {
  ChevronDown,
  Download,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { CATEGORIES } from "../../data/categories";

export default function DwmHeader({
  title,
  subtitle,
  exportData = [],
  exportFilename = "intellimart_export.csv",
  onFilterChange,
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewPreset, setViewPreset] = useState("Default View");
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);

  // Filter state
  const [selectedCat, setSelectedCat] = useState("All");
  const [minRating, setMinRating] = useState("All");

  const handleExportCSV = () => {
    if (!exportData || exportData.length === 0) return;
    const headers = Object.keys(exportData[0]);
    const csvRows = [
      headers.join(","),
      ...exportData.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            if (typeof val === "string") return `"${val.replace(/"/g, '""')}"`;
            return val;
          })
          .join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({ category: selectedCat, minRating });
    }
    setFilterOpen(false);
  };

  const handleResetFilter = () => {
    setSelectedCat("All");
    setMinRating("All");
    if (onFilterChange) {
      onFilterChange({ category: "All", minRating: "All" });
    }
    setFilterOpen(false);
  };

  return (
    <div className="relative mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2a5c] tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#64748b] font-medium mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center gap-2.5 relative">
          {/* Default View Dropdown Pill (Mint-tinted) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#d1fae5] hover:bg-[#a7f3d0] text-[#065f46] text-xs font-bold border border-[#a7f3d0] transition-colors shadow-sm"
            >
              <span>{viewPreset}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#059669]" />
            </button>

            {viewDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30 animate-fade-in text-xs font-semibold text-slate-700">
                {["Default View", "Executive Summary", "Detailed Analytics"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setViewPreset(preset);
                      setViewDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors ${
                      viewPreset === preset ? "text-[#065f46] font-bold bg-[#ecfdf5]" : ""
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button (White with icon) */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/80 shadow-sm transition-all"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {/* Filter Button (Solid Teal-Blue with icon) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1a8fc9] hover:bg-[#167cae] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>

            {/* Filter Popover */}
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 z-40 animate-fade-in space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-[#0f2a5c] uppercase tracking-wider">
                    Quick Filter
                  </span>
                  <button
                    type="button"
                    onClick={handleResetFilter}
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Category Scope
                  </label>
                  <select
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Rating Tier
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
                  >
                    <option value="All">All Ratings</option>
                    <option value="4.5">★ 4.5 & Above (High)</option>
                    <option value="4.0">★ 4.0 & Above (Medium+)</option>
                    <option value="3.5">★ 3.5 & Above</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyFilter}
                    className="w-full py-2 bg-[#1a8fc9] hover:bg-[#167cae] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
