
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(name + " added to cart!");
}

function displayCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  let html = "<ul>";
  let total = 0;
  cart.forEach(item => {
    html += `<li>${item.name} – $${item.price}</li>`;
    total += item.price;
  });
  html += `</ul><p><strong>Total:</strong> $${total}</p>`;
  container.innerHTML = html;
}

window.onload = displayCart;
