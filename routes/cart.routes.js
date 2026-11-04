const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth.middleware");

// every cart route needs a logged-in user
router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.delete("/", cartController.clearCart);
router.patch("/:productId", cartController.updateQuantity);
router.delete("/:productId", cartController.removeItem);

module.exports = router;