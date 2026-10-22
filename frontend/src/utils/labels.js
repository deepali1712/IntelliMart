export const LABELS = {
  productId: "Product ID",
  productName: "Product Name",
  category: "Category",
  actualPrice: "Actual Price",
  discountedPrice: "Discounted Price",
  discountPercentage: "Discount %",
  rating: "Customer Rating",
  ratingCount: "Number of Reviews",
  reviewPolarity: "Review Sentiment Score",
  sentimentLabel: "Review Sentiment",
  ratingTier: "Rating Tier",
  salesTier: "Sales Tier",
  // Additional helpful mappings for consistency
  subCategory: "Sub-Category",
  unitsSold: "Units Sold",
  marginRate: "Profit Margin",
  confidence: "Confidence",
  support: "Support",
  lift: "Boost",
};

export function label(key) {
  if (!key) return "";
  return LABELS[key] || String(key).replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
}

export default label;
