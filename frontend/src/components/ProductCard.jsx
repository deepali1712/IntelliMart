import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Check, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const id = product.product_id;
  const name = product.product_name || "Product";
  const category = product.main_category || product.primary_category || "General";
  const discPrice = product.discounted_price || product.discounted_price_clean || 0;
  const actPrice = product.actual_price || product.actual_price_clean || 0;
  const discPct = product.discount_percentage || product.discount_percentage_clean || 0;
  const rating = product.rating || product.rating_clean || 0;
  const ratingCount = product.rating_count || product.rating_count_clean || 0;

  // Fallback image SVG if CDN image fails or is blocked
  const fallbackImg =
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1890%20text%20%7B%20fill%3A%2394A3B8%3Bfont-weight%3Abold%3Bfont-family%3Asans-serif%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1890%22%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20fill%3D%22%23F1F5F9%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2275%22%20y%3D%22155%22%3EProduct%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden group">
      {/* Product Image Link */}
      <Link
        to={`/products/${id}`}
        className="block relative aspect-square bg-gray-50 overflow-hidden p-4 flex items-center justify-center border-b border-gray-100"
      >
        <img
          src={imgError || !product.img_link ? fallbackImg : product.img_link}
          alt={name}
          onError={() => setImgError(true)}
          className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {discPct > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            {Math.round(discPct)}% OFF
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
          {category}
        </div>

        <Link
          to={`/products/${id}`}
          className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition mb-2"
          title={name}
        >
          {name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3 text-xs">
          <div className="flex items-center bg-amber-50 text-amber-700 font-semibold px-1.5 py-0.5 rounded border border-amber-200/60">
            <Star size={12} className="fill-amber-400 text-amber-400 mr-1" />
            <span>{Number(rating).toFixed(1)}</span>
          </div>
          <span className="text-gray-400">({Number(ratingCount).toLocaleString()})</span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          {/* Prices */}
          <div>
            <div className="text-base font-bold text-gray-900 tabular-nums">
              ₹{Number(discPrice).toLocaleString()}
            </div>
            {actPrice > discPrice && (
              <div className="text-xs text-gray-400 line-through tabular-nums">
                ₹{Number(actPrice).toLocaleString()}
              </div>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            }`}
            title="Add to demo cart"
          >
            {added ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
