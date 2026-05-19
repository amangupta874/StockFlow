import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getProducts)
  .post(protect, upload.single("imageFile"), createProduct);

router
  .route("/:id")
  .put(protect, upload.single("imageFile"), updateProduct)
  .delete(protect, deleteProduct);

export default router;
