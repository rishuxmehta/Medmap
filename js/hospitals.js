/**
 * Smart Ambulance Routing System
 * Hospital Functionality
 */

/**
 * Update the hospital list in the UI
 * @param {Object} hospitals - Hospital data from Firebase
 */
function updateHospitalList(hospitals) {
    const hospitalListElement = document.getElementById('hospital-list');
    if (!hospitalListElement) return;

    // Clear existing hospital cards
    hospitalListElement.innerHTML = '';

    // Get user location for distance calculation
    const userLocation = window.ambulanceMap ? window.ambulanceMap.userLocation : null;

    // Check if there are admin-added hospitals in localStorage
    const adminHospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
    
    let hospitalArray = [];
    
    if (adminHospitals.length > 0) {
        // Use admin-added hospitals from localStorage
        hospitalArray = adminHospitals.map(hospital => {
            // Calculate distance if user location is available
            if (userLocation && hospital.location) {
                hospital.distance = calculateDistance(
                    userLocation[0], userLocation[1],
                    hospital.location.lat, hospital.location.lng
                );
            } else {
                hospital.distance = Infinity;
            }
            
            // Map properties to match expected format
            return {
                id: hospital.id,
                name: hospital.name,
                address: hospital.address,
                phone: hospital.phone,
                waitTime: hospital.waitTime,
                totalBeds: hospital.beds.total,
                occupiedBeds: hospital.beds.total - hospital.beds.available,
                distance: hospital.distance,
                location: {
                    latitude: hospital.location.lat,
                    longitude: hospital.location.lng
                },
                specialties: hospital.specialties || [],
                emergency: hospital.emergency || false
            };
        });
    } else {
        // Use Firebase hospitals or default to static data
        hospitalArray = Object.keys(hospitals).map(id => {
            const hospital = hospitals[id];
            hospital.id = id;
            
            // Calculate distance if user location is available
            if (userLocation && hospital.location) {
                hospital.distance = calculateDistance(
                    userLocation[0], userLocation[1],
                    hospital.location.latitude, hospital.location.longitude
                );
            } else {
                hospital.distance = Infinity;
            }
            
            return hospital;
        });
        
        // If no Firebase hospitals, add some default ones based on user location
        if (hospitalArray.length === 0 && userLocation) {
            hospitalArray = createDefaultHospitals(userLocation);
        }
    }

    // Get sort preference
    const sortSelect = document.getElementById('sort-hospitals');
    const sortBy = sortSelect ? sortSelect.value : 'distance';

    // Sort hospitals based on selected criteria
    sortHospitals(hospitalArray, sortBy);

    // Limit to max hospitals to show
    const maxHospitals = window.systemSettings?.maxHospitalsToShow || 10;
    const hospitalsToShow = hospitalArray.slice(0, maxHospitals);

    // Create hospital cards
    hospitalsToShow.forEach((hospital, index) => {
        const hospitalCard = createHospitalCard(hospital, index);
        hospitalListElement.appendChild(hospitalCard);
    });

    // Add event listeners to hospital cards
    addHospitalCardEventListeners();
}

/**
 * Create default hospitals based on user location
 * @param {Array} userLocation - [latitude, longitude]
 * @returns {Array} - Array of hospital objects
 */
function createDefaultHospitals(userLocation) {
    const defaultHospitals = [
        {
            id: 'hospital-1',
            name: 'SSG Hospital',
            address: 'Jail Road, Raopura, Vadodara, Gujarat',
            phone: '(0265) 2423400',
            waitTime: 15,
            totalBeds: 40,
            occupiedBeds: 34,
            location: {
                latitude: userLocation[0] + 0.005,
                longitude: userLocation[1] + 0.003
            },
            specialties: ['General', 'Emergency', 'Surgery'],
            emergency: true
        },
        {
            id: 'hospital-2',
            name: 'Bhailal Amin General Hospital',
            address: 'GIDC Rd, Gorwa, Vadodara, Gujarat',
            phone: '(0265) 2355755',
            waitTime: 10,
            totalBeds: 35,
            occupiedBeds: 23,
            location: {
                latitude: userLocation[0] - 0.008,
                longitude: userLocation[1] + 0.006
            },
            specialties: ['General', 'Cardiology', 'Orthopedics'],
            emergency: true
        },
        {
            id: 'hospital-3',
            name: 'Baroda Medical College Hospital',
            address: 'Vinoba Bhave Road, Vadodara, Gujarat',
            phone: '(0265) 2413400',
            waitTime: 20,
            totalBeds: 50,
            occupiedBeds: 35,
            location: {
                latitude: userLocation[0] + 0.01,
                longitude: userLocation[1] - 0.007
            },
            specialties: ['General', 'Pediatrics', 'Neurology'],
            emergency: true
        },
        {
            id: 'hospital-4',
            name: 'Kailash Cancer Hospital',
            address: 'Race Course Road, Vadodara, Gujarat',
            phone: '(0265) 2354862',
            waitTime: 5,
            totalBeds: 30,
            occupiedBeds: 22,
            location: {
                latitude: userLocation[0] - 0.012,
                longitude: userLocation[1] - 0.01
            },
            specialties: ['Oncology', 'Radiation Therapy', 'Surgical Oncology'],
            emergency: false
        }
    ];
    
    // Calculate distances
    defaultHospitals.forEach(hospital => {
        hospital.distance = calculateDistance(
            userLocation[0], userLocation[1],
            hospital.location.latitude, hospital.location.longitude
        );
    });
    
    return defaultHospitals;
}

