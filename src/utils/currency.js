// Currency formatting utility
export const formatCurrency = (amount, showSymbol = false) => {
  const num = parseFloat(amount) || 0;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(num));

  if (showSymbol) {
    return `${num < 0 ? "-" : ""}$${formatted}`;
  }
  return `${num < 0 ? "-" : ""}${formatted}`;
};

// Format currency without symbol (for internal calculations display)
export const formatAmount = (amount) => {
  return formatCurrency(amount, false);
};

// Parse currency string back to number
export const parseCurrency = (currencyString) => {
  if (typeof currencyString === "number") return currencyString;
  const cleaned = currencyString.toString().replace(/[$,\s]/g, "");
  return parseFloat(cleaned) || 0;
};
