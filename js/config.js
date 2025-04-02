/**
 * Smart Ambulance Routing System
 * Configuration File
 */

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Map Configuration
const mapConfig = {
    center: [40.7128, -74.0060], // Default center (New York City)
    zoom: 13,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Ambulance Types
const ambulanceTypes = {
    type1: "Type I - Basic Life Support",
    type2: "Type II - Advanced Life Support",
    type3: "Type III - Mobile Intensive Care Unit"
};

// Emergency Types
const emergencyTypes = {
    cardiac: {
        name: "Cardiac Arrest",
        priority: "high",
        description: "Patient experiencing cardiac arrest or severe heart-related issues"
    },
    trauma: {
        name: "Trauma/Accident",
        priority: "high",
        description: "Patient with severe injuries from accident or trauma"
    },
    respiratory: {
        name: "Respiratory Distress",
        priority: "medium",
        description: "Patient experiencing difficulty breathing or respiratory issues"
    },
    stroke: {
        name: "Stroke",
        priority: "high",
        description: "Patient showing signs of stroke"
    },
    other: {
        name: "Other Medical Emergency",
        priority: "medium",
        description: "Other medical emergency requiring ambulance services"
    }
};

// Hospital Status Thresholds
const hospitalStatusThresholds = {
    full: 90, // 90% or more capacity is considered full
    warning: 70, // 70% or more capacity is considered warning
    available: 0 // 0% or more capacity is considered available
};

// Route Optimization Parameters
const routeOptimizationParams = {
    considerTraffic: true,
    avoidTolls: false,
    avoidHighways: false,
    optimizeFor: "time" // "time" or "distance"
};

// System Settings
const systemSettings = {
    refreshInterval: 30000, // Refresh data every 30 seconds
    locationUpdateInterval: 10000, // Update ambulance locations every 10 seconds
    maxEmergencyAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    defaultRadius: 10, // Default search radius in kilometers
    maxHospitalsToShow: 5 // Maximum number of hospitals to show in the list
};

// Export configurations
const config = {
    firebase: firebaseConfig,
    map: mapConfig,
    ambulanceTypes,
    emergencyTypes,
    hospitalStatusThresholds,
    routeOptimizationParams,
    systemSettings
}; 