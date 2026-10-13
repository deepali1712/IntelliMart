import { useState, useEffect } from "react";
import { Search, Sparkles, ArrowRight, Tag, Info, Layers } from "lucide-react";
import {
  fetchProducts,
  fetchRecommendations,
  fetchTextRecommendations,
} from "../services/api";
import ProductCard from "../components/ProductCard";
import HowThisWorks from "../components/HowThisWorks";
import { LoadingSpinner, ErrorState, EmptyState } from "../components/StatusFeedback";

export default function RecommendationsPage() {
  const [mode, setMode] = useState("product"); // "product" | "text"
  const [productQuery, setProductQuery] = useState("");
  const [textQuery, setTextQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial load: pick first product from catalog
  useEffect(() => {
    loadDefaultProduct();
  }, []);

  const loadDefaultProduct = async () => {
    try {
      const res = await fetchProducts({ per_page: 5 });
      if (res.products && res.products.length > 0) {
        handleSelectProduct(res.products[0]);
      }
    } catch (e) {
      console.error("Failed to load default recommendations product", e);
    }
  };

  const handleProductSearch = async (e) => {
    e.preventDefault();
    if (!productQuery.trim()) return;
    try {
      const res = await fetchProducts({ search: productQuery, per_page: 6 });
      setSearchResults(res.products || []);
    } catch (e) {
      console.error("Product search failed", e);
    }
  };

  const handleSelectProduct = async (prod) => {
    setSelectedProduct(prod);
    setSearchResults([]);
    setLoading(true);
    setError(null);
    try {
      const recs = await fetchRecommendations(prod.product_id, 5);
      setRecommendations(recs || []);
    } catch (err) {
      console.error("Recommender fetch error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSearch = async (e) => {
    e.preventDefault();
    if (!textQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const recs = await fetchTextRecommendations(textQuery, 5);
      setRecommendations(recs || []);
    } catch (err) {
      console.error("Text recommender error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Sparkles size={14} /> Content-Based NLP Filtering
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Smart Product Recommender
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
          Powered by a 5,000-feature TF-IDF matrix fit over product names, categories, and descriptions.
          Cosine similarity measures semantic term alignment between items.
        </p>
      </div>

      {/* Viva / How this works */}
      <HowThisWorks
        algorithm="TF-IDF (Term Frequency-Inverse Document Frequency) Vectorization + Cosine Similarity Matrix"
        features="Concatenated text corpus: product_name + main_category + sub_category + about_product text"
        parameters="max_features=5,000, ngram_range=(1,2), english stop words removed, top_k=5 items"
        evaluation="Cosine similarity score = (A · B) / (||A|| ||B||) in range [0, 100%]. Query item strictly excluded."
        limitations="Recommendations reflect vocabulary and description overlap in this specific Amazon dataset. Scores represent semantic similarity, NOT purchase probability."
      />

      {/* Mode Switcher */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setMode("product")}
          className={`pb-2 px-3 text-xs font-bold transition border-b-2 ${
            mode === "product"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          1. Pick a Product to Find Similar Items
        </button>
        <button
          onClick={() => setMode("text")}
          className={`pb-2 px-3 text-xs font-bold transition border-b-2 ${
            mode === "text"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          2. Free-Text Semantic Query
        </button>
      </div>

      {/* Input controls based on mode */}
      {mode === "product" ? (
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <form onSubmit={handleProductSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search a product from the catalog (e.g. 'cables', 'mouse', 'earphones')..."
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-500"
              />
              <Search size={15} className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Search
            </button>
          </form>

          {/* Quick search dropdown options */}
          {searchResults.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-2 bg-gray-50 space-y-1">
              <span className="text-[11px] font-semibold text-gray-500 px-2 block">
                Select an item to compute similarities:
              </span>
              {searchResults.map((prod) => (
                <button
                  key={prod.product_id}
                  onClick={() => handleSelectProduct(prod)}
                  className="w-full text-left p-2 rounded hover:bg-white text-xs text-gray-800 transition flex items-center justify-between"
                >
                  <span className="truncate pr-4 font-medium">{prod.product_name}</span>
                  <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded shrink-0">
                    {prod.main_category}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Currently selected product card preview */}
          {selectedProduct && (
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                  Active Seed Product
                </span>
                <h3 className="font-bold text-sm text-gray-900 mt-0.5 line-clamp-1">
                  {selectedProduct.product_name}
                </h3>
                <span className="text-xs text-gray-500">
                  {selectedProduct.main_category} • ₹{selectedProduct.discounted_price || selectedProduct.discounted_price_clean}
                </span>
              </div>
              <span className="text-xs bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg shrink-0">
                Computing Top 5 Similar
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm space-y-3">
          <form onSubmit={handleTextSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter free-text keywords (e.g., 'wireless bluetooth noise cancelling earphones with mic')..."
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-500"
              />
              <Sparkles size={15} className="absolute left-3 top-3 text-blue-500" />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Analyze
            </button>
          </form>
          <p className="text-[11px] text-gray-400">
            Transforms your natural language query into TF-IDF term weights and projects it against all 1,465 catalog items.
          </p>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Layers size={18} className="text-blue-600" />
          Recommended Items (Top 5 Cosine Similarity)
        </h2>

        {loading ? (
          <LoadingSpinner message="Calculating vector dot products and ranking similarities..." />
        ) : error ? (
          <ErrorState error={error} onRetry={loadDefaultProduct} />
        ) : recommendations.length === 0 ? (
          <EmptyState
            title="No recommendations generated yet"
            message="Search for a product or enter keywords above to run the TF-IDF engine."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.product_id}
                className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {rec.similarity_score}% similarity
                    </span>
                  </div>

                  <img
                    src={rec.img_link}
                    alt={rec.product_name}
                    className="h-28 w-full object-contain mx-auto mb-2 bg-gray-50 rounded p-2"
                  />

                  <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1">
                    {rec.product_name}
                  </h3>

                  <div className="text-xs font-bold text-gray-900 tabular-nums">
                    ₹{rec.discounted_price?.toLocaleString()}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 space-y-2">
                  <div className="text-[10px] text-gray-500 bg-gray-50 p-1.5 rounded leading-tight">
                    <span className="font-semibold block text-gray-700">Reason:</span>
                    {rec.reason}
                  </div>

                  <a
                    href={`/products/${rec.product_id}`}
                    className="w-full block text-center py-1 bg-gray-100 hover:bg-blue-600 hover:text-white rounded text-[11px] font-semibold text-gray-700 transition"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
