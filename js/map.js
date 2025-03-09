/**
 * Smart Ambulance Routing System
 * Map Functionality
 */

class AmbulanceMap {
    constructor(mapElementId, options = {}) {
        this.mapElementId = mapElementId;
        this.options = Object.assign({}, mapConfig, options);
        this.map = null;
        this.ambulanceMarkers = {};
        this.hospitalMarkers = {};
        this.emergencyMarkers = {};
        this.routes = {};
        this.userLocationMarker = null;
        this.userLocation = null;
        this.ambulanceIcon = this.createIcon('ambulance', 'green');
        this.ambulanceDispatchedIcon = this.createIcon('ambulance', 'orange');
        this.hospitalIcon = this.createIcon('hospital', 'blue');
        this.hospitalFullIcon = this.createIcon('hospital', 'red');
        this.emergencyIcon = this.createIcon('exclamation-circle', 'red');
        this.userLocationIcon = this.createIcon('user', 'blue');
        
        this.init();
    }

    /**
     * Initialize the map
     */
    init() {
        // Create map instance
        this.map = L.map(this.mapElementId, {
            center: this.options.center,
            zoom: this.options.zoom
        });

        // Add tile layer
        L.tileLayer(this.options.tileLayer, {
            attribution: this.options.attribution
        }).addTo(this.map);

        // Get user's location
        this.getUserLocation();

        // Set up event listeners
        this.setupEventListeners();
    }