/**
 * Sort hospitals based on criteria
 * @param {Array} hospitals - Array of hospital objects
 * @param {string} sortBy - Sorting criteria ('distance', 'beds', or 'wait')
 */
function sortHospitals(hospitals, sortBy) {
    switch (sortBy) {
        case 'distance':
            hospitals.sort((a, b) => a.distance - b.distance);
            break;
        case 'beds':
            hospitals.sort((a, b) => {
                const aAvailable = a.totalBeds - a.occupiedBeds;
                const bAvailable = b.totalBeds - b.occupiedBeds;
                return bAvailable - aAvailable;
            });
            break;
        case 'wait':
            hospitals.sort((a, b) => a.waitTime - b.waitTime);
            break;
        default:
            hospitals.sort((a, b) => a.distance - b.distance);
    }
}

/**
 * Create a hospital card element
 * @param {Object} hospital - Hospital data
 * @param {number} index - Hospital index for numbering
 * @returns {HTMLElement} - Hospital card element
 */
function createHospitalCard(hospital, index) {
    const availableBeds = hospital.totalBeds - hospital.occupiedBeds;
    const capacityPercentage = (hospital.occupiedBeds / hospital.totalBeds) * 100;
    
    // Determine capacity status
    let capacityStatus = 'normal';
    if (capacityPercentage >= 90) {
        capacityStatus = 'danger';
    } else if (capacityPercentage >= 70) {
        capacityStatus = 'warning';
    }

    // Create card element
    const card = document.createElement('div');
    card.className = 'hospital-card';
    card.dataset.hospitalId = hospital.id;

    // Format distance
    const distanceText = hospital.distance !== Infinity 
        ? `${hospital.distance.toFixed(1)} km away` 
        : 'Distance unknown';

    // Format drive time (rough estimate - 3 mins per km)
    const driveTime = hospital.distance !== Infinity 
        ? `${Math.round(hospital.distance * 3)} mins` 
        : 'Unknown';

    card.innerHTML = `
        <div class="hospital-header">
            <div class="hospital-icon">
                <i class="fas fa-hospital"></i>
            </div>
            <div class="hospital-info">
                <h3>${index + 1}. ${hospital.name}</h3>
                <p>${hospital.address}</p>
            </div>
        </div>
        <div class="hospital-details">
            <div class="hospital-stat">
                <span class="hospital-stat-label">Distance:</span>
                <span class="hospital-stat-value">${distanceText}</span>
            </div>
            <div class="hospital-stat">
                <span class="hospital-stat-label">Drive Time:</span>
                <span class="hospital-stat-value">${driveTime}</span>
            </div>
            <div class="hospital-stat">
                <span class="hospital-stat-label">Wait Time:</span>
                <span class="hospital-stat-value">${hospital.waitTime} mins</span>
            </div>
            <div class="hospital-beds">
                <div class="beds-label">
                    <span>Available Beds:</span>
                    <span>${availableBeds}/${hospital.totalBeds}</span>
                </div>
                <div class="beds-progress">
                    <div class="beds-bar ${capacityStatus}" style="width: ${capacityPercentage}%"></div>
                </div>
            </div>
        </div>
        <div class="hospital-actions">
            <button class="view-route-btn" data-hospital-id="${hospital.id}">
                <i class="fas fa-route"></i> View Route
            </button>
            <button class="call-hospital-btn" data-phone="${hospital.phone}">
                <i class="fas fa-phone"></i> Call
            </button>
        </div>
    `;

    return card;
}

/**
 * Add event listeners to hospital card buttons
 */
