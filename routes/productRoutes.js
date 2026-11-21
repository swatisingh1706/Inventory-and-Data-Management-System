const express = require("express");
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    adjustStock,
    getLowStockProducts,
    getCategorySummary
} = require("../controller/productController");

const validateObjectId = require("../middleware/validateObjectId");

// Reports
router.get("/reports/low-stock", getLowStockProducts);
router.get("/reports/category-summary", getCategorySummary);

// CRUD
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", validateObjectId, getProductById);
router.put("/:id", validateObjectId, updateProduct);
router.delete("/:id", validateObjectId, deleteProduct);

// Stock management
router.patch("/:id/stock", validateObjectId, adjustStock);

module.exports = router;