import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiMinus, FiPlus, FiRefreshCw, FiSearch, FiSliders, FiTrendingUp } from "react-icons/fi";
import EmptyState from "../components/EmptyState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SkeletonGrid from "../components/SkeletonGrid.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { productService } from "../services/api.js";
import { currency, stockStatus } from "../utils/formatters.js";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [savingAll, setSavingAll] = useState(false);
  const [stock, setStock] = useState("all");
  const [draftQuantities, setDraftQuantities] = useState({});
  const debouncedQuery = useDebounce(query);

  const params = useMemo(
    () => ({
      q: debouncedQuery,
      stock,
      limit: 48,
      sort: "alpha"
    }),
    [debouncedQuery, stock]
  );

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await productService.list(params);
      setProducts(data.products || []);
      setDraftQuantities(
        (data.products || []).reduce((acc, product) => {
          acc[product._id] = product.quantity;
          return acc;
        }, {})
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [params]);

  const setDraftQuantity = (productId, value) => {
    const nextQuantity = Math.max(0, Number(value || 0));
    setDraftQuantities((current) => ({ ...current, [productId]: nextQuantity }));
  };

  const adjustQuantity = (product, change) => {
    const currentQuantity = Number(draftQuantities[product._id] ?? product.quantity);
    setDraftQuantity(product._id, currentQuantity + change);
  };

  const changedProducts = useMemo(
    () =>
      products
        .filter((product) => Number(draftQuantities[product._id]) !== Number(product.quantity))
        .map((product) => ({ ...product, quantity: Number(draftQuantities[product._id]) })),
    [draftQuantities, products]
  );

  const saveAllChanges = async () => {
    if (changedProducts.length === 0) {
      toast("No inventory changes to save");
      return;
    }

    setSavingAll(true);
    try {
      await productService.bulkUpdate(changedProducts);
      toast.success(`${changedProducts.length} inventory changes saved`);
      window.dispatchEvent(new Event("stockflow:notifications"));
      await loadInventory();
    } finally {
      setSavingAll(false);
    }
  };

  const resetDrafts = () => {
    setDraftQuantities(
      products.reduce((acc, product) => {
        acc[product._id] = product.quantity;
        return acc;
      }, {})
    );
  };

  const totals = products.reduce(
    (acc, product) => {
      const quantity = Number(draftQuantities[product._id] ?? product.quantity);
      acc.units += quantity;
      acc.value += quantity * Number(product.price);
      if (quantity > 0 && quantity < 5) acc.low += 1;
      if (quantity === 0) acc.out += 1;
      return acc;
    },
    { low: 0, out: 0, units: 0, value: 0 }
  );
  const stockHealth = products.length
    ? Math.max(0, Math.round(((products.length - totals.low - totals.out) / products.length) * 100))
    : 100;
  const urgentProducts = products.filter((product) => Number(draftQuantities[product._id] ?? product.quantity) < 5).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Inventory"
        title="Stock tracking"
        subtitle="Adjust quantities, spot low stock warnings, and keep inventory health current in real time."
        actions={
          <>
            <button className="btn-secondary" disabled={changedProducts.length === 0} onClick={resetDrafts}>
              <FiRefreshCw />
              Reset
            </button>
            <button className="btn-primary" disabled={savingAll || changedProducts.length === 0} onClick={saveAllChanges}>
              <FiCheckCircle />
              {savingAll ? "Saving..." : `Save ${changedProducts.length || ""} Changes`}
            </button>
          </>
        }
      />

      <section className="premium-band mb-5 p-5">
        <div className="relative grid gap-5 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-100">Inventory cockpit</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Edit stock in batches, then commit with confidence.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
              Quantity changes stay staged until you save, so updating a full shelf no longer means opening every product one by one.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Bulk edits", "Low stock alerts", "Live totals"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-bold text-slate-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Coverage Score</p>
                <p className="mt-1 text-4xl font-black">{stockHealth}%</p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-mint text-ink">
                <FiSliders className="text-xl" />
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-brand-mint transition-all duration-700" style={{ width: `${stockHealth}%` }} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-200">
              <FiTrendingUp />
              {changedProducts.length} staged changes ready to save
            </div>
          </div>
        </div>
      </section>

      <div className="mb-5 grid gap-3 md:grid-cols-5">
        {[
          ["Units", totals.units],
          ["Value", currency(totals.value)],
          ["Low Stock", totals.low],
          ["Out of Stock", totals.out],
          ["Unsaved", changedProducts.length]
        ].map(([label, value]) => (
          <div key={label} className="surface rounded-lg p-4">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-black text-ink dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="surface mb-5 grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_220px]">
        <label className="relative block">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10" placeholder="Search inventory" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <select className="input" value={stock} onChange={(event) => setStock(event.target.value)}>
          <option value="all">All stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {changedProducts.length > 0 && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          You have {changedProducts.length} unsaved quantity changes. Review them, then save all at once.
        </div>
      )}

      {urgentProducts.length > 0 && (
        <div className="surface mb-5 rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="label">Priority Restock</p>
              <h3 className="mt-1 font-black text-ink dark:text-white">Products needing attention</h3>
            </div>
            <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
              {urgentProducts.length} visible
            </span>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {urgentProducts.map((product) => (
              <div key={product._id} className="rounded-lg bg-slate-50 p-3 dark:bg-white/[0.04]">
                <p className="truncate font-black text-ink dark:text-white">{product.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {draftQuantities[product._id] ?? product.quantity} units left
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <SkeletonGrid count={6} />
      ) : products.length === 0 ? (
        <EmptyState title="No inventory matches" text="Add products or change the stock filters to see inventory cards." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {products.map((product) => {
            const displayQuantity = Number(draftQuantities[product._id] ?? product.quantity);
            const status = stockStatus(displayQuantity);
            const stockPercent = Math.min(100, Math.max(3, (displayQuantity / 20) * 100));
            return (
              <article key={product._id} className="surface rounded-lg p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
                    {product.image ? <img src={product.image} alt={product.title} className="h-full w-full object-cover" /> : <span className="text-xs font-bold text-slate-400">No image</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-black text-ink dark:text-white">{product.title}</h3>
                      <span className={`badge ${status.className}`}>{status.label}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.category} · {currency(product.price)}</p>
                    {displayQuantity < 5 && (
                      <p className="mt-2 text-sm font-bold text-rose-600 dark:text-rose-300">
                        {displayQuantity === 0 ? "Restock immediately" : "Low stock warning"}
                      </p>
                    )}
                    <div className="mt-3 max-w-sm">
                      <div className="progress-track">
                        <div className={`progress-fill ${displayQuantity < 5 ? "!bg-amber-400" : ""}`} style={{ width: `${stockPercent}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-secondary !h-10 !w-10 !p-0" onClick={() => adjustQuantity(product, -1)} aria-label="Decrease quantity">
                      <FiMinus />
                    </button>
                    <input
                      className="input h-10 w-20 text-center font-black"
                      min="0"
                      type="number"
                      value={draftQuantities[product._id] ?? product.quantity}
                      onChange={(event) => setDraftQuantity(product._id, event.target.value)}
                    />
                    <button className="btn-primary !h-10 !w-10 !p-0" onClick={() => adjustQuantity(product, 1)} aria-label="Increase quantity">
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Inventory;
