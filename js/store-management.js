/**
 * Medical Store Management
 * Handles registration, listing, and management of medical stores
 */

// Ensure the script is loaded
(function() {
    // Check if the script is already loaded in admin.html
    const scriptAlreadyLoaded = Array.from(document.querySelectorAll('script')).some(script => 
        script.src && script.src.includes('store-management.js')
    );
    
    // If this code is executing, the script is already loaded one way or another
    console.log('Medical Store Management script initialized');
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add listener to the register button in medical-store.html
    const registerStoreBtn = document.getElementById('register-store-btn');
    if (registerStoreBtn) {
        registerStoreBtn.addEventListener('click', function() {
            // Redirect to admin page with medical-stores tab
            window.location.href = 'admin.html#medical-stores';
        });
    }
    
    // Initialize store management functionality if we're on the admin page
    if (document.querySelector('.admin-sidebar')) {
        initStoreManagement();
    }
    
    // If we're on the admin dashboard, create the nearby stores section
    if (document.querySelector('.admin-sidebar') && document.querySelector('.tab-content[data-tab="dashboard"]')) {
        setTimeout(createNearbyMedicalStoresSection, 1500); // Small delay to ensure other elements are loaded
    }
    
    // Check if we're on the medical store page
    const medicalStoreContainer = document.getElementById('medical-store-map-container');
    if (medicalStoreContainer) {
        createNearbyMedicalStoresPage(medicalStoreContainer);
    }
});

// Function that will be called from admin.html initialization
function setupMedicalStoreManagement() {
    console.log('Setting up medical store management...');
    initStoreManagement();
}

// Initialize store management
function initStoreManagement() {
    console.log("Initializing store management");
    
    // Add tab to admin sidebar if it doesn't exist
    const adminSidebar = document.querySelector('.admin-sidebar');
    if (adminSidebar) {
        // Check if Medical Stores tab already exists
        if (!document.getElementById('admin-stores-tab')) {
            const storesTab = document.createElement('div');
            storesTab.className = 'admin-tab';
            storesTab.id = 'admin-stores-tab';
            storesTab.innerHTML = `
                <i class="fas fa-clinic-medical"></i>
                <span>Medical Stores</span>
            `;
            storesTab.addEventListener('click', function() {
                showStoreManagementPanel();
            });
            
            // Insert before the last tab (Settings)
            const lastTab = adminSidebar.querySelector('.admin-tab:last-child');
            adminSidebar.insertBefore(storesTab, lastTab);
        }
    }
    
    // Create store management panel if it doesn't exist
    let storeManagementPanel = document.getElementById('store-management-panel');
    if (!storeManagementPanel) {
        storeManagementPanel = document.createElement('div');
        storeManagementPanel.id = 'store-management-panel';
        storeManagementPanel.className = 'admin-panel';
        storeManagementPanel.style.display = 'none';
        
        storeManagementPanel.innerHTML = `
            <div class="panel-header">
                <h2><i class="fas fa-clinic-medical"></i> Medical Store Management</h2>
                <div class="header-actions">
                    <button id="add-store-btn" class="action-btn">
                        <i class="fas fa-plus"></i> Add New Store
                    </button>
                </div>
            </div>
            
            <div class="panel-content">
                <div class="stores-list-section">
                    <div class="section-header">
                        <h3>Registered Medical Stores</h3>
                        <div class="section-actions">
                            <div class="search-container">
                                <input type="text" placeholder="Search stores..." id="store-search">
                                <i class="fas fa-search"></i>
                            </div>
                            <div class="filter-dropdown">
                                <button class="filter-btn">
                                    <i class="fas fa-filter"></i> Filter
                                </button>
                                <div class="filter-menu">
                                    <label>
                                        <input type="checkbox" id="filter-verified"> Verified Only
                                    </label>
                                    <label>
                                        <input type="checkbox" id="filter-24h"> 24/7 Only
                                    </label>
                                    <label>
                                        <input type="checkbox" id="filter-emergency"> Emergency Medicines
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stores-list" id="stores-list">
                        <!-- Stores will be loaded here -->
                        <div class="loading-indicator">
                            <i class="fas fa-spinner fa-spin"></i> Loading stores...
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Store Registration Form Modal -->
            <div id="store-registration-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Register New Medical Store</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="store-registration-form">
                            <div class="form-group">
                                <label for="store-name">Store Name *</label>
                                <input type="text" id="store-name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="store-address">Address *</label>
                                <textarea id="store-address" required></textarea>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="store-lat">Latitude</label>
                                    <input type="number" id="store-lat" step="0.000001">
                                </div>
                                
                                <div class="form-group">
                                    <label for="store-lng">Longitude</label>
                                    <input type="number" id="store-lng" step="0.000001">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="store-phone">Phone Number *</label>
                                    <input type="tel" id="store-phone" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="store-email">Email</label>
                                    <input type="email" id="store-email">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="store-hours">Operating Hours *</label>
                                    <input type="text" id="store-hours" required placeholder="e.g., 9:00 AM - 9:00 PM">
                                </div>
                                
                                <div class="form-group checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="store-24h">
                                        <span>Open 24/7</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="store-license">License Number *</label>
                                    <input type="text" id="store-license" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="store-established">Established Year</label>
                                    <input type="number" id="store-established" min="1900" max="2099">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Services Offered</label>
                                <div class="checkbox-grid">
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="services" value="prescription">
                                        <span>Prescription Filling</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="services" value="otc">
                                        <span>OTC Medications</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="services" value="emergency">
                                        <span>Emergency Medicines</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="services" value="delivery">
                                        <span>Home Delivery</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="services" value="diagnostics">
                                        <span>Diagnostic Services</span>
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="services" value="doctors">
                                        <span>Doctor Consultation</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="store-description">Description</label>
                                <textarea id="store-description"></textarea>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="cancel-btn">Cancel</button>
                                <button type="submit" class="submit-btn">Register Store</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <!-- Store Profile Modal -->
            <div id="store-profile-modal" class="store-profile-modal">
                <div class="store-profile-container">
                    <span class="close-modal">&times;</span>
                    <div id="modal-store-name" class="modal-header"></div>
                    <div id="store-profile-content" class="modal-body"></div>
                </div>
            </div>
        `;
        
        // Append to admin content
        const adminContent = document.querySelector('.admin-content');
        if (adminContent) {
            adminContent.appendChild(storeManagementPanel);
            
            // Add event listeners
            const addStoreBtn = document.getElementById('add-store-btn');
            const storeRegistrationModal = document.getElementById('store-registration-modal');
            const closeBtn = storeRegistrationModal.querySelector('.close-btn');
            const cancelBtn = storeRegistrationModal.querySelector('.cancel-btn');
            const storeRegistrationForm = document.getElementById('store-registration-form');
            
            // Store 24/7 checkbox
            const store24hCheckbox = document.getElementById('store-24h');
            const storeHoursInput = document.getElementById('store-hours');
            
            if (store24hCheckbox && storeHoursInput) {
                store24hCheckbox.addEventListener('change', function() {
                    if (this.checked) {
                        storeHoursInput.value = '24/7';
                        storeHoursInput.disabled = true;
                    } else {
                        storeHoursInput.value = '';
                        storeHoursInput.disabled = false;
                    }
                });
            }
            
            if (addStoreBtn) {
                addStoreBtn.addEventListener('click', function() {
                    storeRegistrationModal.style.display = 'block';
                });
            }
            
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    storeRegistrationModal.style.display = 'none';
                });
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    storeRegistrationModal.style.display = 'none';
                });
            }
            
            if (storeRegistrationForm) {
                storeRegistrationForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    // Handle form submission here
                    console.log('Store registration form submitted');
                    
                    // Hide modal after submission
                    storeRegistrationModal.style.display = 'none';
                    
                    // Show success message
                    showNotification('Store registered successfully!', 'success');
                });
            }
            
            // Initialize store list
            loadStores();
            
            // Add event listeners to the profile modal close button
            const closeModal = document.querySelector('.close-modal');
            const storeProfileModal = document.getElementById('store-profile-modal');
            
            if (closeModal && storeProfileModal) {
                closeModal.addEventListener('click', function() {
                    storeProfileModal.style.display = 'none';
                });
                
                // Close modal when clicking outside of it
                window.addEventListener('click', function(event) {
                    if (event.target == storeProfileModal) {
                        storeProfileModal.style.display = 'none';
                    }
                });
            }
        }
    }
    
    return true;
}

