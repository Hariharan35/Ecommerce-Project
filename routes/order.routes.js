const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

router.use(authMiddleware);

router.post("/", orderController.placeOrder);
router.get("/", orderController.getMyOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/cancel", orderController.cancelOrder);

// admin only
router.patch("/:id/status", authorizeRoles("admin"), orderController.updateStatus);

module.exports = router;