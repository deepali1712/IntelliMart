import {
  Tv,
  Laptop,
  Coffee,
  Briefcase,
  Music,
  Hammer,
  Gamepad2,
  Car,
  HeartPulse,
  Package,
} from "lucide-react";

const ICON_MAP = {
  Tv,
  Laptop,
  Coffee,
  Briefcase,
  Music,
  Hammer,
  Gamepad2,
  Car,
  HeartPulse,
};

const CATEGORY_PALETTES = {
  "Electronics": {
    bg: "from-cyan-900/40 via-blue-900/30 to-indigo-950/60",
    iconColor: "text-cyan-400",
    badgeBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  "Computers & Accessories": {
    bg: "from-purple-900/40 via-indigo-900/30 to-fuchsia-950/60",
    iconColor: "text-fuchsia-400",
    badgeBg: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
  },
  "Home & Kitchen": {
    bg: "from-amber-900/40 via-orange-900/30 to-rose-950/60",
    iconColor: "text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  "Office Products": {
    bg: "from-emerald-900/40 via-teal-900/30 to-slate-950/60",
    iconColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  "Musical Instruments": {
    bg: "from-violet-900/40 via-purple-900/30 to-indigo-950/60",
    iconColor: "text-violet-400",
    badgeBg: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  "Home Improvement": {
    bg: "from-yellow-900/40 via-amber-900/30 to-slate-950/60",
    iconColor: "text-yellow-400",
    badgeBg: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  },
  "Toys & Games": {
    bg: "from-rose-900/40 via-pink-900/30 to-red-950/60",
    iconColor: "text-rose-400",
    badgeBg: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  },
  "Car & Motorbike": {
    bg: "from-sky-900/40 via-blue-900/30 to-indigo-950/60",
    iconColor: "text-sky-400",
    badgeBg: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  },
  "Health & Personal Care": {
    bg: "from-teal-900/40 via-emerald-900/30 to-slate-950/60",
    iconColor: "text-teal-400",
    badgeBg: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  },
};

export default function ProductArt({
  category = "Electronics",
  iconKey = "Tv",
  brand = "Brand",
  className = "h-44",
}) {
  const IconComponent = ICON_MAP[iconKey] || Package;
  const palette = CATEGORY_PALETTES[category] || CATEGORY_PALETTES["Electronics"];
  const initial = brand ? brand.charAt(0).toUpperCase() : "I";

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden bg-gradient-to-br ${palette.bg} border border-white/10 flex items-center justify-center p-4 shadow-inner ${className}`}
    >
      {/* Subtle Pattern Grid */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Decorative Glow */}
      <div className="absolute w-24 h-24 rounded-full bg-white/5 blur-xl pointer-events-none" />

      {/* Brand Watermark Initial in corner */}
      <span className="absolute top-2.5 right-3 text-xs font-black text-white/30 tracking-wider">
        {initial}
      </span>

      {/* Main Lucide Category Icon */}
      <div className="relative z-10 flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <IconComponent size={44} className={palette.iconColor} strokeWidth={1.6} />
      </div>

      {/* Subtle Bottom Accent Line */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
