import { Link } from "react-router-dom";
import { PiWarehouseDuotone } from "react-icons/pi";

const Logo = ({ to = "/" }) => (
  <Link to={to} className="flex items-center gap-2.5">
    <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white shadow-lg dark:bg-white dark:text-ink">
      <PiWarehouseDuotone className="text-xl" />
    </span>
    <span className="text-lg font-black tracking-[-0.02em] text-ink dark:text-white">StockFlow</span>
  </Link>
);

export default Logo;
