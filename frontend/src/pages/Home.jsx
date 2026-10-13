import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  ShieldCheck,
  Cpu,
  BarChart3,
  Layers,
} from "lucide-react";
import { fetchCategories, fetchProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import { LoadingSpinner, ErrorState } from "../components/StatusFeedback";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catsRes, featuredRes, recsRes] = await Promise.all([
        fetchCategories(),
        // Featured rule: Rating >= 4.3, high reviews
        fetchProducts({ min_rating: 4.3, sort: "rating", per_page: 8 }),
        // Recommended row: high discount & rating items
        fetchProducts({ min_discount: 50, sort: "discount", per_page: 4 }),
      ]);

      setCategories(catsRes || []);
      setFeaturedProducts(featuredRes.products || []);
      setRecommendedProducts(recsRes.products || []);
    } catch (err) {
      console.error("Home loading error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading IntelliMart catalog..." />;
  if (error) return <ErrorState error={error} onRetry={loadHomeData} />;

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101828] via-[#1E293B] to-[#0F172A] text-white p-8 sm:p-12 shadow-md">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Cpu size={14} />
            <span>AI-Driven Data Intelligence Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Products. <br />
            <span className="text-blue-400">Shop Smarter with Data.</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
            Explore 1,465 authentic Amazon catalog products powered by live TF-IDF NLP
            recommendations, VADER review sentiment analysis, and multidimensional OLAP slicing.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition shadow-sm"
            >
              Explore Full Catalog <ArrowRight size={16} />
            </Link>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold border border-gray-700 transition"
            >
              <Sparkles size={16} className="text-blue-400" />
              Smart Recommendations
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-transparent hover:bg-gray-800/60 text-gray-400 hover:text-white text-sm font-medium border border-gray-700/60 transition"
            >
              <BarChart3 size={15} />
              Open DWM Center
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Benefits & Honesty Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Semantic Recommendations</h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Cosine similarity computed across 5,000 TF-IDF features with top shared keywords explanation.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Empirical VADER Sentiment</h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Rule-based sentiment classification on customer review text with documented thresholds (±0.05).
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Genuine Catalog Data</h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              100% real numbers from the cleaned Amazon dataset with documented median imputation rules.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Category Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Explore by Category</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Browse products categorized across {categories.length} verified catalog departments
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All Products <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm hover:border-blue-400 hover:shadow-md transition text-center group flex flex-col justify-between"
            >
              <div>
                <span className="font-semibold text-xs text-gray-800 group-hover:text-blue-600 transition block truncate">
                  {cat.name}
                </span>
                <span className="text-[11px] text-gray-400 mt-1 block tabular-nums">
                  {cat.product_count} items
                </span>
              </div>
              <div className="mt-3 text-[11px] font-medium text-emerald-600 bg-emerald-50 py-0.5 px-2 rounded-md self-center">
                ★ {cat.avg_rating} avg
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Products (Explicit Rule in UI) */}
      <section className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Featured High-Rated Products</h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Verified Filter Rule
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Rule: Customer rating ≥ 4.3 with top review engagement in dataset.
            </p>
          </div>
          <Link
            to="/products?min_rating=4.3"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            View All High-Rated <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.product_id} product={p} />
          ))}
        </div>
      </section>

      {/* 5. Deep Discount Row */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">High-Discount Deals</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Products with discount ≥ 50% observed in the Amazon catalog.
            </p>
          </div>
          <Link
            to="/products?min_discount=50"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All Deals <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.product_id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
