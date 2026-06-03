import multer from "multer";

const storage = multer.memoryStorage();
const sheetExtensions = [".csv", ".tsv", ".xls", ".xlsx"];
const sheetMimeTypes = [
  "text/csv",
  "text/tab-separated-values",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

const fileFilter = (_req, file, cb) => {
  const lowerName = file.originalname.toLowerCase();
  const isSheet =
    sheetMimeTypes.includes(file.mimetype) ||
    sheetExtensions.some((extension) => lowerName.endsWith(extension));

  if (file.mimetype.startsWith("image/") || isSheet) {
    cb(null, true);
    return;
  }

  cb(new Error("Only image or spreadsheet files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024
  }
});

export default upload;
