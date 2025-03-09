/**
 * Smart Ambulance Routing System
 * Admin Panel Functionality
 */

/**
 * Initialize the admin panel
 */
function initAdminPanel() {
    // Set up sidebar navigation
    setupSidebarNav();
    
    // Set up admin dashboard
    setupAdminDashboard();
    
    // Set up ambulance management
    setupAmbulanceManagement();
    
    // Set up modals
    setupModals();
    
    // Set up mobile sidebar toggle
    setupMobileSidebar();
}

/**
 * Set up sidebar navigation
 */
function setupSidebarNav() {
    const navItems = document.querySelectorAll('.admin-nav li');
    const tabs = document.querySelectorAll('.admin-tab');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get tab to show
            const tabId = item.dataset.tab;
            const tabToShow = document.getElementById(`${tabId}-tab`);
            
            // Hide all tabs
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all nav items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Show selected tab
            if (tabToShow) {
                tabToShow.classList.add('active');
            }
            
            // Add active class to clicked nav item
            item.classList.add('active');
        });
    });
}

/**
 * Set up admin dashboard
 */
function setupAdminDashboard() {
    // Initialize charts
    initCharts();
    
    // Set up date range
    setupDateRange();
    
    // Load active emergencies
    loadActiveEmergencies();
}

/**
 * Initialize charts
 */
function initCharts() {
    // Hospital capacity chart
    const hospitalCapacityCtx = document.getElementById('hospital-capacity-chart');
    if (hospitalCapacityCtx) {
        const hospitalCapacityChart = new Chart(hospitalCapacityCtx, {
            type: 'bar',
            data: {
                labels: ['General Hospital', 'Memorial Medical', 'Community Hospital', 'University Medical'],
                datasets: [{
                    label: 'Occupied Beds',
                    data: [34, 31, 23, 27],
                    backgroundColor: '#3498db'
                }, {
                    label: 'Available Beds',
                    data: [6, 19, 7, 33],
                    backgroundColor: '#2ecc71'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Response time chart
    const responseTimeCtx = document.getElementById('response-time-chart');
    if (responseTimeCtx) {
        const responseTimeChart = new Chart(responseTimeCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Average Response Time (minutes)',
                    data: [12, 11.5, 10.8, 9.6, 9.2, 8.7, 8.2],
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
                        min: 7,
                        max: 13
                    }
                }
            }
        });
    }
}

/**
 * Set up date range
 */
function setupDateRange() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const applyBtn = document.querySelector('.apply-btn');
    
    if (startDateInput && endDateInput && applyBtn) {
        // Set default dates (last 7 days)
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        
        startDateInput.valueAsDate = lastWeek;
        endDateInput.valueAsDate = today;
        
        // Apply button click
        applyBtn.addEventListener('click', () => {
            // In a real application, this would update the dashboard data
            // For this demo, we'll just show a notification
            showNotification('Date range updated', 'success');
        });
    }
}

/**
 * Load active emergencies
 */
function loadActiveEmergencies() {
    // In a real application, this would load from Firebase
    // For this demo, we'll use the static HTML
}

/**
 * Set up ambulance management
 */
function setupAmbulanceManagement() {
    // Add ambulance button
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            openModal('add-ambulance-modal');
        });
    }
    
    // Ambulance form submission
    const addAmbulanceForm = document.getElementById('add-ambulance-form');
    if (addAmbulanceForm) {
        addAmbulanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewAmbulance();
        });
    }
    
    // Action buttons
    setupActionButtons();
}

/**
 * Set up action buttons
 */
function setupActionButtons() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.action-btn.edit');
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const id = row.cells[0].textContent;
            editAmbulance(id);
        });
    });
    
    // View buttons
    const viewButtons = document.querySelectorAll('.action-btn.view');
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const id = row.cells[0].textContent;
            viewAmbulance(id);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const id = row.cells[0].textContent;
            deleteAmbulance(id);
        });
    });
}

/**
 * Add new ambulance
 */
function addNewAmbulance() {
    // Get form data
    const id = document.getElementById('ambulance-id').value;
    const type = document.getElementById('ambulance-type').value;
    const driver = document.getElementById('ambulance-driver').value;
    const location = document.getElementById('ambulance-location').value;
    
    // Validate form
    if (!id || !type || !location) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // In a real application, this would save to Firebase
    // For this demo, we'll just show a notification and close the modal
    showNotification(`Ambulance ${id} added successfully`, 'success');
    closeModal('add-ambulance-modal');
    
    // Reset form
    document.getElementById('add-ambulance-form').reset();
}

