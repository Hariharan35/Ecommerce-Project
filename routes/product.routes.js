const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// Public: anyone can browse
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Admin only
router.post("/", authMiddleware, authorizeRoles("admin"), productController.createProduct);
router.put("/:id", authMiddleware, authorizeRoles("admin"), productController.updateProduct);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), productController.deleteProduct);

module.exports = router;