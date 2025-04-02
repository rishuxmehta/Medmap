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
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabs = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get tab to show
            const tabId = item.dataset.tab;
            
            // Find corresponding tab button and simulate click
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}-tab"]`);
            if (tabBtn) {
                // Remove active class from all nav items and tab buttons
                navItems.forEach(navItem => navItem.classList.remove('active'));
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabs.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked nav item and corresponding tab button
                item.classList.add('active');
                tabBtn.classList.add('active');
                
                // Show the tab content
                const tabToShow = document.getElementById(`${tabId}-tab`);
                if (tabToShow) {
                    tabToShow.classList.add('active');
                }
            }
        });
    });
    
    // Set up logout button in sidebar
    const sidebarLogoutBtn = document.getElementById('admin-logout-sidebar');
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }
}

/**
 * Initialize dashboard stats
 */
function initDashboardStats() {
    // Get counts from localStorage
    const hospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
    const ambulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
    const medicalStores = JSON.parse(localStorage.getItem('medicalStores') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Update count displays
    document.getElementById('hospital-count').textContent = hospitals.length;
    document.getElementById('ambulance-count').textContent = ambulances.length;
    document.getElementById('medical-store-count').textContent = medicalStores.length;
    document.getElementById('user-count').textContent = users.length;
    
    // Initialize charts if they exist
    if(document.getElementById('hospitalCapacityChart')) {
        initHospitalCapacityChart(hospitals);
    }
    
    if(document.getElementById('responseTimeChart')) {
        initResponseTimeChart(ambulances);
    }
    
    // Update last updated timestamp
    const lastUpdated = document.getElementById('last-updated');
    if(lastUpdated) {
        const now = new Date();
        lastUpdated.textContent = `Last updated: ${now.toLocaleString()}`;
    }
}

/**
 * Initialize hospital capacity chart
 */
function initHospitalCapacityChart(hospitals) {
    const ctx = document.getElementById('hospitalCapacityChart').getContext('2d');
    
    // Extract data for chart
    const labels = hospitals.slice(0, 5).map(h => h.name || 'Unknown Hospital');
    const capacityData = hospitals.slice(0, 5).map(h => h.capacity || Math.floor(Math.random() * 50) + 50);
    const occupancyData = capacityData.map(cap => Math.floor(cap * (Math.random() * 0.7 + 0.1))); // 10-80% occupancy
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Capacity',
                    data: capacityData,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Current Occupancy',
                    data: occupancyData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Beds'
                    }
                }
            }
        }
    });
}

/**
 * Initialize response time chart
 */
function initResponseTimeChart(ambulances) {
    const ctx = document.getElementById('responseTimeChart').getContext('2d');
    
    // Generate random data for demonstration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const responseTimeData = months.map(() => Math.floor(Math.random() * 5) + 3); // 3-8 minutes
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Average Response Time (minutes)',
                data: responseTimeData,
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            }
        }
    });
}

/**
 * Set up admin dashboard
 */
function setupAdminDashboard() {
    // Initialize dashboard stats
    initDashboardStats();
    
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
    
    // Apply orange theme styling
    notification.style.backgroundColor = '#222';
    notification.style.color = '#eee';
    notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    
    if (type === 'success') {
        notification.style.borderLeft = '4px solid #ff9e00';
        notification.querySelector('i').style.color = '#ff9e00';
    } else if (type === 'error') {
        notification.style.borderLeft = '4px solid #ff3c00';
        notification.querySelector('i').style.color = '#ff3c00';
    } else {
        notification.style.borderLeft = '4px solid #ff6a00';
        notification.querySelector('i').style.color = '#ff6a00';
    }
    
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
            // Add admin details section if it doesn't exist
            addAdminDetailsSection();
            
            // Handle form submission
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveSettingsData();
                showNotification('Settings saved successfully', 'success');
            });
            
            // Setup reset button functionality
            const resetButton = settingsForm.querySelector('.reset-btn');
            if (resetButton) {
                resetButton.addEventListener('click', function() {
                    if (confirm('Are you sure you want to reset all settings to default values?')) {
                        resetSettingsToDefault();
                    }
                });
            }
            
            // Setup password visibility toggles
            setupPasswordVisibilityToggles();
            
            // Load saved settings if available
            loadSavedSettings();
        }
    }
}

/**
 * Add admin details section to the settings
 */
