import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiMinus, FiPlus, FiSearch } from "react-icons/fi";
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
  const [stock, setStock] = useState("all");
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [params]);

  const adjustQuantity = async (product, change) => {
    const nextQuantity = Math.max(0, Number(product.quantity) + change);
    setProducts((current) =>
      current.map((item) => (item._id === product._id ? { ...item, quantity: nextQuantity } : item))
    );

    try {
      await productService.update(product._id, { quantity: nextQuantity });
      toast.success("Inventory updated");
    } catch (_error) {
      await loadInventory();
    }
  };

  const setQuantity = async (product, value) => {
    const nextQuantity = Math.max(0, Number(value || 0));
    setProducts((current) =>
      current.map((item) => (item._id === product._id ? { ...item, quantity: nextQuantity } : item))
    );
    await productService.update(product._id, { quantity: nextQuantity });
    toast.success("Stock quantity saved");
  };

  const totals = products.reduce(
    (acc, product) => {
      acc.units += Number(product.quantity);
      acc.value += Number(product.quantity) * Number(product.price);
      if (product.quantity > 0 && product.quantity < 5) acc.low += 1;
      if (product.quantity === 0) acc.out += 1;
      return acc;
    },
    { low: 0, out: 0, units: 0, value: 0 }
  );

  return (
    <>
      <PageHeader
        eyebrow="Inventory"
        title="Stock tracking"
        subtitle="Adjust quantities, spot low stock warnings, and keep inventory health current in real time."
      />

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        {[
          ["Units", totals.units],
          ["Value", currency(totals.value)],
          ["Low Stock", totals.low],
          ["Out of Stock", totals.out]
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

      {loading ? (
        <SkeletonGrid count={6} />
      ) : products.length === 0 ? (
        <EmptyState title="No inventory matches" text="Add products or change the stock filters to see inventory cards." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {products.map((product) => {
            const status = stockStatus(product.quantity);
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
                    {product.quantity < 5 && (
                      <p className="mt-2 text-sm font-bold text-rose-600 dark:text-rose-300">
                        {product.quantity === 0 ? "Restock immediately" : "Low stock warning"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-secondary !h-10 !w-10 !p-0" onClick={() => adjustQuantity(product, -1)} aria-label="Decrease quantity">
                      <FiMinus />
                    </button>
                    <input
                      className="input h-10 w-20 text-center font-black"
                      min="0"
                      type="number"
                      value={product.quantity}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((item) => (item._id === product._id ? { ...item, quantity: event.target.value } : item))
                        )
                      }
                      onBlur={(event) => setQuantity(product, event.target.value)}
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