// Show store management panel
function showStoreManagementPanel() {
    // Hide all panels
    const panels = document.querySelectorAll('.admin-panel');
    panels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    // Show store management panel
    const storeManagementPanel = document.getElementById('store-management-panel');
    if (storeManagementPanel) {
        storeManagementPanel.style.display = 'block';
    }
    
    // Update active tab
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    const storesTab = document.getElementById('admin-stores-tab');
    if (storesTab) {
        storesTab.classList.add('active');
    }
}

// Add Medical Stores menu item to sidebar
function addMedicalStoresMenuItem() {
    const sidebar = document.querySelector('.admin-nav ul');
    
    // Check if Medical Stores menu item already exists
    if (!document.querySelector('[data-tab="medical-stores"]')) {
        // Find the hospitals menu item
        const hospitalsItem = document.querySelector('[data-tab="hospitals"]');
        
        if (hospitalsItem) {
            // Create new menu item
            const storesItem = document.createElement('li');
            storesItem.setAttribute('data-tab', 'medical-stores');
            storesItem.innerHTML = `
                <i class="fas fa-clinic-medical"></i>
                <span>Medical Stores</span>
            `;
            
            // Insert after hospitals
            hospitalsItem.parentNode.insertBefore(storesItem, hospitalsItem.nextSibling);
            
            // Add click event to show the medical stores tab
            storesItem.addEventListener('click', function() {
                // Hide all tabs
                document.querySelectorAll('.admin-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show medical stores tab
                const storesTab = document.getElementById('medical-stores-tab');
                if (storesTab) {
                    storesTab.classList.add('active');
                }
                
                // Update active menu item
                document.querySelectorAll('.admin-nav li').forEach(item => {
                    item.classList.remove('active');
                });
                storesItem.classList.add('active');
            });
        }
    }
}

// Create Medical Stores tab content
function createMedicalStoresTab() {
    // Check if tab already exists
    if (!document.getElementById('medical-stores-tab')) {
        const mainContent = document.querySelector('.admin-main');
        
        if (mainContent) {
            // Create tab content
            const storesTab = document.createElement('section');
            storesTab.className = 'admin-tab';
            storesTab.id = 'medical-stores-tab';
            storesTab.innerHTML = `
                <div class="admin-header">
                    <h2>Medical Store Management</h2>
                    <div class="admin-actions">
                        <button class="add-btn" id="add-store-btn"><i class="fas fa-plus"></i> Add Store</button>
                        <button class="refresh-btn"><i class="fas fa-sync-alt"></i> Refresh</button>
                        <div class="search-box">
                            <input type="text" placeholder="Search stores...">
                            <i class="fas fa-search"></i>
                        </div>
                    </div>
                </div>
                
                <div class="last-update-container">
                    <span class="last-updated">Last updated: <span id="store-last-updated">Today, 2:45 PM</span></span>
                    <div class="data-summary">
                        <span><i class="fas fa-clinic-medical"></i> Total: <strong id="total-stores">12</strong></span>
                        <span><i class="fas fa-clock"></i> 24/7: <strong id="total-24h-stores">5</strong></span>
                        <span><i class="fas fa-pills"></i> Stock: <strong id="med-stock-status">Good</strong></span>
                        <span><i class="fas fa-exclamation-triangle"></i> Critical: <strong id="critical-stores">1</strong></span>
                    </div>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Store Name</th>
                                <th>Address</th>
                                <th>Contact</th>
                                <th>Operating Hours</th>
                                <th>Medicine Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="medical-store-table-body">
                            <tr>
                                <td>ST001</td>
                                <td>MedPlus Pharmacy</td>
                                <td>Race Course Road, Vadodara</td>
                                <td>(0265) 2222222</td>
                                <td>24/7</td>
                                <td>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: 85%; background-color: #2ecc71;"></div>
                                    </div>
                                    <span>85%</span>
                                </td>
                                <td><span class="status-badge active">Active</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                                        <button class="view-btn"><i class="fas fa-eye"></i></button>
                                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>ST002</td>
                                <td>Apollo Pharmacy</td>
                                <td>Gotri Road, Vadodara</td>
                                <td>(0265) 3333333</td>
                                <td>7:00 AM - 11:00 PM</td>
                                <td>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: 65%; background-color: #f39c12;"></div>
                                    </div>
                                    <span>65%</span>
                                </td>
                                <td><span class="status-badge active">Active</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                                        <button class="view-btn"><i class="fas fa-eye"></i></button>
                                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>ST003</td>
                                <td>LifeCare Pharmacy</td>
                                <td>Alkapuri, Vadodara</td>
                                <td>(0265) 4444444</td>
                                <td>24/7</td>
                                <td>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: 90%; background-color: #2ecc71;"></div>
                                    </div>
                                    <span>90%</span>
                                </td>
                                <td><span class="status-badge active">Active</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                                        <button class="view-btn"><i class="fas fa-eye"></i></button>
                                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            
            // Add the store registration modal
            const modal = createStoreRegistrationModal();
            storesTab.appendChild(modal);
            
            // Add tab to main content
            mainContent.appendChild(storesTab);
        }
    }
}

// Create Store Registration Modal
function createStoreRegistrationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'store-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Register Medical Store</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="store-registration-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="facility-name">Name of Facility*</label>
                            <input type="text" id="facility-name" placeholder="Enter facility name" required>
                        </div>
                        <div class="form-group">
                            <label for="facility-type">Type*</label>
                            <select id="facility-type" required>
                                <option value="" disabled selected>Select type</option>
                                <option value="retail">Retail Pharmacy</option>
                                <option value="hospital">Hospital Pharmacy</option>
                                <option value="wholesale">Wholesale Distributor</option>
                                <option value="specialty">Specialty Pharmacy</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="contact-person">Contact Person</label>
                            <input type="text" id="contact-person" placeholder="Enter name">
                        </div>
                        <div class="form-group">
                            <label for="contact-number">Contact Number*</label>
                            <input type="tel" id="contact-number" placeholder="Enter phone number" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address*</label>
                        <input type="email" id="email" placeholder="Enter email address" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Complete Address*</label>
                        <textarea id="address" placeholder="Enter complete address" required></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="license-number">License Number*</label>
                            <input type="text" id="license-number" placeholder="Enter license number" required>
                        </div>
                        <div class="form-group">
                            <label for="expiry-date">License Expiry Date*</label>
                            <input type="date" id="expiry-date" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="operating-hours">Operating Hours*</label>
                        <select id="operating-hours" required>
                            <option value="" disabled selected>Select hours</option>
                            <option value="regular">Regular (9am - 9pm)</option>
                            <option value="extended">Extended (8am - 11pm)</option>
                            <option value="24hours">24/7 Service</option>
                            <option value="custom">Custom Hours</option>
                        </select>
                    </div>
                    
                    <div id="custom-hours-container" style="display: none;">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="opening-time">Opening Time</label>
                                <input type="time" id="opening-time">
                            </div>
                            <div class="form-group">
                                <label for="closing-time">Closing Time</label>
                                <input type="time" id="closing-time">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Services Offered</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" name="services" value="prescription"> Prescription Dispensing</label>
                            <label><input type="checkbox" name="services" value="otc"> OTC Medications</label>
                            <label><input type="checkbox" name="services" value="delivery"> Home Delivery</label>
                            <label><input type="checkbox" name="services" value="emergency"> Emergency Medicines</label>
                            <label><input type="checkbox" name="services" value="equipment"> Medical Equipment</label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="upload-license">Upload License Document</label>
                        <input type="file" id="upload-license" accept=".pdf,.jpg,.jpeg,.png">
                        <p class="form-hint">Upload PDF, JPG or PNG (Max 5MB)</p>
                    </div>
                    
                    <div class="form-group form-checkbox">
                        <label>
                            <input type="checkbox" id="terms-agree" required>
                            I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="cancel-btn">Cancel</button>
                <button type="button" class="submit-btn" id="submit-store-form">Submit Registration</button>
            </div>
        </div>
    `;
    
    return modal;
}

// Set up event listeners for the store management interface
function setupStoreManagementEvents() {
    // Wait for DOM to be ready
    setTimeout(() => {
        // Add Store button
        const addStoreBtn = document.getElementById('add-store-btn');
        if (addStoreBtn) {
            addStoreBtn.addEventListener('click', function() {
                const modal = document.getElementById('store-modal');
                if (modal) {
                    modal.style.display = 'block';
                }
            });
        }
        
        // Close modal button
        const closeBtn = document.querySelector('#store-modal .close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                document.getElementById('store-modal').style.display = 'none';
            });
        }
        
        // Cancel button
        const cancelBtn = document.querySelector('#store-modal .cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                document.getElementById('store-modal').style.display = 'none';
            });
        }
        
        // Operating hours select
        const operatingHoursSelect = document.getElementById('operating-hours');
        if (operatingHoursSelect) {
            operatingHoursSelect.addEventListener('change', function() {
                const customHoursContainer = document.getElementById('custom-hours-container');
                if (customHoursContainer) {
                    customHoursContainer.style.display = this.value === 'custom' ? 'block' : 'none';
                }
            });
        }
        
        // Submit form
        const submitBtn = document.getElementById('submit-store-form');
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                const form = document.getElementById('store-registration-form');
                if (form && form.checkValidity()) {
                    // In a real application, you would submit the form data to a server
                    alert('Store registration submitted successfully!');
                    document.getElementById('store-modal').style.display = 'none';
                    form.reset();
                } else {
                    // Trigger HTML5 validation
                    form.reportValidity();
                }
            });
        }
        
        // Action buttons
        document.querySelectorAll('#medical-store-table-body .action-buttons button').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const storeId = row.cells[0].textContent;
                const storeName = row.cells[1].textContent;
                
                if (this.classList.contains('edit-btn')) {
                    alert(`Edit store ${storeId}: ${storeName}`);
                } else if (this.classList.contains('view-btn')) {
                    alert(`View store ${storeId}: ${storeName}`);
                } else if (this.classList.contains('delete-btn')) {
                    if (confirm(`Are you sure you want to delete store ${storeId}: ${storeName}?`)) {
                        row.remove();
                        updateStoreCounts();
                    }
                }
            });
        });
        
        // Update store counts initially
        updateStoreCounts();
    }, 1000); // Delay to ensure DOM is ready
}