function addAdminDetailsSection() {
    // Check if section already exists
    if (document.getElementById('admin-name')) return;
    
    const settingsContainer = document.querySelector('.settings-container form');
    if (!settingsContainer) return;
    
    // Create admin details section
    const adminSection = document.createElement('div');
    adminSection.className = 'settings-section';
    adminSection.innerHTML = `
        <h3><i class="fas fa-user-shield"></i> Admin Details</h3>
        <div class="settings-grid">
            <div class="form-group">
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
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabs = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get tab to show
            const tabId = item.dataset.tab;
            
            // Find corresponding tab button and simulate click
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}-tab"]`);
            if (tabBtn) {
                // Remove active class from all nav items and tab buttons
                navItems.forEach(navItem => navItem.classList.remove('active'));
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabs.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked nav item and corresponding tab button
                item.classList.add('active');
                tabBtn.classList.add('active');
                
                // Show the tab content
                const tabToShow = document.getElementById(`${tabId}-tab`);
                if (tabToShow) {
                    tabToShow.classList.add('active');
                }
            }
        });
    });
    
    // Set up logout button in sidebar
    const sidebarLogoutBtn = document.getElementById('admin-logout-sidebar');
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }
}

/**
 * Initialize dashboard stats
 */
function initDashboardStats() {
    // Get counts from localStorage
    const hospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
    const ambulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
    const medicalStores = JSON.parse(localStorage.getItem('medicalStores') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Update count displays
    document.getElementById('hospital-count').textContent = hospitals.length;
    document.getElementById('ambulance-count').textContent = ambulances.length;
    document.getElementById('medical-store-count').textContent = medicalStores.length;
    document.getElementById('user-count').textContent = users.length;
    
    // Initialize charts if they exist
    if(document.getElementById('hospitalCapacityChart')) {
        initHospitalCapacityChart(hospitals);
    }
    
    if(document.getElementById('responseTimeChart')) {
        initResponseTimeChart(ambulances);
    }
    
    // Update last updated timestamp
    const lastUpdated = document.getElementById('last-updated');
    if(lastUpdated) {
        const now = new Date();
        lastUpdated.textContent = `Last updated: ${now.toLocaleString()}`;
    }
}

/**
 * Initialize hospital capacity chart
 */
function initHospitalCapacityChart(hospitals) {
    const ctx = document.getElementById('hospitalCapacityChart').getContext('2d');
    
    // Extract data for chart
    const labels = hospitals.slice(0, 5).map(h => h.name || 'Unknown Hospital');
    const capacityData = hospitals.slice(0, 5).map(h => h.capacity || Math.floor(Math.random() * 50) + 50);
    const occupancyData = capacityData.map(cap => Math.floor(cap * (Math.random() * 0.7 + 0.1))); // 10-80% occupancy
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Capacity',
                    data: capacityData,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Current Occupancy',
                    data: occupancyData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Beds'
                    }
                }
            }
        }
    });
}

/**
 * Initialize response time chart
 */
function initResponseTimeChart(ambulances) {
    const ctx = document.getElementById('responseTimeChart').getContext('2d');
    
    // Generate random data for demonstration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const responseTimeData = months.map(() => Math.floor(Math.random() * 5) + 3); // 3-8 minutes
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Average Response Time (minutes)',
                data: responseTimeData,
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            }
        }
    });
}

/**
 * Set up admin dashboard
 */
function setupAdminDashboard() {
    // Initialize dashboard stats
    initDashboardStats();
    
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
    
    // Apply orange theme styling
    notification.style.backgroundColor = '#222';
    notification.style.color = '#eee';
    notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    
    if (type === 'success') {
        notification.style.borderLeft = '4px solid #ff9e00';
        notification.querySelector('i').style.color = '#ff9e00';
    } else if (type === 'error') {
        notification.style.borderLeft = '4px solid #ff3c00';
        notification.querySelector('i').style.color = '#ff3c00';
    } else {
        notification.style.borderLeft = '4px solid #ff6a00';
        notification.querySelector('i').style.color = '#ff6a00';
    }
    
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

// Initialize Firebase
document.addEventListener('DOMContentLoaded', function() {
    // Initialize default users if needed
    initializeUsers();
    
    // Setup auth tabs
    setupAuthTabs();
    
    // Setup password toggle
    setupPasswordToggles();
    
    // Check if user is logged in as admin
    checkAdminAuth();

    // Initialize tabs
    initTabs();

    // Initialize form handlers
    initFormHandlers();

    // Load existing data
    loadHospitals();
    loadAmbulances();
    loadMedicalStores();
    
    // Setup form animations
    setupFormAnimations();
});

// Initialize default users if none exist
function initializeUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // If no users exist, create default admin user
    if (users.length === 0) {
        const defaultAdmin = {
            id: 'user-admin-default',
            fullName: 'System Administrator',
            email: 'admin@medmap.com',
            username: 'admin',
            password: 'admin123', // In a real app, this should be hashed
            role: 'admin',
            hospital: null,
            createdAt: Date.now()
        };
        
        users.push(defaultAdmin);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Default admin user created');
    }
}

