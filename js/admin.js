/**
 * Smart Ambulance Routing System
 * Admin Panel Functionality
 */

/**
 * Initialize the admin panel
 */
function initAdminPanel() {
    console.log('Initializing admin panel');
    
    // Set up sidebar navigation
    setupSidebarNav();
    
    // Set up admin dashboard
    setupAdminDashboard();
    
    // Initialize charts
    initCharts();
    
    // Set up date range pickers
    setupDateRange();
    
    // Load active emergencies
    loadActiveEmergencies();
    
    // Set up ambulance management
    setupAmbulanceManagement();
    
    // Set up hospital management
    setupHospitalManagement();
    
    // Set up user management
    setupUserManagement();
    
    // Set up settings management
    setupSettingsManagement();
    
    // Set up emergency management
    setupEmergencyManagement();
    
    // Set up route management
    setupRouteManagement();
    
    // Set up modals
    setupModals();
    
    // Set up mobile sidebar toggle
    setupMobileSidebar();
    
    // Set up location buttons
    setupLocationButtons();
    
    // Initialize ambulance locations dashboard
    initAmbulanceLocationsDashboard();
    
    // Initialize maps
    setTimeout(() => {
        // Add a small delay to ensure DOM is fully loaded
        try {
            if (document.getElementById('admin-overview-map')) {
                // Initialize admin overview map
                const adminMap = L.map('admin-overview-map', {
                    center: [22.3072, 73.1812], // Vadodara, India
                    zoom: 12
                });
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(adminMap);
            }
            
            if (document.getElementById('ambulance-map')) {
                initAmbulanceMap();
            }
            
            if (document.getElementById('route-map')) {
                initRouteMap();
            }
        } catch (e) {
            console.error('Error initializing maps:', e);
        }
    }, 500);
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
    const addAmbulanceModal = document.getElementById('add-ambulance-modal');
    const addAmbulanceBtn = document.getElementById('add-ambulance-btn');
    const closeModal = addAmbulanceModal.querySelector('.close-modal');
    const cancelBtn = addAmbulanceModal.querySelector('.cancel-btn');
    const ambulanceForm = document.getElementById('add-ambulance-form');
    const refreshBtn = document.getElementById('refresh-ambulances-btn');
    
    // Tab navigation for ambulance form
    const formTabs = ambulanceForm.querySelectorAll('.form-tab');
    const formTabContents = ambulanceForm.querySelectorAll('.form-tab-content');
    const nextTabBtn = document.getElementById('next-tab-ambulance');
    const prevTabBtn = document.getElementById('prev-tab-ambulance');
    const submitBtn = ambulanceForm.querySelector('button[type="submit"]');
    
    let currentTabIndex = 0;
    
    // Function to show a specific tab
    function showTab(index) {
        formTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        formTabContents.forEach((content, i) => {
            if (i === index) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update progress bar
        const progressSegments = ambulanceForm.querySelectorAll('.progress-segment');
        progressSegments.forEach((segment, i) => {
            if (i <= index) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
        
        // Show/hide navigation buttons
        if (index === 0) {
            prevTabBtn.style.display = 'none';
        } else {
            prevTabBtn.style.display = 'block';
        }
        
        if (index === formTabs.length - 1) {
            nextTabBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextTabBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Tab click event
    formTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            showTab(index);
        });
    });
    
    // Next button click
    nextTabBtn.addEventListener('click', () => {
        if (validateCurrentTab()) {
            if (currentTabIndex < formTabs.length - 1) {
                showTab(currentTabIndex + 1);
            }
        }
    });
    
    // Previous button click
    prevTabBtn.addEventListener('click', () => {
        if (currentTabIndex > 0) {
            showTab(currentTabIndex - 1);
        }
    });
    
    // Validate current tab
    function validateCurrentTab() {
        let isValid = true;
        const currentTab = formTabContents[currentTabIndex];
        
        // Get all required inputs in the current tab
        const requiredInputs = currentTab.querySelectorAll('input[required], select[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('input-error');
                showNotification('Please fill all required fields marked with *', 'error');
            } else {
                input.classList.remove('input-error');
            }
        });
        
        // Specific validations based on tab
        if (currentTabIndex === 0) { // Basic Info tab
            const ambulanceId = document.getElementById('ambulance-id');
            if (ambulanceId.value && !/^AMB-\d{4}$/.test(ambulanceId.value)) {
                isValid = false;
                ambulanceId.classList.add('input-error');
                showNotification('Ambulance ID should be in format AMB-XXXX (e.g., AMB-1234)', 'error');
            }
            
            const registrationNo = document.getElementById('ambulance-registration');
            if (registrationNo.value && !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(registrationNo.value)) {
                isValid = false;
                registrationNo.classList.add('input-error');
                showNotification('Vehicle Registration should be in a valid format (e.g., MH02AB1234)', 'error');
            }
        } else if (currentTabIndex === 2) { // Staff tab
            const driverPhone = document.getElementById('driver-phone');
            if (driverPhone.value && !/^[0-9]{10}$/.test(driverPhone.value)) {
                isValid = false;
                driverPhone.classList.add('input-error');
                showNotification('Phone number should be a 10-digit number', 'error');
            }
        }
        
        return isValid;
    }

    // Handle form input events to remove error class
    ambulanceForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
    });

    // Initialize map for location selection
    const mapPickerBtn = document.getElementById('show-map-picker-ambulance');
    const mapPreview = document.getElementById('ambulance-map-preview');
    let mapInstance = null;
    
    if (mapPickerBtn && mapPreview) {
        mapPickerBtn.addEventListener('click', () => {
            // Initialize map if not already done
            if (!mapInstance) {
                // Check if Leaflet is available
                if (typeof L !== 'undefined') {
                    mapInstance = L.map(mapPreview).setView([22.3072, 73.1812], 12); // Vadodara coordinates
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(mapInstance);
                    
                    // Add marker for ambulance location
                    const ambulanceMarker = L.marker([22.3072, 73.1812], {
                        draggable: true
                    }).addTo(mapInstance);
                    
                    // Update coordinates on marker drag
                    ambulanceMarker.on('dragend', function(event) {
                        const marker = event.target;
                        const position = marker.getLatLng();
                        
                        document.getElementById('ambulance-lat').value = position.lat.toFixed(6);
                        document.getElementById('ambulance-lng').value = position.lng.toFixed(6);
                        
                        // Update route metrics (for demo)
                        updateRouteMetrics();
                    });
                    
                    // Map control buttons
                    const mapControls = document.querySelectorAll('.map-controls .map-control-btn');
                    if (mapControls.length > 0) {
                        // Zoom in
                        mapControls[0].addEventListener('click', () => {
                            mapInstance.setZoom(mapInstance.getZoom() + 1);
                        });
                        
                        // Zoom out
                        mapControls[1].addEventListener('click', () => {
                            mapInstance.setZoom(mapInstance.getZoom() - 1);
                        });
                        
                        // Center map
                        mapControls[2].addEventListener('click', () => {
                            mapInstance.setView([22.3072, 73.1812], 12);
                        });
                    }
                } else {
                    showNotification('Map library not loaded. Please check your internet connection.', 'error');
                }
            }
            
            // Get existing coordinates
            const lat = document.getElementById('ambulance-lat').value;
            const lng = document.getElementById('ambulance-lng').value;
            
            // If coordinates exist, center map on them
            if (lat && lng && mapInstance) {
                mapInstance.setView([parseFloat(lat), parseFloat(lng)], 15);
                
                // Update marker position
                const markers = mapInstance._layers;
                for (let id in markers) {
                    if (markers[id] instanceof L.Marker) {
                        markers[id].setLatLng([parseFloat(lat), parseFloat(lng)]);
                        break;
                    }
                }
            }
            
            // Scroll to the map
            mapPreview.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Use current location button
    const useCurrentLocationBtn = document.querySelector('.auto-locate[data-target="ambulance"]');
    if (useCurrentLocationBtn) {
        useCurrentLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    document.getElementById('ambulance-lat').value = position.coords.latitude.toFixed(6);
                    document.getElementById('ambulance-lng').value = position.coords.longitude.toFixed(6);
                    
                    // Update map if available
                    if (mapInstance) {
                        mapInstance.setView([position.coords.latitude, position.coords.longitude], 15);
                        
                        // Update marker position
                        const markers = mapInstance._layers;
                        for (let id in markers) {
                            if (markers[id] instanceof L.Marker) {
                                markers[id].setLatLng([position.coords.latitude, position.coords.longitude]);
                                break;
                            }
                        }
                    }
                    
                    // Update route metrics (for demo)
                    updateRouteMetrics();
                    
                    showNotification('Current location set', 'success');
                }, error => {
                    showNotification('Could not get current location: ' + error.message, 'error');
                });
            } else {
                showNotification('Geolocation is not supported by this browser', 'error');
            }
        });
    }
    
    // Use hospital location button
    const useHospitalLocationBtn = document.getElementById('use-hospital-location');
    if (useHospitalLocationBtn) {
        useHospitalLocationBtn.addEventListener('click', () => {
            const selectedHospital = document.getElementById('ambulance-hospital').value;
            
            // Hospital coordinates (approximate for Vadodara hospitals)
            const hospitalCoordinates = {
                'SSG Hospital': [22.3217, 73.1851],
                'Bhailal Amin General Hospital': [22.3003, 73.1759],
                'Baroda Medical College Hospital': [22.3144, 73.1932],
                'Kailash Cancer Hospital': [22.3003, 73.1759],
                'Sterling Hospital': [22.3119, 73.1723]
            };
            
            if (selectedHospital && hospitalCoordinates[selectedHospital]) {
                const [lat, lng] = hospitalCoordinates[selectedHospital];
                document.getElementById('ambulance-lat').value = lat.toFixed(6);
                document.getElementById('ambulance-lng').value = lng.toFixed(6);
                
                // Update map if available
                if (mapInstance) {
                    mapInstance.setView([lat, lng], 15);
                    
                    // Update marker position
                    const markers = mapInstance._layers;
                    for (let id in markers) {
                        if (markers[id] instanceof L.Marker) {
                            markers[id].setLatLng([lat, lng]);
                            break;
                        }
                    }
                }
                
                // Update route metrics (for demo)
                updateRouteMetrics();
                
                showNotification('Hospital location set', 'success');
            } else {
                showNotification('Please select a hospital first', 'warning');
            }
        });
    }
    
    // Function to update route metrics for demo purposes
    function updateRouteMetrics() {
        const routeMetrics = document.querySelectorAll('.route-metric .metric-value');
        if (routeMetrics.length >= 4) {
            // Random travel time between 8 and 15 minutes
            routeMetrics[0].textContent = Math.floor(Math.random() * 8) + 8 + ' mins';
            
            // Random distance between 3 and 7 km
            routeMetrics[1].textContent = (Math.floor(Math.random() * 40) / 10 + 3).toFixed(1) + ' km';
            
            // Random response time between 6 and 10 minutes
            routeMetrics[2].textContent = Math.floor(Math.random() * 5) + 6 + ' mins';
            
            // Traffic condition
            const trafficConditions = ['Good', 'Moderate', 'Heavy'];
            const randomCondition = trafficConditions[Math.floor(Math.random() * 3)];
            routeMetrics[3].textContent = randomCondition;
            
            // Update class for color coding
            routeMetrics[3].className = 'metric-value';
            if (randomCondition === 'Good') routeMetrics[3].classList.add('status-good');
            if (randomCondition === 'Moderate') routeMetrics[3].classList.add('status-warning');
            if (randomCondition === 'Heavy') routeMetrics[3].classList.add('status-danger');
        }
    }
    
    // Document upload functionality
    const uploadButtons = document.querySelectorAll('.upload-btn');
    uploadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*,.pdf,.doc,.docx';
            
            fileInput.addEventListener('change', function() {
                if (fileInput.files.length > 0) {
                    const fileName = fileInput.files[0].name;
                    button.innerHTML = `<i class="fas fa-check"></i> ${fileName}`;
                    button.style.backgroundColor = '#e6f7ee';
                    button.style.borderColor = '#2ed573';
                    button.style.color = '#2ed573';
                }
            });
            
            fileInput.click();
        });
    });
    
    // Initialize document validity dates
    const validityDates = document.querySelectorAll('.document-validity .mini-date');
    validityDates.forEach(dateInput => {
        // Set default expiry date to one year from now
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        dateInput.valueAsDate = oneYearFromNow;
        
        // Add event listener to highlight expired dates
        dateInput.addEventListener('change', function() {
            const today = new Date();
            const expiryDate = new Date(this.value);
            
            if (expiryDate < today) {
                this.classList.add('expired-date');
                this.parentElement.classList.add('expired');
            } else {
                this.classList.remove('expired-date');
                this.parentElement.classList.remove('expired');
            }
        });
    });
    
    if (addAmbulanceBtn) {
        addAmbulanceBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'block';
            // Reset the form and show first tab
            ambulanceForm.reset();
            showTab(0);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (ambulanceForm) {
        ambulanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab()) {
                return;
            }
            
            // Collect data from the form
            const ambulanceData = {
                id: document.getElementById('ambulance-id').value,
                registration: document.getElementById('ambulance-registration').value,
                type: document.getElementById('ambulance-type').value,
                make: document.getElementById('ambulance-make').value,
                year: document.getElementById('ambulance-year').value,
                vin: document.getElementById('ambulance-vin')?.value || '',
                capacity: document.getElementById('ambulance-capacity').value,
                fuelType: document.getElementById('ambulance-fuel-type').value,
                status: document.getElementById('ambulance-status').value,
                
                // Vehicle details
                insurance: document.getElementById('ambulance-insurance').value,
                lastService: document.getElementById('ambulance-last-service').value,
                nextService: document.getElementById('ambulance-next-service').value,
                mileage: document.getElementById('ambulance-mileage').value,
                
                // Equipment
                equipment: {
                    // Basic equipment
                    firstAid: document.getElementById('equipment-first-aid').checked,
                    oxygen: document.getElementById('equipment-oxygen').checked,
                    stretcher: document.getElementById('equipment-stretcher').checked,
                    wheelchair: document.getElementById('equipment-wheelchair').checked,
                    
                    // Advanced equipment
                    aed: document.getElementById('equipment-aed').checked,
                    ventilator: document.getElementById('equipment-ventilator').checked,
                    ecg: document.getElementById('equipment-ecg').checked,
                    suction: document.getElementById('equipment-suction').checked,
                    infusion: document.getElementById('equipment-infusion').checked,
                    oximeter: document.getElementById('equipment-oximeter').checked,
                    
                    // Other equipment
                    other: document.getElementById('equipment-others').value,
                    
                    // Medication
                    medication: document.getElementById('equipment-medication').value,
                    
                    // New equipment fields with quantities
                    oxygenQuantity: document.getElementById('oxygen-quantity')?.value || '1',
                    stretcherType: document.getElementById('stretcher-type')?.value || 'Standard',
                    ventilatorType: document.getElementById('ventilator-type')?.value || 'Standard',
                },
                
                // Staff information
                driver: {
                    name: document.getElementById('driver-name').value,
                    phone: document.getElementById('driver-phone').value,
                    license: document.getElementById('driver-license').value,
                    licenseExpiry: document.getElementById('driver-license-expiry').value,
                    age: document.getElementById('driver-age')?.value || '',
                    experience: document.getElementById('driver-experience')?.value || '',
                    shift: document.getElementById('driver-shift')?.value || '',
                    address: document.getElementById('driver-address')?.value || '',
                },
                
                paramedic: {
                    name: document.getElementById('paramedic-name').value,
                    phone: document.getElementById('paramedic-phone').value,
                    qualification: document.getElementById('paramedic-qualification')?.value || '',
                    experience: document.getElementById('paramedic-experience')?.value || '',
                    license: document.getElementById('paramedic-license')?.value || '',
                    shift: document.getElementById('paramedic-shift')?.value || '',
                    emergencyContact: document.getElementById('paramedic-emergency-contact')?.value || '',
                    specializations: Array.from(document.getElementById('paramedic-specializations')?.selectedOptions || [])
                        .map(option => option.value),
                },
                
                additionalStaff: document.getElementById('additional-staff').value,
                
                // Maintenance information
                maintenance: {
                    type: document.getElementById('maintenance-type')?.value || '',
                    intervalKm: document.getElementById('maintenance-interval-km')?.value || '',
                    intervalDays: document.getElementById('maintenance-interval-days')?.value || '',
                    vendor: document.getElementById('maintenance-vendor')?.value || '',
                    notes: document.getElementById('maintenance-notes')?.value || '',
                },
                
                // Documentation
                documents: {
                    registration: {
                        status: document.getElementById('doc-registration')?.checked || false,
                        validity: document.getElementById('doc-registration')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    insurance: {
                        status: document.getElementById('doc-insurance')?.checked || false,
                        validity: document.getElementById('doc-insurance')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    fitness: {
                        status: document.getElementById('doc-fitness')?.checked || false,
                        validity: document.getElementById('doc-fitness')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    pollution: {
                        status: document.getElementById('doc-pollution')?.checked || false,
                        validity: document.getElementById('doc-pollution')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    permit: {
                        status: document.getElementById('doc-permit')?.checked || false,
                        validity: document.getElementById('doc-permit')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    tax: {
                        status: document.getElementById('doc-tax')?.checked || false,
                        validity: document.getElementById('doc-tax')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    notes: document.getElementById('documentation-notes')?.value || '',
                },
                
                // Location information
                location: {
                    hospital: document.getElementById('ambulance-hospital')?.value || '',
                    baseLocation: document.getElementById('ambulance-base-location')?.value || '',
                    serviceArea: document.getElementById('ambulance-service-area')?.value || '',
                    responseRadius: document.getElementById('ambulance-response-radius')?.value || '',
                    distanceLimit: document.getElementById('distance-limit-daily')?.value || '',
                    coverageArea: document.getElementById('coverage-area')?.value || '',
                    currentLocation: {
                        lat: document.getElementById('ambulance-lat')?.value || '',
                        lng: document.getElementById('ambulance-lng')?.value || '',
                    }
                },
                
                timestamp: Date.now()
            };
            
            // For demonstration, show the data in a notification
            console.log('Ambulance Data:', ambulanceData);
            
            // Save to localStorage (or send to server in production)
            const ambulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
            ambulances.push(ambulanceData);
            localStorage.setItem('ambulances', JSON.stringify(ambulances));
            
            // Close modal and show success notification
            addAmbulanceModal.style.display = 'none';
            showNotification('Ambulance added successfully!', 'success');
            
            // Refresh the ambulance list
            loadAmbulances();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // In a real scenario, this would fetch from API
            // For demo, we'll just show a notification
            showNotification('Ambulance list refreshed', 'info');
        });
    }

    // Add sample ambulances for demo
    addDemoAmbulances();
}

function addAmbulanceToTable(ambulanceData) {
    const ambulanceTable = document.querySelector('.ambulance-table tbody');
    
    if (!ambulanceTable) return;
    
    const newRow = document.createElement('tr');
    newRow.classList.add('new-row-highlight');
    
    // Create cells with ambulance data
    newRow.innerHTML = `
        <td>${ambulanceData.id}</td>
        <td>${getAmbulanceTypeLabel(ambulanceData.type)}</td>
        <td>${ambulanceData.driver.name || 'N/A'}</td>
        <td>${ambulanceData.baseLocation}</td>
        <td>${ambulanceData.status ? capitalizeFirstLetter(ambulanceData.status) : 'Unknown'}</td>
        <td>
            <div class="action-buttons">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
                <button class="view-btn"><i class="fas fa-eye"></i></button>
            </div>
        </td>
    `;
    
    // Add event listeners for the action buttons
    const editBtn = newRow.querySelector('.edit-btn');
    const deleteBtn = newRow.querySelector('.delete-btn');
    const viewBtn = newRow.querySelector('.view-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showNotification('Edit functionality coming soon', 'info');
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            newRow.classList.add('delete-animation');
            setTimeout(() => {
                ambulanceTable.removeChild(newRow);
                showNotification('Ambulance removed successfully', 'success');
            }, 500);
        });
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            showNotification('View details functionality coming soon', 'info');
        });
    }
    
    // Add to table and remove highlight after animation
    ambulanceTable.appendChild(newRow);
    setTimeout(() => {
        newRow.classList.remove('new-row-highlight');
    }, 3000);
}

function getAmbulanceTypeLabel(type) {
    const types = {
        'type1': 'Type I (Basic)',
        'type2': 'Type II (Mobile Emergency)',
        'type3': 'Type III (Advanced Life Support)',
        'type4': 'Mobile ICU',
        'neonatal': 'Neonatal',
        'mortuary': 'Mortuary'
    };
    
    return types[type] || 'Unknown Type';
}

function addDemoAmbulances() {
    const ambulances = [
        {
            id: 'AMB-1001',
            registration: 'GJ06AB1234',
            type: 'type2',
            make: 'Tata Winger',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Rajesh Kumar',
                phone: '9876543210'
            },
            baseLocation: 'SSG Hospital',
            hospital: 'SSG Hospital'
        },
        {
            id: 'AMB-1002',
            registration: 'GJ06CD5678',
            type: 'type3',
            make: 'Force Traveller',
            year: '2021',
            capacity: '3',
            fuelType: 'diesel',
            status: 'dispatched',
            driver: {
                name: 'Suresh Patel',
                phone: '9876543211'
            },
            baseLocation: 'Bhailal Amin General Hospital',
            hospital: 'Bhailal Amin General Hospital'
        },
        {
            id: 'AMB-1003',
            registration: 'GJ06EF9012',
            type: 'type4',
            make: 'Tata Winger',
            year: '2023',
            capacity: '1',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Amit Singh',
                phone: '9876543212'
            },
            baseLocation: 'Sterling Hospital',
            hospital: 'Sterling Hospital'
        },
        {
            id: 'AMB-1004',
            registration: 'GJ06GH3456',
            type: 'neonatal',
            make: 'Force Traveller',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'maintenance',
            driver: {
                name: 'Dinesh Shah',
                phone: '9876543213'
            },
            baseLocation: 'Baroda Medical College Hospital',
            hospital: 'Baroda Medical College Hospital'
        }
    ];
    
    ambulances.forEach(ambulance => {
        addAmbulanceToTable(ambulance);
    });
}

/**
 * Set up hospital management
 */
function setupHospitalManagement() {
    // Add hospital button
    const addHospitalBtn = document.getElementById('add-hospital-btn');
    if (addHospitalBtn) {
        addHospitalBtn.addEventListener('click', () => {
            // Show the add hospital form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'block';
                
                // Add tooltips to form fields for better guidance
                addFormTooltips();
                
                // Add dynamic field interactions
                setupDynamicFormFields();
                
                // Scroll to the form
                formContainer.scrollIntoView({ behavior: 'smooth' });
                showNotification('Please fill in the hospital details', 'info');
            }
        });
    }
    
    // Handle form submission
    const hospitalForm = document.getElementById('add-hospital-form');
    if (hospitalForm) {
        hospitalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!validateHospitalForm()) {
                showNotification('Please correct the errors in the form', 'error');
                return;
            }
            
            // Get all the form values
            const hospitalName = document.getElementById('hospital-name').value;
            const hospitalType = document.getElementById('hospital-type').value;
            const hospitalAddress = document.getElementById('hospital-address').value;
            const hospitalArea = document.getElementById('hospital-area').value;
            const hospitalCity = document.getElementById('hospital-city').value;
            const hospitalPincode = document.getElementById('hospital-pincode').value;
            
            const hospitalPhone = document.getElementById('hospital-phone').value;
            const hospitalEmergencyPhone = document.getElementById('hospital-emergency-phone').value;
            const hospitalEmail = document.getElementById('hospital-email').value;
            const hospitalWebsite = document.getElementById('hospital-website').value;
            
            const hospitalBedsTotal = document.getElementById('hospital-beds-total').value;
            const hospitalBedsAvailable = document.getElementById('hospital-beds-available').value;
            const hospitalICUBeds = document.getElementById('hospital-icu-beds')?.value || 0;
            const hospitalVentilators = document.getElementById('hospital-ventilators')?.value || 0;
            const hospitalWaitTime = document.getElementById('hospital-wait-time').value;
            
            const hospitalLat = document.getElementById('hospital-lat').value;
            const hospitalLng = document.getElementById('hospital-lng').value;
            
            // Get specialty information
            const hospitalSpecialties = document.getElementById('hospital-specialties').value;
            const hospitalEmergency = document.getElementById('hospital-emergency')?.checked || false;
            const hospitalTraumaCenter = document.getElementById('hospital-trauma-center')?.checked || false;
            const hospitalBloodBank = document.getElementById('hospital-blood-bank')?.checked || false;
            const hospital24x7 = document.getElementById('hospital-24x7')?.checked || false;
            
            // Check required fields
            if (!hospitalName || !hospitalAddress || !hospitalBedsTotal || !hospitalBedsAvailable || !hospitalWaitTime) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Calculate capacity percentage
            const totalBeds = parseInt(hospitalBedsTotal);
            const availableBeds = parseInt(hospitalBedsAvailable);
            const capacityPercentage = Math.round(((totalBeds - availableBeds) / totalBeds) * 100);
            
            // Determine status based on capacity
            let status = 'Available';
            if (capacityPercentage >= 90) {
                status = 'Critical';
            } else if (capacityPercentage >= 75) {
                status = 'High Load';
            }
            
            // Construct full address
            const fullAddress = `${hospitalAddress}, ${hospitalArea ? hospitalArea + ', ' : ''}${hospitalCity}${hospitalPincode ? ', ' + hospitalPincode : ''}`;
            
            // Create a rich hospital object with all details
            const hospitalData = {
                name: hospitalName,
                type: hospitalType,
                address: fullAddress,
                capacity: {
                    percentage: capacityPercentage,
                    available: availableBeds,
                    total: totalBeds,
                    icu: hospitalICUBeds,
                    ventilators: hospitalVentilators
                },
                contact: {
                    phone: hospitalPhone,
                    emergency: hospitalEmergencyPhone,
                    email: hospitalEmail,
                    website: hospitalWebsite
                },
                location: {
                    lat: hospitalLat,
                    lng: hospitalLng
                },
                services: {
                    specialties: hospitalSpecialties,
                    emergency: hospitalEmergency,
                    traumaCenter: hospitalTraumaCenter,
                    bloodBank: hospitalBloodBank,
                    open24x7: hospital24x7
                },
                waitTime: hospitalWaitTime + ' mins',
                status: status
            };
            
            // Add the hospital to the table
            addHospitalToTable(hospitalData);
            
            // Show confirmation with more details
            showNotification(`Hospital "${hospitalName}" has been added successfully with ${totalBeds} beds`, 'success');
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Hide the form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
            
            // Reset the form
            hospitalForm.reset();
        });
    }
    
    // Set up form toggle buttons
    const toggleFormBtns = document.querySelectorAll('.toggle-form');
    toggleFormBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const formContainer = document.getElementById(targetId + '-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
        });
    });
    
    // Set up hospital action buttons
    setupHospitalActionButtons();
}

/**
 * Add tooltips to hospital form fields
 */
function addFormTooltips() {
    // Add tooltips to form fields to provide guidance
    const tooltips = {
        'hospital-name': 'Enter the official name of the hospital',
        'hospital-type': 'Select the type of hospital (Government, Private, etc.)',
        'hospital-address': 'Enter the street address of the hospital',
        'hospital-area': 'Enter the area or locality name',
        'hospital-city': 'Enter the city name',
        'hospital-pincode': 'Enter the 6-digit PIN code',
        'hospital-phone': 'Enter the main contact number with country code',
        'hospital-emergency-phone': 'Enter emergency contact number',
        'hospital-email': 'Enter official email address',
        'hospital-website': 'Enter complete website URL including https://',
        'hospital-beds-total': 'Enter total number of beds in the hospital',
        'hospital-beds-available': 'Enter number of currently available beds',
        'hospital-icu-beds': 'Enter number of ICU beds',
        'hospital-ventilators': 'Enter number of ventilators available',
        'hospital-ambulances': 'Enter number of ambulances operated by the hospital',
        'hospital-wait-time': 'Enter average emergency wait time in minutes',
        'hospital-specialties': 'Enter medical specialties separated by commas',
        'hospital-lat': 'Enter latitude coordinate (use buttons below to get coordinates)',
        'hospital-lng': 'Enter longitude coordinate (use buttons below to get coordinates)'
    };
    
    // Apply tooltips to elements
    for (const [id, tooltip] of Object.entries(tooltips)) {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('title', tooltip);
            
            // Add input validation feedback
            if (element.hasAttribute('required')) {
                element.addEventListener('input', () => {
                    if (element.value.trim() === '') {
                        element.classList.add('input-error');
                    } else {
                        element.classList.remove('input-error');
                    }
                });
            }
        }
    }
}

/**
 * Setup dynamic form field interactions
 */
function setupDynamicFormFields() {
    // Add interactions between related fields
    
    // Update available beds validation to be less than total beds
    const totalBedsInput = document.getElementById('hospital-beds-total');
    const availableBedsInput = document.getElementById('hospital-beds-available');
    
    if (totalBedsInput && availableBedsInput) {
        totalBedsInput.addEventListener('input', () => {
            const totalBeds = parseInt(totalBedsInput.value) || 0;
            availableBedsInput.setAttribute('max', totalBeds);
            
            // Validate available beds against total beds
            const availableBeds = parseInt(availableBedsInput.value) || 0;
            if (availableBeds > totalBeds) {
                availableBedsInput.value = totalBeds;
            }
        });
    }
    
    // Update hospital type dependent fields
    const hospitalTypeSelect = document.getElementById('hospital-type');
    if (hospitalTypeSelect) {
        hospitalTypeSelect.addEventListener('change', () => {
            const type = hospitalTypeSelect.value;
            
            // Show/hide fields based on hospital type
            const traumaCenterCheckbox = document.getElementById('hospital-trauma-center');
            if (traumaCenterCheckbox) {
                if (type === 'government' || type === 'speciality') {
                    traumaCenterCheckbox.parentElement.style.display = 'block';
                } else {
                    traumaCenterCheckbox.checked = false;
                    traumaCenterCheckbox.parentElement.style.display = 'none';
                }
            }
            
            // Update placeholders for specialties based on type
            const specialtiesInput = document.getElementById('hospital-specialties');
            if (specialtiesInput) {
                if (type === 'speciality') {
                    specialtiesInput.placeholder = 'Primary specialty (e.g. Cancer, Cardiac, Orthopedic)';
                } else {
                    specialtiesInput.placeholder = 'e.g. Cardiology, Neurology, Orthopedics';
                }
            }
        });
    }
    
    // Add coordinate fetching functionality
    const latInput = document.getElementById('hospital-lat');
    const lngInput = document.getElementById('hospital-lng');
    const autoLocateBtn = document.querySelector('.auto-locate[data-target="hospital"]');
    
    if (latInput && lngInput && autoLocateBtn) {
        // Use browser geolocation API
        autoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                autoLocateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
                autoLocateBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        latInput.value = position.coords.latitude.toFixed(6);
                        lngInput.value = position.coords.longitude.toFixed(6);
                        
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        
                        showNotification('Location updated successfully', 'success');
                        
                        // Highlight the fields to show they've been updated
                        latInput.classList.add('field-updated');
                        lngInput.classList.add('field-updated');
                        
                        setTimeout(() => {
                            latInput.classList.remove('field-updated');
                            lngInput.classList.remove('field-updated');
                        }, 2000);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        showNotification('Could not get your location. Please try again or enter manually.', 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }
}

/**
 * Validate hospital form
 * @returns {boolean} Whether the form is valid
 */
function validateHospitalForm() {
    let isValid = true;
    const requiredFields = [
        'hospital-name',
        'hospital-type',
        'hospital-address',
        'hospital-area',
        'hospital-city',
        'hospital-pincode',
        'hospital-phone',
        'hospital-email',
        'hospital-beds-total',
        'hospital-beds-available',
        'hospital-wait-time',
        'hospital-lat',
        'hospital-lng'
    ];
    
    // Check required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim() === '') {
            field.classList.add('input-error');
            isValid = false;
            
            // Add error message below the field
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else if (field) {
            field.classList.remove('input-error');
            
            // Remove error message if exists
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                field.parentNode.removeChild(field.nextElementSibling);
            }
        }
    });
    
    // Validate specialty field has at least one specialty
    const specialtiesField = document.getElementById('hospital-specialties');
    if (specialtiesField && specialtiesField.value.trim() === '') {
        specialtiesField.classList.add('input-error');
        if (!specialtiesField.nextElementSibling || !specialtiesField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter at least one specialty';
            specialtiesField.parentNode.insertBefore(errorMsg, specialtiesField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate available beds <= total beds
    const totalBedsField = document.getElementById('hospital-beds-total');
    const availableBedsField = document.getElementById('hospital-beds-available');
    
    if (totalBedsField && availableBedsField && 
        parseInt(availableBedsField.value) > parseInt(totalBedsField.value)) {
        availableBedsField.classList.add('input-error');
        if (!availableBedsField.nextElementSibling || !availableBedsField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Available beds cannot exceed total beds';
            availableBedsField.parentNode.insertBefore(errorMsg, availableBedsField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate email format
    const emailField = document.getElementById('hospital-email');
    if (emailField && emailField.value.trim() !== '') {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('input-error');
            if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid email address';
                emailField.parentNode.insertBefore(errorMsg, emailField.nextSibling);
            }
            isValid = false;
        }
    }
    
    // Validate pincode format (6 digits)
    const pincodeField = document.getElementById('hospital-pincode');
    if (pincodeField && pincodeField.value.trim() !== '') {
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincodeField.value)) {
            pincodeField.classList.add('input-error');
            if (!pincodeField.nextElementSibling || !pincodeField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid 6-digit PIN code';
                pincodeField.parentNode.insertBefore(errorMsg, pincodeField.nextSibling);
            }
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Add hospital to table
 * @param {Object} hospital - Hospital data
 */
function addHospitalToTable(hospital) {
    const hospitalsTable = document.querySelector('#hospitals-tab .data-table tbody');
    if (hospitalsTable) {
        // Create new table row
        const row = document.createElement('tr');
        
        // Create status badge class based on status
        let statusClass = 'available';
        if (hospital.status === 'Critical') {
            statusClass = 'maintenance';
        } else if (hospital.status === 'High Load') {
            statusClass = 'warning';
        }
        
        // Set row content with enhanced data display
        row.innerHTML = `
            <td>${hospital.name}</td>
            <td>${hospital.address}</td>
            <td>
                <div class="capacity-indicator">
                    <div class="capacity-bar-container">
                        <div class="capacity-bar" style="width: ${hospital.capacity.percentage}%"></div>
                    </div>
                    <span>${hospital.capacity.percentage}% (${hospital.capacity.total - hospital.capacity.available}/${hospital.capacity.total})</span>
                </div>
            </td>
            <td>${hospital.waitTime}</td>
            <td><span class="status-badge ${statusClass}">${hospital.status}</span></td>
            <td>${hospital.contact.phone || hospital.contact}</td>
            <td class="actions-cell">
                <button class="action-btn edit" title="Edit hospital details"><i class="fas fa-edit"></i></button>
                <button class="action-btn view" title="View hospital details"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" title="Delete hospital"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add row to table with animation
        row.classList.add('new-row');
        hospitalsTable.appendChild(row);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            row.classList.remove('new-row');
        }, 1000);
        
        // Add event listeners to the new buttons
        const editBtn = row.querySelector('.action-btn.edit');
        const deleteBtn = row.querySelector('.action-btn.delete');
        const viewBtn = row.querySelector('.action-btn.view');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                showNotification(`Editing ${hospitalName}`, 'info');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                if (confirm(`Are you sure you want to delete ${hospitalName}?`)) {
                    // Add row fade out animation
                    row.classList.add('deleting');
                    
                    setTimeout(() => {
                        row.remove();
                        updateDashboardStats();
                        showNotification(`${hospitalName} has been deleted`, 'success');
                    }, 500);
                }
            });
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                viewHospitalDetails(row);
            });
        }
    }
}

/**
 * Set up hospital action buttons
 */
function setupHospitalActionButtons() {
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
                
                // Open the hospital detail view modal
                viewHospitalDetails(row);
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
                    updateDashboardStats();
                }
            });
        });
    }
}

/**
 * View hospital details
 * @param {HTMLElement} row - Table row element with hospital data
 */
function viewHospitalDetails(row) {
    // Extract data from row
    const name = row.cells[0].textContent.trim();
    const address = row.cells[1].textContent.trim();
    
    // Extract capacity information
    const capacityEl = row.querySelector('.capacity-indicator span');
    const capacityText = capacityEl ? capacityEl.textContent.trim() : '';
    const capacityMatch = capacityText.match(/(\d+)%\s*\((\d+)\/(\d+)\)/);
    let capacityPercentage = 0;
    let occupiedBeds = 0;
    let totalBeds = 0;
    
    if (capacityMatch && capacityMatch.length >= 4) {
        capacityPercentage = parseInt(capacityMatch[1]);
        occupiedBeds = parseInt(capacityMatch[2]);
        totalBeds = parseInt(capacityMatch[3]);
    }
    
    const waitTime = row.cells[3].textContent.trim();
    
    // Extract status
    const statusEl = row.querySelector('.status-badge');
    const status = statusEl ? statusEl.textContent.trim() : 'Available';
    let statusClass = 'available';
    
    if (status === 'Critical') {
        statusClass = 'maintenance';
    } else if (status === 'High Load') {
        statusClass = 'warning';
    }
    
    // Get contact
    const contact = row.cells[5].textContent.trim();
    
    // Populate modal with data
    document.getElementById('view-hospital-name').textContent = name;
    document.getElementById('view-hospital-address').textContent = address;
    
    // Set coordinates (mock data for demo)
    document.getElementById('view-hospital-coordinates').textContent = '22.3072, 73.1812';
    
    // Set contact information
    document.getElementById('view-hospital-phone').textContent = contact;
    document.getElementById('view-hospital-emergency').textContent = contact; // Using same number for demo
    document.getElementById('view-hospital-email').textContent = `info@${name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    const websiteEl = document.getElementById('view-hospital-website');
    const website = `${name.toLowerCase().replace(/\s+/g, '')}.com`;
    websiteEl.textContent = website;
    websiteEl.href = `https://${website}`;
    
    // Set capacity information
    document.getElementById('view-hospital-beds-total').textContent = totalBeds;
    document.getElementById('view-hospital-beds-available').textContent = totalBeds - occupiedBeds;
    
    // Set mock data for other capacity fields
    document.getElementById('view-hospital-icu-beds').textContent = Math.round(totalBeds * 0.2); // 20% of total beds
    document.getElementById('view-hospital-ventilators').textContent = Math.round(totalBeds * 0.1); // 10% of total beds
    document.getElementById('view-hospital-wait-time').textContent = waitTime;
    
    // Set capacity bar
    const capacityBar = document.getElementById('view-hospital-capacity-bar');
    capacityBar.style.width = `${capacityPercentage}%`;
    document.getElementById('view-hospital-capacity').textContent = capacityText;
    
    // Set status badge
    const statusBadge = document.getElementById('view-hospital-status');
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${statusClass}`;
    
    // Set mock data for hospital type and services
    document.getElementById('view-hospital-type').textContent = name.includes('SSG') ? 'Government' : 'Private';
    
    // Set specialties based on hospital name for demo
    let specialties = 'General Medicine, Surgery, Pediatrics';
    if (name.includes('Cancer')) {
        specialties = 'Oncology, Radiology, Chemotherapy';
    } else if (name.includes('Heart') || name.includes('Cardiac')) {
        specialties = 'Cardiology, Cardiac Surgery, Vascular Medicine';
    }
    document.getElementById('view-hospital-specialties').textContent = specialties;
    
    // Set mock data for services
    document.getElementById('view-hospital-emergency-services').textContent = 'Yes';
    document.getElementById('view-hospital-trauma-center').textContent = status === 'Critical' ? 'No' : 'Yes';
    document.getElementById('view-hospital-blood-bank').textContent = 'Yes';
    document.getElementById('view-hospital-24x7').textContent = 'Yes';
    
    // Initialize hospital map
    setTimeout(() => {
        const mapElement = document.getElementById('view-hospital-map');
        if (mapElement && typeof L !== 'undefined') {
            // Check if map already initialized
            if (window.hospitalDetailMap) {
                window.hospitalDetailMap.remove();
            }
            
            // Create map
            window.hospitalDetailMap = L.map('view-hospital-map').setView([22.3072, 73.1812], 15);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(window.hospitalDetailMap);
            
            // Add marker
            L.marker([22.3072, 73.1812]).addTo(window.hospitalDetailMap)
                .bindPopup(`<b>${name}</b><br>${address}`).openPopup();
        }
    }, 300);
    
    // Set up edit button
    const editBtn = document.getElementById('view-hospital-edit');
    if (editBtn) {
        editBtn.onclick = () => {
            closeModal('view-hospital-modal');
            showNotification(`Editing ${name}`, 'info');
        };
    }
    
    // Set up close button
    const closeBtn = document.querySelector('#view-hospital-modal .close-modal-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            closeModal('view-hospital-modal');
        };
    }
    
    // Open modal
    openModal('view-hospital-modal');
}

/**
 * Update dashboard stats
 */
function updateDashboardStats() {
    // Get counts
    const hospitalCount = document.querySelectorAll('#hospitals-tab .data-table tbody tr').length;
    
    // Update hospital count on dashboard
    const hospitalStatValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (hospitalStatValue) {
        hospitalStatValue.textContent = hospitalCount;
    }
    
    // Update hospital summary information
    updateHospitalSummary();
    
    // Update last updated timestamp
    updateLastUpdatedTimestamp();
}

/**
 * Update hospital summary information
 */
function updateHospitalSummary() {
    // Get all hospital rows
    const hospitalRows = document.querySelectorAll('#hospitals-tab .data-table tbody tr');
    
    // Calculate totals
    let totalHospitals = hospitalRows.length;
    let totalBeds = 0;
    let availableBeds = 0;
    let criticalHospitals = 0;
    
    hospitalRows.forEach(row => {
        // Get capacity text which is in format "XX% (YY/ZZ)"
        const capacityText = row.querySelector('.capacity-indicator span').textContent;
        
        // Extract total and available beds using regex
        const bedMatch = capacityText.match(/\((\d+)\/(\d+)\)/);
        if (bedMatch && bedMatch.length >= 3) {
            const occupied = parseInt(bedMatch[1]);
            const total = parseInt(bedMatch[2]);
            
            totalBeds += total;
            availableBeds += (total - occupied);
        }
        
        // Check if hospital is critical
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge && statusBadge.textContent === 'Critical') {
            criticalHospitals++;
        }
    });
    
    // Update summary elements
    const totalHospitalsEl = document.getElementById('total-hospitals');
    const totalBedsEl = document.getElementById('total-beds');
    const availableBedsEl = document.getElementById('available-beds');
    const criticalHospitalsEl = document.getElementById('critical-hospitals');
    
    if (totalHospitalsEl) totalHospitalsEl.textContent = totalHospitals;
    if (totalBedsEl) totalBedsEl.textContent = totalBeds;
    if (availableBedsEl) availableBedsEl.textContent = availableBeds;
    if (criticalHospitalsEl) criticalHospitalsEl.textContent = criticalHospitals;
}

/**
 * Update last updated timestamp
 */
function updateLastUpdatedTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();
    
    // Format: "Today, 2:30 PM" or "Jan 15, 2023, 2:30 PM"
    const isToday = new Date().setHours(0,0,0,0) === new Date(now).setHours(0,0,0,0);
    const formattedDate = isToday ? `Today, ${timeString}` : `${dateString}, ${timeString}`;
    
    // Update the hospital section timestamp
    const hospitalLastUpdatedEl = document.getElementById('hospital-last-updated');
    if (hospitalLastUpdatedEl) {
        hospitalLastUpdatedEl.textContent = formattedDate;
    }
    
    // Update any other last-updated elements
    const lastUpdatedEls = document.querySelectorAll('.last-updated span:not(#hospital-last-updated)');
    lastUpdatedEls.forEach(el => {
        el.textContent = formattedDate;
    });
}

/**
/**
 * Smart Ambulance Routing System
 * Admin Panel Functionality
 */

/**
 * Initialize the admin panel
 */
function initAdminPanel() {
    console.log('Initializing admin panel');
    
    // Set up sidebar navigation
    setupSidebarNav();
    
    // Set up admin dashboard
    setupAdminDashboard();
    
    // Initialize charts
    initCharts();
    
    // Set up date range pickers
    setupDateRange();
    
    // Load active emergencies
    loadActiveEmergencies();
    
    // Set up ambulance management
    setupAmbulanceManagement();
    
    // Set up hospital management
    setupHospitalManagement();
    
    // Set up user management
    setupUserManagement();
    
    // Set up settings management
    setupSettingsManagement();
    
    // Set up emergency management
    setupEmergencyManagement();
    
    // Set up route management
    setupRouteManagement();
    
    // Set up modals
    setupModals();
    
    // Set up mobile sidebar toggle
    setupMobileSidebar();
    
    // Set up location buttons
    setupLocationButtons();
    
    // Initialize ambulance locations dashboard
    initAmbulanceLocationsDashboard();
    
    // Initialize maps
    setTimeout(() => {
        // Add a small delay to ensure DOM is fully loaded
        try {
            if (document.getElementById('admin-overview-map')) {
                // Initialize admin overview map
                const adminMap = L.map('admin-overview-map', {
                    center: [22.3072, 73.1812], // Vadodara, India
                    zoom: 12
                });
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(adminMap);
            }
            
            if (document.getElementById('ambulance-map')) {
                initAmbulanceMap();
            }
            
            if (document.getElementById('route-map')) {
                initRouteMap();
            }
        } catch (e) {
            console.error('Error initializing maps:', e);
        }
    }, 500);
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
    const addAmbulanceModal = document.getElementById('add-ambulance-modal');
    const addAmbulanceBtn = document.getElementById('add-ambulance-btn');
    const closeModal = addAmbulanceModal.querySelector('.close-modal');
    const cancelBtn = addAmbulanceModal.querySelector('.cancel-btn');
    const ambulanceForm = document.getElementById('add-ambulance-form');
    const refreshBtn = document.getElementById('refresh-ambulances-btn');
    
    // Tab navigation for ambulance form
    const formTabs = ambulanceForm.querySelectorAll('.form-tab');
    const formTabContents = ambulanceForm.querySelectorAll('.form-tab-content');
    const nextTabBtn = document.getElementById('next-tab-ambulance');
    const prevTabBtn = document.getElementById('prev-tab-ambulance');
    const submitBtn = ambulanceForm.querySelector('button[type="submit"]');
    
    let currentTabIndex = 0;
    
    // Function to show a specific tab
    function showTab(index) {
        formTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        formTabContents.forEach((content, i) => {
            if (i === index) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update progress bar
        const progressSegments = ambulanceForm.querySelectorAll('.progress-segment');
        progressSegments.forEach((segment, i) => {
            if (i <= index) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
        
        // Show/hide navigation buttons
        if (index === 0) {
            prevTabBtn.style.display = 'none';
        } else {
            prevTabBtn.style.display = 'block';
        }
        
        if (index === formTabs.length - 1) {
            nextTabBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextTabBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Tab click event
    formTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            showTab(index);
        });
    });
    
    // Next button click
    nextTabBtn.addEventListener('click', () => {
        if (validateCurrentTab()) {
            if (currentTabIndex < formTabs.length - 1) {
                showTab(currentTabIndex + 1);
            }
        }
    });
    
    // Previous button click
    prevTabBtn.addEventListener('click', () => {
        if (currentTabIndex > 0) {
            showTab(currentTabIndex - 1);
        }
    });
    
    // Validate current tab
    function validateCurrentTab() {
        let isValid = true;
        const currentTab = formTabContents[currentTabIndex];
        
        // Get all required inputs in the current tab
        const requiredInputs = currentTab.querySelectorAll('input[required], select[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('input-error');
                showNotification('Please fill all required fields marked with *', 'error');
            } else {
                input.classList.remove('input-error');
            }
        });
        
        // Specific validations based on tab
        if (currentTabIndex === 0) { // Basic Info tab
            const ambulanceId = document.getElementById('ambulance-id');
            if (ambulanceId.value && !/^AMB-\d{4}$/.test(ambulanceId.value)) {
                isValid = false;
                ambulanceId.classList.add('input-error');
                showNotification('Ambulance ID should be in format AMB-XXXX (e.g., AMB-1234)', 'error');
            }
            
            const registrationNo = document.getElementById('ambulance-registration');
            if (registrationNo.value && !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(registrationNo.value)) {
                isValid = false;
                registrationNo.classList.add('input-error');
                showNotification('Vehicle Registration should be in a valid format (e.g., MH02AB1234)', 'error');
            }
        } else if (currentTabIndex === 2) { // Staff tab
            const driverPhone = document.getElementById('driver-phone');
            if (driverPhone.value && !/^[0-9]{10}$/.test(driverPhone.value)) {
                isValid = false;
                driverPhone.classList.add('input-error');
                showNotification('Phone number should be a 10-digit number', 'error');
            }
        }
        
        return isValid;
    }

    // Handle form input events to remove error class
    ambulanceForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
    });

    // Initialize map for location selection
    const mapPickerBtn = document.getElementById('show-map-picker-ambulance');
    const mapPreview = document.getElementById('ambulance-map-preview');
    let mapInstance = null;
    
    // Initialize map preview
    if (mapPreview) {
        // Check if Leaflet is available
        if (typeof L !== 'undefined') {
            mapInstance = L.map(mapPreview).setView([22.3072, 73.1812], 12); // Vadodara coordinates
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstance);
            
            // Add marker for ambulance location
            const ambulanceMarker = L.marker([22.3072, 73.1812], {
                draggable: true
            }).addTo(mapInstance);
            
            // Update coordinates on marker drag
            ambulanceMarker.on('dragend', function(event) {
                const marker = event.target;
                const position = marker.getLatLng();
                
                document.getElementById('ambulance-lat').value = position.lat.toFixed(6);
                document.getElementById('ambulance-lng').value = position.lng.toFixed(6);
                
                // Update route metrics (for demo)
                updateRouteMetrics();
            });
        }
    }
    
    // Map control buttons
    const mapControls = document.querySelectorAll('.map-controls .map-control-btn');
    if (mapControls.length > 0 && mapInstance) {
        // Zoom in
        mapControls[0].addEventListener('click', () => {
            mapInstance.setZoom(mapInstance.getZoom() + 1);
        });
        
        // Zoom out
        mapControls[1].addEventListener('click', () => {
            mapInstance.setZoom(mapInstance.getZoom() - 1);
        });
        
        // Center map
        mapControls[2].addEventListener('click', () => {
            mapInstance.setView([22.3072, 73.1812], 12);
        });
    }
    
    // Use current location button
    const useCurrentLocationBtn = document.querySelector('.auto-locate[data-target="ambulance"]');
    if (useCurrentLocationBtn) {
        useCurrentLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    document.getElementById('ambulance-lat').value = position.coords.latitude.toFixed(6);
                    document.getElementById('ambulance-lng').value = position.coords.longitude.toFixed(6);
                    
                    // Update map if available
                    if (mapInstance) {
                        mapInstance.setView([position.coords.latitude, position.coords.longitude], 15);
                        
                        // Update marker position
                        const markers = mapInstance._layers;
                        for (let id in markers) {
                            if (markers[id] instanceof L.Marker) {
                                markers[id].setLatLng([position.coords.latitude, position.coords.longitude]);
                                break;
                            }
                        }
                    }
                    
                    // Update route metrics (for demo)
                    updateRouteMetrics();
                    
                    showNotification('Current location set', 'success');
                }, error => {
                    showNotification('Could not get current location: ' + error.message, 'error');
                });
            } else {
                showNotification('Geolocation is not supported by this browser', 'error');
            }
        });
    }
    
    // Use hospital location button
    const useHospitalLocationBtn = document.getElementById('use-hospital-location');
    if (useHospitalLocationBtn) {
        useHospitalLocationBtn.addEventListener('click', () => {
            const selectedHospital = document.getElementById('ambulance-hospital').value;
            
            // Hospital coordinates (approximate for Vadodara hospitals)
            const hospitalCoordinates = {
                'SSG Hospital': [22.3217, 73.1851],
                'Bhailal Amin General Hospital': [22.3003, 73.1759],
                'Baroda Medical College Hospital': [22.3144, 73.1932],
                'Kailash Cancer Hospital': [22.3003, 73.1759],
                'Sterling Hospital': [22.3119, 73.1723]
            };
            
            if (selectedHospital && hospitalCoordinates[selectedHospital]) {
                const [lat, lng] = hospitalCoordinates[selectedHospital];
                document.getElementById('ambulance-lat').value = lat.toFixed(6);
                document.getElementById('ambulance-lng').value = lng.toFixed(6);
                
                // Update map if available
                if (mapInstance) {
                    mapInstance.setView([lat, lng], 15);
                    
                    // Update marker position
                    const markers = mapInstance._layers;
                    for (let id in markers) {
                        if (markers[id] instanceof L.Marker) {
                            markers[id].setLatLng([lat, lng]);
                            break;
                        }
                    }
                }
                
                // Update route metrics (for demo)
                updateRouteMetrics();
                
                showNotification('Hospital location set', 'success');
            } else {
                showNotification('Please select a hospital first', 'warning');
            }
        });
    }
    
    // Update route metrics for demo purposes
    function updateRouteMetrics() {
        const routeMetrics = document.querySelectorAll('.route-metric .metric-value');
        if (routeMetrics.length >= 4) {
            // Random travel time between 8 and 15 minutes
            routeMetrics[0].textContent = Math.floor(Math.random() * 8) + 8 + ' mins';
            
            // Random distance between 3 and 7 km
            routeMetrics[1].textContent = (Math.floor(Math.random() * 40) / 10 + 3).toFixed(1) + ' km';
            
            // Random response time between 6 and 10 minutes
            routeMetrics[2].textContent = Math.floor(Math.random() * 5) + 6 + ' mins';
            
            // Traffic condition
            const trafficConditions = ['Good', 'Moderate', 'Heavy'];
            const randomCondition = trafficConditions[Math.floor(Math.random() * 3)];
            routeMetrics[3].textContent = randomCondition;
            
            // Update class for color coding
            routeMetrics[3].className = 'metric-value';
            if (randomCondition === 'Good') routeMetrics[3].classList.add('status-good');
            if (randomCondition === 'Moderate') routeMetrics[3].classList.add('status-warning');
            if (randomCondition === 'Heavy') routeMetrics[3].classList.add('status-danger');
        }
    }
    
    // Document upload functionality
    const uploadButtons = document.querySelectorAll('.upload-btn');
    uploadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*,.pdf,.doc,.docx';
            
            fileInput.addEventListener('change', function() {
                if (fileInput.files.length > 0) {
                    const fileName = fileInput.files[0].name;
                    button.innerHTML = `<i class="fas fa-check"></i> ${fileName}`;
                    button.style.backgroundColor = '#e6f7ee';
                    button.style.borderColor = '#2ed573';
                    button.style.color = '#2ed573';
                }
            });
            
            fileInput.click();
        });
    });
    
    // Initialize document validity dates
    const validityDates = document.querySelectorAll('.document-validity .mini-date');
    validityDates.forEach(dateInput => {
        // Set default expiry date to one year from now
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        dateInput.valueAsDate = oneYearFromNow;
        
        // Add event listener to highlight expired dates
        dateInput.addEventListener('change', function() {
            const today = new Date();
            const expiryDate = new Date(this.value);
            
            if (expiryDate < today) {
                this.classList.add('expired-date');
                this.parentElement.classList.add('expired');
            } else {
                this.classList.remove('expired-date');
                this.parentElement.classList.remove('expired');
            }
        });
    });
    
    if (addAmbulanceBtn) {
        addAmbulanceBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'block';
            // Reset the form and show first tab
            ambulanceForm.reset();
            showTab(0);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (ambulanceForm) {
        ambulanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab()) {
                return;
            }
            
            // Collect data from the form
            const ambulanceData = {
                id: document.getElementById('ambulance-id').value,
                registration: document.getElementById('ambulance-registration').value,
                type: document.getElementById('ambulance-type').value,
                make: document.getElementById('ambulance-make').value,
                year: document.getElementById('ambulance-year').value,
                vin: document.getElementById('ambulance-vin')?.value || '',
                capacity: document.getElementById('ambulance-capacity').value,
                fuelType: document.getElementById('ambulance-fuel-type').value,
                status: document.getElementById('ambulance-status').value,
                
                // Vehicle details
                insurance: document.getElementById('ambulance-insurance').value,
                lastService: document.getElementById('ambulance-last-service').value,
                nextService: document.getElementById('ambulance-next-service').value,
                mileage: document.getElementById('ambulance-mileage').value,
                
                // Equipment
                equipment: {
                    // Basic equipment
                    firstAid: document.getElementById('equipment-first-aid').checked,
                    oxygen: document.getElementById('equipment-oxygen').checked,
                    stretcher: document.getElementById('equipment-stretcher').checked,
                    wheelchair: document.getElementById('equipment-wheelchair').checked,
                    
                    // Advanced equipment
                    aed: document.getElementById('equipment-aed').checked,
                    ventilator: document.getElementById('equipment-ventilator').checked,
                    ecg: document.getElementById('equipment-ecg').checked,
                    suction: document.getElementById('equipment-suction').checked,
                    infusion: document.getElementById('equipment-infusion').checked,
                    oximeter: document.getElementById('equipment-oximeter').checked,
                    
                    // Other equipment
                    other: document.getElementById('equipment-others').value,
                    
                    // Medication
                    medication: document.getElementById('equipment-medication').value,
                    
                    // New equipment fields with quantities
                    oxygenQuantity: document.getElementById('oxygen-quantity')?.value || '1',
                    stretcherType: document.getElementById('stretcher-type')?.value || 'Standard',
                    ventilatorType: document.getElementById('ventilator-type')?.value || 'Standard',
                },
                
                // Staff information
                driver: {
                    name: document.getElementById('driver-name').value,
                    phone: document.getElementById('driver-phone').value,
                    license: document.getElementById('driver-license').value,
                    licenseExpiry: document.getElementById('driver-license-expiry').value,
                    age: document.getElementById('driver-age')?.value || '',
                    experience: document.getElementById('driver-experience')?.value || '',
                    shift: document.getElementById('driver-shift')?.value || '',
                    address: document.getElementById('driver-address')?.value || '',
                },
                
                paramedic: {
                    name: document.getElementById('paramedic-name').value,
                    phone: document.getElementById('paramedic-phone').value,
                    qualification: document.getElementById('paramedic-qualification')?.value || '',
                    experience: document.getElementById('paramedic-experience')?.value || '',
                    license: document.getElementById('paramedic-license')?.value || '',
                    shift: document.getElementById('paramedic-shift')?.value || '',
                    emergencyContact: document.getElementById('paramedic-emergency-contact')?.value || '',
                    specializations: Array.from(document.getElementById('paramedic-specializations')?.selectedOptions || [])
                        .map(option => option.value),
                },
                
                additionalStaff: document.getElementById('additional-staff').value,
                
                // Maintenance information
                maintenance: {
                    type: document.getElementById('maintenance-type')?.value || '',
                    intervalKm: document.getElementById('maintenance-interval-km')?.value || '',
                    intervalDays: document.getElementById('maintenance-interval-days')?.value || '',
                    vendor: document.getElementById('maintenance-vendor')?.value || '',
                    notes: document.getElementById('maintenance-notes')?.value || '',
                },
                
                // Documentation
                documents: {
                    registration: {
                        status: document.getElementById('doc-registration')?.checked || false,
                        validity: document.getElementById('doc-registration')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    insurance: {
                        status: document.getElementById('doc-insurance')?.checked || false,
                        validity: document.getElementById('doc-insurance')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    fitness: {
                        status: document.getElementById('doc-fitness')?.checked || false,
                        validity: document.getElementById('doc-fitness')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    pollution: {
                        status: document.getElementById('doc-pollution')?.checked || false,
                        validity: document.getElementById('doc-pollution')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    permit: {
                        status: document.getElementById('doc-permit')?.checked || false,
                        validity: document.getElementById('doc-permit')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    tax: {
                        status: document.getElementById('doc-tax')?.checked || false,
                        validity: document.getElementById('doc-tax')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    notes: document.getElementById('documentation-notes')?.value || '',
                },
                
                // Location information
                location: {
                    hospital: document.getElementById('ambulance-hospital')?.value || '',
                    baseLocation: document.getElementById('ambulance-base-location')?.value || '',
                    serviceArea: document.getElementById('ambulance-service-area')?.value || '',
                    responseRadius: document.getElementById('ambulance-response-radius')?.value || '',
                    distanceLimit: document.getElementById('distance-limit-daily')?.value || '',
                    coverageArea: document.getElementById('coverage-area')?.value || '',
                    currentLocation: {
                        lat: document.getElementById('ambulance-lat')?.value || '',
                        lng: document.getElementById('ambulance-lng')?.value || '',
                    }
                },
                
                timestamp: Date.now()
            };
            
            // For demonstration, show the data in a notification
            console.log('Ambulance Data:', ambulanceData);
            
            // Save to localStorage (or send to server in production)
            const ambulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
            ambulances.push(ambulanceData);
            localStorage.setItem('ambulances', JSON.stringify(ambulances));
            
            // Close modal and show success notification
            addAmbulanceModal.style.display = 'none';
            showNotification('Ambulance added successfully!', 'success');
            
            // Refresh the ambulance list
            loadAmbulances();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // In a real scenario, this would fetch from API
            // For demo, we'll just show a notification
            showNotification('Ambulance list refreshed', 'info');
        });
    }

    // Add sample ambulances for demo
    addDemoAmbulances();
}

function addAmbulanceToTable(ambulanceData) {
    const ambulanceTable = document.querySelector('.ambulance-table tbody');
    
    if (!ambulanceTable) return;
    
    const newRow = document.createElement('tr');
    newRow.classList.add('new-row-highlight');
    
    // Create cells with ambulance data
    newRow.innerHTML = `
        <td>${ambulanceData.id}</td>
        <td>${getAmbulanceTypeLabel(ambulanceData.type)}</td>
        <td>${ambulanceData.driver.name || 'N/A'}</td>
        <td>${ambulanceData.baseLocation}</td>
        <td>${ambulanceData.status ? capitalizeFirstLetter(ambulanceData.status) : 'Unknown'}</td>
        <td>
            <div class="action-buttons">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
                <button class="view-btn"><i class="fas fa-eye"></i></button>
            </div>
        </td>
    `;
    
    // Add event listeners for the action buttons
    const editBtn = newRow.querySelector('.edit-btn');
    const deleteBtn = newRow.querySelector('.delete-btn');
    const viewBtn = newRow.querySelector('.view-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showNotification('Edit functionality coming soon', 'info');
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            newRow.classList.add('delete-animation');
            setTimeout(() => {
                ambulanceTable.removeChild(newRow);
                showNotification('Ambulance removed successfully', 'success');
            }, 500);
        });
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            showNotification('View details functionality coming soon', 'info');
        });
    }
    
    // Add to table and remove highlight after animation
    ambulanceTable.appendChild(newRow);
    setTimeout(() => {
        newRow.classList.remove('new-row-highlight');
    }, 3000);
}

function getAmbulanceTypeLabel(type) {
    const types = {
        'type1': 'Type I (Basic)',
        'type2': 'Type II (Mobile Emergency)',
        'type3': 'Type III (Advanced Life Support)',
        'type4': 'Mobile ICU',
        'neonatal': 'Neonatal',
        'mortuary': 'Mortuary'
    };
    
    return types[type] || 'Unknown Type';
}

function addDemoAmbulances() {
    const ambulances = [
        {
            id: 'AMB-1001',
            registration: 'GJ06AB1234',
            type: 'type2',
            make: 'Tata Winger',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Rajesh Kumar',
                phone: '9876543210'
            },
            baseLocation: 'SSG Hospital',
            hospital: 'SSG Hospital'
        },
        {
            id: 'AMB-1002',
            registration: 'GJ06CD5678',
            type: 'type3',
            make: 'Force Traveller',
            year: '2021',
            capacity: '3',
            fuelType: 'diesel',
            status: 'dispatched',
            driver: {
                name: 'Suresh Patel',
                phone: '9876543211'
            },
            baseLocation: 'Bhailal Amin General Hospital',
            hospital: 'Bhailal Amin General Hospital'
        },
        {
            id: 'AMB-1003',
            registration: 'GJ06EF9012',
            type: 'type4',
            make: 'Tata Winger',
            year: '2023',
            capacity: '1',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Amit Singh',
                phone: '9876543212'
            },
            baseLocation: 'Sterling Hospital',
            hospital: 'Sterling Hospital'
        },
        {
            id: 'AMB-1004',
            registration: 'GJ06GH3456',
            type: 'neonatal',
            make: 'Force Traveller',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'maintenance',
            driver: {
                name: 'Dinesh Shah',
                phone: '9876543213'
            },
            baseLocation: 'Baroda Medical College Hospital',
            hospital: 'Baroda Medical College Hospital'
        }
    ];
    
    ambulances.forEach(ambulance => {
        addAmbulanceToTable(ambulance);
    });
}

/**
 * Set up hospital management
 */
function setupHospitalManagement() {
    // Add hospital button
    const addHospitalBtn = document.getElementById('add-hospital-btn');
    if (addHospitalBtn) {
        addHospitalBtn.addEventListener('click', () => {
            // Show the add hospital form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'block';
                
                // Add tooltips to form fields for better guidance
                addFormTooltips();
                
                // Add dynamic field interactions
                setupDynamicFormFields();
                
                // Scroll to the form
                formContainer.scrollIntoView({ behavior: 'smooth' });
                showNotification('Please fill in the hospital details', 'info');
            }
        });
    }
    
    // Handle form submission
    const hospitalForm = document.getElementById('add-hospital-form');
    if (hospitalForm) {
        hospitalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!validateHospitalForm()) {
                showNotification('Please correct the errors in the form', 'error');
                return;
            }
            
            // Get all the form values
            const hospitalName = document.getElementById('hospital-name').value;
            const hospitalType = document.getElementById('hospital-type').value;
            const hospitalAddress = document.getElementById('hospital-address').value;
            const hospitalArea = document.getElementById('hospital-area').value;
            const hospitalCity = document.getElementById('hospital-city').value;
            const hospitalPincode = document.getElementById('hospital-pincode').value;
            
            const hospitalPhone = document.getElementById('hospital-phone').value;
            const hospitalEmergencyPhone = document.getElementById('hospital-emergency-phone').value;
            const hospitalEmail = document.getElementById('hospital-email').value;
            const hospitalWebsite = document.getElementById('hospital-website').value;
            
            const hospitalBedsTotal = document.getElementById('hospital-beds-total').value;
            const hospitalBedsAvailable = document.getElementById('hospital-beds-available').value;
            const hospitalICUBeds = document.getElementById('hospital-icu-beds')?.value || 0;
            const hospitalVentilators = document.getElementById('hospital-ventilators')?.value || 0;
            const hospitalWaitTime = document.getElementById('hospital-wait-time').value;
            
            const hospitalLat = document.getElementById('hospital-lat').value;
            const hospitalLng = document.getElementById('hospital-lng').value;
            
            // Get specialty information
            const hospitalSpecialties = document.getElementById('hospital-specialties').value;
            const hospitalEmergency = document.getElementById('hospital-emergency')?.checked || false;
            const hospitalTraumaCenter = document.getElementById('hospital-trauma-center')?.checked || false;
            const hospitalBloodBank = document.getElementById('hospital-blood-bank')?.checked || false;
            const hospital24x7 = document.getElementById('hospital-24x7')?.checked || false;
            
            // Check required fields
            if (!hospitalName || !hospitalAddress || !hospitalBedsTotal || !hospitalBedsAvailable || !hospitalWaitTime) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Calculate capacity percentage
            const totalBeds = parseInt(hospitalBedsTotal);
            const availableBeds = parseInt(hospitalBedsAvailable);
            const capacityPercentage = Math.round(((totalBeds - availableBeds) / totalBeds) * 100);
            
            // Determine status based on capacity
            let status = 'Available';
            if (capacityPercentage >= 90) {
                status = 'Critical';
            } else if (capacityPercentage >= 75) {
                status = 'High Load';
            }
            
            // Construct full address
            const fullAddress = `${hospitalAddress}, ${hospitalArea ? hospitalArea + ', ' : ''}${hospitalCity}${hospitalPincode ? ', ' + hospitalPincode : ''}`;
            
            // Create a rich hospital object with all details
            const hospitalData = {
                name: hospitalName,
                type: hospitalType,
                address: fullAddress,
                capacity: {
                    percentage: capacityPercentage,
                    available: availableBeds,
                    total: totalBeds,
                    icu: hospitalICUBeds,
                    ventilators: hospitalVentilators
                },
                contact: {
                    phone: hospitalPhone,
                    emergency: hospitalEmergencyPhone,
                    email: hospitalEmail,
                    website: hospitalWebsite
                },
                location: {
                    lat: hospitalLat,
                    lng: hospitalLng
                },
                services: {
                    specialties: hospitalSpecialties,
                    emergency: hospitalEmergency,
                    traumaCenter: hospitalTraumaCenter,
                    bloodBank: hospitalBloodBank,
                    open24x7: hospital24x7
                },
                waitTime: hospitalWaitTime + ' mins',
                status: status
            };
            
            // Add the hospital to the table
            addHospitalToTable(hospitalData);
            
            // Show confirmation with more details
            showNotification(`Hospital "${hospitalName}" has been added successfully with ${totalBeds} beds`, 'success');
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Hide the form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
            
            // Reset the form
            hospitalForm.reset();
        });
    }
    
    // Set up form toggle buttons
    const toggleFormBtns = document.querySelectorAll('.toggle-form');
    toggleFormBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const formContainer = document.getElementById(targetId + '-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
        });
    });
    
    // Set up hospital action buttons
    setupHospitalActionButtons();
}

/**
 * Add tooltips to hospital form fields
 */
function addFormTooltips() {
    // Add tooltips to form fields to provide guidance
    const tooltips = {
        'hospital-name': 'Enter the official name of the hospital',
        'hospital-type': 'Select the type of hospital (Government, Private, etc.)',
        'hospital-address': 'Enter the street address of the hospital',
        'hospital-area': 'Enter the area or locality name',
        'hospital-city': 'Enter the city name',
        'hospital-pincode': 'Enter the 6-digit PIN code',
        'hospital-phone': 'Enter the main contact number with country code',
        'hospital-emergency-phone': 'Enter emergency contact number',
        'hospital-email': 'Enter official email address',
        'hospital-website': 'Enter complete website URL including https://',
        'hospital-beds-total': 'Enter total number of beds in the hospital',
        'hospital-beds-available': 'Enter number of currently available beds',
        'hospital-icu-beds': 'Enter number of ICU beds',
        'hospital-ventilators': 'Enter number of ventilators available',
        'hospital-ambulances': 'Enter number of ambulances operated by the hospital',
        'hospital-wait-time': 'Enter average emergency wait time in minutes',
        'hospital-specialties': 'Enter medical specialties separated by commas',
        'hospital-lat': 'Enter latitude coordinate (use buttons below to get coordinates)',
        'hospital-lng': 'Enter longitude coordinate (use buttons below to get coordinates)'
    };
    
    // Apply tooltips to elements
    for (const [id, tooltip] of Object.entries(tooltips)) {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('title', tooltip);
            
            // Add input validation feedback
            if (element.hasAttribute('required')) {
                element.addEventListener('input', () => {
                    if (element.value.trim() === '') {
                        element.classList.add('input-error');
                    } else {
                        element.classList.remove('input-error');
                    }
                });
            }
        }
    }
}

/**
 * Setup dynamic form field interactions
 */
function setupDynamicFormFields() {
    // Add interactions between related fields
    
    // Update available beds validation to be less than total beds
    const totalBedsInput = document.getElementById('hospital-beds-total');
    const availableBedsInput = document.getElementById('hospital-beds-available');
    
    if (totalBedsInput && availableBedsInput) {
        totalBedsInput.addEventListener('input', () => {
            const totalBeds = parseInt(totalBedsInput.value) || 0;
            availableBedsInput.setAttribute('max', totalBeds);
            
            // Validate available beds against total beds
            const availableBeds = parseInt(availableBedsInput.value) || 0;
            if (availableBeds > totalBeds) {
                availableBedsInput.value = totalBeds;
            }
        });
    }
    
    // Update hospital type dependent fields
    const hospitalTypeSelect = document.getElementById('hospital-type');
    if (hospitalTypeSelect) {
        hospitalTypeSelect.addEventListener('change', () => {
            const type = hospitalTypeSelect.value;
            
            // Show/hide fields based on hospital type
            const traumaCenterCheckbox = document.getElementById('hospital-trauma-center');
            if (traumaCenterCheckbox) {
                if (type === 'government' || type === 'speciality') {
                    traumaCenterCheckbox.parentElement.style.display = 'block';
                } else {
                    traumaCenterCheckbox.checked = false;
                    traumaCenterCheckbox.parentElement.style.display = 'none';
                }
            }
            
            // Update placeholders for specialties based on type
            const specialtiesInput = document.getElementById('hospital-specialties');
            if (specialtiesInput) {
                if (type === 'speciality') {
                    specialtiesInput.placeholder = 'Primary specialty (e.g. Cancer, Cardiac, Orthopedic)';
                } else {
                    specialtiesInput.placeholder = 'e.g. Cardiology, Neurology, Orthopedics';
                }
            }
        });
    }
    
    // Add coordinate fetching functionality
    const latInput = document.getElementById('hospital-lat');
    const lngInput = document.getElementById('hospital-lng');
    const autoLocateBtn = document.querySelector('.auto-locate[data-target="hospital"]');
    
    if (latInput && lngInput && autoLocateBtn) {
        // Use browser geolocation API
        autoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                autoLocateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
                autoLocateBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        latInput.value = position.coords.latitude.toFixed(6);
                        lngInput.value = position.coords.longitude.toFixed(6);
                        
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        
                        showNotification('Location updated successfully', 'success');
                        
                        // Highlight the fields to show they've been updated
                        latInput.classList.add('field-updated');
                        lngInput.classList.add('field-updated');
                        
                        setTimeout(() => {
                            latInput.classList.remove('field-updated');
                            lngInput.classList.remove('field-updated');
                        }, 2000);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        showNotification('Could not get your location. Please try again or enter manually.', 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }
}

/**
 * Validate hospital form
 * @returns {boolean} Whether the form is valid
 */
function validateHospitalForm() {
    let isValid = true;
    const requiredFields = [
        'hospital-name',
        'hospital-type',
        'hospital-address',
        'hospital-area',
        'hospital-city',
        'hospital-pincode',
        'hospital-phone',
        'hospital-email',
        'hospital-beds-total',
        'hospital-beds-available',
        'hospital-wait-time',
        'hospital-lat',
        'hospital-lng'
    ];
    
    // Check required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim() === '') {
            field.classList.add('input-error');
            isValid = false;
            
            // Add error message below the field
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else if (field) {
            field.classList.remove('input-error');
            
            // Remove error message if exists
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                field.parentNode.removeChild(field.nextElementSibling);
            }
        }
    });
    
    // Validate specialty field has at least one specialty
    const specialtiesField = document.getElementById('hospital-specialties');
    if (specialtiesField && specialtiesField.value.trim() === '') {
        specialtiesField.classList.add('input-error');
        if (!specialtiesField.nextElementSibling || !specialtiesField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter at least one specialty';
            specialtiesField.parentNode.insertBefore(errorMsg, specialtiesField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate available beds <= total beds
    const totalBedsField = document.getElementById('hospital-beds-total');
    const availableBedsField = document.getElementById('hospital-beds-available');
    
    if (totalBedsField && availableBedsField && 
        parseInt(availableBedsField.value) > parseInt(totalBedsField.value)) {
        availableBedsField.classList.add('input-error');
        if (!availableBedsField.nextElementSibling || !availableBedsField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Available beds cannot exceed total beds';
            availableBedsField.parentNode.insertBefore(errorMsg, availableBedsField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate email format
    const emailField = document.getElementById('hospital-email');
    if (emailField && emailField.value.trim() !== '') {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('input-error');
            if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid email address';
                emailField.parentNode.insertBefore(errorMsg, emailField.nextSibling);
            }
            isValid = false;
        }
    }
    
    // Validate pincode format (6 digits)
    const pincodeField = document.getElementById('hospital-pincode');
    if (pincodeField && pincodeField.value.trim() !== '') {
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincodeField.value)) {
            pincodeField.classList.add('input-error');
            if (!pincodeField.nextElementSibling || !pincodeField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid 6-digit PIN code';
                pincodeField.parentNode.insertBefore(errorMsg, pincodeField.nextSibling);
            }
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Add hospital to table
 * @param {Object} hospital - Hospital data
 */
function addHospitalToTable(hospital) {
    const hospitalsTable = document.querySelector('#hospitals-tab .data-table tbody');
    if (hospitalsTable) {
        // Create new table row
        const row = document.createElement('tr');
        
        // Create status badge class based on status
        let statusClass = 'available';
        if (hospital.status === 'Critical') {
            statusClass = 'maintenance';
        } else if (hospital.status === 'High Load') {
            statusClass = 'warning';
        }
        
        // Set row content with enhanced data display
        row.innerHTML = `
            <td>${hospital.name}</td>
            <td>${hospital.address}</td>
            <td>
                <div class="capacity-indicator">
                    <div class="capacity-bar-container">
                        <div class="capacity-bar" style="width: ${hospital.capacity.percentage}%"></div>
                    </div>
                    <span>${hospital.capacity.percentage}% (${hospital.capacity.total - hospital.capacity.available}/${hospital.capacity.total})</span>
                </div>
            </td>
            <td>${hospital.waitTime}</td>
            <td><span class="status-badge ${statusClass}">${hospital.status}</span></td>
            <td>${hospital.contact.phone || hospital.contact}</td>
            <td class="actions-cell">
                <button class="action-btn edit" title="Edit hospital details"><i class="fas fa-edit"></i></button>
                <button class="action-btn view" title="View hospital details"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" title="Delete hospital"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add row to table with animation
        row.classList.add('new-row');
        hospitalsTable.appendChild(row);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            row.classList.remove('new-row');
        }, 1000);
        
        // Add event listeners to the new buttons
        const editBtn = row.querySelector('.action-btn.edit');
        const deleteBtn = row.querySelector('.action-btn.delete');
        const viewBtn = row.querySelector('.action-btn.view');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                showNotification(`Editing ${hospitalName}`, 'info');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                if (confirm(`Are you sure you want to delete ${hospitalName}?`)) {
                    // Add row fade out animation
                    row.classList.add('deleting');
                    
                    setTimeout(() => {
                        row.remove();
                        updateDashboardStats();
                        showNotification(`${hospitalName} has been deleted`, 'success');
                    }, 500);
                }
            });
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                viewHospitalDetails(row);
            });
        }
    }
}

/**
 * Set up hospital action buttons
 */
function setupHospitalActionButtons() {
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
                
                // Open the hospital detail view modal
                viewHospitalDetails(row);
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
                    updateDashboardStats();
                }
            });
        });
    }
}

/**
 * View hospital details
 * @param {HTMLElement} row - Table row element with hospital data
 */
function viewHospitalDetails(row) {
    // Extract data from row
    const name = row.cells[0].textContent.trim();
    const address = row.cells[1].textContent.trim();
    
    // Extract capacity information
    const capacityEl = row.querySelector('.capacity-indicator span');
    const capacityText = capacityEl ? capacityEl.textContent.trim() : '';
    const capacityMatch = capacityText.match(/(\d+)%\s*\((\d+)\/(\d+)\)/);
    let capacityPercentage = 0;
    let occupiedBeds = 0;
    let totalBeds = 0;
    
    if (capacityMatch && capacityMatch.length >= 4) {
        capacityPercentage = parseInt(capacityMatch[1]);
        occupiedBeds = parseInt(capacityMatch[2]);
        totalBeds = parseInt(capacityMatch[3]);
    }
    
    const waitTime = row.cells[3].textContent.trim();
    
    // Extract status
    const statusEl = row.querySelector('.status-badge');
    const status = statusEl ? statusEl.textContent.trim() : 'Available';
    let statusClass = 'available';
    
    if (status === 'Critical') {
        statusClass = 'maintenance';
    } else if (status === 'High Load') {
        statusClass = 'warning';
    }
    
    // Get contact
    const contact = row.cells[5].textContent.trim();
    
    // Populate modal with data
    document.getElementById('view-hospital-name').textContent = name;
    document.getElementById('view-hospital-address').textContent = address;
    
    // Set coordinates (mock data for demo)
    document.getElementById('view-hospital-coordinates').textContent = '22.3072, 73.1812';
    
    // Set contact information
    document.getElementById('view-hospital-phone').textContent = contact;
    document.getElementById('view-hospital-emergency').textContent = contact; // Using same number for demo
    document.getElementById('view-hospital-email').textContent = `info@${name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    const websiteEl = document.getElementById('view-hospital-website');
    const website = `${name.toLowerCase().replace(/\s+/g, '')}.com`;
    websiteEl.textContent = website;
    websiteEl.href = `https://${website}`;
    
    // Set capacity information
    document.getElementById('view-hospital-beds-total').textContent = totalBeds;
    document.getElementById('view-hospital-beds-available').textContent = totalBeds - occupiedBeds;
    
    // Set mock data for other capacity fields
    document.getElementById('view-hospital-icu-beds').textContent = Math.round(totalBeds * 0.2); // 20% of total beds
    document.getElementById('view-hospital-ventilators').textContent = Math.round(totalBeds * 0.1); // 10% of total beds
    document.getElementById('view-hospital-wait-time').textContent = waitTime;
    
    // Set capacity bar
    const capacityBar = document.getElementById('view-hospital-capacity-bar');
    capacityBar.style.width = `${capacityPercentage}%`;
    document.getElementById('view-hospital-capacity').textContent = capacityText;
    
    // Set status badge
    const statusBadge = document.getElementById('view-hospital-status');
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${statusClass}`;
    
    // Set mock data for hospital type and services
    document.getElementById('view-hospital-type').textContent = name.includes('SSG') ? 'Government' : 'Private';
    
    // Set specialties based on hospital name for demo
    let specialties = 'General Medicine, Surgery, Pediatrics';
    if (name.includes('Cancer')) {
        specialties = 'Oncology, Radiology, Chemotherapy';
    } else if (name.includes('Heart') || name.includes('Cardiac')) {
        specialties = 'Cardiology, Cardiac Surgery, Vascular Medicine';
    }
    document.getElementById('view-hospital-specialties').textContent = specialties;
    
    // Set mock data for services
    document.getElementById('view-hospital-emergency-services').textContent = 'Yes';
    document.getElementById('view-hospital-trauma-center').textContent = status === 'Critical' ? 'No' : 'Yes';
    document.getElementById('view-hospital-blood-bank').textContent = 'Yes';
    document.getElementById('view-hospital-24x7').textContent = 'Yes';
    
    // Initialize hospital map
    setTimeout(() => {
        const mapElement = document.getElementById('view-hospital-map');
        if (mapElement && typeof L !== 'undefined') {
            // Check if map already initialized
            if (window.hospitalDetailMap) {
                window.hospitalDetailMap.remove();
            }
            
            // Create map
            window.hospitalDetailMap = L.map('view-hospital-map').setView([22.3072, 73.1812], 15);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(window.hospitalDetailMap);
            
            // Add marker
            L.marker([22.3072, 73.1812]).addTo(window.hospitalDetailMap)
                .bindPopup(`<b>${name}</b><br>${address}`).openPopup();
        }
    }, 300);
    
    // Set up edit button
    const editBtn = document.getElementById('view-hospital-edit');
    if (editBtn) {
        editBtn.onclick = () => {
            closeModal('view-hospital-modal');
            showNotification(`Editing ${name}`, 'info');
        };
    }
    
    // Set up close button
    const closeBtn = document.querySelector('#view-hospital-modal .close-modal-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            closeModal('view-hospital-modal');
        };
    }
    
    // Open modal
    openModal('view-hospital-modal');
}

/**
 * Update dashboard stats
 */
function updateDashboardStats() {
    // Get counts
    const hospitalCount = document.querySelectorAll('#hospitals-tab .data-table tbody tr').length;
    
    // Update hospital count on dashboard
    const hospitalStatValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (hospitalStatValue) {
        hospitalStatValue.textContent = hospitalCount;
    }
    
    // Update hospital summary information
    updateHospitalSummary();
    
    // Update last updated timestamp
    updateLastUpdatedTimestamp();
}

/**
 * Update hospital summary information
 */
function updateHospitalSummary() {
    // Get all hospital rows
    const hospitalRows = document.querySelectorAll('#hospitals-tab .data-table tbody tr');
    
    // Calculate totals
    let totalHospitals = hospitalRows.length;
    let totalBeds = 0;
    let availableBeds = 0;
    let criticalHospitals = 0;
    
    hospitalRows.forEach(row => {
        // Get capacity text which is in format "XX% (YY/ZZ)"
        const capacityText = row.querySelector('.capacity-indicator span').textContent;
        
        // Extract total and available beds using regex
        const bedMatch = capacityText.match(/\((\d+)\/(\d+)\)/);
        if (bedMatch && bedMatch.length >= 3) {
            const occupied = parseInt(bedMatch[1]);
            const total = parseInt(bedMatch[2]);
            
            totalBeds += total;
            availableBeds += (total - occupied);
        }
        
        // Check if hospital is critical
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge && statusBadge.textContent === 'Critical') {
            criticalHospitals++;
        }
    });
    
    // Update summary elements
    const totalHospitalsEl = document.getElementById('total-hospitals');
    const totalBedsEl = document.getElementById('total-beds');
    const availableBedsEl = document.getElementById('available-beds');
    const criticalHospitalsEl = document.getElementById('critical-hospitals');
    
    if (totalHospitalsEl) totalHospitalsEl.textContent = totalHospitals;
    if (totalBedsEl) totalBedsEl.textContent = totalBeds;
    if (availableBedsEl) availableBedsEl.textContent = availableBeds;
    if (criticalHospitalsEl) criticalHospitalsEl.textContent = criticalHospitals;
}

/**
 * Update last updated timestamp
 */
function updateLastUpdatedTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();
    
    // Format: "Today, 2:30 PM" or "Jan 15, 2023, 2:30 PM"
    const isToday = new Date().setHours(0,0,0,0) === new Date(now).setHours(0,0,0,0);
    const formattedDate = isToday ? `Today, ${timeString}` : `${dateString}, ${timeString}`;
    
    // Update the hospital section timestamp
    const hospitalLastUpdatedEl = document.getElementById('hospital-last-updated');
    if (hospitalLastUpdatedEl) {
        hospitalLastUpdatedEl.textContent = formattedDate;
    }
    
    // Update any other last-updated elements
    const lastUpdatedEls = document.querySelectorAll('.last-updated span:not(#hospital-last-updated)');
    lastUpdatedEls.forEach(el => {
        el.textContent = formattedDate;
    });
}

/**
 * Set up user management
 */
function setupUserManagement() {
    // Initialize users table with sample data
    const userTable = document.querySelector('#user-management .data-table');
    
    // Sample data for users
    const sampleUsers = [
        { id: 1, name: 'John Doe', role: 'System Admin', contact: '+91 98765 43210', email: 'john@example.com', status: 'active' },
        { id: 2, name: 'Jane Smith', role: 'Hospital Admin', contact: '+91 87654 32109', email: 'jane@hospital.com', status: 'active' },
        { id: 3, name: 'Mike Wilson', role: 'Driver', contact: '+91 76543 21098', email: 'mike@ambulance.com', status: 'active' },
        { id: 4, name: 'Sarah Johnson', role: 'Dispatcher', contact: '+91 65432 10987', email: 'sarah@dispatch.com', status: 'inactive' },
        { id: 5, name: 'Robert Brown', role: 'Doctor', contact: '+91 54321 09876', email: 'robert@hospital.com', status: 'active' }
    ];
    
    // Populate user table with sample data
    if (userTable) {
        const tbody = userTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            sampleUsers.forEach(user => {
                const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.role}</td>
                    <td>${user.contact}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(user.status)}</span></td>
                    <td>
                        <button class="action-btn view-btn" data-id="${user.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
        }
    }
    
    // Add User Modal Functionality
    const addUserBtn = document.querySelector('#add-user-btn');
    const addUserModal = document.querySelector('#add-user-modal');
    const closeModal = addUserModal?.querySelector('.close-modal');
    const cancelAddUser = document.querySelector('#cancel-add-user');
    const addUserForm = document.querySelector('#add-user-form');
    
    // Tab navigation for user form
    const userFormTabs = document.querySelectorAll('#add-user-form .form-tab');
    const userFormTabContents = document.querySelectorAll('#add-user-form .form-tab-content');
    const nextTabBtn = document.querySelector('#next-tab-user');
    const prevTabBtn = document.querySelector('#prev-tab-user');
    const submitUserBtn = document.querySelector('#add-user-form button[type="submit"]');
    const progressSegments = document.querySelectorAll('#add-user-form .progress-segment');
    
    let currentTabIndex = 0;
    
    // Functions to handle tab navigation
    function showUserTab(index) {
        userFormTabs.forEach(tab => tab.classList.remove('active'));
        userFormTabContents.forEach(content => content.classList.remove('active'));
        progressSegments.forEach(segment => segment.classList.remove('active'));
        
        userFormTabs[index].classList.add('active');
        userFormTabContents[index].classList.add('active');
        
        // Update progress bar
        for (let i = 0; i <= index; i++) {
            progressSegments[i].classList.add('active');
        }
        
        // Show/hide navigation buttons based on current tab
        if (index === 0) {
            prevTabBtn.style.display = 'none';
            nextTabBtn.style.display = 'block';
            submitUserBtn.style.display = 'none';
        } else if (index === userFormTabs.length - 1) {
            prevTabBtn.style.display = 'block';
            nextTabBtn.style.display = 'none';
            submitUserBtn.style.display = 'block';
        } else {
            prevTabBtn.style.display = 'block';
            nextTabBtn.style.display = 'block';
            submitUserBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Click events for tab buttons
    if (userFormTabs.length > 0) {
        userFormTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                if (validateCurrentTab(currentTabIndex)) {
                    showUserTab(index);
                } else {
                    showNotification("Please fill in all required fields in the current tab", "error");
                }
            });
        });
    }
    
    // Next and Previous button functionality
    if (nextTabBtn) {
        nextTabBtn.addEventListener('click', () => {
            if (validateCurrentTab(currentTabIndex)) {
                showUserTab(currentTabIndex + 1);
            } else {
                showNotification("Please fill in all required fields in the current tab", "error");
            }
        });
    }
    
    if (prevTabBtn) {
        prevTabBtn.addEventListener('click', () => {
            showUserTab(currentTabIndex - 1);
        });
    }
    
    // Function to validate current tab
    function validateCurrentTab(tabIndex) {
        const currentTabContent = userFormTabContents[tabIndex];
        
        if (!currentTabContent) return true;
        
        const requiredFields = currentTabContent.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Special validation for specific tabs
        if (tabIndex === 1) { // Account Info tab
            const password = document.querySelector('#user-password');
            const confirmPassword = document.querySelector('#user-confirm-password');
            
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                isValid = false;
                confirmPassword.classList.add('error');
                showNotification("Passwords do not match", "error");
            }
        }
        
        return isValid;
    }
    
    // Password validation
    const passwordInput = document.querySelector('#user-password');
    const confirmPasswordInput = document.querySelector('#user-confirm-password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.classList.add('error');
                } else {
                    confirmPasswordInput.classList.remove('error');
                }
            });
        }
    }
    
    // Function to validate password strength
    function validatePassword() {
        const password = passwordInput.value;
        
        // Update password requirement indicators
        updateRequirement('req-length', password.length >= 8);
        updateRequirement('req-uppercase', /[A-Z]/.test(password));
        updateRequirement('req-lowercase', /[a-z]/.test(password));
        updateRequirement('req-number', /[0-9]/.test(password));
        updateRequirement('req-special', /[^A-Za-z0-9]/.test(password));
    }
    
    // Function to update requirement indicators
    function updateRequirement(reqId, isValid) {
        const reqElement = document.getElementById(reqId);
        if (reqElement) {
            const icon = reqElement.querySelector('i');
            
            if (isValid) {
                icon.className = 'fas fa-check-circle';
                reqElement.classList.add('valid');
                reqElement.classList.remove('invalid');
            } else {
                icon.className = 'fas fa-times-circle';
                reqElement.classList.remove('valid');
                reqElement.classList.add('invalid');
            }
        }
    }
    
    // Role preset buttons
    const rolePresetButtons = document.querySelectorAll('.role-preset-btn');
    if (rolePresetButtons.length > 0) {
        rolePresetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const role = button.getAttribute('data-role');
                const roleSelect = document.querySelector('#user-role');
                
                if (roleSelect) {
                    roleSelect.value = role;
                    
                    // Set default permissions based on role
                    resetAllPermissions();
                    
                    switch (role) {
                        case 'system-admin':
                            setAllPermissions(true);
                            break;
                            
                        case 'hospital-admin':
                            setPermissionsByGroup(['Dashboard', 'Hospitals', 'Emergencies'], true);
                            break;
                            
                        case 'dispatcher':
                            setPermissionsByGroup(['Dashboard', 'Ambulances', 'Emergencies', 'Routes & Maps'], true);
                            break;
                            
                        case 'driver':
                            setBasicViewPermissions();
                            break;
                            
                        case 'observer':
                            setBasicViewPermissions();
                            break;
                    }
                    
                    showNotification(`Applied ${button.textContent.trim()} permission preset`, "success");
                }
            });
        });
    }
    
    // Permission management functions
    function setAllPermissions(value) {
        const permCheckboxes = document.querySelectorAll('#permissions-tab input[type="checkbox"]');
        permCheckboxes.forEach(checkbox => {
            checkbox.checked = value;
        });
    }
    
    function resetAllPermissions() {
        setAllPermissions(false);
    }
    
    function setBasicViewPermissions() {
        const viewPermissions = document.querySelectorAll('#permissions-tab input[id^="perm-view-"]');
        viewPermissions.forEach(checkbox => {
            checkbox.checked = true;
        });
    }
    
    function setPermissionsByGroup(groups, value) {
        groups.forEach(group => {
            const groupHeader = Array.from(document.querySelectorAll('#permissions-tab h5'))
                .find(header => header.textContent.trim() === group);
                
            if (groupHeader) {
                const permCategory = groupHeader.closest('.permission-category');
                if (permCategory) {
                    const checkboxes = permCategory.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = value;
                    });
                }
            }
        });
    }
    
    // Open Add User Modal
    if (addUserBtn && addUserModal) {
        addUserBtn.addEventListener('click', () => {
            addUserModal.style.display = 'block';
            // Reset form and show first tab
            addUserForm.reset();
            showUserTab(0);
            
            // Reset password indicators
            document.querySelectorAll('.password-requirements li').forEach(req => {
                req.classList.remove('valid', 'invalid');
                const icon = req.querySelector('i');
                if (icon) icon.className = 'fas fa-times-circle';
            });
        });
    }
    
    // Close Add User Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addUserModal.style.display = 'none';
        });
    }
    
    // Cancel button for Add User Modal
    if (cancelAddUser) {
        cancelAddUser.addEventListener('click', () => {
            addUserModal.style.display = 'none';
        });
    }
    
    // Add User Form Submission
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab(currentTabIndex)) {
                showNotification("Please fill in all required fields", "error");
                return;
            }
            
            // Get form data
            const userData = {
                name: document.querySelector('#user-name').value,
                username: document.querySelector('#user-username').value,
                email: document.querySelector('#user-email').value,
                contact: document.querySelector('#user-contact').value,
                role: document.querySelector('#user-role').value,
                status: document.querySelector('#user-status').value
            };
            
            // In a real application, you would send this data to a server
            console.log('User Data:', userData);
            
            // Add user to table (for demo purposes)
            addUserToTable(userData);
            
            // Update user count on dashboard
            const userCount = document.querySelector('#user-count');
            if (userCount) {
                userCount.textContent = parseInt(userCount.textContent) + 1;
            }
            
            // Close modal and show success message
            addUserModal.style.display = 'none';
            showNotification(`User ${userData.name} added successfully`, "success");
            
            // Update last updated time
            updateLastUpdatedTime();
        });
    }
    
    // Function to add a new user to the table
    function addUserToTable(userData) {
        const tbody = document.querySelector('#user-management .data-table tbody');
        
        if (tbody) {
            const lastId = sampleUsers.length > 0 ? sampleUsers[sampleUsers.length - 1].id : 0;
            const newId = lastId + 1;
            
            // Add to our sample data array
            sampleUsers.push({
                id: newId,
                name: userData.name,
                role: userData.role,
                contact: userData.contact,
                email: userData.email,
                status: userData.status
            });
            
            const statusClass = userData.status === 'active' ? 'status-active' : 'status-inactive';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userData.name}</td>
                <td>${userData.role}</td>
                <td>${userData.contact}</td>
                <td>${userData.email}</td>
                <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(userData.status)}</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${newId}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${newId}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${newId}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tbody.appendChild(row);
            
            // Add event listeners to new buttons
            const viewBtn = row.querySelector('.view-btn');
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    showNotification(`Viewing user ${userData.name}`, "info");
                });
            }
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showNotification(`Editing user ${userData.name}`, "info");
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete user ${userData.name}?`)) {
                        row.remove();
                        // Remove from our sample data array
                        const index = sampleUsers.findIndex(user => user.id === newId);
                        if (index !== -1) {
                            sampleUsers.splice(index, 1);
                        }
                        showNotification(`User ${userData.name} deleted`, "success");
                        
                        // Update user count on dashboard
                        const userCount = document.querySelector('#user-count');
                        if (userCount) {
                            userCount.textContent = parseInt(userCount.textContent) - 1;
                        }
                        
                        // Update last updated time
                        updateLastUpdatedTime();
                    }
                });
            }
        }
    }
    
    // Search functionality
    const userSearchInput = document.querySelector('#user-search');
    if (userSearchInput) {
        userSearchInput.addEventListener('input', () => {
            const searchValue = userSearchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#user-management .data-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
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
                
                // Update route details panel
                updateRouteDetailsPanel(routeId, from, to, row.cells[3].textContent.trim(), 
                                      row.cells[4].textContent.trim(), row.cells[5].textContent.trim());
                
                showNotification(`Viewing route ${routeId} on map`, 'info');
            });
        });
        
        // Initialize map controls and filters
        initRouteMapControls();
        initRouteFilters();
        initTrafficCharts();
    }
    
    // Add sample routes for demo
    addDemoRoutes();
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Smart Ambulance Routing System
 * Admin Panel Functionality
 */

/**
 * Initialize the admin panel
 */
function initAdminPanel() {
    console.log('Initializing admin panel');
    
    // Set up sidebar navigation
    setupSidebarNav();
    
    // Set up admin dashboard
    setupAdminDashboard();
    
    // Initialize charts
    initCharts();
    
    // Set up date range pickers
    setupDateRange();
    
    // Load active emergencies
    loadActiveEmergencies();
    
    // Set up ambulance management
    setupAmbulanceManagement();
    
    // Set up hospital management
    setupHospitalManagement();
    
    // Set up user management
    setupUserManagement();
    
    // Set up settings management
    setupSettingsManagement();
    
    // Set up emergency management
    setupEmergencyManagement();
    
    // Set up route management
    setupRouteManagement();
    
    // Set up modals
    setupModals();
    
    // Set up mobile sidebar toggle
    setupMobileSidebar();
    
    // Set up location buttons
    setupLocationButtons();
    
    // Initialize ambulance locations dashboard
    initAmbulanceLocationsDashboard();
    
    // Initialize maps
    setTimeout(() => {
        // Add a small delay to ensure DOM is fully loaded
        try {
            if (document.getElementById('admin-overview-map')) {
                // Initialize admin overview map
                const adminMap = L.map('admin-overview-map', {
                    center: [22.3072, 73.1812], // Vadodara, India
                    zoom: 12
                });
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(adminMap);
            }
            
            if (document.getElementById('ambulance-map')) {
                initAmbulanceMap();
            }
            
            if (document.getElementById('route-map')) {
                initRouteMap();
            }
        } catch (e) {
            console.error('Error initializing maps:', e);
        }
    }, 500);
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
    const addAmbulanceModal = document.getElementById('add-ambulance-modal');
    const addAmbulanceBtn = document.getElementById('add-ambulance-btn');
    const closeModal = addAmbulanceModal.querySelector('.close-modal');
    const cancelBtn = addAmbulanceModal.querySelector('.cancel-btn');
    const ambulanceForm = document.getElementById('add-ambulance-form');
    const refreshBtn = document.getElementById('refresh-ambulances-btn');
    
    // Tab navigation for ambulance form
    const formTabs = ambulanceForm.querySelectorAll('.form-tab');
    const formTabContents = ambulanceForm.querySelectorAll('.form-tab-content');
    const nextTabBtn = document.getElementById('next-tab-ambulance');
    const prevTabBtn = document.getElementById('prev-tab-ambulance');
    const submitBtn = ambulanceForm.querySelector('button[type="submit"]');
    
    let currentTabIndex = 0;
    
    // Function to show a specific tab
    function showTab(index) {
        formTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        formTabContents.forEach((content, i) => {
            if (i === index) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update progress bar
        const progressSegments = ambulanceForm.querySelectorAll('.progress-segment');
        progressSegments.forEach((segment, i) => {
            if (i <= index) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
        
        // Show/hide navigation buttons
        if (index === 0) {
            prevTabBtn.style.display = 'none';
        } else {
            prevTabBtn.style.display = 'block';
        }
        
        if (index === formTabs.length - 1) {
            nextTabBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextTabBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Tab click event
    formTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            showTab(index);
        });
    });
    
    // Next button click
    nextTabBtn.addEventListener('click', () => {
        if (validateCurrentTab()) {
            if (currentTabIndex < formTabs.length - 1) {
                showTab(currentTabIndex + 1);
            }
        }
    });
    
    // Previous button click
    prevTabBtn.addEventListener('click', () => {
        if (currentTabIndex > 0) {
            showTab(currentTabIndex - 1);
        }
    });
    
    // Validate current tab
    function validateCurrentTab() {
        let isValid = true;
        const currentTab = formTabContents[currentTabIndex];
        
        // Get all required inputs in the current tab
        const requiredInputs = currentTab.querySelectorAll('input[required], select[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('input-error');
                showNotification('Please fill all required fields marked with *', 'error');
            } else {
                input.classList.remove('input-error');
            }
        });
        
        // Specific validations based on tab
        if (currentTabIndex === 0) { // Basic Info tab
            const ambulanceId = document.getElementById('ambulance-id');
            if (ambulanceId.value && !/^AMB-\d{4}$/.test(ambulanceId.value)) {
                isValid = false;
                ambulanceId.classList.add('input-error');
                showNotification('Ambulance ID should be in format AMB-XXXX (e.g., AMB-1234)', 'error');
            }
            
            const registrationNo = document.getElementById('ambulance-registration');
            if (registrationNo.value && !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(registrationNo.value)) {
                isValid = false;
                registrationNo.classList.add('input-error');
                showNotification('Vehicle Registration should be in a valid format (e.g., MH02AB1234)', 'error');
            }
        } else if (currentTabIndex === 2) { // Staff tab
            const driverPhone = document.getElementById('driver-phone');
            if (driverPhone.value && !/^[0-9]{10}$/.test(driverPhone.value)) {
                isValid = false;
                driverPhone.classList.add('input-error');
                showNotification('Phone number should be a 10-digit number', 'error');
            }
        }
        
        return isValid;
    }

    // Handle form input events to remove error class
    ambulanceForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
    });

    // Initialize map for location selection
    const mapPickerBtn = document.getElementById('show-map-picker-ambulance');
    const mapPreview = document.getElementById('ambulance-map-preview');
    let mapInstance = null;
    
    if (mapPickerBtn && mapPreview && typeof google !== 'undefined' && google.maps) {
        mapPickerBtn.addEventListener('click', () => {
            if (!mapInstance) {
                const defaultLocation = { lat: 22.3072, lng: 73.1812 }; // Vadodara
                mapInstance = new google.maps.Map(mapPreview, {
                    center: defaultLocation,
                    zoom: 12
                });
                
                const marker = new google.maps.Marker({
                    position: defaultLocation,
                    map: mapInstance,
                    draggable: true
                });
                
                // Update location inputs when marker is moved
                google.maps.event.addListener(marker, 'dragend', function() {
                    const position = marker.getPosition();
                    document.getElementById('ambulance-lat').value = position.lat().toFixed(6);
                    document.getElementById('ambulance-lng').value = position.lng().toFixed(6);
                });
                
                // Click on map to move marker
                google.maps.event.addListener(mapInstance, 'click', function(event) {
                    marker.setPosition(event.latLng);
                    document.getElementById('ambulance-lat').value = event.latLng.lat().toFixed(6);
                    document.getElementById('ambulance-lng').value = event.latLng.lng().toFixed(6);
                });
            }
        });
    }
    
    // Use current location button
    const autoLocateBtn = ambulanceForm.querySelector('.auto-locate');
    if (autoLocateBtn) {
        autoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        document.getElementById('ambulance-lat').value = lat.toFixed(6);
                        document.getElementById('ambulance-lng').value = lng.toFixed(6);
                        
                        // Update map if available
                        if (mapInstance) {
                            const currentLocation = { lat, lng };
                            mapInstance.setCenter(currentLocation);
                            
                            // Find and update marker
                            const markers = mapInstance.markers || [];
                            if (markers.length > 0) {
                                markers[0].setPosition(currentLocation);
                            } else {
                                new google.maps.Marker({
                                    position: currentLocation,
                                    map: mapInstance,
                                    draggable: true
                                });
                            }
                        }
                        
                        showNotification('Current location detected and set', 'success');
                    },
                    (error) => {
                        showNotification('Unable to get current location: ' + error.message, 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }

    if (addAmbulanceBtn) {
        addAmbulanceBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'block';
            // Reset the form and show first tab
            ambulanceForm.reset();
            showTab(0);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (ambulanceForm) {
        ambulanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab()) {
                return;
            }
            
            // Collect data from the form
            const ambulanceData = {
                id: document.getElementById('ambulance-id').value,
                registration: document.getElementById('ambulance-registration').value,
                type: document.getElementById('ambulance-type').value,
                make: document.getElementById('ambulance-make').value,
                year: document.getElementById('ambulance-year').value,
                vin: document.getElementById('ambulance-vin')?.value || '',
                capacity: document.getElementById('ambulance-capacity').value,
                fuelType: document.getElementById('ambulance-fuel-type').value,
                status: document.getElementById('ambulance-status').value,
                
                // Vehicle details
                insurance: document.getElementById('ambulance-insurance').value,
                lastService: document.getElementById('ambulance-last-service').value,
                nextService: document.getElementById('ambulance-next-service').value,
                mileage: document.getElementById('ambulance-mileage').value,
                
                // Equipment
                equipment: {
                    // Basic equipment
                    firstAid: document.getElementById('equipment-first-aid').checked,
                    oxygen: document.getElementById('equipment-oxygen').checked,
                    stretcher: document.getElementById('equipment-stretcher').checked,
                    wheelchair: document.getElementById('equipment-wheelchair').checked,
                    
                    // Advanced equipment
                    aed: document.getElementById('equipment-aed').checked,
                    ventilator: document.getElementById('equipment-ventilator').checked,
                    ecg: document.getElementById('equipment-ecg').checked,
                    suction: document.getElementById('equipment-suction').checked,
                    infusion: document.getElementById('equipment-infusion').checked,
                    oximeter: document.getElementById('equipment-oximeter').checked,
                    
                    // Other equipment
                    other: document.getElementById('equipment-others').value,
                    
                    // Medication
                    medication: document.getElementById('equipment-medication').value,
                    
                    // New equipment fields with quantities
                    oxygenQuantity: document.getElementById('oxygen-quantity')?.value || '1',
                    stretcherType: document.getElementById('stretcher-type')?.value || 'Standard',
                    ventilatorType: document.getElementById('ventilator-type')?.value || 'Standard',
                },
                
                // Staff information
                driver: {
                    name: document.getElementById('driver-name').value,
                    phone: document.getElementById('driver-phone').value,
                    license: document.getElementById('driver-license').value,
                    licenseExpiry: document.getElementById('driver-license-expiry').value,
                    age: document.getElementById('driver-age')?.value || '',
                    experience: document.getElementById('driver-experience')?.value || '',
                    shift: document.getElementById('driver-shift')?.value || '',
                    address: document.getElementById('driver-address')?.value || '',
                },
                
                paramedic: {
                    name: document.getElementById('paramedic-name').value,
                    phone: document.getElementById('paramedic-phone').value,
                    qualification: document.getElementById('paramedic-qualification')?.value || '',
                    experience: document.getElementById('paramedic-experience')?.value || '',
                    license: document.getElementById('paramedic-license')?.value || '',
                    shift: document.getElementById('paramedic-shift')?.value || '',
                    emergencyContact: document.getElementById('paramedic-emergency-contact')?.value || '',
                    specializations: Array.from(document.getElementById('paramedic-specializations')?.selectedOptions || [])
                        .map(option => option.value),
                },
                
                additionalStaff: document.getElementById('additional-staff').value,
                
                // Maintenance information
                maintenance: {
                    type: document.getElementById('maintenance-type')?.value || '',
                    intervalKm: document.getElementById('maintenance-interval-km')?.value || '',
                    intervalDays: document.getElementById('maintenance-interval-days')?.value || '',
                    vendor: document.getElementById('maintenance-vendor')?.value || '',
                    notes: document.getElementById('maintenance-notes')?.value || '',
                },
                
                // Documentation
                documents: {
                    registration: {
                        status: document.getElementById('doc-registration')?.checked || false,
                        validity: document.getElementById('doc-registration')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    insurance: {
                        status: document.getElementById('doc-insurance')?.checked || false,
                        validity: document.getElementById('doc-insurance')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    fitness: {
                        status: document.getElementById('doc-fitness')?.checked || false,
                        validity: document.getElementById('doc-fitness')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    pollution: {
                        status: document.getElementById('doc-pollution')?.checked || false,
                        validity: document.getElementById('doc-pollution')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    permit: {
                        status: document.getElementById('doc-permit')?.checked || false,
                        validity: document.getElementById('doc-permit')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    tax: {
                        status: document.getElementById('doc-tax')?.checked || false,
                        validity: document.getElementById('doc-tax')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    notes: document.getElementById('documentation-notes')?.value || '',
                },
                
                // Location information
                location: {
                    hospital: document.getElementById('ambulance-hospital')?.value || '',
                    baseLocation: document.getElementById('ambulance-base-location')?.value || '',
                    serviceArea: document.getElementById('ambulance-service-area')?.value || '',
                    responseRadius: document.getElementById('ambulance-response-radius')?.value || '',
                    distanceLimit: document.getElementById('distance-limit-daily')?.value || '',
                    coverageArea: document.getElementById('coverage-area')?.value || '',
                    currentLocation: {
                        lat: document.getElementById('ambulance-lat')?.value || '',
                        lng: document.getElementById('ambulance-lng')?.value || '',
                    }
                },
                
                timestamp: Date.now()
            };
            
            // For demonstration, show the data in a notification
            console.log('Ambulance Data:', ambulanceData);
            
            // Save to localStorage (or send to server in production)
            const ambulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
            ambulances.push(ambulanceData);
            localStorage.setItem('ambulances', JSON.stringify(ambulances));
            
            // Close modal and show success notification
            addAmbulanceModal.style.display = 'none';
            showNotification('Ambulance added successfully!', 'success');
            
            // Refresh the ambulance list
            loadAmbulances();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // In a real scenario, this would fetch from API
            // For demo, we'll just show a notification
            showNotification('Ambulance list refreshed', 'info');
        });
    }

    // Add sample ambulances for demo
    addDemoAmbulances();
}

function addAmbulanceToTable(ambulanceData) {
    const ambulanceTable = document.querySelector('.ambulance-table tbody');
    
    if (!ambulanceTable) return;
    
    const newRow = document.createElement('tr');
    newRow.classList.add('new-row-highlight');
    
    // Create cells with ambulance data
    newRow.innerHTML = `
        <td>${ambulanceData.id}</td>
        <td>${getAmbulanceTypeLabel(ambulanceData.type)}</td>
        <td>${ambulanceData.driver.name || 'N/A'}</td>
        <td>${ambulanceData.baseLocation}</td>
        <td>${ambulanceData.status ? capitalizeFirstLetter(ambulanceData.status) : 'Unknown'}</td>
        <td>
            <div class="action-buttons">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
                <button class="view-btn"><i class="fas fa-eye"></i></button>
            </div>
        </td>
    `;
    
    // Add event listeners for the action buttons
    const editBtn = newRow.querySelector('.edit-btn');
    const deleteBtn = newRow.querySelector('.delete-btn');
    const viewBtn = newRow.querySelector('.view-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showNotification('Edit functionality coming soon', 'info');
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            newRow.classList.add('delete-animation');
            setTimeout(() => {
                ambulanceTable.removeChild(newRow);
                showNotification('Ambulance removed successfully', 'success');
            }, 500);
        });
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            showNotification('View details functionality coming soon', 'info');
        });
    }
    
    // Add to table and remove highlight after animation
    ambulanceTable.appendChild(newRow);
    setTimeout(() => {
        newRow.classList.remove('new-row-highlight');
    }, 3000);
}

function getAmbulanceTypeLabel(type) {
    const types = {
        'type1': 'Type I (Basic)',
        'type2': 'Type II (Mobile Emergency)',
        'type3': 'Type III (Advanced Life Support)',
        'type4': 'Mobile ICU',
        'neonatal': 'Neonatal',
        'mortuary': 'Mortuary'
    };
    
    return types[type] || 'Unknown Type';
}

function addDemoAmbulances() {
    const ambulances = [
        {
            id: 'AMB-1001',
            registration: 'GJ06AB1234',
            type: 'type2',
            make: 'Tata Winger',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Rajesh Kumar',
                phone: '9876543210'
            },
            baseLocation: 'SSG Hospital',
            hospital: 'SSG Hospital'
        },
        {
            id: 'AMB-1002',
            registration: 'GJ06CD5678',
            type: 'type3',
            make: 'Force Traveller',
            year: '2021',
            capacity: '3',
            fuelType: 'diesel',
            status: 'dispatched',
            driver: {
                name: 'Suresh Patel',
                phone: '9876543211'
            },
            baseLocation: 'Bhailal Amin General Hospital',
            hospital: 'Bhailal Amin General Hospital'
        },
        {
            id: 'AMB-1003',
            registration: 'GJ06EF9012',
            type: 'type4',
            make: 'Tata Winger',
            year: '2023',
            capacity: '1',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Amit Singh',
                phone: '9876543212'
            },
            baseLocation: 'Sterling Hospital',
            hospital: 'Sterling Hospital'
        },
        {
            id: 'AMB-1004',
            registration: 'GJ06GH3456',
            type: 'neonatal',
            make: 'Force Traveller',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'maintenance',
            driver: {
                name: 'Dinesh Shah',
                phone: '9876543213'
            },
            baseLocation: 'Baroda Medical College Hospital',
            hospital: 'Baroda Medical College Hospital'
        }
    ];
    
    ambulances.forEach(ambulance => {
        addAmbulanceToTable(ambulance);
    });
}

/**
 * Set up hospital management
 */
function setupHospitalManagement() {
    // Add hospital button
    const addHospitalBtn = document.getElementById('add-hospital-btn');
    if (addHospitalBtn) {
        addHospitalBtn.addEventListener('click', () => {
            // Show the add hospital form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'block';
                
                // Add tooltips to form fields for better guidance
                addFormTooltips();
                
                // Add dynamic field interactions
                setupDynamicFormFields();
                
                // Scroll to the form
                formContainer.scrollIntoView({ behavior: 'smooth' });
                showNotification('Please fill in the hospital details', 'info');
            }
        });
    }
    
    // Handle form submission
    const hospitalForm = document.getElementById('add-hospital-form');
    if (hospitalForm) {
        hospitalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!validateHospitalForm()) {
                showNotification('Please correct the errors in the form', 'error');
                return;
            }
            
            // Get all the form values
            const hospitalName = document.getElementById('hospital-name').value;
            const hospitalType = document.getElementById('hospital-type').value;
            const hospitalAddress = document.getElementById('hospital-address').value;
            const hospitalArea = document.getElementById('hospital-area').value;
            const hospitalCity = document.getElementById('hospital-city').value;
            const hospitalPincode = document.getElementById('hospital-pincode').value;
            
            const hospitalPhone = document.getElementById('hospital-phone').value;
            const hospitalEmergencyPhone = document.getElementById('hospital-emergency-phone').value;
            const hospitalEmail = document.getElementById('hospital-email').value;
            const hospitalWebsite = document.getElementById('hospital-website').value;
            
            const hospitalBedsTotal = document.getElementById('hospital-beds-total').value;
            const hospitalBedsAvailable = document.getElementById('hospital-beds-available').value;
            const hospitalICUBeds = document.getElementById('hospital-icu-beds')?.value || 0;
            const hospitalVentilators = document.getElementById('hospital-ventilators')?.value || 0;
            const hospitalWaitTime = document.getElementById('hospital-wait-time').value;
            
            const hospitalLat = document.getElementById('hospital-lat').value;
            const hospitalLng = document.getElementById('hospital-lng').value;
            
            // Get specialty information
            const hospitalSpecialties = document.getElementById('hospital-specialties').value;
            const hospitalEmergency = document.getElementById('hospital-emergency')?.checked || false;
            const hospitalTraumaCenter = document.getElementById('hospital-trauma-center')?.checked || false;
            const hospitalBloodBank = document.getElementById('hospital-blood-bank')?.checked || false;
            const hospital24x7 = document.getElementById('hospital-24x7')?.checked || false;
            
            // Check required fields
            if (!hospitalName || !hospitalAddress || !hospitalBedsTotal || !hospitalBedsAvailable || !hospitalWaitTime) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Calculate capacity percentage
            const totalBeds = parseInt(hospitalBedsTotal);
            const availableBeds = parseInt(hospitalBedsAvailable);
            const capacityPercentage = Math.round(((totalBeds - availableBeds) / totalBeds) * 100);
            
            // Determine status based on capacity
            let status = 'Available';
            if (capacityPercentage >= 90) {
                status = 'Critical';
            } else if (capacityPercentage >= 75) {
                status = 'High Load';
            }
            
            // Construct full address
            const fullAddress = `${hospitalAddress}, ${hospitalArea ? hospitalArea + ', ' : ''}${hospitalCity}${hospitalPincode ? ', ' + hospitalPincode : ''}`;
            
            // Create a rich hospital object with all details
            const hospitalData = {
                name: hospitalName,
                type: hospitalType,
                address: fullAddress,
                capacity: {
                    percentage: capacityPercentage,
                    available: availableBeds,
                    total: totalBeds,
                    icu: hospitalICUBeds,
                    ventilators: hospitalVentilators
                },
                contact: {
                    phone: hospitalPhone,
                    emergency: hospitalEmergencyPhone,
                    email: hospitalEmail,
                    website: hospitalWebsite
                },
                location: {
                    lat: hospitalLat,
                    lng: hospitalLng
                },
                services: {
                    specialties: hospitalSpecialties,
                    emergency: hospitalEmergency,
                    traumaCenter: hospitalTraumaCenter,
                    bloodBank: hospitalBloodBank,
                    open24x7: hospital24x7
                },
                waitTime: hospitalWaitTime + ' mins',
                status: status
            };
            
            // Add the hospital to the table
            addHospitalToTable(hospitalData);
            
            // Show confirmation with more details
            showNotification(`Hospital "${hospitalName}" has been added successfully with ${totalBeds} beds`, 'success');
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Hide the form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
            
            // Reset the form
            hospitalForm.reset();
        });
    }
    
    // Set up form toggle buttons
    const toggleFormBtns = document.querySelectorAll('.toggle-form');
    toggleFormBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const formContainer = document.getElementById(targetId + '-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
        });
    });
    
    // Set up hospital action buttons
    setupHospitalActionButtons();
}

/**
 * Add tooltips to hospital form fields
 */
function addFormTooltips() {
    // Add tooltips to form fields to provide guidance
    const tooltips = {
        'hospital-name': 'Enter the official name of the hospital',
        'hospital-type': 'Select the type of hospital (Government, Private, etc.)',
        'hospital-address': 'Enter the street address of the hospital',
        'hospital-area': 'Enter the area or locality name',
        'hospital-city': 'Enter the city name',
        'hospital-pincode': 'Enter the 6-digit PIN code',
        'hospital-phone': 'Enter the main contact number with country code',
        'hospital-emergency-phone': 'Enter emergency contact number',
        'hospital-email': 'Enter official email address',
        'hospital-website': 'Enter complete website URL including https://',
        'hospital-beds-total': 'Enter total number of beds in the hospital',
        'hospital-beds-available': 'Enter number of currently available beds',
        'hospital-icu-beds': 'Enter number of ICU beds',
        'hospital-ventilators': 'Enter number of ventilators available',
        'hospital-ambulances': 'Enter number of ambulances operated by the hospital',
        'hospital-wait-time': 'Enter average emergency wait time in minutes',
        'hospital-specialties': 'Enter medical specialties separated by commas',
        'hospital-lat': 'Enter latitude coordinate (use buttons below to get coordinates)',
        'hospital-lng': 'Enter longitude coordinate (use buttons below to get coordinates)'
    };
    
    // Apply tooltips to elements
    for (const [id, tooltip] of Object.entries(tooltips)) {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('title', tooltip);
            
            // Add input validation feedback
            if (element.hasAttribute('required')) {
                element.addEventListener('input', () => {
                    if (element.value.trim() === '') {
                        element.classList.add('input-error');
                    } else {
                        element.classList.remove('input-error');
                    }
                });
            }
        }
    }
}

/**
 * Setup dynamic form field interactions
 */
function setupDynamicFormFields() {
    // Add interactions between related fields
    
    // Update available beds validation to be less than total beds
    const totalBedsInput = document.getElementById('hospital-beds-total');
    const availableBedsInput = document.getElementById('hospital-beds-available');
    
    if (totalBedsInput && availableBedsInput) {
        totalBedsInput.addEventListener('input', () => {
            const totalBeds = parseInt(totalBedsInput.value) || 0;
            availableBedsInput.setAttribute('max', totalBeds);
            
            // Validate available beds against total beds
            const availableBeds = parseInt(availableBedsInput.value) || 0;
            if (availableBeds > totalBeds) {
                availableBedsInput.value = totalBeds;
            }
        });
    }
    
    // Update hospital type dependent fields
    const hospitalTypeSelect = document.getElementById('hospital-type');
    if (hospitalTypeSelect) {
        hospitalTypeSelect.addEventListener('change', () => {
            const type = hospitalTypeSelect.value;
            
            // Show/hide fields based on hospital type
            const traumaCenterCheckbox = document.getElementById('hospital-trauma-center');
            if (traumaCenterCheckbox) {
                if (type === 'government' || type === 'speciality') {
                    traumaCenterCheckbox.parentElement.style.display = 'block';
                } else {
                    traumaCenterCheckbox.checked = false;
                    traumaCenterCheckbox.parentElement.style.display = 'none';
                }
            }
            
            // Update placeholders for specialties based on type
            const specialtiesInput = document.getElementById('hospital-specialties');
            if (specialtiesInput) {
                if (type === 'speciality') {
                    specialtiesInput.placeholder = 'Primary specialty (e.g. Cancer, Cardiac, Orthopedic)';
                } else {
                    specialtiesInput.placeholder = 'e.g. Cardiology, Neurology, Orthopedics';
                }
            }
        });
    }
    
    // Add coordinate fetching functionality
    const latInput = document.getElementById('hospital-lat');
    const lngInput = document.getElementById('hospital-lng');
    const autoLocateBtn = document.querySelector('.auto-locate[data-target="hospital"]');
    
    if (latInput && lngInput && autoLocateBtn) {
        // Use browser geolocation API
        autoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                autoLocateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
                autoLocateBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        latInput.value = position.coords.latitude.toFixed(6);
                        lngInput.value = position.coords.longitude.toFixed(6);
                        
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        
                        showNotification('Location updated successfully', 'success');
                        
                        // Highlight the fields to show they've been updated
                        latInput.classList.add('field-updated');
                        lngInput.classList.add('field-updated');
                        
                        setTimeout(() => {
                            latInput.classList.remove('field-updated');
                            lngInput.classList.remove('field-updated');
                        }, 2000);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        showNotification('Could not get your location. Please try again or enter manually.', 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }
}

/**
 * Validate hospital form
 * @returns {boolean} Whether the form is valid
 */
function validateHospitalForm() {
    let isValid = true;
    const requiredFields = [
        'hospital-name',
        'hospital-type',
        'hospital-address',
        'hospital-area',
        'hospital-city',
        'hospital-pincode',
        'hospital-phone',
        'hospital-email',
        'hospital-beds-total',
        'hospital-beds-available',
        'hospital-wait-time',
        'hospital-lat',
        'hospital-lng'
    ];
    
    // Check required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim() === '') {
            field.classList.add('input-error');
            isValid = false;
            
            // Add error message below the field
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else if (field) {
            field.classList.remove('input-error');
            
            // Remove error message if exists
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                field.parentNode.removeChild(field.nextElementSibling);
            }
        }
    });
    
    // Validate specialty field has at least one specialty
    const specialtiesField = document.getElementById('hospital-specialties');
    if (specialtiesField && specialtiesField.value.trim() === '') {
        specialtiesField.classList.add('input-error');
        if (!specialtiesField.nextElementSibling || !specialtiesField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter at least one specialty';
            specialtiesField.parentNode.insertBefore(errorMsg, specialtiesField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate available beds <= total beds
    const totalBedsField = document.getElementById('hospital-beds-total');
    const availableBedsField = document.getElementById('hospital-beds-available');
    
    if (totalBedsField && availableBedsField && 
        parseInt(availableBedsField.value) > parseInt(totalBedsField.value)) {
        availableBedsField.classList.add('input-error');
        if (!availableBedsField.nextElementSibling || !availableBedsField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Available beds cannot exceed total beds';
            availableBedsField.parentNode.insertBefore(errorMsg, availableBedsField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate email format
    const emailField = document.getElementById('hospital-email');
    if (emailField && emailField.value.trim() !== '') {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('input-error');
            if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid email address';
                emailField.parentNode.insertBefore(errorMsg, emailField.nextSibling);
            }
            isValid = false;
        }
    }
    
    // Validate pincode format (6 digits)
    const pincodeField = document.getElementById('hospital-pincode');
    if (pincodeField && pincodeField.value.trim() !== '') {
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincodeField.value)) {
            pincodeField.classList.add('input-error');
            if (!pincodeField.nextElementSibling || !pincodeField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid 6-digit PIN code';
                pincodeField.parentNode.insertBefore(errorMsg, pincodeField.nextSibling);
            }
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Add hospital to table
 * @param {Object} hospital - Hospital data
 */
function addHospitalToTable(hospital) {
    const hospitalsTable = document.querySelector('#hospitals-tab .data-table tbody');
    if (hospitalsTable) {
        // Create new table row
        const row = document.createElement('tr');
        
        // Create status badge class based on status
        let statusClass = 'available';
        if (hospital.status === 'Critical') {
            statusClass = 'maintenance';
        } else if (hospital.status === 'High Load') {
            statusClass = 'warning';
        }
        
        // Set row content with enhanced data display
        row.innerHTML = `
            <td>${hospital.name}</td>
            <td>${hospital.address}</td>
            <td>
                <div class="capacity-indicator">
                    <div class="capacity-bar-container">
                        <div class="capacity-bar" style="width: ${hospital.capacity.percentage}%"></div>
                    </div>
                    <span>${hospital.capacity.percentage}% (${hospital.capacity.total - hospital.capacity.available}/${hospital.capacity.total})</span>
                </div>
            </td>
            <td>${hospital.waitTime}</td>
            <td><span class="status-badge ${statusClass}">${hospital.status}</span></td>
            <td>${hospital.contact.phone || hospital.contact}</td>
            <td class="actions-cell">
                <button class="action-btn edit" title="Edit hospital details"><i class="fas fa-edit"></i></button>
                <button class="action-btn view" title="View hospital details"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" title="Delete hospital"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add row to table with animation
        row.classList.add('new-row');
        hospitalsTable.appendChild(row);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            row.classList.remove('new-row');
        }, 1000);
        
        // Add event listeners to the new buttons
        const editBtn = row.querySelector('.action-btn.edit');
        const deleteBtn = row.querySelector('.action-btn.delete');
        const viewBtn = row.querySelector('.action-btn.view');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                showNotification(`Editing ${hospitalName}`, 'info');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                if (confirm(`Are you sure you want to delete ${hospitalName}?`)) {
                    // Add row fade out animation
                    row.classList.add('deleting');
                    
                    setTimeout(() => {
                        row.remove();
                        updateDashboardStats();
                        showNotification(`${hospitalName} has been deleted`, 'success');
                    }, 500);
                }
            });
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                viewHospitalDetails(row);
            });
        }
    }
}

/**
 * Set up hospital action buttons
 */
function setupHospitalActionButtons() {
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
                
                // Open the hospital detail view modal
                viewHospitalDetails(row);
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
                    updateDashboardStats();
                }
            });
        });
    }
}

/**
 * View hospital details
 * @param {HTMLElement} row - Table row element with hospital data
 */
function viewHospitalDetails(row) {
    // Extract data from row
    const name = row.cells[0].textContent.trim();
    const address = row.cells[1].textContent.trim();
    
    // Extract capacity information
    const capacityEl = row.querySelector('.capacity-indicator span');
    const capacityText = capacityEl ? capacityEl.textContent.trim() : '';
    const capacityMatch = capacityText.match(/(\d+)%\s*\((\d+)\/(\d+)\)/);
    let capacityPercentage = 0;
    let occupiedBeds = 0;
    let totalBeds = 0;
    
    if (capacityMatch && capacityMatch.length >= 4) {
        capacityPercentage = parseInt(capacityMatch[1]);
        occupiedBeds = parseInt(capacityMatch[2]);
        totalBeds = parseInt(capacityMatch[3]);
    }
    
    const waitTime = row.cells[3].textContent.trim();
    
    // Extract status
    const statusEl = row.querySelector('.status-badge');
    const status = statusEl ? statusEl.textContent.trim() : 'Available';
    let statusClass = 'available';
    
    if (status === 'Critical') {
        statusClass = 'maintenance';
    } else if (status === 'High Load') {
        statusClass = 'warning';
    }
    
    // Get contact
    const contact = row.cells[5].textContent.trim();
    
    // Populate modal with data
    document.getElementById('view-hospital-name').textContent = name;
    document.getElementById('view-hospital-address').textContent = address;
    
    // Set coordinates (mock data for demo)
    document.getElementById('view-hospital-coordinates').textContent = '22.3072, 73.1812';
    
    // Set contact information
    document.getElementById('view-hospital-phone').textContent = contact;
    document.getElementById('view-hospital-emergency').textContent = contact; // Using same number for demo
    document.getElementById('view-hospital-email').textContent = `info@${name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    const websiteEl = document.getElementById('view-hospital-website');
    const website = `${name.toLowerCase().replace(/\s+/g, '')}.com`;
    websiteEl.textContent = website;
    websiteEl.href = `https://${website}`;
    
    // Set capacity information
    document.getElementById('view-hospital-beds-total').textContent = totalBeds;
    document.getElementById('view-hospital-beds-available').textContent = totalBeds - occupiedBeds;
    
    // Set mock data for other capacity fields
    document.getElementById('view-hospital-icu-beds').textContent = Math.round(totalBeds * 0.2); // 20% of total beds
    document.getElementById('view-hospital-ventilators').textContent = Math.round(totalBeds * 0.1); // 10% of total beds
    document.getElementById('view-hospital-wait-time').textContent = waitTime;
    
    // Set capacity bar
    const capacityBar = document.getElementById('view-hospital-capacity-bar');
    capacityBar.style.width = `${capacityPercentage}%`;
    document.getElementById('view-hospital-capacity').textContent = capacityText;
    
    // Set status badge
    const statusBadge = document.getElementById('view-hospital-status');
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${statusClass}`;
    
    // Set mock data for hospital type and services
    document.getElementById('view-hospital-type').textContent = name.includes('SSG') ? 'Government' : 'Private';
    
    // Set specialties based on hospital name for demo
    let specialties = 'General Medicine, Surgery, Pediatrics';
    if (name.includes('Cancer')) {
        specialties = 'Oncology, Radiology, Chemotherapy';
    } else if (name.includes('Heart') || name.includes('Cardiac')) {
        specialties = 'Cardiology, Cardiac Surgery, Vascular Medicine';
    }
    document.getElementById('view-hospital-specialties').textContent = specialties;
    
    // Set mock data for services
    document.getElementById('view-hospital-emergency-services').textContent = 'Yes';
    document.getElementById('view-hospital-trauma-center').textContent = status === 'Critical' ? 'No' : 'Yes';
    document.getElementById('view-hospital-blood-bank').textContent = 'Yes';
    document.getElementById('view-hospital-24x7').textContent = 'Yes';
    
    // Initialize hospital map
    setTimeout(() => {
        const mapElement = document.getElementById('view-hospital-map');
        if (mapElement && typeof L !== 'undefined') {
            // Check if map already initialized
            if (window.hospitalDetailMap) {
                window.hospitalDetailMap.remove();
            }
            
            // Create map
            window.hospitalDetailMap = L.map('view-hospital-map').setView([22.3072, 73.1812], 15);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(window.hospitalDetailMap);
            
            // Add marker
            L.marker([22.3072, 73.1812]).addTo(window.hospitalDetailMap)
                .bindPopup(`<b>${name}</b><br>${address}`).openPopup();
        }
    }, 300);
    
    // Set up edit button
    const editBtn = document.getElementById('view-hospital-edit');
    if (editBtn) {
        editBtn.onclick = () => {
            closeModal('view-hospital-modal');
            showNotification(`Editing ${name}`, 'info');
        };
    }
    
    // Set up close button
    const closeBtn = document.querySelector('#view-hospital-modal .close-modal-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            closeModal('view-hospital-modal');
        };
    }
    
    // Open modal
    openModal('view-hospital-modal');
}

/**
 * Update dashboard stats
 */
function updateDashboardStats() {
    // Get counts
    const hospitalCount = document.querySelectorAll('#hospitals-tab .data-table tbody tr').length;
    
    // Update hospital count on dashboard
    const hospitalStatValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (hospitalStatValue) {
        hospitalStatValue.textContent = hospitalCount;
    }
    
    // Update hospital summary information
    updateHospitalSummary();
    
    // Update last updated timestamp
    updateLastUpdatedTimestamp();
}

/**
 * Update hospital summary information
 */
function updateHospitalSummary() {
    // Get all hospital rows
    const hospitalRows = document.querySelectorAll('#hospitals-tab .data-table tbody tr');
    
    // Calculate totals
    let totalHospitals = hospitalRows.length;
    let totalBeds = 0;
    let availableBeds = 0;
    let criticalHospitals = 0;
    
    hospitalRows.forEach(row => {
        // Get capacity text which is in format "XX% (YY/ZZ)"
        const capacityText = row.querySelector('.capacity-indicator span').textContent;
        
        // Extract total and available beds using regex
        const bedMatch = capacityText.match(/\((\d+)\/(\d+)\)/);
        if (bedMatch && bedMatch.length >= 3) {
            const occupied = parseInt(bedMatch[1]);
            const total = parseInt(bedMatch[2]);
            
            totalBeds += total;
            availableBeds += (total - occupied);
        }
        
        // Check if hospital is critical
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge && statusBadge.textContent === 'Critical') {
            criticalHospitals++;
        }
    });
    
    // Update summary elements
    const totalHospitalsEl = document.getElementById('total-hospitals');
    const totalBedsEl = document.getElementById('total-beds');
    const availableBedsEl = document.getElementById('available-beds');
    const criticalHospitalsEl = document.getElementById('critical-hospitals');
    
    if (totalHospitalsEl) totalHospitalsEl.textContent = totalHospitals;
    if (totalBedsEl) totalBedsEl.textContent = totalBeds;
    if (availableBedsEl) availableBedsEl.textContent = availableBeds;
    if (criticalHospitalsEl) criticalHospitalsEl.textContent = criticalHospitals;
}

/**
 * Update last updated timestamp
 */
function updateLastUpdatedTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();
    
    // Format: "Today, 2:30 PM" or "Jan 15, 2023, 2:30 PM"
    const isToday = new Date().setHours(0,0,0,0) === new Date(now).setHours(0,0,0,0);
    const formattedDate = isToday ? `Today, ${timeString}` : `${dateString}, ${timeString}`;
    
    // Update the hospital section timestamp
    const hospitalLastUpdatedEl = document.getElementById('hospital-last-updated');
    if (hospitalLastUpdatedEl) {
        hospitalLastUpdatedEl.textContent = formattedDate;
    }
    
    // Update any other last-updated elements
    const lastUpdatedEls = document.querySelectorAll('.last-updated span:not(#hospital-last-updated)');
    lastUpdatedEls.forEach(el => {
        el.textContent = formattedDate;
    });
}

/**
 * Set up user management
 */
function setupUserManagement() {
    // Initialize users table with sample data
    const userTable = document.querySelector('#user-management .data-table');
    
    // Sample data for users
    const sampleUsers = [
        { id: 1, name: 'John Doe', role: 'System Admin', contact: '+91 98765 43210', email: 'john@example.com', status: 'active' },
        { id: 2, name: 'Jane Smith', role: 'Hospital Admin', contact: '+91 87654 32109', email: 'jane@hospital.com', status: 'active' },
        { id: 3, name: 'Mike Wilson', role: 'Driver', contact: '+91 76543 21098', email: 'mike@ambulance.com', status: 'active' },
        { id: 4, name: 'Sarah Johnson', role: 'Dispatcher', contact: '+91 65432 10987', email: 'sarah@dispatch.com', status: 'inactive' },
        { id: 5, name: 'Robert Brown', role: 'Doctor', contact: '+91 54321 09876', email: 'robert@hospital.com', status: 'active' }
    ];
    
    // Populate user table with sample data
    if (userTable) {
        const tbody = userTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            sampleUsers.forEach(user => {
                const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.role}</td>
                    <td>${user.contact}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(user.status)}</span></td>
                    <td>
                        <button class="action-btn view-btn" data-id="${user.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
        }
    }
    
    // Add User Modal Functionality
    const addUserBtn = document.querySelector('#add-user-btn');
    const addUserModal = document.querySelector('#add-user-modal');
    const closeModal = addUserModal?.querySelector('.close-modal');
    const cancelAddUser = document.querySelector('#cancel-add-user');
    const addUserForm = document.querySelector('#add-user-form');
    
    // Tab navigation for user form
    const userFormTabs = document.querySelectorAll('#add-user-form .form-tab');
    const userFormTabContents = document.querySelectorAll('#add-user-form .form-tab-content');
    const nextTabBtn = document.querySelector('#next-tab-user');
    const prevTabBtn = document.querySelector('#prev-tab-user');
    const submitUserBtn = document.querySelector('#add-user-form button[type="submit"]');
    const progressSegments = document.querySelectorAll('#add-user-form .progress-segment');
    
    let currentTabIndex = 0;
    
    // Functions to handle tab navigation
    function showUserTab(index) {
        userFormTabs.forEach(tab => tab.classList.remove('active'));
        userFormTabContents.forEach(content => content.classList.remove('active'));
        progressSegments.forEach(segment => segment.classList.remove('active'));
        
        userFormTabs[index].classList.add('active');
        userFormTabContents[index].classList.add('active');
        
        // Update progress bar
        for (let i = 0; i <= index; i++) {
            progressSegments[i].classList.add('active');
        }
        
        // Show/hide navigation buttons based on current tab
        if (index === 0) {
            prevTabBtn.style.display = 'none';
            nextTabBtn.style.display = 'block';
            submitUserBtn.style.display = 'none';
        } else if (index === userFormTabs.length - 1) {
            prevTabBtn.style.display = 'block';
            nextTabBtn.style.display = 'none';
            submitUserBtn.style.display = 'block';
        } else {
            prevTabBtn.style.display = 'block';
            nextTabBtn.style.display = 'block';
            submitUserBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Click events for tab buttons
    if (userFormTabs.length > 0) {
        userFormTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                if (validateCurrentTab(currentTabIndex)) {
                    showUserTab(index);
                } else {
                    showNotification("Please fill in all required fields in the current tab", "error");
                }
            });
        });
    }
    
    // Next and Previous button functionality
    if (nextTabBtn) {
        nextTabBtn.addEventListener('click', () => {
            if (validateCurrentTab(currentTabIndex)) {
                showUserTab(currentTabIndex + 1);
            } else {
                showNotification("Please fill in all required fields in the current tab", "error");
            }
        });
    }
    
    if (prevTabBtn) {
        prevTabBtn.addEventListener('click', () => {
            showUserTab(currentTabIndex - 1);
        });
    }
    
    // Function to validate current tab
    function validateCurrentTab(tabIndex) {
        const currentTabContent = userFormTabContents[tabIndex];
        
        if (!currentTabContent) return true;
        
        const requiredFields = currentTabContent.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Special validation for specific tabs
        if (tabIndex === 1) { // Account Info tab
            const password = document.querySelector('#user-password');
            const confirmPassword = document.querySelector('#user-confirm-password');
            
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                isValid = false;
                confirmPassword.classList.add('error');
                showNotification("Passwords do not match", "error");
            }
        }
        
        return isValid;
    }
    
    // Password validation
    const passwordInput = document.querySelector('#user-password');
    const confirmPasswordInput = document.querySelector('#user-confirm-password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.classList.add('error');
                } else {
                    confirmPasswordInput.classList.remove('error');
                }
            });
        }
    }
    
    // Function to validate password strength
    function validatePassword() {
        const password = passwordInput.value;
        
        // Update password requirement indicators
        updateRequirement('req-length', password.length >= 8);
        updateRequirement('req-uppercase', /[A-Z]/.test(password));
        updateRequirement('req-lowercase', /[a-z]/.test(password));
        updateRequirement('req-number', /[0-9]/.test(password));
        updateRequirement('req-special', /[^A-Za-z0-9]/.test(password));
    }
    
    // Function to update requirement indicators
    function updateRequirement(reqId, isValid) {
        const reqElement = document.getElementById(reqId);
        if (reqElement) {
            const icon = reqElement.querySelector('i');
            
            if (isValid) {
                icon.className = 'fas fa-check-circle';
                reqElement.classList.add('valid');
                reqElement.classList.remove('invalid');
            } else {
                icon.className = 'fas fa-times-circle';
                reqElement.classList.remove('valid');
                reqElement.classList.add('invalid');
            }
        }
    }
    
    // Role preset buttons
    const rolePresetButtons = document.querySelectorAll('.role-preset-btn');
    if (rolePresetButtons.length > 0) {
        rolePresetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const role = button.getAttribute('data-role');
                const roleSelect = document.querySelector('#user-role');
                
                if (roleSelect) {
                    roleSelect.value = role;
                    
                    // Set default permissions based on role
                    resetAllPermissions();
                    
                    switch (role) {
                        case 'system-admin':
                            setAllPermissions(true);
                            break;
                            
                        case 'hospital-admin':
                            setPermissionsByGroup(['Dashboard', 'Hospitals', 'Emergencies'], true);
                            break;
                            
                        case 'dispatcher':
                            setPermissionsByGroup(['Dashboard', 'Ambulances', 'Emergencies', 'Routes & Maps'], true);
                            break;
                            
                        case 'driver':
                            setBasicViewPermissions();
                            break;
                            
                        case 'observer':
                            setBasicViewPermissions();
                            break;
                    }
                    
                    showNotification(`Applied ${button.textContent.trim()} permission preset`, "success");
                }
            });
        });
    }
    
    // Permission management functions
    function setAllPermissions(value) {
        const permCheckboxes = document.querySelectorAll('#permissions-tab input[type="checkbox"]');
        permCheckboxes.forEach(checkbox => {
            checkbox.checked = value;
        });
    }
    
    function resetAllPermissions() {
        setAllPermissions(false);
    }
    
    function setBasicViewPermissions() {
        const viewPermissions = document.querySelectorAll('#permissions-tab input[id^="perm-view-"]');
        viewPermissions.forEach(checkbox => {
            checkbox.checked = true;
        });
    }
    
    function setPermissionsByGroup(groups, value) {
        groups.forEach(group => {
            const groupHeader = Array.from(document.querySelectorAll('#permissions-tab h5'))
                .find(header => header.textContent.trim() === group);
                
            if (groupHeader) {
                const permCategory = groupHeader.closest('.permission-category');
                if (permCategory) {
                    const checkboxes = permCategory.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = value;
                    });
                }
            }
        });
    }
    
    // Open Add User Modal
    if (addUserBtn && addUserModal) {
        addUserBtn.addEventListener('click', () => {
            addUserModal.style.display = 'block';
            // Reset form and show first tab
            addUserForm.reset();
            showUserTab(0);
            
            // Reset password indicators
            document.querySelectorAll('.password-requirements li').forEach(req => {
                req.classList.remove('valid', 'invalid');
                const icon = req.querySelector('i');
                if (icon) icon.className = 'fas fa-times-circle';
            });
        });
    }
    
    // Close Add User Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addUserModal.style.display = 'none';
        });
    }
    
    // Cancel button for Add User Modal
    if (cancelAddUser) {
        cancelAddUser.addEventListener('click', () => {
            addUserModal.style.display = 'none';
        });
    }
    
    // Add User Form Submission
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab(currentTabIndex)) {
                showNotification("Please fill in all required fields", "error");
                return;
            }
            
            // Get form data
            const userData = {
                name: document.querySelector('#user-name').value,
                username: document.querySelector('#user-username').value,
                email: document.querySelector('#user-email').value,
                contact: document.querySelector('#user-contact').value,
                role: document.querySelector('#user-role').value,
                status: document.querySelector('#user-status').value
            };
            
            // In a real application, you would send this data to a server
            console.log('User Data:', userData);
            
            // Add user to table (for demo purposes)
            addUserToTable(userData);
            
            // Update user count on dashboard
            const userCount = document.querySelector('#user-count');
            if (userCount) {
                userCount.textContent = parseInt(userCount.textContent) + 1;
            }
            
            // Close modal and show success message
            addUserModal.style.display = 'none';
            showNotification(`User ${userData.name} added successfully`, "success");
            
            // Update last updated time
            updateLastUpdatedTime();
        });
    }
    
    // Function to add a new user to the table
    function addUserToTable(userData) {
        const tbody = document.querySelector('#user-management .data-table tbody');
        
        if (tbody) {
            const lastId = sampleUsers.length > 0 ? sampleUsers[sampleUsers.length - 1].id : 0;
            const newId = lastId + 1;
            
            // Add to our sample data array
            sampleUsers.push({
                id: newId,
                name: userData.name,
                role: userData.role,
                contact: userData.contact,
                email: userData.email,
                status: userData.status
            });
            
            const statusClass = userData.status === 'active' ? 'status-active' : 'status-inactive';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userData.name}</td>
                <td>${userData.role}</td>
                <td>${userData.contact}</td>
                <td>${userData.email}</td>
                <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(userData.status)}</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${newId}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${newId}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${newId}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tbody.appendChild(row);
            
            // Add event listeners to new buttons
            const viewBtn = row.querySelector('.view-btn');
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    showNotification(`Viewing user ${userData.name}`, "info");
                });
            }
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showNotification(`Editing user ${userData.name}`, "info");
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete user ${userData.name}?`)) {
                        row.remove();
                        // Remove from our sample data array
                        const index = sampleUsers.findIndex(user => user.id === newId);
                        if (index !== -1) {
                            sampleUsers.splice(index, 1);
                        }
                        showNotification(`User ${userData.name} deleted`, "success");
                        
                        // Update user count on dashboard
                        const userCount = document.querySelector('#user-count');
                        if (userCount) {
                            userCount.textContent = parseInt(userCount.textContent) - 1;
                        }
                        
                        // Update last updated time
                        updateLastUpdatedTime();
                    }
                });
            }
        }
    }
    
    // Search functionality
    const userSearchInput = document.querySelector('#user-search');
    if (userSearchInput) {
        userSearchInput.addEventListener('input', () => {
            const searchValue = userSearchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#user-management .data-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
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
                
                // Update route details panel
                updateRouteDetailsPanel(routeId, from, to, row.cells[3].textContent.trim(), 
                                      row.cells[4].textContent.trim(), row.cells[5].textContent.trim());
                
                showNotification(`Viewing route ${routeId} on map`, 'info');
            });
        });
        
        // Initialize map controls and filters
        initRouteMapControls();
        initRouteFilters();
        initTrafficCharts();
    }
    
    // Add sample routes for demo
    addDemoRoutes();
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Smart Ambulance Routing System
 * Admin Panel Functionality
 */

/**
 * Initialize the admin panel
 */
function initAdminPanel() {
    console.log('Initializing admin panel');
    
    // Set up sidebar navigation
    setupSidebarNav();
    
    // Set up admin dashboard
    setupAdminDashboard();
    
    // Initialize charts
    initCharts();
    
    // Set up date range pickers
    setupDateRange();
    
    // Load active emergencies
    loadActiveEmergencies();
    
    // Set up ambulance management
    setupAmbulanceManagement();
    
    // Set up hospital management
    setupHospitalManagement();
    
    // Set up user management
    setupUserManagement();
    
    // Set up settings management
    setupSettingsManagement();
    
    // Set up emergency management
    setupEmergencyManagement();
    
    // Set up route management
    setupRouteManagement();
    
    // Set up modals
    setupModals();
    
    // Set up mobile sidebar toggle
    setupMobileSidebar();
    
    // Set up location buttons
    setupLocationButtons();
    
    // Initialize maps
    setTimeout(() => {
        // Add a small delay to ensure DOM is fully loaded
        try {
            if (document.getElementById('admin-overview-map')) {
                // Initialize admin overview map
                const adminMap = L.map('admin-overview-map', {
                    center: [22.3072, 73.1812], // Vadodara, India
                    zoom: 12
                });
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(adminMap);
            }
            
            if (document.getElementById('ambulance-map')) {
                initAmbulanceMap();
            }
            
            if (document.getElementById('route-map')) {
                initRouteMap();
            }
        } catch (e) {
            console.error('Error initializing maps:', e);
        }
    }, 500);
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
    const addAmbulanceModal = document.getElementById('add-ambulance-modal');
    const addAmbulanceBtn = document.getElementById('add-ambulance-btn');
    const closeModal = addAmbulanceModal.querySelector('.close-modal');
    const cancelBtn = addAmbulanceModal.querySelector('.cancel-btn');
    const ambulanceForm = document.getElementById('add-ambulance-form');
    const refreshBtn = document.getElementById('refresh-ambulances-btn');
    
    // Tab navigation for ambulance form
    const formTabs = ambulanceForm.querySelectorAll('.form-tab');
    const formTabContents = ambulanceForm.querySelectorAll('.form-tab-content');
    const nextTabBtn = document.getElementById('next-tab-ambulance');
    const prevTabBtn = document.getElementById('prev-tab-ambulance');
    const submitBtn = ambulanceForm.querySelector('button[type="submit"]');
    
    let currentTabIndex = 0;
    
    // Function to show a specific tab
    function showTab(index) {
        formTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        formTabContents.forEach((content, i) => {
            if (i === index) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update progress bar
        const progressSegments = ambulanceForm.querySelectorAll('.progress-segment');
        progressSegments.forEach((segment, i) => {
            if (i <= index) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
        
        // Show/hide navigation buttons
        if (index === 0) {
            prevTabBtn.style.display = 'none';
        } else {
            prevTabBtn.style.display = 'block';
        }
        
        if (index === formTabs.length - 1) {
            nextTabBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextTabBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Tab click event
    formTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            showTab(index);
        });
    });
    
    // Next button click
    nextTabBtn.addEventListener('click', () => {
        if (validateCurrentTab()) {
            if (currentTabIndex < formTabs.length - 1) {
                showTab(currentTabIndex + 1);
            }
        }
    });
    
    // Previous button click
    prevTabBtn.addEventListener('click', () => {
        if (currentTabIndex > 0) {
            showTab(currentTabIndex - 1);
        }
    });
    
    // Validate current tab
    function validateCurrentTab() {
        let isValid = true;
        const currentTab = formTabContents[currentTabIndex];
        
        // Get all required inputs in the current tab
        const requiredInputs = currentTab.querySelectorAll('input[required], select[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('input-error');
                showNotification('Please fill all required fields marked with *', 'error');
            } else {
                input.classList.remove('input-error');
            }
        });
        
        // Specific validations based on tab
        if (currentTabIndex === 0) { // Basic Info tab
            const ambulanceId = document.getElementById('ambulance-id');
            if (ambulanceId.value && !/^AMB-\d{4}$/.test(ambulanceId.value)) {
                isValid = false;
                ambulanceId.classList.add('input-error');
                showNotification('Ambulance ID should be in format AMB-XXXX (e.g., AMB-1234)', 'error');
            }
            
            const registrationNo = document.getElementById('ambulance-registration');
            if (registrationNo.value && !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(registrationNo.value)) {
                isValid = false;
                registrationNo.classList.add('input-error');
                showNotification('Vehicle Registration should be in a valid format (e.g., MH02AB1234)', 'error');
            }
        } else if (currentTabIndex === 2) { // Staff tab
            const driverPhone = document.getElementById('driver-phone');
            if (driverPhone.value && !/^[0-9]{10}$/.test(driverPhone.value)) {
                isValid = false;
                driverPhone.classList.add('input-error');
                showNotification('Phone number should be a 10-digit number', 'error');
            }
        }
        
        return isValid;
    }

    // Handle form input events to remove error class
    ambulanceForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
    });

    // Initialize map for location selection
    const mapPickerBtn = document.getElementById('show-map-picker-ambulance');
    const mapPreview = document.getElementById('ambulance-map-preview');
    let mapInstance = null;
    
    if (mapPickerBtn && mapPreview) {
        mapPickerBtn.addEventListener('click', () => {
            // Initialize map if not already done
            if (!mapInstance) {
                // Check if Leaflet is available
                if (typeof L !== 'undefined') {
                    mapInstance = L.map(mapPreview).setView([22.3072, 73.1812], 12); // Vadodara coordinates
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(mapInstance);
                    
                    // Add marker for ambulance location
                    const ambulanceMarker = L.marker([22.3072, 73.1812], {
                        draggable: true
                    }).addTo(mapInstance);
                    
                    // Update coordinates on marker drag
                    ambulanceMarker.on('dragend', function(event) {
                        const marker = event.target;
                        const position = marker.getLatLng();
                        
                        document.getElementById('ambulance-lat').value = position.lat.toFixed(6);
                        document.getElementById('ambulance-lng').value = position.lng.toFixed(6);
                        
                        // Update route metrics (for demo)
                        updateRouteMetrics();
                    });
                    
                    // Map control buttons
                    const mapControls = document.querySelectorAll('.map-controls .map-control-btn');
                    if (mapControls.length > 0) {
                        // Zoom in
                        mapControls[0].addEventListener('click', () => {
                            mapInstance.setZoom(mapInstance.getZoom() + 1);
                        });
                        
                        // Zoom out
                        mapControls[1].addEventListener('click', () => {
                            mapInstance.setZoom(mapInstance.getZoom() - 1);
                        });
                        
                        // Center map
                        mapControls[2].addEventListener('click', () => {
                            mapInstance.setView([22.3072, 73.1812], 12);
                        });
                    }
                } else {
                    showNotification('Map library not loaded. Please check your internet connection.', 'error');
                }
            }
            
            // Get existing coordinates
            const lat = document.getElementById('ambulance-lat').value;
            const lng = document.getElementById('ambulance-lng').value;
            
            // If coordinates exist, center map on them
            if (lat && lng && mapInstance) {
                mapInstance.setView([parseFloat(lat), parseFloat(lng)], 15);
                
                // Update marker position
                const markers = mapInstance._layers;
                for (let id in markers) {
                    if (markers[id] instanceof L.Marker) {
                        markers[id].setLatLng([parseFloat(lat), parseFloat(lng)]);
                        break;
                    }
                }
            }
            
            // Scroll to the map
            mapPreview.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Use current location button
    const useCurrentLocationBtn = document.querySelector('.auto-locate[data-target="ambulance"]');
    if (useCurrentLocationBtn) {
        useCurrentLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    document.getElementById('ambulance-lat').value = position.coords.latitude.toFixed(6);
                    document.getElementById('ambulance-lng').value = position.coords.longitude.toFixed(6);
                    
                    // Update map if available
                    if (mapInstance) {
                        mapInstance.setView([position.coords.latitude, position.coords.longitude], 15);
                        
                        // Update marker position
                        const markers = mapInstance._layers;
                        for (let id in markers) {
                            if (markers[id] instanceof L.Marker) {
                                markers[id].setLatLng([position.coords.latitude, position.coords.longitude]);
                                break;
                            }
                        }
                    }
                    
                    // Update route metrics (for demo)
                    updateRouteMetrics();
                    
                    showNotification('Current location set', 'success');
                }, error => {
                    showNotification('Could not get current location: ' + error.message, 'error');
                });
            } else {
                showNotification('Geolocation is not supported by this browser', 'error');
            }
        });
    }
    
    // Use hospital location button
    const useHospitalLocationBtn = document.getElementById('use-hospital-location');
    if (useHospitalLocationBtn) {
        useHospitalLocationBtn.addEventListener('click', () => {
            const selectedHospital = document.getElementById('ambulance-hospital').value;
            
            // Hospital coordinates (approximate for Vadodara hospitals)
            const hospitalCoordinates = {
                'SSG Hospital': [22.3217, 73.1851],
                'Bhailal Amin General Hospital': [22.3003, 73.1759],
                'Baroda Medical College Hospital': [22.3144, 73.1932],
                'Kailash Cancer Hospital': [22.3003, 73.1759],
                'Sterling Hospital': [22.3119, 73.1723]
            };
            
            if (selectedHospital && hospitalCoordinates[selectedHospital]) {
                const [lat, lng] = hospitalCoordinates[selectedHospital];
                document.getElementById('ambulance-lat').value = lat.toFixed(6);
                document.getElementById('ambulance-lng').value = lng.toFixed(6);
                
                // Update map if available
                if (mapInstance) {
                    mapInstance.setView([lat, lng], 15);
                    
                    // Update marker position
                    const markers = mapInstance._layers;
                    for (let id in markers) {
                        if (markers[id] instanceof L.Marker) {
                            markers[id].setLatLng([lat, lng]);
                            break;
                        }
                    }
                }
                
                // Update route metrics (for demo)
                updateRouteMetrics();
                
                showNotification('Hospital location set', 'success');
            } else {
                showNotification('Please select a hospital first', 'warning');
            }
        });
    }
    
    // Function to update route metrics for demo purposes
    function updateRouteMetrics() {
        const routeMetrics = document.querySelectorAll('.route-metric .metric-value');
        if (routeMetrics.length >= 4) {
            // Random travel time between 8 and 15 minutes
            routeMetrics[0].textContent = Math.floor(Math.random() * 8) + 8 + ' mins';
            
            // Random distance between 3 and 7 km
            routeMetrics[1].textContent = (Math.floor(Math.random() * 40) / 10 + 3).toFixed(1) + ' km';
            
            // Random response time between 6 and 10 minutes
            routeMetrics[2].textContent = Math.floor(Math.random() * 5) + 6 + ' mins';
            
            // Traffic condition
            const trafficConditions = ['Good', 'Moderate', 'Heavy'];
            const randomCondition = trafficConditions[Math.floor(Math.random() * 3)];
            routeMetrics[3].textContent = randomCondition;
            
            // Update class for color coding
            routeMetrics[3].className = 'metric-value';
            if (randomCondition === 'Good') routeMetrics[3].classList.add('status-good');
            if (randomCondition === 'Moderate') routeMetrics[3].classList.add('status-warning');
            if (randomCondition === 'Heavy') routeMetrics[3].classList.add('status-danger');
        }
    }
    
    // Document upload functionality
    const uploadButtons = document.querySelectorAll('.upload-btn');
    uploadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*,.pdf,.doc,.docx';
            
            fileInput.addEventListener('change', function() {
                if (fileInput.files.length > 0) {
                    const fileName = fileInput.files[0].name;
                    button.innerHTML = `<i class="fas fa-check"></i> ${fileName}`;
                    button.style.backgroundColor = '#e6f7ee';
                    button.style.borderColor = '#2ed573';
                    button.style.color = '#2ed573';
                }
            });
            
            fileInput.click();
        });
    });
    
    // Initialize document validity dates
    const validityDates = document.querySelectorAll('.document-validity .mini-date');
    validityDates.forEach(dateInput => {
        // Set default expiry date to one year from now
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        dateInput.valueAsDate = oneYearFromNow;
        
        // Add event listener to highlight expired dates
        dateInput.addEventListener('change', function() {
            const today = new Date();
            const expiryDate = new Date(this.value);
            
            if (expiryDate < today) {
                this.classList.add('expired-date');
                this.parentElement.classList.add('expired');
            } else {
                this.classList.remove('expired-date');
                this.parentElement.classList.remove('expired');
            }
        });
    });
    
    if (addAmbulanceBtn) {
        addAmbulanceBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'block';
            // Reset the form and show first tab
            ambulanceForm.reset();
            showTab(0);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (ambulanceForm) {
        ambulanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab()) {
                return;
            }
            
            // Collect data from the form
            const ambulanceData = {
                id: document.getElementById('ambulance-id').value,
                registration: document.getElementById('ambulance-registration').value,
                type: document.getElementById('ambulance-type').value,
                make: document.getElementById('ambulance-make').value,
                year: document.getElementById('ambulance-year').value,
                vin: document.getElementById('ambulance-vin')?.value || '',
                capacity: document.getElementById('ambulance-capacity').value,
                fuelType: document.getElementById('ambulance-fuel-type').value,
                status: document.getElementById('ambulance-status').value,
                
                // Vehicle details
                insurance: document.getElementById('ambulance-insurance').value,
                lastService: document.getElementById('ambulance-last-service').value,
                nextService: document.getElementById('ambulance-next-service').value,
                mileage: document.getElementById('ambulance-mileage').value,
                
                // Equipment
                equipment: {
                    // Basic equipment
                    firstAid: document.getElementById('equipment-first-aid').checked,
                    oxygen: document.getElementById('equipment-oxygen').checked,
                    stretcher: document.getElementById('equipment-stretcher').checked,
                    wheelchair: document.getElementById('equipment-wheelchair').checked,
                    
                    // Advanced equipment
                    aed: document.getElementById('equipment-aed').checked,
                    ventilator: document.getElementById('equipment-ventilator').checked,
                    ecg: document.getElementById('equipment-ecg').checked,
                    suction: document.getElementById('equipment-suction').checked,
                    infusion: document.getElementById('equipment-infusion').checked,
                    oximeter: document.getElementById('equipment-oximeter').checked,
                    
                    // Other equipment
                    other: document.getElementById('equipment-others').value,
                    
                    // Medication
                    medication: document.getElementById('equipment-medication').value,
                    
                    // New equipment fields with quantities
                    oxygenQuantity: document.getElementById('oxygen-quantity')?.value || '1',
                    stretcherType: document.getElementById('stretcher-type')?.value || 'Standard',
                    ventilatorType: document.getElementById('ventilator-type')?.value || 'Standard',
                },
                
                // Staff information
                driver: {
                    name: document.getElementById('driver-name').value,
                    phone: document.getElementById('driver-phone').value,
                    license: document.getElementById('driver-license').value,
                    licenseExpiry: document.getElementById('driver-license-expiry').value,
                    age: document.getElementById('driver-age')?.value || '',
                    experience: document.getElementById('driver-experience')?.value || '',
                    shift: document.getElementById('driver-shift')?.value || '',
                    address: document.getElementById('driver-address')?.value || '',
                },
                
                paramedic: {
                    name: document.getElementById('paramedic-name').value,
                    phone: document.getElementById('paramedic-phone').value,
                    qualification: document.getElementById('paramedic-qualification')?.value || '',
                    experience: document.getElementById('paramedic-experience')?.value || '',
                    license: document.getElementById('paramedic-license')?.value || '',
                    shift: document.getElementById('paramedic-shift')?.value || '',
                    emergencyContact: document.getElementById('paramedic-emergency-contact')?.value || '',
                    specializations: Array.from(document.getElementById('paramedic-specializations')?.selectedOptions || [])
                        .map(option => option.value),
                },
                
                additionalStaff: document.getElementById('additional-staff').value,
                
                // Maintenance information
                maintenance: {
                    type: document.getElementById('maintenance-type')?.value || '',
                    intervalKm: document.getElementById('maintenance-interval-km')?.value || '',
                    intervalDays: document.getElementById('maintenance-interval-days')?.value || '',
                    vendor: document.getElementById('maintenance-vendor')?.value || '',
                    notes: document.getElementById('maintenance-notes')?.value || '',
                },
                
                // Documentation
                documents: {
                    registration: {
                        status: document.getElementById('doc-registration')?.checked || false,
                        validity: document.getElementById('doc-registration')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    insurance: {
                        status: document.getElementById('doc-insurance')?.checked || false,
                        validity: document.getElementById('doc-insurance')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    fitness: {
                        status: document.getElementById('doc-fitness')?.checked || false,
                        validity: document.getElementById('doc-fitness')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    pollution: {
                        status: document.getElementById('doc-pollution')?.checked || false,
                        validity: document.getElementById('doc-pollution')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    permit: {
                        status: document.getElementById('doc-permit')?.checked || false,
                        validity: document.getElementById('doc-permit')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    tax: {
                        status: document.getElementById('doc-tax')?.checked || false,
                        validity: document.getElementById('doc-tax')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    notes: document.getElementById('documentation-notes')?.value || '',
                },
                
                // Location information
                location: {
                    hospital: document.getElementById('ambulance-hospital')?.value || '',
                    baseLocation: document.getElementById('ambulance-base-location')?.value || '',
                    serviceArea: document.getElementById('ambulance-service-area')?.value || '',
                    responseRadius: document.getElementById('ambulance-response-radius')?.value || '',
                    distanceLimit: document.getElementById('distance-limit-daily')?.value || '',
                    coverageArea: document.getElementById('coverage-area')?.value || '',
                    currentLocation: {
                        lat: document.getElementById('ambulance-lat')?.value || '',
                        lng: document.getElementById('ambulance-lng')?.value || '',
                    }
                },
                
                timestamp: Date.now()
            };
            
            // For demonstration, show the data in a notification
            console.log('Ambulance Data:', ambulanceData);
            
            // Save to localStorage (or send to server in production)
            const ambulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
            ambulances.push(ambulanceData);
            localStorage.setItem('ambulances', JSON.stringify(ambulances));
            
            // Close modal and show success notification
            addAmbulanceModal.style.display = 'none';
            showNotification('Ambulance added successfully!', 'success');
            
            // Refresh the ambulance list
            loadAmbulances();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // In a real scenario, this would fetch from API
            // For demo, we'll just show a notification
            showNotification('Ambulance list refreshed', 'info');
        });
    }

    // Add sample ambulances for demo
    addDemoAmbulances();
}

function addAmbulanceToTable(ambulanceData) {
    const ambulanceTable = document.querySelector('.ambulance-table tbody');
    
    if (!ambulanceTable) return;
    
    const newRow = document.createElement('tr');
    newRow.classList.add('new-row-highlight');
    
    // Create cells with ambulance data
    newRow.innerHTML = `
        <td>${ambulanceData.id}</td>
        <td>${getAmbulanceTypeLabel(ambulanceData.type)}</td>
        <td>${ambulanceData.driver.name || 'N/A'}</td>
        <td>${ambulanceData.baseLocation}</td>
        <td>${ambulanceData.status ? capitalizeFirstLetter(ambulanceData.status) : 'Unknown'}</td>
        <td>
            <div class="action-buttons">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
                <button class="view-btn"><i class="fas fa-eye"></i></button>
            </div>
        </td>
    `;
    
    // Add event listeners for the action buttons
    const editBtn = newRow.querySelector('.edit-btn');
    const deleteBtn = newRow.querySelector('.delete-btn');
    const viewBtn = newRow.querySelector('.view-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showNotification('Edit functionality coming soon', 'info');
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            newRow.classList.add('delete-animation');
            setTimeout(() => {
                ambulanceTable.removeChild(newRow);
                showNotification('Ambulance removed successfully', 'success');
            }, 500);
        });
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            showNotification('View details functionality coming soon', 'info');
        });
    }
    
    // Add to table and remove highlight after animation
    ambulanceTable.appendChild(newRow);
    setTimeout(() => {
        newRow.classList.remove('new-row-highlight');
    }, 3000);
}

function getAmbulanceTypeLabel(type) {
    const types = {
        'type1': 'Type I (Basic)',
        'type2': 'Type II (Mobile Emergency)',
        'type3': 'Type III (Advanced Life Support)',
        'type4': 'Mobile ICU',
        'neonatal': 'Neonatal',
        'mortuary': 'Mortuary'
    };
    
    return types[type] || 'Unknown Type';
}

function addDemoAmbulances() {
    const ambulances = [
        {
            id: 'AMB-1001',
            registration: 'GJ06AB1234',
            type: 'type2',
            make: 'Tata Winger',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Rajesh Kumar',
                phone: '9876543210'
            },
            baseLocation: 'SSG Hospital',
            hospital: 'SSG Hospital'
        },
        {
            id: 'AMB-1002',
            registration: 'GJ06CD5678',
            type: 'type3',
            make: 'Force Traveller',
            year: '2021',
            capacity: '3',
            fuelType: 'diesel',
            status: 'dispatched',
            driver: {
                name: 'Suresh Patel',
                phone: '9876543211'
            },
            baseLocation: 'Bhailal Amin General Hospital',
            hospital: 'Bhailal Amin General Hospital'
        },
        {
            id: 'AMB-1003',
            registration: 'GJ06EF9012',
            type: 'type4',
            make: 'Tata Winger',
            year: '2023',
            capacity: '1',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Amit Singh',
                phone: '9876543212'
            },
            baseLocation: 'Sterling Hospital',
            hospital: 'Sterling Hospital'
        },
        {
            id: 'AMB-1004',
            registration: 'GJ06GH3456',
            type: 'neonatal',
            make: 'Force Traveller',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'maintenance',
            driver: {
                name: 'Dinesh Shah',
                phone: '9876543213'
            },
            baseLocation: 'Baroda Medical College Hospital',
            hospital: 'Baroda Medical College Hospital'
        }
    ];
    
    ambulances.forEach(ambulance => {
        addAmbulanceToTable(ambulance);
    });
}

/**
 * Set up hospital management
 */
function setupHospitalManagement() {
    // Add hospital button
    const addHospitalBtn = document.getElementById('add-hospital-btn');
    if (addHospitalBtn) {
        addHospitalBtn.addEventListener('click', () => {
            // Show the add hospital form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'block';
                
                // Add tooltips to form fields for better guidance
                addFormTooltips();
                
                // Add dynamic field interactions
                setupDynamicFormFields();
                
                // Scroll to the form
                formContainer.scrollIntoView({ behavior: 'smooth' });
                showNotification('Please fill in the hospital details', 'info');
            }
        });
    }
    
    // Handle form submission
    const hospitalForm = document.getElementById('add-hospital-form');
    if (hospitalForm) {
        hospitalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!validateHospitalForm()) {
                showNotification('Please correct the errors in the form', 'error');
                return;
            }
            
            // Get all the form values
            const hospitalName = document.getElementById('hospital-name').value;
            const hospitalType = document.getElementById('hospital-type').value;
            const hospitalAddress = document.getElementById('hospital-address').value;
            const hospitalArea = document.getElementById('hospital-area').value;
            const hospitalCity = document.getElementById('hospital-city').value;
            const hospitalPincode = document.getElementById('hospital-pincode').value;
            
            const hospitalPhone = document.getElementById('hospital-phone').value;
            const hospitalEmergencyPhone = document.getElementById('hospital-emergency-phone').value;
            const hospitalEmail = document.getElementById('hospital-email').value;
            const hospitalWebsite = document.getElementById('hospital-website').value;
            
            const hospitalBedsTotal = document.getElementById('hospital-beds-total').value;
            const hospitalBedsAvailable = document.getElementById('hospital-beds-available').value;
            const hospitalICUBeds = document.getElementById('hospital-icu-beds')?.value || 0;
            const hospitalVentilators = document.getElementById('hospital-ventilators')?.value || 0;
            const hospitalWaitTime = document.getElementById('hospital-wait-time').value;
            
            const hospitalLat = document.getElementById('hospital-lat').value;
            const hospitalLng = document.getElementById('hospital-lng').value;
            
            // Get specialty information
            const hospitalSpecialties = document.getElementById('hospital-specialties').value;
            const hospitalEmergency = document.getElementById('hospital-emergency')?.checked || false;
            const hospitalTraumaCenter = document.getElementById('hospital-trauma-center')?.checked || false;
            const hospitalBloodBank = document.getElementById('hospital-blood-bank')?.checked || false;
            const hospital24x7 = document.getElementById('hospital-24x7')?.checked || false;
            
            // Check required fields
            if (!hospitalName || !hospitalAddress || !hospitalBedsTotal || !hospitalBedsAvailable || !hospitalWaitTime) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Calculate capacity percentage
            const totalBeds = parseInt(hospitalBedsTotal);
            const availableBeds = parseInt(hospitalBedsAvailable);
            const capacityPercentage = Math.round(((totalBeds - availableBeds) / totalBeds) * 100);
            
            // Determine status based on capacity
            let status = 'Available';
            if (capacityPercentage >= 90) {
                status = 'Critical';
            } else if (capacityPercentage >= 75) {
                status = 'High Load';
            }
            
            // Construct full address
            const fullAddress = `${hospitalAddress}, ${hospitalArea ? hospitalArea + ', ' : ''}${hospitalCity}${hospitalPincode ? ', ' + hospitalPincode : ''}`;
            
            // Create a rich hospital object with all details
            const hospitalData = {
                name: hospitalName,
                type: hospitalType,
                address: fullAddress,
                capacity: {
                    percentage: capacityPercentage,
                    available: availableBeds,
                    total: totalBeds,
                    icu: hospitalICUBeds,
                    ventilators: hospitalVentilators
                },
                contact: {
                    phone: hospitalPhone,
                    emergency: hospitalEmergencyPhone,
                    email: hospitalEmail,
                    website: hospitalWebsite
                },
                location: {
                    lat: hospitalLat,
                    lng: hospitalLng
                },
                services: {
                    specialties: hospitalSpecialties,
                    emergency: hospitalEmergency,
                    traumaCenter: hospitalTraumaCenter,
                    bloodBank: hospitalBloodBank,
                    open24x7: hospital24x7
                },
                waitTime: hospitalWaitTime + ' mins',
                status: status
            };
            
            // Add the hospital to the table
            addHospitalToTable(hospitalData);
            
            // Show confirmation with more details
            showNotification(`Hospital "${hospitalName}" has been added successfully with ${totalBeds} beds`, 'success');
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Hide the form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
            
            // Reset the form
            hospitalForm.reset();
        });
    }
    
    // Set up form toggle buttons
    const toggleFormBtns = document.querySelectorAll('.toggle-form');
    toggleFormBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const formContainer = document.getElementById(targetId + '-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
        });
    });
    
    // Set up hospital action buttons
    setupHospitalActionButtons();
}

/**
 * Add tooltips to hospital form fields
 */
function addFormTooltips() {
    // Add tooltips to form fields to provide guidance
    const tooltips = {
        'hospital-name': 'Enter the official name of the hospital',
        'hospital-type': 'Select the type of hospital (Government, Private, etc.)',
        'hospital-address': 'Enter the street address of the hospital',
        'hospital-area': 'Enter the area or locality name',
        'hospital-city': 'Enter the city name',
        'hospital-pincode': 'Enter the 6-digit PIN code',
        'hospital-phone': 'Enter the main contact number with country code',
        'hospital-emergency-phone': 'Enter emergency contact number',
        'hospital-email': 'Enter official email address',
        'hospital-website': 'Enter complete website URL including https://',
        'hospital-beds-total': 'Enter total number of beds in the hospital',
        'hospital-beds-available': 'Enter number of currently available beds',
        'hospital-icu-beds': 'Enter number of ICU beds',
        'hospital-ventilators': 'Enter number of ventilators available',
        'hospital-ambulances': 'Enter number of ambulances operated by the hospital',
        'hospital-wait-time': 'Enter average emergency wait time in minutes',
        'hospital-specialties': 'Enter medical specialties separated by commas',
        'hospital-lat': 'Enter latitude coordinate (use buttons below to get coordinates)',
        'hospital-lng': 'Enter longitude coordinate (use buttons below to get coordinates)'
    };
    
    // Apply tooltips to elements
    for (const [id, tooltip] of Object.entries(tooltips)) {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('title', tooltip);
            
            // Add input validation feedback
            if (element.hasAttribute('required')) {
                element.addEventListener('input', () => {
                    if (element.value.trim() === '') {
                        element.classList.add('input-error');
                    } else {
                        element.classList.remove('input-error');
                    }
                });
            }
        }
    }
}

/**
 * Setup dynamic form field interactions
 */
function setupDynamicFormFields() {
    // Add interactions between related fields
    
    // Update available beds validation to be less than total beds
    const totalBedsInput = document.getElementById('hospital-beds-total');
    const availableBedsInput = document.getElementById('hospital-beds-available');
    
    if (totalBedsInput && availableBedsInput) {
        totalBedsInput.addEventListener('input', () => {
            const totalBeds = parseInt(totalBedsInput.value) || 0;
            availableBedsInput.setAttribute('max', totalBeds);
            
            // Validate available beds against total beds
            const availableBeds = parseInt(availableBedsInput.value) || 0;
            if (availableBeds > totalBeds) {
                availableBedsInput.value = totalBeds;
            }
        });
    }
    
    // Update hospital type dependent fields
    const hospitalTypeSelect = document.getElementById('hospital-type');
    if (hospitalTypeSelect) {
        hospitalTypeSelect.addEventListener('change', () => {
            const type = hospitalTypeSelect.value;
            
            // Show/hide fields based on hospital type
            const traumaCenterCheckbox = document.getElementById('hospital-trauma-center');
            if (traumaCenterCheckbox) {
                if (type === 'government' || type === 'speciality') {
                    traumaCenterCheckbox.parentElement.style.display = 'block';
                } else {
                    traumaCenterCheckbox.checked = false;
                    traumaCenterCheckbox.parentElement.style.display = 'none';
                }
            }
            
            // Update placeholders for specialties based on type
            const specialtiesInput = document.getElementById('hospital-specialties');
            if (specialtiesInput) {
                if (type === 'speciality') {
                    specialtiesInput.placeholder = 'Primary specialty (e.g. Cancer, Cardiac, Orthopedic)';
                } else {
                    specialtiesInput.placeholder = 'e.g. Cardiology, Neurology, Orthopedics';
                }
            }
        });
    }
    
    // Add coordinate fetching functionality
    const latInput = document.getElementById('hospital-lat');
    const lngInput = document.getElementById('hospital-lng');
    const autoLocateBtn = document.querySelector('.auto-locate[data-target="hospital"]');
    
    if (latInput && lngInput && autoLocateBtn) {
        // Use browser geolocation API
        autoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                autoLocateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
                autoLocateBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        latInput.value = position.coords.latitude.toFixed(6);
                        lngInput.value = position.coords.longitude.toFixed(6);
                        
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        
                        showNotification('Location updated successfully', 'success');
                        
                        // Highlight the fields to show they've been updated
                        latInput.classList.add('field-updated');
                        lngInput.classList.add('field-updated');
                        
                        setTimeout(() => {
                            latInput.classList.remove('field-updated');
                            lngInput.classList.remove('field-updated');
                        }, 2000);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        showNotification('Could not get your location. Please try again or enter manually.', 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }
}

/**
 * Validate hospital form
 * @returns {boolean} Whether the form is valid
 */
function validateHospitalForm() {
    let isValid = true;
    const requiredFields = [
        'hospital-name',
        'hospital-type',
        'hospital-address',
        'hospital-area',
        'hospital-city',
        'hospital-pincode',
        'hospital-phone',
        'hospital-email',
        'hospital-beds-total',
        'hospital-beds-available',
        'hospital-wait-time',
        'hospital-lat',
        'hospital-lng'
    ];
    
    // Check required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim() === '') {
            field.classList.add('input-error');
            isValid = false;
            
            // Add error message below the field
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else if (field) {
            field.classList.remove('input-error');
            
            // Remove error message if exists
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                field.parentNode.removeChild(field.nextElementSibling);
            }
        }
    });
    
    // Validate specialty field has at least one specialty
    const specialtiesField = document.getElementById('hospital-specialties');
    if (specialtiesField && specialtiesField.value.trim() === '') {
        specialtiesField.classList.add('input-error');
        if (!specialtiesField.nextElementSibling || !specialtiesField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter at least one specialty';
            specialtiesField.parentNode.insertBefore(errorMsg, specialtiesField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate available beds <= total beds
    const totalBedsField = document.getElementById('hospital-beds-total');
    const availableBedsField = document.getElementById('hospital-beds-available');
    
    if (totalBedsField && availableBedsField && 
        parseInt(availableBedsField.value) > parseInt(totalBedsField.value)) {
        availableBedsField.classList.add('input-error');
        if (!availableBedsField.nextElementSibling || !availableBedsField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Available beds cannot exceed total beds';
            availableBedsField.parentNode.insertBefore(errorMsg, availableBedsField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate email format
    const emailField = document.getElementById('hospital-email');
    if (emailField && emailField.value.trim() !== '') {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('input-error');
            if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid email address';
                emailField.parentNode.insertBefore(errorMsg, emailField.nextSibling);
            }
            isValid = false;
        }
    }
    
    // Validate pincode format (6 digits)
    const pincodeField = document.getElementById('hospital-pincode');
    if (pincodeField && pincodeField.value.trim() !== '') {
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincodeField.value)) {
            pincodeField.classList.add('input-error');
            if (!pincodeField.nextElementSibling || !pincodeField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid 6-digit PIN code';
                pincodeField.parentNode.insertBefore(errorMsg, pincodeField.nextSibling);
            }
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Add hospital to table
 * @param {Object} hospital - Hospital data
 */
function addHospitalToTable(hospital) {
    const hospitalsTable = document.querySelector('#hospitals-tab .data-table tbody');
    if (hospitalsTable) {
        // Create new table row
        const row = document.createElement('tr');
        
        // Create status badge class based on status
        let statusClass = 'available';
        if (hospital.status === 'Critical') {
            statusClass = 'maintenance';
        } else if (hospital.status === 'High Load') {
            statusClass = 'warning';
        }
        
        // Set row content with enhanced data display
        row.innerHTML = `
            <td>${hospital.name}</td>
            <td>${hospital.address}</td>
            <td>
                <div class="capacity-indicator">
                    <div class="capacity-bar-container">
                        <div class="capacity-bar" style="width: ${hospital.capacity.percentage}%"></div>
                    </div>
                    <span>${hospital.capacity.percentage}% (${hospital.capacity.total - hospital.capacity.available}/${hospital.capacity.total})</span>
                </div>
            </td>
            <td>${hospital.waitTime}</td>
            <td><span class="status-badge ${statusClass}">${hospital.status}</span></td>
            <td>${hospital.contact.phone || hospital.contact}</td>
            <td class="actions-cell">
                <button class="action-btn edit" title="Edit hospital details"><i class="fas fa-edit"></i></button>
                <button class="action-btn view" title="View hospital details"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" title="Delete hospital"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add row to table with animation
        row.classList.add('new-row');
        hospitalsTable.appendChild(row);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            row.classList.remove('new-row');
        }, 1000);
        
        // Add event listeners to the new buttons
        const editBtn = row.querySelector('.action-btn.edit');
        const deleteBtn = row.querySelector('.action-btn.delete');
        const viewBtn = row.querySelector('.action-btn.view');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                showNotification(`Editing ${hospitalName}`, 'info');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                if (confirm(`Are you sure you want to delete ${hospitalName}?`)) {
                    // Add row fade out animation
                    row.classList.add('deleting');
                    
                    setTimeout(() => {
                        row.remove();
                        updateDashboardStats();
                        showNotification(`${hospitalName} has been deleted`, 'success');
                    }, 500);
                }
            });
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                viewHospitalDetails(row);
            });
        }
    }
}

/**
 * Set up hospital action buttons
 */
function setupHospitalActionButtons() {
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
                
                // Open the hospital detail view modal
                viewHospitalDetails(row);
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
                    updateDashboardStats();
                }
            });
        });
    }
}

/**
 * View hospital details
 * @param {HTMLElement} row - Table row element with hospital data
 */
function viewHospitalDetails(row) {
    // Extract data from row
    const name = row.cells[0].textContent.trim();
    const address = row.cells[1].textContent.trim();
    
    // Extract capacity information
    const capacityEl = row.querySelector('.capacity-indicator span');
    const capacityText = capacityEl ? capacityEl.textContent.trim() : '';
    const capacityMatch = capacityText.match(/(\d+)%\s*\((\d+)\/(\d+)\)/);
    let capacityPercentage = 0;
    let occupiedBeds = 0;
    let totalBeds = 0;
    
    if (capacityMatch && capacityMatch.length >= 4) {
        capacityPercentage = parseInt(capacityMatch[1]);
        occupiedBeds = parseInt(capacityMatch[2]);
        totalBeds = parseInt(capacityMatch[3]);
    }
    
    const waitTime = row.cells[3].textContent.trim();
    
    // Extract status
    const statusEl = row.querySelector('.status-badge');
    const status = statusEl ? statusEl.textContent.trim() : 'Available';
    let statusClass = 'available';
    
    if (status === 'Critical') {
        statusClass = 'maintenance';
    } else if (status === 'High Load') {
        statusClass = 'warning';
    }
    
    // Get contact
    const contact = row.cells[5].textContent.trim();
    
    // Populate modal with data
    document.getElementById('view-hospital-name').textContent = name;
    document.getElementById('view-hospital-address').textContent = address;
    
    // Set coordinates (mock data for demo)
    document.getElementById('view-hospital-coordinates').textContent = '22.3072, 73.1812';
    
    // Set contact information
    document.getElementById('view-hospital-phone').textContent = contact;
    document.getElementById('view-hospital-emergency').textContent = contact; // Using same number for demo
    document.getElementById('view-hospital-email').textContent = `info@${name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    const websiteEl = document.getElementById('view-hospital-website');
    const website = `${name.toLowerCase().replace(/\s+/g, '')}.com`;
    websiteEl.textContent = website;
    websiteEl.href = `https://${website}`;
    
    // Set capacity information
    document.getElementById('view-hospital-beds-total').textContent = totalBeds;
    document.getElementById('view-hospital-beds-available').textContent = totalBeds - occupiedBeds;
    
    // Set mock data for other capacity fields
    document.getElementById('view-hospital-icu-beds').textContent = Math.round(totalBeds * 0.2); // 20% of total beds
    document.getElementById('view-hospital-ventilators').textContent = Math.round(totalBeds * 0.1); // 10% of total beds
    document.getElementById('view-hospital-wait-time').textContent = waitTime;
    
    // Set capacity bar
    const capacityBar = document.getElementById('view-hospital-capacity-bar');
    capacityBar.style.width = `${capacityPercentage}%`;
    document.getElementById('view-hospital-capacity').textContent = capacityText;
    
    // Set status badge
    const statusBadge = document.getElementById('view-hospital-status');
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${statusClass}`;
    
    // Set mock data for hospital type and services
    document.getElementById('view-hospital-type').textContent = name.includes('SSG') ? 'Government' : 'Private';
    
    // Set specialties based on hospital name for demo
    let specialties = 'General Medicine, Surgery, Pediatrics';
    if (name.includes('Cancer')) {
        specialties = 'Oncology, Radiology, Chemotherapy';
    } else if (name.includes('Heart') || name.includes('Cardiac')) {
        specialties = 'Cardiology, Cardiac Surgery, Vascular Medicine';
    }
    document.getElementById('view-hospital-specialties').textContent = specialties;
    
    // Set mock data for services
    document.getElementById('view-hospital-emergency-services').textContent = 'Yes';
    document.getElementById('view-hospital-trauma-center').textContent = status === 'Critical' ? 'No' : 'Yes';
    document.getElementById('view-hospital-blood-bank').textContent = 'Yes';
    document.getElementById('view-hospital-24x7').textContent = 'Yes';
    
    // Initialize hospital map
    setTimeout(() => {
        const mapElement = document.getElementById('view-hospital-map');
        if (mapElement && typeof L !== 'undefined') {
            // Check if map already initialized
            if (window.hospitalDetailMap) {
                window.hospitalDetailMap.remove();
            }
            
            // Create map
            window.hospitalDetailMap = L.map('view-hospital-map').setView([22.3072, 73.1812], 15);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(window.hospitalDetailMap);
            
            // Add marker
            L.marker([22.3072, 73.1812]).addTo(window.hospitalDetailMap)
                .bindPopup(`<b>${name}</b><br>${address}`).openPopup();
        }
    }, 300);
    
    // Set up edit button
    const editBtn = document.getElementById('view-hospital-edit');
    if (editBtn) {
        editBtn.onclick = () => {
            closeModal('view-hospital-modal');
            showNotification(`Editing ${name}`, 'info');
        };
    }
    
    // Set up close button
    const closeBtn = document.querySelector('#view-hospital-modal .close-modal-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            closeModal('view-hospital-modal');
        };
    }
    
    // Open modal
    openModal('view-hospital-modal');
}

/**
 * Update dashboard stats
 */
function updateDashboardStats() {
    // Get counts
    const hospitalCount = document.querySelectorAll('#hospitals-tab .data-table tbody tr').length;
    
    // Update hospital count on dashboard
    const hospitalStatValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (hospitalStatValue) {
        hospitalStatValue.textContent = hospitalCount;
    }
    
    // Update hospital summary information
    updateHospitalSummary();
    
    // Update last updated timestamp
    updateLastUpdatedTimestamp();
}

/**
 * Update hospital summary information
 */
function updateHospitalSummary() {
    // Get all hospital rows
    const hospitalRows = document.querySelectorAll('#hospitals-tab .data-table tbody tr');
    
    // Calculate totals
    let totalHospitals = hospitalRows.length;
    let totalBeds = 0;
    let availableBeds = 0;
    let criticalHospitals = 0;
    
    hospitalRows.forEach(row => {
        // Get capacity text which is in format "XX% (YY/ZZ)"
        const capacityText = row.querySelector('.capacity-indicator span').textContent;
        
        // Extract total and available beds using regex
        const bedMatch = capacityText.match(/\((\d+)\/(\d+)\)/);
        if (bedMatch && bedMatch.length >= 3) {
            const occupied = parseInt(bedMatch[1]);
            const total = parseInt(bedMatch[2]);
            
            totalBeds += total;
            availableBeds += (total - occupied);
        }
        
        // Check if hospital is critical
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge && statusBadge.textContent === 'Critical') {
            criticalHospitals++;
        }
    });
    
    // Update summary elements
    const totalHospitalsEl = document.getElementById('total-hospitals');
    const totalBedsEl = document.getElementById('total-beds');
    const availableBedsEl = document.getElementById('available-beds');
    const criticalHospitalsEl = document.getElementById('critical-hospitals');
    
    if (totalHospitalsEl) totalHospitalsEl.textContent = totalHospitals;
    if (totalBedsEl) totalBedsEl.textContent = totalBeds;
    if (availableBedsEl) availableBedsEl.textContent = availableBeds;
    if (criticalHospitalsEl) criticalHospitalsEl.textContent = criticalHospitals;
}

/**
 * Update last updated timestamp
 */
function updateLastUpdatedTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();
    
    // Format: "Today, 2:30 PM" or "Jan 15, 2023, 2:30 PM"
    const isToday = new Date().setHours(0,0,0,0) === new Date(now).setHours(0,0,0,0);
    const formattedDate = isToday ? `Today, ${timeString}` : `${dateString}, ${timeString}`;
    
    // Update the hospital section timestamp
    const hospitalLastUpdatedEl = document.getElementById('hospital-last-updated');
    if (hospitalLastUpdatedEl) {
        hospitalLastUpdatedEl.textContent = formattedDate;
    }
    
    // Update any other last-updated elements
    const lastUpdatedEls = document.querySelectorAll('.last-updated span:not(#hospital-last-updated)');
    lastUpdatedEls.forEach(el => {
        el.textContent = formattedDate;
    });
}

/**
/**
 * Smart Ambulance Routing System
 * Admin Panel Functionality
 */

/**
 * Initialize the admin panel
 */
function initAdminPanel() {
    console.log('Initializing admin panel');
    
    // Set up sidebar navigation
    setupSidebarNav();
    
    // Set up admin dashboard
    setupAdminDashboard();
    
    // Initialize charts
    initCharts();
    
    // Set up date range pickers
    setupDateRange();
    
    // Load active emergencies
    loadActiveEmergencies();
    
    // Set up ambulance management
    setupAmbulanceManagement();
    
    // Set up hospital management
    setupHospitalManagement();
    
    // Set up user management
    setupUserManagement();
    
    // Set up settings management
    setupSettingsManagement();
    
    // Set up emergency management
    setupEmergencyManagement();
    
    // Set up route management
    setupRouteManagement();
    
    // Set up modals
    setupModals();
    
    // Set up mobile sidebar toggle
    setupMobileSidebar();
    
    // Set up location buttons
    setupLocationButtons();
    
    // Initialize maps
    setTimeout(() => {
        // Add a small delay to ensure DOM is fully loaded
        try {
            if (document.getElementById('admin-overview-map')) {
                // Initialize admin overview map
                const adminMap = L.map('admin-overview-map', {
                    center: [22.3072, 73.1812], // Vadodara, India
                    zoom: 12
                });
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(adminMap);
            }
            
            if (document.getElementById('ambulance-map')) {
                initAmbulanceMap();
            }
            
            if (document.getElementById('route-map')) {
                initRouteMap();
            }
        } catch (e) {
            console.error('Error initializing maps:', e);
        }
    }, 500);
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
    const addAmbulanceModal = document.getElementById('add-ambulance-modal');
    const addAmbulanceBtn = document.getElementById('add-ambulance-btn');
    const closeModal = addAmbulanceModal.querySelector('.close-modal');
    const cancelBtn = addAmbulanceModal.querySelector('.cancel-btn');
    const ambulanceForm = document.getElementById('add-ambulance-form');
    const refreshBtn = document.getElementById('refresh-ambulances-btn');
    
    // Tab navigation for ambulance form
    const formTabs = ambulanceForm.querySelectorAll('.form-tab');
    const formTabContents = ambulanceForm.querySelectorAll('.form-tab-content');
    const nextTabBtn = document.getElementById('next-tab-ambulance');
    const prevTabBtn = document.getElementById('prev-tab-ambulance');
    const submitBtn = ambulanceForm.querySelector('button[type="submit"]');
    
    let currentTabIndex = 0;
    
    // Function to show a specific tab
    function showTab(index) {
        formTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        formTabContents.forEach((content, i) => {
            if (i === index) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update progress bar
        const progressSegments = ambulanceForm.querySelectorAll('.progress-segment');
        progressSegments.forEach((segment, i) => {
            if (i <= index) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
        
        // Show/hide navigation buttons
        if (index === 0) {
            prevTabBtn.style.display = 'none';
        } else {
            prevTabBtn.style.display = 'block';
        }
        
        if (index === formTabs.length - 1) {
            nextTabBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextTabBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Tab click event
    formTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            showTab(index);
        });
    });
    
    // Next button click
    nextTabBtn.addEventListener('click', () => {
        if (validateCurrentTab()) {
            if (currentTabIndex < formTabs.length - 1) {
                showTab(currentTabIndex + 1);
            }
        }
    });
    
    // Previous button click
    prevTabBtn.addEventListener('click', () => {
        if (currentTabIndex > 0) {
            showTab(currentTabIndex - 1);
        }
    });
    
    // Validate current tab
    function validateCurrentTab() {
        let isValid = true;
        const currentTab = formTabContents[currentTabIndex];
        
        // Get all required inputs in the current tab
        const requiredInputs = currentTab.querySelectorAll('input[required], select[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('input-error');
                showNotification('Please fill all required fields marked with *', 'error');
            } else {
                input.classList.remove('input-error');
            }
        });
        
        // Specific validations based on tab
        if (currentTabIndex === 0) { // Basic Info tab
            const ambulanceId = document.getElementById('ambulance-id');
            if (ambulanceId.value && !/^AMB-\d{4}$/.test(ambulanceId.value)) {
                isValid = false;
                ambulanceId.classList.add('input-error');
                showNotification('Ambulance ID should be in format AMB-XXXX (e.g., AMB-1234)', 'error');
            }
            
            const registrationNo = document.getElementById('ambulance-registration');
            if (registrationNo.value && !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(registrationNo.value)) {
                isValid = false;
                registrationNo.classList.add('input-error');
                showNotification('Vehicle Registration should be in a valid format (e.g., MH02AB1234)', 'error');
            }
        } else if (currentTabIndex === 2) { // Staff tab
            const driverPhone = document.getElementById('driver-phone');
            if (driverPhone.value && !/^[0-9]{10}$/.test(driverPhone.value)) {
                isValid = false;
                driverPhone.classList.add('input-error');
                showNotification('Phone number should be a 10-digit number', 'error');
            }
        }
        
        return isValid;
    }

    // Handle form input events to remove error class
    ambulanceForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
    });

    // Initialize map for location selection
    const mapPickerBtn = document.getElementById('show-map-picker-ambulance');
    const mapPreview = document.getElementById('ambulance-map-preview');
    let mapInstance = null;
    
    // Initialize map preview
    if (mapPreview) {
        // Check if Leaflet is available
        if (typeof L !== 'undefined') {
            mapInstance = L.map(mapPreview).setView([22.3072, 73.1812], 12); // Vadodara coordinates
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstance);
            
            // Add marker for ambulance location
            const ambulanceMarker = L.marker([22.3072, 73.1812], {
                draggable: true
            }).addTo(mapInstance);
            
            // Update coordinates on marker drag
            ambulanceMarker.on('dragend', function(event) {
                const marker = event.target;
                const position = marker.getLatLng();
                
                document.getElementById('ambulance-lat').value = position.lat.toFixed(6);
                document.getElementById('ambulance-lng').value = position.lng.toFixed(6);
                
                // Update route metrics (for demo)
                updateRouteMetrics();
            });
        }
    }
    
    // Map control buttons
    const mapControls = document.querySelectorAll('.map-controls .map-control-btn');
    if (mapControls.length > 0 && mapInstance) {
        // Zoom in
        mapControls[0].addEventListener('click', () => {
            mapInstance.setZoom(mapInstance.getZoom() + 1);
        });
        
        // Zoom out
        mapControls[1].addEventListener('click', () => {
            mapInstance.setZoom(mapInstance.getZoom() - 1);
        });
        
        // Center map
        mapControls[2].addEventListener('click', () => {
            mapInstance.setView([22.3072, 73.1812], 12);
        });
    }
    
    // Use current location button
    const useCurrentLocationBtn = document.querySelector('.auto-locate[data-target="ambulance"]');
    if (useCurrentLocationBtn) {
        useCurrentLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    document.getElementById('ambulance-lat').value = position.coords.latitude.toFixed(6);
                    document.getElementById('ambulance-lng').value = position.coords.longitude.toFixed(6);
                    
                    // Update map if available
                    if (mapInstance) {
                        mapInstance.setView([position.coords.latitude, position.coords.longitude], 15);
                        
                        // Update marker position
                        const markers = mapInstance._layers;
                        for (let id in markers) {
                            if (markers[id] instanceof L.Marker) {
                                markers[id].setLatLng([position.coords.latitude, position.coords.longitude]);
                                break;
                            }
                        }
                    }
                    
                    // Update route metrics (for demo)
                    updateRouteMetrics();
                    
                    showNotification('Current location set', 'success');
                }, error => {
                    showNotification('Could not get current location: ' + error.message, 'error');
                });
            } else {
                showNotification('Geolocation is not supported by this browser', 'error');
            }
        });
    }
    
    // Use hospital location button
    const useHospitalLocationBtn = document.getElementById('use-hospital-location');
    if (useHospitalLocationBtn) {
        useHospitalLocationBtn.addEventListener('click', () => {
            const selectedHospital = document.getElementById('ambulance-hospital').value;
            
            // Hospital coordinates (approximate for Vadodara hospitals)
            const hospitalCoordinates = {
                'SSG Hospital': [22.3217, 73.1851],
                'Bhailal Amin General Hospital': [22.3003, 73.1759],
                'Baroda Medical College Hospital': [22.3144, 73.1932],
                'Kailash Cancer Hospital': [22.3003, 73.1759],
                'Sterling Hospital': [22.3119, 73.1723]
            };
            
            if (selectedHospital && hospitalCoordinates[selectedHospital]) {
                const [lat, lng] = hospitalCoordinates[selectedHospital];
                document.getElementById('ambulance-lat').value = lat.toFixed(6);
                document.getElementById('ambulance-lng').value = lng.toFixed(6);
                
                // Update map if available
                if (mapInstance) {
                    mapInstance.setView([lat, lng], 15);
                    
                    // Update marker position
                    const markers = mapInstance._layers;
                    for (let id in markers) {
                        if (markers[id] instanceof L.Marker) {
                            markers[id].setLatLng([lat, lng]);
                            break;
                        }
                    }
                }
                
                // Update route metrics (for demo)
                updateRouteMetrics();
                
                showNotification('Hospital location set', 'success');
            } else {
                showNotification('Please select a hospital first', 'warning');
            }
        });
    }
    
    // Update route metrics for demo purposes
    function updateRouteMetrics() {
        const routeMetrics = document.querySelectorAll('.route-metric .metric-value');
        if (routeMetrics.length >= 4) {
            // Random travel time between 8 and 15 minutes
            routeMetrics[0].textContent = Math.floor(Math.random() * 8) + 8 + ' mins';
            
            // Random distance between 3 and 7 km
            routeMetrics[1].textContent = (Math.floor(Math.random() * 40) / 10 + 3).toFixed(1) + ' km';
            
            // Random response time between 6 and 10 minutes
            routeMetrics[2].textContent = Math.floor(Math.random() * 5) + 6 + ' mins';
            
            // Traffic condition
            const trafficConditions = ['Good', 'Moderate', 'Heavy'];
            const randomCondition = trafficConditions[Math.floor(Math.random() * 3)];
            routeMetrics[3].textContent = randomCondition;
            
            // Update class for color coding
            routeMetrics[3].className = 'metric-value';
            if (randomCondition === 'Good') routeMetrics[3].classList.add('status-good');
            if (randomCondition === 'Moderate') routeMetrics[3].classList.add('status-warning');
            if (randomCondition === 'Heavy') routeMetrics[3].classList.add('status-danger');
        }
    }
    
    // Document upload functionality
    const uploadButtons = document.querySelectorAll('.upload-btn');
    uploadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*,.pdf,.doc,.docx';
            
            fileInput.addEventListener('change', function() {
                if (fileInput.files.length > 0) {
                    const fileName = fileInput.files[0].name;
                    button.innerHTML = `<i class="fas fa-check"></i> ${fileName}`;
                    button.style.backgroundColor = '#e6f7ee';
                    button.style.borderColor = '#2ed573';
                    button.style.color = '#2ed573';
                }
            });
            
            fileInput.click();
        });
    });
    
    // Initialize document validity dates
    const validityDates = document.querySelectorAll('.document-validity .mini-date');
    validityDates.forEach(dateInput => {
        // Set default expiry date to one year from now
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        dateInput.valueAsDate = oneYearFromNow;
        
        // Add event listener to highlight expired dates
        dateInput.addEventListener('change', function() {
            const today = new Date();
            const expiryDate = new Date(this.value);
            
            if (expiryDate < today) {
                this.classList.add('expired-date');
                this.parentElement.classList.add('expired');
            } else {
                this.classList.remove('expired-date');
                this.parentElement.classList.remove('expired');
            }
        });
    });
    
    if (addAmbulanceBtn) {
        addAmbulanceBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'block';
            // Reset the form and show first tab
            ambulanceForm.reset();
            showTab(0);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (ambulanceForm) {
        ambulanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab()) {
                return;
            }
            
            // Collect data from the form
            const ambulanceData = {
                id: document.getElementById('ambulance-id').value,
                registration: document.getElementById('ambulance-registration').value,
                type: document.getElementById('ambulance-type').value,
                make: document.getElementById('ambulance-make').value,
                year: document.getElementById('ambulance-year').value,
                vin: document.getElementById('ambulance-vin')?.value || '',
                capacity: document.getElementById('ambulance-capacity').value,
                fuelType: document.getElementById('ambulance-fuel-type').value,
                status: document.getElementById('ambulance-status').value,
                
                // Vehicle details
                insurance: document.getElementById('ambulance-insurance').value,
                lastService: document.getElementById('ambulance-last-service').value,
                nextService: document.getElementById('ambulance-next-service').value,
                mileage: document.getElementById('ambulance-mileage').value,
                
                // Equipment
                equipment: {
                    // Basic equipment
                    firstAid: document.getElementById('equipment-first-aid').checked,
                    oxygen: document.getElementById('equipment-oxygen').checked,
                    stretcher: document.getElementById('equipment-stretcher').checked,
                    wheelchair: document.getElementById('equipment-wheelchair').checked,
                    
                    // Advanced equipment
                    aed: document.getElementById('equipment-aed').checked,
                    ventilator: document.getElementById('equipment-ventilator').checked,
                    ecg: document.getElementById('equipment-ecg').checked,
                    suction: document.getElementById('equipment-suction').checked,
                    infusion: document.getElementById('equipment-infusion').checked,
                    oximeter: document.getElementById('equipment-oximeter').checked,
                    
                    // Other equipment
                    other: document.getElementById('equipment-others').value,
                    
                    // Medication
                    medication: document.getElementById('equipment-medication').value,
                    
                    // New equipment fields with quantities
                    oxygenQuantity: document.getElementById('oxygen-quantity')?.value || '1',
                    stretcherType: document.getElementById('stretcher-type')?.value || 'Standard',
                    ventilatorType: document.getElementById('ventilator-type')?.value || 'Standard',
                },
                
                // Staff information
                driver: {
                    name: document.getElementById('driver-name').value,
                    phone: document.getElementById('driver-phone').value,
                    license: document.getElementById('driver-license').value,
                    licenseExpiry: document.getElementById('driver-license-expiry').value,
                    age: document.getElementById('driver-age')?.value || '',
                    experience: document.getElementById('driver-experience')?.value || '',
                    shift: document.getElementById('driver-shift')?.value || '',
                    address: document.getElementById('driver-address')?.value || '',
                },
                
                paramedic: {
                    name: document.getElementById('paramedic-name').value,
                    phone: document.getElementById('paramedic-phone').value,
                    qualification: document.getElementById('paramedic-qualification')?.value || '',
                    experience: document.getElementById('paramedic-experience')?.value || '',
                    license: document.getElementById('paramedic-license')?.value || '',
                    shift: document.getElementById('paramedic-shift')?.value || '',
                    emergencyContact: document.getElementById('paramedic-emergency-contact')?.value || '',
                    specializations: Array.from(document.getElementById('paramedic-specializations')?.selectedOptions || [])
                        .map(option => option.value),
                },
                
                additionalStaff: document.getElementById('additional-staff').value,
                
                // Maintenance information
                maintenance: {
                    type: document.getElementById('maintenance-type')?.value || '',
                    intervalKm: document.getElementById('maintenance-interval-km')?.value || '',
                    intervalDays: document.getElementById('maintenance-interval-days')?.value || '',
                    vendor: document.getElementById('maintenance-vendor')?.value || '',
                    notes: document.getElementById('maintenance-notes')?.value || '',
                },
                
                // Documentation
                documents: {
                    registration: {
                        status: document.getElementById('doc-registration')?.checked || false,
                        validity: document.getElementById('doc-registration')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    insurance: {
                        status: document.getElementById('doc-insurance')?.checked || false,
                        validity: document.getElementById('doc-insurance')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    fitness: {
                        status: document.getElementById('doc-fitness')?.checked || false,
                        validity: document.getElementById('doc-fitness')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    pollution: {
                        status: document.getElementById('doc-pollution')?.checked || false,
                        validity: document.getElementById('doc-pollution')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    permit: {
                        status: document.getElementById('doc-permit')?.checked || false,
                        validity: document.getElementById('doc-permit')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    tax: {
                        status: document.getElementById('doc-tax')?.checked || false,
                        validity: document.getElementById('doc-tax')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    notes: document.getElementById('documentation-notes')?.value || '',
                },
                
                // Location information
                location: {
                    hospital: document.getElementById('ambulance-hospital')?.value || '',
                    baseLocation: document.getElementById('ambulance-base-location')?.value || '',
                    serviceArea: document.getElementById('ambulance-service-area')?.value || '',
                    responseRadius: document.getElementById('ambulance-response-radius')?.value || '',
                    distanceLimit: document.getElementById('distance-limit-daily')?.value || '',
                    coverageArea: document.getElementById('coverage-area')?.value || '',
                    currentLocation: {
                        lat: document.getElementById('ambulance-lat')?.value || '',
                        lng: document.getElementById('ambulance-lng')?.value || '',
                    }
                },
                
                timestamp: Date.now()
            };
            
            // For demonstration, show the data in a notification
            console.log('Ambulance Data:', ambulanceData);
            
            // Save to localStorage (or send to server in production)
            const ambulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
            ambulances.push(ambulanceData);
            localStorage.setItem('ambulances', JSON.stringify(ambulances));
            
            // Close modal and show success notification
            addAmbulanceModal.style.display = 'none';
            showNotification('Ambulance added successfully!', 'success');
            
            // Refresh the ambulance list
            loadAmbulances();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // In a real scenario, this would fetch from API
            // For demo, we'll just show a notification
            showNotification('Ambulance list refreshed', 'info');
        });
    }

    // Add sample ambulances for demo
    addDemoAmbulances();
}

function addAmbulanceToTable(ambulanceData) {
    const ambulanceTable = document.querySelector('.ambulance-table tbody');
    
    if (!ambulanceTable) return;
    
    const newRow = document.createElement('tr');
    newRow.classList.add('new-row-highlight');
    
    // Create cells with ambulance data
    newRow.innerHTML = `
        <td>${ambulanceData.id}</td>
        <td>${getAmbulanceTypeLabel(ambulanceData.type)}</td>
        <td>${ambulanceData.driver.name || 'N/A'}</td>
        <td>${ambulanceData.baseLocation}</td>
        <td>${ambulanceData.status ? capitalizeFirstLetter(ambulanceData.status) : 'Unknown'}</td>
        <td>
            <div class="action-buttons">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
                <button class="view-btn"><i class="fas fa-eye"></i></button>
            </div>
        </td>
    `;
    
    // Add event listeners for the action buttons
    const editBtn = newRow.querySelector('.edit-btn');
    const deleteBtn = newRow.querySelector('.delete-btn');
    const viewBtn = newRow.querySelector('.view-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showNotification('Edit functionality coming soon', 'info');
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            newRow.classList.add('delete-animation');
            setTimeout(() => {
                ambulanceTable.removeChild(newRow);
                showNotification('Ambulance removed successfully', 'success');
            }, 500);
        });
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            showNotification('View details functionality coming soon', 'info');
        });
    }
    
    // Add to table and remove highlight after animation
    ambulanceTable.appendChild(newRow);
    setTimeout(() => {
        newRow.classList.remove('new-row-highlight');
    }, 3000);
}

function getAmbulanceTypeLabel(type) {
    const types = {
        'type1': 'Type I (Basic)',
        'type2': 'Type II (Mobile Emergency)',
        'type3': 'Type III (Advanced Life Support)',
        'type4': 'Mobile ICU',
        'neonatal': 'Neonatal',
        'mortuary': 'Mortuary'
    };
    
    return types[type] || 'Unknown Type';
}

function addDemoAmbulances() {
    const ambulances = [
        {
            id: 'AMB-1001',
            registration: 'GJ06AB1234',
            type: 'type2',
            make: 'Tata Winger',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Rajesh Kumar',
                phone: '9876543210'
            },
            baseLocation: 'SSG Hospital',
            hospital: 'SSG Hospital'
        },
        {
            id: 'AMB-1002',
            registration: 'GJ06CD5678',
            type: 'type3',
            make: 'Force Traveller',
            year: '2021',
            capacity: '3',
            fuelType: 'diesel',
            status: 'dispatched',
            driver: {
                name: 'Suresh Patel',
                phone: '9876543211'
            },
            baseLocation: 'Bhailal Amin General Hospital',
            hospital: 'Bhailal Amin General Hospital'
        },
        {
            id: 'AMB-1003',
            registration: 'GJ06EF9012',
            type: 'type4',
            make: 'Tata Winger',
            year: '2023',
            capacity: '1',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Amit Singh',
                phone: '9876543212'
            },
            baseLocation: 'Sterling Hospital',
            hospital: 'Sterling Hospital'
        },
        {
            id: 'AMB-1004',
            registration: 'GJ06GH3456',
            type: 'neonatal',
            make: 'Force Traveller',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'maintenance',
            driver: {
                name: 'Dinesh Shah',
                phone: '9876543213'
            },
            baseLocation: 'Baroda Medical College Hospital',
            hospital: 'Baroda Medical College Hospital'
        }
    ];
    
    ambulances.forEach(ambulance => {
        addAmbulanceToTable(ambulance);
    });
}

/**
 * Set up hospital management
 */
function setupHospitalManagement() {
    // Add hospital button
    const addHospitalBtn = document.getElementById('add-hospital-btn');
    if (addHospitalBtn) {
        addHospitalBtn.addEventListener('click', () => {
            // Show the add hospital form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'block';
                
                // Add tooltips to form fields for better guidance
                addFormTooltips();
                
                // Add dynamic field interactions
                setupDynamicFormFields();
                
                // Scroll to the form
                formContainer.scrollIntoView({ behavior: 'smooth' });
                showNotification('Please fill in the hospital details', 'info');
            }
        });
    }
    
    // Handle form submission
    const hospitalForm = document.getElementById('add-hospital-form');
    if (hospitalForm) {
        hospitalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!validateHospitalForm()) {
                showNotification('Please correct the errors in the form', 'error');
                return;
            }
            
            // Get all the form values
            const hospitalName = document.getElementById('hospital-name').value;
            const hospitalType = document.getElementById('hospital-type').value;
            const hospitalAddress = document.getElementById('hospital-address').value;
            const hospitalArea = document.getElementById('hospital-area').value;
            const hospitalCity = document.getElementById('hospital-city').value;
            const hospitalPincode = document.getElementById('hospital-pincode').value;
            
            const hospitalPhone = document.getElementById('hospital-phone').value;
            const hospitalEmergencyPhone = document.getElementById('hospital-emergency-phone').value;
            const hospitalEmail = document.getElementById('hospital-email').value;
            const hospitalWebsite = document.getElementById('hospital-website').value;
            
            const hospitalBedsTotal = document.getElementById('hospital-beds-total').value;
            const hospitalBedsAvailable = document.getElementById('hospital-beds-available').value;
            const hospitalICUBeds = document.getElementById('hospital-icu-beds')?.value || 0;
            const hospitalVentilators = document.getElementById('hospital-ventilators')?.value || 0;
            const hospitalWaitTime = document.getElementById('hospital-wait-time').value;
            
            const hospitalLat = document.getElementById('hospital-lat').value;
            const hospitalLng = document.getElementById('hospital-lng').value;
            
            // Get specialty information
            const hospitalSpecialties = document.getElementById('hospital-specialties').value;
            const hospitalEmergency = document.getElementById('hospital-emergency')?.checked || false;
            const hospitalTraumaCenter = document.getElementById('hospital-trauma-center')?.checked || false;
            const hospitalBloodBank = document.getElementById('hospital-blood-bank')?.checked || false;
            const hospital24x7 = document.getElementById('hospital-24x7')?.checked || false;
            
            // Check required fields
            if (!hospitalName || !hospitalAddress || !hospitalBedsTotal || !hospitalBedsAvailable || !hospitalWaitTime) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Calculate capacity percentage
            const totalBeds = parseInt(hospitalBedsTotal);
            const availableBeds = parseInt(hospitalBedsAvailable);
            const capacityPercentage = Math.round(((totalBeds - availableBeds) / totalBeds) * 100);
            
            // Determine status based on capacity
            let status = 'Available';
            if (capacityPercentage >= 90) {
                status = 'Critical';
            } else if (capacityPercentage >= 75) {
                status = 'High Load';
            }
            
            // Construct full address
            const fullAddress = `${hospitalAddress}, ${hospitalArea ? hospitalArea + ', ' : ''}${hospitalCity}${hospitalPincode ? ', ' + hospitalPincode : ''}`;
            
            // Create a rich hospital object with all details
            const hospitalData = {
                name: hospitalName,
                type: hospitalType,
                address: fullAddress,
                capacity: {
                    percentage: capacityPercentage,
                    available: availableBeds,
                    total: totalBeds,
                    icu: hospitalICUBeds,
                    ventilators: hospitalVentilators
                },
                contact: {
                    phone: hospitalPhone,
                    emergency: hospitalEmergencyPhone,
                    email: hospitalEmail,
                    website: hospitalWebsite
                },
                location: {
                    lat: hospitalLat,
                    lng: hospitalLng
                },
                services: {
                    specialties: hospitalSpecialties,
                    emergency: hospitalEmergency,
                    traumaCenter: hospitalTraumaCenter,
                    bloodBank: hospitalBloodBank,
                    open24x7: hospital24x7
                },
                waitTime: hospitalWaitTime + ' mins',
                status: status
            };
            
            // Add the hospital to the table
            addHospitalToTable(hospitalData);
            
            // Show confirmation with more details
            showNotification(`Hospital "${hospitalName}" has been added successfully with ${totalBeds} beds`, 'success');
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Hide the form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
            
            // Reset the form
            hospitalForm.reset();
        });
    }
    
    // Set up form toggle buttons
    const toggleFormBtns = document.querySelectorAll('.toggle-form');
    toggleFormBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const formContainer = document.getElementById(targetId + '-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
        });
    });
    
    // Set up hospital action buttons
    setupHospitalActionButtons();
}

/**
 * Add tooltips to hospital form fields
 */
function addFormTooltips() {
    // Add tooltips to form fields to provide guidance
    const tooltips = {
        'hospital-name': 'Enter the official name of the hospital',
        'hospital-type': 'Select the type of hospital (Government, Private, etc.)',
        'hospital-address': 'Enter the street address of the hospital',
        'hospital-area': 'Enter the area or locality name',
        'hospital-city': 'Enter the city name',
        'hospital-pincode': 'Enter the 6-digit PIN code',
        'hospital-phone': 'Enter the main contact number with country code',
        'hospital-emergency-phone': 'Enter emergency contact number',
        'hospital-email': 'Enter official email address',
        'hospital-website': 'Enter complete website URL including https://',
        'hospital-beds-total': 'Enter total number of beds in the hospital',
        'hospital-beds-available': 'Enter number of currently available beds',
        'hospital-icu-beds': 'Enter number of ICU beds',
        'hospital-ventilators': 'Enter number of ventilators available',
        'hospital-ambulances': 'Enter number of ambulances operated by the hospital',
        'hospital-wait-time': 'Enter average emergency wait time in minutes',
        'hospital-specialties': 'Enter medical specialties separated by commas',
        'hospital-lat': 'Enter latitude coordinate (use buttons below to get coordinates)',
        'hospital-lng': 'Enter longitude coordinate (use buttons below to get coordinates)'
    };
    
    // Apply tooltips to elements
    for (const [id, tooltip] of Object.entries(tooltips)) {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('title', tooltip);
            
            // Add input validation feedback
            if (element.hasAttribute('required')) {
                element.addEventListener('input', () => {
                    if (element.value.trim() === '') {
                        element.classList.add('input-error');
                    } else {
                        element.classList.remove('input-error');
                    }
                });
            }
        }
    }
}

/**
 * Setup dynamic form field interactions
 */
function setupDynamicFormFields() {
    // Add interactions between related fields
    
    // Update available beds validation to be less than total beds
    const totalBedsInput = document.getElementById('hospital-beds-total');
    const availableBedsInput = document.getElementById('hospital-beds-available');
    
    if (totalBedsInput && availableBedsInput) {
        totalBedsInput.addEventListener('input', () => {
            const totalBeds = parseInt(totalBedsInput.value) || 0;
            availableBedsInput.setAttribute('max', totalBeds);
            
            // Validate available beds against total beds
            const availableBeds = parseInt(availableBedsInput.value) || 0;
            if (availableBeds > totalBeds) {
                availableBedsInput.value = totalBeds;
            }
        });
    }
    
    // Update hospital type dependent fields
    const hospitalTypeSelect = document.getElementById('hospital-type');
    if (hospitalTypeSelect) {
        hospitalTypeSelect.addEventListener('change', () => {
            const type = hospitalTypeSelect.value;
            
            // Show/hide fields based on hospital type
            const traumaCenterCheckbox = document.getElementById('hospital-trauma-center');
            if (traumaCenterCheckbox) {
                if (type === 'government' || type === 'speciality') {
                    traumaCenterCheckbox.parentElement.style.display = 'block';
                } else {
                    traumaCenterCheckbox.checked = false;
                    traumaCenterCheckbox.parentElement.style.display = 'none';
                }
            }
            
            // Update placeholders for specialties based on type
            const specialtiesInput = document.getElementById('hospital-specialties');
            if (specialtiesInput) {
                if (type === 'speciality') {
                    specialtiesInput.placeholder = 'Primary specialty (e.g. Cancer, Cardiac, Orthopedic)';
                } else {
                    specialtiesInput.placeholder = 'e.g. Cardiology, Neurology, Orthopedics';
                }
            }
        });
    }
    
    // Add coordinate fetching functionality
    const latInput = document.getElementById('hospital-lat');
    const lngInput = document.getElementById('hospital-lng');
    const autoLocateBtn = document.querySelector('.auto-locate[data-target="hospital"]');
    
    if (latInput && lngInput && autoLocateBtn) {
        // Use browser geolocation API
        autoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                autoLocateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
                autoLocateBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        latInput.value = position.coords.latitude.toFixed(6);
                        lngInput.value = position.coords.longitude.toFixed(6);
                        
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        
                        showNotification('Location updated successfully', 'success');
                        
                        // Highlight the fields to show they've been updated
                        latInput.classList.add('field-updated');
                        lngInput.classList.add('field-updated');
                        
                        setTimeout(() => {
                            latInput.classList.remove('field-updated');
                            lngInput.classList.remove('field-updated');
                        }, 2000);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        showNotification('Could not get your location. Please try again or enter manually.', 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }
}

/**
 * Validate hospital form
 * @returns {boolean} Whether the form is valid
 */
function validateHospitalForm() {
    let isValid = true;
    const requiredFields = [
        'hospital-name',
        'hospital-type',
        'hospital-address',
        'hospital-area',
        'hospital-city',
        'hospital-pincode',
        'hospital-phone',
        'hospital-email',
        'hospital-beds-total',
        'hospital-beds-available',
        'hospital-wait-time',
        'hospital-lat',
        'hospital-lng'
    ];
    
    // Check required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim() === '') {
            field.classList.add('input-error');
            isValid = false;
            
            // Add error message below the field
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else if (field) {
            field.classList.remove('input-error');
            
            // Remove error message if exists
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                field.parentNode.removeChild(field.nextElementSibling);
            }
        }
    });
    
    // Validate specialty field has at least one specialty
    const specialtiesField = document.getElementById('hospital-specialties');
    if (specialtiesField && specialtiesField.value.trim() === '') {
        specialtiesField.classList.add('input-error');
        if (!specialtiesField.nextElementSibling || !specialtiesField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter at least one specialty';
            specialtiesField.parentNode.insertBefore(errorMsg, specialtiesField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate available beds <= total beds
    const totalBedsField = document.getElementById('hospital-beds-total');
    const availableBedsField = document.getElementById('hospital-beds-available');
    
    if (totalBedsField && availableBedsField && 
        parseInt(availableBedsField.value) > parseInt(totalBedsField.value)) {
        availableBedsField.classList.add('input-error');
        if (!availableBedsField.nextElementSibling || !availableBedsField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Available beds cannot exceed total beds';
            availableBedsField.parentNode.insertBefore(errorMsg, availableBedsField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate email format
    const emailField = document.getElementById('hospital-email');
    if (emailField && emailField.value.trim() !== '') {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('input-error');
            if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid email address';
                emailField.parentNode.insertBefore(errorMsg, emailField.nextSibling);
            }
            isValid = false;
        }
    }
    
    // Validate pincode format (6 digits)
    const pincodeField = document.getElementById('hospital-pincode');
    if (pincodeField && pincodeField.value.trim() !== '') {
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincodeField.value)) {
            pincodeField.classList.add('input-error');
            if (!pincodeField.nextElementSibling || !pincodeField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid 6-digit PIN code';
                pincodeField.parentNode.insertBefore(errorMsg, pincodeField.nextSibling);
            }
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Add hospital to table
 * @param {Object} hospital - Hospital data
 */
function addHospitalToTable(hospital) {
    const hospitalsTable = document.querySelector('#hospitals-tab .data-table tbody');
    if (hospitalsTable) {
        // Create new table row
        const row = document.createElement('tr');
        
        // Create status badge class based on status
        let statusClass = 'available';
        if (hospital.status === 'Critical') {
            statusClass = 'maintenance';
        } else if (hospital.status === 'High Load') {
            statusClass = 'warning';
        }
        
        // Set row content with enhanced data display
        row.innerHTML = `
            <td>${hospital.name}</td>
            <td>${hospital.address}</td>
            <td>
                <div class="capacity-indicator">
                    <div class="capacity-bar-container">
                        <div class="capacity-bar" style="width: ${hospital.capacity.percentage}%"></div>
                    </div>
                    <span>${hospital.capacity.percentage}% (${hospital.capacity.total - hospital.capacity.available}/${hospital.capacity.total})</span>
                </div>
            </td>
            <td>${hospital.waitTime}</td>
            <td><span class="status-badge ${statusClass}">${hospital.status}</span></td>
            <td>${hospital.contact.phone || hospital.contact}</td>
            <td class="actions-cell">
                <button class="action-btn edit" title="Edit hospital details"><i class="fas fa-edit"></i></button>
                <button class="action-btn view" title="View hospital details"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" title="Delete hospital"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add row to table with animation
        row.classList.add('new-row');
        hospitalsTable.appendChild(row);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            row.classList.remove('new-row');
        }, 1000);
        
        // Add event listeners to the new buttons
        const editBtn = row.querySelector('.action-btn.edit');
        const deleteBtn = row.querySelector('.action-btn.delete');
        const viewBtn = row.querySelector('.action-btn.view');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                showNotification(`Editing ${hospitalName}`, 'info');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                if (confirm(`Are you sure you want to delete ${hospitalName}?`)) {
                    // Add row fade out animation
                    row.classList.add('deleting');
                    
                    setTimeout(() => {
                        row.remove();
                        updateDashboardStats();
                        showNotification(`${hospitalName} has been deleted`, 'success');
                    }, 500);
                }
            });
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                viewHospitalDetails(row);
            });
        }
    }
}

/**
 * Set up hospital action buttons
 */
function setupHospitalActionButtons() {
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
                
                // Open the hospital detail view modal
                viewHospitalDetails(row);
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
                    updateDashboardStats();
                }
            });
        });
    }
}

/**
 * View hospital details
 * @param {HTMLElement} row - Table row element with hospital data
 */
function viewHospitalDetails(row) {
    // Extract data from row
    const name = row.cells[0].textContent.trim();
    const address = row.cells[1].textContent.trim();
    
    // Extract capacity information
    const capacityEl = row.querySelector('.capacity-indicator span');
    const capacityText = capacityEl ? capacityEl.textContent.trim() : '';
    const capacityMatch = capacityText.match(/(\d+)%\s*\((\d+)\/(\d+)\)/);
    let capacityPercentage = 0;
    let occupiedBeds = 0;
    let totalBeds = 0;
    
    if (capacityMatch && capacityMatch.length >= 4) {
        capacityPercentage = parseInt(capacityMatch[1]);
        occupiedBeds = parseInt(capacityMatch[2]);
        totalBeds = parseInt(capacityMatch[3]);
    }
    
    const waitTime = row.cells[3].textContent.trim();
    
    // Extract status
    const statusEl = row.querySelector('.status-badge');
    const status = statusEl ? statusEl.textContent.trim() : 'Available';
    let statusClass = 'available';
    
    if (status === 'Critical') {
        statusClass = 'maintenance';
    } else if (status === 'High Load') {
        statusClass = 'warning';
    }
    
    // Get contact
    const contact = row.cells[5].textContent.trim();
    
    // Populate modal with data
    document.getElementById('view-hospital-name').textContent = name;
    document.getElementById('view-hospital-address').textContent = address;
    
    // Set coordinates (mock data for demo)
    document.getElementById('view-hospital-coordinates').textContent = '22.3072, 73.1812';
    
    // Set contact information
    document.getElementById('view-hospital-phone').textContent = contact;
    document.getElementById('view-hospital-emergency').textContent = contact; // Using same number for demo
    document.getElementById('view-hospital-email').textContent = `info@${name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    const websiteEl = document.getElementById('view-hospital-website');
    const website = `${name.toLowerCase().replace(/\s+/g, '')}.com`;
    websiteEl.textContent = website;
    websiteEl.href = `https://${website}`;
    
    // Set capacity information
    document.getElementById('view-hospital-beds-total').textContent = totalBeds;
    document.getElementById('view-hospital-beds-available').textContent = totalBeds - occupiedBeds;
    
    // Set mock data for other capacity fields
    document.getElementById('view-hospital-icu-beds').textContent = Math.round(totalBeds * 0.2); // 20% of total beds
    document.getElementById('view-hospital-ventilators').textContent = Math.round(totalBeds * 0.1); // 10% of total beds
    document.getElementById('view-hospital-wait-time').textContent = waitTime;
    
    // Set capacity bar
    const capacityBar = document.getElementById('view-hospital-capacity-bar');
    capacityBar.style.width = `${capacityPercentage}%`;
    document.getElementById('view-hospital-capacity').textContent = capacityText;
    
    // Set status badge
    const statusBadge = document.getElementById('view-hospital-status');
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${statusClass}`;
    
    // Set mock data for hospital type and services
    document.getElementById('view-hospital-type').textContent = name.includes('SSG') ? 'Government' : 'Private';
    
    // Set specialties based on hospital name for demo
    let specialties = 'General Medicine, Surgery, Pediatrics';
    if (name.includes('Cancer')) {
        specialties = 'Oncology, Radiology, Chemotherapy';
    } else if (name.includes('Heart') || name.includes('Cardiac')) {
        specialties = 'Cardiology, Cardiac Surgery, Vascular Medicine';
    }
    document.getElementById('view-hospital-specialties').textContent = specialties;
    
    // Set mock data for services
    document.getElementById('view-hospital-emergency-services').textContent = 'Yes';
    document.getElementById('view-hospital-trauma-center').textContent = status === 'Critical' ? 'No' : 'Yes';
    document.getElementById('view-hospital-blood-bank').textContent = 'Yes';
    document.getElementById('view-hospital-24x7').textContent = 'Yes';
    
    // Initialize hospital map
    setTimeout(() => {
        const mapElement = document.getElementById('view-hospital-map');
        if (mapElement && typeof L !== 'undefined') {
            // Check if map already initialized
            if (window.hospitalDetailMap) {
                window.hospitalDetailMap.remove();
            }
            
            // Create map
            window.hospitalDetailMap = L.map('view-hospital-map').setView([22.3072, 73.1812], 15);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(window.hospitalDetailMap);
            
            // Add marker
            L.marker([22.3072, 73.1812]).addTo(window.hospitalDetailMap)
                .bindPopup(`<b>${name}</b><br>${address}`).openPopup();
        }
    }, 300);
    
    // Set up edit button
    const editBtn = document.getElementById('view-hospital-edit');
    if (editBtn) {
        editBtn.onclick = () => {
            closeModal('view-hospital-modal');
            showNotification(`Editing ${name}`, 'info');
        };
    }
    
    // Set up close button
    const closeBtn = document.querySelector('#view-hospital-modal .close-modal-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            closeModal('view-hospital-modal');
        };
    }
    
    // Open modal
    openModal('view-hospital-modal');
}

/**
 * Update dashboard stats
 */
function updateDashboardStats() {
    // Get counts
    const hospitalCount = document.querySelectorAll('#hospitals-tab .data-table tbody tr').length;
    
    // Update hospital count on dashboard
    const hospitalStatValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (hospitalStatValue) {
        hospitalStatValue.textContent = hospitalCount;
    }
    
    // Update hospital summary information
    updateHospitalSummary();
    
    // Update last updated timestamp
    updateLastUpdatedTimestamp();
}

/**
 * Update hospital summary information
 */
function updateHospitalSummary() {
    // Get all hospital rows
    const hospitalRows = document.querySelectorAll('#hospitals-tab .data-table tbody tr');
    
    // Calculate totals
    let totalHospitals = hospitalRows.length;
    let totalBeds = 0;
    let availableBeds = 0;
    let criticalHospitals = 0;
    
    hospitalRows.forEach(row => {
        // Get capacity text which is in format "XX% (YY/ZZ)"
        const capacityText = row.querySelector('.capacity-indicator span').textContent;
        
        // Extract total and available beds using regex
        const bedMatch = capacityText.match(/\((\d+)\/(\d+)\)/);
        if (bedMatch && bedMatch.length >= 3) {
            const occupied = parseInt(bedMatch[1]);
            const total = parseInt(bedMatch[2]);
            
            totalBeds += total;
            availableBeds += (total - occupied);
        }
        
        // Check if hospital is critical
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge && statusBadge.textContent === 'Critical') {
            criticalHospitals++;
        }
    });
    
    // Update summary elements
    const totalHospitalsEl = document.getElementById('total-hospitals');
    const totalBedsEl = document.getElementById('total-beds');
    const availableBedsEl = document.getElementById('available-beds');
    const criticalHospitalsEl = document.getElementById('critical-hospitals');
    
    if (totalHospitalsEl) totalHospitalsEl.textContent = totalHospitals;
    if (totalBedsEl) totalBedsEl.textContent = totalBeds;
    if (availableBedsEl) availableBedsEl.textContent = availableBeds;
    if (criticalHospitalsEl) criticalHospitalsEl.textContent = criticalHospitals;
}

/**
 * Update last updated timestamp
 */
function updateLastUpdatedTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();
    
    // Format: "Today, 2:30 PM" or "Jan 15, 2023, 2:30 PM"
    const isToday = new Date().setHours(0,0,0,0) === new Date(now).setHours(0,0,0,0);
    const formattedDate = isToday ? `Today, ${timeString}` : `${dateString}, ${timeString}`;
    
    // Update the hospital section timestamp
    const hospitalLastUpdatedEl = document.getElementById('hospital-last-updated');
    if (hospitalLastUpdatedEl) {
        hospitalLastUpdatedEl.textContent = formattedDate;
    }
    
    // Update any other last-updated elements
    const lastUpdatedEls = document.querySelectorAll('.last-updated span:not(#hospital-last-updated)');
    lastUpdatedEls.forEach(el => {
        el.textContent = formattedDate;
    });
}

/**
 * Set up user management
 */
function setupUserManagement() {
    // Initialize users table with sample data
    const userTable = document.querySelector('#user-management .data-table');
    
    // Sample data for users
    const sampleUsers = [
        { id: 1, name: 'John Doe', role: 'System Admin', contact: '+91 98765 43210', email: 'john@example.com', status: 'active' },
        { id: 2, name: 'Jane Smith', role: 'Hospital Admin', contact: '+91 87654 32109', email: 'jane@hospital.com', status: 'active' },
        { id: 3, name: 'Mike Wilson', role: 'Driver', contact: '+91 76543 21098', email: 'mike@ambulance.com', status: 'active' },
        { id: 4, name: 'Sarah Johnson', role: 'Dispatcher', contact: '+91 65432 10987', email: 'sarah@dispatch.com', status: 'inactive' },
        { id: 5, name: 'Robert Brown', role: 'Doctor', contact: '+91 54321 09876', email: 'robert@hospital.com', status: 'active' }
    ];
    
    // Populate user table with sample data
    if (userTable) {
        const tbody = userTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            sampleUsers.forEach(user => {
                const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.role}</td>
                    <td>${user.contact}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(user.status)}</span></td>
                    <td>
                        <button class="action-btn view-btn" data-id="${user.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
        }
    }
    
    // Add User Modal Functionality
    const addUserBtn = document.querySelector('#add-user-btn');
    const addUserModal = document.querySelector('#add-user-modal');
    const closeModal = addUserModal?.querySelector('.close-modal');
    const cancelAddUser = document.querySelector('#cancel-add-user');
    const addUserForm = document.querySelector('#add-user-form');
    
    // Tab navigation for user form
    const userFormTabs = document.querySelectorAll('#add-user-form .form-tab');
    const userFormTabContents = document.querySelectorAll('#add-user-form .form-tab-content');
    const nextTabBtn = document.querySelector('#next-tab-user');
    const prevTabBtn = document.querySelector('#prev-tab-user');
    const submitUserBtn = document.querySelector('#add-user-form button[type="submit"]');
    const progressSegments = document.querySelectorAll('#add-user-form .progress-segment');
    
    let currentTabIndex = 0;
    
    // Functions to handle tab navigation
    function showUserTab(index) {
        userFormTabs.forEach(tab => tab.classList.remove('active'));
        userFormTabContents.forEach(content => content.classList.remove('active'));
        progressSegments.forEach(segment => segment.classList.remove('active'));
        
        userFormTabs[index].classList.add('active');
        userFormTabContents[index].classList.add('active');
        
        // Update progress bar
        for (let i = 0; i <= index; i++) {
            progressSegments[i].classList.add('active');
        }
        
        // Show/hide navigation buttons based on current tab
        if (index === 0) {
            prevTabBtn.style.display = 'none';
            nextTabBtn.style.display = 'block';
            submitUserBtn.style.display = 'none';
        } else if (index === userFormTabs.length - 1) {
            prevTabBtn.style.display = 'block';
            nextTabBtn.style.display = 'none';
            submitUserBtn.style.display = 'block';
        } else {
            prevTabBtn.style.display = 'block';
            nextTabBtn.style.display = 'block';
            submitUserBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Click events for tab buttons
    if (userFormTabs.length > 0) {
        userFormTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                if (validateCurrentTab(currentTabIndex)) {
                    showUserTab(index);
                } else {
                    showNotification("Please fill in all required fields in the current tab", "error");
                }
            });
        });
    }
    
    // Next and Previous button functionality
    if (nextTabBtn) {
        nextTabBtn.addEventListener('click', () => {
            if (validateCurrentTab(currentTabIndex)) {
                showUserTab(currentTabIndex + 1);
            } else {
                showNotification("Please fill in all required fields in the current tab", "error");
            }
        });
    }
    
    if (prevTabBtn) {
        prevTabBtn.addEventListener('click', () => {
            showUserTab(currentTabIndex - 1);
        });
    }
    
    // Function to validate current tab
    function validateCurrentTab(tabIndex) {
        const currentTabContent = userFormTabContents[tabIndex];
        
        if (!currentTabContent) return true;
        
        const requiredFields = currentTabContent.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Special validation for specific tabs
        if (tabIndex === 1) { // Account Info tab
            const password = document.querySelector('#user-password');
            const confirmPassword = document.querySelector('#user-confirm-password');
            
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                isValid = false;
                confirmPassword.classList.add('error');
                showNotification("Passwords do not match", "error");
            }
        }
        
        return isValid;
    }
    
    // Password validation
    const passwordInput = document.querySelector('#user-password');
    const confirmPasswordInput = document.querySelector('#user-confirm-password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.classList.add('error');
                } else {
                    confirmPasswordInput.classList.remove('error');
                }
            });
        }
    }
    
    // Function to validate password strength
    function validatePassword() {
        const password = passwordInput.value;
        
        // Update password requirement indicators
        updateRequirement('req-length', password.length >= 8);
        updateRequirement('req-uppercase', /[A-Z]/.test(password));
        updateRequirement('req-lowercase', /[a-z]/.test(password));
        updateRequirement('req-number', /[0-9]/.test(password));
        updateRequirement('req-special', /[^A-Za-z0-9]/.test(password));
    }
    
    // Function to update requirement indicators
    function updateRequirement(reqId, isValid) {
        const reqElement = document.getElementById(reqId);
        if (reqElement) {
            const icon = reqElement.querySelector('i');
            
            if (isValid) {
                icon.className = 'fas fa-check-circle';
                reqElement.classList.add('valid');
                reqElement.classList.remove('invalid');
            } else {
                icon.className = 'fas fa-times-circle';
                reqElement.classList.remove('valid');
                reqElement.classList.add('invalid');
            }
        }
    }
    
    // Role preset buttons
    const rolePresetButtons = document.querySelectorAll('.role-preset-btn');
    if (rolePresetButtons.length > 0) {
        rolePresetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const role = button.getAttribute('data-role');
                const roleSelect = document.querySelector('#user-role');
                
                if (roleSelect) {
                    roleSelect.value = role;
                    
                    // Set default permissions based on role
                    resetAllPermissions();
                    
                    switch (role) {
                        case 'system-admin':
                            setAllPermissions(true);
                            break;
                            
                        case 'hospital-admin':
                            setPermissionsByGroup(['Dashboard', 'Hospitals', 'Emergencies'], true);
                            break;
                            
                        case 'dispatcher':
                            setPermissionsByGroup(['Dashboard', 'Ambulances', 'Emergencies', 'Routes & Maps'], true);
                            break;
                            
                        case 'driver':
                            setBasicViewPermissions();
                            break;
                            
                        case 'observer':
                            setBasicViewPermissions();
                            break;
                    }
                    
                    showNotification(`Applied ${button.textContent.trim()} permission preset`, "success");
                }
            });
        });
    }
    
    // Permission management functions
    function setAllPermissions(value) {
        const permCheckboxes = document.querySelectorAll('#permissions-tab input[type="checkbox"]');
        permCheckboxes.forEach(checkbox => {
            checkbox.checked = value;
        });
    }
    
    function resetAllPermissions() {
        setAllPermissions(false);
    }
    
    function setBasicViewPermissions() {
        const viewPermissions = document.querySelectorAll('#permissions-tab input[id^="perm-view-"]');
        viewPermissions.forEach(checkbox => {
            checkbox.checked = true;
        });
    }
    
    function setPermissionsByGroup(groups, value) {
        groups.forEach(group => {
            const groupHeader = Array.from(document.querySelectorAll('#permissions-tab h5'))
                .find(header => header.textContent.trim() === group);
                
            if (groupHeader) {
                const permCategory = groupHeader.closest('.permission-category');
                if (permCategory) {
                    const checkboxes = permCategory.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = value;
                    });
                }
            }
        });
    }
    
    // Open Add User Modal
    if (addUserBtn && addUserModal) {
        addUserBtn.addEventListener('click', () => {
            addUserModal.style.display = 'block';
            // Reset form and show first tab
            addUserForm.reset();
            showUserTab(0);
            
            // Reset password indicators
            document.querySelectorAll('.password-requirements li').forEach(req => {
                req.classList.remove('valid', 'invalid');
                const icon = req.querySelector('i');
                if (icon) icon.className = 'fas fa-times-circle';
            });
        });
    }
    
    // Close Add User Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addUserModal.style.display = 'none';
        });
    }
    
    // Cancel button for Add User Modal
    if (cancelAddUser) {
        cancelAddUser.addEventListener('click', () => {
            addUserModal.style.display = 'none';
        });
    }
    
    // Add User Form Submission
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab(currentTabIndex)) {
                showNotification("Please fill in all required fields", "error");
                return;
            }
            
            // Get form data
            const userData = {
                name: document.querySelector('#user-name').value,
                username: document.querySelector('#user-username').value,
                email: document.querySelector('#user-email').value,
                contact: document.querySelector('#user-contact').value,
                role: document.querySelector('#user-role').value,
                status: document.querySelector('#user-status').value
            };
            
            // In a real application, you would send this data to a server
            console.log('User Data:', userData);
            
            // Add user to table (for demo purposes)
            addUserToTable(userData);
            
            // Update user count on dashboard
            const userCount = document.querySelector('#user-count');
            if (userCount) {
                userCount.textContent = parseInt(userCount.textContent) + 1;
            }
            
            // Close modal and show success message
            addUserModal.style.display = 'none';
            showNotification(`User ${userData.name} added successfully`, "success");
            
            // Update last updated time
            updateLastUpdatedTime();
        });
    }
    
    // Function to add a new user to the table
    function addUserToTable(userData) {
        const tbody = document.querySelector('#user-management .data-table tbody');
        
        if (tbody) {
            const lastId = sampleUsers.length > 0 ? sampleUsers[sampleUsers.length - 1].id : 0;
            const newId = lastId + 1;
            
            // Add to our sample data array
            sampleUsers.push({
                id: newId,
                name: userData.name,
                role: userData.role,
                contact: userData.contact,
                email: userData.email,
                status: userData.status
            });
            
            const statusClass = userData.status === 'active' ? 'status-active' : 'status-inactive';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userData.name}</td>
                <td>${userData.role}</td>
                <td>${userData.contact}</td>
                <td>${userData.email}</td>
                <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(userData.status)}</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${newId}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${newId}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${newId}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tbody.appendChild(row);
            
            // Add event listeners to new buttons
            const viewBtn = row.querySelector('.view-btn');
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    showNotification(`Viewing user ${userData.name}`, "info");
                });
            }
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showNotification(`Editing user ${userData.name}`, "info");
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete user ${userData.name}?`)) {
                        row.remove();
                        // Remove from our sample data array
                        const index = sampleUsers.findIndex(user => user.id === newId);
                        if (index !== -1) {
                            sampleUsers.splice(index, 1);
                        }
                        showNotification(`User ${userData.name} deleted`, "success");
                        
                        // Update user count on dashboard
                        const userCount = document.querySelector('#user-count');
                        if (userCount) {
                            userCount.textContent = parseInt(userCount.textContent) - 1;
                        }
                        
                        // Update last updated time
                        updateLastUpdatedTime();
                    }
                });
            }
        }
    }
    
    // Search functionality
    const userSearchInput = document.querySelector('#user-search');
    if (userSearchInput) {
        userSearchInput.addEventListener('input', () => {
            const searchValue = userSearchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#user-management .data-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
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
                
                // Update route details panel
                updateRouteDetailsPanel(routeId, from, to, row.cells[3].textContent.trim(), 
                                      row.cells[4].textContent.trim(), row.cells[5].textContent.trim());
                
                showNotification(`Viewing route ${routeId} on map`, 'info');
            });
        });
        
        // Initialize map controls and filters
        initRouteMapControls();
        initRouteFilters();
        initTrafficCharts();
    }
    
    // Add sample routes for demo
    addDemoRoutes();
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Smart Ambulance Routing System
 * Admin Panel Functionality
 */

/**
 * Initialize the admin panel
 */
function initAdminPanel() {
    console.log('Initializing admin panel');
    
    // Set up sidebar navigation
    setupSidebarNav();
    
    // Set up admin dashboard
    setupAdminDashboard();
    
    // Initialize charts
    initCharts();
    
    // Set up date range pickers
    setupDateRange();
    
    // Load active emergencies
    loadActiveEmergencies();
    
    // Set up ambulance management
    setupAmbulanceManagement();
    
    // Set up hospital management
    setupHospitalManagement();
    
    // Set up user management
    setupUserManagement();
    
    // Set up settings management
    setupSettingsManagement();
    
    // Set up emergency management
    setupEmergencyManagement();
    
    // Set up route management
    setupRouteManagement();
    
    // Set up modals
    setupModals();
    
    // Set up mobile sidebar toggle
    setupMobileSidebar();
    
    // Set up location buttons
    setupLocationButtons();
    
    // Initialize maps
    setTimeout(() => {
        // Add a small delay to ensure DOM is fully loaded
        try {
            if (document.getElementById('admin-overview-map')) {
                // Initialize admin overview map
                const adminMap = L.map('admin-overview-map', {
                    center: [22.3072, 73.1812], // Vadodara, India
                    zoom: 12
                });
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(adminMap);
            }
            
            if (document.getElementById('ambulance-map')) {
                initAmbulanceMap();
            }
            
            if (document.getElementById('route-map')) {
                initRouteMap();
            }
        } catch (e) {
            console.error('Error initializing maps:', e);
        }
    }, 500);
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
    const addAmbulanceModal = document.getElementById('add-ambulance-modal');
    const addAmbulanceBtn = document.getElementById('add-ambulance-btn');
    const closeModal = addAmbulanceModal.querySelector('.close-modal');
    const cancelBtn = addAmbulanceModal.querySelector('.cancel-btn');
    const ambulanceForm = document.getElementById('add-ambulance-form');
    const refreshBtn = document.getElementById('refresh-ambulances-btn');
    
    // Tab navigation for ambulance form
    const formTabs = ambulanceForm.querySelectorAll('.form-tab');
    const formTabContents = ambulanceForm.querySelectorAll('.form-tab-content');
    const nextTabBtn = document.getElementById('next-tab-ambulance');
    const prevTabBtn = document.getElementById('prev-tab-ambulance');
    const submitBtn = ambulanceForm.querySelector('button[type="submit"]');
    
    let currentTabIndex = 0;
    
    // Function to show a specific tab
    function showTab(index) {
        formTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        formTabContents.forEach((content, i) => {
            if (i === index) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update progress bar
        const progressSegments = ambulanceForm.querySelectorAll('.progress-segment');
        progressSegments.forEach((segment, i) => {
            if (i <= index) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
        
        // Show/hide navigation buttons
        if (index === 0) {
            prevTabBtn.style.display = 'none';
        } else {
            prevTabBtn.style.display = 'block';
        }
        
        if (index === formTabs.length - 1) {
            nextTabBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextTabBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Tab click event
    formTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            showTab(index);
        });
    });
    
    // Next button click
    nextTabBtn.addEventListener('click', () => {
        if (validateCurrentTab()) {
            if (currentTabIndex < formTabs.length - 1) {
                showTab(currentTabIndex + 1);
            }
        }
    });
    
    // Previous button click
    prevTabBtn.addEventListener('click', () => {
        if (currentTabIndex > 0) {
            showTab(currentTabIndex - 1);
        }
    });
    
    // Validate current tab
    function validateCurrentTab() {
        let isValid = true;
        const currentTab = formTabContents[currentTabIndex];
        
        // Get all required inputs in the current tab
        const requiredInputs = currentTab.querySelectorAll('input[required], select[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('input-error');
                showNotification('Please fill all required fields marked with *', 'error');
            } else {
                input.classList.remove('input-error');
            }
        });
        
        // Specific validations based on tab
        if (currentTabIndex === 0) { // Basic Info tab
            const ambulanceId = document.getElementById('ambulance-id');
            if (ambulanceId.value && !/^AMB-\d{4}$/.test(ambulanceId.value)) {
                isValid = false;
                ambulanceId.classList.add('input-error');
                showNotification('Ambulance ID should be in format AMB-XXXX (e.g., AMB-1234)', 'error');
            }
            
            const registrationNo = document.getElementById('ambulance-registration');
            if (registrationNo.value && !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(registrationNo.value)) {
                isValid = false;
                registrationNo.classList.add('input-error');
                showNotification('Vehicle Registration should be in a valid format (e.g., MH02AB1234)', 'error');
            }
        } else if (currentTabIndex === 2) { // Staff tab
            const driverPhone = document.getElementById('driver-phone');
            if (driverPhone.value && !/^[0-9]{10}$/.test(driverPhone.value)) {
                isValid = false;
                driverPhone.classList.add('input-error');
                showNotification('Phone number should be a 10-digit number', 'error');
            }
        }
        
        return isValid;
    }

    // Handle form input events to remove error class
    ambulanceForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
    });

    // Initialize map for location selection
    const mapPickerBtn = document.getElementById('show-map-picker-ambulance');
    const mapPreview = document.getElementById('ambulance-map-preview');
    let mapInstance = null;
    
    if (mapPickerBtn && mapPreview && typeof google !== 'undefined' && google.maps) {
        mapPickerBtn.addEventListener('click', () => {
            if (!mapInstance) {
                const defaultLocation = { lat: 22.3072, lng: 73.1812 }; // Vadodara
                mapInstance = new google.maps.Map(mapPreview, {
                    center: defaultLocation,
                    zoom: 12
                });
                
                const marker = new google.maps.Marker({
                    position: defaultLocation,
                    map: mapInstance,
                    draggable: true
                });
                
                // Update location inputs when marker is moved
                google.maps.event.addListener(marker, 'dragend', function() {
                    const position = marker.getPosition();
                    document.getElementById('ambulance-lat').value = position.lat().toFixed(6);
                    document.getElementById('ambulance-lng').value = position.lng().toFixed(6);
                });
                
                // Click on map to move marker
                google.maps.event.addListener(mapInstance, 'click', function(event) {
                    marker.setPosition(event.latLng);
                    document.getElementById('ambulance-lat').value = event.latLng.lat().toFixed(6);
                    document.getElementById('ambulance-lng').value = event.latLng.lng().toFixed(6);
                });
            }
        });
    }
    
    // Use current location button
    const autoLocateBtn = ambulanceForm.querySelector('.auto-locate');
    if (autoLocateBtn) {
        autoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        document.getElementById('ambulance-lat').value = lat.toFixed(6);
                        document.getElementById('ambulance-lng').value = lng.toFixed(6);
                        
                        // Update map if available
                        if (mapInstance) {
                            const currentLocation = { lat, lng };
                            mapInstance.setCenter(currentLocation);
                            
                            // Find and update marker
                            const markers = mapInstance.markers || [];
                            if (markers.length > 0) {
                                markers[0].setPosition(currentLocation);
                            } else {
                                new google.maps.Marker({
                                    position: currentLocation,
                                    map: mapInstance,
                                    draggable: true
                                });
                            }
                        }
                        
                        showNotification('Current location detected and set', 'success');
                    },
                    (error) => {
                        showNotification('Unable to get current location: ' + error.message, 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }

    if (addAmbulanceBtn) {
        addAmbulanceBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'block';
            // Reset the form and show first tab
            ambulanceForm.reset();
            showTab(0);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (ambulanceForm) {
        ambulanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab()) {
                return;
            }
            
            // Collect data from the form
            const ambulanceData = {
                id: document.getElementById('ambulance-id').value,
                registration: document.getElementById('ambulance-registration').value,
                type: document.getElementById('ambulance-type').value,
                make: document.getElementById('ambulance-make').value,
                year: document.getElementById('ambulance-year').value,
                vin: document.getElementById('ambulance-vin')?.value || '',
                capacity: document.getElementById('ambulance-capacity').value,
                fuelType: document.getElementById('ambulance-fuel-type').value,
                status: document.getElementById('ambulance-status').value,
                
                // Vehicle details
                insurance: document.getElementById('ambulance-insurance').value,
                lastService: document.getElementById('ambulance-last-service').value,
                nextService: document.getElementById('ambulance-next-service').value,
                mileage: document.getElementById('ambulance-mileage').value,
                
                // Equipment
                equipment: {
                    // Basic equipment
                    firstAid: document.getElementById('equipment-first-aid').checked,
                    oxygen: document.getElementById('equipment-oxygen').checked,
                    stretcher: document.getElementById('equipment-stretcher').checked,
                    wheelchair: document.getElementById('equipment-wheelchair').checked,
                    
                    // Advanced equipment
                    aed: document.getElementById('equipment-aed').checked,
                    ventilator: document.getElementById('equipment-ventilator').checked,
                    ecg: document.getElementById('equipment-ecg').checked,
                    suction: document.getElementById('equipment-suction').checked,
                    infusion: document.getElementById('equipment-infusion').checked,
                    oximeter: document.getElementById('equipment-oximeter').checked,
                    
                    // Other equipment
                    other: document.getElementById('equipment-others').value,
                    
                    // Medication
                    medication: document.getElementById('equipment-medication').value,
                    
                    // New equipment fields with quantities
                    oxygenQuantity: document.getElementById('oxygen-quantity')?.value || '1',
                    stretcherType: document.getElementById('stretcher-type')?.value || 'Standard',
                    ventilatorType: document.getElementById('ventilator-type')?.value || 'Standard',
                },
                
                // Staff information
                driver: {
                    name: document.getElementById('driver-name').value,
                    phone: document.getElementById('driver-phone').value,
                    license: document.getElementById('driver-license').value,
                    licenseExpiry: document.getElementById('driver-license-expiry').value,
                    age: document.getElementById('driver-age')?.value || '',
                    experience: document.getElementById('driver-experience')?.value || '',
                    shift: document.getElementById('driver-shift')?.value || '',
                    address: document.getElementById('driver-address')?.value || '',
                },
                
                paramedic: {
                    name: document.getElementById('paramedic-name').value,
                    phone: document.getElementById('paramedic-phone').value,
                    qualification: document.getElementById('paramedic-qualification')?.value || '',
                    experience: document.getElementById('paramedic-experience')?.value || '',
                    license: document.getElementById('paramedic-license')?.value || '',
                    shift: document.getElementById('paramedic-shift')?.value || '',
                    emergencyContact: document.getElementById('paramedic-emergency-contact')?.value || '',
                    specializations: Array.from(document.getElementById('paramedic-specializations')?.selectedOptions || [])
                        .map(option => option.value),
                },
                
                additionalStaff: document.getElementById('additional-staff').value,
                
                // Maintenance information
                maintenance: {
                    type: document.getElementById('maintenance-type')?.value || '',
                    intervalKm: document.getElementById('maintenance-interval-km')?.value || '',
                    intervalDays: document.getElementById('maintenance-interval-days')?.value || '',
                    vendor: document.getElementById('maintenance-vendor')?.value || '',
                    notes: document.getElementById('maintenance-notes')?.value || '',
                },
                
                // Documentation
                documents: {
                    registration: {
                        status: document.getElementById('doc-registration')?.checked || false,
                        validity: document.getElementById('doc-registration')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    insurance: {
                        status: document.getElementById('doc-insurance')?.checked || false,
                        validity: document.getElementById('doc-insurance')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    fitness: {
                        status: document.getElementById('doc-fitness')?.checked || false,
                        validity: document.getElementById('doc-fitness')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    pollution: {
                        status: document.getElementById('doc-pollution')?.checked || false,
                        validity: document.getElementById('doc-pollution')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    permit: {
                        status: document.getElementById('doc-permit')?.checked || false,
                        validity: document.getElementById('doc-permit')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    tax: {
                        status: document.getElementById('doc-tax')?.checked || false,
                        validity: document.getElementById('doc-tax')?.closest('.document-item')?.querySelector('.mini-date')?.value || '',
                    },
                    notes: document.getElementById('documentation-notes')?.value || '',
                },
                
                // Location information
                location: {
                    hospital: document.getElementById('ambulance-hospital')?.value || '',
                    baseLocation: document.getElementById('ambulance-base-location')?.value || '',
                    serviceArea: document.getElementById('ambulance-service-area')?.value || '',
                    responseRadius: document.getElementById('ambulance-response-radius')?.value || '',
                    distanceLimit: document.getElementById('distance-limit-daily')?.value || '',
                    coverageArea: document.getElementById('coverage-area')?.value || '',
                    currentLocation: {
                        lat: document.getElementById('ambulance-lat')?.value || '',
                        lng: document.getElementById('ambulance-lng')?.value || '',
                    }
                },
                
                timestamp: Date.now()
            };
            
            // For demonstration, show the data in a notification
            console.log('Ambulance Data:', ambulanceData);
            
            // Save to localStorage (or send to server in production)
            const ambulances = JSON.parse(localStorage.getItem('ambulances') || '[]');
            ambulances.push(ambulanceData);
            localStorage.setItem('ambulances', JSON.stringify(ambulances));
            
            // Close modal and show success notification
            addAmbulanceModal.style.display = 'none';
            showNotification('Ambulance added successfully!', 'success');
            
            // Refresh the ambulance list
            loadAmbulances();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // In a real scenario, this would fetch from API
            // For demo, we'll just show a notification
            showNotification('Ambulance list refreshed', 'info');
        });
    }

    // Add sample ambulances for demo
    addDemoAmbulances();
}

function addAmbulanceToTable(ambulanceData) {
    const ambulanceTable = document.querySelector('.ambulance-table tbody');
    
    if (!ambulanceTable) return;
    
    const newRow = document.createElement('tr');
    newRow.classList.add('new-row-highlight');
    
    // Create cells with ambulance data
    newRow.innerHTML = `
        <td>${ambulanceData.id}</td>
        <td>${getAmbulanceTypeLabel(ambulanceData.type)}</td>
        <td>${ambulanceData.driver.name || 'N/A'}</td>
        <td>${ambulanceData.baseLocation}</td>
        <td>${ambulanceData.status ? capitalizeFirstLetter(ambulanceData.status) : 'Unknown'}</td>
        <td>
            <div class="action-buttons">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
                <button class="view-btn"><i class="fas fa-eye"></i></button>
            </div>
        </td>
    `;
    
    // Add event listeners for the action buttons
    const editBtn = newRow.querySelector('.edit-btn');
    const deleteBtn = newRow.querySelector('.delete-btn');
    const viewBtn = newRow.querySelector('.view-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showNotification('Edit functionality coming soon', 'info');
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            newRow.classList.add('delete-animation');
            setTimeout(() => {
                ambulanceTable.removeChild(newRow);
                showNotification('Ambulance removed successfully', 'success');
            }, 500);
        });
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            showNotification('View details functionality coming soon', 'info');
        });
    }
    
    // Add to table and remove highlight after animation
    ambulanceTable.appendChild(newRow);
    setTimeout(() => {
        newRow.classList.remove('new-row-highlight');
    }, 3000);
}

function getAmbulanceTypeLabel(type) {
    const types = {
        'type1': 'Type I (Basic)',
        'type2': 'Type II (Mobile Emergency)',
        'type3': 'Type III (Advanced Life Support)',
        'type4': 'Mobile ICU',
        'neonatal': 'Neonatal',
        'mortuary': 'Mortuary'
    };
    
    return types[type] || 'Unknown Type';
}

function addDemoAmbulances() {
    const ambulances = [
        {
            id: 'AMB-1001',
            registration: 'GJ06AB1234',
            type: 'type2',
            make: 'Tata Winger',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Rajesh Kumar',
                phone: '9876543210'
            },
            baseLocation: 'SSG Hospital',
            hospital: 'SSG Hospital'
        },
        {
            id: 'AMB-1002',
            registration: 'GJ06CD5678',
            type: 'type3',
            make: 'Force Traveller',
            year: '2021',
            capacity: '3',
            fuelType: 'diesel',
            status: 'dispatched',
            driver: {
                name: 'Suresh Patel',
                phone: '9876543211'
            },
            baseLocation: 'Bhailal Amin General Hospital',
            hospital: 'Bhailal Amin General Hospital'
        },
        {
            id: 'AMB-1003',
            registration: 'GJ06EF9012',
            type: 'type4',
            make: 'Tata Winger',
            year: '2023',
            capacity: '1',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Amit Singh',
                phone: '9876543212'
            },
            baseLocation: 'Sterling Hospital',
            hospital: 'Sterling Hospital'
        },
        {
            id: 'AMB-1004',
            registration: 'GJ06GH3456',
            type: 'neonatal',
            make: 'Force Traveller',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'maintenance',
            driver: {
                name: 'Dinesh Shah',
                phone: '9876543213'
            },
            baseLocation: 'Baroda Medical College Hospital',
            hospital: 'Baroda Medical College Hospital'
        }
    ];
    
    ambulances.forEach(ambulance => {
        addAmbulanceToTable(ambulance);
    });
}

/**
 * Set up hospital management
 */
function setupHospitalManagement() {
    // Add hospital button
    const addHospitalBtn = document.getElementById('add-hospital-btn');
    if (addHospitalBtn) {
        addHospitalBtn.addEventListener('click', () => {
            // Show the add hospital form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'block';
                
                // Add tooltips to form fields for better guidance
                addFormTooltips();
                
                // Add dynamic field interactions
                setupDynamicFormFields();
                
                // Scroll to the form
                formContainer.scrollIntoView({ behavior: 'smooth' });
                showNotification('Please fill in the hospital details', 'info');
            }
        });
    }
    
    // Handle form submission
    const hospitalForm = document.getElementById('add-hospital-form');
    if (hospitalForm) {
        hospitalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!validateHospitalForm()) {
                showNotification('Please correct the errors in the form', 'error');
                return;
            }
            
            // Get all the form values
            const hospitalName = document.getElementById('hospital-name').value;
            const hospitalType = document.getElementById('hospital-type').value;
            const hospitalAddress = document.getElementById('hospital-address').value;
            const hospitalArea = document.getElementById('hospital-area').value;
            const hospitalCity = document.getElementById('hospital-city').value;
            const hospitalPincode = document.getElementById('hospital-pincode').value;
            
            const hospitalPhone = document.getElementById('hospital-phone').value;
            const hospitalEmergencyPhone = document.getElementById('hospital-emergency-phone').value;
            const hospitalEmail = document.getElementById('hospital-email').value;
            const hospitalWebsite = document.getElementById('hospital-website').value;
            
            const hospitalBedsTotal = document.getElementById('hospital-beds-total').value;
            const hospitalBedsAvailable = document.getElementById('hospital-beds-available').value;
            const hospitalICUBeds = document.getElementById('hospital-icu-beds')?.value || 0;
            const hospitalVentilators = document.getElementById('hospital-ventilators')?.value || 0;
            const hospitalWaitTime = document.getElementById('hospital-wait-time').value;
            
            const hospitalLat = document.getElementById('hospital-lat').value;
            const hospitalLng = document.getElementById('hospital-lng').value;
            
            // Get specialty information
            const hospitalSpecialties = document.getElementById('hospital-specialties').value;
            const hospitalEmergency = document.getElementById('hospital-emergency')?.checked || false;
            const hospitalTraumaCenter = document.getElementById('hospital-trauma-center')?.checked || false;
            const hospitalBloodBank = document.getElementById('hospital-blood-bank')?.checked || false;
            const hospital24x7 = document.getElementById('hospital-24x7')?.checked || false;
            
            // Check required fields
            if (!hospitalName || !hospitalAddress || !hospitalBedsTotal || !hospitalBedsAvailable || !hospitalWaitTime) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Calculate capacity percentage
            const totalBeds = parseInt(hospitalBedsTotal);
            const availableBeds = parseInt(hospitalBedsAvailable);
            const capacityPercentage = Math.round(((totalBeds - availableBeds) / totalBeds) * 100);
            
            // Determine status based on capacity
            let status = 'Available';
            if (capacityPercentage >= 90) {
                status = 'Critical';
            } else if (capacityPercentage >= 75) {
                status = 'High Load';
            }
            
            // Construct full address
            const fullAddress = `${hospitalAddress}, ${hospitalArea ? hospitalArea + ', ' : ''}${hospitalCity}${hospitalPincode ? ', ' + hospitalPincode : ''}`;
            
            // Create a rich hospital object with all details
            const hospitalData = {
                name: hospitalName,
                type: hospitalType,
                address: fullAddress,
                capacity: {
                    percentage: capacityPercentage,
                    available: availableBeds,
                    total: totalBeds,
                    icu: hospitalICUBeds,
                    ventilators: hospitalVentilators
                },
                contact: {
                    phone: hospitalPhone,
                    emergency: hospitalEmergencyPhone,
                    email: hospitalEmail,
                    website: hospitalWebsite
                },
                location: {
                    lat: hospitalLat,
                    lng: hospitalLng
                },
                services: {
                    specialties: hospitalSpecialties,
                    emergency: hospitalEmergency,
                    traumaCenter: hospitalTraumaCenter,
                    bloodBank: hospitalBloodBank,
                    open24x7: hospital24x7
                },
                waitTime: hospitalWaitTime + ' mins',
                status: status
            };
            
            // Add the hospital to the table
            addHospitalToTable(hospitalData);
            
            // Show confirmation with more details
            showNotification(`Hospital "${hospitalName}" has been added successfully with ${totalBeds} beds`, 'success');
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Hide the form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
            
            // Reset the form
            hospitalForm.reset();
        });
    }
    
    // Set up form toggle buttons
    const toggleFormBtns = document.querySelectorAll('.toggle-form');
    toggleFormBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const formContainer = document.getElementById(targetId + '-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
        });
    });
    
    // Set up hospital action buttons
    setupHospitalActionButtons();
}

/**
 * Add tooltips to hospital form fields
 */
function addFormTooltips() {
    // Add tooltips to form fields to provide guidance
    const tooltips = {
        'hospital-name': 'Enter the official name of the hospital',
        'hospital-type': 'Select the type of hospital (Government, Private, etc.)',
        'hospital-address': 'Enter the street address of the hospital',
        'hospital-area': 'Enter the area or locality name',
        'hospital-city': 'Enter the city name',
        'hospital-pincode': 'Enter the 6-digit PIN code',
        'hospital-phone': 'Enter the main contact number with country code',
        'hospital-emergency-phone': 'Enter emergency contact number',
        'hospital-email': 'Enter official email address',
        'hospital-website': 'Enter complete website URL including https://',
        'hospital-beds-total': 'Enter total number of beds in the hospital',
        'hospital-beds-available': 'Enter number of currently available beds',
        'hospital-icu-beds': 'Enter number of ICU beds',
        'hospital-ventilators': 'Enter number of ventilators available',
        'hospital-ambulances': 'Enter number of ambulances operated by the hospital',
        'hospital-wait-time': 'Enter average emergency wait time in minutes',
        'hospital-specialties': 'Enter medical specialties separated by commas',
        'hospital-lat': 'Enter latitude coordinate (use buttons below to get coordinates)',
        'hospital-lng': 'Enter longitude coordinate (use buttons below to get coordinates)'
    };
    
    // Apply tooltips to elements
    for (const [id, tooltip] of Object.entries(tooltips)) {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('title', tooltip);
            
            // Add input validation feedback
            if (element.hasAttribute('required')) {
                element.addEventListener('input', () => {
                    if (element.value.trim() === '') {
                        element.classList.add('input-error');
                    } else {
                        element.classList.remove('input-error');
                    }
                });
            }
        }
    }
}

/**
 * Setup dynamic form field interactions
 */
function setupDynamicFormFields() {
    // Add interactions between related fields
    
    // Update available beds validation to be less than total beds
    const totalBedsInput = document.getElementById('hospital-beds-total');
    const availableBedsInput = document.getElementById('hospital-beds-available');
    
    if (totalBedsInput && availableBedsInput) {
        totalBedsInput.addEventListener('input', () => {
            const totalBeds = parseInt(totalBedsInput.value) || 0;
            availableBedsInput.setAttribute('max', totalBeds);
            
            // Validate available beds against total beds
            const availableBeds = parseInt(availableBedsInput.value) || 0;
            if (availableBeds > totalBeds) {
                availableBedsInput.value = totalBeds;
            }
        });
    }
    
    // Update hospital type dependent fields
    const hospitalTypeSelect = document.getElementById('hospital-type');
    if (hospitalTypeSelect) {
        hospitalTypeSelect.addEventListener('change', () => {
            const type = hospitalTypeSelect.value;
            
            // Show/hide fields based on hospital type
            const traumaCenterCheckbox = document.getElementById('hospital-trauma-center');
            if (traumaCenterCheckbox) {
                if (type === 'government' || type === 'speciality') {
                    traumaCenterCheckbox.parentElement.style.display = 'block';
                } else {
                    traumaCenterCheckbox.checked = false;
                    traumaCenterCheckbox.parentElement.style.display = 'none';
                }
            }
            
            // Update placeholders for specialties based on type
            const specialtiesInput = document.getElementById('hospital-specialties');
            if (specialtiesInput) {
                if (type === 'speciality') {
                    specialtiesInput.placeholder = 'Primary specialty (e.g. Cancer, Cardiac, Orthopedic)';
                } else {
                    specialtiesInput.placeholder = 'e.g. Cardiology, Neurology, Orthopedics';
                }
            }
        });
    }
    
    // Add coordinate fetching functionality
    const latInput = document.getElementById('hospital-lat');
    const lngInput = document.getElementById('hospital-lng');
    const autoLocateBtn = document.querySelector('.auto-locate[data-target="hospital"]');
    
    if (latInput && lngInput && autoLocateBtn) {
        // Use browser geolocation API
        autoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                autoLocateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
                autoLocateBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        latInput.value = position.coords.latitude.toFixed(6);
                        lngInput.value = position.coords.longitude.toFixed(6);
                        
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        
                        showNotification('Location updated successfully', 'success');
                        
                        // Highlight the fields to show they've been updated
                        latInput.classList.add('field-updated');
                        lngInput.classList.add('field-updated');
                        
                        setTimeout(() => {
                            latInput.classList.remove('field-updated');
                            lngInput.classList.remove('field-updated');
                        }, 2000);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        showNotification('Could not get your location. Please try again or enter manually.', 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }
}

/**
 * Validate hospital form
 * @returns {boolean} Whether the form is valid
 */
function validateHospitalForm() {
    let isValid = true;
    const requiredFields = [
        'hospital-name',
        'hospital-type',
        'hospital-address',
        'hospital-area',
        'hospital-city',
        'hospital-pincode',
        'hospital-phone',
        'hospital-email',
        'hospital-beds-total',
        'hospital-beds-available',
        'hospital-wait-time',
        'hospital-lat',
        'hospital-lng'
    ];
    
    // Check required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim() === '') {
            field.classList.add('input-error');
            isValid = false;
            
            // Add error message below the field
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else if (field) {
            field.classList.remove('input-error');
            
            // Remove error message if exists
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                field.parentNode.removeChild(field.nextElementSibling);
            }
        }
    });
    
    // Validate specialty field has at least one specialty
    const specialtiesField = document.getElementById('hospital-specialties');
    if (specialtiesField && specialtiesField.value.trim() === '') {
        specialtiesField.classList.add('input-error');
        if (!specialtiesField.nextElementSibling || !specialtiesField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter at least one specialty';
            specialtiesField.parentNode.insertBefore(errorMsg, specialtiesField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate available beds <= total beds
    const totalBedsField = document.getElementById('hospital-beds-total');
    const availableBedsField = document.getElementById('hospital-beds-available');
    
    if (totalBedsField && availableBedsField && 
        parseInt(availableBedsField.value) > parseInt(totalBedsField.value)) {
        availableBedsField.classList.add('input-error');
        if (!availableBedsField.nextElementSibling || !availableBedsField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Available beds cannot exceed total beds';
            availableBedsField.parentNode.insertBefore(errorMsg, availableBedsField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate email format
    const emailField = document.getElementById('hospital-email');
    if (emailField && emailField.value.trim() !== '') {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('input-error');
            if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid email address';
                emailField.parentNode.insertBefore(errorMsg, emailField.nextSibling);
            }
            isValid = false;
        }
    }
    
    // Validate pincode format (6 digits)
    const pincodeField = document.getElementById('hospital-pincode');
    if (pincodeField && pincodeField.value.trim() !== '') {
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincodeField.value)) {
            pincodeField.classList.add('input-error');
            if (!pincodeField.nextElementSibling || !pincodeField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid 6-digit PIN code';
                pincodeField.parentNode.insertBefore(errorMsg, pincodeField.nextSibling);
            }
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Add hospital to table
 * @param {Object} hospital - Hospital data
 */
function addHospitalToTable(hospital) {
    const hospitalsTable = document.querySelector('#hospitals-tab .data-table tbody');
    if (hospitalsTable) {
        // Create new table row
        const row = document.createElement('tr');
        
        // Create status badge class based on status
        let statusClass = 'available';
        if (hospital.status === 'Critical') {
            statusClass = 'maintenance';
        } else if (hospital.status === 'High Load') {
            statusClass = 'warning';
        }
        
        // Set row content with enhanced data display
        row.innerHTML = `
            <td>${hospital.name}</td>
            <td>${hospital.address}</td>
            <td>
                <div class="capacity-indicator">
                    <div class="capacity-bar-container">
                        <div class="capacity-bar" style="width: ${hospital.capacity.percentage}%"></div>
                    </div>
                    <span>${hospital.capacity.percentage}% (${hospital.capacity.total - hospital.capacity.available}/${hospital.capacity.total})</span>
                </div>
            </td>
            <td>${hospital.waitTime}</td>
            <td><span class="status-badge ${statusClass}">${hospital.status}</span></td>
            <td>${hospital.contact.phone || hospital.contact}</td>
            <td class="actions-cell">
                <button class="action-btn edit" title="Edit hospital details"><i class="fas fa-edit"></i></button>
                <button class="action-btn view" title="View hospital details"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" title="Delete hospital"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add row to table with animation
        row.classList.add('new-row');
        hospitalsTable.appendChild(row);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            row.classList.remove('new-row');
        }, 1000);
        
        // Add event listeners to the new buttons
        const editBtn = row.querySelector('.action-btn.edit');
        const deleteBtn = row.querySelector('.action-btn.delete');
        const viewBtn = row.querySelector('.action-btn.view');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                showNotification(`Editing ${hospitalName}`, 'info');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                if (confirm(`Are you sure you want to delete ${hospitalName}?`)) {
                    // Add row fade out animation
                    row.classList.add('deleting');
                    
                    setTimeout(() => {
                        row.remove();
                        updateDashboardStats();
                        showNotification(`${hospitalName} has been deleted`, 'success');
                    }, 500);
                }
            });
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                viewHospitalDetails(row);
            });
        }
    }
}

/**
 * Set up hospital action buttons
 */
function setupHospitalActionButtons() {
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
                
                // Open the hospital detail view modal
                viewHospitalDetails(row);
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
                    updateDashboardStats();
                }
            });
        });
    }
}

/**
 * View hospital details
 * @param {HTMLElement} row - Table row element with hospital data
 */
function viewHospitalDetails(row) {
    // Extract data from row
    const name = row.cells[0].textContent.trim();
    const address = row.cells[1].textContent.trim();
    
    // Extract capacity information
    const capacityEl = row.querySelector('.capacity-indicator span');
    const capacityText = capacityEl ? capacityEl.textContent.trim() : '';
    const capacityMatch = capacityText.match(/(\d+)%\s*\((\d+)\/(\d+)\)/);
    let capacityPercentage = 0;
    let occupiedBeds = 0;
    let totalBeds = 0;
    
    if (capacityMatch && capacityMatch.length >= 4) {
        capacityPercentage = parseInt(capacityMatch[1]);
        occupiedBeds = parseInt(capacityMatch[2]);
        totalBeds = parseInt(capacityMatch[3]);
    }
    
    const waitTime = row.cells[3].textContent.trim();
    
    // Extract status
    const statusEl = row.querySelector('.status-badge');
    const status = statusEl ? statusEl.textContent.trim() : 'Available';
    let statusClass = 'available';
    
    if (status === 'Critical') {
        statusClass = 'maintenance';
    } else if (status === 'High Load') {
        statusClass = 'warning';
    }
    
    // Get contact
    const contact = row.cells[5].textContent.trim();
    
    // Populate modal with data
    document.getElementById('view-hospital-name').textContent = name;
    document.getElementById('view-hospital-address').textContent = address;
    
    // Set coordinates (mock data for demo)
    document.getElementById('view-hospital-coordinates').textContent = '22.3072, 73.1812';
    
    // Set contact information
    document.getElementById('view-hospital-phone').textContent = contact;
    document.getElementById('view-hospital-emergency').textContent = contact; // Using same number for demo
    document.getElementById('view-hospital-email').textContent = `info@${name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    const websiteEl = document.getElementById('view-hospital-website');
    const website = `${name.toLowerCase().replace(/\s+/g, '')}.com`;
    websiteEl.textContent = website;
    websiteEl.href = `https://${website}`;
    
    // Set capacity information
    document.getElementById('view-hospital-beds-total').textContent = totalBeds;
    document.getElementById('view-hospital-beds-available').textContent = totalBeds - occupiedBeds;
    
    // Set mock data for other capacity fields
    document.getElementById('view-hospital-icu-beds').textContent = Math.round(totalBeds * 0.2); // 20% of total beds
    document.getElementById('view-hospital-ventilators').textContent = Math.round(totalBeds * 0.1); // 10% of total beds
    document.getElementById('view-hospital-wait-time').textContent = waitTime;
    
    // Set capacity bar
    const capacityBar = document.getElementById('view-hospital-capacity-bar');
    capacityBar.style.width = `${capacityPercentage}%`;
    document.getElementById('view-hospital-capacity').textContent = capacityText;
    
    // Set status badge
    const statusBadge = document.getElementById('view-hospital-status');
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${statusClass}`;
    
    // Set mock data for hospital type and services
    document.getElementById('view-hospital-type').textContent = name.includes('SSG') ? 'Government' : 'Private';
    
    // Set specialties based on hospital name for demo
    let specialties = 'General Medicine, Surgery, Pediatrics';
    if (name.includes('Cancer')) {
        specialties = 'Oncology, Radiology, Chemotherapy';
    } else if (name.includes('Heart') || name.includes('Cardiac')) {
        specialties = 'Cardiology, Cardiac Surgery, Vascular Medicine';
    }
    document.getElementById('view-hospital-specialties').textContent = specialties;
    
    // Set mock data for services
    document.getElementById('view-hospital-emergency-services').textContent = 'Yes';
    document.getElementById('view-hospital-trauma-center').textContent = status === 'Critical' ? 'No' : 'Yes';
    document.getElementById('view-hospital-blood-bank').textContent = 'Yes';
    document.getElementById('view-hospital-24x7').textContent = 'Yes';
    
    // Initialize hospital map
    setTimeout(() => {
        const mapElement = document.getElementById('view-hospital-map');
        if (mapElement && typeof L !== 'undefined') {
            // Check if map already initialized
            if (window.hospitalDetailMap) {
                window.hospitalDetailMap.remove();
            }
            
            // Create map
            window.hospitalDetailMap = L.map('view-hospital-map').setView([22.3072, 73.1812], 15);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(window.hospitalDetailMap);
            
            // Add marker
            L.marker([22.3072, 73.1812]).addTo(window.hospitalDetailMap)
                .bindPopup(`<b>${name}</b><br>${address}`).openPopup();
        }
    }, 300);
    
    // Set up edit button
    const editBtn = document.getElementById('view-hospital-edit');
    if (editBtn) {
        editBtn.onclick = () => {
            closeModal('view-hospital-modal');
            showNotification(`Editing ${name}`, 'info');
        };
    }
    
    // Set up close button
    const closeBtn = document.querySelector('#view-hospital-modal .close-modal-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            closeModal('view-hospital-modal');
        };
    }
    
    // Open modal
    openModal('view-hospital-modal');
}

/**
 * Update dashboard stats
 */
function updateDashboardStats() {
    // Get counts
    const hospitalCount = document.querySelectorAll('#hospitals-tab .data-table tbody tr').length;
    
    // Update hospital count on dashboard
    const hospitalStatValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (hospitalStatValue) {
        hospitalStatValue.textContent = hospitalCount;
    }
    
    // Update hospital summary information
    updateHospitalSummary();
    
    // Update last updated timestamp
    updateLastUpdatedTimestamp();
}

/**
 * Update hospital summary information
 */
function updateHospitalSummary() {
    // Get all hospital rows
    const hospitalRows = document.querySelectorAll('#hospitals-tab .data-table tbody tr');
    
    // Calculate totals
    let totalHospitals = hospitalRows.length;
    let totalBeds = 0;
    let availableBeds = 0;
    let criticalHospitals = 0;
    
    hospitalRows.forEach(row => {
        // Get capacity text which is in format "XX% (YY/ZZ)"
        const capacityText = row.querySelector('.capacity-indicator span').textContent;
        
        // Extract total and available beds using regex
        const bedMatch = capacityText.match(/\((\d+)\/(\d+)\)/);
        if (bedMatch && bedMatch.length >= 3) {
            const occupied = parseInt(bedMatch[1]);
            const total = parseInt(bedMatch[2]);
            
            totalBeds += total;
            availableBeds += (total - occupied);
        }
        
        // Check if hospital is critical
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge && statusBadge.textContent === 'Critical') {
            criticalHospitals++;
        }
    });
    
    // Update summary elements
    const totalHospitalsEl = document.getElementById('total-hospitals');
    const totalBedsEl = document.getElementById('total-beds');
    const availableBedsEl = document.getElementById('available-beds');
    const criticalHospitalsEl = document.getElementById('critical-hospitals');
    
    if (totalHospitalsEl) totalHospitalsEl.textContent = totalHospitals;
    if (totalBedsEl) totalBedsEl.textContent = totalBeds;
    if (availableBedsEl) availableBedsEl.textContent = availableBeds;
    if (criticalHospitalsEl) criticalHospitalsEl.textContent = criticalHospitals;
}

/**
 * Update last updated timestamp
 */
function updateLastUpdatedTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();
    
    // Format: "Today, 2:30 PM" or "Jan 15, 2023, 2:30 PM"
    const isToday = new Date().setHours(0,0,0,0) === new Date(now).setHours(0,0,0,0);
    const formattedDate = isToday ? `Today, ${timeString}` : `${dateString}, ${timeString}`;
    
    // Update the hospital section timestamp
    const hospitalLastUpdatedEl = document.getElementById('hospital-last-updated');
    if (hospitalLastUpdatedEl) {
        hospitalLastUpdatedEl.textContent = formattedDate;
    }
    
    // Update any other last-updated elements
    const lastUpdatedEls = document.querySelectorAll('.last-updated span:not(#hospital-last-updated)');
    lastUpdatedEls.forEach(el => {
        el.textContent = formattedDate;
    });
}

/**
 * Set up user management
 */
function setupUserManagement() {
    // Initialize users table with sample data
    const userTable = document.querySelector('#user-management .data-table');
    
    // Sample data for users
    const sampleUsers = [
        { id: 1, name: 'John Doe', role: 'System Admin', contact: '+91 98765 43210', email: 'john@example.com', status: 'active' },
        { id: 2, name: 'Jane Smith', role: 'Hospital Admin', contact: '+91 87654 32109', email: 'jane@hospital.com', status: 'active' },
        { id: 3, name: 'Mike Wilson', role: 'Driver', contact: '+91 76543 21098', email: 'mike@ambulance.com', status: 'active' },
        { id: 4, name: 'Sarah Johnson', role: 'Dispatcher', contact: '+91 65432 10987', email: 'sarah@dispatch.com', status: 'inactive' },
        { id: 5, name: 'Robert Brown', role: 'Doctor', contact: '+91 54321 09876', email: 'robert@hospital.com', status: 'active' }
    ];
    
    // Populate user table with sample data
    if (userTable) {
        const tbody = userTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            sampleUsers.forEach(user => {
                const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.role}</td>
                    <td>${user.contact}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(user.status)}</span></td>
                    <td>
                        <button class="action-btn view-btn" data-id="${user.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
        }
    }
    
    // Add User Modal Functionality
    const addUserBtn = document.querySelector('#add-user-btn');
    const addUserModal = document.querySelector('#add-user-modal');
    const closeModal = addUserModal?.querySelector('.close-modal');
    const cancelAddUser = document.querySelector('#cancel-add-user');
    const addUserForm = document.querySelector('#add-user-form');
    
    // Tab navigation for user form
    const userFormTabs = document.querySelectorAll('#add-user-form .form-tab');
    const userFormTabContents = document.querySelectorAll('#add-user-form .form-tab-content');
    const nextTabBtn = document.querySelector('#next-tab-user');
    const prevTabBtn = document.querySelector('#prev-tab-user');
    const submitUserBtn = document.querySelector('#add-user-form button[type="submit"]');
    const progressSegments = document.querySelectorAll('#add-user-form .progress-segment');
    
    let currentTabIndex = 0;
    
    // Functions to handle tab navigation
    function showUserTab(index) {
        userFormTabs.forEach(tab => tab.classList.remove('active'));
        userFormTabContents.forEach(content => content.classList.remove('active'));
        progressSegments.forEach(segment => segment.classList.remove('active'));
        
        userFormTabs[index].classList.add('active');
        userFormTabContents[index].classList.add('active');
        
        // Update progress bar
        for (let i = 0; i <= index; i++) {
            progressSegments[i].classList.add('active');
        }
        
        // Show/hide navigation buttons based on current tab
        if (index === 0) {
            prevTabBtn.style.display = 'none';
            nextTabBtn.style.display = 'block';
            submitUserBtn.style.display = 'none';
        } else if (index === userFormTabs.length - 1) {
            prevTabBtn.style.display = 'block';
            nextTabBtn.style.display = 'none';
            submitUserBtn.style.display = 'block';
        } else {
            prevTabBtn.style.display = 'block';
            nextTabBtn.style.display = 'block';
            submitUserBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Click events for tab buttons
    if (userFormTabs.length > 0) {
        userFormTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                if (validateCurrentTab(currentTabIndex)) {
                    showUserTab(index);
                } else {
                    showNotification("Please fill in all required fields in the current tab", "error");
                }
            });
        });
    }
    
    // Next and Previous button functionality
    if (nextTabBtn) {
        nextTabBtn.addEventListener('click', () => {
            if (validateCurrentTab(currentTabIndex)) {
                showUserTab(currentTabIndex + 1);
            } else {
                showNotification("Please fill in all required fields in the current tab", "error");
            }
        });
    }
    
    if (prevTabBtn) {
        prevTabBtn.addEventListener('click', () => {
            showUserTab(currentTabIndex - 1);
        });
    }
    
    // Function to validate current tab
    function validateCurrentTab(tabIndex) {
        const currentTabContent = userFormTabContents[tabIndex];
        
        if (!currentTabContent) return true;
        
        const requiredFields = currentTabContent.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Special validation for specific tabs
        if (tabIndex === 1) { // Account Info tab
            const password = document.querySelector('#user-password');
            const confirmPassword = document.querySelector('#user-confirm-password');
            
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                isValid = false;
                confirmPassword.classList.add('error');
                showNotification("Passwords do not match", "error");
            }
        }
        
        return isValid;
    }
    
    // Password validation
    const passwordInput = document.querySelector('#user-password');
    const confirmPasswordInput = document.querySelector('#user-confirm-password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.classList.add('error');
                } else {
                    confirmPasswordInput.classList.remove('error');
                }
            });
        }
    }
    
    // Function to validate password strength
    function validatePassword() {
        const password = passwordInput.value;
        
        // Update password requirement indicators
        updateRequirement('req-length', password.length >= 8);
        updateRequirement('req-uppercase', /[A-Z]/.test(password));
        updateRequirement('req-lowercase', /[a-z]/.test(password));
        updateRequirement('req-number', /[0-9]/.test(password));
        updateRequirement('req-special', /[^A-Za-z0-9]/.test(password));
    }
    
    // Function to update requirement indicators
    function updateRequirement(reqId, isValid) {
        const reqElement = document.getElementById(reqId);
        if (reqElement) {
            const icon = reqElement.querySelector('i');
            
            if (isValid) {
                icon.className = 'fas fa-check-circle';
                reqElement.classList.add('valid');
                reqElement.classList.remove('invalid');
            } else {
                icon.className = 'fas fa-times-circle';
                reqElement.classList.remove('valid');
                reqElement.classList.add('invalid');
            }
        }
    }
    
    // Role preset buttons
    const rolePresetButtons = document.querySelectorAll('.role-preset-btn');
    if (rolePresetButtons.length > 0) {
        rolePresetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const role = button.getAttribute('data-role');
                const roleSelect = document.querySelector('#user-role');
                
                if (roleSelect) {
                    roleSelect.value = role;
                    
                    // Set default permissions based on role
                    resetAllPermissions();
                    
                    switch (role) {
                        case 'system-admin':
                            setAllPermissions(true);
                            break;
                            
                        case 'hospital-admin':
                            setPermissionsByGroup(['Dashboard', 'Hospitals', 'Emergencies'], true);
                            break;
                            
                        case 'dispatcher':
                            setPermissionsByGroup(['Dashboard', 'Ambulances', 'Emergencies', 'Routes & Maps'], true);
                            break;
                            
                        case 'driver':
                            setBasicViewPermissions();
                            break;
                            
                        case 'observer':
                            setBasicViewPermissions();
                            break;
                    }
                    
                    showNotification(`Applied ${button.textContent.trim()} permission preset`, "success");
                }
            });
        });
    }
    
    // Permission management functions
    function setAllPermissions(value) {
        const permCheckboxes = document.querySelectorAll('#permissions-tab input[type="checkbox"]');
        permCheckboxes.forEach(checkbox => {
            checkbox.checked = value;
        });
    }
    
    function resetAllPermissions() {
        setAllPermissions(false);
    }
    
    function setBasicViewPermissions() {
        const viewPermissions = document.querySelectorAll('#permissions-tab input[id^="perm-view-"]');
        viewPermissions.forEach(checkbox => {
            checkbox.checked = true;
        });
    }
    
    function setPermissionsByGroup(groups, value) {
        groups.forEach(group => {
            const groupHeader = Array.from(document.querySelectorAll('#permissions-tab h5'))
                .find(header => header.textContent.trim() === group);
                
            if (groupHeader) {
                const permCategory = groupHeader.closest('.permission-category');
                if (permCategory) {
                    const checkboxes = permCategory.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = value;
                    });
                }
            }
        });
    }
    
    // Open Add User Modal
    if (addUserBtn && addUserModal) {
        addUserBtn.addEventListener('click', () => {
            addUserModal.style.display = 'block';
            // Reset form and show first tab
            addUserForm.reset();
            showUserTab(0);
            
            // Reset password indicators
            document.querySelectorAll('.password-requirements li').forEach(req => {
                req.classList.remove('valid', 'invalid');
                const icon = req.querySelector('i');
                if (icon) icon.className = 'fas fa-times-circle';
            });
        });
    }
    
    // Close Add User Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addUserModal.style.display = 'none';
        });
    }
    
    // Cancel button for Add User Modal
    if (cancelAddUser) {
        cancelAddUser.addEventListener('click', () => {
            addUserModal.style.display = 'none';
        });
    }
    
    // Add User Form Submission
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab(currentTabIndex)) {
                showNotification("Please fill in all required fields", "error");
                return;
            }
            
            // Get form data
            const userData = {
                name: document.querySelector('#user-name').value,
                username: document.querySelector('#user-username').value,
                email: document.querySelector('#user-email').value,
                contact: document.querySelector('#user-contact').value,
                role: document.querySelector('#user-role').value,
                status: document.querySelector('#user-status').value
            };
            
            // In a real application, you would send this data to a server
            console.log('User Data:', userData);
            
            // Add user to table (for demo purposes)
            addUserToTable(userData);
            
            // Update user count on dashboard
            const userCount = document.querySelector('#user-count');
            if (userCount) {
                userCount.textContent = parseInt(userCount.textContent) + 1;
            }
            
            // Close modal and show success message
            addUserModal.style.display = 'none';
            showNotification(`User ${userData.name} added successfully`, "success");
            
            // Update last updated time
            updateLastUpdatedTime();
        });
    }
    
    // Function to add a new user to the table
    function addUserToTable(userData) {
        const tbody = document.querySelector('#user-management .data-table tbody');
        
        if (tbody) {
            const lastId = sampleUsers.length > 0 ? sampleUsers[sampleUsers.length - 1].id : 0;
            const newId = lastId + 1;
            
            // Add to our sample data array
            sampleUsers.push({
                id: newId,
                name: userData.name,
                role: userData.role,
                contact: userData.contact,
                email: userData.email,
                status: userData.status
            });
            
            const statusClass = userData.status === 'active' ? 'status-active' : 'status-inactive';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userData.name}</td>
                <td>${userData.role}</td>
                <td>${userData.contact}</td>
                <td>${userData.email}</td>
                <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(userData.status)}</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${newId}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${newId}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${newId}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tbody.appendChild(row);
            
            // Add event listeners to new buttons
            const viewBtn = row.querySelector('.view-btn');
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    showNotification(`Viewing user ${userData.name}`, "info");
                });
            }
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showNotification(`Editing user ${userData.name}`, "info");
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete user ${userData.name}?`)) {
                        row.remove();
                        // Remove from our sample data array
                        const index = sampleUsers.findIndex(user => user.id === newId);
                        if (index !== -1) {
                            sampleUsers.splice(index, 1);
                        }
                        showNotification(`User ${userData.name} deleted`, "success");
                        
                        // Update user count on dashboard
                        const userCount = document.querySelector('#user-count');
                        if (userCount) {
                            userCount.textContent = parseInt(userCount.textContent) - 1;
                        }
                        
                        // Update last updated time
                        updateLastUpdatedTime();
                    }
                });
            }
        }
    }
    
    // Search functionality
    const userSearchInput = document.querySelector('#user-search');
    if (userSearchInput) {
        userSearchInput.addEventListener('input', () => {
            const searchValue = userSearchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#user-management .data-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
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
                
                // Update route details panel
                updateRouteDetailsPanel(routeId, from, to, row.cells[3].textContent.trim(), 
                                      row.cells[4].textContent.trim(), row.cells[5].textContent.trim());
                
                showNotification(`Viewing route ${routeId} on map`, 'info');
            });
        });
        
        // Initialize map controls and filters
        initRouteMapControls();
        initRouteFilters();
        initTrafficCharts();
    }
    
    // Add sample routes for demo
    addDemoRoutes();
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
/**
 * Smart Ambulance Routing System
 * Admin Panel Functionality
 */

/**
 * Initialize the admin panel
 */
function initAdminPanel() {
    console.log('Initializing admin panel');
    
    // Set up sidebar navigation
    setupSidebarNav();
    
    // Set up admin dashboard
    setupAdminDashboard();
    
    // Initialize charts
    initCharts();
    
    // Set up date range pickers
    setupDateRange();
    
    // Load active emergencies
    loadActiveEmergencies();
    
    // Set up ambulance management
    setupAmbulanceManagement();
    
    // Set up hospital management
    setupHospitalManagement();
    
    // Set up user management
    setupUserManagement();
    
    // Set up settings management
    setupSettingsManagement();
    
    // Set up emergency management
    setupEmergencyManagement();
    
    // Set up route management
    setupRouteManagement();
    
    // Set up modals
    setupModals();
    
    // Set up mobile sidebar toggle
    setupMobileSidebar();
    
    // Set up location buttons
    setupLocationButtons();
    
    // Initialize maps
    setTimeout(() => {
        // Add a small delay to ensure DOM is fully loaded
        try {
            if (document.getElementById('admin-overview-map')) {
                // Initialize admin overview map
                const adminMap = L.map('admin-overview-map', {
                    center: [22.3072, 73.1812], // Vadodara, India
                    zoom: 12
                });
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(adminMap);
            }
            
            if (document.getElementById('ambulance-map')) {
                initAmbulanceMap();
            }
            
            if (document.getElementById('route-map')) {
                initRouteMap();
            }
        } catch (e) {
            console.error('Error initializing maps:', e);
        }
    }, 500);
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
    const addAmbulanceModal = document.getElementById('add-ambulance-modal');
    const addAmbulanceBtn = document.getElementById('add-ambulance-btn');
    const closeModal = addAmbulanceModal.querySelector('.close-modal');
    const cancelBtn = addAmbulanceModal.querySelector('.cancel-btn');
    const ambulanceForm = document.getElementById('add-ambulance-form');
    const refreshBtn = document.getElementById('refresh-ambulances-btn');
    
    // Tab navigation for ambulance form
    const formTabs = ambulanceForm.querySelectorAll('.form-tab');
    const formTabContents = ambulanceForm.querySelectorAll('.form-tab-content');
    const nextTabBtn = document.getElementById('next-tab-ambulance');
    const prevTabBtn = document.getElementById('prev-tab-ambulance');
    const submitBtn = ambulanceForm.querySelector('button[type="submit"]');
    
    let currentTabIndex = 0;
    
    // Function to show a specific tab
    function showTab(index) {
        formTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        formTabContents.forEach((content, i) => {
            if (i === index) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update progress bar
        const progressSegments = ambulanceForm.querySelectorAll('.progress-segment');
        progressSegments.forEach((segment, i) => {
            if (i <= index) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
        
        // Show/hide navigation buttons
        if (index === 0) {
            prevTabBtn.style.display = 'none';
        } else {
            prevTabBtn.style.display = 'block';
        }
        
        if (index === formTabs.length - 1) {
            nextTabBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextTabBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        currentTabIndex = index;
    }
    
    // Tab click event
    formTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            showTab(index);
        });
    });
    
    // Next button click
    nextTabBtn.addEventListener('click', () => {
        if (validateCurrentTab()) {
            if (currentTabIndex < formTabs.length - 1) {
                showTab(currentTabIndex + 1);
            }
        }
    });
    
    // Previous button click
    prevTabBtn.addEventListener('click', () => {
        if (currentTabIndex > 0) {
            showTab(currentTabIndex - 1);
        }
    });
    
    // Validate current tab
    function validateCurrentTab() {
        let isValid = true;
        const currentTab = formTabContents[currentTabIndex];
        
        // Get all required inputs in the current tab
        const requiredInputs = currentTab.querySelectorAll('input[required], select[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('input-error');
                showNotification('Please fill all required fields marked with *', 'error');
            } else {
                input.classList.remove('input-error');
            }
        });
        
        // Specific validations based on tab
        if (currentTabIndex === 0) { // Basic Info tab
            const ambulanceId = document.getElementById('ambulance-id');
            if (ambulanceId.value && !/^AMB-\d{4}$/.test(ambulanceId.value)) {
                isValid = false;
                ambulanceId.classList.add('input-error');
                showNotification('Ambulance ID should be in format AMB-XXXX (e.g., AMB-1234)', 'error');
            }
            
            const registrationNo = document.getElementById('ambulance-registration');
            if (registrationNo.value && !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(registrationNo.value)) {
                isValid = false;
                registrationNo.classList.add('input-error');
                showNotification('Vehicle Registration should be in a valid format (e.g., MH02AB1234)', 'error');
            }
        } else if (currentTabIndex === 2) { // Staff tab
            const driverPhone = document.getElementById('driver-phone');
            if (driverPhone.value && !/^[0-9]{10}$/.test(driverPhone.value)) {
                isValid = false;
                driverPhone.classList.add('input-error');
                showNotification('Phone number should be a 10-digit number', 'error');
            }
        }
        
        return isValid;
    }

    // Handle form input events to remove error class
    ambulanceForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
    });

    // Initialize map for location selection
    const mapPickerBtn = document.getElementById('show-map-picker-ambulance');
    const mapPreview = document.getElementById('ambulance-map-preview');
    let mapInstance = null;
    
    if (mapPickerBtn && mapPreview && typeof google !== 'undefined' && google.maps) {
        mapPickerBtn.addEventListener('click', () => {
            if (!mapInstance) {
                const defaultLocation = { lat: 22.3072, lng: 73.1812 }; // Vadodara
                mapInstance = new google.maps.Map(mapPreview, {
                    center: defaultLocation,
                    zoom: 12
                });
                
                const marker = new google.maps.Marker({
                    position: defaultLocation,
                    map: mapInstance,
                    draggable: true
                });
                
                // Update location inputs when marker is moved
                google.maps.event.addListener(marker, 'dragend', function() {
                    const position = marker.getPosition();
                    document.getElementById('ambulance-lat').value = position.lat().toFixed(6);
                    document.getElementById('ambulance-lng').value = position.lng().toFixed(6);
                });
                
                // Click on map to move marker
                google.maps.event.addListener(mapInstance, 'click', function(event) {
                    marker.setPosition(event.latLng);
                    document.getElementById('ambulance-lat').value = event.latLng.lat().toFixed(6);
                    document.getElementById('ambulance-lng').value = event.latLng.lng().toFixed(6);
                });
            }
        });
    }
    
    // Use current location button
    const autoLocateBtn = ambulanceForm.querySelector('.auto-locate');
    if (autoLocateBtn) {
        autoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        document.getElementById('ambulance-lat').value = lat.toFixed(6);
                        document.getElementById('ambulance-lng').value = lng.toFixed(6);
                        
                        // Update map if available
                        if (mapInstance) {
                            const currentLocation = { lat, lng };
                            mapInstance.setCenter(currentLocation);
                            
                            // Find and update marker
                            const markers = mapInstance.markers || [];
                            if (markers.length > 0) {
                                markers[0].setPosition(currentLocation);
                            } else {
                                new google.maps.Marker({
                                    position: currentLocation,
                                    map: mapInstance,
                                    draggable: true
                                });
                            }
                        }
                        
                        showNotification('Current location detected and set', 'success');
                    },
                    (error) => {
                        showNotification('Unable to get current location: ' + error.message, 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }

    if (addAmbulanceBtn) {
        addAmbulanceBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'block';
            // Reset the form and show first tab
            ambulanceForm.reset();
            showTab(0);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            addAmbulanceModal.style.display = 'none';
        });
    }

    if (ambulanceForm) {
        ambulanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateCurrentTab()) {
                return;
            }
            
            // Collect data from the form
            const ambulanceData = {
                id: document.getElementById('ambulance-id').value,
                registration: document.getElementById('ambulance-registration').value,
                type: document.getElementById('ambulance-type').value,
                make: document.getElementById('ambulance-make').value,
                year: document.getElementById('ambulance-year').value,
                capacity: document.getElementById('ambulance-capacity').value,
                fuelType: document.getElementById('ambulance-fuel-type').value,
                status: document.getElementById('ambulance-status').value,
                
                // Vehicle details
                insurance: document.getElementById('ambulance-insurance').value,
                lastService: document.getElementById('ambulance-last-service').value,
                nextService: document.getElementById('ambulance-next-service').value,
                mileage: document.getElementById('ambulance-mileage').value,
                
                // Equipment
                equipment: {
                    firstAid: document.getElementById('equipment-first-aid').checked,
                    oxygen: document.getElementById('equipment-oxygen').checked,
                    stretcher: document.getElementById('equipment-stretcher').checked,
                    wheelchair: document.getElementById('equipment-wheelchair').checked,
                    aed: document.getElementById('equipment-aed').checked,
                    ventilator: document.getElementById('equipment-ventilator').checked,
                    ecg: document.getElementById('equipment-ecg').checked,
                    suction: document.getElementById('equipment-suction').checked,
                    infusion: document.getElementById('equipment-infusion').checked,
                    oximeter: document.getElementById('equipment-oximeter').checked,
                    other: document.getElementById('equipment-others').value,
                    medication: document.getElementById('equipment-medication').value
                },
                
                // Staff
                driver: {
                    name: document.getElementById('driver-name').value,
                    phone: document.getElementById('driver-phone').value,
                    license: document.getElementById('driver-license').value,
                    licenseExpiry: document.getElementById('driver-license-expiry').value
                },
                
                paramedic: {
                    name: document.getElementById('paramedic-name').value,
                    phone: document.getElementById('paramedic-phone').value,
                    qualification: document.getElementById('paramedic-qualification').value,
                    experience: document.getElementById('paramedic-experience').value
                },
                
                additionalStaff: document.getElementById('additional-staff').value,
                
                // Location
                hospital: document.getElementById('ambulance-hospital').value,
                baseLocation: document.getElementById('ambulance-base-location').value,
                serviceArea: document.getElementById('ambulance-service-area').value,
                responseRadius: document.getElementById('ambulance-response-radius').value,
                location: {
                    lat: document.getElementById('ambulance-lat').value,
                    lng: document.getElementById('ambulance-lng').value
                }
            };
            
            // For demo, add to table
            addAmbulanceToTable(ambulanceData);
            
            // Close modal and show notification
            addAmbulanceModal.style.display = 'none';
            showNotification('Ambulance added successfully', 'success');
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // In a real scenario, this would fetch from API
            // For demo, we'll just show a notification
            showNotification('Ambulance list refreshed', 'info');
        });
    }

    // Add sample ambulances for demo
    addDemoAmbulances();
}

function addAmbulanceToTable(ambulanceData) {
    const ambulanceTable = document.querySelector('.ambulance-table tbody');
    
    if (!ambulanceTable) return;
    
    const newRow = document.createElement('tr');
    newRow.classList.add('new-row-highlight');
    
    // Create cells with ambulance data
    newRow.innerHTML = `
        <td>${ambulanceData.id}</td>
        <td>${getAmbulanceTypeLabel(ambulanceData.type)}</td>
        <td>${ambulanceData.driver.name || 'N/A'}</td>
        <td>${ambulanceData.baseLocation}</td>
        <td>${ambulanceData.status ? capitalizeFirstLetter(ambulanceData.status) : 'Unknown'}</td>
        <td>
            <div class="action-buttons">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
                <button class="view-btn"><i class="fas fa-eye"></i></button>
            </div>
        </td>
    `;
    
    // Add event listeners for the action buttons
    const editBtn = newRow.querySelector('.edit-btn');
    const deleteBtn = newRow.querySelector('.delete-btn');
    const viewBtn = newRow.querySelector('.view-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showNotification('Edit functionality coming soon', 'info');
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            newRow.classList.add('delete-animation');
            setTimeout(() => {
                ambulanceTable.removeChild(newRow);
                showNotification('Ambulance removed successfully', 'success');
            }, 500);
        });
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            showNotification('View details functionality coming soon', 'info');
        });
    }
    
    // Add to table and remove highlight after animation
    ambulanceTable.appendChild(newRow);
    setTimeout(() => {
        newRow.classList.remove('new-row-highlight');
    }, 3000);
}

function getAmbulanceTypeLabel(type) {
    const types = {
        'type1': 'Type I (Basic)',
        'type2': 'Type II (Mobile Emergency)',
        'type3': 'Type III (Advanced Life Support)',
        'type4': 'Mobile ICU',
        'neonatal': 'Neonatal',
        'mortuary': 'Mortuary'
    };
    
    return types[type] || 'Unknown Type';
}

function addDemoAmbulances() {
    const ambulances = [
        {
            id: 'AMB-1001',
            registration: 'GJ06AB1234',
            type: 'type2',
            make: 'Tata Winger',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Rajesh Kumar',
                phone: '9876543210'
            },
            baseLocation: 'SSG Hospital',
            hospital: 'SSG Hospital'
        },
        {
            id: 'AMB-1002',
            registration: 'GJ06CD5678',
            type: 'type3',
            make: 'Force Traveller',
            year: '2021',
            capacity: '3',
            fuelType: 'diesel',
            status: 'dispatched',
            driver: {
                name: 'Suresh Patel',
                phone: '9876543211'
            },
            baseLocation: 'Bhailal Amin General Hospital',
            hospital: 'Bhailal Amin General Hospital'
        },
        {
            id: 'AMB-1003',
            registration: 'GJ06EF9012',
            type: 'type4',
            make: 'Tata Winger',
            year: '2023',
            capacity: '1',
            fuelType: 'diesel',
            status: 'available',
            driver: {
                name: 'Amit Singh',
                phone: '9876543212'
            },
            baseLocation: 'Sterling Hospital',
            hospital: 'Sterling Hospital'
        },
        {
            id: 'AMB-1004',
            registration: 'GJ06GH3456',
            type: 'neonatal',
            make: 'Force Traveller',
            year: '2022',
            capacity: '2',
            fuelType: 'diesel',
            status: 'maintenance',
            driver: {
                name: 'Dinesh Shah',
                phone: '9876543213'
            },
            baseLocation: 'Baroda Medical College Hospital',
            hospital: 'Baroda Medical College Hospital'
        }
    ];
    
    ambulances.forEach(ambulance => {
        addAmbulanceToTable(ambulance);
    });
}

/**
 * Set up hospital management
 */
function setupHospitalManagement() {
    // Add hospital button
    const addHospitalBtn = document.getElementById('add-hospital-btn');
    if (addHospitalBtn) {
        addHospitalBtn.addEventListener('click', () => {
            // Show the add hospital form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'block';
                
                // Add tooltips to form fields for better guidance
                addFormTooltips();
                
                // Add dynamic field interactions
                setupDynamicFormFields();
                
                // Scroll to the form
                formContainer.scrollIntoView({ behavior: 'smooth' });
                showNotification('Please fill in the hospital details', 'info');
            }
        });
    }
    
    // Handle form submission
    const hospitalForm = document.getElementById('add-hospital-form');
    if (hospitalForm) {
        hospitalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!validateHospitalForm()) {
                showNotification('Please correct the errors in the form', 'error');
                return;
            }
            
            // Get all the form values
            const hospitalName = document.getElementById('hospital-name').value;
            const hospitalType = document.getElementById('hospital-type').value;
            const hospitalAddress = document.getElementById('hospital-address').value;
            const hospitalArea = document.getElementById('hospital-area').value;
            const hospitalCity = document.getElementById('hospital-city').value;
            const hospitalPincode = document.getElementById('hospital-pincode').value;
            
            const hospitalPhone = document.getElementById('hospital-phone').value;
            const hospitalEmergencyPhone = document.getElementById('hospital-emergency-phone').value;
            const hospitalEmail = document.getElementById('hospital-email').value;
            const hospitalWebsite = document.getElementById('hospital-website').value;
            
            const hospitalBedsTotal = document.getElementById('hospital-beds-total').value;
            const hospitalBedsAvailable = document.getElementById('hospital-beds-available').value;
            const hospitalICUBeds = document.getElementById('hospital-icu-beds')?.value || 0;
            const hospitalVentilators = document.getElementById('hospital-ventilators')?.value || 0;
            const hospitalWaitTime = document.getElementById('hospital-wait-time').value;
            
            const hospitalLat = document.getElementById('hospital-lat').value;
            const hospitalLng = document.getElementById('hospital-lng').value;
            
            // Get specialty information
            const hospitalSpecialties = document.getElementById('hospital-specialties').value;
            const hospitalEmergency = document.getElementById('hospital-emergency')?.checked || false;
            const hospitalTraumaCenter = document.getElementById('hospital-trauma-center')?.checked || false;
            const hospitalBloodBank = document.getElementById('hospital-blood-bank')?.checked || false;
            const hospital24x7 = document.getElementById('hospital-24x7')?.checked || false;
            
            // Check required fields
            if (!hospitalName || !hospitalAddress || !hospitalBedsTotal || !hospitalBedsAvailable || !hospitalWaitTime) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Calculate capacity percentage
            const totalBeds = parseInt(hospitalBedsTotal);
            const availableBeds = parseInt(hospitalBedsAvailable);
            const capacityPercentage = Math.round(((totalBeds - availableBeds) / totalBeds) * 100);
            
            // Determine status based on capacity
            let status = 'Available';
            if (capacityPercentage >= 90) {
                status = 'Critical';
            } else if (capacityPercentage >= 75) {
                status = 'High Load';
            }
            
            // Construct full address
            const fullAddress = `${hospitalAddress}, ${hospitalArea ? hospitalArea + ', ' : ''}${hospitalCity}${hospitalPincode ? ', ' + hospitalPincode : ''}`;
            
            // Create a rich hospital object with all details
            const hospitalData = {
                name: hospitalName,
                type: hospitalType,
                address: fullAddress,
                capacity: {
                    percentage: capacityPercentage,
                    available: availableBeds,
                    total: totalBeds,
                    icu: hospitalICUBeds,
                    ventilators: hospitalVentilators
                },
                contact: {
                    phone: hospitalPhone,
                    emergency: hospitalEmergencyPhone,
                    email: hospitalEmail,
                    website: hospitalWebsite
                },
                location: {
                    lat: hospitalLat,
                    lng: hospitalLng
                },
                services: {
                    specialties: hospitalSpecialties,
                    emergency: hospitalEmergency,
                    traumaCenter: hospitalTraumaCenter,
                    bloodBank: hospitalBloodBank,
                    open24x7: hospital24x7
                },
                waitTime: hospitalWaitTime + ' mins',
                status: status
            };
            
            // Add the hospital to the table
            addHospitalToTable(hospitalData);
            
            // Show confirmation with more details
            showNotification(`Hospital "${hospitalName}" has been added successfully with ${totalBeds} beds`, 'success');
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Hide the form
            const formContainer = document.getElementById('add-hospital-form-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
            
            // Reset the form
            hospitalForm.reset();
        });
    }
    
    // Set up form toggle buttons
    const toggleFormBtns = document.querySelectorAll('.toggle-form');
    toggleFormBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const formContainer = document.getElementById(targetId + '-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
        });
    });
    
    // Set up hospital action buttons
    setupHospitalActionButtons();
}

/**
 * Add tooltips to hospital form fields
 */
function addFormTooltips() {
    // Add tooltips to form fields to provide guidance
    const tooltips = {
        'hospital-name': 'Enter the official name of the hospital',
        'hospital-type': 'Select the type of hospital (Government, Private, etc.)',
        'hospital-address': 'Enter the street address of the hospital',
        'hospital-area': 'Enter the area or locality name',
        'hospital-city': 'Enter the city name',
        'hospital-pincode': 'Enter the 6-digit PIN code',
        'hospital-phone': 'Enter the main contact number with country code',
        'hospital-emergency-phone': 'Enter emergency contact number',
        'hospital-email': 'Enter official email address',
        'hospital-website': 'Enter complete website URL including https://',
        'hospital-beds-total': 'Enter total number of beds in the hospital',
        'hospital-beds-available': 'Enter number of currently available beds',
        'hospital-icu-beds': 'Enter number of ICU beds',
        'hospital-ventilators': 'Enter number of ventilators available',
        'hospital-ambulances': 'Enter number of ambulances operated by the hospital',
        'hospital-wait-time': 'Enter average emergency wait time in minutes',
        'hospital-specialties': 'Enter medical specialties separated by commas',
        'hospital-lat': 'Enter latitude coordinate (use buttons below to get coordinates)',
        'hospital-lng': 'Enter longitude coordinate (use buttons below to get coordinates)'
    };
    
    // Apply tooltips to elements
    for (const [id, tooltip] of Object.entries(tooltips)) {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('title', tooltip);
            
            // Add input validation feedback
            if (element.hasAttribute('required')) {
                element.addEventListener('input', () => {
                    if (element.value.trim() === '') {
                        element.classList.add('input-error');
                    } else {
                        element.classList.remove('input-error');
                    }
                });
            }
        }
    }
}

/**
 * Setup dynamic form field interactions
 */
function setupDynamicFormFields() {
    // Add interactions between related fields
    
    // Update available beds validation to be less than total beds
    const totalBedsInput = document.getElementById('hospital-beds-total');
    const availableBedsInput = document.getElementById('hospital-beds-available');
    
    if (totalBedsInput && availableBedsInput) {
        totalBedsInput.addEventListener('input', () => {
            const totalBeds = parseInt(totalBedsInput.value) || 0;
            availableBedsInput.setAttribute('max', totalBeds);
            
            // Validate available beds against total beds
            const availableBeds = parseInt(availableBedsInput.value) || 0;
            if (availableBeds > totalBeds) {
                availableBedsInput.value = totalBeds;
            }
        });
    }
    
    // Update hospital type dependent fields
    const hospitalTypeSelect = document.getElementById('hospital-type');
    if (hospitalTypeSelect) {
        hospitalTypeSelect.addEventListener('change', () => {
            const type = hospitalTypeSelect.value;
            
            // Show/hide fields based on hospital type
            const traumaCenterCheckbox = document.getElementById('hospital-trauma-center');
            if (traumaCenterCheckbox) {
                if (type === 'government' || type === 'speciality') {
                    traumaCenterCheckbox.parentElement.style.display = 'block';
                } else {
                    traumaCenterCheckbox.checked = false;
                    traumaCenterCheckbox.parentElement.style.display = 'none';
                }
            }
            
            // Update placeholders for specialties based on type
            const specialtiesInput = document.getElementById('hospital-specialties');
            if (specialtiesInput) {
                if (type === 'speciality') {
                    specialtiesInput.placeholder = 'Primary specialty (e.g. Cancer, Cardiac, Orthopedic)';
                } else {
                    specialtiesInput.placeholder = 'e.g. Cardiology, Neurology, Orthopedics';
                }
            }
        });
    }
    
    // Add coordinate fetching functionality
    const latInput = document.getElementById('hospital-lat');
    const lngInput = document.getElementById('hospital-lng');
    const autoLocateBtn = document.querySelector('.auto-locate[data-target="hospital"]');
    
    if (latInput && lngInput && autoLocateBtn) {
        // Use browser geolocation API
        autoLocateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                autoLocateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
                autoLocateBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        latInput.value = position.coords.latitude.toFixed(6);
                        lngInput.value = position.coords.longitude.toFixed(6);
                        
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        
                        showNotification('Location updated successfully', 'success');
                        
                        // Highlight the fields to show they've been updated
                        latInput.classList.add('field-updated');
                        lngInput.classList.add('field-updated');
                        
                        setTimeout(() => {
                            latInput.classList.remove('field-updated');
                            lngInput.classList.remove('field-updated');
                        }, 2000);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        showNotification('Could not get your location. Please try again or enter manually.', 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        });
    }
}

/**
 * Validate hospital form
 * @returns {boolean} Whether the form is valid
 */
function validateHospitalForm() {
    let isValid = true;
    const requiredFields = [
        'hospital-name',
        'hospital-type',
        'hospital-address',
        'hospital-area',
        'hospital-city',
        'hospital-pincode',
        'hospital-phone',
        'hospital-email',
        'hospital-beds-total',
        'hospital-beds-available',
        'hospital-wait-time',
        'hospital-lat',
        'hospital-lng'
    ];
    
    // Check required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim() === '') {
            field.classList.add('input-error');
            isValid = false;
            
            // Add error message below the field
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else if (field) {
            field.classList.remove('input-error');
            
            // Remove error message if exists
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                field.parentNode.removeChild(field.nextElementSibling);
            }
        }
    });
    
    // Validate specialty field has at least one specialty
    const specialtiesField = document.getElementById('hospital-specialties');
    if (specialtiesField && specialtiesField.value.trim() === '') {
        specialtiesField.classList.add('input-error');
        if (!specialtiesField.nextElementSibling || !specialtiesField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter at least one specialty';
            specialtiesField.parentNode.insertBefore(errorMsg, specialtiesField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate available beds <= total beds
    const totalBedsField = document.getElementById('hospital-beds-total');
    const availableBedsField = document.getElementById('hospital-beds-available');
    
    if (totalBedsField && availableBedsField && 
        parseInt(availableBedsField.value) > parseInt(totalBedsField.value)) {
        availableBedsField.classList.add('input-error');
        if (!availableBedsField.nextElementSibling || !availableBedsField.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Available beds cannot exceed total beds';
            availableBedsField.parentNode.insertBefore(errorMsg, availableBedsField.nextSibling);
        }
        isValid = false;
    }
    
    // Validate email format
    const emailField = document.getElementById('hospital-email');
    if (emailField && emailField.value.trim() !== '') {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('input-error');
            if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid email address';
                emailField.parentNode.insertBefore(errorMsg, emailField.nextSibling);
            }
            isValid = false;
        }
    }
    
    // Validate pincode format (6 digits)
    const pincodeField = document.getElementById('hospital-pincode');
    if (pincodeField && pincodeField.value.trim() !== '') {
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincodeField.value)) {
            pincodeField.classList.add('input-error');
            if (!pincodeField.nextElementSibling || !pincodeField.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid 6-digit PIN code';
                pincodeField.parentNode.insertBefore(errorMsg, pincodeField.nextSibling);
            }
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Add hospital to table
 * @param {Object} hospital - Hospital data
 */
function addHospitalToTable(hospital) {
    const hospitalsTable = document.querySelector('#hospitals-tab .data-table tbody');
    if (hospitalsTable) {
        // Create new table row
        const row = document.createElement('tr');
        
        // Create status badge class based on status
        let statusClass = 'available';
        if (hospital.status === 'Critical') {
            statusClass = 'maintenance';
        } else if (hospital.status === 'High Load') {
            statusClass = 'warning';
        }
        
        // Set row content with enhanced data display
        row.innerHTML = `
            <td>${hospital.name}</td>
            <td>${hospital.address}</td>
            <td>
                <div class="capacity-indicator">
                    <div class="capacity-bar-container">
                        <div class="capacity-bar" style="width: ${hospital.capacity.percentage}%"></div>
                    </div>
                    <span>${hospital.capacity.percentage}% (${hospital.capacity.total - hospital.capacity.available}/${hospital.capacity.total})</span>
                </div>
            </td>
            <td>${hospital.waitTime}</td>
            <td><span class="status-badge ${statusClass}">${hospital.status}</span></td>
            <td>${hospital.contact.phone || hospital.contact}</td>
            <td class="actions-cell">
                <button class="action-btn edit" title="Edit hospital details"><i class="fas fa-edit"></i></button>
                <button class="action-btn view" title="View hospital details"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" title="Delete hospital"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add row to table with animation
        row.classList.add('new-row');
        hospitalsTable.appendChild(row);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            row.classList.remove('new-row');
        }, 1000);
        
        // Add event listeners to the new buttons
        const editBtn = row.querySelector('.action-btn.edit');
        const deleteBtn = row.querySelector('.action-btn.delete');
        const viewBtn = row.querySelector('.action-btn.view');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                showNotification(`Editing ${hospitalName}`, 'info');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                if (confirm(`Are you sure you want to delete ${hospitalName}?`)) {
                    // Add row fade out animation
                    row.classList.add('deleting');
                    
                    setTimeout(() => {
                        row.remove();
                        updateDashboardStats();
                        showNotification(`${hospitalName} has been deleted`, 'success');
                    }, 500);
                }
            });
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const hospitalName = row.cells[0].textContent.trim();
                viewHospitalDetails(row);
            });
        }
    }
}

/**
 * Set up hospital action buttons
 */
function setupHospitalActionButtons() {
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
                
                // Open the hospital detail view modal
                viewHospitalDetails(row);
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
                    updateDashboardStats();
                }
            });
        });
    }
}

/**
 * View hospital details
 * @param {HTMLElement} row - Table row element with hospital data
 */
function viewHospitalDetails(row) {
    // Extract data from row
    const name = row.cells[0].textContent.trim();
    const address = row.cells[1].textContent.trim();
    
    // Extract capacity information
    const capacityEl = row.querySelector('.capacity-indicator span');
    const capacityText = capacityEl ? capacityEl.textContent.trim() : '';
    const capacityMatch = capacityText.match(/(\d+)%\s*\((\d+)\/(\d+)\)/);
    let capacityPercentage = 0;
    let occupiedBeds = 0;
    let totalBeds = 0;
    
    if (capacityMatch && capacityMatch.length >= 4) {
        capacityPercentage = parseInt(capacityMatch[1]);
        occupiedBeds = parseInt(capacityMatch[2]);
        totalBeds = parseInt(capacityMatch[3]);
    }
    
    const waitTime = row.cells[3].textContent.trim();
    
    // Extract status
    const statusEl = row.querySelector('.status-badge');
    const status = statusEl ? statusEl.textContent.trim() : 'Available';
    let statusClass = 'available';
    
    if (status === 'Critical') {
        statusClass = 'maintenance';
    } else if (status === 'High Load') {
        statusClass = 'warning';
    }
    
    // Get contact
    const contact = row.cells[5].textContent.trim();
    
    // Populate modal with data
    document.getElementById('view-hospital-name').textContent = name;
    document.getElementById('view-hospital-address').textContent = address;
    
    // Set coordinates (mock data for demo)
    document.getElementById('view-hospital-coordinates').textContent = '22.3072, 73.1812';
    
    // Set contact information
    document.getElementById('view-hospital-phone').textContent = contact;
    document.getElementById('view-hospital-emergency').textContent = contact; // Using same number for demo
    document.getElementById('view-hospital-email').textContent = `info@${name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    const websiteEl = document.getElementById('view-hospital-website');
    const website = `${name.toLowerCase().replace(/\s+/g, '')}.com`;
    websiteEl.textContent = website;
    websiteEl.href = `https://${website}`;
    
    // Set capacity information
    document.getElementById('view-hospital-beds-total').textContent = totalBeds;
    document.getElementById('view-hospital-beds-available').textContent = totalBeds - occupiedBeds;
    
    // Set mock data for other capacity fields
    document.getElementById('view-hospital-icu-beds').textContent = Math.round(totalBeds * 0.2); // 20% of total beds
    document.getElementById('view-hospital-ventilators').textContent = Math.round(totalBeds * 0.1); // 10% of total beds
    document.getElementById('view-hospital-wait-time').textContent = waitTime;
    
    // Set capacity bar
    const capacityBar = document.getElementById('view-hospital-capacity-bar');
    capacityBar.style.width = `${capacityPercentage}%`;
    document.getElementById('view-hospital-capacity').textContent = capacityText;
    
    // Set status badge
    const statusBadge = document.getElementById('view-hospital-status');
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${statusClass}`;
    
    // Set mock data for hospital type and services
    document.getElementById('view-hospital-type').textContent = name.includes('SSG') ? 'Government' : 'Private';
    
    // Set specialties based on hospital name for demo
    let specialties = 'General Medicine, Surgery, Pediatrics';
    if (name.includes('Cancer')) {
        specialties = 'Oncology, Radiology, Chemotherapy';
    } else if (name.includes('Heart') || name.includes('Cardiac')) {
        specialties = 'Cardiology, Cardiac Surgery, Vascular Medicine';
    }
    document.getElementById('view-hospital-specialties').textContent = specialties;
    
    // Set mock data for services
    document.getElementById('view-hospital-emergency-services').textContent = 'Yes';
    document.getElementById('view-hospital-trauma-center').textContent = status === 'Critical' ? 'No' : 'Yes';
    document.getElementById('view-hospital-blood-bank').textContent = 'Yes';
    document.getElementById('view-hospital-24x7').textContent = 'Yes';
    
    // Initialize hospital map
    setTimeout(() => {
        const mapElement = document.getElementById('view-hospital-map');
        if (mapElement && typeof L !== 'undefined') {
            // Check if map already initialized
            if (window.hospitalDetailMap) {
                window.hospitalDetailMap.remove();
            }
            
            // Create map
            window.hospitalDetailMap = L.map('view-hospital-map').setView([22.3072, 73.1812], 15);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(window.hospitalDetailMap);
            
            // Add marker
            L.marker([22.3072, 73.1812]).addTo(window.hospitalDetailMap)
                .bindPopup(`<b>${name}</b><br>${address}`).openPopup();
        }
    }, 300);
    
    // Set up edit button
    const editBtn = document.getElementById('view-hospital-edit');
    if (editBtn) {
        editBtn.onclick = () => {
            closeModal('view-hospital-modal');
            showNotification(`Editing ${name}`, 'info');
        };
    }
    
    // Set up close button
    const closeBtn = document.querySelector('#view-hospital-modal .close-modal-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            closeModal('view-hospital-modal');
        };
    }
    
    // Open modal
    openModal('view-hospital-modal');
}

/**
 * Update dashboard stats
 */
function updateDashboardStats() {
    // Get counts
    const hospitalCount = document.querySelectorAll('#hospitals-tab .data-table tbody tr').length;
    
    // Update hospital count on dashboard
    const hospitalStatValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (hospitalStatValue) {
        hospitalStatValue.textContent = hospitalCount;
    }
    
    // Update hospital summary information
    updateHospitalSummary();
    
    // Update last updated timestamp
    updateLastUpdatedTimestamp();
}

/**
 * Update hospital summary information
 */
function updateHospitalSummary() {
    // Get all hospital rows
    const hospitalRows = document.querySelectorAll('#hospitals-tab .data-table tbody tr');
    
    // Calculate totals
    let totalHospitals = hospitalRows.length;
    let totalBeds = 0;
    let availableBeds = 0;
    let criticalHospitals = 0;
    
    hospitalRows.forEach(row => {
        // Get capacity text which is in format "XX% (YY/ZZ)"
        const capacityText = row.querySelector('.capacity-indicator span').textContent;
        
        // Extract total and available beds using regex
        const bedMatch = capacityText.match(/\((\d+)\/(\d+)\)/);
        if (bedMatch && bedMatch.length >= 3) {
            const occupied = parseInt(bedMatch[1]);
            const total = parseInt(bedMatch[2]);
            
            totalBeds += total;
            availableBeds += (total - occupied);
        }
        
        // Check if hospital is critical
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge && statusBadge.textContent === 'Critical') {
            criticalHospitals++;
        }
    });
    
    // Update summary elements
    const totalHospitalsEl = document.getElementById('total-hospitals');
    const totalBedsEl = document.getElementById('total-beds');
    const availableBedsEl = document.getElementById('available-beds');
    const criticalHospitalsEl = document.getElementById('critical-hospitals');
    
    if (totalHospitalsEl) totalHospitalsEl.textContent = totalHospitals;
    if (totalBedsEl) totalBedsEl.textContent = totalBeds;
    if (availableBedsEl) availableBedsEl.textContent = availableBeds;
    if (criticalHospitalsEl) criticalHospitalsEl.textContent = criticalHospitals;
}

/**
 * Update last updated timestamp
 */
function updateLastUpdatedTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();
    
    // Format: "Today, 2:30 PM" or "Jan 15, 2023, 2:30 PM"
    const isToday = new Date().setHours(0,0,0,0) === new Date(now).setHours(0,0,0,0);
    const formattedDate = isToday ? `Today, ${timeString}` : `${dateString}, ${timeString}`;
    
    // Update the hospital section timestamp
    const hospitalLastUpdatedEl = document.getElementById('hospital-last-updated');
    if (hospitalLastUpdatedEl) {
        hospitalLastUpdatedEl.textContent = formattedDate;
    }
    
    // Update any other last-updated elements
    const lastUpdatedEls = document.querySelectorAll('.last-updated span:not(#hospital-last-updated)');
    lastUpdatedEls.forEach(el => {
        el.textContent = formattedDate;
    });
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
                
                // Update route details panel
                updateRouteDetailsPanel(routeId, from, to, row.cells[3].textContent.trim(), 
                                      row.cells[4].textContent.trim(), row.cells[5].textContent.trim());
                
                showNotification(`Viewing route ${routeId} on map`, 'info');
            });
        });
        
        // Initialize map controls and filters
        initRouteMapControls();
        initRouteFilters();
        initTrafficCharts();
    }
    
    // Add sample routes for demo
    addDemoRoutes();
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    
    // Center map to show the route
    window.routeMap.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.2));
}

/**
 * Initialize route map control buttons
 */
function initRouteMapControls() {
    const showAllRoutesBtn = document.getElementById('show-all-routes');
    const showTrafficBtn = document.getElementById('show-traffic');
    const optimizeRoutesBtn = document.getElementById('optimize-routes');
    const showHeatmapBtn = document.getElementById('show-heatmap');
    const toggleLiveTrackingBtn = document.getElementById('toggle-live-tracking');
    
    if (showAllRoutesBtn) {
        showAllRoutesBtn.addEventListener('click', () => {
            showAllRoutes();
            showNotification('Showing all routes', 'info');
        });
    }
    
    if (showTrafficBtn) {
        showTrafficBtn.addEventListener('click', () => {
            toggleTrafficLayer();
            showNotification('Traffic layer toggled', 'info');
        });
    }
    
    if (optimizeRoutesBtn) {
        optimizeRoutesBtn.addEventListener('click', () => {
            optimizeRoutes();
            showNotification('Routes optimized based on current traffic', 'success');
        });
    }
    
    if (showHeatmapBtn) {
        showHeatmapBtn.addEventListener('click', () => {
            toggleHeatmap();
            showNotification('Emergency heatmap toggled', 'info');
        });
    }
    
    if (toggleLiveTrackingBtn) {
        toggleLiveTrackingBtn.addEventListener('click', () => {
            toggleLiveTracking();
            
            const isActive = toggleLiveTrackingBtn.classList.toggle('active');
            if (isActive) {
                showNotification('Live tracking enabled', 'info');
            } else {
                showNotification('Live tracking disabled', 'info');
            }
        });
    }
    
    // Route action buttons
    const routeNavigateBtn = document.getElementById('route-navigate');
    const routeAnalyzeBtn = document.getElementById('route-analyze');
    const routeShareBtn = document.getElementById('route-share');
    
    if (routeNavigateBtn) {
        routeNavigateBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Navigation started for route ' + routeId, 'success');
        });
    }
    
    if (routeAnalyzeBtn) {
        routeAnalyzeBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Analyzing route ' + routeId, 'info');
            showRouteAnalysis(routeId);
        });
    }
    
    if (routeShareBtn) {
        routeShareBtn.addEventListener('click', () => {
            const routeId = document.querySelector('.route-id-display').textContent;
            if (routeId === 'Select a route') {
                showNotification('Please select a route first', 'warning');
                return;
            }
            
            showNotification('Route ' + routeId + ' link copied to clipboard', 'success');
        });
    }
}

/**
 * Initialize route filters
 */
function initRouteFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const timeFilter = document.getElementById('filter-time').value;
            const typeFilter = document.getElementById('filter-type').value;
            const hospitalFilter = document.getElementById('filter-hospital').value;
            
            applyRouteFilters(timeFilter, typeFilter, hospitalFilter);
            showNotification('Filters applied', 'info');
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filter-time').value = 'current';
            document.getElementById('filter-type').value = 'all';
            document.getElementById('filter-hospital').value = 'all';
            
            resetRouteFilters();
            showNotification('Filters reset', 'info');
        });
    }
}

/**
 * Update route details panel with selected route information
 */
function updateRouteDetailsPanel(routeId, from, to, distance, estTime, traffic) {
    // Update route ID display
    const routeIdDisplay = document.querySelector('.route-id-display');
    if (routeIdDisplay) {
        routeIdDisplay.textContent = routeId;
    }
    
    // Update metrics
    const routeDistance = document.getElementById('route-distance');
    const routeTime = document.getElementById('route-time');
    const routeTraffic = document.getElementById('route-traffic');
    const routeHistorical = document.getElementById('route-historical');
    
    if (routeDistance) routeDistance.textContent = distance;
    if (routeTime) routeTime.textContent = estTime;
    
    if (routeTraffic) {
        // Extract traffic status from the traffic string
        const trafficMatch = traffic.match(/Light|Moderate|Heavy/);
        const trafficStatus = trafficMatch ? trafficMatch[0] : 'Unknown';
        routeTraffic.textContent = trafficStatus;
        
        // Add appropriate class for color coding
        routeTraffic.className = 'metric-value';
        if (trafficStatus === 'Light') routeTraffic.classList.add('status-good');
        if (trafficStatus === 'Moderate') routeTraffic.classList.add('status-warning');
        if (trafficStatus === 'Heavy') routeTraffic.classList.add('status-bad');
    }
    
    if (routeHistorical) {
        // For demo, just randomly generate historical averages
        const minHistorical = parseInt(estTime) - 3;
        const maxHistorical = parseInt(estTime) + 3;
        const historicalTime = Math.max(5, Math.floor(Math.random() * (maxHistorical - minHistorical + 1)) + minHistorical);
        routeHistorical.textContent = historicalTime + ' min';
    }
    
    // Update waypoints
    updateWaypoints(from, to);
    
    // Update traffic insights chart
    updateTrafficHourlyChart(routeId);
    
    // Update best travel time and traffic trend
    updateTrafficPrediction(routeId);
}

/**
 * Update waypoints list for the route
 */
function updateWaypoints(from, to) {
    const waypointList = document.getElementById('waypoint-list');
    if (!waypointList) return;
    
    // Clear existing waypoints
    waypointList.innerHTML = '';
    
    // Create some dummy waypoints for demo
    const waypoints = [
        { name: from, type: 'start', eta: 'Start point' },
        { name: 'Traffic signal junction', type: 'waypoint', eta: '+2 min' },
        { name: 'Major intersection', type: 'waypoint', eta: '+5 min' },
        { name: to, type: 'end', eta: 'Destination' }
    ];
    
    // Add waypoints to the list
    waypoints.forEach(waypoint => {
        const waypointItem = document.createElement('li');
        waypointItem.className = 'waypoint-item';
        if (waypoint.type === 'start') waypointItem.classList.add('waypoint-start');
        if (waypoint.type === 'end') waypointItem.classList.add('waypoint-end');
        
        waypointItem.innerHTML = `
            <div class="waypoint-name">${waypoint.name}</div>
            <div class="waypoint-eta">${waypoint.eta}</div>
        `;
        
        waypointList.appendChild(waypointItem);
    });
}

/**
 * Update hourly traffic chart for the selected route
 */
function updateTrafficHourlyChart(routeId) {
    const chartCanvas = document.getElementById('traffic-hourly-chart');
    if (!chartCanvas) return;
    
    // Check if chart already exists and destroy it
    if (window.trafficHourlyChart) {
        window.trafficHourlyChart.destroy();
    }
    
    // Create sample data
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const travelTimes = [8, 14, 11, 9, 10, 12, 15, 10, 7]; // Sample travel times in minutes
    
    // Create chart
    window.trafficHourlyChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Travel Time (min)',
                data: travelTimes,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
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
 * Update traffic prediction information
 */
function updateTrafficPrediction(routeId) {
    const bestTravelTime = document.getElementById('best-travel-time');
    const trafficTrend = document.getElementById('traffic-trend');
    
    if (bestTravelTime) {
        bestTravelTime.textContent = '8:30 PM - 10:00 PM';
    }
    
    if (trafficTrend) {
        // Generate a random trend for demo purposes
        const trends = [
            { text: 'Improving in next hour', class: 'improving' },
            { text: 'Worsening during rush hour (5-7 PM)', class: 'worsening' },
            { text: 'Stable for next 3 hours', class: 'stable' }
        ];
        
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trafficTrend.textContent = randomTrend.text;
        trafficTrend.className = 'trend ' + randomTrend.class;
    }
}

/**
 * Initialize traffic insights charts
 */
function initTrafficCharts() {
    initDailyTrafficChart();
    initWeeklyResponseChart();
}

/**
 * Initialize daily traffic patterns chart
 */
function initDailyTrafficChart() {
    const chartCanvas = document.getElementById('daily-traffic-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const hours = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
    const trafficIndexes = [10, 5, 5, 15, 80, 60, 40, 45, 55, 85, 40, 20]; // 0-100 traffic index
    
    // Create chart
    window.dailyTrafficChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Traffic Congestion Index',
                data: trafficIndexes,
                backgroundColor: trafficIndexes.map(value => {
                    if (value < 30) return 'rgba(46, 204, 113, 0.7)'; // Green for light traffic
                    if (value < 60) return 'rgba(243, 156, 18, 0.7)'; // Orange for moderate traffic
                    return 'rgba(231, 76, 60, 0.7)'; // Red for heavy traffic
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Index'
                    }
                }
            }
        }
    });
}

/**
 * Initialize weekly response time comparison chart
 */
function initWeeklyResponseChart() {
    const chartCanvas = document.getElementById('weekly-response-chart');
    if (!chartCanvas) return;
    
    // Create sample data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeek = [10.2, 9.8, 11.5, 8.2, 12.0, 7.5, 7.2]; // Minutes
    const previousWeek = [11.0, 10.5, 10.2, 9.0, 13.5, 8.0, 7.8]; // Minutes
    
    // Create chart
    window.weeklyResponseChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'This Week',
                    data: currentWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.2,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: previousWeek,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.2,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Response Time (min)'
                    }
                }
            }
        }
    });
}

/**
 * Apply route filters
 */
function applyRouteFilters(timeFilter, typeFilter, hospitalFilter) {
    // For demo, just show a notification
    const timeMap = {
        'current': 'current time',
        'morning': 'morning rush hour (8-10 AM)',
        'afternoon': 'afternoon (12-2 PM)',
        'evening': 'evening rush hour (5-7 PM)',
        'night': 'night time (10 PM-6 AM)'
    };
    
    const timeDisplay = timeMap[timeFilter] || timeFilter;
    showNotification(`Showing traffic patterns for ${timeDisplay}`, 'info');
    
    // Update stats based on filters
    updateRouteStats(timeFilter, typeFilter, hospitalFilter);
}

/**
 * Reset route filters
 */
function resetRouteFilters() {
    showAllRoutes();
    updateRouteStats('current', 'all', 'all');
}

/**
 * Update route statistics based on filters
 */
function updateRouteStats(timeFilter, typeFilter, hospitalFilter) {
    // For demo, update with some sample values
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        // Adjust values based on filters
        if (timeFilter === 'morning' || timeFilter === 'evening') {
            // Rush hour
            statValues[0].textContent = '24 km/h';
            statValues[1].textContent = '18 min';
        } else if (timeFilter === 'night') {
            // Night time
            statValues[0].textContent = '42 km/h';
            statValues[1].textContent = '8 min';
        } else {
            // Default/current
            statValues[0].textContent = '32 km/h';
            statValues[1].textContent = '12 min';
        }
    }
}

/**
 * Toggle traffic layer
 */
function toggleTrafficLayer() {
    const trafficBtn = document.getElementById('show-traffic');
    if (trafficBtn) {
        trafficBtn.classList.toggle('active');
    }
}

/**
 * Optimize routes based on current traffic
 */
function optimizeRoutes() {
    // Simulate route optimization
    setTimeout(() => {
        const routeTimeElements = document.querySelectorAll('.data-table tbody tr td:nth-child(5)');
        routeTimeElements.forEach(el => {
            const currentTime = parseInt(el.textContent);
            if (currentTime) {
                // Reduce time by ~20%
                const optimizedTime = Math.max(5, Math.round(currentTime * 0.8));
                el.textContent = `${optimizedTime} min`;
                el.classList.add('highlight-positive');
                setTimeout(() => {
                    el.classList.remove('highlight-positive');
                }, 3000);
            }
        });
    }, 1000);
}

/**
 * Toggle emergency heatmap
 */
function toggleHeatmap() {
    const heatmapBtn = document.getElementById('show-heatmap');
    if (heatmapBtn) {
        heatmapBtn.classList.toggle('active');
    }
}

/**
 * Toggle live tracking of ambulances
 */
function toggleLiveTracking() {
    const trackingBtn = document.getElementById('toggle-live-tracking');
    if (trackingBtn) {
        trackingBtn.classList.toggle('active');
    }
}

/**
 * Show detailed route analysis
 */
function showRouteAnalysis(routeId) {
    // For demo, just show a notification
    showNotification(`Analysis for route ${routeId}: Traffic data shows 15% improvement from yesterday. Alternative routes available with similar travel times.`, 'info', 8000);
}

/**
 * Show route on map
 */
function showRouteOnMap(routeId, from, to) {
    if (!window.routeMap) return;
    
    // Clear existing routes
    if (window.currentRoute) {
        window.routeMap.removeLayer(window.currentRoute);
    }
    
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
    