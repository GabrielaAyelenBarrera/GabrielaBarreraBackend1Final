import Product from "./models/productsModelo.js";

class ProductsMongoDAO {
  static async getProducts() {
    return await Product.find().lean();
  }

  static async getProductsPaginate(page = 1, limit = 10, filter = {}, sort = {}) {
    const options = {
      lean: true,
      page,
      limit,
      sort,
    };

    const result = await Product.paginate(filter, options);

    return {
      docs: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage
    };
  }

  static async getProductById(id) {
    return await Product.findById(id).lean();
  }


  static async create(product = {}) {
    const nuevoProducto = await Product.create(product);
    return nuevoProducto.toJSON();
  }

  static async updateProduct(id, updates) {
    return await Product.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();
  }

  static async deleteProduct(id) {
    return await Product.findByIdAndDelete(id).lean();
  }
}

export default ProductsMongoDAO;
