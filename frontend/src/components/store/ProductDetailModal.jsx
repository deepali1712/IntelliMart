import React, { useEffect, useState } from "react";
import {
  X,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Check,
  MessageSquareHeart,
  Tag,
} from "lucide-react";
import { formatCurrency, formatNumber } from "../../utils/format";
import { useApp } from "../../context/AppContext";
import ProductArt from "../common/ProductArt";

export default function ProductDetailModal() {
  const { state, dispatch } = useApp();
  const product = state.selectedProduct;
  const [imageError, setImageError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dispatch({ type: "CLOSE_PRODUCT_MODAL" });
      }
    };
    if (product) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // lock background scroll
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [product, dispatch]);

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    dispatch({ type: "CLOSE_PRODUCT_MODAL" });
    dispatch({ type: "OPEN_CART" });
  };

  const positivePercent =
    product.sentimentLabel === "Positive"
      ? Math.round(75 + product.rating * 4.5)
      : product.sentimentLabel === "Neutral"
      ? 62
      : 38;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0f051d]/80 backdrop-blur-md transition-opacity"
        onClick={() => dispatch({ type: "CLOSE_PRODUCT_MODAL" })}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 z-10 animate-fade-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => dispatch({ type: "CLOSE_PRODUCT_MODAL" })}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          {/* Left Column: Product Image & Trust Badges */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 aspect-square flex items-center justify-center shadow-inner group">
              {!imageError && product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <ProductArt
                  category={product.category}
                  iconKey={product.categoryIcon}
                  brand={product.brand}
                  className="h-full w-full"
                />
              )}

              {/* Discount Tag */}
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-pink-neon text-white text-xs font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                  {Math.round(product.discountPercentage)}% OFF
                </span>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <div className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-700">
                <Truck className="w-4 h-4 text-blue-royal" />
                <span>Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-700 border-x border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>1-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-700">
                <RotateCcw className="w-4 h-4 text-violet-600" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Specs, Sentiment, Actions */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-royal bg-blue-50 px-2.5 py-1 rounded-lg">
                  {product.category}
                </span>
                {product.subCategory && (
                  <span className="text-xs font-semibold text-slate-500">
                    / {product.subCategory}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.productName}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-white font-extrabold text-xs shadow-sm">
                  <span>★ {product.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {formatNumber(product.ratingCount)} verified customer reviews
                </span>
              </div>

              {/* Pricing Box */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    {formatCurrency(product.discountedPrice)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 line-through font-mono">
                    {formatCurrency(product.actualPrice)}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Save {Math.round(product.discountPercentage)}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Inclusive of all standard retail taxes</p>
              </div>

              {/* Customer Review Sentiment Summary */}
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <MessageSquareHeart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Customer Review Sentiment Summary
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Evaluated across customer purchase evaluations
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono">
                  {positivePercent}% Positive
                </span>
              </div>

              {/* Product Description */}
              <div className="mt-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Product Overview
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="mt-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Key Specifications
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {product.specifications?.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-royal shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedAnimation ? "Added!" : "Add to Cart"}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-royal to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-95"
              >
                <Zap className="w-4 h-4 text-cyan-neon" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
