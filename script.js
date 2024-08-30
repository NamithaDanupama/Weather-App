// Define your Weather API key
const API_KEY = '8a21eb247cec47a0b19140152242908';

// Fetch weather data using the Weather API
async function fetchWeather(location, unit = 'metric') {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&units=${unit}`);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Could not retrieve weather data. Please try again.');
    }
}

// Fetch forecast data
async function fetchForecast(location, unit = 'metric') {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3&units=${unit}`);
        const data = await response.json();
        displayForecast(data.forecast.forecastday);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        alert('Could not retrieve forecast data. Please try again.');
    }
}

// Fetch historical weather data
async function fetchHistorical(location) {
    try {
        // Use the appropriate endpoint and add a date range
        const response = await fetch(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${location}&dt=2023-08-01`);
        const data = await response.json();
        displayHistorical(data);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        alert('Could not retrieve historical data. Please try again.');
    }
}

// Display current weather data
function displayWeather(data) {
    const weatherDetails = document.getElementById('weatherDetails');
    weatherDetails.innerHTML = `
        <h2>Current Weather in ${data.location.name}, ${data.location.country}</h2>
        <p>Temperature: ${data.current.temp_c}°C (${data.current.temp_f}°F)</p>
        <p>Condition: ${data.current.condition.text}</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p>Wind Speed: ${data.current.wind_kph} km/h</p>
    `;
}

// Display weather forecast
function displayForecast(forecast) {
    const forecastDetails = document.getElementById('forecastDetails');
    let forecastHTML = `<h2>3-Day Forecast</h2>`;
    forecast.forEach(day => {
        forecastHTML += `
            <p>Date: ${day.date}</p>
            <p>Max Temp: ${day.day.maxtemp_c}°C / ${day.day.maxtemp_f}°F</p>
            <p>Min Temp: ${day.day.mintemp_c}°C / ${day.day.mintemp_f}°F</p>
            <p>Condition: ${day.day.condition.text}</p>
        `;
    });
    forecastDetails.innerHTML = forecastHTML;
}

// Display historical weather data
function displayHistorical(data) {
    const historicalDetails = document.getElementById('historicalDetails');
    historicalDetails.innerHTML = `
        <h2>Historical Weather on ${data.location.localtime}</h2>
        <p>Temperature: ${data.current.temp_c}°C</p>
        <p>Condition: ${data.current.condition.text}</p>
    `;
}

// Event listener for the button click
document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value;
    const unit = document.getElementById('unitSelect').value === 'metric' ? 'C' : 'F';
    if (location) {
        fetchWeather(location, unit);
        fetchForecast(location, unit);
        fetchHistorical(location);
    } else {
        alert('Please enter a location.');
    }
});

// Event listener for using current location
document.getElementById('getLocationBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`${latitude},${longitude}`);
            fetchForecast(`${latitude},${longitude}`);
        }, error => {
            alert('Unable to retrieve your location. Please enter it manually.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Theme toggling between light and dark mode
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.getElementById('themeIcon');
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');
});

// Display current date and time
function showDateTime() {
    const dateTimeElement = document.getElementById('currentDateTime');
    setInterval(() => {
        const now = new Date();
        dateTimeElement.textContent = now.toLocaleString();
    }, 1000);
}
showDateTime();

// Fetch weather data for multiple cities and display as cards
async function fetchWeatherForCities(cities) {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = ''; // Clear previous cards

    for (const city of cities) {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
            const data = await response.json();
            createWeatherCard(data);
        } catch (error) {
            console.error(`Error fetching weather data for ${city}:`, error);
        }
    }
}

// Create a weather card
function createWeatherCard(data) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="https:${data.current.condition.icon}" alt="Weather Icon">
        <p>${data.location.name}</p>
        <p>${data.current.temp_c}°C / ${data.current.temp_f}°F</p>
        <p>${data.current.condition.text}</p>
    `;
    document.getElementById('cardsContainer').appendChild(card);
}

// Predefined cities to show on the homepage
const cities = ['London', 'New York', 'Tokyo', 'Sydney', 'Paris'];
fetchWeatherForCities(cities);

// Display current weather data and location
function displayWeather(data) {
    const weatherDetails = document.getElementById('weatherDetails');
    const { lat, lon } = data.location; // Extract latitude and longitude from the data

    weatherDetails.innerHTML = `
        <h2>Current Weather in ${data.location.name}, ${data.location.country}</h2>
        <p>Temperature: ${data.current.temp_c}°C (${data.current.temp_f}°F)</p>
        <p>Condition: ${data.current.condition.text}</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p>Wind Speed: ${data.current.wind_kph} km/h</p>
        <p><strong>Location:</strong> Latitude: ${lat}, Longitude: ${lon}</p> <!-- Display location -->
    `;
}

// Default unit for temperature
const DEFAULT_UNIT = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit

// Event listener for the button click
document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value;
    if (location) {
        fetchWeather(location, DEFAULT_UNIT);  // Fetch weather data with default unit
        fetchForecast(location, DEFAULT_UNIT);
        fetchHistorical(location);
    } else {
        alert('Please enter a location.');
    }
});

