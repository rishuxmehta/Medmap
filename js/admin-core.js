/**
 * Core Admin Dashboard Functionality
 * This file contains essential functions for the admin dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the admin panel
    initAdminPanel();
});

/**
 * Initialize all admin panel functionality
 */
function initAdminPanel() {
    setupSidebarNav();
    setupTabButtons();
    setupActionButtons();
    setupModals();
    setupMobileSidebar();
    initCharts();
    setupFormToggles();
    setupFormTabs();
    updateLastUpdatedTimestamp();
    
    // Setup specific management sections
    setupHospitalManagement();
    setupAmbulanceManagement();
    setupEmergencyManagement();
    setupRouteManagement();
    setupUserManagement();
    setupSettingsManagement();
}

/**
 * Set up sidebar navigation
 */
function setupSidebarNav() {
    const sidebarItems = document.querySelectorAll('.admin-nav li');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all sidebar items
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding tab
            const tabId = this.getAttribute('data-tab') + '-tab';
            const tabs = document.querySelectorAll('.admin-tab');
            
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Set up tab buttons within sections
 */
function setupTabButtons() {
    // Set up form tabs
    const formTabs = document.querySelectorAll('.form-tab');
    
    formTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContentId = tabId + '-tab';
            const parentForm = this.closest('form');
            
            // Update active tab
            const siblingTabs = this.parentNode.querySelectorAll('.form-tab');
            siblingTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            const tabContents = parentForm.querySelectorAll('.form-tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            parentForm.querySelector('#' + tabContentId).classList.add('active');
            
            // Update progress bar if exists
            const progressSegments = parentForm.querySelectorAll('.progress-segment');
            if (progressSegments.length > 0) {
                const currentIndex = Array.from(siblingTabs).indexOf(this);
                
                progressSegments.forEach((segment, index) => {
                    if (index <= currentIndex) {
                        segment.classList.add('active');
                    } else {
                        segment.classList.remove('active');
                    }
                });
            }
            
            // Show/hide navigation buttons
            updateFormNavigation(parentForm, siblingTabs, this);
        });
    });
    
    // Setup next/prev buttons for form tabs
    const nextTabBtns = document.querySelectorAll('#next-tab');
    const prevTabBtns = document.querySelectorAll('#prev-tab');
    
    nextTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parentForm = this.closest('form');
            const activeTabs = parentForm.querySelectorAll('.form-tab');
            const activeTab = parentForm.querySelector('.form-tab.active');
            const currentIndex = Array.from(activeTabs).indexOf(activeTab);
            
            if (currentIndex < activeTabs.length - 1) {
                activeTabs[currentIndex + 1].click();
            }
            
            // Show submit button on last tab
            if (currentIndex + 1 === activeTabs.length - 1) {
                parentForm.querySelector('button[type="submit"]').style.display = 'flex';
            }
        });
    });
    
    prevTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parentForm = this.closest('form');
            const activeTabs = parentForm.querySelectorAll('.form-tab');
            const activeTab = parentForm.querySelector('.form-tab.active');
            const currentIndex = Array.from(activeTabs).indexOf(activeTab);
            
            if (currentIndex > 0) {
                activeTabs[currentIndex - 1].click();
            }
            
            // Hide submit button if not on last tab
            if (currentIndex - 1 < activeTabs.length - 1) {
                parentForm.querySelector('button[type="submit"]').style.display = 'none';
            }
        });
    });
}

/**
 * Update form navigation buttons
 */
