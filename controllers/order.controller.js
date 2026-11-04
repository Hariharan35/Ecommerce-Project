const orderService = require("../services/order.service");

const handleError = (res, err) => {
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid order id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  return res.status(err.statusCode || 500).json({ error: err.message });
};

class OrderController {

  async placeOrder(req, res) {
    try {
      const order = await orderService.placeOrder(req.user.id, req.body.shippingAddress);
      return res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) {
      return handleError(res, err);
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await orderService.getMyOrders(req.user.id);
      return res.status(200).json({ orders });
    } catch (err) {
      return handleError(res, err);
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.user.id, req.params.id);
      return res.status(200).json(order);
    } catch (err) {
      return handleError(res, err);
    }
  }

  async cancelOrder(req, res) {
    try {
      const order = await orderService.cancelOrder(req.user.id, req.params.id);
      return res.status(200).json({ message: "Order cancelled", order });
    } catch (err) {
      return handleError(res, err);
    }
  }

  async updateStatus(req, res) {
    try {
      const order = await orderService.updateStatus(req.params.id, req.body.status);
      return res.status(200).json({ message: "Order status updated", order });
    } catch (err) {
      return handleError(res, err);
    }
  }
}

module.exports = new OrderController();