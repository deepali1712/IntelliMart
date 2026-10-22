export default function Badge({
  children,
  variant = "cyan",
  size = "sm",
  className = "",
}) {
  const variants = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-400/30",
    pink: "bg-pink-neon/10 text-pink-neon border-pink-neon/30",
    hotPink: "bg-hot-pink text-white shadow-md shadow-pink-500/30",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    purple: "bg-purple-900/60 text-purple-300 border-purple-700/60",
    blue: "bg-blue-600 text-white shadow-sm",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  };

  const sizes = {
    xs: "text-[10px] px-2 py-0.5",
    sm: "text-xs px-2.5 py-1",
    md: "text-xs px-3.5 py-1.5 font-bold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider border ${variants[variant] || variants.cyan} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
}
