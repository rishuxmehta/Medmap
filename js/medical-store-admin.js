document.addEventListener('DOMContentLoaded', function() {
    initMedicalStoreAdmin();
});

function initMedicalStoreAdmin() {
    // Initialize store map
    initStoreMap();
    
    // Add event listeners for medical store actions
    setupStoreActions();
    
    // Setup filter controls for the map
    setupMapControls();
}

function initStoreMap() {
    const mapContainer = document.getElementById('medical-store-map');
    if (!mapContainer) return;
    
    // Initialize map centered at Vadodara
    const map = L.map('medical-store-map').setView([22.3072, 73.1812], 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Sample medical store data (in a real app, this would come from the server)
    const stores = [
        {
            id: 'MS-1001',
            name: 'City Pharmacy',
            address: '123 Main Street, Vadodara',
            lat: 22.3105,
            lng: 73.1810,
            status: 'open',
            hours: '8:00 AM - 10:00 PM'
        },
        {
            id: 'MS-1002',
            name: 'MedPlus',
            address: '45 Station Road, Vadodara',
            lat: 22.3052,
            lng: 73.1845,
            status: 'open',
            hours: '24x7'
        },
        {
            id: 'MS-1003',
            name: 'Apollo Pharmacy',
            address: '78 Market Square, Vadodara',
            lat: 22.3125,
            lng: 73.1795,
            status: 'open',
            hours: '9:00 AM - 9:00 PM'
        }
    ];
    
    // Add markers for each store
    stores.forEach(store => {
        const marker = L.marker([store.lat, store.lng]).addTo(map);
        
        // Create popup with store info
        const popupContent = `
            <div class="map-popup">
                <h3>${store.name}</h3>
                <p>${store.address}</p>
                <p><strong>Hours:</strong> ${store.hours}</p>
                <p><strong>Status:</strong> <span class="status-${store.status}">${store.status === 'open' ? 'Open' : 'Closed'}</span></p>
                <button class="popup-action-btn view-store" data-id="${store.id}">View Details</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Store reference to marker for filtering
        marker.storeData = store;
    });
    
    // Store map reference globally for access in other functions
    window.storeMap = map;
}

function setupStoreActions() {
    // Get all action buttons
    const editButtons = document.querySelectorAll('.action-btn.edit');
    const viewButtons = document.querySelectorAll('.action-btn.view');
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    const addStoreBtn = document.getElementById('add-store-btn');
    
    // Add event listeners for edit buttons
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const storeId = this.closest('tr').querySelector('.store-id span').textContent;
            editStore(storeId);
        });
    });
    
    // Add event listeners for view buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const storeId = this.closest('tr').querySelector('.store-id span').textContent;
            viewStore(storeId);
        });
    });
    
    // Add event listeners for delete buttons
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const storeId = this.closest('tr').querySelector('.store-id span').textContent;
            deleteStore(storeId);
        });
    });
    
    // Add event listener for add store button
    if (addStoreBtn) {
        addStoreBtn.addEventListener('click', () => {
            // Open add store modal (would be implemented in a real app)
            showNotification('Add store functionality would open a modal', 'info');
        });
    }
}

function setupMapControls() {
    const showAllBtn = document.getElementById('show-all-stores');
    const showOpenBtn = document.getElementById('show-open-stores');
    const showEmergencyBtn = document.getElementById('show-emergency-stores');
    
    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => filterStores('all'));
    }
    
    if (showOpenBtn) {
        showOpenBtn.addEventListener('click', () => filterStores('open'));
    }
    
    if (showEmergencyBtn) {
        showEmergencyBtn.addEventListener('click', () => filterStores('24x7'));
    }
}

function filterStores(filter) {
    // Access the map instance from the global scope
    const map = window.storeMap;
    if (!map) return;
    
    // Get all markers from the map
    map.eachLayer(layer => {
        // Check if the layer is a marker with store data
        if (layer instanceof L.Marker && layer.storeData) {
            const store = layer.storeData;
            
            if (filter === 'all') {
                layer.setOpacity(1); // Show all stores
            } else if (filter === 'open' && store.status === 'open') {
                layer.setOpacity(1); // Show open stores
            } else if (filter === '24x7' && store.hours === '24x7') {
                layer.setOpacity(1); // Show 24x7 stores
            } else {
                layer.setOpacity(0.3); // Fade out filtered stores
            }
        }
    });
    
    // Update active state of control buttons
    document.querySelectorAll('.store-map-controls .map-control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to the clicked button
    if (filter === 'all') {
        document.getElementById('show-all-stores').classList.add('active');
    } else if (filter === 'open') {
        document.getElementById('show-open-stores').classList.add('active');
    } else if (filter === '24x7') {
        document.getElementById('show-emergency-stores').classList.add('active');
    }
    
    showNotification(`Showing ${filter} medical stores`, 'info');
}

function editStore(storeId) {
    // In a real app, this would open a modal with the store data for editing
    showNotification(`Editing store ${storeId}`, 'info');
}

function viewStore(storeId) {
    // In a real app, this would open a modal with detailed store information
    showNotification(`Viewing store ${storeId}`, 'info');
}

function deleteStore(storeId) {
    // In a real app, this would show a confirmation dialog before deleting
    if (confirm(`Are you sure you want to delete store ${storeId}?`)) {
        // Remove the store row from the table
        const storeRow = document.querySelector(`.store-id span:contains("${storeId}")`).closest('tr');
        if (storeRow) {
            storeRow.remove();
            showNotification(`Store ${storeId} has been removed`, 'success');
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to notifications container or create one
    let notificationsContainer = document.querySelector('.notifications-container');
    if (!notificationsContainer) {
        notificationsContainer = document.createElement('div');
        notificationsContainer.className = 'notifications-container';
        document.body.appendChild(notificationsContainer);
    }
    
    notificationsContainer.appendChild(notification);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
} 