import { SeededRandom } from "../utils/seededRandom";
import { CATEGORIES } from "./categories";

const SEED = 20261022;

export function generateDataset() {
  const rng = new SeededRandom(SEED);
  const products = [];
  let currentId = 1;

  const screens = ["32", "43", "50", "55", "65"];
  const watts = ["10", "16", "20", "40", "60", "100"];

  CATEGORIES.forEach((cat) => {
    const count = cat.targetCount;
    for (let i = 0; i < count; i++) {
      const brand = rng.choice(cat.brands);
      const templateObj = rng.choice(cat.templates);
      const rawTemplate = templateObj.template;
      const subCategory = templateObj.subCategory;
      const screen = rng.choice(screens);
      const watt = rng.choice(watts);

      let name = rawTemplate
        .replace("{brand}", brand)
        .replace("{screen}", screen)
        .replace("{watt}", watt);

      if (i > 10) {
        const variants = ["Pro", "Plus", "Max", "Gen 2", "Series 5", "Elite", "Ultra", "V2", "Carbon Black", "Arctic White", "Midnight Blue"];
        const variant = variants[i % variants.length];
        name = `${name} (${variant})`;
      }

      let baseActualPrice = 0;
      if (cat.name === "Electronics") {
        baseActualPrice = rng.nextFloat(599, 45000);
      } else if (cat.name === "Computers & Accessories") {
        baseActualPrice = rng.nextFloat(399, 12000);
      } else if (cat.name === "Home & Kitchen") {
        baseActualPrice = rng.nextFloat(499, 8500);
      } else if (cat.name === "Office Products") {
        baseActualPrice = rng.nextFloat(149, 2500);
      } else {
        baseActualPrice = rng.nextFloat(399, 9999);
      }

      const baseDiscount = rng.nextFloat(15, 82);

      const ratingNoise = rng.nextFloat(-0.7, 0.7);
      const rawRating = 4.1 + ratingNoise;
      const clampedRating = Math.max(2.1, Math.min(5.0, rawRating));

      const reviewExp = rng.nextFloat(2.5, 5.0);
      const ratingCount = Math.round(Math.pow(10, reviewExp));

      // Image selection from category images
      const imageUrl = cat.images[i % cat.images.length];

      products.push({
        productId: `IM-${String(currentId).padStart(4, "0")}`,
        productName: name,
        category: cat.name,
        subCategory,
        brand,
        actualPrice: Math.round(baseActualPrice),
        discountPercentage: Math.round(baseDiscount * 10) / 10,
        discountedPrice: 0,
        rating: Math.round(clampedRating * 10) / 10,
        ratingCount,
        categoryIcon: cat.icon,
        categoryColor: cat.color,
        imageUrl,
        description: `Experience high-performance reliability with the ${name}. Engineered by ${brand} to deliver outstanding quality, optimal efficiency, and intuitive daily convenience. Backed by full brand warranty and hassle-free returns.`,
        specifications: [
          `Original certified genuine product from ${brand}`,
          `Category: ${cat.name} / ${subCategory}`,
          `Energy efficient and certified commercial grade components`,
          `Includes official documentation, standard accessories, and quick start guide`,
        ],
      });

      currentId++;
    }
  });

  // Target Calibration: Exactly 4.1 Average Rating and 47.7% Average Discount
  const currentAvgRating = products.reduce((acc, p) => acc + p.rating, 0) / products.length;
  const ratingShift = 4.10 - currentAvgRating;

  const currentAvgDisc = products.reduce((acc, p) => acc + p.discountPercentage, 0) / products.length;
  const discShift = 47.70 - currentAvgDisc;

  products.forEach((p) => {
    let adjRating = Math.round((p.rating + ratingShift) * 10) / 10;
    adjRating = Math.max(1.5, Math.min(5.0, adjRating));
    p.rating = adjRating;

    let adjDisc = Math.round((p.discountPercentage + discShift) * 10) / 10;
    adjDisc = Math.max(5.0, Math.min(89.0, adjDisc));
    p.discountPercentage = adjDisc;

    const computedDiscPrice = Math.round(p.actualPrice * (1 - p.discountPercentage / 100));
    p.discountedPrice = Math.max(49, computedDiscPrice);

    // Dimension: Price Band (Budget / Mid / Premium)
    if (p.discountedPrice < 1000) {
      p.priceBand = "Budget";
    } else if (p.discountedPrice <= 5000) {
      p.priceBand = "Mid";
    } else {
      p.priceBand = "Premium";
    }

    // Dimension: Discount Band (0-20%, 20-40%, 40-60%, 60%+)
    if (p.discountPercentage < 20) {
      p.discountBand = "0–20%";
    } else if (p.discountPercentage < 40) {
      p.discountBand = "20–40%";
    } else if (p.discountPercentage < 60) {
      p.discountBand = "40–60%";
    } else {
      p.discountBand = "60%+";
    }

    const polarityBase = (p.rating - 3.0) / 2.0;
    const polarityNoise = rng.nextFloat(-0.15, 0.15);
    const polarity = Math.max(-1.0, Math.min(1.0, polarityBase + polarityNoise));
    p.reviewPolarity = Math.round(polarity * 100) / 100;

    if (p.reviewPolarity >= 0.05) {
      p.sentimentLabel = "Positive";
    } else if (p.reviewPolarity <= -0.05) {
      p.sentimentLabel = "Negative";
    } else {
      p.sentimentLabel = "Neutral";
    }

    // Rating Tier (Low / Medium / High)
    if (p.rating >= 4.3) {
      p.ratingTier = "High";
    } else if (p.rating >= 3.9) {
      p.ratingTier = "Medium";
    } else {
      p.ratingTier = "Low";
    }

    const salesScore = (p.discountPercentage / 100) * 0.4 + (p.rating / 5.0) * 0.4 + (Math.log10(p.ratingCount) / 5.0) * 0.2;
    p.salesTier = salesScore >= 0.58 ? "High Sales Tier" : "Standard";
  });

  const finalAvgRating = (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1);
  const finalAvgDisc = (products.reduce((acc, p) => acc + p.discountPercentage, 0) / products.length).toFixed(1);

  return {
    products,
    totalProducts: products.length,
    totalCategories: CATEGORIES.length,
    averageRating: Number(finalAvgRating),
    averageDiscount: Number(finalAvgDisc),
  };
}

let cachedDataset = null;

export function getDataset() {
  if (!cachedDataset) {
    cachedDataset = generateDataset();
  }
  return cachedDataset;
}
