/**
 * Smart Ambulance Routing System
 * Emergency Request Functionality
 */

class EmergencyManager {
    constructor() {
        this.modal = document.getElementById('emergency-modal');
        this.form = document.getElementById('emergency-form');
        this.sosButton = document.getElementById('sos-button');
        this.closeModalBtn = document.querySelector('.close-modal');
        this.cancelBtn = document.querySelector('.cancel-btn');
        this.locationInput = document.getElementById('location');
        this.locationAccuracy = document.getElementById('location-accuracy');
        this.refreshLocationBtn = document.getElementById('refresh-location');
        this.mobileNumberInput = document.getElementById('mobile-number');
        this.driverNotification = document.getElementById('driver-notification');
        this.closeDriverNotificationBtn = document.getElementById('close-driver-notification');
        this.callDriverBtn = document.getElementById('call-driver');
        this.trackAmbulanceBtn = document.getElementById('track-ambulance');
        this.userLocation = null;
        this.locationAddress = null;
        this.assignedDriver = null;
        
        this.init();
    }

    /**
     * Initialize emergency functionality
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Get user's location
        this.getUserLocation();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // SOS button click
        if (this.sosButton) {
            this.sosButton.addEventListener('click', () => {
                this.openEmergencyModal();
            });
        }

        // Close modal button click
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => {
                this.closeEmergencyModal();
            });
        }

        // Cancel button click
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => {
                this.closeEmergencyModal();
            });
        }

        // Refresh location button click
        if (this.refreshLocationBtn) {
            this.refreshLocationBtn.addEventListener('click', () => {
                this.getUserLocation();
            });
        }

        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitEmergencyRequest();
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeEmergencyModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeEmergencyModal();
            }
        });
        
        // Close driver notification button click
        if (this.closeDriverNotificationBtn) {
            this.closeDriverNotificationBtn.addEventListener('click', () => {
                this.hideDriverNotification();
            });
        }
        
        // Call driver button click
        if (this.callDriverBtn) {
            this.callDriverBtn.addEventListener('click', () => {
                this.callDriver();
            });
        }
        
        // Track ambulance button click
        if (this.trackAmbulanceBtn) {
            this.trackAmbulanceBtn.addEventListener('click', () => {
                this.trackAmbulance();
            });
        }
    }

    /**
     * Open the emergency request modal
     */
    openEmergencyModal() {
        if (!this.modal) return;
        
        // Reset form
        if (this.form) {
            this.form.reset();
        }
        
        // Update location
        this.getUserLocation();
        
        // Show modal
        this.modal.classList.add('active');
        
        // Add animation class to SOS button
        if (this.sosButton) {
            this.sosButton.classList.add('active');
        }
    }

    /**
     * Close the emergency request modal
     */
    closeEmergencyModal() {
        if (!this.modal) return;
        
        // Hide modal
        this.modal.classList.remove('active');
        
        // Remove animation class from SOS button
        if (this.sosButton) {
            this.sosButton.classList.remove('active');
        }
    }

