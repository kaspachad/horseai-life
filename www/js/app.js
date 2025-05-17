// Main application functionality (continued)
            container.appendChild(stallionCard);
        });
        
        // Add event listeners to Add to Cart buttons
        container.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const stallionId = e.target.dataset.id;
                const stallion = stallions.find(s => s.id == stallionId);
                addToCart(stallion);
            });
        });
    }
    
    // Initialize pagination
    function initPagination(stallions) {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;
        
        // Clear pagination container
        paginationContainer.innerHTML = '';
        
        // Calculate number of pages
        const itemsPerPage = window.appConfig.app.pagination.itemsPerPage;
        const totalPages = Math.ceil(stallions.length / itemsPerPage);
        
        // Create pagination buttons
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.dataset.page = i;
            
            if (i === 1) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                // Update active button
                paginationContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Show stallions for current page
                const startIndex = (i - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const pageStallions = stallions.slice(startIndex, endIndex);
                
                // Render stallions for current page
                const stallionsGrid = document.getElementById('stallions-grid');
                renderStallions(stallionsGrid, pageStallions);
            });
            
            paginationContainer.appendChild(button);
        }
        
        // Show first page
        const firstPageStallions = stallions.slice(0, itemsPerPage);
        const stallionsGrid = document.getElementById('stallions-grid');
        renderStallions(stallionsGrid, firstPageStallions);
    }
    
    // Cart functionality
    
    // Add stallion to cart
    function addToCart(stallion) {
        // Get current cart
        let cart = JSON.parse(localStorage.getItem(window.appConfig.storage.cart) || '[]');
        
        // Check if stallion already in cart
        const existingItem = cart.find(item => item.id == stallion.id);
        
        if (existingItem) {
            alert(`${stallion.name} is already in your cart!`);
            return;
        }
        
        // Add stallion to cart
        cart.push(stallion);
        
        // Save cart to local storage
        localStorage.setItem(window.appConfig.storage.cart, JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show confirmation
        alert(`${stallion.name} has been added to your cart!`);
    }
    
    // Remove stallion from cart
    function removeFromCart(stallionId) {
        // Get current cart
        let cart = JSON.parse(localStorage.getItem(window.appConfig.storage.cart) || '[]');
        
        // Remove stallion from cart
        cart = cart.filter(item => item.id != stallionId);
        
        // Save cart to local storage
        localStorage.setItem(window.appConfig.storage.cart, JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Update cart UI if on cart page
        if (document.getElementById('cart-content')) {
            renderCart();
        }
    }
    
    // Update cart count in UI
    function updateCartCount() {
        if (!cartCount) return;
        
        // Get current cart
        const cart = JSON.parse(localStorage.getItem(window.appConfig.storage.cart) || '[]');
        
        // Update cart count
        cartCount.textContent = cart.length;
    }
    
    // Load cart from local storage
    function loadCart() {
        // Update cart count
        updateCartCount();
    }
    
    // Initialize cart page
    function initCartPage() {
        const cartContent = document.getElementById('cart-content');
        if (!cartContent) return;
        
        // Render cart
        renderCart();
    }
    
    // Render cart
    function renderCart() {
        const cartContent = document.getElementById('cart-content');
        if (!cartContent) return;
        
        // Get current cart
        const cart = JSON.parse(localStorage.getItem(window.appConfig.storage.cart) || '[]');
        
        // If cart is empty
        if (cart.length === 0) {
            cartContent.innerHTML = `
                <div class="cart-empty">
                    <h3>Your cart is empty</h3>
                    <p>Browse our premium stallion collection to find the perfect match for your mare.</p>
                    <a href="stallions.html" class="btn">Browse Stallions</a>
                </div>
            `;
            return;
        }
        
        // Calculate total price
        let totalPrice = 0;
        cart.forEach(item => {
            totalPrice += item.price;
        });
        
        // Create cart HTML
        let cartHTML = `
            <div class="cart-items">
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>Stallion</th>
                            <th>Breed</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Add items to table
        cart.forEach(item => {
            cartHTML += `
                <tr>
                    <td>
                        <div class="cart-product">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-product-info">
                                <h4>${item.name}</h4>
                                <p>${item.age} years • ${item.breed}</p>
                            </div>
                        </div>
                    </td>
                    <td>${item.breed}</td>
                    <td>$${item.price.toLocaleString()}</td>
                    <td><span class="remove-btn" data-id="${item.id}">✕</span></td>
                </tr>
            `;
        });
        
        // Close table and add order summary
        cartHTML += `
                    </tbody>
                </table>
            </div>
            
            <div class="cart-total">
                <h3>Order Summary</h3>
                <div class="cart-summary">
                    <div class="cart-summary-row">
                        <span>Subtotal</span>
                        <span>$${totalPrice.toLocaleString()}</span>
                    </div>
                    <div class="cart-summary-row">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                    </div>
                    <div class="cart-summary-row">
                        <span>Total</span>
                        <span>$${totalPrice.toLocaleString()}</span>
                    </div>
                </div>
                <button class="btn btn-full" id="checkout-btn">Proceed to Checkout</button>
            </div>
            
            <div class="checkout-section" id="checkout-section" style="display: none;">
                <h3 class="checkout-title">Checkout</h3>
                <form id="checkout-form">
                    <div class="form-group">
                        <label for="fullname">Full Name</label>
                        <input type="text" id="fullname" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Shipping Address</label>
                        <input type="text" id="address" class="form-control" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City</label>
                            <input type="text" id="city" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="state">State/Province</label>
                            <input type="text" id="state" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="zip">ZIP/Postal Code</label>
                            <input type="text" id="zip" class="form-control" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="country">Country</label>
                        <select id="country" class="form-control" required>
                            <option value="">Select Country</option>
                            <option value="USA">United States</option>
                            <option value="CAN">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AUS">Australia</option>
                            <option value="GER">Germany</option>
                            <option value="FRA">France</option>
                        </select>
                    </div>
                    
                    <h3 class="checkout-title">Payment Information</h3>
                    
                    <div class="form-group">
                        <label for="card-number">Card Number</label>
                        <input type="text" id="card-number" class="form-control" placeholder="1234 5678 9012 3456" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiry">Expiry Date (MM/YY)</label>
                            <input type="text" id="expiry" class="form-control" placeholder="MM/YY" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="cvv">CVV</label>
                            <input type="text" id="cvv" class="form-control" placeholder="123" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-container">
                            <input type="checkbox" id="terms" required>
                            <span class="checkmark"></span>
                            I agree to the <a href="terms.html">Terms of Service</a> and <a href="privacy.html">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <button type="submit" class="btn btn-full">Complete Purchase</button>
                </form>
            </div>
        `;
        
        // Update cart HTML
        cartContent.innerHTML = cartHTML;
        
        // Add event listeners
        
        // Remove buttons
        cartContent.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const stallionId = e.target.dataset.id;
                removeFromCart(stallionId);
            });
        });
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        const checkoutSection = document.getElementById('checkout-section');
        
        if (checkoutBtn && checkoutSection) {
            checkoutBtn.addEventListener('click', () => {
                checkoutSection.style.display = 'block';
                checkoutBtn.style.display = 'none';
                checkoutSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Checkout form
        const checkoutForm = document.getElementById('checkout-form');
        
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;
                
                // Simulate payment processing
                setTimeout(() => {
                    // Clear cart
                    localStorage.setItem(window.appConfig.storage.cart, '[]');
                    
                    // Update cart count
                    updateCartCount();
                    
                    // Show success message
                    cartContent.innerHTML = `
                        <div class="cart-empty">
                            <h3>Thank you for your order!</h3>
                            <p>Your order has been processed successfully. You will receive a confirmation email shortly.</p>
                            <a href="index.html" class="btn">Return to Home Page</a>
                        </div>
                    `;
                    
                    // Reset form
                    checkoutForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            });
        }
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', initPage);
})();