// Update store counts in the summary
function updateStoreCounts() {
    const rows = document.querySelectorAll('#medical-store-table-body tr');
    const totalStores = document.getElementById('total-stores');
    if (totalStores) {
        totalStores.textContent = rows.length;
    }
    
    // Count 24/7 stores
    const stores24h = Array.from(rows).filter(row => row.cells[4].textContent.includes('24/7')).length;
    const total24hStores = document.getElementById('total-24h-stores');
    if (total24hStores) {
        total24hStores.textContent = stores24h;
    }
    
    // Update stock status
    const stockLevels = Array.from(rows).map(row => {
        const progressText = row.cells[5].querySelector('span').textContent;
        return parseInt(progressText);
    });
    
    const avgStock = stockLevels.reduce((sum, level) => sum + level, 0) / stockLevels.length;
    const stockStatus = document.getElementById('med-stock-status');
    if (stockStatus) {
        if (avgStock >= 80) {
            stockStatus.textContent = 'Good';
            stockStatus.style.color = '#2ecc71';
        } else if (avgStock >= 50) {
            stockStatus.textContent = 'Moderate';
            stockStatus.style.color = '#f39c12';
        } else {
            stockStatus.textContent = 'Low';
            stockStatus.style.color = '#e74c3c';
        }
    }
    
    // Update critical stores count
    const criticalStores = Array.from(rows).filter(row => {
        const progressText = row.cells[5].querySelector('span').textContent;
        return parseInt(progressText) < 50;
    }).length;
    
    const criticalStoresEl = document.getElementById('critical-stores');
    if (criticalStoresEl) {
        criticalStoresEl.textContent = criticalStores;
    }
}

// Function to create and render nearby medical stores section
function createNearbyMedicalStoresSection() {
    // Check if the section already exists
    if (!document.getElementById('nearby-medical-stores')) {
        // Create the container for the section
        const nearbyStoresSection = document.createElement('div');
        nearbyStoresSection.id = 'nearby-medical-stores';
        nearbyStoresSection.className = 'admin-card';
        
        // Add the header and content
        nearbyStoresSection.innerHTML = `
            <div class="card-header">
                <h3><i class="fas fa-clinic-medical"></i> Nearby Medical Stores</h3>
                <div class="card-actions">
                    <button class="card-action" title="Refresh"><i class="fas fa-sync-alt"></i></button>
                    <button class="card-action" title="Filter"><i class="fas fa-filter"></i></button>
                    <button class="card-action" title="View All"><i class="fas fa-external-link-alt"></i></button>
                </div>
            </div>
            <div class="nearby-store-container">
                ${generateStoreProfileCards()}
            </div>
        `;
        
        // Find the appropriate place to add the section
        const adminRow = document.querySelector('.admin-row');
        if (adminRow) {
            adminRow.appendChild(nearbyStoresSection);
        } else {
            // If admin-row doesn't exist, check for dashboard section
            const dashboardSection = document.querySelector('.tab-content[data-tab="dashboard"]');
            if (dashboardSection) {
                // Create a new row if needed
                const newRow = document.createElement('div');
                newRow.className = 'admin-row';
                newRow.appendChild(nearbyStoresSection);
                dashboardSection.appendChild(newRow);
            }
        }
        
        // Add event listeners for the store profile cards
        setupStoreProfileCardEvents();
    }
}

