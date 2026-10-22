import { getDataset } from "../data/generateDataset";

const COMPLEMENTARY_MAP = {
  "Computers & Accessories": ["Electronics", "Office Products"],
  "Electronics": ["Computers & Accessories", "Musical Instruments", "Car & Motorbike"],
  "Home & Kitchen": ["Home Improvement", "Health & Personal Care"],
  "Office Products": ["Computers & Accessories", "Electronics"],
  "Musical Instruments": ["Electronics", "Computers & Accessories"],
  "Home Improvement": ["Home & Kitchen", "Car & Motorbike"],
  "Toys & Games": ["Electronics", "Computers & Accessories"],
  "Car & Motorbike": ["Electronics", "Home Improvement"],
  "Health & Personal Care": ["Home & Kitchen", "Electronics"],
};

export function getRecommendations({
  lastAddedCategory = null,
  cartProductIds = [],
  count = 4,
  offset = 0,
}) {
  const { products } = getDataset();
  const excludedIds = new Set(cartProductIds || []);

  // Filter out products already in cart
  const available = products.filter((p) => !excludedIds.has(p.productId));

  if (!lastAddedCategory) {
    // When cart is empty, pick top-rated high-engagement products
    const sorted = [...available].sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount);
    const start = (offset * count) % Math.max(1, sorted.length - count);
    return sorted.slice(start, start + count);
  }

  // Find complementary categories
  const complementaryCategories = COMPLEMENTARY_MAP[lastAddedCategory] || [];
  const targetCategories = [lastAddedCategory, ...complementaryCategories];

  // Candidates in target categories
  const matched = available.filter((p) => targetCategories.includes(p.category));

  // Sort candidates by match priority:
  // 1. Same category first, then complementary
  // 2. High rating and review count
  matched.sort((a, b) => {
    const aSame = a.category === lastAddedCategory ? 1 : 0;
    const bSame = b.category === lastAddedCategory ? 1 : 0;
    if (aSame !== bSame) return bSame - aSame;
    return b.rating - a.rating || b.ratingCount - a.ratingCount;
  });

  const start = (offset * count) % Math.max(1, matched.length - count);
  const result = matched.slice(start, start + count);

  // If fewer than count, pad with highest-rated available
  if (result.length < count) {
    const pad = available
      .filter((p) => !result.some((r) => r.productId === p.productId))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, count - result.length);
    return [...result, ...pad];
  }

  return result;
}
