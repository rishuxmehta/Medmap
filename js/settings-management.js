// Settings Management Module

/**
 * Initialize settings management
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsManagement();
});

/**
 * Initialize all settings management functionality
 */
function initializeSettingsManagement() {
    // Get the settings form
    const settingsForm = document.getElementById('system-settings-form');
    if (settingsForm) {
        // Add admin details section if it doesn't exist already
        addAdminDetailsSection();
        
        // Set up form submission handling
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
        
        // Set up reset button functionality
        const resetBtn = settingsForm.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function(e) {
                if (confirm('Are you sure you want to reset all settings to default values?')) {
                    resetSettings();
                }
            });
        }
        
        // Set up password visibility toggles
        setupPasswordToggles();
        
        // Load saved settings
        loadSavedSettings();
    }
}

/**
 * Add admin details section to settings form
 */
function addAdminDetailsSection() {
    // Check if admin details section already exists
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
        </div>
    `;
    
    // Insert before form actions
    const formActions = settingsContainer.querySelector('.form-actions');
    if (formActions) {
        settingsContainer.insertBefore(adminSection, formActions);
    } else {
        settingsContainer.appendChild(adminSection);
    }
}

/**
 * Set up password visibility toggles
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
            theme: document.getElementById('admin-theme')?.value || 'dark'
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
        } else {
            showNotification('Passwords do not match', 'error');
            return; // Don't show success message
        }
    } else {
        showNotification('Settings saved successfully', 'success');
    }
    
    // Apply theme if changed
    applyTheme(settings.admin.theme);
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
        if (document.getElementById('default-latitude')) {
            document.getElementById('default-latitude').value = settings.map?.defaultLatitude || '22.3072';
            document.getElementById('default-longitude').value = settings.map?.defaultLongitude || '73.1812';
            document.getElementById('default-zoom').value = settings.map?.defaultZoom || '13';
            document.getElementById('map-provider').value = settings.map?.mapProvider || 'osm';
            document.getElementById('map-style').value = settings.map?.mapStyle || 'standard';
        }
        
        // Ambulance settings
        if (document.getElementById('ambulance-refresh-rate')) {
            document.getElementById('ambulance-refresh-rate').value = settings.ambulance?.refreshRate || '10';
            document.getElementById('ambulance-idle-timeout').value = settings.ambulance?.idleTimeout || '15';
            document.getElementById('available-color').value = settings.ambulance?.availableColor || '#2ecc71';
            document.getElementById('dispatched-color').value = settings.ambulance?.dispatchedColor || '#f39c12';
            document.getElementById('maintenance-color').value = settings.ambulance?.maintenanceColor || '#e74c3c';
            document.getElementById('auto-dispatch').checked = settings.ambulance?.autoDispatch || false;
        }
        
        // Hospital settings
        if (document.getElementById('capacity-warning')) {
            document.getElementById('capacity-warning').value = settings.hospital?.capacityWarning || '75';
            document.getElementById('capacity-critical').value = settings.hospital?.capacityCritical || '90';
            document.getElementById('hospital-refresh-rate').value = settings.hospital?.refreshRate || '5';
            document.getElementById('auto-redirect').checked = settings.hospital?.autoRedirect || false;
        }
        
        // System settings
        if (document.getElementById('emergency-timeout')) {
            document.getElementById('emergency-timeout').value = settings.system?.emergencyTimeout || '60';
            document.getElementById('notification-sound').value = settings.system?.notificationSound || 'alert1';
            document.getElementById('ai-optimization').checked = settings.system?.aiOptimization || false;
            document.getElementById('data-analytics').checked = settings.system?.dataAnalytics || false;
        }
        
        // Admin settings (if elements exist)
        if (document.getElementById('admin-name')) {
            document.getElementById('admin-name').value = settings.admin?.name || 'Admin User';
            document.getElementById('admin-email').value = settings.admin?.email || 'admin@medmap.org';
            document.getElementById('admin-phone').value = settings.admin?.phone || '+91 9876543210';
            document.getElementById('admin-position').value = settings.admin?.position || 'System Administrator';
            document.getElementById('admin-language').value = settings.admin?.language || 'en';
            document.getElementById('admin-theme').value = settings.admin?.theme || 'dark';
        }
        
        // Apply theme
        applyTheme(settings.admin?.theme || 'dark');
        
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
 * Show notification to the user
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    // Create container if it doesn't exist
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add appropriate icon
    let icon = 'info-circle';
    switch (type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'exclamation-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
    }
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Setup close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.classList.add('dismissing');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
            
            // Remove container if empty
            if (notificationContainer.children.length === 0) {
                document.body.removeChild(notificationContainer);
            }
        }, 300);
    });
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('dismissing');
            setTimeout(() => {
                if (notification.parentNode) {
                    notificationContainer.removeChild(notification);
                    
                    // Remove container if empty
                    if (notificationContainer.children.length === 0 && notificationContainer.parentNode) {
                        document.body.removeChild(notificationContainer);
                    }
                }
            }, 300);
        }
    }, 5000);
}
