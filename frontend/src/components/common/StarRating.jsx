import { Star } from "lucide-react";

export default function StarRating({
  rating = 4.0,
  reviews = null,
  size = 13,
  showCount = true,
  className = "",
}) {
  const numericRating = Number(rating) || 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating - fullStars >= 0.4;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs ${className}`}
      aria-label={`Customer rating: ${numericRating.toFixed(1)} out of 5 stars`}
    >
      <div className="flex items-center text-amber-400">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-amber-400 text-amber-400" />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-amber-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={size} className="fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: Math.max(0, emptyStars) }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-slate-300" />
        ))}
      </div>

      <span className="font-bold text-slate-800 tabular-nums">
        {numericRating.toFixed(1)}
      </span>

      {showCount && reviews !== null && (
        <span className="text-slate-400 tabular-nums text-[11px]">
          ({Number(reviews).toLocaleString()})
        </span>
      )}
    </div>
  );
}