// Setup authentication tabs
function setupAuthTabs() {
    const loginTabBtn = document.getElementById('login-tab-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    const loginForm = document.getElementById('admin-login-form');
    const registerForm = document.getElementById('admin-register-form');
    
    if (loginTabBtn && registerTabBtn) {
        // Apply orange theme to active tab
        loginTabBtn.classList.add('active');
        loginTabBtn.style.color = '#ff6a00';
        registerTabBtn.style.color = '#aaa';
        
        // Login tab click
        loginTabBtn.addEventListener('click', function() {
            loginTabBtn.classList.add('active');
            registerTabBtn.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            
            // Update colors
            loginTabBtn.style.color = '#ff6a00';
            registerTabBtn.style.color = '#aaa';
        });
        
        // Register tab click
        registerTabBtn.addEventListener('click', function() {
            registerTabBtn.classList.add('active');
            loginTabBtn.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            
            // Update colors
            registerTabBtn.style.color = '#ff6a00';
            loginTabBtn.style.color = '#aaa';
        });
        
        // Registration form submit
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                registerUser();
            });
        }
    }
}

// Setup password toggle functionality
function setupPasswordToggles() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    
    passwordFields.forEach(field => {
        const parentGroup = field.parentElement;
        const icon = parentGroup.querySelector('.form-icon');
        
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', function() {
                if (field.type === 'password') {
                    field.type = 'text';
                    icon.classList.remove('fa-lock');
                    icon.classList.add('fa-eye-slash');
                } else {
                    field.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-lock');
                }
            });
        }
    });
}

// Setup form animations and interactions
function setupFormAnimations() {
    const formInputs = document.querySelectorAll('.auth-form input, .auth-form select');
    
    formInputs.forEach(input => {
        // Focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
            this.style.borderColor = '#ff6a00';
            this.style.backgroundColor = '#3a3a3a';
            this.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.2)';
        });
        
        // Blur effect
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
            if (this.value.trim() !== '') {
                this.style.borderColor = '#ff9e00';
                this.style.backgroundColor = '#333';
                this.style.boxShadow = 'none';
            } else {
                this.style.borderColor = '#444';
                this.style.backgroundColor = '#333';
                this.style.boxShadow = 'none';
            }
        });
        
        // Add placeholder animation
        input.addEventListener('input', function() {
            validateInput(this);
            // Label animation based on content
            const label = this.parentElement.querySelector('label');
            if (label) {
                if (this.value.trim() !== '') {
                    label.classList.add('active-label');
                    label.style.color = '#ff6a00';
                } else {
                    label.classList.remove('active-label');
                    label.style.color = '#ccc';
                }
            }
        });
        
        // Check on initial load if input has value
        if (input.value.trim() !== '') {
            const label = input.parentElement.querySelector('label');
            if (label) {
                label.classList.add('active-label');
                label.style.color = '#ff6a00';
            }
            input.style.borderColor = '#ff9e00';
        }
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.auth-form .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            this.appendChild(ripple);
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Enhance tabs transition
    const tabBtns = document.querySelectorAll('.auth-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.color = '#ff9e00';
                this.style.transition = 'color 0.3s ease';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.color = '#aaa';
            }
        });
    });
    
    // Apply orange glow effect on form submit buttons
    const submitButtons = document.querySelectorAll('.auth-form button[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 12px rgba(255, 106, 0, 0.4)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(255, 106, 0, 0.3)';
        });
    });
}

// Validate individual input
function validateInput(input) {
    const errorMessage = input.parentElement.querySelector('.input-error');
    const inputField = input.parentElement.querySelector('input, select, textarea');
    
    if (!errorMessage) return;
    
    errorMessage.textContent = '';
    
    // Required validation
    if (input.required && !input.value.trim()) {
        errorMessage.textContent = 'This field is required';
        input.style.borderColor = '#ff3c00';
        return;
    }
    
    // Email validation
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            errorMessage.textContent = 'Please enter a valid email address';
            input.style.borderColor = '#ff3c00';
            return;
        }
    }
    
    // Password validation
    if (input.id === 'register-password') {
        if (input.value.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters long';
            input.style.borderColor = '#ff3c00';
            return;
        }
    }
    
    // Confirm password validation
    if (input.id === 'register-confirm-password') {
        const password = document.getElementById('register-password');
        if (input.value !== password.value) {
            errorMessage.textContent = 'Passwords do not match';
            input.style.borderColor = '#ff3c00';
            return;
        }
    }
    
    // If validation passes
    input.style.borderColor = '#ff6a00';
    input.style.backgroundColor = '#3a3a3a';
}

