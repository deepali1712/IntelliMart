import { useState, useEffect } from "react";

const BORDER_COLORS = {
  blue: "border-t-blue-500",
  cyan: "border-t-cyan-neon",
  pink: "border-t-pink-neon",
  orange: "border-t-amber-500",
  emerald: "border-t-emerald-500",
  purple: "border-t-violet-glow",
};

const ICON_BG_COLORS = {
  blue: "bg-blue-50 text-blue-600",
  cyan: "bg-cyan-50 text-cyan-600",
  pink: "bg-pink-50 text-pink-neon",
  orange: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-violet-glow",
};

export default function KpiCard({
  title,
  value,
  numericTarget = null,
  prefix = "",
  suffix = "",
  caption,
  icon: Icon,
  color = "blue",
  decimals = 0,
}) {
  const [displayValue, setDisplayValue] = useState(numericTarget !== null ? 0 : value);

  useEffect(() => {
    if (numericTarget === null) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 800; // ms
    const steps = 30;
    const increment = numericTarget / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setDisplayValue(numericTarget);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [numericTarget, value]);

  const formattedValue =
    numericTarget !== null
      ? `${prefix}${decimals > 0 ? Number(displayValue).toFixed(decimals) : Math.round(displayValue).toLocaleString()}${suffix}`
      : value;

  const borderClass = BORDER_COLORS[color] || BORDER_COLORS.blue;
  const iconBgClass = ICON_BG_COLORS[color] || ICON_BG_COLORS.blue;

  return (
    <div
      className={`bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card-soft hover:shadow-xl transition-all duration-300 relative overflow-hidden group border-t-4 ${borderClass}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconBgClass} group-hover:scale-110 transition-transform`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">
        {formattedValue}
      </div>

      {caption && (
        <p className="text-xs text-slate-400 mt-1 font-medium">
          {caption}
        </p>
      )}
    </div>
  );
}
