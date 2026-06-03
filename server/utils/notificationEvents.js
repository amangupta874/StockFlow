import Notification from "../models/Notification.js";

const createNotification = async ({ createdBy, message, metadata = {}, title, type = "info" }) => {
  try {
    return await Notification.create({ createdBy, message, metadata, title, type });
  } catch (error) {
    console.error(`Notification error: ${error.message}`);
    return null;
  }
};

export default createNotification;
