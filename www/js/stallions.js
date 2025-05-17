// Stallions catalog page functionality
(function() {
    // DOM Elements
    const stallionsGrid = document.getElementById('stallions-grid');
    const searchInput = document.getElementById('search-stallions');
    const breedFilter = document.getElementById('filter-breed');
    const ageFilter = document.getElementById('filter-age');
    const priceFilter = document.getElementById('filter-price');
    const paginationContainer = document.getElementById('pagination');
    
    // Stallions data
    let allStallions = [];
    let filteredStallions = [];
    let currentPage = 1;
    
    // Initialize page
    function initPage() {
        // Only proceed if on stallions page
        if (!stallionsGrid) return;
        
        // Add event listeners to filters
        if (searchInput) {
            searchInput.addEventListener('input', filterStallions);
        }
        
        if (breedFilter) {
            breedFilter.addEventListener('change', filterStallions);
        }
        
        if (ageFilter) {
            ageFilter.addEventListener('change', filterStallions);
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('change', filterStallions);
        }
        
        // Load stallions data
        loadStallionsData();
    }
    
    // Load stallions data from API
    function loadStallionsData() {
        // Show loading state
        stallionsGrid.innerHTML = '<div class="loading">Loading stallions...</div>';
        
        // Get API URL
        const apiUrl = `${window.appConfig.api.baseUrl}${window.appConfig.api.endpoints.stallions}`;
        
        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Simulated data - in real app, this would come from API
            allStallions = [
                {
                    id: 1,
                    name: "Thunder's Legacy",
                    breed: "Thoroughbred",
                    age: 8,
                    lineage: "Son of Triple Crown winner Gallant Thunder",
                    description: "Known for speed and agility, Thunder's Legacy has produced multiple race winners.",
                    price: 3500,
                    image: "/api/placeholder/600/400"
                },
                {
                    id: 2,
                    name: "Midnight Commander",
                    breed: "Arabian",
                    age: 10,
                    lineage: "Descended from the legendary Al-Marah bloodline",
                    description: "Exceptional conformation with proven genetics for endurance and beauty.",
                    price: 4200,
                    image: "/api/placeholder/600/400"
                },
                {
                    id: 3,
                    name: "Royal Prestige",
                    breed: "Andalusian",
                    age: 7,
                    lineage: "Direct descendant of Favorito VII",
                    description: "Impressive dressage performer with excellent temperament and movement.",
                    price: 5000,
                    image: "/api/placeholder/600/400"
                },
                {
                    id: 4,
                    name: "Silver Summit",
                    breed: "Hanoverian",
                    age: 9,
                    lineage: "Sired by Olympic champion Silvano",
                    description: "Known for producing top-tier show jumping offspring with excellent technique.",
                    price: 4800,
                    image: "/api/placeholder/600/400"
                },
                {
                    id: 5,
                    name: "Golden Horizon",
                    breed: "Quarter Horse",
                    age: 6,
                    lineage: "Son of World Champion Golden Eagle",
                    description: "Versatile genetics producing offspring excelling in multiple disciplines.",
                    price: 3800,
                    image: "/api/placeholder/600/400"
                },
                {
                    id: 6,
                    name: "Majestic Vision",
                    breed: "Friesian",
                    age: 8,
                    lineage: "Direct descendant of Royal Friesland",
                    description: "Stunning black stallion with exceptional movement and presence.",
                    price: 5500,
                    image: "/api/placeholder/600/400"
                },
                {
                    id: 7,
                    name: "Noble Spirit",
                    breed: "Warmblood",
                    age: 11,
                    lineage: "Premium European bloodlines",
                    description: "Exceptional dressage talent with trainable temperament and balanced gaits.",
                    price: 6200,
                    image: "/api/placeholder/600/400"
                },
                {
                    id: 8,
                    name: "Desert Wind",
                    breed: "Arabian",
                    age: 5,
                    lineage: "Egyptian bloodlines with champion heritage",
                    description: "Classic Arabian type with excellent conformation and presence.",
                    price: 3900,
                    image: "/api/placeholder/600/400"
                },
                {
                    id: 9,
                    name: "Victory Lap",
                    breed: "Thoroughbred",
                    age: 12,
                    lineage: "Multiple stakes winner with proven offspring",
                    description: "Champion racehorse now producing exceptional eventing prospects.",
                    price: 4500,
                    image: "/api/placeholder/600/400"
                }
            ];
            
            // Initialize with all stallions
            filteredStallions = [...allStallions];
            
            // Render first page
            renderStallions();
            
            // Initialize pagination
            initPagination();
        }, 1000);
    }
    
    // Filter stallions based on search input and filters
    function filterStallions() {
        // Get filter values
        const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
        const breedValue = breedFilter ? breedFilter.value : '';
        const ageValue = ageFilter ? ageFilter.value : '';
        const priceValue = priceFilter ? priceFilter.value : '';
        
        // Filter stallions
        filteredStallions = allStallions.filter(stallion => {
            // Check if matches search
            const matchesSearch = !searchValue || 
                stallion.name.toLowerCase().includes(searchValue) ||
                stallion.breed.toLowerCase().includes(searchValue) ||
                stallion.lineage.toLowerCase().includes(searchValue) ||
                stallion.description.toLowerCase().includes(searchValue);
            
            // Check if matches breed filter
            const matchesBreed = !breedValue || stallion.breed === breedValue;
            
            // Check if matches age filter
            let matchesAge = true;
            if (ageValue) {
                if (ageValue === '3-5' && (stallion.age < 3 || stallion.age > 5)) {
                    matchesAge = false;
                } else if (ageValue === '6-10' && (stallion.age < 6 || stallion.age > 10)) {
                    matchesAge = false;
                } else if (ageValue === '11+' && stallion.age < 11) {
                    matchesAge = false;
                }
            }
            
            // Check if matches price filter
            let matchesPrice = true;
            if (priceValue) {
                if (priceValue === '0-3000' && (stallion.price < 0 || stallion.price > 3000)) {
                    matchesPrice = false;
                } else if (priceValue === '3000-5000' && (stallion.price < 3000 || stallion.price > 5000)) {
                    matchesPrice = false;
                } else if (priceValue === '5000+' && stallion.price < 5000) {
                    matchesPrice = false;
                }
            }
            
            // Return true if matches all filters
            return matchesSearch && matchesBreed && matchesAge && matchesPrice;
        });
        
        // Reset to first page
        currentPage = 1;
        
        // Re-render stallions
        renderStallions();
        
        // Re-initialize pagination
        initPagination();
    }
    
    // Render stallions to grid
    function renderStallions() {
        // Clear grid
        stallionsGrid.innerHTML = '';
        
        // Check if no results
        if (filteredStallions.length === 0) {
            stallionsGrid.innerHTML = `
                <div class="no-results">
                    <p>No stallions found matching your criteria. Please try adjusting your filters.</p>
                </div>
            `;
            return;
        }
        
        // Get stallions for current page
        const itemsPerPage = window.appConfig.app.pagination.itemsPerPage;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageStallions = filteredStallions.slice(startIndex, endIndex);
        
        // Loop through stallions and create cards
        pageStallions.forEach(stallion => {
            const stallionCard = document.createElement('div');
            stallionCard.className = 'stallion-card';
            stallionCard.innerHTML = `
                <div class="stallion-img" style="background-image: url('${stallion.image}')">
                    <div class="stallion-price">$${stallion.price.toLocaleString()}</div>
                </div>
                <div class="stallion-info">
                    <h3>${stallion.name}</h3>
                    <div class="stallion-meta">
                        <div><strong>Breed: </strong>${stallion.breed}</div>
                        <div><strong>Age: </strong>${stallion.age} years</div>
                    </div>
                    <p><strong>Lineage: </strong>${stallion.lineage}</p>
                    <p>${stallion.description}</p>
                    <button class="btn add-to-cart" data-id="${stallion.id}">Add to Cart</button>
                </div>
            `;
            stallionsGrid.appendChild(stallionCard);
        });
        
        // Add event listeners to Add to Cart buttons
        addCartButtonListeners();
    }
    
    // Add event listeners to Add to Cart buttons
    function addCartButtonListeners() {
        stallionsGrid.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const stallionId = e.target.dataset.id;
                const stallion = allStallions.find(s => s.id == stallionId);
                addToCart(stallion);
            });
        });
    }
    
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
    
    // Update cart count in UI
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (!cartCount) return;
        
        // Get current cart
        const cart = JSON.parse(localStorage.getItem(window.appConfig.storage.cart) || '[]');
        
        // Update cart count
        cartCount.textContent = cart.length;
    }
    
    // Initialize pagination
    function initPagination() {
        if (!paginationContainer) return;
        
        // Clear pagination container
        paginationContainer.innerHTML = '';
        
        // Calculate number of pages
        const itemsPerPage = window.appConfig.app.pagination.itemsPerPage;
        const totalPages = Math.ceil(filteredStallions.length / itemsPerPage);
        
        // Don't show pagination if only one page
        if (totalPages <= 1) return;
        
        // Create previous button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&laquo;';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
                renderStallions();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(prevButton);
        
        // Determine which page buttons to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Create page buttons
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.dataset.page = i;
            
            if (i === currentPage) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                currentPage = parseInt(button.dataset.page);
                updatePagination();
                renderStallions();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            paginationContainer.appendChild(button);
        }
        
        // Create next button
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '&raquo;';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
                renderStallions();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(nextButton);
    }
    
    // Update pagination based on current page
    function updatePagination() {
        if (!paginationContainer) return;
        
        // Get all page buttons
        const pageButtons = paginationContainer.querySelectorAll('button[data-page]');
        
        // Update active state
        pageButtons.forEach(button => {
            if (parseInt(button.dataset.page) === currentPage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update prev/next buttons
        const itemsPerPage = window.appConfig.app.pagination.itemsPerPage;
        const totalPages = Math.ceil(filteredStallions.length / itemsPerPage);
        
        const prevButton = paginationContainer.querySelector('button:first-child');
        const nextButton = paginationContainer.querySelector('button:last-child');
        
        if (prevButton) {
            prevButton.disabled = currentPage === 1;
        }
        
        if (nextButton) {
            nextButton.disabled = currentPage === totalPages;
        }
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', initPage);
})();
