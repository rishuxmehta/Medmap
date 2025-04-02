/**
 * Demo Data and Functionality
 * This file adds demo functionality to the admin dashboard to showcase features
 */

document.addEventListener('DOMContentLoaded', function() {
    initDemoFeatures();
});

/**
 * Initialize demo features
 */
function initDemoFeatures() {
    setupWelcomeNotification();
    setupDemoButtons();
    populateDemoData();
    setupRefreshButtons();
    setupActionDemos();
}

/**
 * Show welcome notification
 */
function setupWelcomeNotification() {
    setTimeout(() => {
        showNotification('Welcome to MedMap Admin Dashboard', 'info');
    }, 1000);
}

/**
 * Set up demo buttons
 */
function setupDemoButtons() {
    // Add event listeners to notification demo buttons in settings tab
    const demoButtons = {
        'demo-info-btn': { message: 'This is an information notification', type: 'info' },
        'demo-success-btn': { message: 'Operation completed successfully', type: 'success' },
        'demo-warning-btn': { message: 'Warning: Please check the settings', type: 'warning' },
        'demo-error-btn': { message: 'Error: Operation failed', type: 'error' }
    };
    
    for (const [id, data] of Object.entries(demoButtons)) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', function() {
                showNotification(data.message, data.type);
            });
        }
    }
}

/**
 * Populate demo data
 */
function populateDemoData() {
    // Populate dashboard stats with demo data
    updateDashboardCounts();
    
    // Setup additional interactive elements
    setupDemoInteractions();
}

/**
 * Update dashboard counts
 */
function updateDashboardCounts() {
    const counts = {
        'ambulances': 24,
        'hospitals': 5,
        'emergencies': 18,
        'routes': 15,
        'users': 6
    };
    
    // Update dashboard card stats
    const statElements = document.querySelectorAll('.stat-card .stat-value');
    if (statElements.length > 0) {
        // Update based on content
        statElements.forEach(element => {
            if (element.textContent.includes('Ambulances')) {
                element.textContent = counts.ambulances;
            } else if (element.textContent.includes('Hospitals')) {
                element.textContent = counts.hospitals;
            } else if (element.textContent.includes('Emergencies')) {
                element.textContent = counts.emergencies;
            }
        });
    }
}

/**
 * Set up demo interactions
 */
function setupDemoInteractions() {
    // Make pagination buttons work
    setupPagination();
    
    // Make form toggle buttons work
    setupDemoForms();
}

/**
 * Set up pagination
 */
function setupPagination() {
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        if (!btn.classList.contains('prev') && !btn.classList.contains('next')) {
            btn.addEventListener('click', function() {
                // Remove active class from all page buttons
                const siblingBtns = Array.from(this.parentNode.children);
                siblingBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show notification when page changes
                showNotification('Switched to page ' + this.textContent, 'info');
            });
        }
    });
    
    // Previous/Next buttons
    const prevBtns = document.querySelectorAll('.pagination-btn.prev');
    const nextBtns = document.querySelectorAll('.pagination-btn.next');
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pages = this.nextElementSibling;
            const activeBtn = pages.querySelector('.pagination-btn.active');
            const prevBtn = activeBtn.previousElementSibling;
            
            if (prevBtn && prevBtn.classList.contains('pagination-btn')) {
                activeBtn.classList.remove('active');
                prevBtn.classList.add('active');
                showNotification('Switched to page ' + prevBtn.textContent, 'info');
            }
        });
    });
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pages = this.previousElementSibling;
            const activeBtn = pages.querySelector('.pagination-btn.active');
            const nextBtn = activeBtn.nextElementSibling;
            
            if (nextBtn && nextBtn.classList.contains('pagination-btn')) {
                activeBtn.classList.remove('active');
                nextBtn.classList.add('active');
                showNotification('Switched to page ' + nextBtn.textContent, 'info');
            }
        });
    });
}

/**
 * Set up demo forms
 */
function setupDemoForms() {
    // Quick registration forms in settings tab
    setupQuickRegisterForms();
}

/**
 * Set up quick register forms
 */
function setupQuickRegisterForms() {
    const quickRegisterBtns = document.querySelectorAll('.quick-register-btn');
    
    quickRegisterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Handle different entity types
            if (type) {
                quickRegister(type);
            }
        });
    });
}

/**
 * Handle quick registration
 */
function quickRegister(type) {
    const entityData = {
        hospital: {
            name: 'Demo General Hospital',
            type: 'government',
            address: '123 Health Avenue, Alkapuri',
            beds: 120,
            available: 45
        },
        ambulance: {
            id: 'AMB-' + Math.floor(1000 + Math.random() * 9000),
            type: 'Type II',
            driver: 'Demo Driver'
        },
        medicalStore: {
            name: 'Demo Medical Store',
            address: '456 Pharmacy Road, Sayajigunj',
            phone: '+91 98765 43210'
        }
    };
    
    // Show success notification
    let message = '';
    
    switch(type) {
        case 'hospital':
            message = `Hospital "${entityData.hospital.name}" registered successfully`;
            // Update hospital count
            updateEntityCount('hospitals');
            break;
        case 'ambulance':
            message = `Ambulance "${entityData.ambulance.id}" registered successfully`;
            // Update ambulance count
            updateEntityCount('ambulances');
            break;
        case 'medicalStore':
            message = `Medical Store "${entityData.medicalStore.name}" registered successfully`;
            // Update medical stores count
            updateEntityCount('stores');
            break;
        default:
            message = `${type} registered successfully`;
    }
    
    showNotification(message, 'success');
    
    // Update last updated timestamp
    updateLastUpdatedTimestamp();
}

