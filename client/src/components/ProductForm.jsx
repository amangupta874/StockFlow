import { useEffect, useRef, useState } from "react";
import { FiRefreshCw, FiSave, FiX, FiZap } from "react-icons/fi";

const initialState = {
  title: "",
  description: "",
  category: "",
  price: "",
  quantity: "",
  image: "",
  imageFile: null
};

/**
 * Builds a loremflickr URL from title + category.
 * Adds a cache-bust seed so the "Refresh" button fetches a different photo each time.
 */
const buildAutoUrl = (title, category, seed = 1) => {
  const query = `${title} ${category}`
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .slice(0, 4)
    .join(",");

  return query
    ? `https://loremflickr.com/400/400/${encodeURIComponent(query)}?lock=${seed}`
    : "";
};

const ProductForm = ({ editingProduct, onClose, onSubmit, saving }) => {
  const [form, setForm]           = useState(initialState);
  const [preview, setPreview]     = useState("");   // currently-visible preview URL
  const [autoSeed, setAutoSeed]   = useState(1);    // increments on "Refresh"
  const [imgError, setImgError]   = useState(false);
  const fileRef                   = useRef(null);

  /* ── populate form when editing ── */
  useEffect(() => {
    if (!editingProduct) { setForm(initialState); setPreview(""); return; }
    setForm({
      title:     editingProduct.title     || "",
      description: editingProduct.description || "",
      category:  editingProduct.category  || "",
      price:     editingProduct.price     ?? "",
      quantity:  editingProduct.quantity  ?? "",
      image:     editingProduct.image     || "",
      imageFile: null
    });
    setPreview(editingProduct.image || "");
  }, [editingProduct]);

  /* ── live preview: update whenever image URL field changes ── */
  useEffect(() => {
    if (form.image) { setPreview(form.image); setImgError(false); }
  }, [form.image]);

  const update = (event) => {
    const { files, name, value } = event.target;
    if (files) {
      // File upload: create a local object-URL for preview
      const objectUrl = URL.createObjectURL(files[0]);
      setPreview(objectUrl);
      setImgError(false);
      setForm((cur) => ({ ...cur, imageFile: files[0], image: "" }));
    } else {
      setForm((cur) => ({ ...cur, [name]: value }));
    }
  };

  /* ── Auto Image: set a loremflickr URL based on title + category ── */
  const applyAutoImage = () => {
    const url = buildAutoUrl(form.title, form.category, autoSeed);
    if (!url) return;
    setForm((cur) => ({ ...cur, image: url, imageFile: null }));
    setPreview(url);
    setImgError(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── Refresh: generate a different photo ── */
  const refreshAutoImage = () => {
    const nextSeed = autoSeed + 1;
    setAutoSeed(nextSeed);
    const url = buildAutoUrl(form.title, form.category, nextSeed);
    if (!url) return;
    setForm((cur) => ({ ...cur, image: url, imageFile: null }));
    setPreview(url);
    setImgError(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const canAutoImage = form.title.trim().length > 0;
  const isAutoImage  = preview.includes("loremflickr.com");

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="glass-panel max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg p-5"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="label">{editingProduct ? "Edit Product" : "New Product"}</p>
            <h2 className="mt-1 text-2xl font-black text-ink dark:text-white">
              {editingProduct ? "Update product details" : "Add inventory item"}
            </h2>
          </div>
          <button
            className="btn-secondary !h-10 !w-10 !p-0"
            type="button"
            onClick={onClose}
            aria-label="Close form"
          >
            <FiX />
          </button>
        </div>

        {/* ── Image Preview Panel ── */}
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
          <div className="relative flex h-44 items-center justify-center bg-slate-100 dark:bg-white/[0.05]">
            {preview && !imgError ? (
              <>
                <img
                  key={preview}
                  src={preview}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
                {isAutoImage && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    ✨ Auto Image
                  </span>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <FiZap className="text-3xl" />
                <p className="text-xs font-bold">
                  {canAutoImage
                    ? 'Click "Auto Image" to generate a photo'
                    : "Enter a title to enable auto image"}
                </p>
              </div>
            )}
          </div>

          {/* Auto Image Controls */}
          <div className="flex items-center gap-2 border-t border-slate-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <button
              type="button"
              className="btn-primary flex-1 !py-2 text-sm"
              disabled={!canAutoImage}
              onClick={applyAutoImage}
              title={canAutoImage ? "Generate an image from product title" : "Enter a title first"}
            >
              <FiZap />
              Auto Image
            </button>
            {isAutoImage && (
              <button
                type="button"
                className="btn-secondary !h-9 !w-9 !p-0"
                onClick={refreshAutoImage}
                title="Get a different photo"
                aria-label="Refresh auto image"
              >
                <FiRefreshCw className="text-sm" />
              </button>
            )}
            <label className="btn-secondary cursor-pointer !py-2 text-sm" title="Upload your own image">
              Upload
              <input
                ref={fileRef}
                className="sr-only"
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={update}
              />
            </label>
          </div>
        </div>

        {/* ── Fields ── */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="label">Title</span>
            <input
              className="input mt-2"
              name="title"
              value={form.title}
              onChange={update}
              required
            />
          </label>
          <label className="block">
            <span className="label">Category</span>
            <input
              className="input mt-2"
              name="category"
              value={form.category}
              onChange={update}
              required
            />
          </label>
          <label className="block">
            <span className="label">Price</span>
            <input
              className="input mt-2"
              min="0"
              name="price"
              type="number"
              value={form.price}
              onChange={update}
              required
            />
          </label>
          <label className="block">
            <span className="label">Quantity</span>
            <input
              className="input mt-2"
              min="0"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={update}
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="label">Image URL <span className="text-slate-400 font-normal">(optional — or use Auto Image above)</span></span>
            <input
              className="input mt-2"
              name="image"
              value={form.image}
              onChange={update}
              placeholder="https://..."
            />
          </label>
          <label className="block md:col-span-2">
            <span className="label">Description</span>
            <textarea
              className="input mt-2 min-h-28"
              name="description"
              value={form.description}
              onChange={update}
            />
          </label>
        </div>

        {/* ── Footer ── */}
        <div className="mt-5 flex justify-end gap-3">
          <button className="btn-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" disabled={saving} type="submit">
            <FiSave />
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