// Get user's current location
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation is not supported by your browser');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            position => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            error => {
                reject(`Error getting location: ${error.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}

// Calculate distance between two coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return parseFloat(distance.toFixed(1));
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Generate HTML for store profile cards with actual distance from user
function generateStoreProfileCards(userLocation = null) {
    // Sample data for stores with coordinates and expanded details
    const stores = [
        {
            id: 'ST001',
            name: 'MedPlus Pharmacy',
            address: 'Race Course Road, Vadodara',
            contact: '(0265) 2222222',
            hours: '24/7',
            is24h: true,
            stock: 85,
            status: 'verified',
            lat: 22.3039, 
            lng: 73.1823,
            specialties: ['Prescription Medications', 'Over-the-Counter Drugs', 'First Aid'],
            hasEmergencyMeds: true,
            description: 'A 24/7 pharmacy with comprehensive medication services and emergency medications available.',
            rating: 4.7,
            openSince: 2005,
            availableDoctors: true,
            topMedicines: ['Antibiotics', 'Cardiac', 'Diabetes', 'Pain Relief'],
            insurance: ['Star Health', 'Aditya Birla', 'HDFC ERGO', 'LIC'],
            homeDelivery: true,
            diagnosticServices: true,
            prescriptionRefill: true,
            lastUpdated: '2 hours ago'
        },
        {
            id: 'ST002',
            name: 'Apollo Pharmacy',
            address: 'Gotri Road, Vadodara',
            contact: '(0265) 3333333',
            hours: '7:00 AM - 11:00 PM',
            is24h: false,
            stock: 65,
            status: 'verified',
            lat: 22.3219, 
            lng: 73.1587,
            specialties: ['Diabetes Care', 'Surgical Supplies', 'Nutritional Supplements'],
            hasEmergencyMeds: true,
            description: 'Well-stocked pharmacy with special focus on diabetes care products and surgical supplies.',
            rating: 4.3,
            openSince: 1998,
            availableDoctors: true,
            topMedicines: ['Diabetes', 'Blood Pressure', 'Nutritional', 'Surgical Supplies'],
            insurance: ['Star Health', 'ICICI Lombard', 'New India'],
            homeDelivery: true,
            diagnosticServices: true,
            prescriptionRefill: true,
            lastUpdated: '1 day ago'
        },
        {
            id: 'ST003',
            name: 'LifeCare Pharmacy',
            address: 'Alkapuri, Vadodara',
            contact: '(0265) 4444444',
            hours: '24/7',
            is24h: true,
            stock: 90,
            status: 'verified',
            lat: 22.3126, 
            lng: 73.1905,
            specialties: ['Pediatric Medications', 'Cardiac Medications', 'Dermatological Products'],
            hasEmergencyMeds: true,
            description: 'Comprehensive pharmacy with experienced staff and wide range of medications.',
            rating: 4.8,
            openSince: 2010,
            availableDoctors: false,
            topMedicines: ['Pediatric', 'Cardiac', 'Dermatological', 'Emergency'],
            insurance: ['All Major Insurance'],
            homeDelivery: true,
            diagnosticServices: false,
            prescriptionRefill: true,
            lastUpdated: '3 hours ago'
        },
        {
            id: 'ST004',
            name: 'Wellness Pharmacy',
            address: 'Sayajigunj, Vadodara',
            contact: '(0265) 5555555',
            hours: '8:00 AM - 10:00 PM',
            is24h: false,
            stock: 45,
            status: 'pending',
            lat: 22.3173, 
            lng: 73.1965,
            specialties: ['Homeopathic Medicines', 'Ayurvedic Products', 'Herbal Supplements'],
            hasEmergencyMeds: false,
            description: 'Specializes in alternative medicine with a focus on natural remedies and supplements.',
            rating: 4.1,
            openSince: 2015,
            availableDoctors: true,
            topMedicines: ['Homeopathic', 'Ayurvedic', 'Herbal', 'Wellness'],
            insurance: ['Limited Insurance Coverage'],
            homeDelivery: false,
            diagnosticServices: false,
            prescriptionRefill: false,
            lastUpdated: '5 days ago'
        }
    ];
    
    // Calculate distances if user location is provided
    let storesWithDistance = [...stores];
    if (userLocation) {
        storesWithDistance = stores.map(store => {
            const distance = calculateDistance(
                userLocation.lat, 
                userLocation.lng, 
                store.lat, 
                store.lng
            );
            return { ...store, distance: distance };
        });
        
        // Sort by distance
        storesWithDistance.sort((a, b) => a.distance - b.distance);
    } else {
        // Add default distances
        storesWithDistance = stores.map((store, index) => {
            return { ...store, distance: (index + 1) * 1.2 };
        });
    }
    
    // Generate HTML for each store
    return storesWithDistance.map(store => {
        // Determine stock color based on level
        let stockColor = '#e74c3c'; // red for low
        if (store.stock >= 80) {
            stockColor = '#2ecc71'; // green for good
        } else if (store.stock >= 50) {
            stockColor = '#f39c12'; // orange for moderate
        }
        
        // Generate star rating
        const fullStars = Math.floor(store.rating);
        const hasHalfStar = store.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        // Generate badges for features
        let featureBadges = '';
        if (store.homeDelivery) {
            featureBadges += '<span class="feature-badge delivery"><i class="fas fa-truck"></i> Delivery</span>';
        }
        if (store.diagnosticServices) {
            featureBadges += '<span class="feature-badge diagnostics"><i class="fas fa-microscope"></i> Diagnostics</span>';
        }
        if (store.availableDoctors) {
            featureBadges += '<span class="feature-badge doctors"><i class="fas fa-user-md"></i> Doctors</span>';
        }
        if (store.prescriptionRefill) {
            featureBadges += '<span class="feature-badge refill"><i class="fas fa-prescription"></i> Refill</span>';
        }
        
        return `
            <div class="store-profile-card" data-store-id="${store.id}">
                <div class="store-status-badge ${store.status}">${store.status === 'verified' ? 'Verified' : 'Pending'}</div>
                <div class="store-banner">
                    <div class="store-hours-badge ${store.is24h ? 'open-24h' : ''}">
                        <i class="fas fa-clock"></i> ${store.hours}
                    </div>
                    <div class="last-updated-badge">
                        <i class="fas fa-sync-alt"></i> Updated ${store.lastUpdated}
                    </div>
                </div>
                <div class="store-logo">
                    <i class="fas fa-clinic-medical"></i>
                </div>
                <div class="store-profile-content">
                    <h3 class="store-name">${store.name}</h3>
                    <p class="store-address"><i class="fas fa-map-marker-alt"></i> ${store.address}</p>
                    
                    <div class="store-rating">
                        ${starsHtml}
                        <span>${store.rating} (${Math.floor(store.rating * 10) + Math.floor(Math.random() * 20)})</span>
                    </div>
                    
                    <div class="store-feature-badges">
                        ${featureBadges}
                    </div>
                    
                    <div class="store-details">
                        <div class="store-detail-item">
                            <i class="fas fa-phone"></i>
                            <span>${store.contact}</span>
                        </div>
                        <div class="store-detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${store.distance} km</span>
                        </div>
                        <div class="store-detail-item">
                            <i class="fas fa-tag"></i>
                            <span>${store.specialties[0]}</span>
                        </div>
                        ${store.hasEmergencyMeds ? `
                        <div class="store-detail-item emergency-meds">
                            <i class="fas fa-first-aid"></i>
                            <span>Emergency Meds Available</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="store-medicines">
                        <span class="medicine-tag">${store.topMedicines[0]}</span>
                        <span class="medicine-tag">${store.topMedicines[1]}</span>
                        <span class="medicine-tag">${store.topMedicines[2]}</span>
                    </div>
                    
                    <div class="store-stock-level">
                        <div class="store-stock-label">
                            <span>Medicine Stock</span>
                            <span>${store.stock}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${store.stock}%; background-color: ${stockColor};"></div>
                        </div>
                    </div>
                    
                    <div class="store-profile-actions">
                        <button class="store-action-btn primary view-store-btn" data-id="${store.id}">
                            <i class="fas fa-eye"></i> View Profile
                        </button>
                        <button class="store-action-btn secondary directions-btn" data-lat="${store.lat}" data-lng="${store.lng}">
                            <i class="fas fa-directions"></i> Directions
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Updated function to create nearby medical stores page
function createNearbyMedicalStoresPage(container) {
    // Create the section container
    const nearbyStoresSection = document.createElement('section');
    nearbyStoresSection.className = 'nearby-stores-section';
    nearbyStoresSection.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-clinic-medical"></i> Nearby Medical Stores</h2>
            <p>Find medical stores in your vicinity for quick access to medicines and healthcare products</p>
            
            <div class="location-status">
                <span id="location-status-text">Fetching your location...</span>
                <button id="refresh-location-btn" class="refresh-location-btn">
                    <i class="fas fa-sync-alt"></i> Refresh Location
                </button>
            </div>
            
            <div class="filter-controls">
                <div class="search-filter">
                    <input type="text" placeholder="Search by name or medicine..." id="store-search-input">
                    <i class="fas fa-search"></i>
                </div>
                
                <div class="filter-options">
                    <label class="filter-option">
                        <input type="checkbox" id="filter-24h" checked>
                        <span>24/7 Open</span>
                    </label>
                    
                    <label class="filter-option">
                        <input type="checkbox" id="filter-emergency" checked>
                        <span>Emergency Medicines</span>
                    </label>
                    
                    <label class="filter-option">
                        <input type="checkbox" id="filter-verified" checked>
                        <span>Verified Only</span>
                    </label>
                    
                    <select id="distance-filter">
                        <option value="all">All Distances</option>
                        <option value="2" selected>Within 2 km</option>
                        <option value="5">Within 5 km</option>
                        <option value="10">Within 10 km</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="nearby-store-container" id="nearby-store-container">
            <div class="loading-stores">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading nearby medical stores...</p>
            </div>
        </div>
        
        <div class="load-more-container">
            <button id="load-more-stores" class="load-more-btn">
                <i class="fas fa-plus-circle"></i> Load More Stores
            </button>
        </div>
        
        <!-- Store Profile Modal -->
        <div id="store-profile-modal" class="store-profile-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-store-name">Store Name</h3>
                    <button class="close-modal-btn">&times;</button>
                </div>
                <div class="modal-body" id="store-profile-content">
                    <!-- Store profile content will be inserted here -->
                </div>
            </div>
        </div>
    `;
    
    // Add the section after the container
    container.parentNode.insertBefore(nearbyStoresSection, container.nextSibling);
    
    // Initialize with geolocation
    initializeNearbyStores();
    
    // Add event listeners
    setupStoreFilterEvents();
    
    // Add event listener for refresh location
    const refreshLocationBtn = document.getElementById('refresh-location-btn');
    if (refreshLocationBtn) {
        refreshLocationBtn.addEventListener('click', initializeNearbyStores);
    }
    
    // Add event listener for store profile modal close button
    const closeModalBtn = document.querySelector('.close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            const modal = document.getElementById('store-profile-modal');
            if (modal) modal.style.display = 'none';
        });
    }
}

