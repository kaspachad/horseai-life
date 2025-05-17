// Authentication and user management (continued)
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // In a real app, this would be an API call
            // For demo purposes, we'll simulate a successful registration
            const userData = {
                id: 1,
                fullName: fullName,
                email: email,
                userType: activeTab, // 'breeder' or 'buyer'
                farmName: farmName,
                profileImage: null
            };
            
            // Store auth data
            localStorage.setItem(window.appConfig.storage.authToken, 'demo_token_12345');
            localStorage.setItem(window.appConfig.storage.user, JSON.stringify(userData));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
            // Reset form
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
    
    // Handle logout
    function logout(e) {
        if (e) e.preventDefault();
        
        // Clear local storage
        localStorage.removeItem(window.appConfig.storage.authToken);
        localStorage.removeItem(window.appConfig.storage.user);
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
    
    // Show message to user
    function showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // Find form to append message to
        const form = document.querySelector('.auth-form') || document.body;
        form.prepend(messageEl);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
    
    // Update dashboard data
    function updateDashboardData() {
        // Only proceed if on dashboard page
        if (!document.querySelector('.dashboard')) return;
        
        // Update dashboard stats (simulate API call)
        setTimeout(() => {
            // Simulated data - in real app, this would come from API
            const stats = {
                activeStallions: 3,
                pendingOrders: 5,
                monthlyRevenue: '$4,250',
                profileViews: 1285
            };
            
            // Update stats in UI
            document.getElementById('active-stallions').textContent = stats.activeStallions;
            document.getElementById('pending-orders').textContent = stats.pendingOrders;
            document.getElementById('monthly-revenue').textContent = stats.monthlyRevenue;
            document.getElementById('profile-views').textContent = stats.profileViews;
            
            // Simulated recent orders
            const recentOrders = [
                { id: 'ORD-1298', date: '2025-05-14', status: 'pending', customer: 'Amy Williams', total: '$3,500' },
                { id: 'ORD-1297', date: '2025-05-10', status: 'completed', customer: 'Robert Johnson', total: '$4,200' },
                { id: 'ORD-1296', date: '2025-05-08', status: 'pending', customer: 'Sarah Miller', total: '$3,800' },
                { id: 'ORD-1295', date: '2025-05-05', status: 'cancelled', customer: 'David Brown', total: '$5,000' }
            ];
            
            // Update recent orders in UI
            const recentOrdersList = document.getElementById('recent-orders-list');
            if (recentOrdersList) {
                recentOrdersList.innerHTML = '';
                
                recentOrders.forEach(order => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <div class="order-item">
                            <div class="order-info">
                                <div class="order-id">${order.id}</div>
                                <div class="order-date">${formatDate(order.date)} • ${order.customer}</div>
                            </div>
                            <div class="order-amount">
                                <div class="order-total">${order.total}</div>
                                <div class="order-status status-${order.status}">${capitalizeFirst(order.status)}</div>
                            </div>
                        </div>
                    `;
                    recentOrdersList.appendChild(listItem);
                });
            }
            
            // Simulated recent messages
            const recentMessages = [
                { id: 1, sender: 'Amy Williams', date: '2025-05-15', preview: 'I\'m interested in your stallion Thunder\'s Legacy. Is he still...' },
                { id: 2, sender: 'Support Team', date: '2025-05-13', preview: 'Your stallion profile for Midnight Commander has been approved...' },
                { id: 3, sender: 'Robert Johnson', date: '2025-05-10', preview: 'Thank you for the successful breeding with Royal Prestige...' },
                { id: 4, sender: 'System Notification', date: '2025-05-08', preview: 'Your payment for subscription renewal has been processed...' }
            ];
            
            // Update recent messages in UI
            const recentMessagesList = document.getElementById('recent-messages-list');
            if (recentMessagesList) {
                recentMessagesList.innerHTML = '';
                
                recentMessages.forEach(message => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <div class="message-item">
                            <div class="message-info">
                                <div class="message-sender">${message.sender}</div>
                                <div class="message-date">${formatDate(message.date)}</div>
                                <div class="message-preview">${message.preview}</div>
                            </div>
                        </div>
                    `;
                    recentMessagesList.appendChild(listItem);
                });
            }
        }, 500);
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Handle tab switching in auth forms
    function initAuthTabs() {
        const tabs = document.querySelectorAll('.auth-tab');
        if (!tabs.length) return;
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show/hide related fields
                const tabType = tab.dataset.tab;
                
                if (tabType === 'breeder') {
                    document.getElementById('breeder-fields').style.display = 'block';
                    document.getElementById('buyer-fields').style.display = 'none';
                } else {
                    document.getElementById('breeder-fields').style.display = 'none';
                    document.getElementById('buyer-fields').style.display = 'block';
                }
            });
        });
    }
    
    // Initialize page-specific functionality
    function initPage() {
        // Check if user is logged in and update UI accordingly
        updateAuthUI();
        
        // Initialize login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        // Initialize signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignup);
            initAuthTabs();
        }
        
        // Initialize dashboard if on dashboard page
        initDashboard();
    }
    
    // Initialize dashboard
    function initDashboard() {
        const dashboardTabs = document.querySelectorAll('.sidebar-menu li a');
        if (!dashboardTabs.length) return;
        
        dashboardTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get tab to show
                const tabId = tab.dataset.tab;
                
                // Hide all tabs
                document.querySelectorAll('.dashboard-tab').forEach(t => {
                    t.classList.remove('active');
                });
                
                // Show selected tab
                document.getElementById(tabId).classList.add('active');
                
                // Update active state in menu
                document.querySelectorAll('.sidebar-menu li').forEach(li => {
                    li.classList.remove('active');
                });
                tab.parentElement.classList.add('active');
            });
        });
        
        // Initialize stallion management if on stallions tab
        initStallionManagement();
    }
    
    // Initialize stallion management
    function initStallionManagement() {
        // Check if on dashboard page with stallions tab
        const stallionsTab = document.getElementById('stallions');
        if (!stallionsTab) return;
        
        // Add stallion button
        const addStallionBtn = document.getElementById('add-stallion-btn');
        if (addStallionBtn) {
            addStallionBtn.addEventListener('click', openStallionModal);
        }
        
        // Close modal buttons
        const closeModalBtn = document.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancel-stallion');
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeStallionModal);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeStallionModal);
        }
        
        // Stallion form submit
        const stallionForm = document.getElementById('stallion-form');
        if (stallionForm) {
            stallionForm.addEventListener('submit', saveStallion);
        }
        
        // Status toggle
        const statusToggle = document.getElementById('stallion-status');
        const statusText = document.getElementById('status-text');
        
        if (statusToggle && statusText) {
            statusToggle.addEventListener('change', () => {
                statusText.textContent = statusToggle.checked ? 'Active' : 'Inactive';
            });
        }
        
        // Image upload
        const uploadBtn = document.getElementById('upload-btn');
        const imageInput = document.getElementById('stallion-images');
        const imagePreview = document.getElementById('image-preview');
        
        if (uploadBtn && imageInput && imagePreview) {
            // Preview image when selected
            imageInput.addEventListener('change', () => {
                if (imageInput.files && imageInput.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Stallion Image">`;
                    };
                    
                    reader.readAsDataURL(imageInput.files[0]);
                }
            });
            
            // Click on preview opens file dialog
            imagePreview.addEventListener('click', () => {
                imageInput.click();
            });
            
            // Upload button 
            uploadBtn.addEventListener('click', () => {
                imageInput.click();
            });
        }
        
        // Load stallions data
        loadStallionsData();
    }
    
    // Open stallion modal
    function openStallionModal(stallion = null) {
        const modal = document.getElementById('stallion-modal');
        const modalTitle = document.getElementById('stallion-modal-title');
        const stallionForm = document.getElementById('stallion-form');
        
        // Reset form
        stallionForm.reset();
        
        // Update modal title and form ID field
        if (stallion) {
            modalTitle.textContent = 'Edit Stallion';
            document.getElementById('stallion-id').value = stallion.id;
            
            // Populate form with stallion data
            document.getElementById('stallion-name').value = stallion.name;
            document.getElementById('stallion-breed').value = stallion.breed;
            document.getElementById('stallion-age').value = stallion.age;
            document.getElementById('stallion-price').value = stallion.price;
            document.getElementById('stallion-lineage').value = stallion.lineage;
            document.getElementById('stallion-description').value = stallion.description;
            document.getElementById('stallion-status').checked = stallion.status === 'active';
            document.getElementById('status-text').textContent = stallion.status === 'active' ? 'Active' : 'Inactive';
            
            // Display image if available
            if (stallion.image) {
                document.getElementById('image-preview').innerHTML = `<img src="${stallion.image}" alt="${stallion.name}">`;
            } else {
                document.getElementById('image-preview').innerHTML = `<span class="upload-icon">+</span>`;
            }
        } else {
            modalTitle.textContent = 'Add New Stallion';
            document.getElementById('stallion-id').value = '';
            document.getElementById('image-preview').innerHTML = `<span class="upload-icon">+</span>`;
        }
        
        // Show modal
        modal.style.display = 'block';
    }
    
    // Close stallion modal
    function closeStallionModal() {
        const modal = document.getElementById('stallion-modal');
        modal.style.display = 'none';
    }
    
    // Save stallion data
    function saveStallion(e) {
        e.preventDefault();
        
        // Get form data
        const stallionId = document.getElementById('stallion-id').value;
        const name = document.getElementById('stallion-name').value;
        const breed = document.getElementById('stallion-breed').value;
        const age = document.getElementById('stallion-age').value;
        const price = document.getElementById('stallion-price').value;
        const lineage = document.getElementById('stallion-lineage').value;
        const description = document.getElementById('stallion-description').value;
        const status = document.getElementById('stallion-status').checked ? 'active' : 'inactive';
        
        // Basic validation
        if (!name || !breed || !age || !price) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Get image if available
        const imagePreview = document.getElementById('image-preview');
        const img = imagePreview.querySelector('img');
        const imageUrl = img ? img.src : null;
        
        // Create stallion object
        const stallion = {
            id: stallionId || Date.now().toString(),
            name,
            breed,
            age: parseInt(age),
            price: parseInt(price),
            lineage,
            description,
            status,
            image: imageUrl || '/api/placeholder/600/400'
        };
        
        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // In a real app, this would be an API call
            
            // Close modal
            closeStallionModal();
            
            // Reload stallions data
            loadStallionsData();
            
            // Show success message
            alert(`Stallion ${stallionId ? 'updated' : 'added'} successfully!`);
        }, 500);
    }
    
    // Load stallions data
    function loadStallionsData() {
        const stallionsTableBody = document.getElementById('stallions-table-body');
        if (!stallionsTableBody) return;
        
        // Clear table
        stallionsTableBody.innerHTML = '<tr><td colspan="7" class="loading">Loading stallions...</td></tr>';
        
        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Simulated data - in real app, this would come from API
            const stallions = [
                {
                    id: 1,
                    name: "Thunder's Legacy",
                    breed: "Thoroughbred",
                    age: 8,
                    lineage: "Son of Triple Crown winner Gallant Thunder",
                    description: "Known for speed and agility, Thunder's Legacy has produced multiple race winners.",
                    price: 3500,
                    status: 'active',
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
                    status: 'active',
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
                    status: 'inactive',
                    image: "/api/placeholder/600/400"
                }
            ];
            
            // Update table
            stallionsTableBody.innerHTML = '';
            
            stallions.forEach(stallion => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="stallion-image-cell">
                        <img src="${stallion.image}" alt="${stallion.name}">
                    </td>
                    <td>${stallion.name}</td>
                    <td>${stallion.breed}</td>
                    <td>${stallion.age} years</td>
                    <td>$${stallion.price}</td>
                    <td><span class="status-badge status-${stallion.status}">${capitalizeFirst(stallion.status)}</span></td>
                    <td>
                        <div class="action-buttons">
                            <span class="action-btn edit-btn" data-id="${stallion.id}">✎</span>
                            <span class="action-btn delete-btn" data-id="${stallion.id}">✕</span>
                        </div>
                    </td>
                `;
                stallionsTableBody.appendChild(row);
            });
            
            // Add event listeners to action buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const stallionId = btn.dataset.id;
                    const stallion = stallions.find(s => s.id == stallionId);
                    openStallionModal(stallion);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const stallionId = btn.dataset.id;
                    const stallion = stallions.find(s => s.id == stallionId);
                    
                    if (confirm(`Are you sure you want to delete ${stallion.name}?`)) {
                        // Simulate API call (replace with actual API call)
                        setTimeout(() => {
                            // In a real app, this would be an API call
                            
                            // Reload stallions data
                            loadStallionsData();
                            
                            // Show success message
                            alert('Stallion deleted successfully!');
                        }, 500);
                    }
                });
            });
        }, 1000);
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', initPage);
})();
