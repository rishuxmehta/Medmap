// Get store ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const storeId = urlParams.get('id');
const showRouteParam = urlParams.get('showRoute');

// Initialize map
let map;
let userMarker;
let storeMarker;
let userLocation = null;
let directionsLayer = null;

// Real store locations in Vadodara
const storeDatabase = {
    'store-1': {
        name: 'MedPlus Pharmacy',
        logo: 'https://i.ibb.co/k4LNSH4/medplus-logo.png',
        address: 'Shop No. 101, Race Course Complex, Race Course Road, Vadodara - 390007',
        description: 'MedPlus Pharmacy is a leading retail pharmacy chain in India, offering a wide range of medicines, health products, and personal care items. We provide 24/7 service with experienced pharmacists and competitive prices.',
        open24x7: true,
        openingHours: '24/7',
        phone: '(0265) 2222222',
        rating: 4.8,
        location: {
            lat: 22.312914,
            lng: 73.181364
        },
        availableMedicines: [
            'Paracetamol',
            'Amoxicillin',
            'Omeprazole',
            'Cetirizine',
            'Metformin',
            'Aspirin',
            'Ibuprofen',
            'Vitamin C',
            'Multivitamins',
            'Antacids'
        ],
        paymentMethods: [
            'Cash',
            'UPI',
            'Credit Card',
            'Debit Card',
            'Net Banking'
        ],
        specialties: [
            '24/7 Service',
            'Prescription Medicines',
            'OTC Medicines',
            'Health Products',
            'Personal Care',
            'Medical Devices'
        ],
        facilities: [
            'Free Home Delivery',
            'Prescription Management',
            'Medicine Reminders',
            'Health Check-ups',
            'Consultation Services'
        ]
    },
    'store-2': {
        name: 'Apollo Pharmacy',
        logo: 'https://i.ibb.co/9rFvBPr/apollo-pharmacy-logo.png',
        address: 'Shop No. 15, Gotri Complex, Gotri Road, Vadodara - 390021',
        description: 'Apollo Pharmacy is part of the Apollo Hospitals Group, providing high-quality medicines and healthcare products. Our store is equipped with modern facilities and staffed by qualified pharmacists.',
        open24x7: false,
        openingHours: '7:00 AM - 11:00 PM',
        phone: '(0265) 3333333',
        rating: 4.6,
        location: {
            lat: 22.330912,
            lng: 73.150624
        },
        availableMedicines: [
            'Paracetamol',
            'Amoxicillin',
            'Metformin',
            'Cetirizine',
            'Antibiotics',
            'Pain Relievers',
            'Diabetes Medicines',
            'Blood Pressure Medicines',
            'Heart Medicines',
            'Allergy Medicines'
        ],
        paymentMethods: [
            'Cash',
            'UPI',
            'Credit Card',
            'Debit Card',
            'Net Banking',
            'Insurance'
        ],
        specialties: [
            'Prescription Medicines',
            'OTC Medicines',
            'Health Products',
            'Medical Devices',
            'Ayurvedic Products',
            'Homeopathy'
        ],
        facilities: [
            'Home Delivery',
            'Prescription Management',
            'Medicine Reminders',
            'Health Check-ups',
            'Consultation Services',
            'Insurance Claims'
        ]
    },
    'store-3': {
        name: 'LifeCare Pharmacy',
        logo: 'https://i.ibb.co/DKLXLsb/lifecare-logo.png',
        address: 'Shop No. 25, Alkapuri Shopping Complex, Alkapuri, Vadodara - 390007',
        description: 'LifeCare Pharmacy is committed to providing quality healthcare products and services. We offer a wide range of medicines, health products, and personal care items with expert guidance.',
        open24x7: true,
        openingHours: '24/7',
        phone: '(0265) 4444444',
        rating: 4.7,
        location: {
            lat: 22.302516,
            lng: 73.188547
        },
        availableMedicines: [
            'Paracetamol',
            'Omeprazole',
            'Cetirizine',
            'Aspirin',
            'Ibuprofen',
            'Vitamin C',
            'Multivitamins',
            'Antacids',
            'Cold Medicines',
            'Cough Syrups'
        ],
        paymentMethods: [
            'Cash',
            'UPI',
            'Credit Card',
            'Debit Card',
            'Net Banking',
            'Insurance'
        ],
        specialties: [
            '24/7 Service',
            'Prescription Medicines',
            'OTC Medicines',
            'Health Products',
            'Personal Care',
            'Medical Devices'
        ],
        facilities: [
            'Free Home Delivery',
            'Prescription Management',
            'Medicine Reminders',
            'Health Check-ups',
            'Consultation Services',
            'Insurance Claims'
        ]
    },
    'store-4': {
        name: 'HealthCare Pharmacy',
        logo: 'https://i.ibb.co/DKxNbBj/healthcare-logo.png',
        address: 'Shop No. 12, Sayajigunj Market, Sayajigunj, Vadodara - 390005',
        description: 'HealthCare Pharmacy is your trusted partner in health and wellness. We provide quality medicines, health products, and expert advice to help you maintain good health.',
        open24x7: false,
        openingHours: '8:00 AM - 10:00 PM',
        phone: '(0265) 5555555',
        rating: 4.5,
        location: {
            lat: 22.318645,
            lng: 73.195874
        },
        availableMedicines: [
            'Paracetamol',
            'Amoxicillin',
            'Metformin',
            'Cetirizine',
            'Antibiotics',
            'Pain Relievers',
            'Diabetes Medicines',
            'Blood Pressure Medicines',
            'Heart Medicines',
            'Allergy Medicines'
        ],
        paymentMethods: [
            'Cash',
            'UPI',
            'Credit Card',
            'Debit Card',
            'Net Banking'
        ],
        specialties: [
            'Prescription Medicines',
            'OTC Medicines',
            'Health Products',
            'Medical Devices',
            'Ayurvedic Products'
        ],
        facilities: [
            'Home Delivery',
            'Prescription Management',
            'Medicine Reminders',
            'Health Check-ups',
            'Consultation Services'
        ]
    },
    'store-5': {
        name: 'MediCare Pharmacy',
        logo: 'https://i.ibb.co/pzCJtRj/medicare-logo.png',
        address: 'Shop No. 8, Akota Shopping Complex, Akota, Vadodara - 390020',
        description: 'MediCare Pharmacy is dedicated to providing quality healthcare products and services. We offer a comprehensive range of medicines and health products with professional guidance.',
        open24x7: true,
        openingHours: '24/7',
        phone: '(0265) 6666666',
        rating: 4.4,
        location: {
            lat: 22.293742,
            lng: 73.164258
        },
        availableMedicines: [
            'Paracetamol',
            'Omeprazole',
            'Cetirizine',
            'Aspirin',
            'Ibuprofen',
            'Vitamin C',
            'Multivitamins',
            'Antacids',
            'Cold Medicines',
            'Cough Syrups'
        ],
        paymentMethods: [
            'Cash',
            'UPI',
            'Credit Card',
            'Debit Card',
            'Net Banking',
            'Insurance'
        ],
        specialties: [
            '24/7 Service',
            'Prescription Medicines',
            'OTC Medicines',
            'Health Products',
            'Personal Care',
            'Medical Devices'
        ],
        facilities: [
            'Free Home Delivery',
            'Prescription Management',
            'Medicine Reminders',
            'Health Check-ups',
            'Consultation Services',
            'Insurance Claims'
        ]
    }
};

function initMap() {
    // Initialize map centered on Vadodara
    map = L.map('store-map').setView([22.3072, 73.1812], 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create custom icons
    const userIcon = L.divIcon({
        className: 'user-marker',
        html: '<i class="fas fa-user" style="font-size: 20px; color: #ff4757; background-color: white; padding: 5px; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const storeIcon = L.divIcon({
        className: 'store-marker',
        html: '<i class="fas fa-clinic-medical" style="font-size: 20px; color: #1976d2; background-color: white; padding: 5px; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Add user marker
                userMarker = L.marker([userLocation.lat, userLocation.lng], {
                    icon: userIcon
                }).addTo(map);

                userMarker.bindPopup("Your Location").openPopup();

                // Reverse geocode to get address
                getAddressFromCoordinates(userLocation.lat, userLocation.lng);

                // Load store data and update UI
                loadStoreData();
            },
            error => {
                console.error('Error getting location:', error);
                // Fall back to a default location (Vadodara city center)
                userLocation = {
                    lat: 22.3072,
                    lng: 73.1812
                };
                
                userMarker = L.marker([userLocation.lat, userLocation.lng], {
                    icon: userIcon
                }).addTo(map);
                
                userMarker.bindPopup("Default Location (Vadodara City Center)").openPopup();
                
                // Display error message
                showLocationError(error.message);
                
                // Still load store data
                loadStoreData();
            },
            { 
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        showError('Geolocation is not supported by your browser');
        
        // Fall back to default location
        userLocation = {
            lat: 22.3072,
            lng: 73.1812
        };
        
        userMarker = L.marker([userLocation.lat, userLocation.lng], {
            icon: userIcon
        }).addTo(map);
        
        userMarker.bindPopup("Default Location (Vadodara City Center)").openPopup();
        
        loadStoreData();
    }
}

function getAddressFromCoordinates(lat, lng) {
    // Use OpenStreetMap Nominatim for reverse geocoding
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.display_name) {
                // Update user marker popup with address
                userMarker.bindPopup(
                    `<strong>Your Location</strong><br>${data.display_name}`
                ).openPopup();
                
                // Add info to page
                const locationInfo = document.createElement('div');
                locationInfo.className = 'location-info';
                locationInfo.innerHTML = `
                    <h2 class="section-title">Your Current Location</h2>
                    <p><i class="fas fa-map-marker-alt"></i> ${data.display_name}</p>
                `;
                
                // Insert after header
                const header = document.querySelector('.store-profile-header');
                header.parentNode.insertBefore(locationInfo, header.nextSibling);
            }
        })
        .catch(error => {
            console.error('Error reverse geocoding:', error);
        });
}

function loadStoreData() {
    // Find store in storeDatabase
    const store = storeDatabase[storeId];
    if (!store) {
        showError('Store not found');
        return;
    }

    // Calculate distance
    let distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng,
        store.location.lat,
        store.location.lng
    );
    
    // Update store information
    document.getElementById('store-name').textContent = store.name;
    document.getElementById('store-address').textContent = store.address;
    document.getElementById('store-hours').textContent = store.open24x7 ? '24/7' : store.openingHours;
    document.getElementById('store-distance').textContent = `${distance.toFixed(1)} km`;
    document.getElementById('store-phone').textContent = store.phone;
    document.getElementById('store-rating').textContent = `${store.rating}/5`;
    document.getElementById('store-description').textContent = store.description;

    // Update store logo
    const storeLogoContainer = document.querySelector('.store-profile-image');
    if (store.logo) {
        storeLogoContainer.innerHTML = `<img src="${store.logo}" alt="${store.name} Logo" style="width: 100%; height: 100%; object-fit: contain;">`;
    }

    // Update contact information
    document.getElementById('contact-phone').textContent = store.phone;
    document.getElementById('contact-address').textContent = store.address;
    document.getElementById('contact-hours').textContent = store.open24x7 ? 'Open 24/7' : store.openingHours;
    document.getElementById('contact-rating').textContent = `${store.rating}/5`;

    // Update payment methods
    const paymentMethodsDiv = document.getElementById('payment-methods');
    paymentMethodsDiv.innerHTML = store.paymentMethods
        .map(method => `<span class="payment-method">${method}</span>`)
        .join('');

    // Update available medicines
    const medicinesDiv = document.getElementById('store-medicines');
    medicinesDiv.innerHTML = store.availableMedicines
        .map(medicine => `
            <div class="medicine-item">
                <h4>${medicine}</h4>
                <p>Available at this store</p>
            </div>
        `)
        .join('');

    // Add specialties section if not already added
    if (!document.querySelector('.specialties-list')) {
        const specialtiesSection = document.createElement('div');
        specialtiesSection.innerHTML = `
            <h2 class="section-title">Specialties</h2>
            <div class="specialties-list">
                ${store.specialties.map(specialty => `
                    <span class="specialty-tag">${specialty}</span>
                `).join('')}
            </div>
        `;
        
        // Find an insertion point
        const locationsTitle = Array.from(document.querySelectorAll('.section-title')).find(el => el.textContent === 'Location');
        if (locationsTitle) {
            document.querySelector('.store-profile-main').insertBefore(
                specialtiesSection,
                locationsTitle.parentElement
            );
        } else {
            document.querySelector('.store-profile-main').appendChild(specialtiesSection);
        }
    }

    // Add facilities section if not already added
    if (!document.querySelector('.facilities-list')) {
        const facilitiesSection = document.createElement('div');
        facilitiesSection.innerHTML = `
            <h2 class="section-title">Facilities</h2>
            <ul class="facilities-list" style="list-style: none; padding: 0;">
                ${store.facilities.map(facility => `
                    <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #1976d2; margin-right: 8px;"></i> ${facility}</li>
                `).join('')}
            </ul>
        `;
        
        // Find an insertion point
        const locationsTitle = Array.from(document.querySelectorAll('.section-title')).find(el => el.textContent === 'Location');
        if (locationsTitle) {
            document.querySelector('.store-profile-main').insertBefore(
                facilitiesSection,
                locationsTitle.parentElement
            );
        } else {
            document.querySelector('.store-profile-main').appendChild(facilitiesSection);
        }
    }

    // Add store marker to map
    if (storeMarker) {
        storeMarker.remove();
    }
    
    // Create custom store icon
    const storeIcon = L.divIcon({
        className: 'store-marker',
        html: '<i class="fas fa-clinic-medical" style="font-size: 20px; color: #1976d2; background-color: white; padding: 5px; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    storeMarker = L.marker([store.location.lat, store.location.lng], {
        icon: storeIcon
    }).addTo(map);

    // Add store popup with more details
    storeMarker.bindPopup(`
        <div class="store-popup">
            <h3>${store.name}</h3>
            <p>${store.address}</p>
            <p><i class="fas fa-clock"></i> ${store.open24x7 ? 'Open 24/7' : `Hours: ${store.openingHours}`}</p>
            <p><i class="fas fa-phone"></i> ${store.phone}</p>
            <p><i class="fas fa-star"></i> ${store.rating}/5</p>
            <p><i class="fas fa-route"></i> ${distance.toFixed(1)} km from your location</p>
        </div>
    `);

    // Fit map to show both markers
    if (userMarker) {
        const bounds = L.latLngBounds([
            userMarker.getLatLng(),
            storeMarker.getLatLng()
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });
    } else {
        map.setView([store.location.lat, store.location.lng], 15);
    }

    // Add event listeners
    addEventListeners(store);
}

