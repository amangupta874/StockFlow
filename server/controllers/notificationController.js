import Notification from "../models/Notification.js";
import Product from "../models/Product.js";
import createNotification from "../utils/notificationEvents.js";

const syncInventoryNotifications = async (userId) => {
  const lowStockCount = await Product.countDocuments({
    createdBy: userId,
    quantity: { $gt: 0, $lt: 5 }
  });
  const outOfStockCount = await Product.countDocuments({
    createdBy: userId,
    quantity: 0
  });

  if (lowStockCount || outOfStockCount) {
    await createNotification({
      createdBy: userId,
      title: "Stock needs attention",
      message: `${lowStockCount} low stock and ${outOfStockCount} out-of-stock products need review.`,
      type: outOfStockCount ? "danger" : "warning",
      metadata: { lowStockCount, outOfStockCount }
    });
  }
};

const getNotifications = async (req, res, next) => {
  try {
    if (req.query.sync === "true") {
      await syncInventoryNotifications(req.user._id);
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).limit(20),
      Notification.countDocuments({ createdBy: req.user._id, isRead: false })
    ]);

    res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ createdBy: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

export { getNotifications, markAllNotificationsRead, markNotificationRead };
