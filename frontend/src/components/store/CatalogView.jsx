import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  PackageSearch,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { getDataset } from "../../data/generateDataset";
import { CATEGORIES } from "../../data/categories";
import { formatCurrency } from "../../utils/format";
import { useApp } from "../../context/AppContext";

export default function CatalogView() {
  const { state, dispatch } = useApp();
  const { products } = getDataset();

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(45000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 24;

  const toggleCategory = (catName) => {
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(45000);
    setMinRating(0);
    setSortBy("featured");
    setCurrentPage(1);
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search query filter
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        const matchesName = p.productName.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesBrand) return false;
      }

      // Category multi-select
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
        return false;
      }

      // Price cap
      if (p.discountedPrice > maxPrice) return false;

      // Rating cap
      if (minRating > 0 && p.rating < minRating) return false;

      return true;
    });
  }, [products, state.searchQuery, selectedCategories, maxPrice, minRating]);

  // Sort
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.discountedPrice - b.discountedPrice);
      case "price-desc":
        return list.sort((a, b) => b.discountedPrice - a.discountedPrice);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount);
      case "reviews":
        return list.sort((a, b) => b.ratingCount - a.ratingCount);
      case "discount":
        return list.sort((a, b) => b.discountPercentage - a.discountPercentage);
      case "featured":
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Catalog Title Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card-soft">
        <div>
          <span className="text-xs font-bold text-blue-royal uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Catalog Explorer
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 tracking-tight">
            Complete Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Showing <strong className="text-slate-800">{sortedProducts.length}</strong> of {products.length} products
          </p>
        </div>

        {/* Clear Filters Button */}
        {(selectedCategories.length > 0 || maxPrice < 45000 || minRating > 0 || state.searchQuery) && (
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-neon hover:text-red-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 px-3.5 py-2 rounded-xl transition self-start sm:self-auto"
          >
            <RotateCcw size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card-soft space-y-5">
        {/* Category Multi-Select Chips */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Categories (Multi-Select)
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.name);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders and Selects Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-slate-100 text-xs">
          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-slate-700">Maximum Price</span>
              <span className="font-black text-blue-royal tabular-nums text-sm">
                {formatCurrency(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="299"
              max="45000"
              step="500"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-royal"
              aria-label="Filter by maximum price"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹299</span>
              <span>₹45,000</span>
            </div>
          </div>

          {/* Minimum Rating Chips */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Minimum Customer Rating
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "Any", val: 0 },
                { label: "3★+", val: 3.0 },
                { label: "4★+", val: 4.0 },
                { label: "4.5★+", val: 4.5 },
              ].map((tier) => (
                <button
                  key={tier.label}
                  onClick={() => {
                    setMinRating(tier.val);
                    setCurrentPage(1);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border text-center transition ${
                    minRating === tier.val
                      ? "bg-amber-50 text-amber-700 border-amber-300 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 text-xs focus:outline-none focus:border-blue-royal"
              aria-label="Sort products"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="reviews">Most Number of Reviews</option>
              <option value="discount">Biggest Discount %</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4 shadow-card-soft">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <PackageSearch size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your price range, clearing categories, or modifying your search terms.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-blue-royal text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {paginatedProducts.map((p) => (
            <ProductCard key={p.productId} product={p} />
          ))}
        </div>
      )}

      {/* Pagination Controls (24 items per page) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-card-soft text-xs">
          <span className="text-slate-500 font-medium">
            Page <strong className="text-slate-800">{currentPage}</strong> of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-bold flex items-center gap-1"
              aria-label="Previous catalog page"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-bold flex items-center gap-1"
              aria-label="Next catalog page"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
