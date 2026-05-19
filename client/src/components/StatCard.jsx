import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, label, tone = "bg-brand-mint/15 text-teal-700", value }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="surface rounded-lg p-5"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-black tracking-tight text-ink dark:text-white">{value}</p>
      </div>
      <span className={`grid h-11 w-11 place-items-center rounded-lg ${tone}`}>
        <Icon className="text-xl" />
      </span>
    </div>
  </motion.div>
);

export default StatCard;
