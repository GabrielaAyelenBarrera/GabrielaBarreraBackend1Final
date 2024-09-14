
# Proyecto eCommerce - Carrito de Compras Hardcodeado

Este proyecto utiliza un carrito de compras hardcodeado, lo que significa que todos los productos que se agregan desde la interfaz web se almacenan en un carrito específico cuyo ID ya está predefinido en el código.

## Cómo funciona

1. **ID del carrito hardcodeado**: El ID del carrito está definido en el archivo `public/js/products.js` como una constante llamada `hardcodedCartId`. Asegúrate de que este ID corresponda a un carrito existente en tu base de datos de `carts`.

2. **Agregado de productos al carrito**: 
   - Cuando un usuario hace clic en el botón **Agregar al Carrito** en la página de productos, el producto seleccionado se agrega directamente al carrito cuyo ID está hardcodeado.
   - El carrito se gestiona en `localStorage`, pero no se crea un nuevo carrito para cada sesión de usuario; el carrito hardcodeado es el único utilizado.

3. **Cómo modificar el carrito hardcodeado**:
   - Para cambiar el carrito al que se agregarán los productos, simplemente reemplaza el valor de `hardcodedCartId` en el archivo `public/js/products.js` con el ID de otro carrito.

## Rutas relevantes

- **API para agregar productos al carrito**: 
  - Método: `POST`
  - URL: `/api/carts/{cartId}/products`
  - Body: `{ "productId": "ID_DEL_PRODUCTO", "quantity": CANTIDAD }`
  
  Este endpoint agrega un producto al carrito especificado.

## Frontend

### Página de Productos

La página de productos muestra una lista de productos con la opción de agregar productos al carrito. La funcionalidad de la página incluye:

- **Lista de Productos**: Se renderiza una lista de productos obtenidos desde la API.
- **Botón de Agregar al Carrito**: Cada producto tiene un botón para agregarlo al carrito.
- **Paginación**: La página muestra opciones para navegar entre diferentes páginas de productos.

**Código relevante (`public/js/products.js`)**:
