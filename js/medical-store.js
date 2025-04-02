// Initialize variables
let userLocation = null;
let medicalStores = [];

// Store database with detailed information
const storeDatabase = {
    'store-1': {
        id: 'store-1',
        name: 'MedPlus Pharmacy',
        logo: 'https://i.ibb.co/k4LNSH4/medplus-logo.png',
        address: 'Race Course Road, Vadodara',
        fullAddress: 'Shop No. 101, Race Course Complex, Race Course Road, Vadodara - 390007',
        description: 'MedPlus Pharmacy is a leading retail pharmacy chain in India, offering a wide range of medicines, health products, and personal care items.',
        open24x7: true,
        openingHours: '24/7',
        phone: '(0265) 2222222',
        rating: 4.8,
        distance: 0.5,
        location: {
            lat: 22.312914,
            lng: 73.181364
        },
        availableMedicines: [
            'Paracetamol',
            'Amoxicillin',
            'Omeprazole',
            'Cetirizine',
            'Metformin'
        ],
        paymentMethods: [
            'Cash',
            'UPI',
            'Credit Card',
            'Debit Card'
        ]
    },
    'store-2': {
        id: 'store-2',
        name: 'Apollo Pharmacy',
        logo: 'https://i.ibb.co/9rFvBPr/apollo-pharmacy-logo.png',
        address: 'Gotri Road, Vadodara',
        fullAddress: 'Shop No. 15, Gotri Complex, Gotri Road, Vadodara - 390021',
        description: 'Apollo Pharmacy is part of the Apollo Hospitals Group, providing high-quality medicines and healthcare products.',
        open24x7: false,
        openingHours: '7:00 AM - 11:00 PM',
        phone: '(0265) 3333333',
        rating: 4.6,
        distance: 0.8,
        location: {
            lat: 22.330912,
            lng: 73.150624
        },
        availableMedicines: [
            'Paracetamol',
            'Amoxicillin',
            'Metformin',
            'Cetirizine',
            'Aspirin'
        ],
        paymentMethods: [
            'Cash',
            'UPI',
            'Credit Card',
            'Debit Card'
        ]
    },
    'store-3': {
        id: 'store-3',
        name: 'LifeCare Pharmacy',
        logo: 'https://i.ibb.co/DKLXLsb/lifecare-logo.png',
        address: 'Alkapuri, Vadodara',
        fullAddress: 'Shop No. 25, Alkapuri Shopping Complex, Alkapuri, Vadodara - 390007',
        description: 'LifeCare Pharmacy is committed to providing quality healthcare products and services.',
        open24x7: true,
        openingHours: '24/7',
        phone: '(0265) 4444444',
        rating: 4.7,
        distance: 1.2,
        location: {
            lat: 22.302516,
            lng: 73.188547
        },
        availableMedicines: [
            'Paracetamol',
            'Omeprazole',
            'Cetirizine',
            'Aspirin',
            'Ibuprofen'
        ],
        paymentMethods: [
            'Cash',
            'UPI',
            'Credit Card',
            'Debit Card'
        ]
    },
    'store-4': {
        id: 'store-4',
        name: 'HealthCare Pharmacy',
        logo: 'https://i.ibb.co/DKxNbBj/healthcare-logo.png',
        address: 'Sayajigunj, Vadodara',
        fullAddress: 'Shop No. 12, Sayajigunj Market, Sayajigunj, Vadodara - 390005',
        description: 'HealthCare Pharmacy is your trusted partner in health and wellness.',
        open24x7: false,
        openingHours: '8:00 AM - 10:00 PM',
        phone: '(0265) 5555555',
        rating: 4.5,
        distance: 1.5,
        location: {
            lat: 22.318645,
            lng: 73.195874
        },
        availableMedicines: [
            'Paracetamol',
            'Amoxicillin',
            'Metformin',
            'Cetirizine',
            'Vitamin C'
        ],
        paymentMethods: [
            'Cash',
            'UPI',
            'Credit Card',
            'Debit Card'
        ]
    },
    'store-5': {
        id: 'store-5',
        name: 'MediCare Pharmacy',
        logo: 'https://i.ibb.co/pzCJtRj/medicare-logo.png',
        address: 'Akota, Vadodara',
        fullAddress: 'Shop No. 8, Akota Shopping Complex, Akota, Vadodara - 390020',
        description: 'MediCare Pharmacy is dedicated to providing quality healthcare products and services.',
        open24x7: true,
        openingHours: '24/7',
        phone: '(0265) 6666666',
        rating: 4.4,
        distance: 1.8,
        location: {
            lat: 22.293742,
            lng: 73.164258
        },
        availableMedicines: [
            'Paracetamol',
            'Omeprazole',
            'Cetirizine',
            'Aspirin',
            'Multivitamins'
        ],
        paymentMethods: [
            'Cash',
            'UPI',
            'Credit Card',
            'Debit Card'
        ]
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Medical store script loaded');
    
    // Create array of stores from database
    medicalStores = Object.values(storeDatabase);
    
    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Update distances
                updateDistances();
                
                // Add event listeners
                addEventListeners();
            },
            error => {
                console.error('Error getting location:', error);
                // Still add event listeners with default distances
                addEventListeners();
            }
        );
    } else {
        // Still add event listeners with default distances
        addEventListeners();
    }
});

// Update distances based on user location
function updateDistances() {
    if (!userLocation) return;
    
    for (let store of medicalStores) {
        store.distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            store.location.lat,
            store.location.lng
        );
        
        // Update distance display in UI
        const distanceElement = document.querySelector(`#${store.id} .store-detail-item:nth-child(2) span`);
        if (distanceElement) {
            distanceElement.textContent = `${store.distance.toFixed(1)} km away`;
        }
    }
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(degrees) {
    return degrees * (Math.PI/180);
}

// Add event listeners to buttons
function addEventListeners() {
    // View Route buttons
    document.querySelectorAll('.view-route-btn').forEach(button => {
        button.addEventListener('click', function() {
            const storeId = this.closest('.store-card').id || this.getAttribute('data-store-id');
            const store = storeDatabase[storeId];
            
            if (!store) {
                console.error('Store not found:', storeId);
                return;
            }
            
            if (userLocation) {
                // Open store profile page with route parameter
                window.location.href = `store-profile.html?id=${storeId}&showRoute=true`;
            } else {
                if (confirm('Location access is required to view the route. Would you like to enable location access?')) {
                    // Try getting location again
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            userLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            
                            // Open store profile page with route parameter
                            window.location.href = `store-profile.html?id=${storeId}&showRoute=true`;
                        },
                        error => {
                            console.error('Error getting location:', error);
                            alert('Could not access your location. Please enable location services in your browser settings.');
                            
                            // Still open the store profile page
                            window.location.href = `store-profile.html?id=${storeId}`;
                        }
                    );
                } else {
                    // Just open the store profile page
                    window.location.href = `store-profile.html?id=${storeId}`;
                }
            }
        });
    });
    
    // Call buttons
    document.querySelectorAll('.call-store-btn').forEach(button => {
        button.addEventListener('click', function() {
            const storeId = this.closest('.store-card').id;
            const phoneNumber = this.getAttribute('data-phone') || storeDatabase[storeId].phone;
            
            if (phoneNumber) {
                if (confirm(`Would you like to call ${storeDatabase[storeId].name} at ${phoneNumber}?`)) {
                    // Use tel: protocol to initiate call
                    window.location.href = `tel:${phoneNumber.replace(/[^0-9+]/g, '')}`;
                }
            } else {
                console.error('Phone number not found');
            }
        });
    });
    
    // Sort dropdown
    const sortSelect = document.getElementById('sort-stores');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const storeCards = Array.from(document.querySelectorAll('.store-card'));
            const storeContainer = document.querySelector('.medical-store-section');
            
            // Sort store cards
            storeCards.sort((a, b) => {
                const storeA = storeDatabase[a.id];
                const storeB = storeDatabase[b.id];
                
                if (sortValue === 'distance') {
                    return storeA.distance - storeB.distance;
                } else if (sortValue === 'rating') {
                    return storeB.rating - storeA.rating;
                } else if (sortValue === 'open') {
                    if (storeA.open24x7 && !storeB.open24x7) return -1;
                    if (!storeA.open24x7 && storeB.open24x7) return 1;
                    return storeA.distance - storeB.distance;
                }
                
                return 0;
            });
            
            // Re-append sorted cards
            storeCards.forEach(card => {
                storeContainer.appendChild(card);
            });
        });
    }
    
    // Refresh button
    const refreshButton = document.getElementById('refresh-stores');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        
                        updateDistances();
                        
                        // Re-sort if sorted by distance
                        const sortSelect = document.getElementById('sort-stores');
                        if (sortSelect && sortSelect.value === 'distance') {
                            sortSelect.dispatchEvent(new Event('change'));
                        }
                        
                        alert('Store distances have been updated with your current location.');
                    },
                    error => {
                        console.error('Error refreshing location:', error);
                        alert('Could not update your location. Please check your location settings.');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        });
    }
}