/**
 * Edit ambulance
 * @param {string} id - Ambulance ID
 */
function editAmbulance(id) {
    // In a real application, this would open an edit form
    // For this demo, we'll just show a notification
    showNotification(`Editing ambulance ${id}`, 'info');
}

/**
 * View ambulance
 * @param {string} id - Ambulance ID
 */
function viewAmbulance(id) {
    // In a real application, this would show detailed information
    // For this demo, we'll just show a notification
    showNotification(`Viewing ambulance ${id}`, 'info');
}

/**
 * Delete ambulance
 * @param {string} id - Ambulance ID
 */
function deleteAmbulance(id) {
    // Confirm deletion
    if (confirm(`Are you sure you want to delete ambulance ${id}?`)) {
        // In a real application, this would delete from Firebase
        // For this demo, we'll just show a notification
        showNotification(`Ambulance ${id} deleted`, 'success');
    }
}

/**
 * Set up modals
 */
function setupModals() {
    // Close modal buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Cancel buttons
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
}

/**
 * Open a modal
 * @param {string} modalId - Modal ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Close a modal
 * @param {string} modalId - Modal ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Set up mobile sidebar
 */
function setupMobileSidebar() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add close button event listener
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

/**
 * Set up hospital management
 */
function setupHospitalManagement() {
    // Add hospital button
    const addHospitalBtn = document.getElementById('add-hospital-btn');
    if (addHospitalBtn) {
        addHospitalBtn.addEventListener('click', () => {
            showNotification('Add Hospital feature coming soon!', 'info');
        });
    }
    
    // Set up hospital action buttons
    const hospitalTab = document.getElementById('hospitals-tab');
    if (hospitalTab) {
        // Edit buttons
        const editButtons = hospitalTab.querySelectorAll('.action-btn.edit');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const hospitalName = row.cells[0].textContent.trim();
                showNotification(`Editing ${hospitalName}`, 'info');
            });
        });
        
        // View buttons
        const viewButtons = hospitalTab.querySelectorAll('.action-btn.view');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const hospitalName = row.cells[0].textContent.trim();
                showNotification(`Viewing details for ${hospitalName}`, 'info');
            });
        });
        
        // Delete buttons
        const deleteButtons = hospitalTab.querySelectorAll('.action-btn.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const hospitalName = row.cells[0].textContent.trim();
                if (confirm(`Are you sure you want to delete ${hospitalName}?`)) {
                    showNotification(`${hospitalName} has been deleted`, 'success');
                    // In a real application, this would delete from Firebase
                    // For this demo, we'll just remove the row
                    row.remove();
                }
            });
        });
    }
}

/**
 * Set up user management
 */
function setupUserManagement() {
    // Add user button
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            showNotification('Add User feature coming soon!', 'info');
        });
    }
    
    // Set up user action buttons
    const userTab = document.getElementById('users-tab');
    if (userTab) {
        // Edit buttons
        const editButtons = userTab.querySelectorAll('.action-btn.edit');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const userInfo = row.querySelector('.user-info');
                const userName = userInfo ? userInfo.querySelector('div:nth-child(2)').textContent.trim() : 'User';
                showNotification(`Editing ${userName}`, 'info');
            });
        });
        
        // View buttons
        const viewButtons = userTab.querySelectorAll('.action-btn.view');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const userInfo = row.querySelector('.user-info');
                const userName = userInfo ? userInfo.querySelector('div:nth-child(2)').textContent.trim() : 'User';
                showNotification(`Viewing details for ${userName}`, 'info');
            });
        });
        
        // Delete buttons
        const deleteButtons = userTab.querySelectorAll('.action-btn.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const userInfo = row.querySelector('.user-info');
                const userName = userInfo ? userInfo.querySelector('div:nth-child(2)').textContent.trim() : 'User';
                if (confirm(`Are you sure you want to delete ${userName}?`)) {
                    showNotification(`${userName} has been deleted`, 'success');
                    // In a real application, this would delete from Firebase
                    // For this demo, we'll just remove the row
                    row.remove();
                }
            });
        });
    }
}

/**
 * Set up settings management
 */
function setupSettingsManagement() {
    const settingsTab = document.getElementById('settings-tab');
    if (settingsTab) {
        // For this demo, we'll just add a simple form submission handler
        const settingsForm = settingsTab.querySelector('form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showNotification('Settings saved successfully', 'success');
            });
        }
    }
}

