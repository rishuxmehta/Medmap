/**
 * Advanced Hospital Form Functionality
 * Enhances the hospital form with validation, dynamic fields, tooltips, and geolocation
 */

document.addEventListener('DOMContentLoaded', function() {
    enhanceHospitalForm();
});

/**
 * Enhance the hospital form with advanced functionality
 */
function enhanceHospitalForm() {
    // Setup form elements
    setupFormValidation();
    setupDynamicFields();
    addFormTooltips();
    setupGeolocation();
    setupMapPicker();
    
    // Initialize form data
    populateDefaults();
}

/**
 * Setup form validation
 */
function setupFormValidation() {
    const form = document.getElementById('add-hospital-form');
    
    if (!form) return;
    
    // Add validation to all required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            // Remove error styling as user types
            if (this.classList.contains('input-error')) {
                this.classList.remove('input-error');
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
    });
    
    // Add validation for specific field types
    setupSpecificValidations();
    
    // Validate form on submit
    form.addEventListener('submit', function(e) {
        if (!validateHospitalForm()) {
            e.preventDefault();
            showNotification('Please correct the errors in the form', 'error');
            
            // Switch to the first tab with errors
            const tabsWithErrors = Array.from(document.querySelectorAll('.form-tab-content')).filter(tab => {
                return tab.querySelector('.input-error');
            });
            
            if (tabsWithErrors.length > 0) {
                const firstTabWithError = tabsWithErrors[0];
                const tabId = firstTabWithError.id.replace('-tab', '');
                document.querySelector(`.form-tab[data-tab="${tabId}"]`).click();
            }
        }
    });
}

/**
 * Validate a specific field
 */