/**
 * Update entity count
 */
function updateEntityCount(type) {
    // Find and update dashboard stats
    const statElements = document.querySelectorAll('.stat-card .stat-info');
    
    statElements.forEach(element => {
        const title = element.querySelector('h3');
        const value = element.querySelector('.stat-value');
        
        if (title && value) {
            if (type === 'hospitals' && title.textContent.includes('Hospitals')) {
                value.textContent = (parseInt(value.textContent) + 1).toString();
            } else if (type === 'ambulances' && title.textContent.includes('Ambulances')) {
                value.textContent = (parseInt(value.textContent) + 1).toString();
            } else if (type === 'stores' && title.textContent.includes('Stores')) {
                value.textContent = (parseInt(value.textContent) + 1).toString();
            }
        }
    });
    
    // Update section counts if they exist
    if (type === 'hospitals') {
        const totalHospitals = document.getElementById('total-hospitals');
        if (totalHospitals) {
            totalHospitals.textContent = (parseInt(totalHospitals.textContent) + 1).toString();
        }
    }
}

/**
 * Set up refresh buttons
 */
function setupRefreshButtons() {
    const refreshBtns = document.querySelectorAll('.refresh-btn');
    
    refreshBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Show loading indicator
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            // Simulate refresh delay
            setTimeout(() => {
                // Reset button
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
                this.disabled = false;
                
                // Update timestamp
                updateLastUpdatedTimestamp();
                
                // Show notification
                showNotification('Data refreshed successfully', 'success');
            }, 1000);
        });
    });
}

/**
 * Set up action demonstrations
 */
function setupActionDemos() {
    // Set up sample map actions
    setupMapDemos();
    
    // Set up view/edit/delete action buttons
    setupCardActions();
    
    // Setup mobile menu toggle
    setupMobileMenuToggle();
    
    // Setup date range pickers
    setupDateRangePickers();
    
    // Setup search functionality
    setupSearchFunctionality();
}

/**
 * Set up map demonstrations
 */
function setupMapDemos() {
    // Map control buttons
    const mapControls = {
        'show-all-ambulances': 'Showing all ambulances on map',
        'show-available': 'Showing available ambulances only',
        'show-dispatched': 'Showing dispatched ambulances only',
        'show-all-routes': 'Showing all routes on map',
        'show-traffic': 'Traffic layer toggled',
        'optimize-routes': 'Routes optimized successfully'
    };
    
    for (const [id, message] of Object.entries(mapControls)) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', function() {
                showNotification(message, 'info');
            });
        }
    }
}

/**
 * Set up card action buttons
 */
function setupCardActions() {
    // Card action buttons (download, expand)
    const cardActions = document.querySelectorAll('.card-action');
    
    cardActions.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const action = icon.classList.contains('fa-download') ? 'download' : 'expand';
            
            showNotification(`${action === 'download' ? 'Downloading' : 'Expanding'} chart data`, 'info');
        });
    });
    
    // View all buttons
    const viewAllBtns = document.querySelectorAll('.view-all-btn');
    
    viewAllBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Viewing all entries', 'info');
        });
    });
}

/**
 * Set up mobile menu toggle
 */
function setupMobileMenuToggle() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const header = document.querySelector('header');
    
    if (menuToggle && header) {
        menuToggle.addEventListener('click', function() {
            header.classList.toggle('mobile-menu-active');
        });
    }
}

/**
 * Set up date range pickers
 */
function setupDateRangePickers() {
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const applyBtn = document.querySelector('.apply-btn');
    
    if (startDate && endDate && applyBtn) {
        // Set default values (current week)
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        
        startDate.valueAsDate = lastWeek;
        endDate.valueAsDate = today;
        
        applyBtn.addEventListener('click', function() {
            if (startDate.value && endDate.value) {
                showNotification(`Date range applied: ${startDate.value} to ${endDate.value}`, 'success');
                updateLastUpdatedTimestamp();
            } else {
                showNotification('Please select both start and end dates', 'warning');
            }
        });
    }
}

/**
 * Set up search functionality
 */
function setupSearchFunctionality() {
    const searchInputs = document.querySelectorAll('.search-box input');
    
    searchInputs.forEach(input => {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                
                if (searchTerm) {
                    showNotification(`Searching for: ${searchTerm}`, 'info');
                    
                    // Find parent tab
                    const parentTab = this.closest('.admin-tab');
                    if (parentTab) {
                        const tabName = parentTab.id.replace('-tab', '');
                        searchDemo(tabName, searchTerm);
                    }
                }
            }
        });
    });
}

/**
 * Demo search functionality
 */
function searchDemo(tabName, searchTerm) {
    // Get table rows in the tab
    const tableRows = document.querySelectorAll(`#${tabName}-tab .data-table tbody tr`);
    
    if (tableRows.length > 0) {
        // Simple filter by checking if text content includes search term
        let matchCount = 0;
        
        tableRows.forEach(row => {
            const textContent = row.textContent.toLowerCase();
            if (textContent.includes(searchTerm.toLowerCase())) {
                row.style.display = '';
                matchCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        showNotification(`Found ${matchCount} matching ${tabName} records`, 'success');
    }
}

// Ensure demo-specific functions don't break if core functions aren't available
if (typeof showNotification !== 'function') {
    window.showNotification = function(message, type = 'info') {
        console.log(`[${type}] ${message}`);
        
        // Create basic notification if the core one isn't loaded yet
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
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
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        notificationContainer.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                notification.classList.add('hide');
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    };
}

if (typeof updateLastUpdatedTimestamp !== 'function') {
    window.updateLastUpdatedTimestamp = function() {
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
    };
} 