/**
 * Set up emergency management
 */
function setupEmergencyManagement() {
    // Add emergency button
    const addEmergencyBtn = document.getElementById('add-emergency-btn');
    if (addEmergencyBtn) {
        addEmergencyBtn.addEventListener('click', () => {
            openModal('add-emergency-modal');
        });
    }
    
    // Emergency form submission
    const addEmergencyForm = document.getElementById('add-emergency-form');
    if (addEmergencyForm) {
        addEmergencyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewEmergency();
        });
    }
    
    // Set up emergency action buttons
    const emergencyTab = document.getElementById('emergencies-tab');
    if (emergencyTab) {
        // Edit buttons
        const editButtons = emergencyTab.querySelectorAll('.action-btn.edit');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const emergencyType = row.querySelector('.emergency-type span').textContent.trim();
                const patientName = row.cells[1].textContent.trim();
                showNotification(`Editing emergency for ${patientName} (${emergencyType})`, 'info');
            });
        });
        
        // View buttons
        const viewButtons = emergencyTab.querySelectorAll('.action-btn.view');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const emergencyType = row.querySelector('.emergency-type span').textContent.trim();
                const patientName = row.cells[1].textContent.trim();
                showNotification(`Viewing details for ${patientName} (${emergencyType})`, 'info');
            });
        });
        
        // Delete buttons
        const deleteButtons = emergencyTab.querySelectorAll('.action-btn.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const emergencyType = row.querySelector('.emergency-type span').textContent.trim();
                const patientName = row.cells[1].textContent.trim();
                if (confirm(`Are you sure you want to delete the emergency for ${patientName} (${emergencyType})?`)) {
                    showNotification(`Emergency for ${patientName} has been deleted`, 'success');
                    // In a real application, this would delete from Firebase
                    // For this demo, we'll just remove the row
                    row.remove();
                }
            });
        });
    }
}

/**
 * Add new emergency
 */
function addNewEmergency() {
    // Get form data
    const type = document.getElementById('emergency-type').value;
    const severity = document.getElementById('emergency-severity').value;
    const patientName = document.getElementById('patient-name').value;
    const location = document.getElementById('emergency-location').value;
    const ambulance = document.getElementById('assign-ambulance').value;
    const hospital = document.getElementById('assign-hospital').value;
    
    // Validate form
    if (!type || !severity || !patientName || !location) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // In a real application, this would save to Firebase
    // For this demo, we'll just show a notification
    showNotification(`Emergency added for ${patientName}`, 'success');
    
    // Close modal
    closeModal('add-emergency-modal');
    
    // Reset form
    document.getElementById('add-emergency-form').reset();
}

/**
 * Set up route management
 */
function setupRouteManagement() {
    // Add route button
    const addRouteBtn = document.getElementById('add-route-btn');
    if (addRouteBtn) {
        addRouteBtn.addEventListener('click', () => {
            openModal('add-route-modal');
        });
    }
    
    // Route form submission
    const addRouteForm = document.getElementById('add-route-form');
    if (addRouteForm) {
        addRouteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewRoute();
        });
    }
    
    // Set up route action buttons
    const routeTab = document.getElementById('routes-tab');
    if (routeTab) {
        // Edit buttons
        const editButtons = routeTab.querySelectorAll('.action-btn.edit');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const routeId = row.querySelector('.route-id span').textContent.trim();
                const from = row.cells[1].textContent.trim();
                const to = row.cells[2].textContent.trim();
                showNotification(`Editing route ${routeId} (${from} to ${to})`, 'info');
            });
        });
        
        // View buttons
        const viewButtons = routeTab.querySelectorAll('.action-btn.view');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const routeId = row.querySelector('.route-id span').textContent.trim();
                const from = row.cells[1].textContent.trim();
                const to = row.cells[2].textContent.trim();
                
                // Show route on map
                showRouteOnMap(routeId, from, to);
                
                showNotification(`Viewing route ${routeId} on map`, 'info');
            });
        });
        
        // Delete buttons
        const deleteButtons = routeTab.querySelectorAll('.action-btn.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const routeId = row.querySelector('.route-id span').textContent.trim();
                const from = row.cells[1].textContent.trim();
                const to = row.cells[2].textContent.trim();
                
                if (confirm(`Are you sure you want to delete route ${routeId} (${from} to ${to})?`)) {
                    showNotification(`Route ${routeId} has been deleted`, 'success');
                    // In a real application, this would delete from Firebase
                    // For this demo, we'll just remove the row
                    row.remove();
                }
            });
        });
        
        // Map control buttons
        const showAllRoutesBtn = document.getElementById('show-all-routes');
        if (showAllRoutesBtn) {
            showAllRoutesBtn.addEventListener('click', () => {
                showAllRoutes();
                showNotification('Showing all routes on map', 'info');
            });
        }
        
        const showTrafficBtn = document.getElementById('show-traffic');
        if (showTrafficBtn) {
            showTrafficBtn.addEventListener('click', () => {
                toggleTrafficLayer();
                showNotification('Traffic layer toggled', 'info');
            });
        }
        
        const optimizeRoutesBtn = document.getElementById('optimize-routes');
        if (optimizeRoutesBtn) {
            optimizeRoutesBtn.addEventListener('click', () => {
                optimizeRoutes();
                showNotification('Routes optimized using AI algorithms', 'success');
            });
        }
        
        // Initialize route map
        initRouteMap();
    }
}