function addEventListeners(store) {
    // View Route button
    document.getElementById('view-route').addEventListener('click', () => {
        if (userLocation) {
            showRouteWithOSRM(userLocation, store.location, store.name);
        } else {
            alert('Please enable location services to view the route.');
        }
    });

    // Call button
    document.getElementById('call-store').addEventListener('click', () => {
        if (confirm(`Would you like to call ${store.name} at ${store.phone}?`)) {
            window.location.href = `tel:${store.phone.replace(/[^0-9+]/g, '')}`;
        }
    });
}

// Show route using OSRM API
function showRouteWithOSRM(start, end, storeName) {
    // Clear existing routes
    if (directionsLayer) {
        map.removeLayer(directionsLayer);
    }

    // Show loading indicator
    const loadingPopup = L.popup()
        .setLatLng([start.lat, start.lng])
        .setContent('<div class="loading-popup">Loading route...</div>')
        .openOn(map);

    // Make a request to the OSRM API
    fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`)
        .then(response => response.json())
        .then(data => {
            // Close loading popup
            map.closePopup(loadingPopup);

            if (data.code !== 'Ok') {
                throw new Error('Unable to find route');
            }

            const route = data.routes[0];
            const coordinates = route.geometry.coordinates;
            
            // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
            const latLngs = coordinates.map(coord => [coord[1], coord[0]]);
            
            // Create a polyline for the route
            directionsLayer = L.polyline(latLngs, {
                color: '#1976d2',
                weight: 5,
                opacity: 0.8
            }).addTo(map);

            // Calculate distance in km
            const distanceInKm = route.distance / 1000;
            
            // Calculate duration in minutes
            const durationInMinutes = Math.round(route.duration / 60);
            
            // Create a popup with route information
            const routePopup = L.popup()
                .setLatLng(latLngs[Math.floor(latLngs.length / 2)])
                .setContent(`
                    <div class="route-info">
                        <h4>Route to ${storeName}</h4>
                        <p><i class="fas fa-road"></i> Distance: ${distanceInKm.toFixed(1)} km</p>
                        <p><i class="fas fa-clock"></i> Estimated Time: ${durationInMinutes} minutes</p>
                        <p><i class="fas fa-car"></i> Mode: Driving</p>
                    </div>
                `)
                .openOn(map);
            
            // Fit map to show entire route
            map.fitBounds(directionsLayer.getBounds(), { padding: [50, 50] });
            
        })
        .catch(error => {
            // Close loading popup
            map.closePopup(loadingPopup);
            
            console.error('Error getting route:', error);
            
            // Fallback to direct route if OSRM fails
            showDirectRoute(start, end, storeName);
        });
}

// Fallback to direct route if OSRM fails
function showDirectRoute(start, end, storeName) {
    if (directionsLayer) {
        map.removeLayer(directionsLayer);
    }
    
    // Create a simple straight line between points
    directionsLayer = L.polyline([
        [start.lat, start.lng],
        [end.lat, end.lng]
    ], {
        color: '#ff4757',
        weight: 3,
        dashArray: '5, 10',
        opacity: 0.7
    }).addTo(map);
    
    // Calculate straight-line distance
    const distance = calculateDistance(start.lat, start.lng, end.lat, end.lng);
    
    // Estimate time (rough estimate, 3 minutes per km)
    const estimatedTime = Math.round(distance * 3);
    
    // Create popup with route info
    L.popup()
        .setLatLng([
            (start.lat + end.lat) / 2,
            (start.lng + end.lng) / 2
        ])
        .setContent(`
            <div class="route-info">
                <h4>Route to ${storeName}</h4>
                <p><i class="fas fa-road"></i> Distance: ${distance.toFixed(1)} km (straight line)</p>
                <p><i class="fas fa-clock"></i> Estimated Time: ${estimatedTime} minutes (approximate)</p>
                <p><i class="fas fa-exclamation-triangle"></i> Note: Using direct route as road data is unavailable</p>
            </div>
        `)
        .openOn(map);
    
    // Fit map to show entire route
    map.fitBounds(directionsLayer.getBounds(), { padding: [50, 50] });
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

// Show location error message
function showLocationError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'location-error';
    errorDiv.innerHTML = `
        <div class="alert" style="background-color: #ffe6e6; color: #ff4757; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ff4757;">
            <h4 style="margin-top: 0;"><i class="fas fa-exclamation-circle"></i> Location Access Error</h4>
            <p>${message}</p>
            <p>Using default location. Distances may not be accurate.</p>
        </div>
    `;
    
    // Insert after header
    const header = document.querySelector('.store-profile-header');
    header.parentNode.insertBefore(errorDiv, header.nextSibling);
}

// Show error message
function showError(message) {
    const container = document.querySelector('.store-profile-container');
    container.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 50px 0;">
            <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #ff4757; margin-bottom: 20px;"></i>
            <h2>Error</h2>
            <p>${message}</p>
            <a href="medical-store.html" class="back-button" style="display: inline-block; padding: 10px 20px; background: #1976d2; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Back to Medical Stores</a>
        </div>
    `;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!storeId) {
        showError('No store ID provided');
        return;
    }
    initMap();
    
    // Check if we should automatically show the route
    if (showRouteParam === 'true') {
        // We need to wait for the map and store data to be loaded
        const checkReady = setInterval(() => {
            if (userLocation && storeMarker) {
                clearInterval(checkReady);
                // Get store data
                const store = storeDatabase[storeId];
                if (store) {
                    // Show route after a short delay to ensure map is ready
                    setTimeout(() => {
                        showRouteWithOSRM(userLocation, store.location, store.name);
                    }, 1000);
                }
            }
        }, 100);
    }
}); 