import { useEffect, useState } from "react";
import { FiImage, FiSave, FiX } from "react-icons/fi";

const initialState = {
  title: "",
  description: "",
  category: "",
  price: "",
  quantity: "",
  image: "",
  imageFile: null
};

const ProductForm = ({ editingProduct, onClose, onSubmit, saving }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!editingProduct) {
      setForm(initialState);
      return;
    }

    setForm({
      title: editingProduct.title || "",
      description: editingProduct.description || "",
      category: editingProduct.category || "",
      price: editingProduct.price ?? "",
      quantity: editingProduct.quantity ?? "",
      image: editingProduct.image || "",
      imageFile: null
    });
  }, [editingProduct]);

  const update = (event) => {
    const { files, name, value } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
        className="glass-panel max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg p-5"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="label">{editingProduct ? "Edit Product" : "New Product"}</p>
            <h2 className="mt-1 text-2xl font-black text-ink dark:text-white">
              {editingProduct ? "Update product details" : "Add inventory item"}
            </h2>
          </div>
          <button className="btn-secondary !h-10 !w-10 !p-0" type="button" onClick={onClose} aria-label="Close form">
            <FiX />
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="label">Title</span>
            <input className="input mt-2" name="title" value={form.title} onChange={update} required />
          </label>
          <label className="block">
            <span className="label">Category</span>
            <input className="input mt-2" name="category" value={form.category} onChange={update} required />
          </label>
          <label className="block">
            <span className="label">Price</span>
            <input className="input mt-2" min="0" name="price" type="number" value={form.price} onChange={update} required />
          </label>
          <label className="block">
            <span className="label">Quantity</span>
            <input className="input mt-2" min="0" name="quantity" type="number" value={form.quantity} onChange={update} required />
          </label>
          <label className="block md:col-span-2">
            <span className="label">Image URL</span>
            <input className="input mt-2" name="image" value={form.image} onChange={update} placeholder="https://..." />
          </label>
          <label className="block md:col-span-2">
            <span className="label">Upload Image</span>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white/60 p-4 dark:border-white/15 dark:bg-white/[0.04]">
              <FiImage className="text-xl text-slate-500" />
              <input className="text-sm" name="imageFile" type="file" accept="image/*" onChange={update} />
            </div>
          </label>
          <label className="block md:col-span-2">
            <span className="label">Description</span>
            <textarea className="input mt-2 min-h-28" name="description" value={form.description} onChange={update} />
          </label>
        </div>

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