function updateFormNavigation(form, tabs, currentTab) {
    const currentIndex = Array.from(tabs).indexOf(currentTab);
    const prevBtn = form.querySelector('#prev-tab');
    const nextBtn = form.querySelector('#next-tab');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (currentIndex === 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
    }
    
    if (currentIndex === tabs.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
}

/**
 * Set up action buttons for tables
 */
function setupActionButtons() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.action-btn.edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.querySelector('td:first-child').textContent.trim();
            editItem(id, row);
        });
    });
    
    // View buttons
    const viewButtons = document.querySelectorAll('.action-btn.view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.querySelector('td:first-child').textContent.trim();
            viewItem(id, row);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.querySelector('td:first-child').textContent.trim();
            if (confirm('Are you sure you want to delete this item?')) {
                deleteItem(id, row);
            }
        });
    });
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
                labels: ['SSG Hospital', 'Bhailal Amin', 'Baroda Medical', 'Kailash Cancer', 'Sterling'],
                datasets: [{
                    label: 'Occupied Beds',
                    data: [34, 31, 23, 27, 46],
                    backgroundColor: '#ff6b00'
                }, {
                    label: 'Available Beds',
                    data: [6, 19, 7, 33, 4],
                    backgroundColor: '#2ecc71'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Hospital Bed Capacity'
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
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
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Avg. Response Time (mins)',
                    data: [12, 11.5, 10.2, 9.5, 8.7, 8.2],
                    fill: false,
                    borderColor: '#ff6b00',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Response Time Trends'
                    }
                }
            }
        });
    }
}

/**
 * Set up modals
 */
function setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    const closeModalButtons = document.querySelectorAll('.modal-close, .cancel-btn');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
}

/**
 * Open a modal
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }
}

/**
 * Close a modal
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

/**
 * Set up mobile sidebar
 */
function setupMobileSidebar() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        document.addEventListener('click', function(event) {
            const isClickInside = sidebar.contains(event.target) || menuToggle.contains(event.target);
            
            if (!isClickInside && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }
}

/**
 * Set up form toggles
 */
function setupFormToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-form');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetContainer = document.getElementById(targetId + '-container');
            
            if (targetContainer) {
                const isVisible = targetContainer.style.display !== 'none';
                
                if (isVisible) {
                    targetContainer.style.display = 'none';
                    this.innerHTML = '<i class="fas fa-plus"></i> Add ' + targetId.replace('add-', '').replace('-form', '');
                } else {
                    targetContainer.style.display = 'block';
                    this.innerHTML = '<i class="fas fa-times"></i> Cancel';
                }
            }
        });
    });
    
    // Add functionality to all add buttons
    const addButtons = document.querySelectorAll('.add-btn');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.id;
            const formId = id.replace('-btn', '') + '-form-container';
            const formContainer = document.getElementById(formId);
            
            if (formContainer) {
                formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
}

/**
 * Set up form tabs
 */
function setupFormTabs() {
    // Already handled in setupTabButtons()
}

/**
 * Generic function to edit an item
 */
function editItem(id, row) {
    console.log('Editing item:', id);
    // This would be customized based on the type of item
    const type = getCurrentTab();
    
    switch(type) {
        case 'hospitals':
            editHospital(id, row);
            break;
        case 'ambulances':
            editAmbulance(id, row);
            break;
        case 'emergencies':
            editEmergency(id, row);
            break;
        case 'routes':
            editRoute(id, row);
            break;
        case 'users':
            editUser(id, row);
            break;
        default:
            showNotification('Edit functionality not implemented for this type', 'warning');
    }
}

/**
 * Generic function to view an item
 */
function viewItem(id, row) {
    console.log('Viewing item:', id);
    // This would be customized based on the type of item
    const type = getCurrentTab();
    
    switch(type) {
        case 'hospitals':
            viewHospital(id, row);
            break;
        case 'ambulances':
            viewAmbulance(id, row);
            break;
        case 'emergencies':
            viewEmergency(id, row);
            break;
        case 'routes':
            viewRoute(id, row);
            break;
        case 'users':
            viewUser(id, row);
            break;
        default:
            showNotification('View functionality not implemented for this type', 'warning');
    }
}

/**
 * Generic function to delete an item
 */
function deleteItem(id, row) {
    console.log('Deleting item:', id);
    
    // Add deleting animation
    row.classList.add('deleting');
    
    // This would be customized based on the type of item
    const type = getCurrentTab();
    
    // Simulate deletion after animation
    setTimeout(() => {
        row.remove();
        showNotification(`${type.slice(0, -1)} deleted successfully`, 'success');
        
        // Update stats
        updateDashboardStats();
    }, 500);
}

