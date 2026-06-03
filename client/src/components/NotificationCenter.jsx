import { useEffect, useState } from "react";
import { FiBell, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import { notificationService } from "../services/api.js";

const toneMap = {
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200"
};

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async (sync = false) => {
    const data = await notificationService.list(sync);
    setNotifications(data.notifications || []);
    setUnreadCount(data.unreadCount || 0);
  };

  useEffect(() => {
    loadNotifications(true);
    const listener = () => loadNotifications();
    window.addEventListener("stockflow:notifications", listener);
    return () => window.removeEventListener("stockflow:notifications", listener);
  }, []);

  const markAll = async () => {
    await notificationService.markAllRead();
    await loadNotifications();
  };

  return (
    <div className="relative">
      <button className="btn-secondary !h-10 !w-10 !p-0" onClick={() => setOpen((current) => !current)} aria-label="Notifications">
        <FiBell />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-3 shadow-panel dark:border-white/10 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label">Signals</p>
              <h3 className="font-black text-ink dark:text-white">Notifications</h3>
            </div>
            <div className="flex gap-1">
              <button className="btn-secondary !h-9 !w-9 !p-0" onClick={markAll} aria-label="Mark all read">
                <FiCheckCircle />
              </button>
              <button className="btn-secondary !h-9 !w-9 !p-0" onClick={() => setOpen(false)} aria-label="Close notifications">
                <FiX />
              </button>
            </div>
          </div>
          <div className="mt-3 max-h-96 space-y-2 overflow-auto">
            {notifications.length === 0 && (
              <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">
                No notifications yet.
              </div>
            )}
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-lg border p-3 ${
                  notification.isRead
                    ? "border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]"
                    : "border-teal-200 bg-teal-50 dark:border-teal-400/20 dark:bg-teal-400/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${toneMap[notification.type] || toneMap.info}`}>
                    <FiInfo />
                  </span>
                  <div>
                    <p className="font-black text-ink dark:text-white">{notification.title}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{notification.message}</p>
                    <p className="mt-2 text-xs font-bold text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
