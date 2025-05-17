// --- Data & State ---
const stallions = [
  {
    id: 1,
    name: 'Shadowfax',
    breed: 'Andalusian',
    age: 7,
    lineage: 'Galadriel’s Pride',
    price: 1200,
    img: 'https://picsum.photos/id/237/400/300'
  },
  {
    id: 2,
    name: 'Silvermane',
    breed: 'Arabian',
    age: 5,
    lineage: 'Desert Star',
    price: 980,
    img: 'https://picsum.photos/id/238/400/300'
  },
  {
    id: 3,
    name: 'Thunderhoof',
    breed: 'Thoroughbred',
    age: 6,
    lineage: 'Stormbreaker',
    price: 1500,
    img: 'https://picsum.photos/id/239/400/300'
  },
  // …add more as needed
];
let cart = [];

// --- Helpers ---
function $(s) { return document.querySelector(s) }
function updateCartCount() {
  $('#cart-count').textContent = cart.length;
}

// --- View Switching ---
const views = document.querySelectorAll('.view');
document.querySelectorAll('nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('nav button.active').classList.remove('active');
    btn.classList.add('active');
    showView(btn.dataset.view);
  });
});
function showView(name) {
  views.forEach(v => v.id === name
    ? v.classList.remove('hidden')
    : v.classList.add('hidden'));
  if (name === 'catalogue') renderCatalogue();
  if (name === 'cart') renderCart();
}

// --- Render Catalogue ---
function renderCatalogue() {
  const container = $('#stallions-container');
  container.innerHTML = '';
  stallions.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${s.img}" alt="${s.name}" />
      <div class="card-content">
        <h3>${s.name}</h3>
        <p><strong>Breed:</strong> ${s.breed}</p>
        <p><strong>Age:</strong> ${s.age}</p>
        <p><strong>Lineage:</strong> ${s.lineage}</p>
        <div class="price">💰 $${s.price.toLocaleString()}</div>
        <button data-id="${s.id}">Add to Cart</button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => {
      cart.push(s.id);
      updateCartCount();
    });
    container.append(card);
  });
}

// --- Render Cart + Checkout ---
function renderCart() {
  const list = $('#cart-container');
  const checkout = $('#checkout');
  const empty = $('#empty-cart');

  list.innerHTML = '';
  if (cart.length === 0) {
    empty.classList.remove('hidden');
    checkout.classList.add('hidden');
    return;
  }
  empty.classList.add('hidden');
  checkout.classList.remove('hidden');

  let total = 0;
  cart.forEach((id, idx) => {
    const s = stallions.find(x => x.id === id);
    total += s.price;
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <span>${s.name} — $${s.price.toLocaleString()}</span>
      <button data-idx="${idx}">Remove</button>
    `;
    item.querySelector('button').addEventListener('click', e => {
      cart.splice(e.target.dataset.idx, 1);
      updateCartCount();
      renderCart();
    });
    list.append(item);
  });
  const totalEl = document.createElement('div');
  totalEl.className = 'cart-item';
  totalEl.innerHTML = `<strong>Total:</strong> $${total.toLocaleString()}`;
  list.append(totalEl);
}

// --- Checkout Form ---
$('#checkout-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Payment successful! Thank you for your purchase.');
  cart = [];
  updateCartCount();
  renderCart();
});

// --- On Load ---
window.addEventListener('DOMContentLoaded', () => {
  // Show home by default
  showView('home');
  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
  updateCartCount();
});

