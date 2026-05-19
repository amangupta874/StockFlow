import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiEye, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import EmptyState from "../components/EmptyState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ProductForm from "../components/ProductForm.jsx";
import ProductModal from "../components/ProductModal.jsx";
import SkeletonGrid from "../components/SkeletonGrid.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { productService } from "../services/api.js";
import { currency, stockStatus } from "../utils/formatters.js";

const defaultFilters = {
  q: "",
  category: "all",
  stock: "all",
  sort: "newest",
  minPrice: "",
  maxPrice: ""
};

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(filters.q);

  const params = useMemo(
    () => ({ ...filters, q: debouncedSearch, page, limit: 8 }),
    [debouncedSearch, filters, page]
  );

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.list(params);
      setProducts(data.products);
      setCategories(data.categories || []);
      setTotalPages(data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [params]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const saveProduct = async (payload) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await productService.update(editingProduct._id, payload);
        toast.success("Product updated successfully");
      } else {
        await productService.create(payload);
        toast.success("Product added successfully");
      }
      setFormOpen(false);
      await loadProducts();
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(`Delete ${product.title}?`);
    if (!confirmed) return;

    await productService.remove(product._id);
    toast.success("Product deleted successfully");
    await loadProducts();
  };

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Product catalog"
        subtitle="Add, edit, search, filter, sort, paginate, and inspect products stored in MongoDB."
        actions={
          <button className="btn-primary" onClick={openCreate}>
            <FiPlus />
            Add Product
          </button>
        }
      />

      <div className="surface mb-5 grid gap-3 rounded-lg p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <label className="relative block">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10" placeholder="Search title or category" value={filters.q} onChange={(event) => updateFilter("q", event.target.value)} />
        </label>
        <select className="input" value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select className="input" value={filters.stock} onChange={(event) => updateFilter("stock", event.target.value)}>
          <option value="all">All stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <select className="input" value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
          <option value="newest">Newest</option>
          <option value="alpha">Alphabetical</option>
          <option value="priceAsc">Price low to high</option>
          <option value="priceDesc">Price high to low</option>
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input className="input" placeholder="Min ₹" type="number" value={filters.minPrice} onChange={(event) => updateFilter("minPrice", event.target.value)} />
          <input className="input" placeholder="Max ₹" type="number" value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)} />
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : products.length === 0 ? (
        <EmptyState action={<button className="btn-primary" onClick={openCreate}>Add Product</button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const status = stockStatus(product.quantity);
            return (
              <article key={product._id} className="surface group overflow-hidden rounded-lg">
                <button className="grid h-44 w-full place-items-center bg-slate-100 dark:bg-white/10" onClick={() => setSelectedProduct(product)}>
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <span className="text-sm font-bold text-slate-400">No image</span>
                  )}
                </button>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{product.category}</p>
                      <h3 className="mt-2 line-clamp-2 font-black text-ink dark:text-white">{product.title}</h3>
                    </div>
                    <span className={`badge ${status.className}`}>{status.label}</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xl font-black">{currency(product.price)}</p>
                      <p className="text-sm text-slate-500">{product.quantity} units</p>
                    </div>
                    <div className="flex gap-1">
                      <button className="btn-secondary !h-9 !w-9 !p-0" onClick={() => setSelectedProduct(product)} aria-label="View product">
                        <FiEye />
                      </button>
                      <button className="btn-secondary !h-9 !w-9 !p-0" onClick={() => openEdit(product)} aria-label="Edit product">
                        <FiEdit2 />
                      </button>
                      <button className="btn-secondary !h-9 !w-9 !p-0" onClick={() => deleteProduct(product)} aria-label="Delete product">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-2">
        <button className="btn-secondary" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
          Previous
        </button>
        <span className="rounded-lg border border-slate-200 bg-white/70 px-4 py-2 text-sm font-black dark:border-white/10 dark:bg-white/[0.05]">
          {page} / {totalPages}
        </span>
        <button className="btn-secondary" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
          Next
        </button>
      </div>

      {formOpen && <ProductForm editingProduct={editingProduct} onClose={() => setFormOpen(false)} onSubmit={saveProduct} saving={saving} />}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
};

export default Products;
