const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const fail = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// put stock back (used when checkout fails halfway or an order is cancelled)
const restoreStock = async (items) => {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: item.quantity } }
    );
  }
};

class OrderService {

  // CHECKOUT: cart -> order
  async placeOrder(userId, shippingAddress = {}) {
    const { fullName, phone, addressLine, city, pincode } = shippingAddress;
    if (!fullName || !phone || !addressLine || !city || !pincode) {
      throw fail("Shipping address needs fullName, phone, addressLine, city and pincode");
    }

    const rows = await Cart.find({ userId }).populate("productId");
    if (rows.length === 0) throw fail("Your cart is empty");

    // every product must still exist and be active
    if (rows.some((r) => !r.productId || !r.productId.isActive)) {
      throw fail("Some items are no longer available. Please review your cart");
    }

    // build the order items on the SERVER (never trust prices from the client)
    const items = rows.map((r) => ({
      productId: r.productId._id,
      name: r.productId.name,
      image: r.productId.image,
      price: r.productId.price,
      quantity: r.quantity
    }));

    // reduce stock one product at a time; the stock >= quantity filter
    // prevents two customers buying the last item together
    const reserved = [];
    for (const item of items) {
      const result = await Product.updateOne(
        { _id: item.productId, isActive: true, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );

      if (result.modifiedCount === 0) {
        await restoreStock(reserved);   // undo the ones already reduced
        throw fail(`Not enough stock for "${item.name}"`);
      }
      reserved.push(item);
    }

    const totalAmount = Number(
      items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
    );

    try {
      const order = await Order.create({
        userId,
        items,
        totalAmount,
        shippingAddress: { fullName, phone, addressLine, city, pincode }
      });

      await Cart.deleteMany({ userId });
      return order;

    } catch (err) {
      await restoreStock(reserved);
      throw err;
    }
  }

  async getMyOrders(userId) {
    return Order.find({ userId }).sort({ createdAt: -1 });
  }

  async getOrderById(userId, orderId) {
    // userId in the filter means users can only see their own orders
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) throw fail("Order not found", 404);
    return order;
  }

  // Customer cancels (only while still "placed")
  async cancelOrder(userId, orderId) {
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) throw fail("Order not found", 404);

    if (order.status !== "placed") {
      throw fail(`Cannot cancel an order that is ${order.status}`);
    }

    order.status = "cancelled";
    await order.save();
    await restoreStock(order.items);
    return order;
  }

  // Admin: shipped / delivered
  async updateStatus(orderId, status) {
    if (!["shipped", "delivered"].includes(status)) {
      throw fail('Status must be "shipped" or "delivered"');
    }

    const order = await Order.findById(orderId);
    if (!order) throw fail("Order not found", 404);

    if (order.status === "cancelled") {
      throw fail("Cancelled orders cannot be updated");
    }

    order.status = status;
    await order.save();
    return order;
  }
}

module.exports = new OrderService();