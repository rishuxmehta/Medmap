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
        this.routeCache = new Map();
        this.routeCalculationQueue = new Map();
        this.precalculatedRoutes = new Set();
        
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
        
        // Create marker with custom icon
        const marker = L.marker([latitude, longitude], {
            icon: icon,
            rotationAngle: ambulance.heading || 0
        }).addTo(this.map);

        // Create popup content with real-time updates
        const popupContent = `
            <div class="marker-popup">
                <h3>${ambulance.id}</h3>
                <p><strong>Type:</strong> ${ambulanceTypes[ambulance.type] || ambulance.type}</p>
                <p><strong>Status:</strong> ${ambulance.status}</p>
                <p><strong>Driver:</strong> ${ambulance.driver || 'N/A'}</p>
                <p><strong>Speed:</strong> ${ambulance.speed ? Math.round(ambulance.speed) + ' km/h' : 'N/A'}</p>
                <p><strong>ETA:</strong> ${ambulance.eta ? ambulance.eta + ' mins' : 'Calculating...'}</p>
                <p><strong>Last Updated:</strong> ${this.formatTime(ambulance.lastUpdated)}</p>
                <div class="ambulance-actions">
                    <button class="track-btn" data-id="${id}">Track</button>
                    <button class="call-btn" data-id="${id}">Call Driver</button>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        this.ambulanceMarkers[id] = marker;

        // Add event listeners for popup buttons
        marker.on('popupopen', () => {
            const trackBtn = document.querySelector(`.track-btn[data-id="${id}"]`);
            const callBtn = document.querySelector(`.call-btn[data-id="${id}"]`);

            if (trackBtn) {
                trackBtn.addEventListener('click', () => {
                    this.focusOnAmbulance(id);
                });
            }

            if (callBtn) {
                callBtn.addEventListener('click', () => {
                    this.callAmbulanceDriver(ambulance);
                });
            }
        });

        // Start real-time updates if ambulance is dispatched
        if (ambulance.status === 'dispatched') {
            this.startAmbulanceUpdates(id, ambulance);
        }
    }

    /**
     * Start real-time updates for an ambulance
     * @param {string} id - Ambulance ID
     * @param {Object} ambulance - Ambulance data
     */
    startAmbulanceUpdates(id, ambulance) {
        // Update every 5 seconds
        const updateInterval = setInterval(() => {
            const marker = this.ambulanceMarkers[id];
            if (!marker) {
                clearInterval(updateInterval);
                return;
            }

            // Simulate ambulance movement
            const currentLatLng = marker.getLatLng();
            const newLat = currentLatLng.lat + (Math.random() - 0.5) * 0.0001;
            const newLng = currentLatLng.lng + (Math.random() - 0.5) * 0.0001;
            const newHeading = Math.random() * 360;

            // Update marker position and rotation
            marker.setLatLng([newLat, newLng]);
            marker.setRotationAngle(newHeading);

            // Update ambulance data
            ambulance.location = { latitude: newLat, longitude: newLng };
            ambulance.heading = newHeading;
            ambulance.speed = Math.random() * 60 + 40; // Random speed between 40-100 km/h
            ambulance.lastUpdated = Date.now();

            // Update popup content
            const popup = marker.getPopup();
            if (popup.isOpen()) {
                popup.setContent(`
                    <div class="marker-popup">
                        <h3>${ambulance.id}</h3>
                        <p><strong>Type:</strong> ${ambulanceTypes[ambulance.type] || ambulance.type}</p>
                        <p><strong>Status:</strong> ${ambulance.status}</p>
                        <p><strong>Driver:</strong> ${ambulance.driver || 'N/A'}</p>
                        <p><strong>Speed:</strong> ${Math.round(ambulance.speed)} km/h</p>
                        <p><strong>ETA:</strong> ${ambulance.eta ? ambulance.eta + ' mins' : 'Calculating...'}</p>
                        <p><strong>Last Updated:</strong> ${this.formatTime(ambulance.lastUpdated)}</p>
                        <div class="ambulance-actions">
                            <button class="track-btn" data-id="${id}">Track</button>
                            <button class="call-btn" data-id="${id}">Call Driver</button>
                        </div>
                    </div>
                `);
            }
        }, 5000);
    }

    /**
     * Call ambulance driver
     * @param {Object} ambulance - Ambulance data
     */
    callAmbulanceDriver(ambulance) {
        if (!ambulance.driverPhone) {
            alert('Driver phone number not available');
            return;
        }

        // Create phone link
        const phoneLink = document.createElement('a');
        phoneLink.href = `tel:${ambulance.driverPhone}`;
        phoneLink.click();
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
            const hospitalList = [];
            let processedCount = 0;
            
            // Process each hospital
            Object.keys(hospitals).forEach(id => {
                const hospital = hospitals[id];
                if (hospital.location && this.userLocation && processedCount < 10) {
                    processedCount++;
                    // Calculate road distance using OSRM
                    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${this.userLocation[1]},${this.userLocation[0]};${hospital.location.longitude},${hospital.location.latitude}?overview=false`;
                    
                    fetch(osrmUrl)
                        .then(response => response.json())
                        .then(data => {
                            if (data.code === 'Ok') {
                                const route = data.routes[0];
                                const distance = Math.round(route.distance / 1000 * 10) / 10; // Convert to km
                                const time = Math.round(route.duration / 60); // Convert to minutes
                                
                                // Add distance and time to hospital data
                                hospital.distance = distance;
                                hospital.time = time;
                                hospitalList.push({ id, ...hospital });

                                // Sort hospitals by distance and limit to 10 nearest
                                hospitalList.sort((a, b) => a.distance - b.distance);
                                const nearestHospitals = hospitalList.slice(0, 10);

                                // Update hospital list in the UI
                                const hospitalListElement = document.getElementById('hospital-list');
                                if (hospitalListElement) {
                                    hospitalListElement.innerHTML = nearestHospitals.map((hospital, index) => {
                                        const capacityPercentage = (hospital.occupiedBeds / hospital.totalBeds) * 100;
                                        const isFull = capacityPercentage >= hospitalStatusThresholds.full;
                                        const waitTime = this.calculateWaitTime(hospital);
                                        
                                        return `
                                            <div class="hospital-card ${isFull ? 'full' : ''}">
                                                <div class="hospital-header">
                                                    <div class="hospital-icon">
                                                        <i class="fas fa-hospital"></i>
                                                    </div>
                                                    <div class="hospital-info">
                                                        <h3>${index + 1}. ${hospital.name}</h3>
                                                        <p>${hospital.address}</p>
                                                    </div>
                                                </div>
                                                <div class="hospital-details">
                                                    <div class="hospital-stat">
                                                        <span class="hospital-stat-label">Distance:</span>
                                                        <span class="hospital-stat-value">${Math.round(hospital.distance * 10) / 10} km away</span>
                                                    </div>
                                                    <div class="hospital-stat">
                                                        <span class="hospital-stat-label">Drive Time:</span>
                                                        <span class="hospital-stat-value">${hospital.time} mins</span>
                                                    </div>
                                                    <div class="hospital-stat">
                                                        <span class="hospital-stat-label">Wait Time:</span>
                                                        <span class="hospital-stat-value">${waitTime} mins</span>
                                                    </div>
                                                    <div class="hospital-beds">
                                                        <div class="beds-label">
                                                            <span>Available Beds:</span>
                                                            <span>${hospital.totalBeds - hospital.occupiedBeds}/${hospital.totalBeds}</span>
                                                        </div>
                                                        <div class="beds-progress">
                                                            <div class="beds-bar ${capacityPercentage >= 80 ? 'warning' : ''}" 
                                                                 style="width: ${capacityPercentage}%"></div>
                                                        </div>
                                                    </div>
                                                    <div class="hospital-specialties">
                                                        <span class="specialty-label">Specialties:</span>
                                                        <div class="specialty-tags">
                                                            ${hospital.specialties?.slice(0, 3).map(specialty => 
                                                                `<span class="specialty-tag">${specialty}</span>`
                                                            ).join('') || 'General'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="hospital-actions">
                                                    <button class="view-route-btn" data-hospital-id="${hospital.id}">
                                                        <i class="fas fa-route"></i> View Route
                                                    </button>
                                                    <button class="call-hospital-btn" data-phone="${hospital.phone}">
                                                        <i class="fas fa-phone"></i> Call
                                                    </button>
                                                </div>
                                            </div>
                                        `;
                                    }).join('');

                                    // Add event listeners for buttons
                                    this.setupHospitalListEventListeners();
                                }

                                // Add marker for this hospital
                                this.addHospitalMarker(id, hospital);
                            }
                        })
                        .catch(error => {
                            console.error('Error calculating route:', error);
                            // Fallback to straight-line distance if OSRM fails
                            const distance = this.calculateDistance(
                                this.userLocation,
                                [hospital.location.latitude, hospital.location.longitude]
                            );
                            hospital.distance = distance;
                            hospital.time = Math.round((distance / 60) * 60); // Estimate time based on 60 km/h
                            hospitalList.push({ id, ...hospital });
                        });
                }
            });
        });
    }

    calculateWaitTime(hospital) {
        const capacityPercentage = (hospital.occupiedBeds / hospital.totalBeds) * 100;
        const baseWaitTime = 15; // Base wait time in minutes

        if (capacityPercentage >= 90) return baseWaitTime * 3;
        if (capacityPercentage >= 70) return baseWaitTime * 2;
        if (capacityPercentage >= 50) return baseWaitTime * 1.5;
        return baseWaitTime;
    }

    setupHospitalListEventListeners() {
        const hospitalList = document.getElementById('hospital-list');
        if (!hospitalList) return;

        // View route buttons
        hospitalList.querySelectorAll('.view-route-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const hospitalId = e.target.closest('.view-route-btn').dataset.hospitalId;
                const hospital = this.hospitalMarkers[hospitalId];
                if (hospital) {
                    this.showRoute(this.userLocation, [
                        hospital.getLatLng().lat,
                        hospital.getLatLng().lng
                    ], hospital.options.hospitalName);
                }
            });
        });

        // Call hospital buttons
        hospitalList.querySelectorAll('.call-hospital-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const phone = e.target.closest('.call-hospital-btn').dataset.phone;
                if (phone) {
                    window.location.href = `tel:${phone}`;
                }
            });
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
            icon: icon,
            hospitalName: hospital.name
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
                    this.showRoute(this.userLocation, [latitude, longitude], hospital.name);
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
    showRoute(start, end, hospitalName = '') {
        // Clear existing routes
        this.clearRoutes();

        // Create route key
        const routeKey = `${start.join(',')}-${end.join(',')}`;

        // Show loading indicator
        const loadingEl = this.createLoadingIndicator();
        document.body.appendChild(loadingEl);

        // Use OSRM to get actual road route
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        
        fetch(osrmUrl)
            .then(response => response.json())
            .then(data => {
                if (data.code === 'Ok') {
                    const route = data.routes[0];
                    const distance = Math.round(route.distance / 1000 * 10) / 10; // Convert to km
                    const time = Math.round(route.duration / 60); // Convert to minutes

                    // Create route line using actual road geometry
                    const routeLine = L.geoJSON(data.routes[0].geometry, {
                        style: {
                            color: '#e74c3c',
                            weight: 5,
                            opacity: 0.8,
                            dashArray: '10, 10'
                        }
                    }).addTo(this.map);

                    // Store route
                    this.routes[routeKey] = routeLine;

                    // Fit map to show entire route
                    const bounds = routeLine.getBounds();
                    this.map.fitBounds(bounds, { padding: [50, 50] });

                    // Show route info with hospital name
                    const routeInfo = L.popup()
                        .setLatLng([(start[0] + end[0]) / 2, (start[1] + end[1]) / 2])
                        .setContent(`
                            <div class="route-info">
                                <h3>${hospitalName ? `Route to ${hospitalName}` : 'Route to Hospital'}</h3>
                                <div class="route-summary">
                                    <div class="route-stat">
                                        <i class="fas fa-road"></i>
                                        <span>${distance} km</span>
                                    </div>
                                    <div class="route-stat">
                                        <i class="fas fa-clock"></i>
                                        <span>${time} mins</span>
                                    </div>
                                </div>
                                <p><i class="fas fa-check-circle"></i> AI optimized to avoid congestion</p>
                            </div>
                        `)
                        .openOn(this.map);

                    // Start ambulance movement along the actual road route
                    this.startAmbulanceMovement(start, end, routeKey, data.routes[0].geometry.coordinates, hospitalName);
                } else {
                    console.error('Error calculating route:', data.message);
                    alert('Error calculating route. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching route:', error);
                alert('Error calculating route. Please try again.');
            })
            .finally(() => {
                // Remove loading indicator
                if (document.body.contains(loadingEl)) {
                    document.body.removeChild(loadingEl);
                }
            });
    }

    startAmbulanceMovement(start, end, routeKey, roadCoordinates, hospitalName) {
        const duration = 15000; // 15 seconds for the animation
        const steps = roadCoordinates.length;
        const interval = duration / steps;

        let currentStep = 0;

        const moveAmbulance = () => {
            if (currentStep >= steps) return;

            // Get current position from road coordinates
            const currentPos = roadCoordinates[currentStep];
            const currentLat = currentPos[1];
            const currentLng = currentPos[0];

            // Calculate heading angle using next point
            let heading = 0;
            if (currentStep < steps - 1) {
                const nextPos = roadCoordinates[currentStep + 1];
                heading = Math.atan2(nextPos[0] - currentPos[0], nextPos[1] - currentPos[1]) * 180 / Math.PI;
            }

            // Update ambulance marker
            const marker = this.ambulanceMarkers[Object.keys(this.ambulanceMarkers)[0]];
            if (marker) {
                marker.setLatLng([currentLat, currentLng]);
                marker.setRotationAngle(heading);
                
                // Update popup content with current position and destination
                const popup = marker.getPopup();
                if (popup.isOpen()) {
                    popup.setContent(`
                        <div class="marker-popup">
                            <h3>Ambulance Location</h3>
                            <p><strong>Status:</strong> En Route to ${hospitalName || 'Hospital'}</p>
                            <p><strong>Progress:</strong> ${Math.round((currentStep / steps) * 100)}%</p>
                        </div>
                    `);
                }
            }

            currentStep++;
        };

        // Start the animation
        const animationInterval = setInterval(moveAmbulance, interval);

        // Clear interval after animation completes
        setTimeout(() => {
            clearInterval(animationInterval);
        }, duration);
    }

    /**
     * Create loading indicator with progress
     * @returns {HTMLElement} Loading indicator element
     */
    createLoadingIndicator() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'route-loading';
        loadingEl.innerHTML = `
            <div class="loading-content">
                <i class="fas fa-spinner fa-spin"></i>
                <div class="loading-text">Calculating optimal route...</div>
                <div class="loading-progress">
                    <div class="progress-bar"></div>
                </div>
            </div>
        `;
        return loadingEl;
    }

    /**
     * Precalculate routes for common destinations
     */
    precalculateCommonRoutes() {
        const commonDestinations = [
            // Add common hospital coordinates here
            [22.3072, 73.1812], // Example hospital 1
            [22.3217, 73.1851], // Example hospital 2
            [22.2678, 73.1759], // Example hospital 3
        ];

        if (this.userLocation) {
            commonDestinations.forEach(destination => {
                const routeKey = `${this.userLocation.join(',')}-${destination.join(',')}`;
                if (!this.precalculatedRoutes.has(routeKey)) {
                    this.showRoute(this.userLocation, destination);
                    this.precalculatedRoutes.add(routeKey);
                }
            });
        }
    }

    /**
     * Get traffic status for a route
     * @param {Object} route - Route object from Routing Machine
     * @returns {string} Traffic status
     */
    getTrafficStatus(route) {
        // In a real application, this would use actual traffic data
        const trafficLevel = Math.random();
        if (trafficLevel < 0.3) return 'Light';
        if (trafficLevel < 0.7) return 'Moderate';
        return 'Heavy';
    }

    /**
     * Start real-time traffic updates for a route
     * @param {string} routeKey - Unique key for the route
     * @param {Object} route - Route object from Routing Machine
     */
    startTrafficUpdates(routeKey, route) {
        // Update route every 30 seconds
        const updateInterval = setInterval(() => {
            if (!this.routes[routeKey]) {
                clearInterval(updateInterval);
                return;
            }

            // Simulate traffic changes
            const trafficMultiplier = 1 + Math.random() * 0.5; // 1.0 to 1.5
            const newTime = Math.round(route.summary.totalTime * trafficMultiplier / 60);

            // Update route info
            const routeInfo = L.popup()
                .setLatLng([(route.bounds.getNorth() + route.bounds.getSouth()) / 2,
                           (route.bounds.getEast() + route.bounds.getWest()) / 2])
                .setContent(`
                    <div class="route-info">
                        <h3>Optimized Route</h3>
                        <p><strong>Distance:</strong> ${Math.round(route.summary.totalDistance / 1000 * 10) / 10} km</p>
                        <p><strong>Estimated Time:</strong> ${newTime} minutes</p>
                        <p><strong>Traffic:</strong> ${this.getTrafficStatus(route)}</p>
                        <p><i class="fas fa-check-circle"></i> AI optimized to avoid congestion</p>
                    </div>
                `)
                .openOn(this.map);
        }, 30000);
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
     * @param {number} timestamp - Unix timestamp
     * @returns {string} Formatted time
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
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

    getRoadType(route) {
        // Analyze route steps to determine road type
        const steps = route.legs[0].steps;
        let roadTypes = new Set();
        
        steps.forEach(step => {
            if (step.name.includes('Highway') || step.name.includes('Expressway')) {
                roadTypes.add('Highway');
            } else if (step.name.includes('Road') || step.name.includes('Street')) {
                roadTypes.add('Main Road');
            } else {
                roadTypes.add('Local Road');
            }
        });

        return Array.from(roadTypes).join(', ');
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