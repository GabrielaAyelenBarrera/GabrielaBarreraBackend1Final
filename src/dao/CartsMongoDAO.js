import mongoose from "mongoose";
import CartsModelo from "./models/cartsModelo.js";

class CartsMongoDAO {
  static async getCarts() {
    return await CartsModelo.find().lean();
  }

  static async create() {
    const newCart = { products: [] };
    const result = await CartsModelo.create(newCart);
    return result._id;
  }

 // Obtener un carrito por su ID y populando los productos
 static async getCartById(cid) {
  try {
    const cart = await CartsModelo.findById(cid)
      .populate("products.productId")
      .lean();

    if (!cart) {
      throw new Error(`Cart with ID ${cid} not found`);
    }
    return cart;
  } catch (error) {
    throw error;
  }
}

// Actualizar el carrito con un arreglo de productos
static async updateCartProducts(cid, products) {
  if (!mongoose.Types.ObjectId.isValid(cid)) {
    throw new Error("Invalid cart ID");
  }

  // Verifica si el carrito existe
  const cart = await CartsModelo.findById(cid);
  if (!cart) {
    throw new Error(`Cart with ID ${cid} not found`);
  }

  // Verifica que products es un array
  if (!Array.isArray(products)) {
    throw new Error("Products should be an array");
  }

  // Verifica que cada producto en el array tenga productId y quantity
  products.forEach(product => {
    if (!product.productId || typeof product.quantity !== 'number') {
      throw new Error("Each product must have a valid productId and quantity");
    }
  });

  // Actualizar los productos
  cart.products = products.map((product) => ({
    productId: new mongoose.Types.ObjectId(product.productId),
    quantity: product.quantity,
  }));

  // Guardar el carrito actualizado
  const updatedCart = await cart.save();

  // Popula los productos para devolver los detalles completos
  return await CartsModelo.findById(updatedCart._id).populate("products.productId");
}
static async updateProductQuantityInCart(cid, pid, quantity) {
  if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
    throw new Error("Invalid cart or product ID");
  }

  // Verifica si el carrito existe
  const cart = await CartsModelo.findById(cid);
  if (!cart) {
    throw new Error(`Cart with ID ${cid} not found`);
  }

  // Verifica si el producto ya está en el carrito
  const existingProduct = cart.products.find(
    (p) => p.productId.toString() === pid
  );
  if (existingProduct) {
    // Si el producto ya existe, actualiza la cantidad
    existingProduct.quantity = quantity;
  } else {
    // Si el producto no existe en el carrito, agrégalo
    cart.products.push({
      productId: new mongoose.Types.ObjectId(pid),
      quantity,
    });
  }

  // Guardar el carrito actualizado
  const updatedCart = await cart.save();
  return updatedCart;
}


// Actualizar la cantidad de un producto en el carrito
static async updateCartProducts(cid, products) {
  if (!mongoose.Types.ObjectId.isValid(cid)) {
    throw new Error("Invalid cart ID");
  }

  // Verifica si el carrito existe
  const cart = await CartsModelo.findById(cid);
  if (!cart) {
    throw new Error(`Cart with ID ${cid} not found`);
  }

  // Verifica que products es un array
  if (!Array.isArray(products)) {
    console.error("Received products:", products); // Para depuración
    throw new Error("Products should be an array");
  }

  // Verifica que cada producto en el array tenga productId y quantity
  products.forEach(product => {
    if (!product.productId || typeof product.quantity !== 'number') {
      throw new Error("Each product must have a valid productId and quantity");
    }
  });

  // Actualizar los productos
  cart.products = products.map((product) => ({
    productId: new mongoose.Types.ObjectId(product.productId),
    quantity: product.quantity,
  }));

  // Guardar el carrito actualizado
  const updatedCart = await cart.save();

  // Popula los productos para devolver los detalles completos
  return await CartsModelo.findById(updatedCart._id).populate("products.productId");
}

static async addProductToCart(cid, { pid, quantity }) {
  if (
    !mongoose.Types.ObjectId.isValid(cid) ||
    !mongoose.Types.ObjectId.isValid(pid)
  ) {
    throw new Error("Invalid cart or product ID");
  }

  // Verifica si el carrito existe
  const cart = await CartsModelo.findById(cid).exec();
  if (!cart) {
    throw new Error(`Cart with ID ${cid} not found`);
  }

  // Verificar si el producto ya está en el carrito
  const existingProduct = cart.products.find(
    (p) => p.productId.toString() === pid
  );
  if (existingProduct) {
    // Si el producto ya existe, actualiza la cantidad
    existingProduct.quantity += quantity;
  } else {
    // Si el producto no existe, lo agrego al carrito
    cart.products.push({
      productId: new mongoose.Types.ObjectId(pid),
      quantity,
    });
  }

  // Guardar el carrito actualizado
  const updatedCart = await cart.save();
  return updatedCart;
}

  static async removeProductFromCart(cid, pid) {
    // Validar el ID del producto
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      throw new Error("ID de producto no válido");
    }

    // Actualizar el carrito y eliminar el producto
    const cart = await CartsModelo.findByIdAndUpdate(
      cid,
      {
        $pull: {
          products: { productId: new mongoose.Types.ObjectId(pid) },
        },
      },
      { new: true }
    ).lean();

    // Verificar si el producto fue removido
    return cart ? true : false;
  }

// Método para eliminar todos los productos de un carrito específico
static async clearCartProducts(cid) {
  if (!mongoose.Types.ObjectId.isValid(cid)) {
    throw new Error("Invalid cart ID");
  }

  // Actualiza el carrito estableciendo el arreglo de productos como vacío
  return await CartsModelo.findByIdAndUpdate(
    cid,
    { $set: { products: [] } }, // Vacía el array de productos
    { new: true } // Devuelve el carrito actualizado
  ).lean();
}

}

export default CartsMongoDAO;
