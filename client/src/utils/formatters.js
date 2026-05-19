export const currency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

export const stockStatus = (quantity = 0) => {
  if (quantity <= 0) return { label: "Out of Stock", className: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200" };
  if (quantity < 5) return { label: "Low Stock", className: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200" };
  return { label: "In Stock", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200" };
};
