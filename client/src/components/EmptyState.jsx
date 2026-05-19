import { FiPlusCircle } from "react-icons/fi";

const EmptyState = ({ action, title = "No products yet", text = "Add your first product to start tracking inventory." }) => (
  <div className="glass-panel rounded-lg p-8 text-center">
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-brand-mint/15 text-teal-700 dark:text-teal-200">
      <FiPlusCircle className="text-2xl" />
    </div>
    <h3 className="mt-4 text-lg font-black text-ink dark:text-white">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