/**
 * Get the current active tab
 */
function getCurrentTab() {
    const activeTab = document.querySelector('.admin-tab.active');
    if (activeTab) {
        return activeTab.id.replace('-tab', '');
    }
    return 'dashboard';
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Get icon based on type
    let icon;
    switch(type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'exclamation-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        default:
            icon = 'info-circle';
    }
    
    // Set notification content
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Add slide-in animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Set auto-dismiss
    const dismissTimeout = setTimeout(() => {
        dismissNotification(notification);
    }, 5000);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        clearTimeout(dismissTimeout);
        dismissNotification(notification);
    });
}

/**
 * Dismiss a notification
 */
function dismissNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Setup hospital management
 */
function setupHospitalManagement() {
    const addHospitalForm = document.getElementById('add-hospital-form');
    
    if (addHospitalForm) {
        addHospitalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const hospital = {
                name: document.getElementById('hospital-name').value,
                type: document.getElementById('hospital-type').value,
                address: document.getElementById('hospital-address').value,
                area: document.getElementById('hospital-area').value,
                city: document.getElementById('hospital-city').value,
                state: document.getElementById('hospital-state').value,
                pincode: document.getElementById('hospital-pincode').value,
                phone: document.getElementById('hospital-phone').value,
                email: document.getElementById('hospital-email').value,
                totalBeds: document.getElementById('hospital-beds-total').value,
                availableBeds: document.getElementById('hospital-beds-available').value,
                waitTime: document.getElementById('hospital-wait-time').value,
                hasEmergency: document.getElementById('hospital-emergency').checked,
                lat: document.getElementById('hospital-lat').value,
                lng: document.getElementById('hospital-lng').value
            };
            
            // Add hospital to table
            addHospitalToTable(hospital);
            
            // Reset form
            addHospitalForm.reset();
            
            // Hide form
            document.getElementById('add-hospital-form-container').style.display = 'none';
            
            // Update button text
            document.getElementById('add-hospital-btn').innerHTML = '<i class="fas fa-plus"></i> Add Hospital';
            
            // Show notification
            showNotification('Hospital added successfully', 'success');
            
            // Update stats
            updateDashboardStats();
        });
    }
    
    // Location buttons
    const autoLocateBtn = document.querySelector('.auto-locate[data-target="hospital"]');
    
    if (autoLocateBtn) {
        autoLocateBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        document.getElementById('hospital-lat').value = position.coords.latitude.toFixed(6);
                        document.getElementById('hospital-lng').value = position.coords.longitude.toFixed(6);
                        
                        showNotification('Location updated successfully', 'success');
                    },
                    error => {
                        showNotification('Error getting location: ' + error.message, 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by this browser', 'error');
            }
        });
    }
}

/**
 * Add hospital to table
 */
