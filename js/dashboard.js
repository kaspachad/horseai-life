// Dashboard page functionality (continued)
        // Create stallion object
        const stallion = {
            id: stallionId ? parseInt(stallionId) : Date.now(),
            name,
            breed,
            age,
            price,
            lineage,
            description,
            status,
            image: imageUrl
        };
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // In a real app, this would be an API call
            
            if (stallionId) {
                // Update existing stallion
                const index = stallions.findIndex(s => s.id === parseInt(stallionId));
                if (index !== -1) {
                    stallions[index] = stallion;
                }
            } else {
                // Add new stallion
                stallions.push(stallion);
            }
            
            // Close modal
            closeStallionModal();
            
            // Render updated stallions
            renderStallions();
            
            // Update dashboard stats
            loadDashboardStats();
            
            // Show success message
            alert(`Stallion successfully ${stallionId ? 'updated' : 'added'}!`);
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }
    
    // Delete stallion
    function deleteStallion(stallionId) {
        // Show confirmation dialog
        if (!confirm('Are you sure you want to delete this stallion?')) return;
        
        // Simulate API call
        setTimeout(() => {
            // In a real app, this would be an API call
            
            // Remove stallion from array
            stallions = stallions.filter(s => s.id !== stallionId);
            
            // Render updated stallions
            renderStallions();
            
            // Update dashboard stats
            loadDashboardStats();
            
            // Show success message
            alert('Stallion successfully deleted!');
        }, 1000);
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
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', initPage);
})();
