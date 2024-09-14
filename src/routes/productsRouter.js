import express from "express";
import ProductsMongoDAO from "../dao/ProductsMongoDAO.js";

const router = express.Router();

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  let { page, limit, sort, category, status } = req.query;

  // Valores por defecto
  page = page && !isNaN(Number(page)) ? Number(page) : 1;
  limit = limit && !isNaN(Number(limit)) ? Number(limit) : 10;
  sort = sort || "asc"; // Valor por defecto para sort

  // Construi filtro de búsqueda (category y status)
  let filter = {};
  if (category) {
    filter.category = category;
  }
  if (status !== undefined && status !== '') {
    filter.status = status === "true"; // Convierte a booleano
  }

  // Construye el criterio de ordenamiento (sort)
  let sortOption = {};
  if (sort) {
    sortOption = { price: sort === "asc" ? 1 : -1 };
  }

  console.log('Request Params:', { page, limit, sort, category, status });
  console.log('Filter:', filter);
  console.log('Sort Option:', sortOption);

  try {
    // Obtiene productos con paginación, filtros y ordenamiento
    let products = await ProductsMongoDAO.getProductsPaginate(
      page,
      limit,
      filter,
      sortOption
    );

    console.log('Paginated Products:', products);

    // Construye los links de paginación
    const baseUrl = `/api/products?limit=${limit}&sort=${sort}&category=${category || ''}&status=${status || ''}`;
    const prevLink = products.hasPrevPage
      ? `${baseUrl}&page=${products.prevPage}`
      : null;
    const nextLink = products.hasNextPage
      ? `${baseUrl}&page=${products.nextPage}`
      : null;

    // Respuesta en formato solicitado
    res.status(200).json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage || null,
      nextPage: products.nextPage || null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener los productos" });
  }
});

// Ruta para obtener un producto por su ID (pid)
router.get("/:pid", async (req, res) => {
  const { pid: productId } = req.params;

  try {
    const product = await ProductsMongoDAO.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error.message);
    res
      .status(500)
      .json({ error: `Error al obtener el producto: ${error.message}` });
  }
});

// Ruta para agregar un producto a la lista
router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails = [],
  } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const existingProduct = await ProductsMongoDAO.getProducts();
    if (existingProduct.find((p) => p.code === code)) {
      return res
        .status(400)
        .json({ error: "Producto ya existe con ese código" });
    }

    const nuevoProducto = await ProductsMongoDAO.create({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      status: true,
    });
    return res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al agregar el producto", detalle: error.message });
  }
});

// Ruta para actualizar un producto por su ID (pid)
router.put("/:pid", async (req, res) => {
  const { pid: productId } = req.params;
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }

  if (updates.id) {
    return res
      .status(400)
      .json({ error: "No se puede actualizar el ID del producto" });
  }

  try {
    const updatedProduct = await ProductsMongoDAO.updateProduct(
      productId,
      updates
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error.message);
    res
      .status(500)
      .json({ error: `Error al actualizar el producto: ${error.message}` });
  }
});

// Ruta para eliminar un producto por su ID (pid)
router.delete("/:pid", async (req, res) => {
  const { pid: productId } = req.params;

  try {
    const result = await ProductsMongoDAO.deleteProduct(productId);

    if (!result) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
   // Responder con un mensaje de éxito
   res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error.message);
    res
      .status(500)
      .json({ error: `Error al eliminar el producto: ${error.message}` });
  }
});

export default router;
