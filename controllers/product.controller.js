const productService = require("../services/product.service");

class ProductController {

  async getAllProducts(req, res) {
    try {
      const result = await productService.getAllProducts(req.query);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (err) {
      return res.status(400).json({ error: "Invalid product id" });
    }
  }

  async createProduct(req, res) {
    try {
      const { name, price } = req.body;
      if (!name || price === undefined) {
        return res.status(400).json({ message: '"name" and "price" are required' });
      }
      const product = await productService.createProduct(req.body);
      return res.status(201).json({ message: "Product created", product });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ message: "Product updated", product });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await productService.deleteProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ message: "Product deleted" });
    } catch (err) {
      return res.status(400).json({ error: "Invalid product id" });
    }
  }
}

module.exports = new ProductController();