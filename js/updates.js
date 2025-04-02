/**
 * Updates Tab Functionality
 * Smart Ambulance Routing System
 */

document.addEventListener('DOMContentLoaded', function() {
    initUpdatesTab();
});

/**
 * Initialize updates tab functionality
 */
function initUpdatesTab() {
    // Filter update items
    const filterOptions = document.querySelectorAll('.filter-option');
    const updateItems = document.querySelectorAll('.update-item');
    
    if (filterOptions && updateItems) {
        filterOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Reset active state
                filterOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const filter = option.textContent.trim().toLowerCase();
                
                // Show/hide items based on filter
                updateItems.forEach(item => {
                    if (filter === 'all') {
                        item.style.display = 'flex';
                    } else {
                        // Check if item has a matching class or tag
                        const hasMatch = item.classList.contains(`${filter}-update`) || 
                                        item.querySelector(`.update-badge.${filter}`);
                        
                        item.style.display = hasMatch ? 'flex' : 'none';
                    }
                });
            });
        });
    }
    
    // "Load More" button functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // This would typically load more updates from the server
            // For demo purposes, we'll just show a message
            const updatesCount = document.querySelector('.updates-count');
            if (updatesCount) {
                updatesCount.textContent = 'Showing all 15 updates';
            }
            
            // Disable the button after it's been clicked
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'All Updates Loaded';
            loadMoreBtn.classList.add('disabled');
        });
    }
    
    // View details button functionality
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    if (viewDetailsButtons) {
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const updateItem = e.target.closest('.update-item');
                const updateTitle = updateItem.querySelector('h3').textContent;
                
                // In a real app, this would open a modal with detailed information
                alert(`Viewing details for: ${updateTitle}`);
            });
        });
    }
    
    // Mark updates as read
    const updateItems = document.querySelectorAll('.update-item');
    if (updateItems) {
        updateItems.forEach(item => {
            // Mark as read when clicked or view details clicked
            item.addEventListener('click', () => {
                if (!item.classList.contains('read')) {
                    item.classList.add('read');
                    updateUnreadCount();
                }
            });
        });
    }
    
    // Initialize unread count
    updateUnreadCount();
}

/**
 * Update the unread updates count in the sidebar badge
 */
function updateUnreadCount() {
    const updateBadge = document.querySelector('.admin-nav li[data-tab="updates"] .update-badge');
    const unreadItems = document.querySelectorAll('.update-item:not(.read)');
    
    if (updateBadge) {
        const count = unreadItems.length;
        updateBadge.textContent = count;
        
        // Hide badge if no unread updates
        if (count === 0) {
            updateBadge.style.display = 'none';
        } else {
            updateBadge.style.display = 'inline-flex';
        }
    }
} 