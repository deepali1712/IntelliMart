import React from "react";
import { PackageSearch } from "lucide-react";

export default function EmptyState({
  title = "No Matching Products Found",
  message = "Try clearing or broadening your search keywords or filter thresholds.",
  onAction,
  actionText = "Reset Filters",
}) {
  return (
    <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm max-w-lg mx-auto">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <PackageSearch className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
          {message}
        </p>
      </div>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-royal text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
