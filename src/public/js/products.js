document.addEventListener("DOMContentLoaded", () => {
  const ulProducts = document.querySelector("#product-list");
  const pagination = document.querySelector("#pagination");
  const viewCartButton = document.querySelector("#view-cart"); // Botón para ver el carrito

  // Función para obtener los productos y paginación
  const getProductos = async () => {
    let params = new URLSearchParams(location.search);
    let page = params.get("page");
    if (!page || isNaN(Number(page))) {
      page = 1;
    }

    try {
      let respuesta = await fetch(`/api/products?page=${page}`);
      let datos = await respuesta.json();

      if (datos.status === "success") {
        ulProducts.innerHTML = ""; // Limpiar lista de productos

        datos.payload.forEach((product) => {
          let liProduct = document.createElement("li");
          liProduct.innerHTML = `
            <strong>${product.title}</strong> <br>
            <a href="/products/${product._id}">Ver detalles</a>
            <button class="add-to-cart" data-product-id="${product._id}" data-title="${product.title}">Agregar al Carrito</button>
          `;
          ulProducts.append(liProduct);
        });

        pagination.innerHTML = ""; // Limpiar paginación previa

        if (datos.prevLink) {
          const prevLink = document.createElement("a");
          prevLink.href = datos.prevLink.replace("/api/products", "/products");
          prevLink.textContent = "Página Anterior";
          pagination.append(prevLink);
        }

        if (datos.nextLink) {
          const nextLink = document.createElement("a");
          nextLink.href = datos.nextLink.replace("/api/products", "/products");
          nextLink.textContent = "Página Siguiente";
          pagination.append(nextLink);
        }
      } else {
        console.error("Error fetching products:", datos.message);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  // Función para gestionar el carrito en localStorage
  const manageCart = (productId, productTitle) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Obtener el carrito del localStorage

    const existingProduct = cart.find((item) => item.productId === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ productId, productTitle, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Producto ${productTitle} agregado al carrito`);
  };

  // Función para agregar eventos a los botones de "Agregar al Carrito"
  const attachCartButtonEvents = () => {
    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.dataset.productId;
        const productTitle = event.target.dataset.title;

        manageCart(productId, productTitle);
      });
    });
  };

  // Función para manejar la redirección a la vista del carrito
  const handleViewCart = () => {
    viewCartButton.addEventListener("click", () => {
      // Redirigir a la página del carrito
      window.location.href = "/cart"; 
    });
  };

  // Obtiene los productos y luego asignar eventos a los botones de carrito
  getProductos().then(attachCartButtonEvents);

  // Añadi el evento para el botón "Ver Carrito"
  handleViewCart();
});
