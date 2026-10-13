import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Clock } from "lucide-react";

export default function HowThisWorks({
  algorithm,
  features,
  parameters,
  evaluation,
  limitations,
  timestamp,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 bg-blue-50/70 hover:bg-blue-50 text-blue-900 flex items-center justify-between transition text-left"
      >
        <div className="flex items-center gap-2.5">
          <HelpCircle size={18} className="text-blue-600" />
          <span className="font-semibold text-sm">
            How This Works — DWM Methodology & Viva Defense
          </span>
          <span className="text-xs bg-blue-200/80 text-blue-800 font-medium px-2 py-0.5 rounded-full">
            Viva Guide
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-700">
          <span>{isOpen ? "Hide panel" : "View explanation & math"}</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 space-y-4 text-sm text-gray-700 border-t border-blue-100 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Algorithm */}
            <div className="bg-gray-50/80 p-3.5 rounded-lg border border-gray-200/60">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Algorithm & Objective
              </span>
              <p className="font-medium text-gray-900">{algorithm}</p>
            </div>

            {/* Features Used */}
            <div className="bg-gray-50/80 p-3.5 rounded-lg border border-gray-200/60">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Features & Inputs
              </span>
              <p className="font-medium text-gray-900">{features}</p>
            </div>

            {/* Parameters & Hyperparameters */}
            <div className="bg-gray-50/80 p-3.5 rounded-lg border border-gray-200/60">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Hyperparameters & Thresholds
              </span>
              <p className="font-medium text-gray-900">{parameters}</p>
            </div>

            {/* Evaluation Method */}
            <div className="bg-gray-50/80 p-3.5 rounded-lg border border-gray-200/60">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Validation & Metrics
              </span>
              <p className="font-medium text-gray-900">{evaluation}</p>
            </div>
          </div>

          {/* Limitations & Data Caveats */}
          <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-200/70 text-amber-900">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Academic Limitations & Dataset Honesty
            </span>
            <p className="text-xs leading-relaxed">{limitations}</p>
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <Clock size={13} />
              Last Computed / Evaluated: {timestamp || "Live Runtime (Cached Analytical Frame)"}
            </span>
            <span className="font-mono text-[11px] text-gray-400">
              Dataset: 1,465 verified records
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
