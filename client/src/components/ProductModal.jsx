import { motion } from "framer-motion";
import { FiPackage, FiX } from "react-icons/fi";
import { currency, stockStatus } from "../utils/formatters.js";

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  const status = stockStatus(product.quantity);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="label">{product.category}</span>
          <button className="btn-secondary !h-10 !w-10 !p-0" onClick={onClose} aria-label="Close product details">
            <FiX />
          </button>
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-[0.85fr_1fr]">
          <div className="grid min-h-72 place-items-center overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
            {product.image ? (
              <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <FiPackage className="text-5xl text-slate-400" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-ink dark:text-white">{product.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {product.description || "No product description has been added yet."}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="label">Price</p>
                <p className="mt-2 text-2xl font-black">{currency(product.price)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="label">Quantity</p>
                <p className="mt-2 text-2xl font-black">{product.quantity}</p>
              </div>
            </div>
            <span className={`badge mt-5 ${status.className}`}>{status.label}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductModal;