// Initialize nearby stores with geolocation
function initializeNearbyStores() {
    const locationStatus = document.getElementById('location-status-text');
    const storeContainer = document.getElementById('nearby-store-container');
    
    if (!locationStatus || !storeContainer) return;
    
    locationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching your location...';
    storeContainer.innerHTML = `
        <div class="loading-stores">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading nearby medical stores...</p>
        </div>
    `;
    
    getUserLocation()
        .then(userLocation => {
            locationStatus.innerHTML = `<i class="fas fa-check-circle"></i> Using your current location`;
            storeContainer.innerHTML = generateStoreProfileCards(userLocation);
            setupStoreProfileCardEvents();
        })
        .catch(error => {
            console.error(error);
            locationStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${error}. Using default locations.`;
            storeContainer.innerHTML = generateStoreProfileCards();
            setupStoreProfileCardEvents();
        });
}

// Updated Set up event listeners for store profile cards
function setupStoreProfileCardEvents() {
    // Add click events to view store buttons
    document.querySelectorAll('.view-store-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const storeId = this.getAttribute('data-id');
            showStoreProfile(storeId);
        });
    });
    
    // Add click events to directions buttons
    document.querySelectorAll('.directions-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const storeLat = this.getAttribute('data-lat');
            const storeLng = this.getAttribute('data-lng');
            openDirections(storeLat, storeLng);
        });
    });
}

// Show store profile in modal
function showStoreProfile(storeId) {
    // Sample data for stores - in a real app, you would fetch this from a database
    const store = {
        id: storeId,
        name: storeId === 'ST001' ? 'MedPlus Pharmacy' : 
              storeId === 'ST002' ? 'Apollo Pharmacy' : 
              storeId === 'ST003' ? 'LifeCare Pharmacy' : 'Wellness Pharmacy',
        address: storeId === 'ST001' ? 'Race Course Road, Vadodara' :
                storeId === 'ST002' ? 'Gotri Road, Vadodara' :
                storeId === 'ST003' ? 'Alkapuri, Vadodara' : 'Sayajigunj, Vadodara',
        contact: storeId === 'ST001' ? '(0265) 2222222' :
                storeId === 'ST002' ? '(0265) 3333333' :
                storeId === 'ST003' ? '(0265) 4444444' : '(0265) 5555555',
        email: `info@${storeId.toLowerCase()}.com`,
        website: `https://www.${storeId.toLowerCase()}.com`,
        hours: storeId === 'ST001' || storeId === 'ST003' ? '24/7' :
              storeId === 'ST002' ? '7:00 AM - 11:00 PM' : '8:00 AM - 10:00 PM',
        is24h: storeId === 'ST001' || storeId === 'ST003',
        established: storeId === 'ST001' ? '2005' :
                    storeId === 'ST002' ? '1998' :
                    storeId === 'ST003' ? '2010' : '2015',
        staff: storeId === 'ST001' ? '12' :
              storeId === 'ST002' ? '18' :
              storeId === 'ST003' ? '8' : '6',
        services: storeId === 'ST001' ? ['Prescription Filling', 'OTC Medications', 'First Aid', 'Home Delivery'] :
                 storeId === 'ST002' ? ['Prescription Filling', 'Health Checkups', 'Diabetes Care', 'Surgical Supplies'] :
                 storeId === 'ST003' ? ['Prescription Filling', 'Baby Care', 'Elderly Care', 'Emergency Medicines'] :
                 ['Homeopathic Medicines', 'Ayurvedic Products', 'Herbal Remedies'],
        specialties: storeId === 'ST001' ? ['Prescription Medications', 'Over-the-Counter Drugs', 'First Aid'] :
                    storeId === 'ST002' ? ['Diabetes Care', 'Surgical Supplies', 'Nutritional Supplements'] :
                    storeId === 'ST003' ? ['Pediatric Medications', 'Cardiac Medications', 'Dermatological Products'] :
                    ['Homeopathic Medicines', 'Ayurvedic Products', 'Herbal Supplements'],
        stock: storeId === 'ST001' ? 85 :
              storeId === 'ST002' ? 65 :
              storeId === 'ST003' ? 90 : 45,
        status: storeId === 'ST004' ? 'pending' : 'verified',
        rating: storeId === 'ST001' ? 4.7 :
               storeId === 'ST002' ? 4.3 :
               storeId === 'ST003' ? 4.8 : 4.1,
        description: storeId === 'ST001' ? 'A 24/7 pharmacy with comprehensive medication services and emergency medications available.' :
                    storeId === 'ST002' ? 'Well-stocked pharmacy with special focus on diabetes care products and surgical supplies.' :
                    storeId === 'ST003' ? 'Comprehensive pharmacy with experienced staff and wide range of medications.' :
                    'Specializes in alternative medicine with a focus on natural remedies and supplements.',
        payment: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Insurance'],
        hasEmergencyMeds: storeId !== 'ST004',
        lat: storeId === 'ST001' ? 22.3039 :
             storeId === 'ST002' ? 22.3219 :
             storeId === 'ST003' ? 22.3126 : 22.3173,
        lng: storeId === 'ST001' ? 73.1823 :
             storeId === 'ST002' ? 73.1587 :
             storeId === 'ST003' ? 73.1905 : 73.1965,
        openSince: storeId === 'ST001' ? 2005 :
                 storeId === 'ST002' ? 1998 :
                 storeId === 'ST003' ? 2010 : 2015,
        availableDoctors: storeId !== 'ST003',
        pharmacists: storeId === 'ST001' ? 4 :
                    storeId === 'ST002' ? 6 :
                    storeId === 'ST003' ? 3 : 2,
        topMedicines: storeId === 'ST001' ? ['Antibiotics', 'Cardiac', 'Diabetes', 'Pain Relief'] :
                     storeId === 'ST002' ? ['Diabetes', 'Blood Pressure', 'Nutritional', 'Surgical Supplies'] :
                     storeId === 'ST003' ? ['Pediatric', 'Cardiac', 'Dermatological', 'Emergency'] :
                     ['Homeopathic', 'Ayurvedic', 'Herbal', 'Wellness'],
        insurance: storeId === 'ST001' ? ['Star Health', 'Aditya Birla', 'HDFC ERGO', 'LIC'] :
                 storeId === 'ST002' ? ['Star Health', 'ICICI Lombard', 'New India'] :
                 storeId === 'ST003' ? ['All Major Insurance'] :
                 ['Limited Insurance Coverage'],
        homeDelivery: storeId !== 'ST004',
        diagnosticServices: storeId === 'ST001' || storeId === 'ST002',
        prescriptionRefill: storeId !== 'ST004',
        storeArea: storeId === 'ST001' ? '1800 sq.ft' :
                  storeId === 'ST002' ? '2500 sq.ft' :
                  storeId === 'ST003' ? '1200 sq.ft' : '900 sq.ft',
        busHours: storeId === 'ST001' ? 'Peak: 9 AM - 12 PM & 6 PM - 9 PM' :
                 storeId === 'ST002' ? 'Peak: 10 AM - 1 PM & 5 PM - 8 PM' :
                 storeId === 'ST003' ? 'Peak: 8 AM - 11 AM & 7 PM - 10 PM' :
                 'Peak: 11 AM - 2 PM & 4 PM - 7 PM',
        licenseNumber: `${storeId}-LP-${Math.floor(Math.random() * 9000) + 1000}-${store.established}`,
        dailyCustomers: storeId === 'ST001' ? '150-200' :
                      storeId === 'ST002' ? '200-250' :
                      storeId === 'ST003' ? '100-150' : '50-100',
        lastUpdated: storeId === 'ST001' ? '2 hours ago' :
                    storeId === 'ST002' ? '1 day ago' :
                    storeId === 'ST003' ? '3 hours ago' : '5 days ago',
        reviewHighlights: storeId === 'ST001' ? ['Excellent service', 'Always stocks needed medicines', 'Knowledgeable staff'] :
                         storeId === 'ST002' ? ['Great for diabetic supplies', 'Helpful pharmacists', 'Competitive pricing'] :
                         storeId === 'ST003' ? ['Always open when needed', 'Wide range of medicines', 'Fast service'] :
                         ['Best for natural remedies', 'Authentic ayurvedic products', 'Expert advice']
    };
    
    // Determine stock color based on level
    let stockColor = '#e74c3c'; // red for low
    if (store.stock >= 80) {
        stockColor = '#2ecc71'; // green for good
    } else if (store.stock >= 50) {
        stockColor = '#f39c12'; // orange for moderate
    }
    
    // Generate star rating
    const fullStars = Math.floor(store.rating);
    const hasHalfStar = store.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    // Generate badges for features
    let featureBadges = '';
    if (store.homeDelivery) {
        featureBadges += '<span class="feature-badge delivery"><i class="fas fa-truck"></i> Delivery</span>';
    }
    if (store.diagnosticServices) {
        featureBadges += '<span class="feature-badge diagnostics"><i class="fas fa-microscope"></i> Diagnostics</span>';
    }
    if (store.availableDoctors) {
        featureBadges += '<span class="feature-badge doctors"><i class="fas fa-user-md"></i> Doctors</span>';
    }
    if (store.prescriptionRefill) {
        featureBadges += '<span class="feature-badge refill"><i class="fas fa-prescription"></i> Refill</span>';
    }
    
    // Update modal content
    const modal = document.getElementById('store-profile-modal');
    const modalStoreName = document.getElementById('modal-store-name');
    const storeProfileContent = document.getElementById('store-profile-content');
    
    if (!modal || !modalStoreName || !storeProfileContent) return;
    
    modalStoreName.textContent = store.name;
    
    storeProfileContent.innerHTML = `
        <div class="store-profile-header">
            <div class="store-profile-banner">
                <div class="status-badge ${store.status}">${store.status === 'verified' ? 'Verified Store' : 'Verification Pending'}</div>
                ${store.is24h ? '<div class="hours-badge open-24h"><i class="fas fa-clock"></i> Open 24/7</div>' : ''}
                <div class="last-updated-badge"><i class="fas fa-sync-alt"></i> Updated ${store.lastUpdated}</div>
            </div>
            
            <div class="store-profile-info">
                <div class="store-hero">
                    <div class="store-logo-large">
                        <i class="fas fa-clinic-medical"></i>
                    </div>
                    <div class="store-basic-info">
                        <h3>${store.name}</h3>
                        <p class="store-address"><i class="fas fa-map-marker-alt"></i> ${store.address}</p>
                        <div class="store-rating-large">
                            ${starsHtml}
                            <span>${store.rating} (${Math.floor(store.rating * 10) + Math.floor(Math.random() * 20)} reviews)</span>
                        </div>
                        <div class="store-feature-badges">
                            ${featureBadges}
                        </div>
                    </div>
                </div>
                
                <div class="store-description">
                    <p>${store.description}</p>
                </div>
                
                <div class="store-contact-actions">
                    <a href="tel:${store.contact.replace(/[^0-9]/g, '')}" class="contact-action-btn">
                        <i class="fas fa-phone-alt"></i> Call
                    </a>
                    <a href="mailto:${store.email}" class="contact-action-btn">
                        <i class="fas fa-envelope"></i> Email
                    </a>
                    <a href="https://api.whatsapp.com/send?phone=${store.contact.replace(/[^0-9]/g, '')}" class="contact-action-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <a href="https://maps.google.com/?q=${store.lat},${store.lng}" class="contact-action-btn" target="_blank">
                        <i class="fas fa-directions"></i> Directions
                    </a>
                </div>
            </div>
        </div>
        
        <div class="store-profile-details">
            <div class="store-detail-section">
                <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Contact Number</div>
                        <div class="detail-value">${store.contact}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Email</div>
                        <div class="detail-value">${store.email}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Website</div>
                        <div class="detail-value"><a href="${store.website}" target="_blank">${store.website}</a></div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Operating Hours</div>
                        <div class="detail-value">${store.hours}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Established</div>
                        <div class="detail-value">${store.established} (${new Date().getFullYear() - store.established} years)</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">License Number</div>
                        <div class="detail-value">${store.licenseNumber}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Store Area</div>
                        <div class="detail-value">${store.storeArea}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Daily Customers</div>
                        <div class="detail-value">${store.dailyCustomers}</div>
                    </div>
                </div>
            </div>
            
            <div class="store-detail-section">
                <h4><i class="fas fa-users"></i> Staff & Expertise</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Staff Members</div>
                        <div class="detail-value">${store.staff} members</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Registered Pharmacists</div>
                        <div class="detail-value">${store.pharmacists} pharmacists</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Doctors Available</div>
                        <div class="detail-value">${store.availableDoctors ? 'Yes' : 'No'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Busy Hours</div>
                        <div class="detail-value">${store.busHours}</div>
                    </div>
                </div>
            </div>
            
            <div class="store-detail-section">
                <h4><i class="fas fa-pills"></i> Medicine Stock Status</h4>
                <div class="stock-indicator">
                    <div class="stock-level-label">
                        <span>Current Stock Level</span>
                        <span>${store.stock}%</span>
                    </div>
                    <div class="stock-progress-bar">
                        <div class="stock-progress" style="width: ${store.stock}%; background-color: ${stockColor};"></div>
                    </div>
                    <div class="stock-status">
                        Status: <span style="color: ${stockColor};">${store.stock >= 80 ? 'Well Stocked' : store.stock >= 50 ? 'Adequately Stocked' : 'Low Stock'}</span>
                    </div>
                </div>
                
                <h5><i class="fas fa-capsules"></i> Available Medicine Categories</h5>
                <div class="medicines-grid">
                    ${store.topMedicines.map(medicine => `
                        <div class="medicine-category">
                            <i class="fas fa-pills"></i>
                            <span>${medicine}</span>
                        </div>
                    `).join('')}
                </div>
                
                ${store.hasEmergencyMeds ? `
                <div class="emergency-medicines-info">
                    <h5><i class="fas fa-first-aid"></i> Emergency Medicines</h5>
                    <p>This store keeps a stock of emergency medications available ${store.is24h ? '24/7' : 'during operating hours'}.</p>
                </div>
                ` : `
                <div class="emergency-medicines-info no-emergency">
                    <h5><i class="fas fa-first-aid"></i> Emergency Medicines</h5>
                    <p>This store does not specialize in emergency medications.</p>
                </div>
                `}
            </div>
            
            <div class="store-detail-section">
                <h4><i class="fas fa-certificate"></i> Specialties & Services</h4>
                <div class="specialties-list">
                    ${store.specialties.map(specialty => `
                        <div class="specialty-tag">
                            <i class="fas fa-check-circle"></i>
                            <span>${specialty}</span>
                        </div>
                    `).join('')}
                </div>
                
                <h5><i class="fas fa-concierge-bell"></i> Services Offered</h5>
                <ul class="services-list">
                    ${store.services.map(service => `
                        <li><i class="fas fa-check"></i> ${service}</li>
                    `).join('')}
                </ul>
                
                <div class="delivery-info ${store.homeDelivery ? '' : 'no-delivery'}">
                    <h5><i class="fas fa-truck"></i> Home Delivery</h5>
                    <p>${store.homeDelivery ? 
                        'This store offers home delivery services. You can place orders via phone call or WhatsApp.' : 
                        'This store does not offer home delivery services currently.'}</p>
                </div>
            </div>
            
            <div class="store-detail-section">
                <h4><i class="fas fa-credit-card"></i> Payment & Insurance</h4>
                <div class="payment-methods">
                    ${store.payment.map(method => `
                        <div class="payment-method">
                            <i class="fas fa-${method.toLowerCase().includes('cash') ? 'money-bill-wave' : 
                                            method.toLowerCase().includes('credit') ? 'credit-card' : 
                                            method.toLowerCase().includes('debit') ? 'credit-card' :
                                            method.toLowerCase().includes('upi') ? 'mobile-alt' : 'file-invoice'}"></i>
                            <span>${method}</span>
                        </div>
                    `).join('')}
                </div>
                
                <h5><i class="fas fa-shield-alt"></i> Insurance Coverage</h5>
                <div class="insurance-providers">
                    ${Array.isArray(store.insurance) ? 
                        store.insurance.map(provider => `
                            <div class="insurance-provider">
                                <i class="fas fa-check-circle"></i>
                                <span>${provider}</span>
                            </div>
                        `).join('') : 
                        `<div class="insurance-provider">
                            <i class="fas fa-check-circle"></i>
                            <span>${store.insurance}</span>
                        </div>`
                    }
                </div>
            </div>
            
            <div class="store-detail-section">
                <h4><i class="fas fa-star"></i> Customer Feedback</h4>
                <div class="review-highlights">
                    ${store.reviewHighlights.map(highlight => `
                        <div class="review-highlight">
                            <i class="fas fa-quote-left"></i>
                            <span>${highlight}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Show the modal
    modal.style.display = 'block';
}

