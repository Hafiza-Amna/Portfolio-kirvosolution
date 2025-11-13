async function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    const loading = document.getElementById('loading');
    const weatherResult = document.getElementById('weatherResult');
    const error = document.getElementById('error');

    if (!city) {
        error.textContent = 'Please enter a city name';
        error.style.display = 'block';
        return;
    }

    loading.style.display = 'block';
    weatherResult.innerHTML = '';
    error.style.display = 'none';

    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            error.textContent = 'City not found!';
            error.style.display = 'block';
            loading.style.display = 'none';
            return;
        }

        const location = geoData.results[0];
        const { latitude, longitude, name, country } = location;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`
        );

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        const html = `
            <div class="weather-card">
                <h2>${name}, ${country}</h2>
                <div class="temperature">
                    <span class="temp-value">${Math.round(current.temperature_2m)}°C</span>
                </div>
                <div class="weather-details">
                    <p><strong>Humidity:</strong> ${current.relative_humidity_2m}%</p>
                    <p><strong>Wind Speed:</strong> ${current.wind_speed_10m} km/h</p>
                    <p><strong>Weather Code:</strong> ${current.weather_code}</p>
                </div>
            </div>
        `;

        weatherResult.innerHTML = html;
        loading.style.display = 'none';

    } catch (err) {
        error.textContent = 'Error fetching weather data. Please try again.';
        error.style.display = 'block';
        console.error(err);
    }

    loading.style.display = 'none';
}

// Load weather for a default city on page load
window.addEventListener('load', () => {
    document.getElementById('cityInput').value = 'London';
    searchWeather();
});