// Register new user
function registerUser() {
    const fullName = document.getElementById('register-fullname').value;
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const role = document.getElementById('register-role').value;
    const hospital = document.getElementById('register-hospital').value;
    
    const errorElement = document.getElementById('register-error');
    const successElement = document.getElementById('register-success');
    
    // Reset messages
    errorElement.textContent = '';
    successElement.textContent = '';
    successElement.style.display = 'none';
    
    // Validate input
    if (!fullName || !email || !username || !password || !confirmPassword || !role) {
        errorElement.textContent = 'All fields are required except hospital.';
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorElement.textContent = 'Please enter a valid email address.';
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters.';
        return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match.';
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.username === username)) {
        errorElement.textContent = 'Username already exists. Please choose another.';
        return;
    }
    
    if (users.some(user => user.email === email)) {
        errorElement.textContent = 'Email already exists. Please use another email or login.';
        return;
    }
    
    // Create new user
    const newUser = {
        id: 'user-' + Date.now(),
        fullName: fullName,
        email: email,
        username: username,
        password: password, // In a real app, this should be hashed
        role: role,
        hospital: hospital || null,
        createdAt: Date.now()
    };
    
    // Add user to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show success message with animation
    successElement.textContent = 'Registration successful! You can now login.';
    successElement.style.display = 'block';
    successElement.style.opacity = '0';
    
    // Fade in animation
    setTimeout(() => {
        successElement.style.transition = 'opacity 0.5s ease';
        successElement.style.opacity = '1';
    }, 10);
    
    // Reset form
    document.getElementById('admin-register-form').reset();
    
    // Switch to login tab after successful registration
    setTimeout(() => {
        document.getElementById('login-tab-btn').click();
    }, 2000);
}

// Authentication check
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    
    if (!isLoggedIn) {
        // Redirect to login page or show login form
        document.getElementById('admin-login-section').style.display = 'block';
        document.getElementById('admin-dashboard').style.display = 'none';
        
        // Setup login form handler
        document.getElementById('admin-login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            loginUser();
        });
    } else {
        document.getElementById('admin-login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        
        // Setup logout handler
        document.getElementById('admin-logout').addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }
}

// Login user
function loginUser() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const errorElement = document.getElementById('login-error');
    
    // Reset error message
    errorElement.textContent = '';
    
    // Validate input
    if (!username || !password) {
        errorElement.textContent = 'Username and password are required.';
        return;
    }
    
    // Check if admin credentials
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            id: 'admin-1',
            username: 'admin',
            role: 'admin',
            fullName: 'System Administrator'
        }));
        document.getElementById('admin-login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        
        // Load data and initialize dashboard
        loadHospitals();
        loadAmbulances();
        loadMedicalStores();
        loadUsers();
        initDashboardStats(); // Initialize dashboard stats
        return;
    }
    
    // Check registered users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role,
            fullName: user.fullName
        }));
        document.getElementById('admin-login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        
        // Load data and initialize dashboard
        loadHospitals();
        loadAmbulances();
        loadMedicalStores();
        loadUsers();
        initDashboardStats(); // Initialize dashboard stats
    } else {
        errorElement.textContent = 'Invalid username or password.';
    }
}

// Initialize tabs
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Add Users Management tab to dashboard
    addUsersManagementTab();
}

// Add Users Management tab
function addUsersManagementTab() {
    // Check if tab already exists
    if (document.getElementById('users-tab')) {
        return;
    }
    
    // Get tab buttons container
    const tabButtons = document.querySelector('.tab-buttons');
    if (!tabButtons) {
        return;
    }
    
    // Create and add users tab button
    const usersTabBtn = document.createElement('button');
    usersTabBtn.className = 'tab-btn';
    usersTabBtn.setAttribute('data-tab', 'users-tab');
    usersTabBtn.innerHTML = '<i class="fas fa-users"></i> Users Management';
    tabButtons.appendChild(usersTabBtn);
    
    // Create users tab content
    const tabsContainer = document.querySelector('.tabs-container');
    if (!tabsContainer) {
        return;
    }
    
    // Create users tab content
    const usersTab = document.createElement('div');
    usersTab.id = 'users-tab';
    usersTab.className = 'tab-content';
    
    // Add content to users tab
    usersTab.innerHTML = `
        <h2>Manage Users</h2>
        <div id="users-success" class="success-message"></div>
        
        <table id="users-table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Hospital</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- User rows will be loaded here -->
            </tbody>
        </table>
    `;
    
    // Add users tab to container
    tabsContainer.appendChild(usersTab);
    
    // Add event listener to new tab button
    usersTabBtn.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to users tab
        usersTabBtn.classList.add('active');
        usersTab.classList.add('active');
        
        // Load users data
        loadUsers();
    });
}