function validateField(field) {
    // Clear previous errors
    const errorMsg = field.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains('error-message')) {
        errorMsg.remove();
    }
    
    field.classList.remove('input-error');
    
    // Check if empty for required fields
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Validate based on field type or id
    switch(field.id) {
        case 'hospital-email':
            if (!validateEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'hospital-pincode':
            if (!/^\d{6}$/.test(field.value)) {
                showFieldError(field, 'PIN code must be 6 digits');
                return false;
            }
            break;
        case 'hospital-phone':
        case 'hospital-emergency-phone':
        case 'hospital-helpline':
            if (field.value && !/^[0-9+\- ]{10,15}$/.test(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
        case 'hospital-website':
            if (field.value && !validateUrl(field.value)) {
                showFieldError(field, 'Please enter a valid URL');
                return false;
            }
            break;
        case 'hospital-beds-available':
            const totalBeds = parseInt(document.getElementById('hospital-beds-total').value) || 0;
            const availableBeds = parseInt(field.value) || 0;
            
            if (availableBeds > totalBeds) {
                showFieldError(field, 'Available beds cannot exceed total beds');
                return false;
            }
            break;
    }
    
    return true;
}

/**
 * Show error message for a field
 */
function showFieldError(field, message) {
    field.classList.add('input-error');
    
    const error = document.createElement('div');
    error.className = 'error-message';
    error.innerHTML = message;
    
    // Insert after the field
    field.parentNode.insertBefore(error, field.nextSibling);
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate URL format
 */
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Setup specific validations
 */
function setupSpecificValidations() {
    // Validate available beds against total beds
    const totalBedsField = document.getElementById('hospital-beds-total');
    const availableBedsField = document.getElementById('hospital-beds-available');
    
    if (totalBedsField && availableBedsField) {
        totalBedsField.addEventListener('change', function() {
            const total = parseInt(this.value) || 0;
            const available = parseInt(availableBedsField.value) || 0;
            
            if (available > total) {
                availableBedsField.value = total;
                highlightUpdatedField(availableBedsField);
            }
        });
    }
}

/**
 * Validate the entire hospital form
 */
function validateHospitalForm() {
    const form = document.getElementById('add-hospital-form');
    if (!form) return true;
    
    let isValid = true;
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate other fields with rules
    const fieldsToValidate = [
        document.getElementById('hospital-email'),
        document.getElementById('hospital-pincode'),
        document.getElementById('hospital-phone'),
        document.getElementById('hospital-website'),
        document.getElementById('hospital-beds-available')
    ];
    
    fieldsToValidate.forEach(field => {
        if (field && field.value && !validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Highlight an updated field
 */
function highlightUpdatedField(field) {
    field.classList.add('field-updated');
    
    setTimeout(() => {
        field.classList.remove('field-updated');
    }, 2000);
}

/**
 * Setup dynamic fields
 */
function setupDynamicFields() {
    // Update form fields based on hospital type
    const hospitalTypeField = document.getElementById('hospital-type');
    
    if (hospitalTypeField) {
        hospitalTypeField.addEventListener('change', function() {
            updateFormBasedOnHospitalType(this.value);
        });
    }
    
    // Show/hide fields based on checkbox states
    setupCheckboxToggleFields();
}

/**
 * Update form based on hospital type
 */
function updateFormBasedOnHospitalType(type) {
    const nameField = document.getElementById('hospital-name');
    const bedsField = document.getElementById('hospital-beds-total');
    const icuBedsField = document.getElementById('hospital-icu-beds');
    
    if (!nameField || !bedsField || !icuBedsField) return;
    
    // Update placeholder based on type
    switch(type) {
        case 'government':
            nameField.placeholder = 'E.g., District General Hospital';
            break;
        case 'private':
            nameField.placeholder = 'E.g., Apollo Hospital';
            break;
        case 'charity':
            nameField.placeholder = 'E.g., Red Cross Hospital';
            break;
        case 'speciality':
            nameField.placeholder = 'E.g., Cancer Care Institute';
            break;
        case 'teaching':
            nameField.placeholder = 'E.g., Medical College Hospital';
            break;
        default:
            nameField.placeholder = 'Enter hospital name';
    }
    
    // Set suggested values based on type
    if (type === 'government' && !bedsField.value) {
        bedsField.value = '100';
        highlightUpdatedField(bedsField);
    } else if (type === 'speciality' && !icuBedsField.value) {
        icuBedsField.value = '20';
        highlightUpdatedField(icuBedsField);
    }
}

/**
 * Setup checkbox toggle fields
 */
function setupCheckboxToggleFields() {
    // Toggle ventilators required based on ICU checkbox
    const icuCheckbox = document.getElementById('hospital-icu');
    const ventilatorsField = document.getElementById('hospital-ventilators');
    
    if (icuCheckbox && ventilatorsField) {
        icuCheckbox.addEventListener('change', function() {
            if (this.checked) {
                ventilatorsField.parentElement.style.display = 'block';
            } else {
                ventilatorsField.parentElement.style.display = 'none';
                ventilatorsField.value = '';
            }
        });
    }
    
    // Similar toggles can be added for other checkbox-dependent fields
}

/**
 * Add tooltips to form fields
 */
function addFormTooltips() {
    // Add tooltips to specific fields
    const tooltips = {
        'hospital-name': 'Enter the official name of the hospital as registered',
        'hospital-type': 'Select the category that best describes this hospital',
        'hospital-beds-total': 'Total number of beds available in the hospital',
        'hospital-beds-available': 'Number of beds currently vacant and ready for patients',
        'hospital-icu-beds': 'Number of intensive care unit beds available',
        'hospital-wait-time': 'Average wait time for emergency services in minutes',
        'hospital-email': 'Primary contact email for the hospital',
        'hospital-emergency': 'Check if this hospital provides emergency services',
        'hospital-lat': 'Geographic latitude coordinate of the hospital location',
        'hospital-lng': 'Geographic longitude coordinate of the hospital location'
    };
    
    for (const [id, text] of Object.entries(tooltips)) {
        const field = document.getElementById(id);
        if (field) {
            field.setAttribute('title', text);
            // Additional tooltip functionality could be added here
        }
    }
}

/**
 * Setup geolocation functionality
 */
function setupGeolocation() {
    const autoLocateBtn = document.querySelector('.auto-locate[data-target="hospital"]');
    
    if (autoLocateBtn) {
        autoLocateBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                // Show loading state
                autoLocateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
                autoLocateBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    position => {
                        document.getElementById('hospital-lat').value = position.coords.latitude.toFixed(6);
                        document.getElementById('hospital-lng').value = position.coords.longitude.toFixed(6);
                        
                        // Highlight updated fields
                        highlightUpdatedField(document.getElementById('hospital-lat'));
                        highlightUpdatedField(document.getElementById('hospital-lng'));
                        
                        // Reset button
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        
                        // Show success notification
                        showNotification('Location coordinates updated successfully', 'success');
                        
                        // Update map preview if available
                        updateMapPreview();
                    },
                    error => {
                        // Reset button
                        autoLocateBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use My Location';
                        autoLocateBtn.disabled = false;
                        
                        // Show error notification
                        showNotification('Error getting location: ' + getGeolocationErrorMessage(error), 'error');
                    }
                );
            } else {
                showNotification('Geolocation is not supported by this browser', 'error');
            }
        });
    }
}

/**
 * Get human-readable geolocation error message
 */
function getGeolocationErrorMessage(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "User denied the request for geolocation";
        case error.POSITION_UNAVAILABLE:
            return "Location information is unavailable";
        case error.TIMEOUT:
            return "The request to get user location timed out";
        case error.UNKNOWN_ERROR:
            return "An unknown error occurred";
        default:
            return "Error getting location";
    }
}

/**
 * Setup map picker functionality
 */
function setupMapPicker() {
    const mapPickerBtn = document.getElementById('show-map-picker');
    const mapPreview = document.getElementById('hospital-map-preview');
    
    if (mapPickerBtn && mapPreview) {
        // Initialize map
        let map = null;
        let marker = null;
        
        mapPickerBtn.addEventListener('click', function() {
            // Initialize map if it doesn't exist
            if (!map) {
                initializeMapPreview();
            }
            
            // Show notification for instructions
            showNotification('Click on the map to set the hospital location', 'info');
        });
        
        function initializeMapPreview() {
            // Check if Leaflet is available
            if (typeof L !== 'undefined') {
                // Initialize map with default view of Vadodara
                map = L.map(mapPreview).setView([22.3072, 73.1812], 13);
                
                // Add tile layer (OpenStreetMap)
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                
                // Get current coordinates if available
                const lat = parseFloat(document.getElementById('hospital-lat').value) || 22.3072;
                const lng = parseFloat(document.getElementById('hospital-lng').value) || 73.1812;
                
                // Add marker
                marker = L.marker([lat, lng], {
                    draggable: true
                }).addTo(map);
                
                // Update coordinates on marker drag
                marker.on('dragend', function(e) {
                    const position = marker.getLatLng();
                    document.getElementById('hospital-lat').value = position.lat.toFixed(6);
                    document.getElementById('hospital-lng').value = position.lng.toFixed(6);
                    
                    highlightUpdatedField(document.getElementById('hospital-lat'));
                    highlightUpdatedField(document.getElementById('hospital-lng'));
                });
                
                // Update marker on map click
                map.on('click', function(e) {
                    marker.setLatLng(e.latlng);
                    document.getElementById('hospital-lat').value = e.latlng.lat.toFixed(6);
                    document.getElementById('hospital-lng').value = e.latlng.lng.toFixed(6);
                    
                    highlightUpdatedField(document.getElementById('hospital-lat'));
                    highlightUpdatedField(document.getElementById('hospital-lng'));
                });
                
                // Invalidate size to ensure map renders correctly
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);
            } else {
                showNotification('Map functionality is not available', 'error');
            }
        }
    }
}

/**
 * Update map preview with current coordinates
 */
function updateMapPreview() {
    const mapPreview = document.getElementById('hospital-map-preview');
    
    if (mapPreview && typeof L !== 'undefined' && mapPreview._leaflet_id) {
        const map = L.map(mapPreview);
        const marker = map._layers[Object.keys(map._layers)[0]];
        
        const lat = parseFloat(document.getElementById('hospital-lat').value) || 22.3072;
        const lng = parseFloat(document.getElementById('hospital-lng').value) || 73.1812;
        
        if (marker) {
            marker.setLatLng([lat, lng]);
        }
        
        map.setView([lat, lng], 13);
    }
}

/**
 * Populate default values
 */
function populateDefaults() {
    // Default values for city and state
    const cityField = document.getElementById('hospital-city');
    const stateField = document.getElementById('hospital-state');
    const countryField = document.getElementById('hospital-country');
    
    if (cityField && !cityField.value) {
        cityField.value = 'Vadodara';
    }
    
    if (stateField && !stateField.value) {
        stateField.value = 'Gujarat';
    }
    
    if (countryField && !countryField.value) {
        countryField.value = 'India';
    }
} 