/**
 * Smart Ambulance Routing System
 * Dashboard Functionality
 */

/**
 * Initialize the dashboard
 */
function initDashboard() {
    // Set up time filter
    setupTimeFilter();
    
    // Initialize charts
    initCharts();
    
    // Set up map filters
    setupMapFilters();
    
    // Set up export functionality
    setupExport();
    
    // Set up refresh functionality
    setupRefresh();
    
    // Set up active emergencies functionality
    setupActiveEmergencies();
}

/**
 * Set up time filter
 */
function setupTimeFilter() {
    const timeButtons = document.querySelectorAll('.time-btn');
    
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            timeButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update dashboard data based on selected time period
            updateDashboardData(button.dataset.time);
        });
    });
}

/**
 * Update dashboard data based on time period
 * @param {string} timePeriod - Time period ('day', 'week', 'month', 'year')
 */
function updateDashboardData(timePeriod) {
    // In a real application, this would fetch data from Firebase
    // For this demo, we'll just update the charts with simulated data
    updateCharts(timePeriod);
    
    // Show notification
    showNotification(`Dashboard updated for ${timePeriod}`, 'info');
}

/**
 * Initialize charts
 */
function initCharts() {
    // Response time chart
    const responseTimeCtx = document.getElementById('response-time-chart');
    if (responseTimeCtx) {
        window.responseTimeChart = new Chart(responseTimeCtx, {
            type: 'line',
            data: {
                labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'],
                datasets: [{
                    label: 'Average Response Time (minutes)',
                    data: [7.2, 8.5, 9.8, 10.2, 9.5, 8.9, 8.2, 7.8, 7.5],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 6,
                        max: 12
                    }
                }
            }
        });
    }

    // Emergency types chart
    const emergencyTypesCtx = document.getElementById('emergency-types-chart');
    if (emergencyTypesCtx) {
        window.emergencyTypesChart = new Chart(emergencyTypesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Cardiac', 'Trauma/Accident', 'Respiratory', 'Stroke', 'Other'],
                datasets: [{
                    data: [25, 35, 15, 20, 5],
                    backgroundColor: [
                        '#e74c3c',
                        '#3498db',
                        '#2ecc71',
                        '#f39c12',
                        '#9b59b6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    // Route efficiency chart
    const routeEfficiencyCtx = document.getElementById('route-efficiency-chart');
    if (routeEfficiencyCtx) {
        window.routeEfficiencyChart = new Chart(routeEfficiencyCtx, {
            type: 'bar',
            data: {
                labels: ['Standard Route', 'AI Optimized Route'],
                datasets: [{
                    label: 'Average Time (minutes)',
                    data: [12.5, 8.3],
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

/**
 * Update charts based on time period
 * @param {string} timePeriod - Time period ('day', 'week', 'month', 'year')
 */
function updateCharts(timePeriod) {
    // Response time chart data for different time periods
    const responseTimeData = {
        day: {
            labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'],
            data: [7.2, 8.5, 9.8, 10.2, 9.5, 8.9, 8.2, 7.8, 7.5]
        },
        week: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [8.7, 8.5, 8.2, 8.4, 8.9, 7.8, 7.5]
        },
        month: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [8.9, 8.5, 8.2, 7.9]
        },
        year: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [10.2, 9.8, 9.5, 9.2, 8.9, 8.7, 8.5, 8.3, 8.2, 8.0, 7.8, 7.5]
        }
    };

    // Emergency types data for different time periods
    const emergencyTypesData = {
        day: {
            data: [25, 35, 15, 20, 5]
        },
        week: {
            data: [22, 38, 18, 17, 5]
        },
        month: {
            data: [24, 36, 16, 19, 5]
        },
        year: {
            data: [26, 34, 15, 18, 7]
        }
    };

    // Route efficiency data for different time periods
    const routeEfficiencyData = {
        day: {
            data: [12.5, 8.3]
        },
        week: {
            data: [13.2, 8.5]
        },
        month: {
            data: [12.8, 8.1]
        },
        year: {
            data: [13.5, 8.7]
        }
    };

    // Update response time chart
    if (window.responseTimeChart && responseTimeData[timePeriod]) {
        window.responseTimeChart.data.labels = responseTimeData[timePeriod].labels;
        window.responseTimeChart.data.datasets[0].data = responseTimeData[timePeriod].data;
        window.responseTimeChart.update();
    }

    // Update emergency types chart
    if (window.emergencyTypesChart && emergencyTypesData[timePeriod]) {
        window.emergencyTypesChart.data.datasets[0].data = emergencyTypesData[timePeriod].data;
        window.emergencyTypesChart.update();
    }

    // Update route efficiency chart
    if (window.routeEfficiencyChart && routeEfficiencyData[timePeriod]) {
        window.routeEfficiencyChart.data.datasets[0].data = routeEfficiencyData[timePeriod].data;
        window.routeEfficiencyChart.update();
    }
}

/**
 * Set up map filters and tools
 */
function setupMapFilters() {
    const filterButtons = document.querySelectorAll('.map-filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter map based on selected filter
            filterMap(button.dataset.filter);
        });
    });
    
    // Set up map tools
    setupMapTools();
    
    // Initialize map with Vadodara coordinates
    initializeMap();
    
    // Update map status counters
    updateMapStatus();
}

/**
 * Initialize map with Vadodara coordinates
 */
function initializeMap() {
    const mapElement = document.getElementById('dashboard-map');
    if (mapElement && typeof L !== 'undefined') {
        // Create map instance centered on Vadodara, Gujarat, India
        window.dashboardMap = L.map('dashboard-map').setView([22.3072, 73.1812], 13);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(window.dashboardMap);
        
        // Add ambulances to map
        addAmbulancesToMap();
        
        // Add hospitals to map
        addHospitalsToMap();
        
        // Add emergencies to map
        addEmergenciesToMap();
    }
}

/**
 * Set up map tools
 */
function setupMapTools() {
    // Center map button
    const centerMapBtn = document.getElementById('center-map');
    if (centerMapBtn) {
        centerMapBtn.addEventListener('click', () => {
            if (window.dashboardMap) {
                window.dashboardMap.setView([22.3072, 73.1812], 13);
                showNotification('Map centered on Vadodara', 'info');
            }
        });
    }
    
    // Toggle traffic button
    const toggleTrafficBtn = document.getElementById('toggle-traffic');
    if (toggleTrafficBtn) {
        toggleTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            toggleTrafficBtn.classList.toggle('active');
        });
    }
    
    // Optimize routes button
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
        });
    }
    
    // Refresh map button
    const refreshMapBtn = document.getElementById('refresh-map');
    if (refreshMapBtn) {
        refreshMapBtn.addEventListener('click', () => {
            refreshMap();
        });
    }
}

/**
 * Add ambulances to map
 */
function addAmbulancesToMap() {
    if (!window.dashboardMap) return;
    
    // Ambulance data for Vadodara (simulated)
    const ambulances = [
        { id: 'AMB-1042', status: 'available', location: [22.3119, 73.1723], driver: 'Rajesh Singh' },
        { id: 'AMB-2157', status: 'dispatched', location: [22.3217, 73.1851], driver: 'Sunil Patel' },
        { id: 'AMB-3089', status: 'available', location: [22.2678, 73.1759], driver: 'Amit Singh' },
        { id: 'AMB-4231', status: 'dispatched', location: [22.3217, 73.2001], driver: 'Vikram Desai' },
        { id: 'AMB-5678', status: 'maintenance', location: [22.3144, 73.1932], driver: 'N/A' }
    ];
    
    // Create ambulance markers
    ambulances.forEach(ambulance => {
        const icon = L.divIcon({
            className: `ambulance-marker ${ambulance.status}`,
            html: '<i class="fas fa-ambulance"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker(ambulance.location, { icon }).addTo(window.dashboardMap);
        
        // Create popup content
        const popupContent = `
            <div class="map-popup">
                <h3>${ambulance.id}</h3>
                <p><strong>Status:</strong> ${ambulance.status}</p>
                <p><strong>Driver:</strong> ${ambulance.driver}</p>
                <p><strong>Location:</strong> ${ambulance.location.join(', ')}</p>
                <button class="popup-btn view-details" data-id="${ambulance.id}">View Details</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Store marker for later use
        if (!window.ambulanceMarkers) window.ambulanceMarkers = {};
        window.ambulanceMarkers[ambulance.id] = marker;
    });
}

/**
 * Add hospitals to map
 */
function addHospitalsToMap() {
    if (!window.dashboardMap) return;
    
    // Hospital data for Vadodara (real hospitals)
    const hospitals = [
        { id: 'H001', name: 'SSG Hospital', location: [22.3217, 73.1851], capacity: 85, status: 'high' },
        { id: 'H002', name: 'Bhailal Amin General Hospital', location: [22.3003, 73.1759], capacity: 62, status: 'medium' },
        { id: 'H003', name: 'Baroda Medical College Hospital', location: [22.3144, 73.1932], capacity: 78, status: 'high' },
        { id: 'H004', name: 'Kailash Cancer Hospital', location: [22.3003, 73.1759], capacity: 45, status: 'low' },
        { id: 'H005', name: 'Sterling Hospital', location: [22.3119, 73.1723], capacity: 92, status: 'critical' }
    ];
    
    // Create hospital markers
    hospitals.forEach(hospital => {
        const icon = L.divIcon({
            className: `hospital-marker ${hospital.status}`,
            html: '<i class="fas fa-hospital"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker(hospital.location, { icon }).addTo(window.dashboardMap);
        
        // Create popup content
        const popupContent = `
            <div class="map-popup">
                <h3>${hospital.name}</h3>
                <p><strong>Capacity:</strong> ${hospital.capacity}%</p>
                <p><strong>Status:</strong> ${hospital.status}</p>
                <p><strong>Location:</strong> ${hospital.location.join(', ')}</p>
                <button class="popup-btn view-details" data-id="${hospital.id}">View Details</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Store marker for later use
        if (!window.hospitalMarkers) window.hospitalMarkers = {};
        window.hospitalMarkers[hospital.id] = marker;
    });
}

/**
 * Add emergencies to map
 */
function addEmergenciesToMap() {
    if (!window.dashboardMap) return;
    
    // Emergency data for Vadodara (simulated)
    const emergencies = [
        { id: 'E001', type: 'Cardiac Arrest', location: [22.3119, 73.1723], severity: 'high', patient: 'Ramesh Patel' },
        { id: 'E002', type: 'Traffic Accident', location: [22.3217, 73.1851], severity: 'medium', patient: 'Suresh Mehta' },
        { id: 'E003', type: 'Respiratory Distress', location: [22.2678, 73.1759], severity: 'low', patient: 'Anita Shah' },
        { id: 'E004', type: 'Stroke Symptoms', location: [22.3217, 73.2001], severity: 'medium', patient: 'Prakash Joshi' }
    ];
    
    // Create emergency markers
    emergencies.forEach(emergency => {
        const icon = L.divIcon({
            className: `emergency-marker ${emergency.severity}`,
            html: '<i class="fas fa-exclamation-circle"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker(emergency.location, { icon }).addTo(window.dashboardMap);
        
        // Create popup content
        const popupContent = `
            <div class="map-popup">
                <h3>${emergency.type}</h3>
                <p><strong>Patient:</strong> ${emergency.patient}</p>
                <p><strong>Severity:</strong> ${emergency.severity}</p>
                <p><strong>Location:</strong> ${emergency.location.join(', ')}</p>
                <button class="popup-btn view-details" data-id="${emergency.id}">View Details</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Store marker for later use
        if (!window.emergencyMarkers) window.emergencyMarkers = {};
        window.emergencyMarkers[emergency.id] = marker;
    });
}

/**
 * Filter map based on selected filter
 * @param {string} filter - Filter type ('all', 'ambulances', 'hospitals', 'emergencies', 'traffic')
 */
function filterMap(filter) {
    if (!window.dashboardMap) return;
    
    // Show/hide markers based on filter
    if (window.ambulanceMarkers) {
        Object.values(window.ambulanceMarkers).forEach(marker => {
            if (filter === 'all' || filter === 'ambulances') {
                window.dashboardMap.addLayer(marker);
            } else {
                window.dashboardMap.removeLayer(marker);
            }
        });
    }
    
    if (window.hospitalMarkers) {
        Object.values(window.hospitalMarkers).forEach(marker => {
            if (filter === 'all' || filter === 'hospitals') {
                window.dashboardMap.addLayer(marker);
            } else {
                window.dashboardMap.removeLayer(marker);
            }
        });
    }
    
    if (window.emergencyMarkers) {
        Object.values(window.emergencyMarkers).forEach(marker => {
            if (filter === 'all' || filter === 'emergencies') {
                window.dashboardMap.addLayer(marker);
            } else {
                window.dashboardMap.removeLayer(marker);
            }
        });
    }
    
    // Toggle traffic layer
    if (filter === 'traffic') {
        toggleTrafficLayer(true);
    } else if (window.trafficLayerActive) {
        toggleTrafficLayer(false);
    }
    
    // Show notification
    showNotification(`Map filtered to show ${filter}`, 'info');
}

/**
 * Toggle traffic layer on map
 * @param {boolean} [force] - Force traffic layer state (true = show, false = hide)
 */
function toggleTrafficLayer(force) {
    if (!window.dashboardMap) return;
    
    const showTraffic = force !== undefined ? force : !window.trafficLayerActive;
    
    // In a real application, you would use a traffic layer API
    // For this demo, we'll simulate traffic with colored lines
    
    if (showTraffic) {
        // Create traffic lines if they don't exist
        if (!window.trafficLayer) {
            const trafficData = [
                { from: [22.3119, 73.1723], to: [22.3217, 73.1851], level: 'medium' },
                { from: [22.3217, 73.1851], to: [22.3144, 73.1932], level: 'high' },
                { from: [22.3144, 73.1932], to: [22.3003, 73.1759], level: 'low' },
                { from: [22.3003, 73.1759], to: [22.3119, 73.1723], level: 'medium' }
            ];
            
            // Create traffic lines
            window.trafficLayer = L.layerGroup().addTo(window.dashboardMap);
            
            trafficData.forEach(traffic => {
                const color = traffic.level === 'high' ? '#e74c3c' : 
                              traffic.level === 'medium' ? '#f39c12' : '#2ecc71';
                
                const line = L.polyline([traffic.from, traffic.to], {
                    color: color,
                    weight: 5,
                    opacity: 0.7,
                    dashArray: '10, 10'
                }).addTo(window.trafficLayer);
                
                line.bindTooltip(`Traffic Level: ${traffic.level}`);
            });
        } else {
            window.dashboardMap.addLayer(window.trafficLayer);
        }
        
        window.trafficLayerActive = true;
        showNotification('Traffic layer enabled', 'info');
    } else if (window.trafficLayer) {
        window.dashboardMap.removeLayer(window.trafficLayer);
        window.trafficLayerActive = false;
        showNotification('Traffic layer disabled', 'info');
    }
}

/**
 * Optimize routes using AI algorithms
 */
function optimizeRoutes() {
    if (!window.dashboardMap) return;
    
    // Show loading indicator
    const mapElement = document.getElementById('dashboard-map');
    if (mapElement) {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'map-loading';
        loadingEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing routes...';
        mapElement.appendChild(loadingEl);
        
        // Simulate optimization delay
        setTimeout(() => {
            // Remove loading indicator
            mapElement.removeChild(loadingEl);
            
            // In a real application, you would call an AI optimization service
            // For this demo, we'll just show a notification
            showNotification('Routes optimized using AI algorithms', 'success');
            
            // Update map status
            updateMapStatus();
        }, 2000);
    }
}

/**
 * Refresh map data
 */
function refreshMap() {
    if (!window.dashboardMap) return;
    
    // Show loading indicator
    const mapElement = document.getElementById('dashboard-map');
    if (mapElement) {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'map-loading';
        loadingEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing map data...';
        mapElement.appendChild(loadingEl);
        
        // Simulate refresh delay
        setTimeout(() => {
            // Remove loading indicator
            mapElement.removeChild(loadingEl);
            
            // In a real application, you would fetch fresh data
            // For this demo, we'll just show a notification
            showNotification('Map data refreshed', 'success');
            
            // Update last updated time
            const lastUpdatedEl = document.getElementById('last-updated');
            if (lastUpdatedEl) {
                lastUpdatedEl.textContent = 'Updated: Just now';
            }
        }, 1500);
    }
}

/**
 * Update map status counters
 */
function updateMapStatus() {
    // Update ambulance count
    const ambulanceCountEl = document.getElementById('ambulance-count');
    if (ambulanceCountEl && window.ambulanceMarkers) {
        const count = Object.keys(window.ambulanceMarkers).length;
        ambulanceCountEl.textContent = `${count} Active`;
    }
    
    // Update hospital count
    const hospitalCountEl = document.getElementById('hospital-count');
    if (hospitalCountEl && window.hospitalMarkers) {
        const count = Object.keys(window.hospitalMarkers).length;
        hospitalCountEl.textContent = `${count} Hospitals`;
    }
    
    // Update emergency count
    const emergencyCountEl = document.getElementById('emergency-count');
    if (emergencyCountEl && window.emergencyMarkers) {
        const count = Object.keys(window.emergencyMarkers).length;
        emergencyCountEl.textContent = `${count} Emergencies`;
    }
}

/**
 * Set up export functionality
 */
function setupExport() {
    const exportBtn = document.querySelector('.export-btn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            // In a real application, this would export dashboard data
            // For this demo, we'll just show a notification
            showNotification('Dashboard data exported', 'success');
        });
    }
}

/**
 * Set up refresh functionality
 */
function setupRefresh() {
    const refreshBtn = document.querySelector('.refresh-btn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Show refresh animation
            refreshBtn.classList.add('refreshing');
            
            // In a real application, this would refresh dashboard data
            // For this demo, we'll just update after a short delay
            setTimeout(() => {
                // Get active time period
                const activeTimeBtn = document.querySelector('.time-btn.active');
                const timePeriod = activeTimeBtn ? activeTimeBtn.dataset.time : 'day';
                
                // Update dashboard data
                updateDashboardData(timePeriod);
                
                // Remove refresh animation
                refreshBtn.classList.remove('refreshing');
                
                // Show notification
                showNotification('Dashboard refreshed', 'success');
            }, 1000);
        });
    }
}

/**
 * Set up hospital management functionality
 */
function setupHospitalManagement() {
    const addHospitalBtn = document.getElementById('add-hospital-btn');
    const editButtons = document.querySelectorAll('.hospital-capacity-item .table-action.edit');
    const viewButtons = document.querySelectorAll('.hospital-capacity-item .table-action.view');
    
    if (addHospitalBtn) {
        addHospitalBtn.addEventListener('click', () => {
            // In a real application, this would open a modal to add a new hospital
            showNotification('Hospital management feature coming soon!', 'info');
        });
    }
    
    // Set up edit buttons
    document.querySelectorAll('.management-table .table-action.edit').forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const hospitalName = row.querySelector('td:first-child').textContent;
            
            // In a real application, this would open a modal to edit the hospital
            showNotification(`Editing ${hospitalName}`, 'info');
        });
    });
    
    // Set up view buttons
    document.querySelectorAll('.management-table .table-action.view').forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const hospitalName = row.querySelector('td:first-child').textContent;
            
            // In a real application, this would open a detailed view of the hospital
            showNotification(`Viewing details for ${hospitalName}`, 'info');
        });
    });
}

/**
 * Set up user management functionality
 */
function setupUserManagement() {
    const addUserBtn = document.getElementById('add-user-btn');
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            // In a real application, this would open a modal to add a new user
            showNotification('User management feature coming soon!', 'info');
        });
    }
    
    // Set up user table actions
    document.querySelectorAll('.user-info').forEach(userInfo => {
        userInfo.closest('tr').querySelectorAll('.table-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const userName = row.querySelector('.user-info div:nth-child(2)').textContent;
                const action = button.classList.contains('edit') ? 'Editing' : 'Viewing';
                
                // In a real application, this would open a modal to edit/view the user
                showNotification(`${action} user ${userName}`, 'info');
            });
        });
    });
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('info', 'success', 'warning', 'error')
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification to the DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Set up close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

/**
 * Set up active emergencies functionality
 */
function setupActiveEmergencies() {
    // Set up emergency filter
    const emergencyFilter = document.getElementById('emergency-filter');
    if (emergencyFilter) {
        emergencyFilter.addEventListener('change', () => {
            filterEmergencies(emergencyFilter.value);
        });
    }
    
    // Set up refresh button
    const refreshEmergenciesBtn = document.getElementById('refresh-emergencies');
    if (refreshEmergenciesBtn) {
        refreshEmergenciesBtn.addEventListener('click', () => {
            refreshEmergencies();
        });
    }
    
    // Set up action buttons for each emergency
    setupEmergencyActions();
}

/**
 * Filter emergencies by severity
 * @param {string} severity - Severity filter ('all', 'high', 'medium', 'low')
 */
function filterEmergencies(severity) {
    const emergencyItems = document.querySelectorAll('.emergency-item');
    
    emergencyItems.forEach(item => {
        if (severity === 'all' || item.classList.contains(severity)) {
            item.style.display = 'grid';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update emergency stats
    updateEmergencyStats();
    
    // Show notification
    showNotification(`Emergencies filtered by ${severity} severity`, 'info');
}

/**
 * Refresh emergencies data
 */
function refreshEmergencies() {
    // Show loading state on refresh button
    const refreshBtn = document.getElementById('refresh-emergencies');
    if (refreshBtn) {
        const originalContent = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        // Simulate data refresh
        setTimeout(() => {
            // In a real application, this would fetch fresh data from the server
            // For this demo, we'll just update the timestamps and randomize some data
            
            // Update emergency times
            document.querySelectorAll('.emergency-time').forEach(timeEl => {
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                timeEl.textContent = `Started: ${hours}:${minutes}`;
            });
            
            // Randomize some ETAs
            document.querySelectorAll('.emergency-eta').forEach(etaEl => {
                const minutes = Math.floor(Math.random() * 15) + 1;
                etaEl.textContent = `ETA: ${minutes} min`;
            });
            
            // Update emergency stats
            updateEmergencyStats();
            
            // Restore refresh button
            refreshBtn.innerHTML = originalContent;
            refreshBtn.disabled = false;
            
            // Show notification
            showNotification('Emergency data refreshed', 'success');
        }, 1500);
    }
}

/**
 * Update emergency statistics
 */
function updateEmergencyStats() {
    // Count total active emergencies
    const totalEmergencies = document.querySelectorAll('.emergency-item:not([style*="display: none"])').length;
    const totalEl = document.getElementById('total-emergencies');
    if (totalEl) {
        totalEl.textContent = totalEmergencies;
    }
    
    // Count high priority emergencies
    const highPriorityEmergencies = document.querySelectorAll('.emergency-item.high:not([style*="display: none"])').length;
    const highPriorityEl = document.getElementById('high-priority-emergencies');
    if (highPriorityEl) {
        highPriorityEl.textContent = highPriorityEmergencies;
    }
    
    // Calculate average response time (simulated)
    const avgResponseEl = document.getElementById('avg-response-time');
    if (avgResponseEl) {
        // In a real application, this would be calculated from actual data
        // For this demo, we'll use a random value between 7 and 12
        const avgResponse = (Math.floor(Math.random() * 5) + 7).toFixed(1);
        avgResponseEl.textContent = `${avgResponse} min`;
    }
}

/**
 * Set up action buttons for emergencies
 */
function setupEmergencyActions() {
    // View details buttons
    document.querySelectorAll('.emergency-action-btn.view').forEach(button => {
        button.addEventListener('click', (e) => {
            const emergencyItem = e.target.closest('.emergency-item');
            const emergencyType = emergencyItem.querySelector('h4').textContent;
            const patientName = emergencyItem.querySelector('.patient-info').textContent;
            
            // Open emergency details modal with data
            openEmergencyDetailsModal(emergencyItem);
        });
    });
    
    // Urgent response buttons
    document.querySelectorAll('.emergency-action-btn.urgent').forEach(button => {
        button.addEventListener('click', (e) => {
            const emergencyItem = e.target.closest('.emergency-item');
            const emergencyType = emergencyItem.querySelector('h4').textContent;
            const patientName = emergencyItem.querySelector('.patient-info').textContent;
            
            // In a real application, this would trigger an urgent response protocol
            showNotification(`Urgent response initiated for ${emergencyType} - ${patientName}`, 'warning');
            
            // Add a visual indicator to the emergency item
            emergencyItem.classList.add('urgent-response');
            setTimeout(() => {
                emergencyItem.classList.remove('urgent-response');
            }, 3000);
        });
    });
    
    // Set up emergency details modal
    setupEmergencyDetailsModal();
}

/**
 * Set up emergency details modal
 */
function setupEmergencyDetailsModal() {
    const modal = document.getElementById('emergency-details-modal');
    const closeBtn = document.getElementById('close-emergency-modal');
    const trackBtn = document.getElementById('emergency-track-btn');
    const urgentBtn = document.getElementById('emergency-urgent-btn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeEmergencyDetailsModal();
        });
    }
    
    if (trackBtn) {
        trackBtn.addEventListener('click', () => {
            // In a real application, this would focus on the emergency on the map
            const emergencyType = document.getElementById('emergency-type').textContent;
            showNotification(`Tracking ${emergencyType} on map`, 'info');
            closeEmergencyDetailsModal();
            
            // Scroll to map section
            const mapSection = document.querySelector('.map-section');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (urgentBtn) {
        urgentBtn.addEventListener('click', () => {
            // In a real application, this would trigger an urgent response protocol
            const emergencyType = document.getElementById('emergency-type').textContent;
            const patientName = document.getElementById('emergency-patient-name').textContent;
            showNotification(`Urgent response initiated for ${emergencyType} - ${patientName}`, 'warning');
            closeEmergencyDetailsModal();
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEmergencyDetailsModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeEmergencyDetailsModal();
        }
    });
}

/**
 * Open emergency details modal and populate with data
 * @param {HTMLElement} emergencyItem - The emergency item element
 */
function openEmergencyDetailsModal(emergencyItem) {
    const modal = document.getElementById('emergency-details-modal');
    if (!modal) return;
    
    // Get emergency data from the item
    const emergencyType = emergencyItem.querySelector('h4').textContent;
    const patientName = emergencyItem.querySelector('.patient-info').textContent;
    const severity = emergencyItem.classList.contains('high') ? 'High' : 
                    emergencyItem.classList.contains('medium') ? 'Medium' : 'Low';
    const location = emergencyItem.querySelector('.emergency-location').textContent;
    const time = emergencyItem.querySelector('.emergency-time').textContent.replace('Started: ', '');
    const status = emergencyItem.querySelector('.status-badge').textContent;
    const eta = emergencyItem.querySelector('.emergency-eta') ? 
               emergencyItem.querySelector('.emergency-eta').textContent.replace('ETA: ', '') : 'Unknown';
    
    // Generate random data for demo purposes
    // In a real application, this would come from the database
    const emergencyData = {
        patient: {
            name: patientName,
            age: Math.floor(Math.random() * 60) + 20,
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            contact: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            history: getRandomMedicalHistory()
        },
        emergency: {
            type: emergencyType,
            severity: severity,
            reportedTime: time,
            status: status,
            description: getRandomEmergencyDescription(emergencyType)
        },
        location: {
            address: location,
            coordinates: `${(22.3 + Math.random() * 0.1).toFixed(4)}, ${(73.1 + Math.random() * 0.1).toFixed(4)}`,
            landmark: getRandomLandmark()
        },
        response: {
            ambulance: `AMB-${Math.floor(Math.random() * 9000) + 1000}`,
            driver: getRandomDriverName(),
            eta: eta,
            hospital: getRandomHospital(),
            routeStatus: getRandomRouteStatus()
        }
    };
    
    // Populate modal with data
    document.getElementById('emergency-modal-title').textContent = emergencyType;
    document.getElementById('emergency-patient-name').textContent = emergencyData.patient.name;
    document.getElementById('emergency-patient-age').textContent = emergencyData.patient.age;
    document.getElementById('emergency-patient-gender').textContent = emergencyData.patient.gender;
    document.getElementById('emergency-patient-contact').textContent = emergencyData.patient.contact;
    document.getElementById('emergency-patient-history').textContent = emergencyData.patient.history;
    
    document.getElementById('emergency-type').textContent = emergencyData.emergency.type;
    document.getElementById('emergency-severity').textContent = emergencyData.emergency.severity;
    document.getElementById('emergency-reported-time').textContent = emergencyData.emergency.reportedTime;
    document.getElementById('emergency-status-detail').textContent = emergencyData.emergency.status;
    document.getElementById('emergency-description').textContent = emergencyData.emergency.description;
    
    document.getElementById('emergency-address').textContent = emergencyData.location.address;
    document.getElementById('emergency-coordinates').textContent = emergencyData.location.coordinates;
    document.getElementById('emergency-landmark').textContent = emergencyData.location.landmark;
    
    document.getElementById('emergency-ambulance').textContent = emergencyData.response.ambulance;
    document.getElementById('emergency-driver').textContent = emergencyData.response.driver;
    document.getElementById('emergency-eta-detail').textContent = emergencyData.response.eta;
    document.getElementById('emergency-hospital').textContent = emergencyData.response.hospital;
    document.getElementById('emergency-route-status').textContent = emergencyData.response.routeStatus;
    
    // Initialize map if Leaflet is available
    initializeEmergencyLocationMap(emergencyData.location.coordinates.split(', ').map(Number));
    
    // Show modal
    modal.classList.add('show');
}

/**
 * Close emergency details modal
 */
function closeEmergencyDetailsModal() {
    const modal = document.getElementById('emergency-details-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Initialize emergency location map
 * @param {Array} coordinates - [latitude, longitude]
 */
function initializeEmergencyLocationMap(coordinates) {
    const mapElement = document.getElementById('emergency-location-map');
    
    // Clear previous map
    if (mapElement) {
        mapElement.innerHTML = '';
    }
    
    // Initialize map if Leaflet is available
    if (mapElement && typeof L !== 'undefined') {
        const map = L.map('emergency-location-map').setView(coordinates, 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add marker
        const icon = L.divIcon({
            className: 'emergency-marker high',
            html: '<i class="fas fa-exclamation-circle"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        L.marker(coordinates, { icon }).addTo(map);
    }
}

/**
 * Get random medical history for demo purposes
 * @returns {string} Random medical history
 */
function getRandomMedicalHistory() {
    const histories = [
        'No significant medical history',
        'Hypertension, Diabetes Type 2',
        'Asthma, Allergies to penicillin',
        'Previous heart surgery in 2018',
        'Epilepsy, on regular medication',
        'Chronic kidney disease, Stage 2',
        'No known medical conditions'
    ];
    
    return histories[Math.floor(Math.random() * histories.length)];
}

/**
 * Get random emergency description for demo purposes
 * @param {string} type - Emergency type
 * @returns {string} Random emergency description
 */
function getRandomEmergencyDescription(type) {
    const descriptions = {
        'Cardiac Arrest': [
            'Patient collapsed suddenly while walking. No pulse detected by bystanders who initiated CPR.',
            'Patient experienced severe chest pain followed by loss of consciousness. Family member started CPR.',
            'Patient found unresponsive at home by family member. History of heart disease.'
        ],
        'Traffic Accident': [
            'Two-vehicle collision at intersection. Patient was driver of smaller vehicle. Airbag deployed.',
            'Motorcycle accident, patient thrown approximately 5 meters. Wearing helmet.',
            'Pedestrian struck by car while crossing road. Conscious but in pain.'
        ],
        'Respiratory Distress': [
            'Sudden onset of difficulty breathing. Patient has history of asthma.',
            'Progressive shortness of breath over 2 hours. Patient appears anxious and is using accessory muscles to breathe.',
            'Patient experiencing wheezing and inability to speak in full sentences. No known respiratory conditions.'
        ],
        'Stroke Symptoms': [
            'Sudden facial drooping on left side, weakness in left arm, and slurred speech.',
            'Patient found confused with right-sided weakness and difficulty speaking. Symptoms began approximately 30 minutes ago.',
            'Sudden severe headache described as "worst ever" followed by confusion and difficulty walking.'
        ]
    };
    
    // Default description if type not found
    const defaultDescriptions = [
        'Patient requires immediate medical attention. Reported by bystander.',
        'Emergency call received from family member. Patient is conscious but in distress.',
        'Symptoms developed suddenly. No additional information available.'
    ];
    
    const typeDescriptions = descriptions[type] || defaultDescriptions;
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
}

/**
 * Get random landmark for demo purposes
 * @returns {string} Random landmark
 */
function getRandomLandmark() {
    const landmarks = [
        'Near Sayaji Hotel',
        'Opposite Vadodara Central Mall',
        'Near Vadodara Railway Station',
        'Next to Kamati Baug Zoo',
        'Near MS University',
        'Beside Laxmi Vilas Palace',
        'Near SSG Hospital',
        'Opposite Kirti Stambh',
        'Near Vadodara Airport',
        'Beside Akota Stadium'
    ];
    
    return landmarks[Math.floor(Math.random() * landmarks.length)];
}

/**
 * Get random driver name for demo purposes
 * @returns {string} Random driver name
 */
function getRandomDriverName() {
    const names = [
        'Rajesh Kumar',
        'Sunil Patel',
        'Amit Singh',
        'Vikram Desai',
        'Prakash Joshi',
        'Dinesh Sharma',
        'Mahesh Verma',
        'Sanjay Mehta',
        'Ramesh Patel',
        'Ajay Chauhan'
    ];
    
    return names[Math.floor(Math.random() * names.length)];
}

/**
 * Get random hospital for demo purposes
 * @returns {string} Random hospital
 */
function getRandomHospital() {
    const hospitals = [
        'SSG Hospital',
        'Bhailal Amin General Hospital',
        'Baroda Medical College Hospital',
        'Kailash Cancer Hospital',
        'Sterling Hospital',
        'Bankers Heart Institute',
        'Dhiraj Hospital',
        'BAPS Pramukh Swami Hospital',
        'Jaslok Hospital',
        'Sunshine Global Hospital'
    ];
    
    return hospitals[Math.floor(Math.random() * hospitals.length)];
}

/**
 * Get random route status for demo purposes
 * @returns {string} Random route status
 */
function getRandomRouteStatus() {
    const statuses = [
        'Optimal route selected (8.2 km)',
        'Heavy traffic, alternative route selected',
        'Route optimized, ETA updated',
        'Direct route, light traffic',
        'Moderate traffic, on schedule',
        'Route recalculated due to roadblock',
        'Express lane activated'
    ];
    
    return statuses[Math.floor(Math.random() * statuses.length)];
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    setupHospitalManagement();
    setupUserManagement();
}); 