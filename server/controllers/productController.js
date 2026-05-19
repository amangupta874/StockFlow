import { Readable } from "stream";
import { cloudinary, hasCloudinaryConfig } from "../config/cloudinary.js";
import Product from "../models/Product.js";

const normalizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const uploadToCloudinary = (file) => {
  if (!file || !hasCloudinaryConfig) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "stockflow/products",
        resource_type: "image",
        transformation: [{ width: 1200, crop: "limit" }, { quality: "auto" }]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });
};

const buildQuery = (req) => {
  const { category, maxPrice, minPrice, q, stock } = req.query;
  const query = { createdBy: req.user._id };

  if (q) {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } }
    ];
  }

  if (category && category !== "all") query.category = category;
  if (minPrice || maxPrice) query.price = {};
  if (minPrice) query.price.$gte = normalizeNumber(minPrice);
  if (maxPrice) query.price.$lte = normalizeNumber(maxPrice);

  if (stock === "in") query.quantity = { $gte: 5 };
  if (stock === "low") query.quantity = { $gt: 0, $lt: 5 };
  if (stock === "out") query.quantity = 0;

  return query;
};

const sortMap = {
  alpha: { title: 1 },
  newest: { createdAt: -1 },
  priceAsc: { price: 1 },
  priceDesc: { price: -1 }
};

const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, normalizeNumber(req.query.page, 1));
    const limit = Math.min(48, Math.max(1, normalizeNumber(req.query.limit, 8)));
    const skip = (page - 1) * limit;
    const query = buildQuery(req);
    const sort = sortMap[req.query.sort] || sortMap.newest;

    const [products, total, categories] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
      Product.distinct("category", { createdBy: req.user._id })
    ]);

    res.json({
      products,
      categories,
      page,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { category, description, image, price, quantity, title } = req.body;

    if (!title || !category) {
      res.status(400);
      throw new Error("Title and category are required");
    }

    const uploadedImage = await uploadToCloudinary(req.file);
    const product = await Product.create({
      title,
      description,
      category,
      price: normalizeNumber(price),
      quantity: normalizeNumber(quantity),
      image: uploadedImage?.secure_url || image || "",
      imagePublicId: uploadedImage?.public_id || "",
      createdBy: req.user._id
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const uploadedImage = await uploadToCloudinary(req.file);
    const fields = ["title", "description", "category", "image"];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    if (req.body.price !== undefined) product.price = normalizeNumber(req.body.price);
    if (req.body.quantity !== undefined) product.quantity = normalizeNumber(req.body.quantity);
    if (uploadedImage) {
      product.image = uploadedImage.secure_url;
      product.imagePublicId = uploadedImage.public_id;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { createProduct, deleteProduct, getProducts, updateProduct };
