import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiDownload, FiFileText, FiUploadCloud, FiX } from "react-icons/fi";

const sampleRows = [
  ["title", "category", "price", "quantity", "description", "image"],
  ["Organic Almonds", "Grocery", "499", "18", "Premium 500g pack", "https://images.unsplash.com/photo-1508061253366-f7da158b6d46"],
  ["Copper Water Bottle", "Homeware", "899", "3", "Low stock example", ""]
];

const ImportProductsModal = ({ importing, onClose, onImported }) => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);

  const sampleCsvUrl = useMemo(() => {
    const csv = sampleRows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    return URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Choose a CSV or Excel file first");
      return;
    }

    const result = await onImported(file);
    setSummary(result);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        className="glass-panel w-full max-w-2xl rounded-lg p-5"
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label">Bulk Import</p>
            <h2 className="mt-1 text-2xl font-black text-ink dark:text-white">Upload Google Sheet items</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Export Google Sheets as CSV or upload `.xlsx`. Matching title and category rows update existing products; new rows are added.
            </p>
          </div>
          <button className="btn-secondary !h-10 !w-10 !p-0" type="button" onClick={onClose} aria-label="Close import">
            <FiX />
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
          <label className="grid min-h-44 cursor-pointer place-items-center rounded-lg border border-dashed border-slate-300 bg-white/65 p-5 text-center transition hover:border-brand-mint hover:bg-white dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-mint/15 text-teal-700 dark:text-teal-200">
              <FiUploadCloud className="text-2xl" />
            </span>
            <span className="mt-3 block text-sm font-black text-ink dark:text-white">
              {file ? file.name : "Drop or choose spreadsheet"}
            </span>
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">CSV, TSV, XLS, XLSX up to 8MB</span>
            <input
              className="sr-only"
              type="file"
              accept=".csv,.tsv,.xls,.xlsx"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>

          <div className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <FiFileText className="text-xl text-teal-600" />
            <h3 className="mt-3 font-black text-ink dark:text-white">Required columns</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              `title`, `category`, `price`, `quantity`. Optional: `description`, `image`.
            </p>
            <a className="btn-secondary mt-4 w-full" href={sampleCsvUrl} download="stockflow-import-template.csv">
              <FiDownload />
              Template
            </a>
          </div>
        </div>

        {summary && (
          <div className="mt-5 space-y-4">
            <div className="grid gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm dark:border-teal-400/20 dark:bg-teal-400/10 md:grid-cols-4">
              <strong>{summary.added} added</strong>
              <strong>{summary.updated} updated</strong>
              <strong>{summary.skipped?.length || 0} skipped</strong>
              <strong>{summary.warningCount} low stock</strong>
            </div>

            {(summary.addedItems?.length > 0 || summary.updatedItems?.length > 0) && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Imported Products</h3>
                <div className="grid max-h-60 gap-2 overflow-y-auto sm:grid-cols-2">
                  {[...(summary.addedItems || []), ...(summary.updatedItems || [])].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-md bg-white p-2 shadow-sm dark:bg-ink">
                      <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-100 dark:bg-white/10">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-slate-400">No image</span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink dark:text-white">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.quantity} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="btn-secondary" type="button" onClick={onClose}>
            Done
          </button>
          <button className="btn-primary" disabled={importing} type="submit">
            <FiUploadCloud />
            {importing ? "Importing..." : "Import Sheet"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImportProductsModal;