// Open directions to store
function openDirections(lat, lng) {
    // Open Google Maps directions in a new tab
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
}

// Set up event listeners for the store filters
function setupStoreFilterEvents() {
    const searchInput = document.getElementById('store-search-input');
    const filter24h = document.getElementById('filter-24h');
    const filterEmergency = document.getElementById('filter-emergency');
    const filterVerified = document.getElementById('filter-verified');
    const distanceFilter = document.getElementById('distance-filter');
    const loadMoreBtn = document.getElementById('load-more-stores');
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', filterStores);
    }
    
    // 24/7 filter
    if (filter24h) {
        filter24h.addEventListener('change', filterStores);
    }
    
    // Emergency filter
    if (filterEmergency) {
        filterEmergency.addEventListener('change', filterStores);
    }
    
    // Verified filter
    if (filterVerified) {
        filterVerified.addEventListener('change', filterStores);
    }
    
    // Distance filter
    if (distanceFilter) {
        distanceFilter.addEventListener('change', filterStores);
    }
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Add more stores
            const storeContainer = document.querySelector('.nearby-store-container');
            if (storeContainer) {
                storeContainer.innerHTML += generateStoreProfileCards();
                setupStoreProfileCardEvents();
            }
            
            // Hide the button after loading more
            this.style.display = 'none';
        });
    }
}

