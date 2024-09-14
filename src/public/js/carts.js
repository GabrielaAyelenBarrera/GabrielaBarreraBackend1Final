document.addEventListener("DOMContentLoaded", () => {
  const ulCart = document.querySelector("#carts-list");

  // Función para obtener los productos del carrito y renderizarlos
  const renderCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Obtener el carrito del localStorage

    ulCart.innerHTML = ""; // Limpiar lista de carrito

    cart.forEach((item) => {
      let liItem = document.createElement("li");
      liItem.innerHTML = `
        <strong>${item.productTitle}</strong> <br>
        Cantidad: ${item.quantity}
      `;
      ulCart.append(liItem);
    });
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    localStorage.removeItem("cart");
    ulCart.innerHTML = ""; // Limpiar lista de carrito
  };

  // Función para manejar el botón de "Finalizar Compra"
  const handleCheckout = () => {
    const checkoutButton = document.querySelector("#checkout");
    checkoutButton.addEventListener("click", () => {
      // Redirigir a una página de confirmación de compra o de pago
      window.location.href = "/checkout"; 
    });
  };

  // Agregar evento al botón de "Vaciar Carrito"
  document.querySelector("#clear-cart").addEventListener("click", clearCart);
  handleCheckout();
  renderCart();
});
