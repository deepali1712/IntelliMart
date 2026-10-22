import React, { useState } from "react";
import { Plus, Check, ShoppingBag } from "lucide-react";
import ProductArt from "../common/ProductArt";
import StarRating from "../common/StarRating";
import { formatCurrency, formatPercent } from "../../utils/format";
import { useApp } from "../../context/AppContext";

export default function ProductCard({
  product,
  badgeText = null,
  showCategory = true,
  className = "",
}) {
  const { dispatch } = useApp();
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCardClick = () => {
    dispatch({ type: "OPEN_PRODUCT_MODAL", payload: product });
  };

  const handleAddClick = (e) => {
    e.stopPropagation(); // prevent modal opening on direct add
    dispatch({ type: "ADD_TO_CART", payload: product });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer ${className}`}
    >
      {/* Optional Top-Left Overlapping Badge */}
      {badgeText && (
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-hot-pink text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md shadow-pink-500/30 tracking-wider">
            {badgeText}
          </span>
        </div>
      )}

      {/* Top Image / Generative Artwork Container */}
      <div className="relative mb-3 rounded-xl overflow-hidden bg-slate-50 aspect-square flex items-center justify-center">
        {!imgError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.productName}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <ProductArt
            category={product.category}
            iconKey={product.categoryIcon}
            brand={product.brand}
            className="h-full w-full"
          />
        )}

        {/* Discount Badge on top right */}
        {product.discountPercentage > 0 && !badgeText && (
          <span className="absolute top-2.5 right-2.5 z-10 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
            {Math.round(product.discountPercentage)}% OFF
          </span>
        )}
      </div>

      {/* Details Container */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Chip */}
          {showCategory && (
            <span className="text-[11px] font-bold text-violet-glow uppercase tracking-wider block">
              {product.category}
            </span>
          )}

          {/* Title - 2-line clamp */}
          <h3
            className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mt-1 group-hover:text-blue-royal transition-colors"
            title={product.productName}
          >
            {product.productName}
          </h3>

          {/* Star Rating & Review Count */}
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            <StarRating rating={product.rating} />
            <span className="text-slate-500 font-semibold text-[11px]">
              ({product.ratingCount?.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Pricing Row & Add Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900 font-mono">
                {formatCurrency(product.discountedPrice)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 line-through font-mono">
                {formatCurrency(product.actualPrice)}
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase">
              Save {formatCurrency(product.actualPrice - product.discountedPrice)}
            </span>
          </div>

          {/* + Add Button */}
          <button
            type="button"
            onClick={handleAddClick}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1 shadow-sm ${
              justAdded
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 hover:bg-gradient-to-r hover:from-blue-royal hover:to-indigo-600 text-slate-800 hover:text-white"
            }`}
            aria-label={`Add ${product.productName} to cart`}
          >
            {justAdded ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
