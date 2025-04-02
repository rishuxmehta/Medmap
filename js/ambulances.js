/**
 * Smart Ambulance Routing System
 * Ambulance Management
 */

// Initialize variables
let ambulances = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Ambulances script loaded');
    
    // Load ambulances
    loadAmbulances();
    
    // Set up refresh button
    const refreshButton = document.getElementById('refresh-map');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            loadAmbulances();
        });
    }
    
    // Set up filter
    const filterSelect = document.getElementById('filter-ambulances');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            filterAmbulances(this.value);
        });
    }
});

/**
 * Load ambulances from localStorage
 */
function loadAmbulances() {
    // Try to get ambulances from localStorage (added by admin)
    const storedAmbulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
    
    // If ambulances exist in localStorage, use them
    if (storedAmbulances.length > 0) {
        ambulances = storedAmbulances;
    } else {
        // Otherwise, use default ambulances with random locations
        ambulances = createDefaultAmbulances();
    }
    
    // Update markers on the map
    updateAmbulanceMarkers();
}

/**
 * Create default ambulances with random locations
 * @returns {Array} - Array of ambulance objects
 */
function createDefaultAmbulances() {
    // Get map center or use default Vadodara coordinates
    const mapCenter = window.ambulanceMap ? window.ambulanceMap.getCenter() : [22.3072, 73.1812];
    
    // Create default ambulances
    const defaultAmbulances = [
        {
            id: 'ambulance-1',
            vehicleNumber: 'GJ-06-X-1234',
            type: 'Advanced',
            status: 'Available',
            location: {
                lat: mapCenter[0] + (Math.random() * 0.02 - 0.01),
                lng: mapCenter[1] + (Math.random() * 0.02 - 0.01)
            },
            driver: {
                name: 'Rajesh Patel',
                phone: '(0265) 9876543'
            },
            hospital: 'SSG Hospital',
            equipment: ['Oxygen', 'Defibrillator', 'Ventilator']
        },
        {
            id: 'ambulance-2',
            vehicleNumber: 'GJ-06-X-5678',
            type: 'Basic',
            status: 'Busy',
            location: {
                lat: mapCenter[0] + (Math.random() * 0.02 - 0.01),
                lng: mapCenter[1] + (Math.random() * 0.02 - 0.01)
            },
            driver: {
                name: 'Suresh Kumar',
                phone: '(0265) 8765432'
            },
            hospital: 'Bhailal Amin General Hospital',
            equipment: ['Oxygen', 'First Aid Kit']
        },
        {
            id: 'ambulance-3',
            vehicleNumber: 'GJ-06-X-9012',
            type: 'Mobile ICU',
            status: 'Available',
            location: {
                lat: mapCenter[0] + (Math.random() * 0.02 - 0.01),
                lng: mapCenter[1] + (Math.random() * 0.02 - 0.01)
            },
            driver: {
                name: 'Mahesh Shah',
                phone: '(0265) 7654321'
            },
            hospital: 'Sterling Hospital',
            equipment: ['Oxygen', 'Defibrillator', 'Ventilator', 'ECG Monitor']
        },
        {
            id: 'ambulance-4',
            vehicleNumber: 'GJ-06-X-3456',
            type: 'Basic',
            status: 'Maintenance',
            location: {
                lat: mapCenter[0] + (Math.random() * 0.02 - 0.01),
                lng: mapCenter[1] + (Math.random() * 0.02 - 0.01)
            },
            driver: {
                name: 'Ramesh Joshi',
                phone: '(0265) 6543210'
            },
            hospital: 'Apollo Hospital',
            equipment: ['Oxygen', 'First Aid Kit']
        },
        {
            id: 'ambulance-5',
            vehicleNumber: 'GJ-06-X-7890',
            type: 'Advanced',
            status: 'Available',
            location: {
                lat: mapCenter[0] + (Math.random() * 0.02 - 0.01),
                lng: mapCenter[1] + (Math.random() * 0.02 - 0.01)
            },
            driver: {
                name: 'Dinesh Patel',
                phone: '(0265) 5432109'
            },
            hospital: 'Baroda Medical College Hospital',
            equipment: ['Oxygen', 'Defibrillator', 'ECG Monitor']
        }
    ];
    
    return defaultAmbulances;
}

