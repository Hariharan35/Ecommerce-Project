const Cart = require("../models/cart.model");
// const Product = require("../models/product.model");

const fail = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const toQuantity = (value) => {
  const q = Number(value);
  if (!Number.isInteger(q) || q < 1) {
    throw fail("Quantity must be a whole number of at least 1");
  }
  return q;
};

class CartService {

  // Get the user's cart with product details and total
  async getCart(userId) {
    const rows = await Cart.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    // skip items whose product was deleted or deactivated
    const items = rows
      .filter((r) => r.productId && r.productId.isActive)
      .map((r) => ({
        productId: r.productId._id,
        name: r.productId.name,
        image: r.productId.image,
        price: r.productId.price,
        stock: r.productId.stock,
        quantity: r.quantity,
        subtotal: Number((r.productId.price * r.quantity).toFixed(2))
      }));

    const totalAmount = Number(
      items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2)
    );

    return { items, totalItems: items.length, totalAmount };
  }

  // Add a product (or increase its quantity if already in the cart)
  async addToCart(userId, productId, quantity = 1) {
    const qty = toQuantity(quantity);

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) throw fail("Product not found", 404);

    const existing = await Cart.findOne({ userId, productId });
    const newQty = (existing ? existing.quantity : 0) + qty;

    if (newQty > product.stock) {
      throw fail(`Only ${product.stock} item(s) in stock`);
    }

    if (existing) {
      existing.quantity = newQty;
      await existing.save();
    } else {
      await Cart.create({ userId, productId, quantity: qty });
    }

    return this.getCart(userId);
  }

  // Set an exact quantity
  async updateQuantity(userId, productId, quantity) {
    const qty = toQuantity(quantity);

    const item = await Cart.findOne({ userId, productId });
    if (!item) throw fail("Item not in cart", 404);

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) throw fail("Product not found", 404);

    if (qty > product.stock) {
      throw fail(`Only ${product.stock} item(s) in stock`);
    }

    item.quantity = qty;
    await item.save();

    return this.getCart(userId);
  }

  async removeItem(userId, productId) {
    const result = await Cart.deleteOne({ userId, productId });
    if (result.deletedCount === 0) throw fail("Item not in cart", 404);
    return this.getCart(userId);
  }

  async clearCart(userId) {
    await Cart.deleteMany({ userId });
    return { items: [], totalItems: 0, totalAmount: 0 };
  }
}

module.exports = new CartService();