// Load users data
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tableBody = document.querySelector('#users-table tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add heading row if empty
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No users registered yet</td></tr>';
        return;
    }
    
    // Add user rows
    users.forEach(user => {
        const createdDate = new Date(user.createdAt);
        const formattedDate = createdDate.toLocaleDateString() + ' ' + createdDate.toLocaleTimeString();
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td><span class="role-badge role-${user.role}">${user.role}</span></td>
            <td>${user.hospital || '-'}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="edit-btn" data-id="${user.id}" data-type="user">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-id="${user.id}" data-type="user">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add roles CSS if not exists
    if (!document.querySelector('style[data-for="role-badges"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-for', 'role-badges');
        style.textContent = `
            .role-badge {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .role-admin {
                background-color: rgba(255, 106, 0, 0.15);
                color: #ff9e00;
                border: 1px solid rgba(255, 106, 0, 0.3);
            }
            .role-manager {
                background-color: rgba(255, 158, 0, 0.15);
                color: #ffb74d;
                border: 1px solid rgba(255, 158, 0, 0.3);
            }
            .role-staff {
                background-color: rgba(255, 193, 7, 0.15);
                color: #ffc107;
                border: 1px solid rgba(255, 193, 7, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add event listeners for edit and delete buttons
    addTableEventListeners();
}

// Delete user
function deleteUser(userId) {
    // Get users from storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user to delete
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        showNotification('User not found', 'error');
        return;
    }
    
    // Get user information
    const user = users[userIndex];
    
    // Remove user from array
    users.splice(userIndex, 1);
    
    // Save updated users array
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show success message
    showSuccessMessage('users-success', `User "${user.username}" deleted successfully!`);
    
    // Reload users list
    loadUsers();
}

// Initialize form handlers
function initFormHandlers() {
    // Hospital form handler
    document.getElementById('add-hospital-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const hospital = {
            id: 'hospital-' + Date.now(),
            name: document.getElementById('hospital-name').value,
            address: document.getElementById('hospital-address').value,
            phone: document.getElementById('hospital-phone').value,
            beds: {
                total: parseInt(document.getElementById('hospital-beds-total').value) || 0,
                available: parseInt(document.getElementById('hospital-beds-available').value) || 0
            },
            waitTime: parseInt(document.getElementById('hospital-wait-time').value) || 0,
            location: {
                lat: parseFloat(document.getElementById('hospital-lat').value) || 0,
                lng: parseFloat(document.getElementById('hospital-lng').value) || 0
            },
            specialties: document.getElementById('hospital-specialties').value.split(',').map(s => s.trim()),
            emergency: document.getElementById('hospital-emergency').checked,
            timestamp: Date.now()
        };
        
        // Save to localStorage (replace with Firebase in production)
        const hospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
        hospitals.push(hospital);
        localStorage.setItem('hospitals', JSON.stringify(hospitals));
        
        // Reset form and reload hospitals
        document.getElementById('add-hospital-form').reset();
        showSuccessMessage('hospital-success', 'Hospital added successfully!');
        loadHospitals();
    });
    
    // Ambulance form handler
    document.getElementById('add-ambulance-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const ambulance = {
            id: 'ambulance-' + Date.now(),
            vehicleNumber: document.getElementById('ambulance-number').value,
            type: document.getElementById('ambulance-type').value,
            status: document.getElementById('ambulance-status').value,
            location: {
                lat: parseFloat(document.getElementById('ambulance-lat').value) || 0,
                lng: parseFloat(document.getElementById('ambulance-lng').value) || 0
            },
            driver: {
                name: document.getElementById('ambulance-driver-name').value,
                phone: document.getElementById('ambulance-driver-phone').value
            },
            hospital: document.getElementById('ambulance-hospital').value,
            equipment: document.getElementById('ambulance-equipment').value.split(',').map(s => s.trim()),
            timestamp: Date.now()
        };
        
        // Save to localStorage (replace with Firebase in production)
        const ambulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
        ambulances.push(ambulance);
        localStorage.setItem('ambulances', JSON.stringify(ambulances));
        
        // Reset form and reload ambulances
        document.getElementById('add-ambulance-form').reset();
        showSuccessMessage('ambulance-success', 'Ambulance added successfully!');
        loadAmbulances();
    });
    
    // Medical Store form handler
    document.getElementById('add-store-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const store = {
            id: 'store-' + Date.now(),
            name: document.getElementById('store-name').value,
            address: document.getElementById('store-address').value,
            fullAddress: document.getElementById('store-full-address').value,
            phone: document.getElementById('store-phone').value,
            open24x7: document.getElementById('store-24x7').checked,
            openingHours: document.getElementById('store-opening-hours').value,
            location: {
                lat: parseFloat(document.getElementById('store-lat').value) || 0,
                lng: parseFloat(document.getElementById('store-lng').value) || 0
            },
            rating: parseFloat(document.getElementById('store-rating').value) || 0,
            availableMedicines: document.getElementById('store-medicines').value.split(',').map(m => m.trim()),
            description: document.getElementById('store-description').value,
            paymentMethods: document.getElementById('store-payment').value.split(',').map(p => p.trim()),
            timestamp: Date.now()
        };
        
        // Save to localStorage (replace with Firebase in production)
        const stores = JSON.parse(localStorage.getItem('medicalStores') || '[]');
        stores.push(store);
        localStorage.setItem('medicalStores', JSON.stringify(stores));
        
        // Reset form and reload stores
        document.getElementById('add-store-form').reset();
        showSuccessMessage('store-success', 'Medical store added successfully!');
        loadMedicalStores();
    });
    
    // Add auto-locate buttons functionality
    document.querySelectorAll('.auto-locate').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPrefix = btn.getAttribute('data-target');
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        document.getElementById(targetPrefix + '-lat').value = position.coords.latitude;
                        document.getElementById(targetPrefix + '-lng').value = position.coords.longitude;
                    },
                    error => {
                        console.error('Error getting location:', error);
                        alert('Could not get your location. Please enter coordinates manually.');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser. Please enter coordinates manually.');
            }
        });
    });
}

// Load hospitals data
function loadHospitals() {
    const hospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
    const tableBody = document.querySelector('#hospitals-table tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add heading row if empty
    if (hospitals.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No hospitals added yet</td></tr>';
        return;
    }
    
    // Add hospital rows
    hospitals.forEach(hospital => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${hospital.name}</td>
            <td>${hospital.address}</td>
            <td>${hospital.phone}</td>
            <td>${hospital.beds.available}/${hospital.beds.total}</td>
            <td>${hospital.waitTime} mins</td>
            <td>${hospital.specialties.slice(0, 3).join(', ')}${hospital.specialties.length > 3 ? '...' : ''}</td>
            <td>${hospital.emergency ? 'Yes' : 'No'}</td>
            <td>
                <button class="edit-btn" data-id="${hospital.id}" data-type="hospital">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-id="${hospital.id}" data-type="hospital">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners for edit and delete buttons
    addTableEventListeners();
}

// Load ambulances data
function loadAmbulances() {
    const ambulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
    const tableBody = document.querySelector('#ambulances-table tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add heading row if empty
    if (ambulances.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No ambulances added yet</td></tr>';
        return;
    }
    
    // Add ambulance rows
    ambulances.forEach(ambulance => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ambulance.vehicleNumber}</td>
            <td>${ambulance.type}</td>
            <td>${ambulance.status}</td>
            <td>${ambulance.driver.name}</td>
            <td>${ambulance.driver.phone}</td>
            <td>${ambulance.hospital}</td>
            <td>
                <button class="edit-btn" data-id="${ambulance.id}" data-type="ambulance">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-id="${ambulance.id}" data-type="ambulance">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners for edit and delete buttons
    addTableEventListeners();
}

// Load medical stores data
function loadMedicalStores() {
    const stores = JSON.parse(localStorage.getItem('medicalStores') || '[]');
    const tableBody = document.querySelector('#stores-table tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add heading row if empty
    if (stores.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No medical stores added yet</td></tr>';
        return;
    }
    
    // Add store rows
    stores.forEach(store => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${store.name}</td>
            <td>${store.address}</td>
            <td>${store.phone}</td>
            <td>${store.open24x7 ? '24/7' : store.openingHours}</td>
            <td>${store.rating}/5</td>
            <td>${store.availableMedicines.slice(0, 3).join(', ')}${store.availableMedicines.length > 3 ? '...' : ''}</td>
            <td>
                <button class="edit-btn" data-id="${store.id}" data-type="store">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-id="${store.id}" data-type="store">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners for edit and delete buttons
    addTableEventListeners();
}

// Add event listeners to table buttons
function addTableEventListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const type = this.getAttribute('data-type');
            
            // Open edit modal with data
            openEditModal(id, type);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const type = this.getAttribute('data-type');
            
            if (confirm(`Are you sure you want to delete this ${type}?`)) {
                deleteItem(id, type);
            }
        });
    });
}

// Open edit modal with data
function openEditModal(id, type) {
    // Get data based on type
    let item;
    let storageKey;
    
    if (type === 'hospital') {
        storageKey = 'hospitals';
    } else if (type === 'ambulance') {
        storageKey = 'ambulances';
    } else if (type === 'store') {
        storageKey = 'medicalStores';
    } else if (type === 'user') {
        // Handle user delete separately
        deleteUser(id);
        return;
    }
    
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    item = items.find(i => i.id === id);
    
    if (!item) {
        alert(`${type} not found!`);
        return;
    }
    
    // Fill edit form based on type
    if (type === 'hospital') {
        document.getElementById('edit-hospital-id').value = item.id;
        document.getElementById('edit-hospital-name').value = item.name;
        document.getElementById('edit-hospital-address').value = item.address;
        document.getElementById('edit-hospital-phone').value = item.phone;
        document.getElementById('edit-hospital-beds-total').value = item.beds.total;
        document.getElementById('edit-hospital-beds-available').value = item.beds.available;
        document.getElementById('edit-hospital-wait-time').value = item.waitTime;
        document.getElementById('edit-hospital-lat').value = item.location.lat;
        document.getElementById('edit-hospital-lng').value = item.location.lng;
        document.getElementById('edit-hospital-specialties').value = item.specialties.join(', ');
        document.getElementById('edit-hospital-emergency').checked = item.emergency;
        
        // Show hospital edit modal
        document.getElementById('edit-hospital-modal').style.display = 'block';
    } else if (type === 'ambulance') {
        document.getElementById('edit-ambulance-id').value = item.id;
        document.getElementById('edit-ambulance-number').value = item.vehicleNumber;
        document.getElementById('edit-ambulance-type').value = item.type;
        document.getElementById('edit-ambulance-status').value = item.status;
        document.getElementById('edit-ambulance-lat').value = item.location.lat;
        document.getElementById('edit-ambulance-lng').value = item.location.lng;
        document.getElementById('edit-ambulance-driver-name').value = item.driver.name;
        document.getElementById('edit-ambulance-driver-phone').value = item.driver.phone;
        document.getElementById('edit-ambulance-hospital').value = item.hospital;
        document.getElementById('edit-ambulance-equipment').value = item.equipment.join(', ');
        
        // Show ambulance edit modal
        document.getElementById('edit-ambulance-modal').style.display = 'block';
    } else if (type === 'store') {
        document.getElementById('edit-store-id').value = item.id;
        document.getElementById('edit-store-name').value = item.name;
        document.getElementById('edit-store-address').value = item.address;
        document.getElementById('edit-store-full-address').value = item.fullAddress;
        document.getElementById('edit-store-phone').value = item.phone;
        document.getElementById('edit-store-24x7').checked = item.open24x7;
        document.getElementById('edit-store-opening-hours').value = item.openingHours;
        document.getElementById('edit-store-lat').value = item.location.lat;
        document.getElementById('edit-store-lng').value = item.location.lng;
        document.getElementById('edit-store-rating').value = item.rating;
        document.getElementById('edit-store-medicines').value = item.availableMedicines.join(', ');
        document.getElementById('edit-store-description').value = item.description;
        document.getElementById('edit-store-payment').value = item.paymentMethods.join(', ');
        
        // Show store edit modal
        document.getElementById('edit-store-modal').style.display = 'block';
    }
}

// Delete item from storage
function deleteItem(id, type) {
    let storageKey;
    
    if (type === 'hospital') {
        storageKey = 'hospitals';
    } else if (type === 'ambulance') {
        storageKey = 'ambulances';
    } else if (type === 'store') {
        storageKey = 'medicalStores';
    } else if (type === 'user') {
        // Handle user delete separately
        deleteUser(id);
        return;
    }
    
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedItems = items.filter(item => item.id !== id);
    
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    
    // Reload data
    if (type === 'hospital') {
        loadHospitals();
    } else if (type === 'ambulance') {
        loadAmbulances();
    } else if (type === 'store') {
        loadMedicalStores();
    }
    
    showSuccessMessage(`${type}-success`, `${type} deleted successfully!`);
}

// Update item in storage
function updateItem(formId, type) {
    let storageKey;
    let updatedItem;
    
    if (type === 'hospital') {
        storageKey = 'hospitals';
        const id = document.getElementById('edit-hospital-id').value;
        
        updatedItem = {
            id: id,
            name: document.getElementById('edit-hospital-name').value,
            address: document.getElementById('edit-hospital-address').value,
            phone: document.getElementById('edit-hospital-phone').value,
            beds: {
                total: parseInt(document.getElementById('edit-hospital-beds-total').value) || 0,
                available: parseInt(document.getElementById('edit-hospital-beds-available').value) || 0
            },
            waitTime: parseInt(document.getElementById('edit-hospital-wait-time').value) || 0,
            location: {
                lat: parseFloat(document.getElementById('edit-hospital-lat').value) || 0,
                lng: parseFloat(document.getElementById('edit-hospital-lng').value) || 0
            },
            specialties: document.getElementById('edit-hospital-specialties').value.split(',').map(s => s.trim()),
            emergency: document.getElementById('edit-hospital-emergency').checked,
            timestamp: Date.now()
        };
    } else if (type === 'ambulance') {
        storageKey = 'ambulances';
        const id = document.getElementById('edit-ambulance-id').value;
        
        updatedItem = {
            id: id,
            vehicleNumber: document.getElementById('edit-ambulance-number').value,
            type: document.getElementById('edit-ambulance-type').value,
            status: document.getElementById('edit-ambulance-status').value,
            location: {
                lat: parseFloat(document.getElementById('edit-ambulance-lat').value) || 0,
                lng: parseFloat(document.getElementById('edit-ambulance-lng').value) || 0
            },
            driver: {
                name: document.getElementById('edit-ambulance-driver-name').value,
                phone: document.getElementById('edit-ambulance-driver-phone').value
            },
            hospital: document.getElementById('edit-ambulance-hospital').value,
            equipment: document.getElementById('edit-ambulance-equipment').value.split(',').map(s => s.trim()),
            timestamp: Date.now()
        };
    } else if (type === 'store') {
        storageKey = 'medicalStores';
        const id = document.getElementById('edit-store-id').value;
        
        updatedItem = {
            id: id,
            name: document.getElementById('edit-store-name').value,
            address: document.getElementById('edit-store-address').value,
            fullAddress: document.getElementById('edit-store-full-address').value,
            phone: document.getElementById('edit-store-phone').value,
            open24x7: document.getElementById('edit-store-24x7').checked,
            openingHours: document.getElementById('edit-store-opening-hours').value,
            location: {
                lat: parseFloat(document.getElementById('edit-store-lat').value) || 0,
                lng: parseFloat(document.getElementById('edit-store-lng').value) || 0
            },
            rating: parseFloat(document.getElementById('edit-store-rating').value) || 0,
            availableMedicines: document.getElementById('edit-store-medicines').value.split(',').map(m => m.trim()),
            description: document.getElementById('edit-store-description').value,
            paymentMethods: document.getElementById('edit-store-payment').value.split(',').map(p => p.trim()),
            timestamp: Date.now()
        };
    }
    
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedItems = items.map(item => {
        if (item.id === updatedItem.id) {
            return updatedItem;
        }
        return item;
    });
    
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    
    // Close modal
    document.getElementById(`edit-${type}-modal`).style.display = 'none';
    
    // Reload data
    if (type === 'hospital') {
        loadHospitals();
    } else if (type === 'ambulance') {
        loadAmbulances();
    } else if (type === 'store') {
        loadMedicalStores();
    }
    
    showSuccessMessage(`${type}-success`, `${type} updated successfully!`);
}

// Show success message
function showSuccessMessage(elementId, message) {
    const successElement = document.getElementById(elementId);
    successElement.textContent = message;
    successElement.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 3000);
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Initialize edit form handlers
document.addEventListener('DOMContentLoaded', function() {
    // Hospital edit form
    document.getElementById('edit-hospital-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateItem('edit-hospital-form', 'hospital');
    });
    
    // Ambulance edit form
    document.getElementById('edit-ambulance-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateItem('edit-ambulance-form', 'ambulance');
    });
    
    // Medical Store edit form
    document.getElementById('edit-store-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateItem('edit-store-form', 'store');
    });
    
    // Close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Modal background click to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});

// Remove duplicate document ready functions and keep only one
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel initializing...');
    
    // Setup authentication tabs
    setupAuthTabs();
    
    // Create default admin user if none exists
    createDefaultAdminUser();
    
    // Check if admin is already logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        console.log('User is logged in, showing dashboard');
        // Show admin dashboard
        document.getElementById('admin-login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        
        // Initialize admin panel
        initAdminPanel();
    } else {
        console.log('User is not logged in, showing login form');
        document.getElementById('admin-login-section').style.display = 'block';
        document.getElementById('admin-dashboard').style.display = 'none';
    }
    
    // Setup form event listeners
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginUser();
        });
    }
    
    const registerForm = document.getElementById('admin-register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerUser();
        });
    }
    
    // Setup password toggle
    setupPasswordToggles();
    
    // Initialize tabs
    initTabs();
    
    // Setup form animations
    setupFormAnimations();
    
    // Setup edit form handlers
    // Hospital edit form
    const editHospitalForm = document.getElementById('edit-hospital-form');
    if (editHospitalForm) {
        editHospitalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateItem('edit-hospital-form', 'hospital');
        });
    }
    
    // Ambulance edit form
    const editAmbulanceForm = document.getElementById('edit-ambulance-form');
    if (editAmbulanceForm) {
        editAmbulanceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateItem('edit-ambulance-form', 'ambulance');
        });
    }
    
    // Medical Store edit form
    const editStoreForm = document.getElementById('edit-store-form');
    if (editStoreForm) {
        editStoreForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateItem('edit-store-form', 'store');
        });
    }
    
    // Close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Modal background click to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}); 