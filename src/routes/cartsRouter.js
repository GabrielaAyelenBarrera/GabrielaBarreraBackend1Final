import mongoose from "mongoose";
import express from "express";
import CartsMongoDAO from "../dao/CartsMongoDAO.js";

const router = express.Router();

// Ruta para mostrar la vista del carrito
router.get('/view', (req, res) => {
  res.render("carts"); // Usa res.render para renderizar la vista handlebars
});

// Ruta para obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await CartsMongoDAO.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await CartsMongoDAO.create();
    res.status(201).json({ message: "Carrito creado", id: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener un carrito por ID
router.get("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await CartsMongoDAO.getCartById(cartId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para agregar un producto a un carrito específico
router.post("/:id/products", async (req, res) => {
  const { id } = req.params;
  const { productId, quantity } = req.body;

  try {
    const updatedCart = await CartsMongoDAO.addProductToCart(id, {
      pid: productId,
      quantity,
    });
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Ruta para actualizar SOLO la cantidad de un producto en un carrito específico
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await CartsMongoDAO.updateProductQuantityInCart(
      cid,
      pid,
      quantity
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const products = req.body; // Array de productos con formato [{ productId, quantity }]

  console.log("Received products:", products); // Para depuración

  try {
    const updatedCart = await CartsMongoDAO.updateCartProducts(cid, products);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Ruta para eliminar un producto de un carrito específico
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const removed = await CartsMongoDAO.removeProductFromCart(cid, pid);
    // Verificar si los IDs son válidos
    if (removed) {
      res.json({ message: "Producto eliminado del carrito" });
    } else {
      res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar todos los productos de un carrito específico
router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.id;
    const updatedCart = await CartsMongoDAO.clearCartProducts(cartId);

    if (updatedCart) {
      res.json({
        message: "Todos los productos han sido eliminados del carrito",
        cart: updatedCart,
      });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