/**
 * Initialize route map
 */
function initRouteMap() {
    const mapElement = document.getElementById('route-map');
    if (mapElement && typeof L !== 'undefined') {
        // Create map instance
        const routeMap = L.map('route-map').setView([22.3072, 73.1812], 13);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(routeMap);
        
        // Store map instance for later use
        window.routeMap = routeMap;
    }
}

/**
 * Show route on map
 * @param {string} routeId - Route ID
 * @param {string} from - Starting point
 * @param {string} to - Destination
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
    // In a real application, you would fetch the route coordinates from an API
    // For this demo, we'll create a simple route
    
    // Coordinates for Vadodara locations (approximate)
    const locations = {
        'Alkapuri, Vadodara': [22.3119, 73.1723],
        'Fatehgunj, Vadodara': [22.3217, 73.1851],
        'Manjalpur, Vadodara': [22.2678, 73.1759],
        'Karelibaug, Vadodara': [22.3217, 73.2001],
        'Sayajigunj, Vadodara': [22.3144, 73.1932],
        'SSG Hospital, Vadodara': [22.3217, 73.1851],
        'Bhailal Amin Hospital, Vadodara': [22.3003, 73.1759],
        'Baroda Medical College, Vadodara': [22.3144, 73.1932],
        'Sterling Hospital, Vadodara': [22.3119, 73.1723],
        'Kailash Cancer Hospital, Vadodara': [22.3003, 73.1759]
    };
    
    // Get coordinates for from and to locations
    const fromCoords = locations[from] || [22.3072, 73.1812];
    const toCoords = locations[to] || [22.3072, 73.1812];
    
    // Create a route line
    const routeCoords = [
        fromCoords,
        [fromCoords[0] + (toCoords[0] - fromCoords[0]) * 0.33, fromCoords[1] + (toCoords[1] - fromCoords[1]) * 0.33 + 0.005],
        [fromCoords[0] + (toCoords[0] - fromCoords[0]) * 0.66, fromCoords[1] + (toCoords[1] - fromCoords[1]) * 0.66 - 0.005],
        toCoords
    ];
    
    // Create route polyline
    window.currentRoute = L.polyline(routeCoords, {
        color: '#3498db',
        weight: 5,
        opacity: 0.7
    }).addTo(window.routeMap);
    
    // Add markers for from and to locations
    L.marker(fromCoords).addTo(window.routeMap)
        .bindPopup(`<b>From:</b> ${from}`);
    
    L.marker(toCoords).addTo(window.routeMap)
        .bindPopup(`<b>To:</b> ${to}`);
    
    // Fit map to show the entire route
    window.routeMap.fitBounds(window.currentRoute.getBounds(), {
        padding: [50, 50]
    });
}

/**
 * Show all routes on map
 */