// Use the default unit when fetching weather for the current location
document.getElementById('getLocationBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`${latitude},${longitude}`, DEFAULT_UNIT);
            fetchForecast(`${latitude},${longitude}`, DEFAULT_UNIT);
            initializeMap(latitude, longitude); // Initialize or update the map with current location
        }, error => {
            alert('Unable to retrieve your location. Please enter it manually.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});


let map; // Declare map variable globally

function initializeMap(lat, lon) {
    const mapContainer = document.getElementById('map');
    
    // Show the map container
    if (mapContainer.style.display === 'none') {
        mapContainer.style.display = 'block'; // Show the map container
        console.log('Map container is now visible');
    }

    // Initialize map if it doesn't exist
    if (!map) { 
        map = L.map('map').setView([lat, lon], 10); // Initialize map

        // Add Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        console.log('Map initialized');
    } else {
        map.setView([lat, lon], 10); // Update map view if already initialized
        console.log('Map view updated');
    }

    // Remove previous markers if any
    if (map.hasLayer(marker)) {
        map.removeLayer(marker);
    }

    // Add Marker to Map
    const marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`Location: Latitude ${lat}, Longitude ${lon}`)
        .openPopup();
    
    console.log('Marker added to map at: ', lat, lon);
}

// Display current weather data and location with map
function displayWeather(data) {
    const weatherDetails = document.getElementById('weatherDetails');
    const { lat, lon } = data.location; // Extract latitude and longitude from the data

    weatherDetails.innerHTML = `
        <h2>Current Weather in ${data.location.name}, ${data.location.country}</h2>
        <p>Temperature: ${data.current.temp_c}°C (${data.current.temp_f}°F)</p>
        <p>Condition: ${data.current.condition.text}</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p>Wind Speed: ${data.current.wind_kph} km/h</p>
        <p><strong>Location:</strong> Latitude: ${lat}, Longitude: ${lon}</p>
    `;

    initializeMap(lat, lon); // Initialize or update the map
}

// Event listener for the button click
document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value;
    const unit = document.getElementById('unitSelect').value === 'metric' ? 'C' : 'F';
    if (location) {
        fetchWeather(location, unit);  // Fetch weather data including location
        fetchForecast(location, unit);
        fetchHistorical(location);
    } else {
        alert('Please enter a location.');
    }
});

// Event listener for using current location
document.getElementById('getLocationBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`${latitude},${longitude}`);
            fetchForecast(`${latitude},${longitude}`);
            initializeMap(latitude, longitude); // Initialize or update the map with current location
        }, error => {
            alert('Unable to retrieve your location. Please enter it manually.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

