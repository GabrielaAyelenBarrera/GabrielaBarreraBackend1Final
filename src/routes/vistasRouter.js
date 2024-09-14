import { Router } from 'express';
import ProductsMongoDAO from '../dao/ProductsMongoDAO.js';

export const router = Router();

// Ruta para mostrar la lista de productos con paginación
router.get('/products', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const { docs: products, prevLink, nextLink } = await ProductsMongoDAO.getProductsPaginate(Number(page), Number(limit));
    res.render('products', { products, prevLink, nextLink });
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
});

// Ruta para mostrar los detalles de un producto específico
router.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await ProductsMongoDAO.getProductById(pid);

    if (product) {
      res.render('productDetails', { product });
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al obtener el producto');
  }
});
