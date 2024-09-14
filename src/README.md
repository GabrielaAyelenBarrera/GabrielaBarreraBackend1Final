
# Proyecto eCommerce - 

Este proyecto utiliza un carrito de compras hardcodeado, lo que significa que todos los productos que se agregan desde la interfaz web se almacenan en un carrito específico cuyo ID ya está predefinido en el código.

## Cómo funciona

1. **ID del carrito hardcodeado**: El ID del carrito está definido en el archivo `public/js/products.js` como una constante llamada `hardcodedCartId`. Este ID corresponde a un carrito existente en mi base de datos de `carts`.

2. **Agregado de productos al carrito**: 
   - Cuando un usuario hace clic en el botón **Agregar al Carrito** en la página de productos, el producto seleccionado se agrega directamente al carrito cuyo ID está hardcodeado.
   - El carrito se gestiona en `localStorage`, pero no se crea un nuevo carrito para cada sesión de usuario; el carrito hardcodeado es el único utilizado.

3. **Cómo modificar el carrito hardcodeado**:
   - Para cambiar el carrito al que se agregarán los productos, simplemente reemplaza el valor de `hardcodedCartId` en el archivo `public/js/products.js` con el ID de otro carrito.

## Rutas relevantes

- **CARTS**: 
  - Método: `GET`
  - URL: `/api/carts/`
  Obtener Todos los Carritos.
  - Método: `GET`
  - URL: `/api/carts/66e5e1a4128a729962cf608f(ejemplo de cart)`
  Obtener un Carrito por ID
  - Método: `POST`
  - URL: `/api/carts/`
  Crear un Nuevo Carrito.
  - Método: `POST`
  - URL: `/api/carts/66e0fca6dec613183ca7a872(ejemplo de cart)/products`
  - Body: `{"productId": "66e0fca1dec613183ca7950e"(ejemplo de prod),"quantity": 2}`
  Agregar un Producto a un Carrito.
  - Método: `PUT`
  - URL: `/api/carts/66e0fca6dec613183ca7a872(ejemplo de cart)/products/66e0fca1dec613183ca7950e (ejemplo de prod)`
  - Body: `{"quantity": 5}`
  Actualizar la Cantidad de un Producto en un Carrito.
  - Método: `PUT`
  - URL: `/api/carts/66e0fca6dec613183ca7a872(ejemplo de cart)`
  - Body: `[{"productId": "66e0fca1dec613183ca796d9","quantity": 1}]`
   Actualizar el Carrito con un Arreglo de Productos.
  - Método: `DELETE`
  - URL: `/api/carts/66e0fca6dec613183ca7a872(ejemplo de cart)/products/66e0fca1dec613183ca7950e(ejemplo de prod)`
   Eliminar un Producto de un Carrito
- **PRODUCTS**: 
1. Obtener Todos los productos - GET /api/products
2. Obtener un producto por ID - GET /api/products/66e5e1a4128a729962cf608f(ejemplo de prod) 
4. Crear un Nuevo producto- POST /api/products
5. Eliminar un Producto - DELETE /api/products/66e0fca6dec613183ca7a872(ejemplo de prod)

## Frontend

### Página de Productos

La página de productos muestra una lista de productos con la opción de agregar productos al carrito. La funcionalidad de la página incluye:

- **Lista de Productos**: Se renderiza una lista de productos obtenidos desde la API.
- **Botón de Agregar al Carrito**: Cada producto tiene un botón para agregarlo al carrito.
- **Paginación**: La página muestra opciones para navegar entre diferentes páginas de productos.

**Código relevante (`public/js/products.js`)**:
