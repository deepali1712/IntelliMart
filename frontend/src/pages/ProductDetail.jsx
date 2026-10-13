import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Check,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Info,
} from "lucide-react";
import { fetchProductDetails } from "../services/api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { LoadingSpinner, ErrorState } from "../components/StatusFeedback";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    loadDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const loadDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductDetails(id);
      setProduct(data);
    } catch (err) {
      console.error("Error loading product detail", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving catalog specifications & sentiment..." />;
  if (error) return <ErrorState error={error} onRetry={loadDetail} title="Product Not Found" />;
  if (!product) return null;

  const discPrice = product.discounted_price || 0;
  const actPrice = product.actual_price || 0;
  const discPct = product.discount_percentage || 0;
  const rating = product.rating || 0;
  const ratingCount = product.rating_count || 0;
  const sentiment = product.sentiment;
  const similar = product.similar_products || [];

  const fallbackImg =
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1890%20text%20%7B%20fill%3A%2394A3B8%3Bfont-weight%3Abold%3Bfont-family%3Asans-serif%3Bfont-size%3A18pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1890%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23F1F5F9%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22120%22%20y%3D%22205%22%3EProduct%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";

  return (
    <div className="space-y-10 pb-16">
      {/* Back breadcrumb */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>

      {/* Main Product Showcase */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Product Image */}
        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center border border-gray-100 aspect-square relative">
          <img
            src={imgError || !product.img_link ? fallbackImg : product.img_link}
            alt={product.product_name}
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain"
          />
          {discPct > 0 && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
              {Math.round(discPct)}% OFF
            </span>
          )}
        </div>

        {/* Right: Product Spec & Actions */}
        <div className="space-y-5">
          {/* Category path */}
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {product.main_category} &gt; {product.sub_category}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
            {product.product_name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200/70">
              <Star size={15} className="fill-amber-400 text-amber-400 mr-1.5" />
              <span>{Number(rating).toFixed(1)}</span>
            </div>
            <span className="text-gray-500 text-xs">
              Based on {Number(ratingCount).toLocaleString()} customer ratings in dataset
            </span>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gray-900 tabular-nums">
              ₹{Number(discPrice).toLocaleString()}
            </span>
            {actPrice > discPrice && (
              <span className="text-base text-gray-400 line-through tabular-nums">
                ₹{Number(actPrice).toLocaleString()}
              </span>
            )}
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded ml-auto">
              Save ₹{Number(actPrice - discPrice).toLocaleString()}
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                >
                  -
                </button>
                <span className="px-3 py-1 text-sm font-semibold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Demo Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Add to Cart (Demo)
                </>
              )}
            </button>
          </div>

          {/* Source Link */}
          {product.product_link && (
            <div className="pt-2">
              <a
                href={product.product_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 underline"
              >
                <span>View original Amazon listing</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Product Description / About */}
      {product.about_product && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Info size={18} className="text-blue-600" />
            Product Features & Details
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            {product.about_product}
          </p>
        </div>
      )}

      {/* Review Sentiment Analysis Section */}
      {sentiment && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Customer Review Sentiment Analysis (VADER)
              </h2>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                sentiment.sentiment === "Positive"
                  ? "bg-emerald-100 text-emerald-800"
                  : sentiment.sentiment === "Negative"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Overall: {sentiment.sentiment} (Compound: {sentiment.compound})
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-emerald-50 border border-emerald-200/60 p-3 rounded-xl">
              <span className="text-xs text-emerald-700 font-semibold block">Positive Content</span>
              <span className="text-lg font-extrabold text-emerald-800 tabular-nums">
                {Math.round((sentiment.pos || 0) * 100)}%
              </span>
            </div>
            <div className="bg-gray-50 border border-gray-200/60 p-3 rounded-xl">
              <span className="text-xs text-gray-600 font-semibold block">Neutral Content</span>
              <span className="text-lg font-extrabold text-gray-700 tabular-nums">
                {Math.round((sentiment.neu || 0) * 100)}%
              </span>
            </div>
            <div className="bg-red-50 border border-red-200/60 p-3 rounded-xl">
              <span className="text-xs text-red-700 font-semibold block">Negative Content</span>
              <span className="text-lg font-extrabold text-red-800 tabular-nums">
                {Math.round((sentiment.neg || 0) * 100)}%
              </span>
            </div>
          </div>

          {sentiment.review_snippet && (
            <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 italic border border-gray-100">
              "{sentiment.review_snippet}"
            </div>
          )}
        </div>
      )}

      {/* Semantic Similar Products */}
      {similar.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles size={18} className="text-blue-600" />
                Semantically Similar Products (NLP Recommender)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Top similar items ranked by Cosine Similarity on TF-IDF vectors
              </p>
            </div>
            <Link
              to="/recommendations"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Explore Recommender Engine →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((s) => (
              <ProductCard key={s.product_id} product={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