// Filter stores based on current filter settings
function filterStores() {
    const searchText = document.getElementById('store-search')?.value?.toLowerCase() || '';
    const verifiedOnly = document.getElementById('filter-verified')?.checked || false;
    const twentyFourHoursOnly = document.getElementById('filter-24h')?.checked || false;
    const emergencyMedsOnly = document.getElementById('filter-emergency')?.checked || false;
    
    // Get all store cards
    const storeCards = document.querySelectorAll('.store-card');
    
    storeCards.forEach(card => {
        // Get store data from card attributes
        const storeName = card.querySelector('.store-name')?.textContent?.toLowerCase() || '';
        const storeAddress = card.querySelector('.store-address')?.textContent?.toLowerCase() || '';
        const isVerified = card.getAttribute('data-verified') === 'true';
        const is24h = card.getAttribute('data-24h') === 'true';
        const hasEmergencyMeds = card.getAttribute('data-emergency') === 'true';
        
        // Search text match
        const matchesSearch = storeName.includes(searchText) || storeAddress.includes(searchText);
        
        // Verified filter
        const matchesVerified = !verifiedOnly || isVerified;
        
        // 24 hours filter
        const matches24h = !twentyFourHoursOnly || is24h;
        
        // Emergency medicines filter
        const matchesEmergency = !emergencyMedsOnly || hasEmergencyMeds;
        
        // Show/hide card based on all filters
        if (matchesSearch && matchesVerified && matches24h && matchesEmergency) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no stores match the filters
    const noResultsMessage = document.getElementById('no-results-message');
    const visibleStores = document.querySelectorAll('.store-card[style="display: flex;"]');
    
    if (visibleStores.length === 0) {
        if (!noResultsMessage) {
            const message = document.createElement('div');
            message.id = 'no-results-message';
            message.className = 'no-results';
            message.innerHTML = `
                <i class="fas fa-search"></i>
                <p>No stores match your filters.</p>
                <button id="reset-filters-btn" class="reset-btn">Reset Filters</button>
            `;
            
            const storesList = document.getElementById('stores-list');
            if (storesList) {
                storesList.appendChild(message);
                
                // Add event listener to reset button
                const resetBtn = document.getElementById('reset-filters-btn');
                if (resetBtn) {
                    resetBtn.addEventListener('click', resetFilters);
                }
            }
        }
    } else {
        // Remove no results message if it exists
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }
}

// Function to reset all filters
function resetFilters() {
    // Reset search input
    const searchInput = document.getElementById('store-search');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset checkboxes
    const verifiedCheckbox = document.getElementById('filter-verified');
    const twentyFourHoursCheckbox = document.getElementById('filter-24h');
    const emergencyMedsCheckbox = document.getElementById('filter-emergency');
    
    if (verifiedCheckbox) verifiedCheckbox.checked = false;
    if (twentyFourHoursCheckbox) twentyFourHoursCheckbox.checked = false;
    if (emergencyMedsCheckbox) emergencyMedsCheckbox.checked = false;
    
    // Re-run filter
    filterStores();
}

// Function to load stores
function loadStores() {
    const storesList = document.getElementById('stores-list');
    
    if (!storesList) return;
    
    // Clear loading indicator
    storesList.innerHTML = '';
    
    // Sample data for stores - in a real app, you would fetch this from a database
    const stores = [
        {
            id: 'ST001',
            name: 'MedPlus Pharmacy',
            address: 'Race Course Road, Vadodara',
            phone: '(0265) 2222222',
            email: 'info@st001.com',
            website: 'https://www.st001.com',
            hours: '24/7',
            is24h: true,
            established: '2005',
            staff: '12',
            status: 'verified',
            rating: 4.7,
            hasEmergencyMeds: true,
            lat: 22.3039,
            lng: 73.1823,
            openSince: 2005,
            availableDoctors: true,
            pharmacists: 4,
            topMedicines: ['Antibiotics', 'Cardiac', 'Diabetes', 'Pain Relief'],
            insurance: ['Star Health', 'Aditya Birla', 'HDFC ERGO', 'LIC'],
            homeDelivery: true,
            diagnosticServices: true,
            prescriptionRefill: true,
            lastUpdated: '2 hours ago'
        },
        {
            id: 'ST002',
            name: 'Apollo Pharmacy',
            address: 'Gotri Road, Vadodara',
            phone: '(0265) 3333333',
            email: 'info@st002.com',
            website: 'https://www.st002.com',
            hours: '7:00 AM - 11:00 PM',
            is24h: false,
            established: '1998',
            staff: '18',
            status: 'verified',
            rating: 4.3,
            hasEmergencyMeds: true,
            lat: 22.3219,
            lng: 73.1587,
            openSince: 1998,
            availableDoctors: true,
            pharmacists: 6,
            topMedicines: ['Diabetes', 'Blood Pressure', 'Nutritional', 'Surgical Supplies'],
            insurance: ['Star Health', 'ICICI Lombard', 'New India'],
            homeDelivery: true,
            diagnosticServices: true,
            prescriptionRefill: true,
            lastUpdated: '1 day ago'
        },
        {
            id: 'ST003',
            name: 'LifeCare Pharmacy',
            address: 'Alkapuri, Vadodara',
            phone: '(0265) 4444444',
            email: 'info@st003.com',
            website: 'https://www.st003.com',
            hours: '24/7',
            is24h: true,
            established: '2010',
            staff: '8',
            status: 'verified',
            rating: 4.8,
            hasEmergencyMeds: true,
            lat: 22.3126,
            lng: 73.1905,
            openSince: 2010,
            availableDoctors: false,
            pharmacists: 3,
            topMedicines: ['Pediatric', 'Cardiac', 'Dermatological', 'Emergency'],
            insurance: ['All Major Insurance'],
            homeDelivery: true,
            diagnosticServices: false,
            prescriptionRefill: true,
            lastUpdated: '3 hours ago'
        },
        {
            id: 'ST004',
            name: 'Wellness Pharmacy',
            address: 'Sayajigunj, Vadodara',
            phone: '(0265) 5555555',
            email: 'info@st004.com',
            website: 'https://www.st004.com',
            hours: '8:00 AM - 10:00 PM',
            is24h: false,
            established: '2015',
            staff: '6',
            status: 'pending',
            rating: 4.1,
            hasEmergencyMeds: false,
            lat: 22.3173,
            lng: 73.1965,
            openSince: 2015,
            availableDoctors: true,
            pharmacists: 2,
            topMedicines: ['Homeopathic', 'Ayurvedic', 'Herbal', 'Wellness'],
            insurance: ['Limited Insurance Coverage'],
            homeDelivery: false,
            diagnosticServices: false,
            prescriptionRefill: false,
            lastUpdated: '5 days ago'
        }
    ];
    
    // Generate HTML for each store
    stores.forEach(store => {
        // Determine stock color based on level
        let stockLevel = store.id === 'ST001' ? 85 : 
                        store.id === 'ST002' ? 65 :
                        store.id === 'ST003' ? 90 : 45;
        
        let stockColor = '#e74c3c'; // red for low
        if (stockLevel >= 80) {
            stockColor = '#2ecc71'; // green for good
        } else if (stockLevel >= 50) {
            stockColor = '#f39c12'; // orange for moderate
        }
        
        // Generate star rating
        const fullStars = Math.floor(store.rating);
        const hasHalfStar = store.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        // Generate feature badges
        let featureBadges = '';
        if (store.homeDelivery) {
            featureBadges += '<span class="feature-badge delivery"><i class="fas fa-truck"></i> Delivery</span>';
        }
        if (store.diagnosticServices) {
            featureBadges += '<span class="feature-badge diagnostics"><i class="fas fa-microscope"></i> Diagnostics</span>';
        }
        if (store.availableDoctors) {
            featureBadges += '<span class="feature-badge doctors"><i class="fas fa-user-md"></i> Doctors</span>';
        }
        if (store.prescriptionRefill) {
            featureBadges += '<span class="feature-badge refill"><i class="fas fa-prescription"></i> Refill</span>';
        }
        
        const storeCard = document.createElement('div');
        storeCard.className = 'store-card';
        storeCard.setAttribute('data-id', store.id);
        storeCard.setAttribute('data-verified', store.status === 'verified');
        storeCard.setAttribute('data-24h', store.is24h);
        storeCard.setAttribute('data-emergency', store.hasEmergencyMeds);
        
        storeCard.innerHTML = `
            <div class="store-icon">
                <i class="fas fa-clinic-medical"></i>
                ${store.status === 'verified' ? '<span class="verified-badge"><i class="fas fa-check-circle"></i></span>' : ''}
            </div>
            <div class="store-details">
                <div class="store-info">
                    <h4 class="store-name">${store.name}</h4>
                    <p class="store-address"><i class="fas fa-map-marker-alt"></i> ${store.address}</p>
                    <p class="store-contact">
                        <i class="fas fa-phone"></i> ${store.phone} 
                        ${store.is24h ? '<span class="hours-badge">24/7</span>' : ''}
                    </p>
                    <div class="store-rating">
                        ${starsHtml}
                        <span>${store.rating}</span>
                    </div>
                    <div class="store-feature-badges">
                        ${featureBadges}
                        <span class="last-updated"><i class="fas fa-history"></i> ${store.lastUpdated}</span>
                    </div>
                </div>
                <div class="store-stock">
                    <div class="stock-label">Medicine Stock</div>
                    <div class="stock-progress-bar">
                        <div class="stock-progress" style="width: ${stockLevel}%; background-color: ${stockColor};"></div>
                    </div>
                    <div class="stock-percentage">${stockLevel}%</div>
                </div>
                <div class="store-actions">
                    <button class="action-btn view-btn" onclick="showStoreProfile('${store.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="action-btn edit-btn">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn ${store.status === 'verified' ? 'suspend-btn' : 'approve-btn'}">
                        <i class="fas fa-${store.status === 'verified' ? 'ban' : 'check'}"></i> 
                        ${store.status === 'verified' ? 'Suspend' : 'Approve'}
                    </button>
                </div>
            </div>
            ${store.hasEmergencyMeds ? '<div class="emergency-meds"><i class="fas fa-first-aid"></i> Emergency Medicines Available</div>' : ''}
        `;
        
        storesList.appendChild(storeCard);
    });
    
    // Add event listeners for filters
    const searchInput = document.getElementById('store-search');
    const filterVerified = document.getElementById('filter-verified');
    const filter24h = document.getElementById('filter-24h');
    const filterEmergency = document.getElementById('filter-emergency');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterStores);
    }
    
    if (filterVerified) {
        filterVerified.addEventListener('change', filterStores);
    }
    
    if (filter24h) {
        filter24h.addEventListener('change', filterStores);
    }
    
    if (filterEmergency) {
        filterEmergency.addEventListener('change', filterStores);
    }
} 