/**
 * Update ambulance markers on the map
 */
function updateAmbulanceMarkers() {
    // Check if map is initialized
    if (!window.ambulanceMap) {
        console.error('Map not initialized');
        return;
    }
    
    // Clear existing ambulance markers
    window.ambulanceMap.clearAmbulanceMarkers();
    
    // Add ambulance markers to map
    ambulances.forEach(ambulance => {
        // Skip if ambulance has no location
        if (!ambulance.location || !ambulance.location.lat || !ambulance.location.lng) {
            return;
        }
        
        // Add marker to map
        window.ambulanceMap.addAmbulanceMarker(
            [ambulance.location.lat, ambulance.location.lng],
            ambulance.status,
            {
                id: ambulance.id,
                number: ambulance.vehicleNumber,
                type: ambulance.type,
                status: ambulance.status,
                driver: ambulance.driver.name,
                phone: ambulance.driver.phone,
                hospital: ambulance.hospital,
                equipment: ambulance.equipment.join(', ')
            }
        );
    });
}

/**
 * Filter ambulances by status
 * @param {string} status - Ambulance status ('all', 'available', 'busy', 'maintenance')
 */
function filterAmbulances(status) {
    // Return if map not initialized
    if (!window.ambulanceMap) {
        console.error('Map not initialized');
        return;
    }
    
    // If 'all', show all ambulances
    if (status === 'all') {
        updateAmbulanceMarkers();
        return;
    }
    
    // Clear existing ambulance markers
    window.ambulanceMap.clearAmbulanceMarkers();
    
    // Add filtered ambulance markers to map
    ambulances.forEach(ambulance => {
        // Skip if ambulance has no location or doesn't match filter
        if (!ambulance.location || !ambulance.location.lat || !ambulance.location.lng) {
            return;
        }
        
        // Convert status to lowercase for case-insensitive comparison
        const ambulanceStatus = ambulance.status.toLowerCase();
        const filterStatus = status.toLowerCase();
        
        // Skip if status doesn't match filter
        if (ambulanceStatus !== filterStatus) {
            return;
        }
        
        // Add marker to map
        window.ambulanceMap.addAmbulanceMarker(
            [ambulance.location.lat, ambulance.location.lng],
            ambulance.status,
            {
                id: ambulance.id,
                number: ambulance.vehicleNumber,
                type: ambulance.type,
                status: ambulance.status,
                driver: ambulance.driver.name,
                phone: ambulance.driver.phone,
                hospital: ambulance.hospital,
                equipment: ambulance.equipment.join(', ')
            }
        );
    });
}

/**
 * Update ambulance position (for simulation)
 * @param {string} ambulanceId - Ambulance ID
 * @param {Array} newPosition - [latitude, longitude]
 */
function updateAmbulancePosition(ambulanceId, newPosition) {
    // Find ambulance
    const ambulance = ambulances.find(a => a.id === ambulanceId);
    
    // Return if ambulance not found
    if (!ambulance) {
        console.error('Ambulance not found:', ambulanceId);
        return;
    }
    
    // Update ambulance position
    ambulance.location.lat = newPosition[0];
    ambulance.location.lng = newPosition[1];
    
    // Update markers on map
    updateAmbulanceMarkers();
}

/**
 * Update ambulance status
 * @param {string} ambulanceId - Ambulance ID
 * @param {string} newStatus - New status ('Available', 'Busy', 'Maintenance')
 */
function updateAmbulanceStatus(ambulanceId, newStatus) {
    // Find ambulance
    const ambulance = ambulances.find(a => a.id === ambulanceId);
    
    // Return if ambulance not found
    if (!ambulance) {
        console.error('Ambulance not found:', ambulanceId);
        return;
    }
    
    // Update ambulance status
    ambulance.status = newStatus;
    
    // Update markers on map
    updateAmbulanceMarkers();
} 