function addHospitalToTable(hospital) {
    const table = document.querySelector('#hospitals-tab .data-table tbody');
    
    if (!table) return;
    
    const capacityPercentage = Math.round((1 - (hospital.availableBeds / hospital.totalBeds)) * 100);
    
    let statusClass = 'available';
    let statusText = 'Available';
    
    if (capacityPercentage >= 90) {
        statusClass = 'maintenance';
        statusText = 'Critical';
    } else if (capacityPercentage >= 70) {
        statusClass = 'warning';
        statusText = 'High Load';
    }
    
    const newRow = document.createElement('tr');
    newRow.className = 'new-row';
    
    newRow.innerHTML = `
        <td>${hospital.name}</td>
        <td>${hospital.address}, ${hospital.city}, ${hospital.state}</td>
        <td>
            <div class="capacity-indicator">
                <div class="capacity-bar-container">
                    <div class="capacity-bar" style="width: ${capacityPercentage}%"></div>
                </div>
                <span>${capacityPercentage}% (${hospital.totalBeds - hospital.availableBeds}/${hospital.totalBeds})</span>
            </div>
        </td>
        <td>${hospital.waitTime} mins</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${hospital.phone}</td>
        <td class="actions-cell">
            <button class="action-btn edit"><i class="fas fa-edit"></i></button>
            <button class="action-btn view"><i class="fas fa-eye"></i></button>
            <button class="action-btn delete"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    // Add event listeners to the new buttons
    newRow.querySelector('.action-btn.edit').addEventListener('click', function() {
        editItem(hospital.name, newRow);
    });
    
    newRow.querySelector('.action-btn.view').addEventListener('click', function() {
        viewItem(hospital.name, newRow);
    });
    
    newRow.querySelector('.action-btn.delete').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this hospital?')) {
            deleteItem(hospital.name, newRow);
        }
    });
    
    // Add to table
    table.prepend(newRow);
    
    // Update hospital summary
    updateHospitalSummary();
}

/**
 * Update dashboard stats
 */
function updateDashboardStats() {
    // Update last updated timestamp
    updateLastUpdatedTimestamp();
    
    // Update hospital summary
    updateHospitalSummary();
}

/**
 * Update hospital summary
 */
function updateHospitalSummary() {
    // Update total hospitals
    const totalHospitals = document.querySelectorAll('#hospitals-tab .data-table tbody tr').length;
    const totalHospitalsElement = document.getElementById('total-hospitals');
    
    if (totalHospitalsElement) {
        totalHospitalsElement.textContent = totalHospitals;
    }
    
    // Calculate total and available beds
    let totalBeds = 0;
    let availableBeds = 0;
    let criticalHospitals = 0;
    
    document.querySelectorAll('#hospitals-tab .data-table tbody tr').forEach(row => {
        const capacityText = row.querySelector('.capacity-indicator span').textContent;
        const match = capacityText.match(/\((\d+)\/(\d+)\)/);
        
        if (match) {
            const occupied = parseInt(match[1]);
            const total = parseInt(match[2]);
            
            totalBeds += total;
            availableBeds += (total - occupied);
            
            // Check if hospital is critical
            const status = row.querySelector('.status-badge').textContent;
            if (status === 'Critical') {
                criticalHospitals++;
            }
        }
    });
    
    // Update total beds
    const totalBedsElement = document.getElementById('total-beds');
    if (totalBedsElement) {
        totalBedsElement.textContent = totalBeds;
    }
    
    // Update available beds
    const availableBedsElement = document.getElementById('available-beds');
    if (availableBedsElement) {
        availableBedsElement.textContent = availableBeds;
    }
    
    // Update critical hospitals
    const criticalHospitalsElement = document.getElementById('critical-hospitals');
    if (criticalHospitalsElement) {
        criticalHospitalsElement.textContent = criticalHospitals;
    }
}

/**
 * Update last updated timestamp
 */
function updateLastUpdatedTimestamp() {
    const lastUpdatedElements = document.querySelectorAll('.last-updated span');
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    lastUpdatedElements.forEach(element => {
        element.textContent = formattedDate;
    });
}

// Setup other management functions (simplified for now)
function setupAmbulanceManagement() {
    // Similar to hospital management
    console.log('Ambulance management initialized');
}

function setupEmergencyManagement() {
    console.log('Emergency management initialized');
}

function setupRouteManagement() {
    console.log('Route management initialized');
}

function setupUserManagement() {
    console.log('User management initialized');
}

/**
 * Set up settings management
 */
function setupSettingsManagement() {
    console.log('Settings management initialized');
    
    // Get the settings form
    const settingsForm = document.getElementById('system-settings-form');
    if (settingsForm) {
        // Add admin details section
        addAdminDetailsSection();
        
        // Handle form submission
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
        
        // Handle reset button
        const resetBtn = settingsForm.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to reset all settings to default values?')) {
                    resetSettings();
                }
            });
        }
        
        // Setup password visibility toggles
        setupPasswordToggles();
        
        // Initialize settings from localStorage if available
        loadSavedSettings();

        // Setup theme switcher preview
        setupThemePreview();
    }
}

/**
 * Add admin details section to settings
 */
function addAdminDetailsSection() {
    const settingsContainer = document.querySelector('.settings-container form');
    if (!settingsContainer) return;
    
    // Check if admin details section already exists
    if (document.querySelector('.settings-section:has([id="admin-name"])')) return;
    
    // Create admin details section
    const adminSection = document.createElement('div');
    adminSection.className = 'settings-section';
    adminSection.innerHTML = `
        <h3><i class="fas fa-user-shield"></i> Admin Details</h3>
        <div class="settings-grid">
            <div class="form-group">
                <label for="admin-name">Full Name</label>
                <input type="text" id="admin-name" placeholder="Your full name" value="Admin User">
                <i class="fas fa-user form-icon"></i>
            </div>
            <div class="form-group">
                <label for="admin-email">Email Address</label>
                <input type="email" id="admin-email" placeholder="Your email address" value="admin@medmap.org">
                <i class="fas fa-envelope form-icon"></i>
            </div>
            <div class="form-group">
                <label for="admin-phone">Phone Number</label>
                <input type="tel" id="admin-phone" placeholder="Your contact number" value="+91 9876543210">
                <i class="fas fa-phone form-icon"></i>
            </div>
            <div class="form-group">
                <label for="admin-position">Position/Role</label>
                <input type="text" id="admin-position" placeholder="Your position" value="System Administrator">
                <i class="fas fa-id-badge form-icon"></i>
            </div>
            <div class="form-group">
                <label for="admin-password">Change Password</label>
                <div class="password-input">
                    <input type="password" id="admin-password" placeholder="New password">
                    <button type="button" class="toggle-password" tabindex="-1">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <i class="fas fa-lock form-icon"></i>
            </div>
            <div class="form-group">
                <label for="admin-confirm-password">Confirm Password</label>
                <div class="password-input">
                    <input type="password" id="admin-confirm-password" placeholder="Confirm new password">
                    <button type="button" class="toggle-password" tabindex="-1">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <i class="fas fa-lock form-icon"></i>
            </div>
            <div class="form-group">
                <label for="admin-language">Interface Language</label>
                <select id="admin-language">
                    <option value="en" selected>English</option>
                    <option value="hi">Hindi</option>
                    <option value="gu">Gujarati</option>
                    <option value="mr">Marathi</option>
                </select>
                <i class="fas fa-language form-icon"></i>
            </div>
            <div class="form-group">
                <label for="admin-theme">Interface Theme</label>
                <select id="admin-theme">
                    <option value="light">Light</option>
                    <option value="dark" selected>Dark</option>
                    <option value="system">System Default</option>
                </select>
                <i class="fas fa-palette form-icon"></i>
            </div>
            <div class="form-group">
                <label for="admin-2fa">Two-Factor Authentication</label>
                <div class="toggle-switch">
                    <input type="checkbox" id="admin-2fa">
                    <label for="admin-2fa"></label>
                </div>
                <i class="fas fa-shield-alt form-icon"></i>
            </div>
            <div class="form-group">
                <label for="admin-notifications">Email Notifications</label>
                <div class="toggle-switch">
                    <input type="checkbox" id="admin-notifications" checked>
                    <label for="admin-notifications"></label>
                </div>
                <i class="fas fa-bell form-icon"></i>
            </div>
        </div>
    `;
    
    // Insert the admin section before form actions
    const formActions = settingsContainer.querySelector('.form-actions');
    if (formActions) {
        settingsContainer.insertBefore(adminSection, formActions);
    } else {
        settingsContainer.appendChild(adminSection);
    }
}

/**
 * Setup theme preview
 */
function setupThemePreview() {
    const themeSelector = document.getElementById('admin-theme');
    if (themeSelector) {
        themeSelector.addEventListener('change', function() {
            applyTheme(this.value);
        });
    }
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    // Get all settings values
    const settings = {
        map: {
            defaultLatitude: document.getElementById('default-latitude')?.value || '22.3072',
            defaultLongitude: document.getElementById('default-longitude')?.value || '73.1812',
            defaultZoom: document.getElementById('default-zoom')?.value || '13',
            mapProvider: document.getElementById('map-provider')?.value || 'osm',
            mapStyle: document.getElementById('map-style')?.value || 'standard'
        },
        ambulance: {
            refreshRate: document.getElementById('ambulance-refresh-rate')?.value || '10',
            idleTimeout: document.getElementById('ambulance-idle-timeout')?.value || '15',
            availableColor: document.getElementById('available-color')?.value || '#2ecc71',
            dispatchedColor: document.getElementById('dispatched-color')?.value || '#f39c12',
            maintenanceColor: document.getElementById('maintenance-color')?.value || '#e74c3c',
            autoDispatch: document.getElementById('auto-dispatch')?.checked || false
        },
        hospital: {
            capacityWarning: document.getElementById('capacity-warning')?.value || '75',
            capacityCritical: document.getElementById('capacity-critical')?.value || '90',
            refreshRate: document.getElementById('hospital-refresh-rate')?.value || '5',
            autoRedirect: document.getElementById('auto-redirect')?.checked || false
        },
        system: {
            emergencyTimeout: document.getElementById('emergency-timeout')?.value || '60',
            notificationSound: document.getElementById('notification-sound')?.value || 'alert1',
            aiOptimization: document.getElementById('ai-optimization')?.checked || false,
            dataAnalytics: document.getElementById('data-analytics')?.checked || false
        },
        admin: {
            name: document.getElementById('admin-name')?.value || 'Admin User',
            email: document.getElementById('admin-email')?.value || 'admin@medmap.org',
            phone: document.getElementById('admin-phone')?.value || '+91 9876543210',
            position: document.getElementById('admin-position')?.value || 'System Administrator',
            language: document.getElementById('admin-language')?.value || 'en',
            theme: document.getElementById('admin-theme')?.value || 'dark',
            twoFactorAuth: document.getElementById('admin-2fa')?.checked || false,
            emailNotifications: document.getElementById('admin-notifications')?.checked || true
        }
    };
    
    // Store in localStorage
    localStorage.setItem('medMapSettings', JSON.stringify(settings));
    
    // Handle password change if provided
    const password = document.getElementById('admin-password')?.value;
    const confirmPassword = document.getElementById('admin-confirm-password')?.value;
    
    if (password && confirmPassword) {
        if (password === confirmPassword) {
            // In a real app, this would use proper authentication
            // For demo, we'll just store in localStorage (not secure!)
            localStorage.setItem('adminPassword', password);
            showNotification('Settings saved successfully including password change', 'success');
            
            // Clear password fields
            document.getElementById('admin-password').value = '';
            document.getElementById('admin-confirm-password').value = '';
        } else {
            showNotification('Passwords do not match', 'error');
            return; // Don't show success message
        }
    } else {
        showNotification('Settings saved successfully', 'success');
    }
    
    // Apply theme if changed
    applyTheme(settings.admin.theme);
    
    // Update admin info in sidebar
    updateAdminInfo(settings.admin);
}

/**
 * Update admin info in sidebar
 */
function updateAdminInfo(adminSettings) {
    const adminName = document.querySelector('.admin-info h3');
    const adminPosition = document.querySelector('.admin-info p');
    
    if (adminName && adminSettings.name) {
        adminName.textContent = adminSettings.name;
    }
    
    if (adminPosition && adminSettings.position) {
        adminPosition.textContent = adminSettings.position;
    }
}

/**
 * Load saved settings from localStorage
 */
function loadSavedSettings() {
    const savedSettings = localStorage.getItem('medMapSettings');
    if (!savedSettings) return;
    
    try {
        const settings = JSON.parse(savedSettings);
        
        // Apply settings to form fields
        // Map settings
        document.getElementById('default-latitude').value = settings.map?.defaultLatitude || '22.3072';
        document.getElementById('default-longitude').value = settings.map?.defaultLongitude || '73.1812';
        document.getElementById('default-zoom').value = settings.map?.defaultZoom || '13';
        document.getElementById('map-provider').value = settings.map?.mapProvider || 'osm';
        document.getElementById('map-style').value = settings.map?.mapStyle || 'standard';
        
        // Ambulance settings
        document.getElementById('ambulance-refresh-rate').value = settings.ambulance?.refreshRate || '10';
        document.getElementById('ambulance-idle-timeout').value = settings.ambulance?.idleTimeout || '15';
        document.getElementById('available-color').value = settings.ambulance?.availableColor || '#2ecc71';
        document.getElementById('dispatched-color').value = settings.ambulance?.dispatchedColor || '#f39c12';
        document.getElementById('maintenance-color').value = settings.ambulance?.maintenanceColor || '#e74c3c';
        document.getElementById('auto-dispatch').checked = settings.ambulance?.autoDispatch || false;
        
        // Hospital settings
        document.getElementById('capacity-warning').value = settings.hospital?.capacityWarning || '75';
        document.getElementById('capacity-critical').value = settings.hospital?.capacityCritical || '90';
        document.getElementById('hospital-refresh-rate').value = settings.hospital?.refreshRate || '5';
        document.getElementById('auto-redirect').checked = settings.hospital?.autoRedirect || false;
        
        // System settings
        document.getElementById('emergency-timeout').value = settings.system?.emergencyTimeout || '60';
        document.getElementById('notification-sound').value = settings.system?.notificationSound || 'alert1';
        document.getElementById('ai-optimization').checked = settings.system?.aiOptimization || false;
        document.getElementById('data-analytics').checked = settings.system?.dataAnalytics || false;
        
        // Admin settings (if elements exist)
        if (document.getElementById('admin-name')) {
            document.getElementById('admin-name').value = settings.admin?.name || 'Admin User';
            document.getElementById('admin-email').value = settings.admin?.email || 'admin@medmap.org';
            document.getElementById('admin-phone').value = settings.admin?.phone || '+91 9876543210';
            document.getElementById('admin-position').value = settings.admin?.position || 'System Administrator';
            document.getElementById('admin-language').value = settings.admin?.language || 'en';
            document.getElementById('admin-theme').value = settings.admin?.theme || 'dark';
            
            // New settings
            if (document.getElementById('admin-2fa')) {
                document.getElementById('admin-2fa').checked = settings.admin?.twoFactorAuth || false;
                document.getElementById('admin-notifications').checked = settings.admin?.emailNotifications !== undefined ? 
                    settings.admin.emailNotifications : true;
            }
        }
        
        // Apply theme
        applyTheme(settings.admin?.theme || 'dark');
        
        // Update admin info in sidebar
        updateAdminInfo(settings.admin || {});
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Reset settings to defaults
 */
function resetSettings() {
    // Clear localStorage settings
    localStorage.removeItem('medMapSettings');
    
    // Reload the page to reset all form fields
    window.location.reload();
}

/**
 * Apply theme to the admin interface
 */
function applyTheme(theme) {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-system');
    
    switch (theme) {
        case 'light':
            body.classList.add('theme-light');
            break;
        case 'dark':
            body.classList.add('theme-dark');
            break;
        case 'system':
            body.classList.add('theme-system');
            break;
    }
}

/**
 * Setup password visibility toggles
 */
function setupPasswordToggles() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle password visibility
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// These functions would be implemented to handle item-specific actions
function editHospital(id, row) {
    showNotification(`Editing hospital: ${id}`, 'info');
}

function viewHospital(id, row) {
    showNotification(`Viewing hospital: ${id}`, 'info');
}

function editAmbulance(id, row) {
    showNotification(`Editing ambulance: ${id}`, 'info');
}

function viewAmbulance(id, row) {
    showNotification(`Viewing ambulance: ${id}`, 'info');
}

function editEmergency(id, row) {
    showNotification(`Editing emergency: ${id}`, 'info');
}

function viewEmergency(id, row) {
    showNotification(`Viewing emergency: ${id}`, 'info');
}

function editRoute(id, row) {
    showNotification(`Editing route: ${id}`, 'info');
}

function viewRoute(id, row) {
    showNotification(`Viewing route: ${id}`, 'info');
}

function editUser(id, row) {
    showNotification(`Editing user: ${id}`, 'info');
}

function viewUser(id, row) {
    showNotification(`Viewing user: ${id}`, 'info');
} 