    /**
     * Create a custom icon for markers
     * @param {string} icon - Font Awesome icon name
     * @param {string} color - Icon color
     * @returns {L.DivIcon} - Leaflet DivIcon
     */
    createIcon(icon, color) {
        return L.divIcon({
            html: `<i class="fas fa-${icon}" style="color: ${color};"></i>`,
            className: 'custom-div-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    /**
     * Set up event listeners for the map
     */
    setupEventListeners() {
        // Map click event
        this.map.on('click', (e) => {
            console.log('Map clicked at:', e.latlng);
        });

        // Filter ambulances event
        const filterSelect = document.getElementById('filter-ambulances');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterAmbulances(e.target.value);
            });
        }

        // Refresh map event
        const refreshButton = document.getElementById('refresh-map');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.refreshMap();
            });
        }
    }

    /**
     * Get user's current location
     */
    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.userLocation = [latitude, longitude];
                    
                    // Center map on user location
                    this.map.setView(this.userLocation, this.options.zoom);
                    
                    // Add user location marker
                    this.addUserLocationMarker();
                    
                    // Load nearby hospitals and ambulances
                    this.loadNearbyHospitals();
                    this.loadAmbulances();
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Use default location if geolocation fails
                    this.userLocation = this.options.center;
                    this.loadNearbyHospitals();
                    this.loadAmbulances();
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            this.userLocation = this.options.center;
            this.loadNearbyHospitals();
            this.loadAmbulances();
        }
    }

    /**
     * Add user location marker to the map
     */
    addUserLocationMarker() {
        if (this.userLocationMarker) {
            this.map.removeLayer(this.userLocationMarker);
        }

        this.userLocationMarker = L.marker(this.userLocation, {
            icon: this.userLocationIcon
        }).addTo(this.map);

        this.userLocationMarker.bindPopup('Your Location').openPopup();
    }

    /**
     * Load ambulances from the database
     */
    loadAmbulances() {
        // Clear existing ambulance markers
        this.clearAmbulanceMarkers();

        // Get ambulances from Firebase
        database.ref('ambulances').on('value', (snapshot) => {
            const ambulances = snapshot.val() || {};
            
            // Add markers for each ambulance
            Object.keys(ambulances).forEach(id => {
                const ambulance = ambulances[id];
                this.addAmbulanceMarker(id, ambulance);
            });
        });
    }

    /**
     * Add ambulance marker to the map
     * @param {string} id - Ambulance ID
     * @param {Object} ambulance - Ambulance data
     */
    addAmbulanceMarker(id, ambulance) {
        if (!ambulance.location) return;

        const { latitude, longitude } = ambulance.location;
        const icon = ambulance.status === 'available' ? this.ambulanceIcon : this.ambulanceDispatchedIcon;
        
        const marker = L.marker([latitude, longitude], {
            icon: icon
        }).addTo(this.map);

        // Create popup content
        const popupContent = `
            <div class="marker-popup">
                <h3>${ambulance.id}</h3>
                <p><strong>Type:</strong> ${ambulanceTypes[ambulance.type] || ambulance.type}</p>
                <p><strong>Status:</strong> ${ambulance.status}</p>
                <p><strong>Driver:</strong> ${ambulance.driver || 'N/A'}</p>
                <p><strong>Last Updated:</strong> ${this.formatTime(ambulance.lastUpdated)}</p>
            </div>
        `;

        marker.bindPopup(popupContent);
        this.ambulanceMarkers[id] = marker;
    }

    /**
     * Clear all ambulance markers from the map
     */
    clearAmbulanceMarkers() {
        Object.values(this.ambulanceMarkers).forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.ambulanceMarkers = {};
    }

    /**
     * Filter ambulances by status
     * @param {string} status - Ambulance status to filter by
     */
    filterAmbulances(status) {
        database.ref('ambulances').once('value', (snapshot) => {
            const ambulances = snapshot.val() || {};
            
            // Clear existing markers
            this.clearAmbulanceMarkers();
            
            // Add filtered markers
            Object.keys(ambulances).forEach(id => {
                const ambulance = ambulances[id];
                if (status === 'all' || ambulance.status === status) {
                    this.addAmbulanceMarker(id, ambulance);
                }
            });
        });
    }

    /**
     * Load nearby hospitals from the database
     */
    loadNearbyHospitals() {
        // Clear existing hospital markers
        this.clearHospitalMarkers();

        // Get hospitals from Firebase
        database.ref('hospitals').on('value', (snapshot) => {
            const hospitals = snapshot.val() || {};
            
            // Add markers for each hospital
            Object.keys(hospitals).forEach(id => {
                const hospital = hospitals[id];
                this.addHospitalMarker(id, hospital);
            });

            // Update hospital list
            if (typeof updateHospitalList === 'function') {
                updateHospitalList(hospitals);
            }
        });
    }

    /**
     * Add hospital marker to the map
     * @param {string} id - Hospital ID
     * @param {Object} hospital - Hospital data
     */
    addHospitalMarker(id, hospital) {
        if (!hospital.location) return;

        const { latitude, longitude } = hospital.location;
        const capacityPercentage = (hospital.occupiedBeds / hospital.totalBeds) * 100;
        const isFull = capacityPercentage >= hospitalStatusThresholds.full;
        const icon = isFull ? this.hospitalFullIcon : this.hospitalIcon;
        
        const marker = L.marker([latitude, longitude], {
            icon: icon
        }).addTo(this.map);

        // Create popup content
        const popupContent = `
            <div class="marker-popup">
                <h3>${hospital.name}</h3>
                <p><strong>Address:</strong> ${hospital.address}</p>
                <p><strong>Capacity:</strong> ${hospital.occupiedBeds}/${hospital.totalBeds} beds (${Math.round(capacityPercentage)}%)</p>
                <p><strong>Wait Time:</strong> ${hospital.waitTime} mins</p>
                <p><strong>Phone:</strong> ${hospital.phone}</p>
                <button class="view-route-btn" data-hospital-id="${id}">View Route</button>
            </div>
        `;

        marker.bindPopup(popupContent);
        this.hospitalMarkers[id] = marker;

        // Add event listener for view route button
        marker.on('popupopen', () => {
            const viewRouteBtn = document.querySelector(`.view-route-btn[data-hospital-id="${id}"]`);
            if (viewRouteBtn) {
                viewRouteBtn.addEventListener('click', () => {
                    this.showRoute(this.userLocation, [latitude, longitude]);
                });
            }
        });
    }

    /**
     * Clear all hospital markers from the map
     */
    clearHospitalMarkers() {
        Object.values(this.hospitalMarkers).forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.hospitalMarkers = {};
    }

    /**
     * Add emergency marker to the map
     * @param {string} id - Emergency ID
     * @param {Object} emergency - Emergency data
     */
    addEmergencyMarker(id, emergency) {
        if (!emergency.location) return;

        const { latitude, longitude } = emergency.location;
        
        const marker = L.marker([latitude, longitude], {
            icon: this.emergencyIcon
        }).addTo(this.map);

        // Create popup content
        const popupContent = `
            <div class="marker-popup">
                <h3>${emergencyTypes[emergency.type]?.name || emergency.type}</h3>
                <p><strong>Patient:</strong> ${emergency.patientName || 'Unknown'}</p>
                <p><strong>Started:</strong> ${this.formatTime(emergency.timestamp)}</p>
                <p><strong>Status:</strong> ${emergency.status}</p>
                <p><strong>Address:</strong> ${emergency.address || 'Unknown'}</p>
            </div>
        `;

        marker.bindPopup(popupContent);
        this.emergencyMarkers[id] = marker;
    }

    /**
     * Show route between two points
     * @param {Array} start - Start coordinates [lat, lng]
     * @param {Array} end - End coordinates [lat, lng]
     */
    showRoute(start, end) {
        // Clear existing routes
        this.clearRoutes();

        // Create route key
        const routeKey = `${start.join(',')}-${end.join(',')}`;

        // Check if route already exists
        if (this.routes[routeKey]) {
            this.routes[routeKey].addTo(this.map);
            return;
        }

        // In a real application, you would use a routing service API
        // For this demo, we'll create a simple straight line
        const routePoints = [
            L.latLng(start[0], start[1]),
            L.latLng(end[0], end[1])
        ];

        const route = L.polyline(routePoints, {
            color: 'blue',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(this.map);

        // Fit map to show the entire route
        this.map.fitBounds(route.getBounds(), {
            padding: [50, 50]
        });

        // Store route
        this.routes[routeKey] = route;

        // Simulate route calculation with AI optimization
        this.simulateRouteOptimization(start, end);
    }

    /**
     * Simulate AI-based route optimization
     * @param {Array} start - Start coordinates [lat, lng]
     * @param {Array} end - End coordinates [lat, lng]
     */
    simulateRouteOptimization(start, end) {
        // Show loading indicator
        const loadingEl = document.createElement('div');
        loadingEl.className = 'route-loading';
        loadingEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating optimal route...';
        document.body.appendChild(loadingEl);

        // Simulate API delay
        setTimeout(() => {
            // Remove loading indicator
            document.body.removeChild(loadingEl);

            // Create route key
            const routeKey = `${start.join(',')}-${end.join(',')}`;

            // Remove straight line route
            if (this.routes[routeKey]) {
                this.map.removeLayer(this.routes[routeKey]);
            }

            // Create a more complex route (simulating traffic avoidance)
            const midPoint1 = [
                start[0] + (end[0] - start[0]) * 0.3 + 0.005,
                start[1] + (end[1] - start[1]) * 0.3 - 0.005
            ];
            
            const midPoint2 = [
                start[0] + (end[0] - start[0]) * 0.6 - 0.003,
                start[1] + (end[1] - start[1]) * 0.6 + 0.007
            ];

            const optimizedRoutePoints = [
                L.latLng(start[0], start[1]),
                L.latLng(midPoint1[0], midPoint1[1]),
                L.latLng(midPoint2[0], midPoint2[1]),
                L.latLng(end[0], end[1])
            ];

            const optimizedRoute = L.polyline(optimizedRoutePoints, {
                color: '#e74c3c',
                weight: 5,
                opacity: 0.8
            }).addTo(this.map);

            // Show route info
            const routeInfo = L.popup()
                .setLatLng(midPoint1)
                .setContent(`
                    <div class="route-info">
                        <h3>Optimized Route</h3>
                        <p><strong>Distance:</strong> 3.2 km</p>
                        <p><strong>Estimated Time:</strong> 7 minutes</p>
                        <p><strong>Traffic:</strong> Moderate</p>
                        <p><i class="fas fa-check-circle"></i> AI optimized to avoid congestion</p>
                    </div>
                `)
                .openOn(this.map);

            // Update stored route
            this.routes[routeKey] = optimizedRoute;
        }, 2000);
    }

    /**
     * Clear all routes from the map
     */
    clearRoutes() {
        Object.values(this.routes).forEach(route => {
            this.map.removeLayer(route);
        });
    }

    /**
     * Refresh the map data
     */
    refreshMap() {
        this.loadAmbulances();
        this.loadNearbyHospitals();
        
        // Show refresh animation
        const refreshBtn = document.getElementById('refresh-map');
        if (refreshBtn) {
            refreshBtn.classList.add('refreshing');
            setTimeout(() => {
                refreshBtn.classList.remove('refreshing');
            }, 1000);
        }
    }

    /**
     * Format timestamp to readable time
     * @param {number} timestamp - Timestamp in milliseconds
     * @returns {string} - Formatted time string
     */
    formatTime(timestamp) {
        if (!timestamp) return 'Unknown';
        
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Focus on a specific ambulance marker
     * @param {string} ambulanceId - ID of the ambulance to focus on
     */
    focusOnAmbulance(ambulanceId) {
        const marker = this.ambulanceMarkers[ambulanceId];
        
        if (marker) {
            // Zoom to the ambulance marker
            this.map.setView(marker.getLatLng(), 15);
            
            // Open the popup
            marker.openPopup();
            
            // Add a pulsing effect to highlight the ambulance
            const icon = marker.getIcon();
            const originalHtml = icon.options.html;
            
            // Create pulsing effect by changing the icon
            const pulseHtml = originalHtml.replace('fa-ambulance', 'fa-ambulance fa-beat');
            const pulsingIcon = L.divIcon({
                html: pulseHtml,
                className: 'custom-div-icon highlighted',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            marker.setIcon(pulsingIcon);
            
            // Reset icon after 5 seconds
            setTimeout(() => {
                marker.setIcon(icon);
            }, 5000);
            
            return true;
        }
        
        return false;
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        window.ambulanceMap = new AmbulanceMap('map');
    }

    // Initialize admin map if it exists
    const adminMapElement = document.getElementById('admin-overview-map');
    if (adminMapElement) {
        window.adminMap = new AmbulanceMap('admin-overview-map', {
            zoom: 11
        });
    }

    // Initialize dashboard map if it exists
    const dashboardMapElement = document.getElementById('dashboard-map');
    if (dashboardMapElement) {
        window.dashboardMap = new AmbulanceMap('dashboard-map', {
            zoom: 11
        });
    }
}); 