function addHospitalCardEventListeners() {
    // View route buttons
    const viewRouteButtons = document.querySelectorAll('.view-route-btn');
    viewRouteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const hospitalId = e.target.dataset.hospitalId;
            viewHospitalRoute(hospitalId);
        });
    });

    // Call hospital buttons
    const callButtons = document.querySelectorAll('.call-hospital-btn');
    callButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const phone = e.target.dataset.phone;
            callHospital(phone);
        });
    });
}

/**
 * View route to a hospital
 * @param {string} hospitalId - Hospital ID
 */
function viewHospitalRoute(hospitalId) {
    // Check for admin-added hospitals in localStorage
    const adminHospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
    const adminHospital = adminHospitals.find(h => h.id === hospitalId);
    
    if (adminHospital) {
        // Get user location
        const userLocation = window.ambulanceMap ? window.ambulanceMap.userLocation : null;
        if (!userLocation) {
            alert('User location not available. Please allow location access.');
            return;
        }
        
        // Show route on map
        window.ambulanceMap.showRoute(
            userLocation,
            [adminHospital.location.lat, adminHospital.location.lng],
            adminHospital.name
        );
        
        // Scroll to map section
        const mapSection = document.querySelector('.map-section');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        return;
    }
    
    // For static hospital cards
    if (hospitalId.startsWith('hospital-')) {
        // Get user location as center point
        const userLocation = window.ambulanceMap ? window.ambulanceMap.userLocation : null;
        if (!userLocation) {
            alert('User location not available. Please allow location access.');
            return;
        }
        
        // Calculate nearby hospital locations based on user's location
        // These offsets will place hospitals within 0.8-2.2 km of the user
        const nearbyHospitals = {
            'hospital-1': {
                name: 'SSG Hospital',
                location: { 
                    latitude: userLocation[0] + 0.005, 
                    longitude: userLocation[1] + 0.003 
                }
            },
            'hospital-2': {
                name: 'Bhailal Amin General Hospital',
                location: { 
                    latitude: userLocation[0] - 0.008, 
                    longitude: userLocation[1] + 0.006 
                }
            },
            'hospital-3': {
                name: 'Baroda Medical College Hospital',
                location: { 
                    latitude: userLocation[0] + 0.01, 
                    longitude: userLocation[1] - 0.007 
                }
            },
            'hospital-4': {
                name: 'Sunshine Global Hospital',
                location: { 
                    latitude: userLocation[0] - 0.012, 
                    longitude: userLocation[1] - 0.01 
                }
            }
        };
        
        const hospital = nearbyHospitals[hospitalId];
        
        if (hospital && hospital.location) {
            // Show route on map
            window.ambulanceMap.showRoute(
                userLocation,
                [hospital.location.latitude, hospital.location.longitude],
                hospital.name
            );
            
            // Scroll to map section
            const mapSection = document.querySelector('.map-section');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            return;
        }
    }
    
    // For dynamic hospital cards from Firebase
    database.ref(`hospitals/${hospitalId}`).once('value', (snapshot) => {
        const hospital = snapshot.val();
        if (!hospital || !hospital.location) return;

        // Get user location
        const userLocation = window.ambulanceMap ? window.ambulanceMap.userLocation : null;
        if (!userLocation) {
            alert('User location not available. Please allow location access.');
            return;
        }

        // Show route on map
        window.ambulanceMap.showRoute(
            userLocation,
            [hospital.location.latitude, hospital.location.longitude],
            hospital.name
        );

        // Scroll to map section
        const mapSection = document.querySelector('.map-section');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

/**
 * Call a hospital
 * @param {string} phone - Hospital phone number
 */
function callHospital(phone) {
    // In a real application, this would integrate with a calling API
    // For this demo, we'll just open the tel: protocol
    window.location.href = `tel:${phone}`;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
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
    return distance;
}

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} - Radians
 */
function deg2rad(deg) {
    return deg * (Math.PI/180);
}

/**
 * Initialize hospital functionality
 */
function initHospitals() {
    // Add event listeners to hospital cards
    addHospitalCardEventListeners();
    
    // Set up sort select event listener
    const sortSelect = document.getElementById('sort-hospitals');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            // Get hospitals from Firebase and update list
            database.ref('hospitals').once('value', (snapshot) => {
                const hospitals = snapshot.val() || {};
                updateHospitalList(hospitals);
            });
        });
    }

    // Set up refresh button event listener
    const refreshButton = document.getElementById('refresh-hospitals');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            // Show refresh animation
            refreshButton.classList.add('refreshing');
            
            // Get fresh data from Firebase
            database.ref('hospitals').once('value', (snapshot) => {
                const hospitals = snapshot.val() || {};
                updateHospitalList(hospitals);
                
                // Remove refresh animation
                setTimeout(() => {
                    refreshButton.classList.remove('refreshing');
                }, 1000);
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initHospitals); 