import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Layers,
  Binary,
  Network,
  MessageSquare,
  Link2,
  TrendingUp,
  Cpu,
  BookOpen,
  Filter,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useFilters } from "../context/FilterContext";

export default function AdminSidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const {
    selectedCategory,
    setSelectedCategory,
    availableCategories,
    filteredCount,
    totalCatalogCount,
    isFiltered,
    resetFilters,
  } = useFilters();

  const navItems = [
    { name: "Overview", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Dataset Explorer", path: "/admin/dataset", icon: <Database size={18} /> },
    { name: "OLAP Operations", path: "/admin/olap", icon: <Layers size={18} /> },
    { name: "Classification (Naïve Bayes)", path: "/admin/classification", icon: <Binary size={18} /> },
    { name: "Clustering (K-Means)", path: "/admin/clustering", icon: <Network size={18} /> },
    { name: "Sentiment (VADER)", path: "/admin/sentiment", icon: <MessageSquare size={18} /> },
    { name: "Association Rules (Apriori)", path: "/admin/association-rules", icon: <Link2 size={18} /> },
    { name: "Regression Analysis", path: "/admin/regression", icon: <TrendingUp size={18} /> },
    { name: "Prediction Playground", path: "/admin/prediction", icon: <Cpu size={18} /> },
    { name: "Viva & System Docs", path: "/admin/docs", icon: <BookOpen size={18} /> },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#101828] text-gray-300 w-64 border-r border-gray-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              DW
            </div>
            <span className="font-bold text-white text-base tracking-tight">
              DWM Center
            </span>
          </div>
          <span className="text-[10px] font-semibold bg-blue-900/60 text-blue-400 px-2 py-0.5 rounded border border-blue-700/50">
            v2.0
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Data Warehouse & Mining Workstation
        </p>
      </div>

      {/* Global Filter Badge & Category Slicer */}
      <div className="p-3 bg-gray-900/90 border-b border-gray-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1 font-semibold text-gray-300">
            <Filter size={13} className="text-blue-400" />
            Warehouse Slice
          </span>
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
              title="Reset all filters"
            >
              <RotateCcw size={10} /> Reset
            </button>
          )}
        </div>

        {/* Filter Badge */}
        <div
          className={`text-[11px] font-medium px-2.5 py-1 rounded-md mb-2 flex items-center justify-between ${
            isFiltered
              ? "bg-blue-950/80 text-blue-300 border border-blue-800/80"
              : "bg-gray-800 text-gray-400 border border-gray-700/60"
          }`}
        >
          <span>{isFiltered ? "Filtered Slice:" : "Dataset Scope:"}</span>
          <span className="font-bold tabular-nums">
            {isFiltered
              ? `${filteredCount} of ${totalCatalogCount}`
              : "Global Data (1,465)"}
          </span>
        </div>

        {/* Category Selector */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-800 text-xs text-gray-200 rounded p-1.5 border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories (Unsliced)" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
              }`}
            >
              <span className={isActive ? "text-white" : "text-gray-400"}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Back Link */}
      <div className="p-3 border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between">
        <Link
          to="/"
          className="text-gray-400 hover:text-white transition flex items-center gap-1.5"
        >
          ← Return to Storefront
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0">{content}</aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
}
