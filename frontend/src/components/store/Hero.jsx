import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Hero({ onScrollToRecommendations }) {
  const { dispatch } = useApp();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-hero-ambient text-white p-8 sm:p-14 lg:p-16 shadow-2xl border border-white/10">
      {/* Soft Ambient Radial Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-neon/15 rounded-full blur-3xl pointer-events-none -translate-y-1/3" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-pink-neon/15 rounded-full blur-3xl pointer-events-none translate-y-1/3" />
      <div className="absolute top-1/2 left-8 w-64 h-64 bg-violet-glow/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headings & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
            <span className="text-white block">Discover Products.</span>
            <span className="text-gradient-cyan">Shop Smarter</span>{" "}
            <span className="text-pink-neon">with Data.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-xl font-normal">
            Explore authentic catalog products powered by live analytics.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Explore Full Catalog button */}
            <button
              onClick={() => dispatch({ type: "SET_STORE_TAB", payload: "catalog" })}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-royal to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight size={16} />
            </button>

            {/* Smart Recommendations button */}
            <button
              onClick={onScrollToRecommendations}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-sm font-bold border border-white/20 backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Sparkles size={16} className="text-pink-neon" />
              <span>Smart Recommendations</span>
            </button>
          </div>

          {/* Live Stats Strip */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>1,465 Products · 9 Categories · 4.1★ Average Rating</span>
          </div>
        </div>

        {/* Right Column (Desktop): Decorative Floating Cluster */}
        <div className="hidden lg:col-span-5 lg:flex items-center justify-center relative">
          <div className="relative w-80 h-72">
            {/* Card 1: Top Floating Card */}
            <div className="absolute -top-4 right-2 w-60 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl transform rotate-3 hover:rotate-0 transition duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-cyan-neon tracking-wider">
                  Top Recommended
                </span>
                <span className="text-xs text-amber-300 font-bold">★ 4.9</span>
              </div>
              <p className="text-xs font-bold text-white line-clamp-1">
                Syncwire USB Fast Charging Cable
              </p>
              <p className="text-sm font-black text-cyan-neon mt-1">₹399</p>
            </div>

            {/* Card 2: Center Floating Card */}
            <div className="absolute top-16 left-0 w-64 p-4 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/25 shadow-2xl transform -rotate-3 hover:rotate-0 transition duration-300 z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-pink-neon tracking-wider">
                  Trending Deal
                </span>
                <span className="text-xs bg-pink-neon text-white font-black px-2 py-0.5 rounded-full">
                  75% OFF
                </span>
              </div>
              <p className="text-xs font-bold text-white line-clamp-1">
                Sony Bravia 4K Ultra HD Smart TV
              </p>
              <p className="text-base font-black text-white mt-1">₹77,990</p>
            </div>

            {/* Card 3: Bottom Floating Card */}
            <div className="absolute -bottom-4 right-6 w-56 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg transform rotate-6 hover:rotate-0 transition duration-300">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <Zap size={15} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">Live Data Match</p>
                  <p className="text-[10px] text-gray-300">Real-time catalog sync</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
