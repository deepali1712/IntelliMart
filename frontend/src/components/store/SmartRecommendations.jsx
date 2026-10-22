import { useState, useMemo } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import ProductCard from "./ProductCard";
import { getRecommendations } from "../../utils/recommend";
import { useApp } from "../../context/AppContext";

export default function SmartRecommendations() {
  const { state } = useApp();
  const [cycleOffset, setCycleOffset] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract cart product IDs to exclude items already in cart
  const cartProductIds = useMemo(() => {
    return state.cart.map((item) => item.product.productId);
  }, [state.cart]);

  // Compute exactly 4 recommendations deterministically
  const recommendedProducts = useMemo(() => {
    return getRecommendations({
      lastAddedCategory: state.lastAddedCategory,
      cartProductIds,
      count: 4,
      offset: cycleOffset,
    });
  }, [state.lastAddedCategory, cartProductIds, cycleOffset]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCycleOffset((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 350);
  };

  return (
    <section id="recommendations" className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-glow to-hot-pink text-white shadow-md shadow-pink-500/20">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Smart Recommendations
            </h2>

            {/* Dynamic subtitle / badge */}
            <div className="mt-1">
              {state.lastAddedCategory ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-neon/10 text-pink-neon border border-pink-neon/30 text-xs font-black uppercase tracking-wider animate-fade-in">
                  <span>MATCHED TO YOUR CART:</span>
                  <span className="underline decoration-pink-neon/50">{state.lastAddedCategory}</span>
                </span>
              ) : (
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Curated just for you based on multidimensional analysis.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Refresh Suggestions Button */}
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-royal rounded-xl border border-slate-200 shadow-sm text-xs font-bold transition-all duration-200 self-start sm:self-auto hover:border-slate-300 active:scale-95 group"
          aria-label="Refresh smart recommendations suggestions"
        >
          <RefreshCw
            size={14}
            className={`text-hot-pink transition-transform duration-500 ${
              isRefreshing ? "rotate-180" : "group-hover:rotate-45"
            }`}
          />
          <span>Refresh Suggestions</span>
        </button>
      </div>

      {/* Grid of exactly 4 recommended products */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-opacity duration-300 ${
          isRefreshing ? "opacity-60 scale-[0.99]" : "opacity-100 scale-100"
        }`}
      >
        {recommendedProducts.map((p) => (
          <ProductCard
            key={p.productId}
            product={p}
            badgeText="MATCHED RECOMMENDATION"
          />
        ))}
      </div>
    </section>
  );
}