function showAllRoutes() {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
    // In a real application, you would fetch all routes from Firebase
    // For this demo, we'll create some sample routes
    
    // Coordinates for Vadodara locations (approximate)
    const locations = {
        'Alkapuri, Vadodara': [22.3119, 73.1723],
        'Fatehgunj, Vadodara': [22.3217, 73.1851],
        'Manjalpur, Vadodara': [22.2678, 73.1759],
        'Karelibaug, Vadodara': [22.3217, 73.2001],
        'Sayajigunj, Vadodara': [22.3144, 73.1932],
        'SSG Hospital, Vadodara': [22.3217, 73.1851],
        'Bhailal Amin Hospital, Vadodara': [22.3003, 73.1759],
        'Baroda Medical College, Vadodara': [22.3144, 73.1932],
        'Sterling Hospital, Vadodara': [22.3119, 73.1723],
        'Kailash Cancer Hospital, Vadodara': [22.3003, 73.1759]
    };
    
    // Sample routes
    const routes = [
        { from: 'Alkapuri, Vadodara', to: 'SSG Hospital, Vadodara', color: '#3498db' },
        { from: 'Fatehgunj, Vadodara', to: 'Bhailal Amin Hospital, Vadodara', color: '#2ecc71' },
        { from: 'Manjalpur, Vadodara', to: 'Baroda Medical College, Vadodara', color: '#e74c3c' },
        { from: 'Karelibaug, Vadodara', to: 'Sterling Hospital, Vadodara', color: '#f39c12' },
        { from: 'Sayajigunj, Vadodara', to: 'Kailash Cancer Hospital, Vadodara', color: '#9b59b6' }
    ];
    
    // Create route lines for each route
    routes.forEach(route => {
        const fromCoords = locations[route.from] || [22.3072, 73.1812];
        const toCoords = locations[route.to] || [22.3072, 73.1812];
        
        // Create a route line with a bend
        const routeCoords = [
            fromCoords,
            [fromCoords[0] + (toCoords[0] - fromCoords[0]) * 0.33, fromCoords[1] + (toCoords[1] - fromCoords[1]) * 0.33 + 0.005],
            [fromCoords[0] + (toCoords[0] - fromCoords[0]) * 0.66, fromCoords[1] + (toCoords[1] - fromCoords[1]) * 0.66 - 0.005],
            toCoords
        ];
        
        // Create route polyline
        L.polyline(routeCoords, {
            color: route.color,
            weight: 5,
            opacity: 0.7
        }).addTo(window.routeMap)
            .bindPopup(`<b>Route:</b> ${route.from} to ${route.to}`);
        
        // Add markers for from and to locations
        L.marker(fromCoords).addTo(window.routeMap)
            .bindPopup(`<b>From:</b> ${route.from}`);
        
        L.marker(toCoords).addTo(window.routeMap)
            .bindPopup(`<b>To:</b> ${route.to}`);
    });
    
    // Fit map to show all of Vadodara
    window.routeMap.setView([22.3072, 73.1812], 12);
}

/**
 * Toggle traffic layer on map
 */
function toggleTrafficLayer() {
    if (!window.routeMap) return;
    
    // In a real application, you would use a traffic layer API
    // For this demo, we'll just show a notification
    
    // Check if traffic layer is already added
    if (window.trafficLayerActive) {
        // Remove traffic layer (in a real app)
        window.trafficLayerActive = false;
    } else {
        // Add traffic layer (in a real app)
        window.trafficLayerActive = true;
    }
}

/**
 * Optimize routes using AI algorithms
 */
function optimizeRoutes() {
    if (!window.routeMap) return;
    
    // In a real application, you would call an AI optimization service
    // For this demo, we'll just show a notification and update the routes
    
    // Show loading indicator
    const routeMap = document.getElementById('route-map');
    if (routeMap) {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'map-loading';
        loadingEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing routes...';
        routeMap.appendChild(loadingEl);
        
        // Simulate optimization delay
        setTimeout(() => {
            // Remove loading indicator
            routeMap.removeChild(loadingEl);
            
            // Show all routes (optimized)
            showAllRoutes();
        }, 2000);
    }
}

/**
 * Add new route
 */
function addNewRoute() {
    // Get form data
    const name = document.getElementById('route-name').value;
    const from = document.getElementById('route-from').value;
    const to = document.getElementById('route-to').value;
    const type = document.getElementById('route-type').value;
    const traffic = document.getElementById('route-traffic').value;
    const distance = document.getElementById('route-distance').value;
    const time = document.getElementById('route-time').value;
    
    // Validate form
    if (!name || !from || !to || !type || !traffic || !distance || !time) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // In a real application, this would save to Firebase
    // For this demo, we'll just show a notification
    showNotification(`Route added: ${from} to ${to}`, 'success');
    
    // Close modal
    closeModal('add-route-modal');
    
    // Reset form
    document.getElementById('add-route-form').reset();
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAdminPanel();
    setupHospitalManagement();
    setupUserManagement();
    setupSettingsManagement();
    setupEmergencyManagement();
    setupRouteManagement();
}); 