    /**
     * Get user's current location
     */
    getUserLocation() {
        if (!this.locationInput) return;
        
        // Show loading state
        this.locationInput.value = 'Detecting your location in Vadodara...';
        this.locationInput.classList.add('loading');
        
        // Update accuracy indicator
        if (this.locationAccuracy) {
            this.locationAccuracy.textContent = 'Location accuracy: Detecting...';
            this.locationAccuracy.className = 'location-accuracy detecting';
        }
        
        if (navigator.geolocation) {
            // Request high accuracy for Vadodara city
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            };
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    this.userLocation = { 
                        latitude, 
                        longitude,
                        accuracy: Math.round(accuracy) // accuracy in meters
                    };
                    
                    // Update accuracy indicator
                    this.updateLocationAccuracy(accuracy);
                    
                    // Get address from coordinates
                    this.getAddressFromCoordinates(latitude, longitude);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    this.locationInput.value = 'Location access denied. Please enable location services.';
                    this.locationInput.classList.remove('loading');
                    this.locationInput.classList.add('error');
                    
                    // Update accuracy indicator
                    if (this.locationAccuracy) {
                        this.locationAccuracy.textContent = 'Location accuracy: Error - Please enable location services';
                        this.locationAccuracy.className = 'location-accuracy error';
                    }
                },
                options
            );
        } else {
            this.locationInput.value = 'Geolocation is not supported by this browser.';
            this.locationInput.classList.remove('loading');
            this.locationInput.classList.add('error');
            
            // Update accuracy indicator
            if (this.locationAccuracy) {
                this.locationAccuracy.textContent = 'Location accuracy: Not supported by this browser';
                this.locationAccuracy.className = 'location-accuracy error';
            }
        }
    }

    /**
     * Update location accuracy indicator
     * @param {number} accuracy - Accuracy in meters
     */
    updateLocationAccuracy(accuracy) {
        if (!this.locationAccuracy) return;
        
        const accuracyMeters = Math.round(accuracy);
        let accuracyClass = 'good';
        let accuracyText = 'Excellent';
        
        // Determine accuracy level
        if (accuracyMeters > 100) {
            accuracyClass = 'poor';
            accuracyText = 'Poor';
        } else if (accuracyMeters > 50) {
            accuracyClass = 'moderate';
            accuracyText = 'Moderate';
        } else if (accuracyMeters > 20) {
            accuracyClass = 'good';
            accuracyText = 'Good';
        }
        
        // Update accuracy indicator
        this.locationAccuracy.textContent = `Location accuracy: ${accuracyText} (±${accuracyMeters} meters)`;
        this.locationAccuracy.className = `location-accuracy ${accuracyClass}`;
    }

    /**
     * Get address from coordinates using reverse geocoding
     * @param {number} latitude - Latitude
     * @param {number} longitude - Longitude
     */
    getAddressFromCoordinates(latitude, longitude) {
        // In a real application, you would use a geocoding service API
        // For this demo, we'll simulate the address lookup for Vadodara
        setTimeout(() => {
            // Simulate address lookup for Vadodara
            const address = this.simulateVadodaraAddressLookup(latitude, longitude);
            this.locationAddress = address;
            
            // Update location input
            if (this.locationInput) {
                this.locationInput.value = address;
                this.locationInput.classList.remove('loading');
                this.locationInput.classList.remove('error');
            }
        }, 1000);
    }

    /**
     * Simulate address lookup from coordinates for Vadodara
     * @param {number} latitude - Latitude
     * @param {number} longitude - Longitude
     * @returns {string} - Simulated address in Vadodara
     */
    simulateVadodaraAddressLookup(latitude, longitude) {
        // Vadodara neighborhoods and areas
        const areas = [
            'Alkapuri', 'Sayajigunj', 'Fatehgunj', 'Manjalpur', 'Karelibaug',
            'Akota', 'Gorwa', 'Waghodia Road', 'Nizampura', 'Sama'
        ];
        
        const streets = [
            'R.C. Dutt Road', 'Old Padra Road', 'Jetalpur Road', 'Productivity Road',
            'Rajmahal Road', 'Race Course Circle', 'Dandia Bazaar', 'Raopura Road'
        ];
        
        // Generate a random address in Vadodara based on coordinates
        const streetNumber = Math.floor(100 + Math.random() * 900);
        const street = streets[Math.floor(Math.random() * streets.length)];
        const area = areas[Math.floor(Math.random() * areas.length)];
        
        return `${streetNumber} ${street}, ${area}, Vadodara, Gujarat 390001`;
    }

    /**
     * Submit emergency request
     */
    submitEmergencyRequest() {
        if (!this.form) return;
        
        // Get form data
        const emergencyType = document.getElementById('emergency-type').value;
        const patientName = document.getElementById('patient-name').value;
        const patientAge = document.getElementById('patient-age').value;
        const mobileNumber = this.mobileNumberInput ? this.mobileNumberInput.value : '';
        const additionalInfo = document.getElementById('additional-info').value;
        
        // Validate form
        if (!emergencyType) {
            alert('Please select an emergency type.');
            return;
        }
        
        if (!this.userLocation) {
            alert('Location is required. Please allow location access.');
            return;
        }
        
        if (this.mobileNumberInput && !this.mobileNumberInput.value) {
            alert('Please enter your mobile number for emergency contact.');
            return;
        }
        
        // Validate mobile number format (10 digits)
        if (this.mobileNumberInput && !/^\d{10}$/.test(this.mobileNumberInput.value)) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }
        
        // Create emergency request object
        const emergencyRequest = {
            type: emergencyType,
            patientName: patientName || null,
            patientAge: patientAge || null,
            mobileNumber: mobileNumber,
            location: this.userLocation,
            address: this.locationAddress,
            additionalInfo: additionalInfo || null,
            timestamp: Date.now(),
            status: 'pending',
            city: 'Vadodara',
            state: 'Gujarat'
        };
        
        // Save emergency request to Firebase
        this.saveEmergencyRequest(emergencyRequest);
    }

    /**
     * Save emergency request to Firebase
     * @param {Object} emergencyRequest - Emergency request data
     */
    saveEmergencyRequest(emergencyRequest) {
        // Show loading state
        const submitBtn = this.form.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
        // Simulate successful save
        setTimeout(() => {
            console.log('Emergency request saved:', emergencyRequest);
            this.showEmergencyConfirmation(emergencyRequest);
            this.form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Request Ambulance';
            this.closeEmergencyModal();
            setTimeout(() => {
                this.assignDriverAndShowNotification(emergencyRequest);
                // Simulate ambulance dispatch with the emergency request
                this.simulateAmbulanceDispatch(emergencyRequest);
            }, 5000);
        }, 2000);
    }

    /**
     * Show emergency confirmation
     * @param {Object} emergencyRequest - Emergency request data
     */
    showEmergencyConfirmation(emergencyRequest) {
        // Create confirmation element
        const confirmationEl = document.createElement('div');
        confirmationEl.className = 'emergency-confirmation';
        confirmationEl.innerHTML = `
            <div class="confirmation-content">
                <i class="fas fa-check-circle"></i>
                <h2>Emergency Request Sent</h2>
                <p>Help is on the way to your location in Vadodara!</p>
                <p class="confirmation-details">
                    <strong>Emergency Type:</strong> ${emergencyTypes[emergencyRequest.type]?.name || emergencyRequest.type}<br>
                    <strong>Location:</strong> ${emergencyRequest.address}<br>
                    <strong>Mobile:</strong> ${emergencyRequest.mobileNumber}<br>
                    <strong>ETA:</strong> Approximately 8-10 minutes
                </p>
                <p class="confirmation-note">
                    A confirmation SMS will be sent to your mobile number.<br>
                    The nearest available ambulance from Vadodara is being dispatched.
                </p>
                <button class="close-confirmation-btn">OK</button>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(confirmationEl);
        
        // Add close button event listener
        const closeBtn = confirmationEl.querySelector('.close-confirmation-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(confirmationEl);
            });
        }
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(confirmationEl)) {
                document.body.removeChild(confirmationEl);
            }
        }, 10000);
        
        // Simulate adding emergency to map
        this.simulateEmergencyOnMap(emergencyRequest);
    }

    /**
     * Simulate adding emergency to map
     * @param {Object} emergencyRequest - Emergency request data
     */
    simulateEmergencyOnMap(emergencyRequest) {
        // Check if map is available
        if (!window.ambulanceMap) return;
        
        // Generate a unique ID for the emergency
        const emergencyId = 'emergency-' + Date.now();
        
        // Add emergency marker to map
        window.ambulanceMap.addEmergencyMarker(emergencyId, emergencyRequest);
        
        // Simulate ambulance dispatch
        this.simulateAmbulanceDispatch(emergencyRequest);
    }

    /**
     * Simulate ambulance dispatch
     * @param {Object} emergencyRequest - Emergency request data
     */
    simulateAmbulanceDispatch(emergencyRequest) {
        // In a real application, this would be handled by the backend
        // For this demo, we'll simulate the dispatch process
        
        // If we have an assigned driver, use that information
        if (this.assignedDriver) {
            // Extract ambulance ID from the assigned driver
            const ambulanceId = this.assignedDriver.ambulanceId;
            
            // Create a simulated ambulance with the assigned driver's info
            const ambulance = {
                id: ambulanceId,
                type: 'type2',
                status: 'dispatched',
                driver: this.assignedDriver.name,
                location: {
                    latitude: emergencyRequest.location.latitude - 0.01,
                    longitude: emergencyRequest.location.longitude - 0.01
                },
                lastUpdated: Date.now()
            };
            
            // Add ambulance to map
            if (window.ambulanceMap) {
                window.ambulanceMap.addAmbulanceMarker(ambulance.id, ambulance);
                
                // Show route from ambulance to emergency
                window.ambulanceMap.showRoute(
                    [ambulance.location.latitude, ambulance.location.longitude],
                    [emergencyRequest.location.latitude, emergencyRequest.location.longitude]
                );
            }
        } else {
            // Simulate finding the nearest available ambulance
            setTimeout(() => {
                // Create a simulated ambulance
                const ambulance = {
                    id: 'AMB-' + Math.floor(1000 + Math.random() * 9000),
                    type: 'type2',
                    status: 'dispatched',
                    driver: 'Ambulance Driver',
                    location: {
                        latitude: emergencyRequest.location.latitude - 0.01,
                        longitude: emergencyRequest.location.longitude - 0.01
                    },
                    lastUpdated: Date.now()
                };
                
                // Add ambulance to map
                if (window.ambulanceMap) {
                    window.ambulanceMap.addAmbulanceMarker(ambulance.id, ambulance);
                    
                    // Show route from ambulance to emergency
                    window.ambulanceMap.showRoute(
                        [ambulance.location.latitude, ambulance.location.longitude],
                        [emergencyRequest.location.latitude, emergencyRequest.location.longitude]
                    );
                }
            }, 3000);
        }
    }

    /**
     * Assign a driver and show notification
     * @param {Object} emergencyRequest - Emergency request data
     */
    assignDriverAndShowNotification(emergencyRequest) {
        // Simulate driver assignment
        const drivers = [
            {
                name: 'Rajesh Kumar',
                ambulanceId: 'AMB-1042',
                license: 'GJ-05-TC-1234',
                phone: '9876543210',
                eta: '7 minutes'
            },
            {
                name: 'Sunil Patel',
                ambulanceId: 'AMB-2157',
                license: 'GJ-05-AB-5678',
                phone: '9876543211',
                eta: '9 minutes'
            },
            {
                name: 'Amit Singh',
                ambulanceId: 'AMB-3089',
                license: 'GJ-05-XY-9012',
                phone: '9876543212',
                eta: '5 minutes'
            },
            {
                name: 'Vikram Desai',
                ambulanceId: 'AMB-4231',
                license: 'GJ-05-PQ-3456',
                phone: '9876543213',
                eta: '8 minutes'
            }
        ];
        
        // Randomly select a driver
        const driver = drivers[Math.floor(Math.random() * drivers.length)];
        this.assignedDriver = driver;
        
        // Update driver notification with driver details
        document.getElementById('driver-name').textContent = driver.name;
        document.getElementById('driver-ambulance').textContent = `Ambulance ID: ${driver.ambulanceId}`;
        document.getElementById('driver-license').textContent = `License: ${driver.license}`;
        document.getElementById('driver-eta').textContent = driver.eta;
        
        // Show driver notification
        this.showDriverNotification();
    }

    /**
     * Show driver notification
     */
    showDriverNotification() {
        if (!this.driverNotification) return;
        
        // Show notification
        this.driverNotification.classList.add('show');
        
        // Add notification sound
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
    }

    /**
     * Hide driver notification
     */
    hideDriverNotification() {
        if (!this.driverNotification) return;
        
        // Hide notification
        this.driverNotification.classList.remove('show');
    }

    /**
     * Call the assigned driver
     */
    callDriver() {
        if (!this.assignedDriver) return;
        
        // In a real application, this would integrate with a calling API
        // For this demo, we'll just open the tel: protocol
        window.location.href = `tel:${this.assignedDriver.phone}`;
    }

    /**
     * Track the ambulance on the map
     */
    trackAmbulance() {
        if (!this.assignedDriver) return;
        
        // Scroll to map section
        const mapSection = document.querySelector('.map-section');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Focus on the ambulance on the map
        if (window.ambulanceMap) {
            // Find the ambulance marker by ID
            const ambulanceId = this.assignedDriver.ambulanceId;
            
            // Center map on ambulance and zoom in
            window.ambulanceMap.focusOnAmbulance(ambulanceId);
            
            // Show a toast notification
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.innerHTML = `
                <div class="toast-icon"><i class="fas fa-map-marker-alt"></i></div>
                <div class="toast-message">Tracking ambulance ${ambulanceId}</div>
            `;
            document.body.appendChild(toast);
            
            // Show the toast
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);
            
            // Remove the toast after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        } else {
            alert(`Tracking ambulance ${this.assignedDriver.ambulanceId} on the map`);
        }
    }
}

// Initialize emergency manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.emergencyManager = new EmergencyManager();
}); 