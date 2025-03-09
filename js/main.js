/**
 * Smart Ambulance Routing System
 * Main JavaScript File
 */

/**
 * Initialize the application
 */
function initApp() {
    // Set up mobile menu toggle
    setupMobileMenu();
    
    // Set up demo data if needed
    setupDemoData();
    
    // Set up periodic data refresh
    setupDataRefresh();
    
    // Add CSS class for animations
    document.body.classList.add('loaded');
}

/**
 * Set up mobile menu toggle
 */
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

/**
 * Set up demo data for the application
 */
function setupDemoData() {
    // Check if demo data already exists
    database.ref('hospitals').once('value', (snapshot) => {
        if (!snapshot.exists()) {
            // Create demo hospitals
            createDemoHospitals();
        }
    });
    
    database.ref('ambulances').once('value', (snapshot) => {
        if (!snapshot.exists()) {
            // Create demo ambulances
            createDemoAmbulances();
        }
    });
}

/**
 * Create demo hospital data
 */
function createDemoHospitals() {
    // Get user location as center point
    const userLocation = window.ambulanceMap ? window.ambulanceMap.userLocation : mapConfig.center;
    
    // Demo hospital data with coordinates that place hospitals nearby (0.8-2.2 km away)
    const hospitals = {
        'hospital-1': {
            name: 'SSG Hospital',
            address: 'Jail Road, Raopura, Vadodara, Gujarat',
            phone: '02652424848',
            totalBeds: 250,
            occupiedBeds: 200,
            waitTime: 20,
            location: {
                latitude: userLocation[0] + 0.005,
                longitude: userLocation[1] + 0.003
            }
        },
        'hospital-2': {
            name: 'Bhailal Amin General Hospital',
            address: 'GIDC Rd, Gorwa, Vadodara, Gujarat',
            phone: '08069707070',
            totalBeds: 50,
            occupiedBeds: 31,
            waitTime: 10,
            location: {
                latitude: userLocation[0] - 0.008,
                longitude: userLocation[1] + 0.006
            }
        },
        'hospital-3': {
            name: 'Baroda Medical College Hospital',
            address: 'Anandpura, Vadodara, Gujarat',
            phone: '02652421594',
            totalBeds: 30,
            occupiedBeds: 23,
            waitTime: 20,
            location: {
                latitude: userLocation[0] + 0.01,
                longitude: userLocation[1] - 0.007
            }
        },
        'hospital-4': {
            name: 'Sunshine Global Hospital',
            address: 'nr. Shreyas Vidhyalay, behind ICICI Bank, Lalbaug, Manjalpur, Vadodara, Gujarat 390011',
            phone: '08469122777',
            totalBeds: 120,
            occupiedBeds: 80,
            waitTime: 25,
            location: {
                latitude: userLocation[0] - 0.012,
                longitude: userLocation[1] - 0.01
            }
        }
    };
    
    // Save to Firebase
    database.ref('hospitals').set(hospitals)
        .then(() => {
            console.log('Demo hospitals created');
        })
        .catch((error) => {
            console.error('Error creating demo hospitals:', error);
        });
}

/**
 * Create demo ambulance data
 */
function createDemoAmbulances() {
    // Get user location as center point
    const userLocation = window.ambulanceMap ? window.ambulanceMap.userLocation : mapConfig.center;
    
    // Demo ambulance data
    const ambulances = {
        'ambulance-1': {
            id: 'AMB-001',
            type: 'type2',
            status: 'available',
            driver: 'Kamlesh',
            location: {
                latitude: userLocation[0] + 0.005,
                longitude: userLocation[1] - 0.003
            },
            lastUpdated: Date.now()
        },
        'ambulance-2': {
            id: 'AMB-002',
            type: 'type3',
            status: 'dispatched',
            driver: 'Ramlal',
            location: {
                latitude: userLocation[0] - 0.007,
                longitude: userLocation[1] + 0.004
            },
            lastUpdated: Date.now()
        },
        'ambulance-3': {
            id: 'AMB-003',
            type: 'type1',
            status: 'maintenance',
            driver: 'Shuresh',
            location: {
                latitude: userLocation[0] - 0.002,
                longitude: userLocation[1] - 0.009
            },
            lastUpdated: Date.now() - 3 * 60 * 60 * 1000 // 3 hours ago
        },
        'ambulance-4': {
            id: 'AMB-004',
            type: 'type2',
            status: 'available',
            driver: 'Chandan',
            location: {
                latitude: userLocation[0] + 0.009,
                longitude: userLocation[1] + 0.006
            },
            lastUpdated: Date.now()
        },
        'ambulance-5': {
            id: 'AMB-005',
            type: 'type2',
            status: 'available',
            driver: 'Davis',
            location: {
                latitude: userLocation[0] - 0.011,
                longitude: userLocation[1] - 0.005
            },
            lastUpdated: Date.now()
        }
    };
    
    // Save to Firebase
    database.ref('ambulances').set(ambulances)
        .then(() => {
            console.log('Demo ambulances created');
        })
        .catch((error) => {
            console.error('Error creating demo ambulances:', error);
        });
}

/**
 * Set up periodic data refresh
 */
function setupDataRefresh() {
    // Refresh data at regular intervals
    setInterval(() => {
        // Update ambulance positions
        updateAmbulancePositions();
        
        // Update hospital data
        updateHospitalData();
    }, systemSettings.refreshInterval);
}

/**
 * Update ambulance positions
 */
function updateAmbulancePositions() {
    // Get ambulances from Firebase
    database.ref('ambulances').once('value', (snapshot) => {
        const ambulances = snapshot.val() || {};
        
        // Update each ambulance
        Object.keys(ambulances).forEach(id => {
            const ambulance = ambulances[id];
            
            // Skip ambulances in maintenance
            if (ambulance.status === 'maintenance') return;
            
            // Simulate movement for available ambulances
            if (ambulance.status === 'available') {
                // Random movement within a small radius
                ambulance.location.latitude += (Math.random() - 0.5) * 0.001;
                ambulance.location.longitude += (Math.random() - 0.5) * 0.001;
            }
            
            // Update timestamp
            ambulance.lastUpdated = Date.now();
            
            // Save updated ambulance
            database.ref(`ambulances/${id}`).update({
                location: ambulance.location,
                lastUpdated: ambulance.lastUpdated
            });
        });
    });
}

/**
 * Update hospital data
 */
function updateHospitalData() {
    // Get hospitals from Firebase
    database.ref('hospitals').once('value', (snapshot) => {
        const hospitals = snapshot.val() || {};
        
        // Update each hospital
        Object.keys(hospitals).forEach(id => {
            const hospital = hospitals[id];
            
            // Simulate changes in bed occupancy and wait times
            const bedChange = Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0;
            const waitChange = Math.random() > 0.7 ? Math.floor(Math.random() * 5) - 2 : 0;
            
            // Update bed count
            hospital.occupiedBeds = Math.max(0, Math.min(hospital.totalBeds, hospital.occupiedBeds + bedChange));
            
            // Update wait time
            hospital.waitTime = Math.max(0, hospital.waitTime + waitChange);
            
            // Save updated hospital
            database.ref(`hospitals/${id}`).update({
                occupiedBeds: hospital.occupiedBeds,
                waitTime: hospital.waitTime
            });
        });
    });
}

/**
 * Handle page visibility changes
 */
function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
        // Page is visible, refresh data
        if (window.ambulanceMap) {
            window.ambulanceMap.refreshMap();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Handle page visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange); 