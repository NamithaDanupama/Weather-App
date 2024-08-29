// Define your Weather API key
const API_KEY = 'YOUR_API_KEY_HERE';

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
