(function() {
  const catalogContainer = document.getElementById('catalog');
  const cartContainer = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-button');
  const main = document.querySelector('main');

  function fetchJSON(url) {
    return fetch(url).then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    });
  }

  function loadCatalog() {
    fetchJSON(`${CONFIG.apiBase}/stallions`)
      .then(stallions => {
        stallions.forEach(s => {
          const card = document.createElement('div');
          card.className = 'stallion-card';
          card.innerHTML = `
            <img src="images/${s.image}" alt="${s.name}">
            <h3>${s.name}</h3>
            <p>Breed: ${s.breed}</p>
            <p>Age: ${s.age}</p>
            <p>Lineage: ${s.lineage}</p>
            <p>Price: $${s.price.toFixed(2)}</p>
            <button data-id="${s.id}" data-price="${s.price}">Add to Cart</button>
          `;
          catalogContainer.appendChild(card);
        });
      })
      .catch(err => console.error(err));

    catalogContainer.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') {
        addToCart(e.target.dataset.id, parseFloat(e.target.dataset.price));
        alert('Added to cart');
      }
    });
  }

  function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function addToCart(id, price) {
    const cart = getCart();
    cart.push({ id, price });
    saveCart(cart);
  }

  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index,1);
    saveCart(cart);
    renderCart();
  }

  function getCartTotal() {
    return getCart().reduce((sum,item) => sum + item.price,0);
  }

  function renderCart() {
    cartContainer.innerHTML = '';
    const cart = getCart();
    cart.forEach((item,index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>Stallion ID: ${item.id} - $${item.price.toFixed(2)}</span>
        <button data-index="${index}">Remove</button>
      `;
      cartContainer.appendChild(div);
    });
    cartTotalSpan.textContent = getCartTotal().toFixed(2);
    cartContainer.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') {
        removeFromCart(e.target.dataset.index);
      }
    });
  }

  function showPaymentForm() {
    checkoutButton.style.display = 'none';
    const form = document.createElement('form');
    form.id = 'payment-form';
    form.innerHTML = `
      <h3>Payment Details</h3>
      <label>Card Number: <input type="text" id="card-number" maxlength="19" required></label><br>
      <label>Expiry (MM/YY): <input type="text" id="card-expiry" maxlength="5" required></label><br>
      <label>CVV: <input type="text" id="card-cvv" maxlength="4" required></label><br>
      <button type="submit">Pay $${getCartTotal().toFixed(2)}</button>
    `;
    main.appendChild(form);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const paymentData = {
        cardNumber: document.getElementById('card-number').value,
        expiry: document.getElementById('card-expiry').value,
        cvv: document.getElementById('card-cvv').value,
        amount: getCartTotal(),
        items: getCart()
      };
      try {
        const res = await fetch(`${CONFIG.apiBase}/checkout`, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(paymentData)
        });
        const result = await res.json();
        if(result.success){
          alert('Payment successful!');
          localStorage.removeItem('cart');
          window.location.href = 'index.html';
        } else {
          alert('Payment failed: ' + result.message);
        }
      } catch(err){
        alert('Error processing payment.');
        console.error(err);
      }
    });
  }

  // Initialize
  if(catalogContainer) {
    loadCatalog();
  }
  if(cartContainer) {
    renderCart();
    checkoutButton.addEventListener('click', showPaymentForm);
  }
})();