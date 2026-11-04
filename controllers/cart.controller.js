const cartService = require("../services/cart.service");

const handleError = (res, err) => {
  // CastError = invalid ObjectId in the URL or body
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid product id" });
  }
  return res.status(err.statusCode || 500).json({ error: err.message });
};

class CartController {

  async getCart(req, res) {
    try {
      const cart = await cartService.getCart(req.user.id);
      return res.status(200).json(cart);
    } catch (err) {
      return handleError(res, err);
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      if (!productId) {
        return res.status(400).json({ message: '"productId" is required' });
      }
      const cart = await cartService.addToCart(req.user.id, productId, quantity);
      return res.status(200).json({ message: "Added to cart", ...cart });
    } catch (err) {
      return handleError(res, err);
    }
  }

  async updateQuantity(req, res) {
    try {
      const cart = await cartService.updateQuantity(
        req.user.id,
        req.params.productId,
        req.body.quantity
      );
      return res.status(200).json({ message: "Cart updated", ...cart });
    } catch (err) {
      return handleError(res, err);
    }
  }

  async removeItem(req, res) {
    try {
      const cart = await cartService.removeItem(req.user.id, req.params.productId);
      return res.status(200).json({ message: "Item removed", ...cart });
    } catch (err) {
      return handleError(res, err);
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await cartService.clearCart(req.user.id);
      return res.status(200).json({ message: "Cart cleared", ...cart });
    } catch (err) {
      return handleError(res, err);
    }
  }
}

module.exports = new CartController();