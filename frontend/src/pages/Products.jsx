import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { fetchProducts, fetchCategories } from "../services/api";
import ProductCard from "../components/ProductCard";
import { LoadingSpinner, ErrorState, EmptyState } from "../components/StatusFeedback";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state synced with query params
  const categoryParam = searchParams.get("category") || "All";
  const searchParam = searchParams.get("search") || "";
  const minRatingParam = searchParams.get("min_rating") || "";
  const minDiscountParam = searchParams.get("min_discount") || "";
  const maxPriceParam = searchParams.get("max_price") || "";
  const sortParam = searchParams.get("sort") || "relevance";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats || []);
    } catch (e) {
      console.error("Failed to load categories", e);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProducts({
        category: categoryParam,
        search: searchParam,
        min_rating: minRatingParam ? parseFloat(minRatingParam) : undefined,
        min_discount: minDiscountParam ? parseFloat(minDiscountParam) : undefined,
        max_price: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
        sort: sortParam,
        page: pageParam,
        per_page: 20,
      });

      setProducts(res.products || []);
      setMeta(res.meta || { total: 0, page: 1, total_pages: 1 });
    } catch (err) {
      console.error("Error loading products", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== "All" && val !== "") {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    next.set("page", "1"); // reset to page 1 on filter change
    setSearchParams(next);
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", newPage.toString());
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const isFiltered =
    categoryParam !== "All" ||
    searchParam !== "" ||
    minRatingParam !== "" ||
    minDiscountParam !== "" ||
    maxPriceParam !== "" ||
    sortParam !== "relevance";

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
          <Filter size={16} /> Filters
        </h3>
        {isFiltered && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <RotateCcw size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Category
        </label>
        <select
          value={categoryParam}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="w-full bg-white text-xs border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.product_count})
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Minimum Rating
        </label>
        <div className="space-y-1.5 text-xs">
          {[
            { label: "Any Rating", val: "" },
            { label: "4.3★ and above (High Tier)", val: "4.3" },
            { label: "4.0★ and above", val: "4.0" },
            { label: "3.5★ and above", val: "3.5" },
          ].map((item) => (
            <label key={item.val} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating_filter"
                checked={minRatingParam === item.val}
                onChange={() => updateFilter("min_rating", item.val)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Discount */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Discount Depth
        </label>
        <div className="space-y-1.5 text-xs">
          {[
            { label: "Any Discount", val: "" },
            { label: "70% or more", val: "70" },
            { label: "50% or more", val: "50" },
            { label: "30% or more", val: "30" },
          ].map((item) => (
            <label key={item.val} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="discount_filter"
                checked={minDiscountParam === item.val}
                onChange={() => updateFilter("min_discount", item.val)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Max Price Cap */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Price Limit (₹)
        </label>
        <div className="space-y-1.5 text-xs">
          {[
            { label: "No Limit", val: "" },
            { label: "Under ₹1,000", val: "1000" },
            { label: "Under ₹2,500", val: "2500" },
            { label: "Under ₹5,000", val: "5000" },
            { label: "Under ₹15,000", val: "15000" },
          ].map((item) => (
            <label key={item.val} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price_filter"
                checked={maxPriceParam === item.val}
                onChange={() => updateFilter("max_price", item.val)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header / Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {meta.total} products {categoryParam !== "All" && `in ${categoryParam}`}
            {searchParam && ` matching "${searchParam}"`}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search in catalog..."
              value={searchParam}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="text-xs bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-2 w-48 sm:w-60 focus:outline-none focus:border-blue-500"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            {searchParam && (
              <button
                onClick={() => updateFilter("search", "")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500">Sort:</span>
            <select
              value={sortParam}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="text-xs bg-gray-50 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            >
              <option value="relevance">Catalog Order</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
          >
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Main Catalog Grid & Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm sticky top-20">
          <FilterPanel />
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <LoadingSpinner message="Filtering verified Amazon products..." />
          ) : error ? (
            <ErrorState error={error} onRetry={loadProducts} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products matched your criteria"
              message="Try broadening your category, rating, or discount filters."
              onReset={clearAllFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.product_id} product={p} />
                ))}
              </div>

              {/* Server-side Pagination */}
              {meta.total_pages > 1 && (
                <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Page <span className="font-semibold text-gray-900">{meta.page}</span> of{" "}
                    <span className="font-semibold text-gray-900">{meta.total_pages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={meta.page <= 1}
                      onClick={() => handlePageChange(meta.page - 1)}
                      className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <button
                      disabled={meta.page >= meta.total_pages}
                      onClick={() => handlePageChange(meta.page + 1)}
                      className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative z-10 w-80 bg-white h-full p-5 overflow-y-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
}
