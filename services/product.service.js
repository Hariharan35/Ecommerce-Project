const Product = require("../models/product.model");

class ProductService {

  // GET /api/products?search=backpack&category=jewelery&page=1&limit=12
  async getAllProducts({ search, category, page = 1, limit = 12 }) {
    const filter = { isActive: true };

    if (search) {
      // escape special characters so input like "a(b" can't break the regex
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: safe, $options: "i" };
    }
    if (category) filter.category = category;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 12, 1), 50);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ _id: 1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter)
    ]);

    return {
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    };
  }

  async getProductById(id) {
    return Product.findOne({ _id: id, isActive: true });
  }

  async createProduct(data) {
    const { name, description, price, category, image, stock } = data;
    return Product.create({ name, description, price, category, image, stock });
  }

  async updateProduct(id, data) {
    const { name, description, price, category, image, stock, isActive } = data;
    const updates = { name, description, price, category, image, stock, isActive };
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    return Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
  }

  // soft delete (hides the product, keeps old orders intact)
  async deleteProduct(id) {
    return Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}

module.exports = new ProductService();