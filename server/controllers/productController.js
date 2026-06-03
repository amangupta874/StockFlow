import { Readable } from "stream";
import fs from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";
import { cloudinary, hasCloudinaryConfig } from "../config/cloudinary.js";
import Product from "../models/Product.js";
import createNotification from "../utils/notificationEvents.js";

const normalizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const fieldAliases = {
  title: ["title", "name", "product", "productname", "item", "itemname", "productname"],
  description: ["description", "desc", "details", "notes", "about"],
  category: ["category", "type", "group", "cat", "section"],
  price: ["price", "mrp", "rate", "cost", "sellingprice", "sp", "amount"],
  quantity: ["quantity", "qty", "stock", "units", "available", "count", "inventory"],
  image: ["image", "imageurl", "photo", "photourl", "url", "img", "imgurl", "imglink",
          "pic", "picture", "productimage", "imagelink", "link", "thumbnail"]
};

const resolveField = (header) => {
  const normalized = normalizeHeader(header);
  return Object.entries(fieldAliases).find(([_field, aliases]) => aliases.includes(normalized))?.[0];
};

const parseCsvRows = (buffer) => {
  const text = buffer.toString("utf8").replace(/^\uFEFF/, "");
  const rows = [];
  let current = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  row.push(current.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
};

const parseSheetRows = async (file) => {
  const extension = file.originalname.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    return parseCsvRows(file.buffer);
  }

  if (extension === "tsv") {
    const rows = parseCsvRows(file.buffer);
    return rows.map((row) => row.flatMap((cell) => cell.split("\t")));
  }

  // XLS / XLSX — use SheetJS which fully supports inlineStr cells (Google Sheets exports)
  // cellFormula:false + raw:false ensures values are resolved strings, not formula text
  const workbook = XLSX.read(file.buffer, {
    type: "buffer",
    cellDates: true,
    cellNF: false,
    cellFormula: false
  });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Extract hyperlink Target URLs — Excel stores clickable URLs in cell.l.Target
  // sheet_to_json doesn't surface these, so we patch them in before converting
  if (sheet) {
    Object.keys(sheet).forEach((addr) => {
      if (addr.startsWith("!")) return;
      const cell = sheet[addr];
      if (cell && cell.l && cell.l.Target && (!cell.v || cell.v === cell.l.Target)) {
        cell.v = cell.l.Target;
        cell.t = "s";
      }
    });
  }

  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", blankrows: false, raw: false });
  return raw;
};

/**
 * Builds a deterministic Unsplash image URL for a product.
 * Uses the free picsum / Unsplash redirect — no API key required.
 * The URL resolves to a real, relevant photograph.
 */
const autoFetchImage = (title, category) => {
  // Combine title words + category for a focused search query
  const query = encodeURIComponent(
    `${title} ${category}`.replace(/[^a-zA-Z0-9 ]/g, " ").trim().toLowerCase()
  );
  // loremflickr.com returns relevant CC-licensed photos with no API key
  return `https://loremflickr.com/400/400/${query}`;
};

const rowsToProducts = async (file) => {
  const rows = await parseSheetRows(file);

  if (rows.length < 2) {
    return { items: [], skipped: [{ row: 1, reason: "Sheet must include headers and at least one product row" }] };
  }

  const headers = rows[0].map(resolveField);
  const skipped = [];
  const items = rows.slice(1).reduce((acc, row, rowIndex) => {
    const item = {};

    row.forEach((value, columnIndex) => {
      const field = headers[columnIndex];
      if (!field) return;
      // SheetJS may return hyperlink objects { v, l: { Target } } in some edge cases
      if (value && typeof value === "object" && value.l?.Target) {
        item[field] = String(value.l.Target).trim();
      } else {
        item[field] = typeof value === "string" ? value.trim() : value;
      }
    });

    if (!item.title || !item.category) {
      skipped.push({ row: rowIndex + 2, reason: "Missing title/name or category" });
      return acc;
    }

    const title = String(item.title).trim();
    const category = String(item.category).trim();
    const imageUrl = item.image ? String(item.image).trim() : "";

    acc.push({
      title,
      description: item.description ? String(item.description).trim() : "",
      category,
      price: normalizeNumber(item.price),
      quantity: Math.max(0, normalizeNumber(item.quantity)),
      // Auto-fetch a relevant image when none is provided in the sheet
      image: imageUrl || autoFetchImage(title, category)
    });
    return acc;
  }, []);

  return { items, skipped };
};

const uploadToCloudinary = (file) => {
  if (!file) return Promise.resolve(null);

  if (!hasCloudinaryConfig) {
    return new Promise(async (resolve, reject) => {
      try {
        const ext = file.originalname.split(".").pop() || "jpg";
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
        const uploadDir = path.join(process.cwd(), "uploads");
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, filename), file.buffer);
        
        const port = process.env.PORT || 5001;
        // In local development, return the full localhost URL. 
        // In production without Cloudinary, we'd need to use the actual domain.
        resolve({
          secure_url: `http://localhost:${port}/uploads/${filename}`,
          public_id: filename
        });
      } catch (error) {
        reject(error);
      }
    });
  }

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

    await createNotification({
      createdBy: req.user._id,
      title: "Product added",
      message: `${product.title} was added to your catalog.`,
      type: product.quantity < 5 ? "warning" : "success",
      metadata: { productId: product._id, quantity: product.quantity }
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const importProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload a CSV, TSV, XLS, or XLSX file");
    }

    const { items, skipped } = await rowsToProducts(req.file);
    const added = [];
    const updated = [];

    for (const item of items) {
      const existingProduct = await Product.findOne({
        createdBy: req.user._id,
        title: { $regex: `^${escapeRegex(item.title)}$`, $options: "i" },
        category: { $regex: `^${escapeRegex(item.category)}$`, $options: "i" }
      });

      if (existingProduct) {
        existingProduct.description = item.description;
        existingProduct.price = item.price;
        existingProduct.quantity = item.quantity;
        if (item.image) existingProduct.image = item.image;
        await existingProduct.save();
        updated.push(existingProduct);
      } else {
        const createdProduct = await Product.create({
          ...item,
          createdBy: req.user._id
        });
        added.push(createdProduct);
      }
    }

    const warningCount = [...added, ...updated].filter((product) => product.quantity < 5).length;

    await createNotification({
      createdBy: req.user._id,
      title: "Spreadsheet import complete",
      message: `${added.length} products added, ${updated.length} updated, ${skipped.length} skipped.`,
      type: skipped.length ? "warning" : "success",
      metadata: {
        added: added.length,
        updated: updated.length,
        skipped: skipped.length,
        warningCount
      }
    });

    res.status(201).json({
      added: added.length,
      updated: updated.length,
      skipped,
      warningCount,
      totalProcessed: items.length,
      addedItems: added,
      updatedItems: updated
    });
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

export { createProduct, deleteProduct, getProducts, importProducts, updateProduct };
