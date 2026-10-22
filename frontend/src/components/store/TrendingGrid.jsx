import { useState, useMemo } from "react";
import { ArrowRight, Flame } from "lucide-react";
import ProductCard from "./ProductCard";
import { getDataset } from "../../data/generateDataset";
import { CATEGORIES } from "../../data/categories";
import { useApp } from "../../context/AppContext";

export default function TrendingGrid() {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { products } = getDataset();

  // Filter top rated products with at least 50 reviews
  const trending = useMemo(() => {
    return products
      .filter((p) => p.ratingCount >= 50)
      .sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount);
  }, [products]);

  const filtered = useMemo(() => {
    let list = trending;
    if (state.searchQuery && state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    return list.slice(0, 8);
  }, [trending, selectedCategory, state.searchQuery]);

  return (
    <section className="space-y-6">
      {/* Header and View All link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
            <Flame size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Trending Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Top customer favorites backed by high satisfaction scores
            </p>
          </div>
        </div>

        <button
          onClick={() => dispatch({ type: "SET_STORE_TAB", payload: "catalog" })}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-royal hover:text-indigo-800 transition group self-start sm:self-auto"
        >
          <span>View All in Catalog</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Category filter chip row (All + 9 categories) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
            selectedCategory === "All"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat.name
                ? "bg-blue-royal text-white shadow-md shadow-indigo-500/25"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid of 8 trending items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </section>
  );
}
