const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrDecimalFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

export function formatCurrency(amount, withDecimals = false) {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return withDecimals ? inrDecimalFormatter.format(amount) : inrFormatter.format(amount);
}

export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return "0";
  return numberFormatter.format(Math.round(num));
}

export function formatPercent(pct, decimals = 1) {
  if (pct === undefined || pct === null || isNaN(pct)) return "0.0%";
  return `${Number(pct).toFixed(decimals)}%`;
}

export function formatRating(rating) {
  if (rating === undefined || rating === null || isNaN(rating)) return "0.0";
  return Number(rating).toFixed(1);
}
