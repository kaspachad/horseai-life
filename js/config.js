// Configuration file for HorseAI.life
const config = {
    // API configuration
    api: {
        // Base URL for API requests
        // Change this to your production server when deploying
        baseUrl: 'http://localhost:3000/api',
        
        // API endpoints
        endpoints: {
            stallions: '/stallions',
            users: '/users',
            auth: '/auth',
            orders: '/orders',
            messages: '/messages',
            uploads: '/uploads'
        },
        
        // API request timeout in milliseconds
        timeout: 30000
    },
    
    // Application settings
    app: {
        // Website name
        name: 'HorseAI.life',
        
        // Default pagination settings
        pagination: {
            itemsPerPage: 6,
            maxPaginationButtons: 5
        },
        
        // Image settings
        images: {
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['image/jpeg', 'image/png'],
            maxCount: 5
        }
    },
    
    // Storage keys for local data
    storage: {
        authToken: 'horseai_auth_token',
        user: 'horseai_user',
        cart: 'horseai_cart'
    }
};

// Export the config object
window.appConfig = config;
